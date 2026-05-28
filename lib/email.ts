/**
 * Email integration — sends transactional emails via the Brevo API.
 *
 * Uses the Brevo HTTP API (not SMTP) to avoid IP-restriction issues
 * that occur on cloud platforms like Netlify.
 *
 * Required env vars:
 *   BREVO_API_KEY    — Brevo API key (xkeysib-...)
 *   BREVO_FROM_EMAIL — Sender email (e.g. no-reply@dssywlcnsut.in)
 *   BREVO_FROM_NAME  — Sender display name
 */

function getEmailConfig() {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.BREVO_FROM_EMAIL;
  const fromName = process.env.BREVO_FROM_NAME || "DSSYWLC '25";

  if (!apiKey || !fromEmail) {
    return null;
  }

  return { apiKey, fromEmail, fromName };
}

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    ""
  );
}

async function sendEmail({
  to,
  subject,
  textContent,
  htmlContent,
}: {
  to: string;
  subject: string;
  textContent: string;
  htmlContent: string;
}): Promise<boolean> {
  const config = getEmailConfig();

  if (!config) {
    console.warn("Brevo API not configured. Skipping email send.");
    return false;
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": config.apiKey,
      },
      body: JSON.stringify({
        sender: { name: config.fromName, email: config.fromEmail },
        to: [{ email: to }],
        subject,
        textContent,
        htmlContent,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Brevo API error:", response.status, errorBody);
      return false;
    }

    console.log("Email sent successfully to", to);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

export async function sendConfirmationEmail(
  to: string,
  name: string,
  profileToken: string
): Promise<boolean> {
  const profileUrl = `${getSiteUrl()}/profiles?token=${encodeURIComponent(
    profileToken
  )}`;

  return sendEmail({
    to,
    subject: "DSSYWLC '25 — Registration Received",
    textContent: [
      `Hi ${name},`,
      "",
      "Your DSSYWLC '25 registration has been received.",
      "Current status: Under review",
      "",
      `Track your profile here: ${profileUrl}`,
      "",
      "DSSYWLC '25",
    ].join("\n"),
    htmlContent: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <p>Hi ${name},</p>
        <p>Your DSSYWLC '25 registration has been received.</p>
        <p><strong>Status:</strong> Under review</p>
        <p>
          You can view your registration profile here:<br />
          <a href="${profileUrl}">${profileUrl}</a>
        </p>
        <p>Thank you for registering for DSSYWLC '25.</p>
        <p style="margin-top: 24px; color: #6b7280; font-size: 13px;">
          Delhi Section Student, Young Professionals, Women in Engineering &amp; Life Members Congress
        </p>
      </div>
    `,
  });
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  verified: { label: "Approved ✅", color: "#16a34a" },
  rejected: { label: "Rejected ❌", color: "#dc2626" },
  needs_info: { label: "More Information Needed ⚠️", color: "#d97706" },
  under_review: { label: "Under Review", color: "#6b7280" },
};

export async function sendStatusUpdateEmail(
  to: string,
  name: string,
  newStatus: string,
  profileToken: string,
  remarks: string | null
): Promise<boolean> {
  const profileUrl = `${getSiteUrl()}/profiles?token=${encodeURIComponent(
    profileToken
  )}`;

  const statusInfo = STATUS_LABELS[newStatus] || STATUS_LABELS.under_review;

  const remarksBlock = remarks
    ? `<p style="background: #fef3c7; padding: 12px; border-radius: 6px; border-left: 4px solid #d97706;"><strong>Reviewer Remarks:</strong><br/>${remarks}</p>`
    : "";

  return sendEmail({
    to,
    subject: `DSSYWLC '25 — Registration ${statusInfo.label}`,
    textContent: [
      `Hi ${name},`,
      "",
      `Your DSSYWLC '25 registration status has been updated to: ${statusInfo.label}`,
      "",
      remarks ? `Reviewer remarks: ${remarks}` : "",
      "",
      `View your profile: ${profileUrl}`,
      "",
      "DSSYWLC '25",
    ]
      .filter(Boolean)
      .join("\n"),
    htmlContent: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <p>Hi ${name},</p>
        <p>Your DSSYWLC '25 registration status has been updated:</p>
        <p style="font-size: 18px;">
          <strong style="color: ${statusInfo.color};">${statusInfo.label}</strong>
        </p>
        ${remarksBlock}
        <p>
          View your registration profile:<br />
          <a href="${profileUrl}">${profileUrl}</a>
        </p>
        <p style="margin-top: 24px; color: #6b7280; font-size: 13px;">
          Delhi Section Student, Young Professionals, Women in Engineering & Life Members Congress
        </p>
      </div>
    `,
  });
}
