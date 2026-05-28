import { NextResponse } from "next/server";
import { google } from "googleapis";

// Vercel Cron will call this route on schedule
export const dynamic = "force-dynamic";

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !key) return null;

  return new google.auth.JWT({
    email,
    key: key.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron (security)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sourceSheetId = process.env.GOOGLE_SHEET_ID;
  const backupSheetId = process.env.GOOGLE_BACKUP_SHEET_ID;
  const auth = getAuth();

  if (!auth || !sourceSheetId || !backupSheetId) {
    return NextResponse.json({ error: "Missing config" }, { status: 500 });
  }

  try {
    const sheets = google.sheets({ version: "v4", auth });

    // 1. Read all data from the primary sheet
    const source = await sheets.spreadsheets.values.get({
      spreadsheetId: sourceSheetId,
      range: "Sheet1!A:O",
    });

    const rows = source.data.values || [];

    if (rows.length === 0) {
      return NextResponse.json({ message: "Nothing to backup", rows: 0 });
    }

    // 2. Clear the backup sheet
    await sheets.spreadsheets.values.clear({
      spreadsheetId: backupSheetId,
      range: "Sheet1!A:O",
    });

    // 3. Write all data to the backup sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId: backupSheetId,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: rows },
    });

    // 4. Add a "Last Backup" timestamp in column P, row 1
    await sheets.spreadsheets.values.update({
      spreadsheetId: backupSheetId,
      range: "Sheet1!P1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [["Last Backup", new Date().toISOString()]],
      },
    });

    return NextResponse.json({
      success: true,
      rowsCopied: rows.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Backup failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Backup failed" },
      { status: 500 },
    );
  }
}
