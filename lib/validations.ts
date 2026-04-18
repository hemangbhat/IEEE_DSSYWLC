import { z } from "zod";

export const registrationSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters"),
  email: z
    .string()
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  affiliation: z
    .string()
    .min(2, "Affiliation must be at least 2 characters")
    .max(200, "Affiliation must be at most 200 characters"),
  ieeeId: z
    .string()
    .max(20, "IEEE ID must be at most 20 characters")
    .optional()
    .or(z.literal("")),
  isMember: z.boolean().default(false),
  category: z.enum(["student", "professional", "faculty"], {
    message: "Please select a valid category",
  }),
  dietaryPreference: z
    .string()
    .max(100)
    .optional()
    .or(z.literal("")),
  tshirtSize: z
    .enum(["S", "M", "L", "XL", "XXL"])
    .optional()
    .or(z.literal("")),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
