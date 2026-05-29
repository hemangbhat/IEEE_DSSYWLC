/**
 * Applies the "phone must be unique" change to the database.
 *
 * Why not `drizzle-kit migrate`? On Windows the Neon serverless driver can
 * hang during migrate. This script uses the same HTTP connection the app
 * uses (which works reliably) and applies the single change safely:
 *   1. Checks for duplicate phone numbers first — if any exist, it stops and
 *      lists them WITHOUT changing anything.
 *   2. If there are none, it adds the unique constraint.
 *
 * Run:  node scripts/apply-phone-unique.mjs
 */

import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log("Checking for duplicate phone numbers...");
  const dups = await sql`
    SELECT phone, count(*)::int AS count
    FROM registrations
    GROUP BY phone
    HAVING count(*) > 1
    ORDER BY count DESC
  `;

  if (dups.length > 0) {
    console.log("\n⚠  Cannot apply the change — these phone numbers appear more than once:\n");
    for (const row of dups) {
      console.log(`   ${row.phone}  (used ${row.count} times)`);
    }
    console.log(
      "\nNothing was changed. Clean up the duplicates above, then run this script again.",
    );
    process.exit(1);
  }

  console.log("No duplicates found. Adding the unique constraint...");
  try {
    await sql`
      ALTER TABLE "registrations"
      ADD CONSTRAINT "registrations_phone_unique" UNIQUE ("phone")
    `;
    console.log("\n✓ Done. Phone numbers are now required to be unique.");
  } catch (err) {
    if (String(err.message).includes("already exists")) {
      console.log("\n✓ The unique constraint was already in place — nothing to do.");
      return;
    }
    throw err;
  }
}

main().catch((err) => {
  console.error("\n✗ Failed:", err.message);
  process.exit(1);
});
