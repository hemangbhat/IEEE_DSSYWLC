import nodemailer from "nodemailer";

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    ""
  );
}

function getSmtpConfig() {
  const host = process.env.BREVO_SMTP_HOST;
  const port = Number(process.env.BREVO_SMTP_PORT || "587");
  const user = process.env.BREVO_SMTP_USER;
  const pass = process.env.BREVO_SMTP_PASS;
  const fromEmail = process.env.BREVO_FROM_EMAIL;
  const fromName = process.env.BREVO_FROM_NAME || "DSSYWLC 2025";

  if (!host || !user || !pass || !fromEmail || Number.isNaN(port)) {
    return null;
  }

  return {
    host,
    port,
    secure: port === 465,
    user,
    pass,
    fromEmail,
    fromName,
  };
}

export async function sendConfirmationEmail(
  to: string,
  name: string,
  profileToken: string
): Promise<boolean> {
  const config = getSmtpConfig();

  if (!config) {
    console.warn("Brevo SMTP is not fully configured. Skipping email send.");
    return false;
  }

  const profileUrl = `${getSiteUrl()}/profiles?token=${encodeURIComponent(
    profileToken
  )}`;

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to,
      subject: "DSSYWLC 2025 — Registration Received",
      text: [
        `Hi ${name},`,
        "",
        "Your DSSYWLC 2025 registration has been received.",
        "Current status: Under review",
        "",
        `Track your profile here: ${profileUrl}`,
        "",
        "DSSYWLC 2025",
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <p>Hi ${name},</p>
          <p>Your DSSYWLC 2025 registration has been received.</p>
          <p><strong>Status:</strong> Under review</p>
          <p>
            You can view your registration profile here:<br />
            <a href="${profileUrl}">${profileUrl}</a>
          </p>
          <p>Thank you for registering for DSSYWLC 2025.</p>
          <p style="margin-top: 24px; color: #6b7280; font-size: 13px;">
            Delhi Section Student, Young Professionals, Women in Engineering &amp; Life Members Congress
          </p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    return false;
  }
}
