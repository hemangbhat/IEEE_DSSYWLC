"use server";

import { randomBytes } from "crypto";
import { headers } from "next/headers";
import { inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { registrations } from "@/lib/db/schema";
import {
  sendBulkLeaderConfirmationEmail,
  sendBulkMemberConfirmationEmail,
} from "@/lib/email";
import { bulkRegistrationSchema } from "@/lib/validations";
import { REGISTRATIONS_CLOSED } from "@/lib/registration-status";
import { pushRegistrationToSheet } from "@/lib/google-sheets";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { isRateLimited } from "@/lib/rate-limit";
import {
  deleteS3Object,
  getS3ObjectMeta,
  isAllowedDocumentContentType,
  isAllowedImageContentType,
  MAX_UPLOAD_SIZE_BYTES,
} from "@/lib/s3";

// Bulk submits are heavier than single ones (up to 26 rows + emails + Sheets
// calls), so the throttle is tighter.
const BULK_RATE_LIMIT_MAX = 5;
const BULK_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

export type BulkRegisterState = {
  success: boolean;
  errors?: Record<string, string[]>;
  memberErrors?: Record<number, Record<string, string[]>>;
  message?: string;
  leaderProfileToken?: string;
};

async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return headerList.get("x-real-ip") || "unknown";
}

/**
 * Authoritatively verify an uploaded S3 object exists and is within the
 * size/type limits (the client can lie about both). Oversized / wrong-type
 * objects are deleted. Returns an error message, or null when valid.
 */
async function verifyUploadedFile(
  key: string,
  kind: "image" | "document",
  label: string,
): Promise<string | null> {
  const meta = await getS3ObjectMeta(key);
  if (!meta) {
    return `${label} upload was not found. Please re-upload and try again.`;
  }
  if (meta.contentLength > MAX_UPLOAD_SIZE_BYTES) {
    await deleteS3Object(key);
    return `${label} exceeds the 500KB size limit.`;
  }
  const typeOk =
    kind === "image"
      ? isAllowedImageContentType(meta.contentType)
      : isAllowedDocumentContentType(meta.contentType);
  if (!typeOk) {
    await deleteS3Object(key);
    return `${label} has an unsupported file type.`;
  }
  return null;
}

export async function submitBulkRegistration(
  _prevState: BulkRegisterState,
  formData: FormData,
): Promise<BulkRegisterState> {
  if (REGISTRATIONS_CLOSED) {
    return {
      success: false,
      message: "Registrations are now closed.",
    };
  }

  const clientIp = await getClientIp();

  // Throttle by IP (defence-in-depth; primary protection is the CAPTCHA below).
  if (
    clientIp !== "unknown" &&
    isRateLimited(
      "bulk-register",
      clientIp,
      BULK_RATE_LIMIT_MAX,
      BULK_RATE_LIMIT_WINDOW_MS,
    )
  ) {
    return {
      success: false,
      message:
        "Too many registration attempts. Please wait a few minutes and try again.",
    };
  }

  // Verify CAPTCHA before doing any DB/email/Sheets work.
  const turnstileToken = formData.get("cf-turnstile-response");
  const captchaOk = await verifyTurnstileToken(
    typeof turnstileToken === "string" ? turnstileToken : "",
    clientIp === "unknown" ? undefined : clientIp,
  );
  if (!captchaOk) {
    return {
      success: false,
      message:
        "CAPTCHA verification failed. Please complete the challenge and try again.",
    };
  }

  const rawPayload = formData.get("payload");
  if (typeof rawPayload !== "string") {
    return { success: false, message: "Invalid form submission." };
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawPayload);
  } catch {
    return { success: false, message: "Invalid form data." };
  }

  const parsed = bulkRegistrationSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      message: "Please fix the errors below.",
    };
  }

  const data = parsed.data;
  const now = new Date();
  const leaderEmail = data.leaderEmail.trim().toLowerCase();
  const leaderAffiliation = data.leaderAffiliation.trim();

  const allEmails = [
    leaderEmail,
    ...data.members.map((m) => m.email.trim().toLowerCase()),
  ];
  const allPhones = [
    data.leaderPhone.trim(),
    ...data.members.map((m) => m.phone.trim()),
  ];

  // Reject duplicates within the submitted team.
  if (new Set(allEmails).size !== allEmails.length) {
    return {
      success: false,
      message:
        "Duplicate email addresses found within the team. Each member must have a unique email.",
    };
  }
  if (new Set(allPhones).size !== allPhones.length) {
    return {
      success: false,
      message:
        "Duplicate phone numbers found within the team. Each member must have a unique phone number.",
    };
  }

  try {
    // Reject anyone already registered (nice message before the atomic insert).
    const existingEmails = await db
      .select({ email: registrations.email })
      .from(registrations)
      .where(inArray(registrations.email, allEmails));
    if (existingEmails.length > 0) {
      return {
        success: false,
        message:
          "One or more of these email addresses is already registered. Please remove already-registered members and try again.",
      };
    }

    const existingPhones = await db
      .select({ phone: registrations.phone })
      .from(registrations)
      .where(inArray(registrations.phone, allPhones));
    if (existingPhones.length > 0) {
      return {
        success: false,
        message:
          "One or more of these phone numbers is already registered. Please remove already-registered members and try again.",
      };
    }

    // ── Authoritatively verify all uploaded files exist & are valid ──
    const paymentKey = data.paymentScreenshotS3Key.trim();
    const paymentError = await verifyUploadedFile(
      paymentKey,
      "image",
      "Payment screenshot",
    );
    if (paymentError) {
      return {
        success: false,
        errors: { paymentScreenshotS3Key: [paymentError] },
        message: paymentError,
      };
    }

    if (data.leaderIsMember && data.leaderIeeeCardS3Key) {
      const err = await verifyUploadedFile(
        data.leaderIeeeCardS3Key.trim(),
        "document",
        "Team leader's IEEE membership card",
      );
      if (err) {
        return {
          success: false,
          errors: { leaderIeeeCardS3Key: [err] },
          message: err,
        };
      }
    }

    // Verify all member IEEE cards in parallel.
    const memberCardErrors = await Promise.all(
      data.members.map((member, i) => {
        if (member.isMember && member.ieeeCardS3Key) {
          return verifyUploadedFile(
            member.ieeeCardS3Key.trim(),
            "document",
            `Team member ${i + 1}'s IEEE membership card`,
          );
        }
        return Promise.resolve(null);
      }),
    );
    for (const err of memberCardErrors) {
      if (err) {
        return { success: false, message: err };
      }
    }

    // ── Build every row, then insert atomically via db.batch ──
    const leaderToken = randomBytes(32).toString("hex");
    const leaderValues = {
      profileToken: leaderToken,
      fullName: data.leaderFullName.trim(),
      email: leaderEmail,
      phone: data.leaderPhone.trim(),
      affiliation: leaderAffiliation,
      category: data.leaderCategory,
      referralCode: data.leaderReferralCode?.trim() || null,
      isMember: data.leaderIsMember,
      ieeeId: data.leaderIsMember ? data.leaderIeeeId?.trim() || null : null,
      studentBranchCode: data.leaderIsMember
        ? data.leaderStudentBranchCode?.trim() || null
        : null,
      ieeeCardS3Key: data.leaderIsMember
        ? data.leaderIeeeCardS3Key?.trim() || null
        : null,
      paymentScreenshotS3Key: paymentKey,
      registrationStatus: "under_review",
      updatedAt: now,
    };

    const memberRecords = data.members.map((member) => {
      const token = randomBytes(32).toString("hex");
      const email = member.email.trim().toLowerCase();
      return {
        token,
        email,
        name: member.fullName.trim(),
        values: {
          profileToken: token,
          fullName: member.fullName.trim(),
          email,
          phone: member.phone.trim(),
          affiliation: leaderAffiliation, // same college as leader
          category: member.category,
          referralCode: null,
          isMember: member.isMember,
          ieeeId: member.isMember ? member.ieeeId?.trim() || null : null,
          studentBranchCode: member.isMember
            ? member.studentBranchCode?.trim() || null
            : null,
          ieeeCardS3Key: member.isMember
            ? member.ieeeCardS3Key?.trim() || null
            : null,
          paymentScreenshotS3Key: paymentKey, // shared team payment
          registrationStatus: "under_review",
          updatedAt: now,
        },
      };
    });

    const leaderInsert = db.insert(registrations).values(leaderValues);
    const memberInserts = memberRecords.map((r) =>
      db.insert(registrations).values(r.values),
    );
    // Atomic: if any insert fails (e.g. a race trips a unique constraint),
    // the whole batch rolls back — no partial team is left behind.
    await db.batch(
      [leaderInsert, ...memberInserts] as [
        typeof leaderInsert,
        ...(typeof leaderInsert)[],
      ],
    );

    // ── Side effects (best-effort; run in parallel to handle up to 26 rows) ──
    const allRows = [
      { values: leaderValues, token: leaderToken },
      ...memberRecords.map((r) => ({ values: r.values, token: r.token })),
    ];

    // Push rows to Google Sheets sequentially with a small delay to avoid
    // rate-limit errors (rapid concurrent writes to the same sheet cause 429s).
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    for (const row of allRows) {
      try {
        await pushRegistrationToSheet({
          profileToken: row.token,
          fullName: row.values.fullName,
          email: row.values.email,
          phone: row.values.phone,
          affiliation: row.values.affiliation,
          category: row.values.category,
          referralCode: row.values.referralCode,
          isMember: row.values.isMember,
          ieeeId: row.values.ieeeId,
          studentBranchCode: row.values.studentBranchCode,
          ieeeCardS3Key: row.values.ieeeCardS3Key,
          paymentScreenshotS3Key: row.values.paymentScreenshotS3Key,
          registrationStatus: row.values.registrationStatus,
        });
      } catch (err) {
        console.error(`Sheet sync failed for ${row.values.email}:`, err);
      }
      await delay(300); // 300ms gap between writes to avoid Sheets API rate limits
    }

    const totalTeamSize = 1 + memberRecords.length;

    // Send all emails concurrently (leader + each member).
    const emailResults = await Promise.allSettled([
      sendBulkLeaderConfirmationEmail(
        leaderEmail,
        leaderValues.fullName,
        leaderToken,
        totalTeamSize,
      ),
      ...memberRecords.map((r) =>
        sendBulkMemberConfirmationEmail(
          r.email,
          r.name,
          r.token,
          leaderValues.fullName,
        ),
      ),
    ]);
    emailResults.forEach((result, i) => {
      if (result.status === "rejected") {
        const target = i === 0 ? "leader" : `member ${i}`;
        console.error(`Email failed for ${target}:`, result.reason);
      }
    });

    return {
      success: true,
      leaderProfileToken: leaderToken,
      message: `Team of ${totalTeamSize} registered successfully! Confirmation emails sent to all members.`,
    };
  } catch (error) {
    console.error("Bulk registration failed:", error);
    const message =
      error instanceof Error && /unique|duplicate/i.test(error.message)
        ? "One or more email addresses or phone numbers are already registered."
        : "An unexpected error occurred. Please try again.";
    return { success: false, message };
  }
}
