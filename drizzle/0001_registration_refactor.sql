DROP TABLE IF EXISTS "registrations";
--> statement-breakpoint
CREATE TABLE "registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_token" text NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"affiliation" text NOT NULL,
	"category" text NOT NULL,
	"referral_code" text,
	"is_member" boolean DEFAULT false NOT NULL,
	"ieee_id" text,
	"student_branch_code" text,
	"ieee_card_s3_key" text,
	"payment_screenshot_s3_key" text,
	"registration_status" text DEFAULT 'under_review' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "registrations_profile_token_unique" UNIQUE("profile_token"),
	CONSTRAINT "registrations_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "idx_profile_token" ON "registrations" USING btree ("profile_token");
--> statement-breakpoint
CREATE INDEX "idx_email" ON "registrations" USING btree ("email");
