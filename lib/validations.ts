import { z } from "zod";

export const registrationCategories = [
  "student_member",
  "graduate_student_member",
  "professional_member",
  "faculty_member",
] as const;

// Step 1: Personal info
export const step1Schema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  affiliation: z
    .string()
    .min(2, "Affiliation must be at least 2 characters")
    .max(200, "Affiliation must be at most 200 characters"),
});

// Step 2: Membership details
export const step2Schema = z
  .object({
    category: z.enum(registrationCategories, {
      message: "Please select a valid category",
    }),
    referralCode: z.string().max(50).optional().or(z.literal("")),
    isMember: z.boolean().default(false),
    ieeeId: z.string().max(20).optional().or(z.literal("")),
    studentBranchCode: z.string().max(50).optional().or(z.literal("")),
    ieeeCardS3Key: z.string().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.isMember) {
      if (!data.ieeeId || data.ieeeId.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "IEEE Membership ID is required for IEEE members",
          path: ["ieeeId"],
        });
      }
      if (!data.ieeeCardS3Key || data.ieeeCardS3Key.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "IEEE Membership ID card upload is required for IEEE members",
          path: ["ieeeCardS3Key"],
        });
      }
    }
  });

// Step 3: Payment details
export const step3Schema = z.object({
  paymentScreenshotS3Key: z.string().min(1, "Payment screenshot is required"),
});

export const registrationSubmissionSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema);

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type RegistrationSubmissionData = z.infer<typeof registrationSubmissionSchema>;

// ──── Bulk / Team Registration ────

/** Schema for a single team member (filled by the team leader). */
export const bulkMemberSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must be at most 100 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be at most 15 digits"),
    category: z.enum(registrationCategories, {
      message: "Please select a valid category",
    }),
    isMember: z.boolean().default(false),
    ieeeId: z.string().max(20).optional().or(z.literal("")),
    studentBranchCode: z.string().max(50).optional().or(z.literal("")),
    ieeeCardS3Key: z.string().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.isMember) {
      if (!data.ieeeId || data.ieeeId.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "IEEE Membership ID is required for IEEE members",
          path: ["ieeeId"],
        });
      }
      if (!data.ieeeCardS3Key || data.ieeeCardS3Key.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "IEEE Membership ID card upload is required for IEEE members",
          path: ["ieeeCardS3Key"],
        });
      }
    }
  });

/** Full bulk registration payload sent to the server action. */
export const bulkRegistrationSchema = z.object({
  // Leader personal info
  leaderFullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters"),
  leaderEmail: z.string().email("Please enter a valid email address"),
  leaderPhone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  leaderAffiliation: z
    .string()
    .min(2, "Affiliation must be at least 2 characters")
    .max(200, "Affiliation must be at most 200 characters"),
  // Leader membership
  leaderCategory: z.enum(registrationCategories, {
    message: "Please select a valid category",
  }),
  leaderReferralCode: z.string().max(50).optional().or(z.literal("")),
  leaderIsMember: z.boolean().default(false),
  leaderIeeeId: z.string().max(20).optional().or(z.literal("")),
  leaderStudentBranchCode: z.string().max(50).optional().or(z.literal("")),
  leaderIeeeCardS3Key: z.string().optional().or(z.literal("")),
  // Team members (2–10)
  members: z
    .array(bulkMemberSchema)
    .min(2, "At least 2 team members are required")
    .max(10, "Maximum 10 team members allowed"),
  // Single payment for the whole team
  paymentScreenshotS3Key: z.string().min(1, "Payment screenshot is required"),
});

export type BulkMemberFormData = z.infer<typeof bulkMemberSchema>;
export type BulkRegistrationData = z.infer<typeof bulkRegistrationSchema>;
