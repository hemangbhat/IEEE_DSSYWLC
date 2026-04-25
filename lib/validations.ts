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
