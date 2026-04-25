"use server";

import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { registrations } from "@/lib/db/schema";
import { sendConfirmationEmail } from "@/lib/email";
import { step1Schema, step2Schema, step3Schema } from "@/lib/validations";

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
  formData: FormData
): Promise<RegisterState> {
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
        step3Parsed.success ? {} : step3Parsed.error.flatten().fieldErrors
      ),
      message: "Please fix the errors below.",
    };
  }

  const now = new Date();
  const normalizedEmail = step1Parsed.data.email.trim().toLowerCase();

  try {
    const existing = await db
      .select({ profileToken: registrations.profileToken })
      .from(registrations)
      .where(eq(registrations.email, normalizedEmail))
      .limit(1);

    const profileToken =
      existing[0]?.profileToken ?? randomBytes(32).toString("hex");

    const values = {
      profileToken,
      fullName: step1Parsed.data.fullName.trim(),
      email: normalizedEmail,
      phone: step1Parsed.data.phone.trim(),
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

    await db
      .insert(registrations)
      .values(values)
      .onConflictDoUpdate({
        target: registrations.email,
        set: values,
      });

    const emailSent = await sendConfirmationEmail(
      normalizedEmail,
      values.fullName,
      profileToken
    );

    return {
      success: true,
      profileToken,
      message: emailSent
        ? "Registration submitted successfully."
        : "Registration submitted successfully. Confirmation email is currently unavailable.",
    };
  } catch (error) {
    console.error("Registration submission failed:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
