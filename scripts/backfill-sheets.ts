/**
 * One-time backfill script — finds all registrations in Neon that are missing
 * from Google Sheets (by comparing emails) and pushes them in.
 *
 * Run with:
 *   npx tsx scripts/backfill-sheets.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { google } from "googleapis";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { registrations } from "../lib/db/schema";
import { pushRegistrationToSheet } from "../lib/google-sheets";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function getSheetEmails(): Promise<Set<string>> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!email || !key || !sheetId) {
    throw new Error("Missing Google Sheets env vars");
  }

  const auth = new google.auth.JWT({
    email,
    key: key.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Sheet1!C:C", // Email column
  });

  const emails = new Set<string>();
  for (const row of res.data.values ?? []) {
    if (row[0]) emails.add(row[0].toString().trim().toLowerCase());
  }
  return emails;
}

async function main() {
  console.log("Fetching all registrations from Neon...");
  const allRows = await db.select().from(registrations);
  console.log(`Total in Neon: ${allRows.length}`);

  console.log("Fetching emails already in Google Sheet...");
  const sheetEmails = await getSheetEmails();
  console.log(`Total in Sheet: ${sheetEmails.size}`);

  const missing = allRows.filter(
    (r) => !sheetEmails.has(r.email.trim().toLowerCase())
  );
  console.log(`Missing from Sheet: ${missing.length}`);

  if (missing.length === 0) {
    console.log("Nothing to backfill. Sheet is up to date.");
    return;
  }

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  for (let i = 0; i < missing.length; i++) {
    const r = missing[i]!;
    console.log(`[${i + 1}/${missing.length}] Pushing ${r.email}...`);
    try {
      await pushRegistrationToSheet({
        profileToken: r.profileToken,
        fullName: r.fullName,
        email: r.email,
        phone: r.phone,
        affiliation: r.affiliation,
        category: r.category,
        referralCode: r.referralCode,
        isMember: r.isMember,
        ieeeId: r.ieeeId,
        studentBranchCode: r.studentBranchCode,
        ieeeCardS3Key: r.ieeeCardS3Key,
        paymentScreenshotS3Key: r.paymentScreenshotS3Key ?? "",
        registrationStatus: r.registrationStatus,
      });
      console.log(`  ✓ Done`);
    } catch (err) {
      console.error(`  ✗ Failed:`, err);
    }
    await delay(400); // stay well under Sheets API rate limit
  }

  console.log("\nBackfill complete.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
