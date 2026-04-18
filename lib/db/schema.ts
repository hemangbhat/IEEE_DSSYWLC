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
    ieeeId: text("ieee_id"),
    isMember: boolean("is_member").notNull().default(false),
    category: text("category").notNull(), // student | professional | faculty
    dietaryPreference: text("dietary_preference"),
    tshirtSize: text("tshirt_size"),
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
