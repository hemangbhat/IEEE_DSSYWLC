"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { registrations } from "@/lib/db/schema";
import { registrationSchema, paymentSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";

export type RegisterState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

// ─── Helper: save base64 file data to a URL-safe reference ───
// In production, replace with S3/Cloudinary upload.
// For now, store the base64 data URI directly in the DB.
function storeFileData(base64Data: string): string | null {
  if (!base64Data || base64Data.trim() === "") return null;
  return base64Data;
}

// ─── Step 1: Save registration details ───
export async function registerUser(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, message: "You must be signed in to register." };
  }

  const rawData = {
    fullName: (formData.get("fullName") as string) ?? "",
    email: (formData.get("email") as string) ?? "",
    phone: (formData.get("phone") as string) ?? "",
    affiliation: (formData.get("affiliation") as string) ?? "",
    category: (formData.get("category") as string) ?? "",
    referralCode: (formData.get("referralCode") as string) ?? "",
    isMember: formData.get("isMember") === "true",
    ieeeId: (formData.get("ieeeId") as string) ?? "",
    studentBranchCode: (formData.get("studentBranchCode") as string) ?? "",
    ieeeCardData: (formData.get("ieeeCardData") as string) ?? "",
  };

  const parsed = registrationSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      message: "Please fix the errors below.",
    };
  }

  try {
    const existing = await db
      .select({ id: registrations.id })
      .from(registrations)
      .where(eq(registrations.clerkUserId, userId))
      .limit(1);

    const dbValues = {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      affiliation: parsed.data.affiliation,
      category: parsed.data.category,
      referralCode: parsed.data.referralCode || null,
      isMember: parsed.data.isMember,
      ieeeId: parsed.data.ieeeId || null,
      studentBranchCode: parsed.data.studentBranchCode || null,
      ieeeCardUrl: storeFileData(parsed.data.ieeeCardData ?? ""),
      updatedAt: new Date(),
    };

    if (existing.length > 0) {
      await db
        .update(registrations)
        .set(dbValues)
        .where(eq(registrations.clerkUserId, userId));
    } else {
      await db.insert(registrations).values({
        clerkUserId: userId,
        ...dbValues,
      });
    }

    return { success: true, message: "Registration saved successfully!" };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

// ─── Step 2: Save payment screenshot ───
export async function submitPayment(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, message: "You must be signed in." };
  }

  const rawData = {
    paymentScreenshotData: formData.get("paymentScreenshotData") as string,
  };

  const parsed = paymentSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      message: "Please upload a payment screenshot.",
    };
  }

  try {
    const existing = await db
      .select({ id: registrations.id })
      .from(registrations)
      .where(eq(registrations.clerkUserId, userId))
      .limit(1);

    if (existing.length === 0) {
      return {
        success: false,
        message: "Please complete Step 1 (registration) first.",
      };
    }

    await db
      .update(registrations)
      .set({
        paymentScreenshotUrl: storeFileData(parsed.data.paymentScreenshotData),
        registrationStatus: "payment_submitted",
        updatedAt: new Date(),
      })
      .where(eq(registrations.clerkUserId, userId));

    return { success: true, message: "Payment submitted successfully!" };
  } catch (error) {
    console.error("Payment error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

// ─── Fetch existing registration ───
export async function getExistingRegistration() {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await db
    .select()
    .from(registrations)
    .where(eq(registrations.clerkUserId, userId))
    .limit(1);

  return existing[0] ?? null;
}
