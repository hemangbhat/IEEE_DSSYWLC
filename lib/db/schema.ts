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
    clerkUserId: text("clerk_user_id").notNull().unique(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    affiliation: text("affiliation").notNull(),
    category: text("category").notNull(), // student_member | graduate_student_member | professional_member | faculty_member
    referralCode: text("referral_code"),
    // IEEE member fields
    isMember: boolean("is_member").notNull().default(false),
    ieeeId: text("ieee_id"),
    studentBranchCode: text("student_branch_code"),
    ieeeCardUrl: text("ieee_card_url"),
    // Payment fields
    paymentScreenshotUrl: text("payment_screenshot_url"),
    registrationStatus: text("registration_status").notNull().default("pending"), // pending | payment_submitted | verified | rejected
    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_clerk_user_id").on(table.clerkUserId),
    index("idx_email").on(table.email),
  ]
);

export type Registration = typeof registrations.$inferSelect;
export type NewRegistration = typeof registrations.$inferInsert;
