"use server";

import { randomBytes } from "crypto";
import { eq, or, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { registrations } from "@/lib/db/schema";
import {
  sendBulkLeaderConfirmationEmail,
  sendBulkMemberConfirmationEmail,
} from "@/lib/email";
import { bulkRegistrationSchema } from "@/lib/validations";
import { pushRegistrationToSheet } from "@/lib/google-sheets";

export type BulkRegisterState = {
  success: boolean;
  errors?: Record<string, string[]>;
  memberErrors?: Record<number, Record<string, string[]>>;
  message?: string;
  leaderProfileToken?: string;
};

export async function submitBulkRegistration(
  _prevState: BulkRegisterState,
  formData: FormData,
): Promise<BulkRegisterState> {
  // Parse the JSON payload from the hidden input
  const rawPayload = formData.get("payload");
  if (typeof rawPayload !== "string") {
    return {
      success: false,
      message: "Invalid form submission.",
    };
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawPayload);
  } catch {
    return {
      success: false,
      message: "Invalid form data.",
    };
  }

  const parsed = bulkRegistrationSchema.safeParse(payload);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      success: false,
      errors: flat.fieldErrors as Record<string, string[]>,
      message: "Please fix the errors below.",
    };
  }

  const data = parsed.data;
  const now = new Date();
  const leaderEmail = data.leaderEmail.trim().toLowerCase();

  // Collect all emails to check for duplicates
  const allEmails = [leaderEmail, ...data.members.map((m) => m.email.trim().toLowerCase())];
  const allPhones = [data.leaderPhone.trim(), ...data.members.map((m) => m.phone.trim())];

  // Check for duplicates within the submitted team
  const uniqueEmails = new Set(allEmails);
  if (uniqueEmails.size !== allEmails.length) {
    return {
      success: false,
      message: "Duplicate email addresses found within the team. Each member must have a unique email.",
    };
  }

  const uniquePhones = new Set(allPhones);
  if (uniquePhones.size !== allPhones.length) {
    return {
      success: false,
      message: "Duplicate phone numbers found within the team. Each member must have a unique phone number.",
    };
  }

  try {
    // Check all emails against DB
    const existingEmails = await db
      .select({ email: registrations.email })
      .from(registrations)
      .where(inArray(registrations.email, allEmails));

    if (existingEmails.length > 0) {
      const taken = existingEmails.map((r) => r.email).join(", ");
      return {
        success: false,
        message: `These email addresses are already registered: ${taken}`,
      };
    }

    // Check all phones against DB
    const existingPhones = await db
      .select({ phone: registrations.phone })
      .from(registrations)
      .where(inArray(registrations.phone, allPhones));

    if (existingPhones.length > 0) {
      const taken = existingPhones.map((r) => r.phone).join(", ");
      return {
        success: false,
        message: `These phone numbers are already registered: ${taken}`,
      };
    }

    // ── Insert Leader ──
    const leaderToken = randomBytes(32).toString("hex");
    const leaderValues = {
      profileToken: leaderToken,
      fullName: data.leaderFullName.trim(),
      email: leaderEmail,
      phone: data.leaderPhone.trim(),
      affiliation: data.leaderAffiliation.trim(),
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
      paymentScreenshotS3Key: data.paymentScreenshotS3Key.trim(),
      registrationStatus: "under_review",
      updatedAt: now,
    };

    await db.insert(registrations).values(leaderValues);

    // Push leader to sheet
    try {
      await pushRegistrationToSheet({
        profileToken: leaderToken,
        fullName: leaderValues.fullName,
        email: leaderValues.email,
        phone: leaderValues.phone,
        affiliation: leaderValues.affiliation,
        category: leaderValues.category,
        referralCode: leaderValues.referralCode,
        isMember: leaderValues.isMember,
        ieeeId: leaderValues.ieeeId,
        studentBranchCode: leaderValues.studentBranchCode,
        ieeeCardS3Key: leaderValues.ieeeCardS3Key,
        paymentScreenshotS3Key: leaderValues.paymentScreenshotS3Key,
        registrationStatus: leaderValues.registrationStatus,
      });
    } catch (err) {
      console.error("Sheet sync failed for leader:", err);
    }

    // ── Insert Each Member ──
    const memberTokens: { email: string; name: string; token: string }[] = [];

    for (const member of data.members) {
      const memberToken = randomBytes(32).toString("hex");
      const memberEmail = member.email.trim().toLowerCase();
      const memberValues = {
        profileToken: memberToken,
        fullName: member.fullName.trim(),
        email: memberEmail,
        phone: member.phone.trim(),
        affiliation: data.leaderAffiliation.trim(), // same college as leader
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
        paymentScreenshotS3Key: data.paymentScreenshotS3Key.trim(), // same screenshot
        registrationStatus: "under_review",
        updatedAt: now,
      };

      await db.insert(registrations).values(memberValues);

      memberTokens.push({
        email: memberEmail,
        name: member.fullName.trim(),
        token: memberToken,
      });

      // Push member to sheet
      try {
        await pushRegistrationToSheet({
          profileToken: memberToken,
          fullName: memberValues.fullName,
          email: memberValues.email,
          phone: memberValues.phone,
          affiliation: memberValues.affiliation,
          category: memberValues.category,
          referralCode: memberValues.referralCode,
          isMember: memberValues.isMember,
          ieeeId: memberValues.ieeeId,
          studentBranchCode: memberValues.studentBranchCode,
          ieeeCardS3Key: memberValues.ieeeCardS3Key,
          paymentScreenshotS3Key: memberValues.paymentScreenshotS3Key,
          registrationStatus: memberValues.registrationStatus,
        });
      } catch (err) {
        console.error(`Sheet sync failed for member ${memberEmail}:`, err);
      }
    }

    // ── Send Emails ──
    const totalTeamSize = 1 + data.members.length;

    // Leader email
    try {
      await sendBulkLeaderConfirmationEmail(
        leaderEmail,
        leaderValues.fullName,
        leaderToken,
        totalTeamSize,
      );
    } catch (err) {
      console.error("Leader email failed:", err);
    }

    // Member emails
    for (const mt of memberTokens) {
      try {
        await sendBulkMemberConfirmationEmail(
          mt.email,
          mt.name,
          mt.token,
          leaderValues.fullName,
        );
      } catch (err) {
        console.error(`Member email failed for ${mt.email}:`, err);
      }
    }

    return {
      success: true,
      leaderProfileToken: leaderToken,
      message: `Team of ${totalTeamSize} registered successfully! Confirmation emails sent to all members.`,
    };
  } catch (error) {
    console.error("Bulk registration failed:", error);

    // Handle unique constraint violations
    const errorMessage =
      error instanceof Error && error.message.includes("unique")
        ? "One or more email addresses or phone numbers are already registered."
        : "An unexpected error occurred. Please try again.";

    return {
      success: false,
      message: errorMessage,
    };
  }
}
