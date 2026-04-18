import { z } from "zod";

// Step 1: Registration details
export const registrationSchema = z
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
    affiliation: z
      .string()
      .min(2, "Affiliation must be at least 2 characters")
      .max(200, "Affiliation must be at most 200 characters"),
    category: z.enum(
      [
        "student_member",
        "graduate_student_member",
        "professional_member",
        "faculty_member",
      ],
      { message: "Please select a valid category" }
    ),
    referralCode: z.string().max(50).optional().or(z.literal("")),
    isMember: z.boolean().default(false),
    ieeeId: z.string().max(20).optional().or(z.literal("")),
    studentBranchCode: z.string().max(50).optional().or(z.literal("")),
    ieeeCardData: z.string().optional().or(z.literal("")), // base64 data URI
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
      if (!data.ieeeCardData || data.ieeeCardData.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "IEEE Membership ID card upload is required for IEEE members",
          path: ["ieeeCardData"],
        });
      }
    }
  });

// Step 2: Payment details
export const paymentSchema = z.object({
  paymentScreenshotData: z
    .string()
    .min(1, "Payment screenshot is required"),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
