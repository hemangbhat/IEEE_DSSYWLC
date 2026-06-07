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

// Step 2: Membership details — base object shape (no cross-field rule).
// Kept separate so both `step2Schema` and `registrationSubmissionSchema` can
// reuse the same shape AND the same refinement. Refining on a ZodObject turns
// it into a ZodEffects, and `.merge()` only carries the object shape (not the
// effect), so merging a pre-refined schema would silently drop the rule.
const step2BaseSchema = z.object({
  category: z.enum(registrationCategories, {
    message: "Please select a valid category",
  }),
  referralCode: z.string().max(50).optional().or(z.literal("")),
  isMember: z.boolean().default(false),
  ieeeId: z.string().max(20).optional().or(z.literal("")),
  studentBranchCode: z.string().max(50).optional().or(z.literal("")),
  ieeeCardS3Key: z.string().optional().or(z.literal("")),
});

// Single source of truth for the "IEEE members must supply ID + card" rule.
// Returns the cross-field issues; applied via superRefine wherever needed so
// the rule can never drift between the step schema and the merged schema.
function membershipIssues(data: {
  isMember?: boolean;
  ieeeId?: string;
  ieeeCardS3Key?: string;
}): Array<{ path: string; message: string }> {
  const issues: Array<{ path: string; message: string }> = [];
  if (data.isMember) {
    if (!data.ieeeId || data.ieeeId.trim() === "") {
      issues.push({
        path: "ieeeId",
        message: "IEEE Membership ID is required for IEEE members",
      });
    }
    if (!data.ieeeCardS3Key || data.ieeeCardS3Key.trim() === "") {
      issues.push({
        path: "ieeeCardS3Key",
        message: "IEEE Membership ID card upload is required for IEEE members",
      });
    }
  }
  return issues;
}

export const step2Schema = step2BaseSchema.superRefine((data, ctx) => {
  for (const { path, message } of membershipIssues(data)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message, path: [path] });
  }
});

// Step 3: Payment details
export const step3Schema = z.object({
  paymentScreenshotS3Key: z.string().min(1, "Payment screenshot is required"),
});

// Merge the base shapes (so .merge carries every field) and re-apply the
// membership rule on the result, so the submission schema is genuinely
// equivalent to step1 + step2 + step3 — cross-field rule included.
export const registrationSubmissionSchema = step1Schema
  .merge(step2BaseSchema)
  .merge(step3Schema)
  .superRefine((data, ctx) => {
    for (const { path, message } of membershipIssues(data)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message, path: [path] });
    }
  });

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type RegistrationSubmissionData = z.infer<typeof registrationSubmissionSchema>;

// ──── Bulk / Team Registration ────

/** Schema for a single team member (entered by the team leader). */
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
  // Reuse the single-source-of-truth membership rule (see membershipIssues).
  .superRefine((data, ctx) => {
    for (const { path, message } of membershipIssues(data)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message, path: [path] });
    }
  });

/** Full bulk registration payload sent to the server action. */
export const bulkRegistrationSchema = z
  .object({
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
  })
  // Enforce the membership rule for the LEADER too (the member rule lives on
  // bulkMemberSchema). Without this the leader's IEEE fields would only be
  // checked client-side.
  .superRefine((data, ctx) => {
    for (const { path, message } of membershipIssues({
      isMember: data.leaderIsMember,
      ieeeId: data.leaderIeeeId,
      ieeeCardS3Key: data.leaderIeeeCardS3Key,
    })) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: [`leader${path.charAt(0).toUpperCase()}${path.slice(1)}`],
      });
    }
  });

export type BulkMemberFormData = z.infer<typeof bulkMemberSchema>;
export type BulkRegistrationData = z.infer<typeof bulkRegistrationSchema>;
