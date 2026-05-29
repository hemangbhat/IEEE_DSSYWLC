"use server";

import { randomBytes } from "crypto";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { registrations } from "@/lib/db/schema";
import { sendConfirmationEmail } from "@/lib/email";
import { step1Schema, step2Schema, step3Schema } from "@/lib/validations";
import { pushRegistrationToSheet } from "@/lib/google-sheets";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { isRateLimited } from "@/lib/rate-limit";

// Registration throttle: max submissions allowed per IP within the window.
const REGISTER_RATE_LIMIT_MAX = 5;
const REGISTER_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return headerList.get("x-real-ip") || "unknown";
}

export type RegisterState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
  profileToken?: string;
};

function mergeFieldErrors(
  ...sources: Array<Record<string, string[] | undefined>>
): Record<string, string[]> {
  const merged: Record<string, string[]> = {};

  for (const source of sources) {
    for (const [field, values] of Object.entries(source)) {
      if (!values || values.length === 0) {
        continue;
      }
      merged[field] = values;
    }
  }

  return merged;
}

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function submitRegistration(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const clientIp = await getClientIp();

  // Throttle by IP (defence-in-depth; primary protection is the CAPTCHA below).
  if (
    clientIp !== "unknown" &&
    isRateLimited(
      "register",
      clientIp,
      REGISTER_RATE_LIMIT_MAX,
      REGISTER_RATE_LIMIT_WINDOW_MS,
    )
  ) {
    return {
      success: false,
      message:
        "Too many registration attempts. Please wait a few minutes and try again.",
    };
  }

  // Verify CAPTCHA before doing any DB/email/Sheets work.
  // No-op when Turnstile is not configured (site behaves as before).
  const turnstileToken = readString(formData, "cf-turnstile-response");
  const captchaOk = await verifyTurnstileToken(
    turnstileToken,
    clientIp === "unknown" ? undefined : clientIp,
  );
  if (!captchaOk) {
    return {
      success: false,
      message:
        "CAPTCHA verification failed. Please complete the challenge and try again.",
    };
  }

  const step1Input = {
    fullName: readString(formData, "fullName"),
    email: readString(formData, "email"),
    phone: readString(formData, "phone"),
    affiliation: readString(formData, "affiliation"),
  };

  const step2Input = {
    category: readString(formData, "category"),
    referralCode: readString(formData, "referralCode"),
    isMember: readString(formData, "isMember") === "true",
    ieeeId: readString(formData, "ieeeId"),
    studentBranchCode: readString(formData, "studentBranchCode"),
    ieeeCardS3Key: readString(formData, "ieeeCardS3Key"),
  };

  const step3Input = {
    paymentScreenshotS3Key: readString(formData, "paymentScreenshotS3Key"),
  };

  const step1Parsed = step1Schema.safeParse(step1Input);
  const step2Parsed = step2Schema.safeParse(step2Input);
  const step3Parsed = step3Schema.safeParse(step3Input);

  if (!step1Parsed.success || !step2Parsed.success || !step3Parsed.success) {
    return {
      success: false,
      errors: mergeFieldErrors(
        step1Parsed.success ? {} : step1Parsed.error.flatten().fieldErrors,
        step2Parsed.success ? {} : step2Parsed.error.flatten().fieldErrors,
        step3Parsed.success ? {} : step3Parsed.error.flatten().fieldErrors,
      ),
      message: "Please fix the errors below.",
    };
  }

  const now = new Date();
  const normalizedEmail = step1Parsed.data.email.trim().toLowerCase();
  const normalizedPhone = step1Parsed.data.phone.trim();

  try {
    // Check if email already exists
    const existingEmail = await db
      .select({ id: registrations.id })
      .from(registrations)
      .where(eq(registrations.email, normalizedEmail))
      .limit(1);

    if (existingEmail.length > 0) {
      return {
        success: false,
        errors: {
          email: ["This email address is already registered."],
        },
        message: "This email address is already registered.",
      };
    }

    // Check if phone number already exists
    const existingPhone = await db
      .select({ id: registrations.id })
      .from(registrations)
      .where(eq(registrations.phone, normalizedPhone))
      .limit(1);

    if (existingPhone.length > 0) {
      return {
        success: false,
        errors: {
          phone: ["This phone number is already registered."],
        },
        message: "This phone number is already registered.",
      };
    }

    const profileToken = randomBytes(32).toString("hex");

    const values = {
      profileToken,
      fullName: step1Parsed.data.fullName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      affiliation: step1Parsed.data.affiliation.trim(),
      category: step2Parsed.data.category,
      referralCode: step2Parsed.data.referralCode?.trim() || null,
      isMember: step2Parsed.data.isMember,
      ieeeId: step2Parsed.data.isMember
        ? step2Parsed.data.ieeeId?.trim() || null
        : null,
      studentBranchCode: step2Parsed.data.isMember
        ? step2Parsed.data.studentBranchCode?.trim() || null
        : null,
      ieeeCardS3Key: step2Parsed.data.isMember
        ? step2Parsed.data.ieeeCardS3Key?.trim() || null
        : null,
      paymentScreenshotS3Key: step3Parsed.data.paymentScreenshotS3Key.trim(),
      registrationStatus: "under_review",
      updatedAt: now,
    };

    await db.insert(registrations).values(values);

    const emailSent = await sendConfirmationEmail(
      normalizedEmail,
      values.fullName,
      profileToken,
    );

    // Push to Google Sheet (await to prevent serverless function from freezing before request completes)
    try {
      await pushRegistrationToSheet({
        profileToken,
        fullName: values.fullName,
        email: normalizedEmail,
        phone: values.phone,
        affiliation: values.affiliation,
        category: values.category,
        referralCode: values.referralCode,
        isMember: values.isMember,
        ieeeId: values.ieeeId,
        studentBranchCode: values.studentBranchCode,
        ieeeCardS3Key: values.ieeeCardS3Key,
        paymentScreenshotS3Key: values.paymentScreenshotS3Key,
        registrationStatus: values.registrationStatus,
      });
    } catch (err) {
      console.error("Sheet sync failed:", err);
    }

    return {
      success: true,
      profileToken,
      message: emailSent
        ? "Registration submitted successfully! A confirmation and status updates will be sent to your registered email address."
        : "Registration submitted successfully! Status updates will be sent to your registered email address.",
    };
  } catch (error) {
    console.error("Registration submission failed:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
