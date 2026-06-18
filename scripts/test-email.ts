/**
 * Test script — sends a sample "Approved/Verified" status email so you can
 * preview the premium template (including the new WhatsApp group button).
 *
 * Usage:
 *   npx tsx scripts/test-email.ts your-email@example.com
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import {
  sendConfirmationEmail,
  sendStatusUpdateEmail,
} from "../lib/email";

async function main() {
  const to = process.argv[2];
  const type = process.argv[3] || "confirmation"; // confirmation | verified
  if (!to) {
    console.error(
      "Usage: npx tsx scripts/test-email.ts <recipient-email> [confirmation|verified]",
    );
    process.exit(1);
  }

  let ok: boolean;
  if (type === "verified") {
    console.log(`Sending test 'Approved' email to ${to}...`);
    ok = await sendStatusUpdateEmail(
      to,
      "Test Participant",
      "verified",
      "test-token-1234567890abcdef",
      null,
    );
  } else {
    console.log(`Sending test 'Registration Received' email to ${to}...`);
    ok = await sendConfirmationEmail(
      to,
      "Test Participant",
      "test-token-1234567890abcdef",
    );
  }

  console.log(ok ? "✓ Email sent successfully" : "✗ Email failed to send");
  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
