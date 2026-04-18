"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { registrations } from "@/lib/db/schema";
import { registrationSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";

export type RegisterState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  // 1. Verify authentication
  const { userId } = await auth();
  if (!userId) {
    return { success: false, message: "You must be signed in to register." };
  }

  // 2. Extract and validate form data
  const rawData = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    affiliation: formData.get("affiliation") as string,
    ieeeId: formData.get("ieeeId") as string,
    isMember: formData.get("isMember") === "true",
    category: formData.get("category") as string,
    dietaryPreference: formData.get("dietaryPreference") as string,
    tshirtSize: formData.get("tshirtSize") as string,
  };

  const parsed = registrationSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      message: "Please fix the errors below.",
    };
  }

  // 3. Upsert — insert or update if user already registered
  try {
    const existing = await db
      .select({ id: registrations.id })
      .from(registrations)
      .where(eq(registrations.clerkUserId, userId))
      .limit(1);

    if (existing.length > 0) {
      // Update existing registration
      await db
        .update(registrations)
        .set({
          ...parsed.data,
          ieeeId: parsed.data.ieeeId || null,
          dietaryPreference: parsed.data.dietaryPreference || null,
          tshirtSize: parsed.data.tshirtSize || null,
          updatedAt: new Date(),
        })
        .where(eq(registrations.clerkUserId, userId));

      return { success: true, message: "Registration updated successfully!" };
    } else {
      // Insert new registration
      await db.insert(registrations).values({
        clerkUserId: userId,
        ...parsed.data,
        ieeeId: parsed.data.ieeeId || null,
        dietaryPreference: parsed.data.dietaryPreference || null,
        tshirtSize: parsed.data.tshirtSize || null,
      });

      return { success: true, message: "Registration completed successfully!" };
    }
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

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
