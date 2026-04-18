CREATE TABLE "registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_user_id" text NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"affiliation" text NOT NULL,
	"category" text NOT NULL,
	"referral_code" text,
	"is_member" boolean DEFAULT false NOT NULL,
	"ieee_id" text,
	"student_branch_code" text,
	"ieee_card_url" text,
	"payment_screenshot_url" text,
	"registration_status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "registrations_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
CREATE INDEX "idx_clerk_user_id" ON "registrations" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "idx_email" ON "registrations" USING btree ("email");