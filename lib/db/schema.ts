import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const registrations = pgTable(
  "registrations",
  {
    id: serial("id").primaryKey(),
    profileToken: text("profile_token").notNull().unique(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull().unique(),
    phone: text("phone").notNull(),
    affiliation: text("affiliation").notNull(),
    category: text("category").notNull(), // student_member | graduate_student_member | professional_member | faculty_member
    referralCode: text("referral_code"),
    // IEEE member fields
    isMember: boolean("is_member").notNull().default(false),
    ieeeId: text("ieee_id"),
    studentBranchCode: text("student_branch_code"),
    ieeeCardS3Key: text("ieee_card_s3_key"),
    // Payment fields
    paymentScreenshotS3Key: text("payment_screenshot_s3_key"),
    registrationStatus: text("registration_status")
      .notNull()
      .default("under_review"), // under_review | verified | rejected
    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_profile_token").on(table.profileToken),
    index("idx_email").on(table.email),
  ]
);

export type Registration = typeof registrations.$inferSelect;
export type NewRegistration = typeof registrations.$inferInsert;
