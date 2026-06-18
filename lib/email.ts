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

/** Escape user-supplied text before interpolating into HTML email bodies. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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
  // Use custom domain as default for production emails
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://dssywlcnsut.in").replace(/\/$/, "");
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
  const logoUrl = `${getSiteUrl()}/logos/dssywlc-logo.png`;
  const safeName = escapeHtml(name);

  return sendEmail({
    to,
    subject: "Thanks for applying! Your registration is received",
    textContent: [
      `Hello ${name}`,
      "",
      "Thanks for applying! We're thrilled to join you at the IEEE Delhi Section Students, Young Professionals, Women in Engineering and Life Members Congress (DSSYWLC '25).",
      "",
      `Check out your registration profile here: ${profileUrl}`,
      "",
      "If you have any questions, reach us at ieee@nsut.ac.in – we’re happy to help.",
      "",
      "Cheers,",
      "Organizing Committee, DSSYWLC '25",
      "IEEE NSUT Student Branch",
      "Netaji Subhas University of Technology (NSUT)"
    ].join("\n"),
    htmlContent: `
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f3ef; padding: 40px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: left;">
              <!-- Header -->
              <tr>
                <td style="background-color: #7B1F34; padding: 32px 24px; text-align: center;">
                  <img src="${logoUrl}" alt="DSSYWLC '25 Logo" style="height: 56px; max-width: 100%; display: block; margin: 0 auto 12px auto; object-fit: contain;" />
                  <div style="font-size: 20px; font-weight: bold; color: #ffffff; letter-spacing: 1px; margin-bottom: 8px; font-family: Helvetica, Arial, sans-serif;">DSSYWLC '25</div>
                  <div style="font-size: 10px; font-weight: bold; color: #fecdd3; letter-spacing: 1.5px; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.25); display: inline-block; padding: 4px 12px; border-radius: 4px; background-color: rgba(255,255,255,0.08);">REGISTRATION RECEIVED</div>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding: 32px 24px;">
                  <p style="font-size: 15px; font-weight: bold; color: #7B1F34; margin-top: 0; margin-bottom: 16px;">Hi ${safeName},</p>
                  <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">
                    Thanks for applying for the <strong>IEEE Delhi Section Students, Young Professionals, Women in Engineering and Life Members Congress (DSSYWLC '25)</strong>! We are super excited to have you join us at <strong>Netaji Subhas University of Technology (NSUT)</strong>.
                  </p>
                  <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">
                    Your registration details and payment screenshot have been successfully received and are currently under review by our organizing committee.
                  </p>
                  
                  <!-- Status Box -->
                  <div style="background-color: #f8fafc; border-left: 4px solid #64748b; padding: 16px; margin: 24px 0; border-radius: 4px;">
                    <p style="font-size: 11px; font-weight: bold; color: #475569; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 6px 0;">REGISTRATION STATUS: UNDER REVIEW</p>
                    <p style="font-size: 13px; color: #334155; line-height: 1.5; margin: 0;">
                      We are currently verifying your payment screenshot and registration details. You will be notified automatically via email once the review is complete.
                    </p>
                  </div>
                  
                  <!-- Action Button -->
                  <div style="text-align: center; margin: 32px 0 16px 0;">
                    <a href="${profileUrl}" style="display: inline-block; background-color: #7B1F34; color: #ffffff; text-decoration: none; padding: 12px 32px; font-size: 13px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 4px; box-shadow: 0 2px 4px rgba(123, 31, 52, 0.2);">TRACK MY REGISTRATION &rarr;</a>
                    <p style="font-size: 12px; color: #64748b; margin-top: 16px; margin-bottom: 0;">This link is personal and unique to you. Do not share it with others.</p>
                  </div>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #7B1F34; color: #fecdd3; font-size: 11px; text-align: center; padding: 16px 24px; line-height: 1.4;">
                  DSSYWLC '25 &bull; Automated email &bull; Do not reply
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  });
}

const STATUS_LABELS: Record<string, { label: string; badge: string; color: string; bg: string; description: string }> = {
  verified: {
    label: "Approved",
    badge: "REGISTRATION APPROVED",
    color: "#16a34a",
    bg: "#f0fdf4",
    description: "Your spot is confirmed and everything's set on our end. All that's left is for you to show up ready to make the most of it. We can't wait to welcome you in person at the congress.",
  },
  rejected: {
    label: "Declined",
    badge: "REGISTRATION DECLINED",
    color: "#dc2626",
    bg: "#fef2f2",
    description: "Thank you for registering. Unfortunately, we aren't able to approve your registration at this time. If you have questions or believe this is a mistake, please reach out.",
  },
  needs_info: {
    label: "Action Required",
    badge: "ACTION REQUIRED",
    color: "#d97706",
    bg: "#fffbeb",
    description: "We need a quick update from you to finish processing your registration. Please check the reviewer's remarks below and update your profile details so we can get you approved!",
  },
  under_review: {
    label: "Under Review",
    badge: "REGISTRATION UPDATE",
    color: "#64748b",
    bg: "#f8fafc",
    description: "Just a quick update: your registration is currently being reviewed by our organizing team. We'll send you another email as soon as it's verified!",
  },
};

const WHATSAPP_GROUP_URL =
  "https://chat.whatsapp.com/LSzp4eld5Mo9nX44FgFujB?s=cl&p=i&ilr=0&amv=2";

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
  const logoUrl = `${getSiteUrl()}/logos/dssywlc-logo.png`;

  const statusInfo = STATUS_LABELS[newStatus] || STATUS_LABELS.under_review;
  const safeName = escapeHtml(name);

  const remarksBlock = remarks
    ? `
      <!-- Remarks Box -->
      <div style="background-color: #fffbeb; border-left: 4px solid #d97706; padding: 16px; margin: 24px 0; border-radius: 4px;">
        <p style="font-size: 11px; font-weight: bold; color: #b45309; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 6px 0;">REVIEWER REMARKS</p>
        <p style="font-size: 13px; color: #78350f; line-height: 1.5; margin: 0; white-space: pre-wrap;">${escapeHtml(remarks)}</p>
      </div>
    `
    : "";

  // Approved registrants get a warm welcome intro; others get a neutral one.
  const introHtml =
    newStatus === "verified"
      ? "Welcome aboard! We're thrilled to have you with us. Your registration for <strong>DSSYWLC '25</strong> has been reviewed and officially approved. You're now part of a community of young changemakers coming together to learn, connect, and lead."
      : "Just a quick update about your registration for <strong>DSSYWLC '25</strong>.";

  // Only approved/verified registrants get the WhatsApp group invite.
  const whatsappBlock =
    newStatus === "verified"
      ? `
      <!-- WhatsApp Group Box -->
      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; margin: 24px 0; border-radius: 6px; text-align: center;">
        <p style="font-size: 14px; font-weight: bold; color: #166534; margin: 0 0 6px 0;">Join the Official Participants Group</p>
        <p style="font-size: 13px; color: #334155; line-height: 1.5; margin: 0 0 16px 0;">
          This is your go-to space for live updates, schedule changes, key announcements, and an early chance to connect with fellow participants before the congress begins. Join now so you stay in the loop.
        </p>
        <a href="${WHATSAPP_GROUP_URL}" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 12px 32px; font-size: 13px; font-weight: bold; letter-spacing: 0.5px; border-radius: 4px;">Join WhatsApp Group &rarr;</a>
      </div>
    `
      : "";

  return sendEmail({
    to,
    subject: `Registration Status Update: ${statusInfo.label} — DSSYWLC '25`,
    textContent: [
      `Hi ${name},`,
      "",
      newStatus === "verified"
        ? "Welcome aboard! We're thrilled to have you with us. Your registration for DSSYWLC '25 has been reviewed and officially approved. You're now part of a community of young changemakers coming together to learn, connect, and lead."
        : `Just a quick update about your registration for DSSYWLC '25. Your status has been updated to: ${statusInfo.label}.`,
      "",
      remarks ? `Reviewer Remarks:\n${remarks}` : "",
      "",
      newStatus === "verified"
        ? `Please join our official WhatsApp group for important updates and announcements: ${WHATSAPP_GROUP_URL}`
        : "",
      "",
      `You can view your complete registration details and track updates here: ${profileUrl}`,
      "",
      "Cheers,",
      "Organizing Committee, DSSYWLC '25",
      "IEEE NSUT Student Branch",
      "Netaji Subhas University of Technology (NSUT)",
    ]
      .filter(Boolean)
      .join("\n"),
    htmlContent: `
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f3ef; padding: 40px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: left;">
              <!-- Header -->
              <tr>
                <td style="background-color: #7B1F34; padding: 32px 24px; text-align: center;">
                  <img src="${logoUrl}" alt="DSSYWLC '25 Logo" style="height: 56px; max-width: 100%; display: block; margin: 0 auto 12px auto; object-fit: contain;" />
                  <div style="font-size: 20px; font-weight: bold; color: #ffffff; letter-spacing: 1px; margin-bottom: 8px; font-family: Helvetica, Arial, sans-serif;">DSSYWLC '25</div>
                  <div style="font-size: 10px; font-weight: bold; color: #fecdd3; letter-spacing: 1.5px; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.25); display: inline-block; padding: 4px 12px; border-radius: 4px; background-color: rgba(255,255,255,0.08);">${statusInfo.badge}</div>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding: 32px 24px;">
                  <p style="font-size: 15px; font-weight: bold; color: #7B1F34; margin-top: 0; margin-bottom: 16px;">Hi ${safeName},</p>
                  <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">
                    ${introHtml}
                  </p>
                  
                  <!-- Status Box -->
                  <div style="background-color: ${statusInfo.bg}; border-left: 4px solid ${statusInfo.color}; padding: 16px; margin: 24px 0; border-radius: 4px;">
                    <p style="font-size: 11px; font-weight: bold; color: ${statusInfo.color}; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 6px 0;">STATUS: ${statusInfo.label.toUpperCase()}</p>
                    <p style="font-size: 13px; color: #334155; line-height: 1.5; margin: 0;">
                      ${statusInfo.description}
                    </p>
                  </div>
                  
                  ${remarksBlock}
                  
                  ${whatsappBlock}
                  
                  <!-- Action Button -->
                  <div style="text-align: center; margin: 32px 0 16px 0;">
                    <a href="${profileUrl}" style="display: inline-block; background-color: #7B1F34; color: #ffffff; text-decoration: none; padding: 12px 32px; font-size: 13px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 4px; box-shadow: 0 2px 4px rgba(123, 31, 52, 0.2);">VIEW MY PROFILE &rarr;</a>
                    <p style="font-size: 12px; color: #64748b; margin-top: 16px; margin-bottom: 0;">This link is personal and unique to you. Do not share it with others.</p>
                  </div>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #7B1F34; color: #fecdd3; font-size: 11px; text-align: center; padding: 16px 24px; line-height: 1.4;">
                  DSSYWLC '25 &bull; Automated email &bull; Do not reply
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  });
}

// ──── Bulk / Team Registration Emails ────

/** Premium-template confirmation sent to the team leader after a bulk submit. */
export async function sendBulkLeaderConfirmationEmail(
  to: string,
  leaderName: string,
  profileToken: string,
  teamSize: number,
): Promise<boolean> {
  const profileUrl = `${getSiteUrl()}/profiles?token=${encodeURIComponent(
    profileToken,
  )}`;
  const logoUrl = `${getSiteUrl()}/logos/dssywlc-logo.png`;
  const safeName = escapeHtml(leaderName);

  return sendEmail({
    to,
    subject: "DSSYWLC '25 — Team Registration Received",
    textContent: [
      `Hi ${leaderName},`,
      "",
      "Your team registration for the IEEE Delhi Section Students, Young Professionals, Women in Engineering and Life Members Congress (DSSYWLC '25) has been received.",
      `You registered a team of ${teamSize} (including yourself).`,
      "Current status: Under review",
      "",
      "Confirmation emails have been sent to every team member with their own profile link.",
      "",
      `Track your profile here: ${profileUrl}`,
      "",
      "Cheers,",
      "Organizing Committee, DSSYWLC '25",
      "IEEE NSUT Student Branch",
      "Netaji Subhas University of Technology (NSUT)",
    ].join("\n"),
    htmlContent: `
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f3ef; padding: 40px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: left;">
              <tr>
                <td style="background-color: #7B1F34; padding: 32px 24px; text-align: center;">
                  <img src="${logoUrl}" alt="DSSYWLC '25 Logo" style="height: 56px; max-width: 100%; display: block; margin: 0 auto 12px auto; object-fit: contain;" />
                  <div style="font-size: 20px; font-weight: bold; color: #ffffff; letter-spacing: 1px; margin-bottom: 8px; font-family: Helvetica, Arial, sans-serif;">DSSYWLC '25</div>
                  <div style="font-size: 10px; font-weight: bold; color: #fecdd3; letter-spacing: 1.5px; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.25); display: inline-block; padding: 4px 12px; border-radius: 4px; background-color: rgba(255,255,255,0.08);">TEAM REGISTRATION RECEIVED</div>
                </td>
              </tr>
              <tr>
                <td style="padding: 32px 24px;">
                  <p style="font-size: 15px; font-weight: bold; color: #7B1F34; margin-top: 0; margin-bottom: 16px;">Hi ${safeName},</p>
                  <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">
                    Your team registration for <strong>DSSYWLC '25</strong> has been received. You registered a team of <strong>${teamSize}</strong> (including yourself), and the payment screenshot is currently under review by our organizing committee.
                  </p>
                  <div style="background-color: #f8fafc; border-left: 4px solid #64748b; padding: 16px; margin: 24px 0; border-radius: 4px;">
                    <p style="font-size: 11px; font-weight: bold; color: #475569; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 6px 0;">REGISTRATION STATUS: UNDER REVIEW</p>
                    <p style="font-size: 13px; color: #334155; line-height: 1.5; margin: 0;">
                      Every team member has been emailed their own confirmation and profile link. You will all be notified automatically once the review is complete.
                    </p>
                  </div>
                  <div style="text-align: center; margin: 32px 0 16px 0;">
                    <a href="${profileUrl}" style="display: inline-block; background-color: #7B1F34; color: #ffffff; text-decoration: none; padding: 12px 32px; font-size: 13px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 4px; box-shadow: 0 2px 4px rgba(123, 31, 52, 0.2);">TRACK MY REGISTRATION &rarr;</a>
                    <p style="font-size: 12px; color: #64748b; margin-top: 16px; margin-bottom: 0;">This link is personal and unique to you. Do not share it with others.</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background-color: #7B1F34; color: #fecdd3; font-size: 11px; text-align: center; padding: 16px 24px; line-height: 1.4;">
                  DSSYWLC '25 &bull; Automated email &bull; Do not reply
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  });
}

/** Premium-template confirmation sent to each team member of a bulk submit. */
export async function sendBulkMemberConfirmationEmail(
  to: string,
  memberName: string,
  profileToken: string,
  leaderName: string,
): Promise<boolean> {
  const profileUrl = `${getSiteUrl()}/profiles?token=${encodeURIComponent(
    profileToken,
  )}`;
  const logoUrl = `${getSiteUrl()}/logos/dssywlc-logo.png`;
  const safeName = escapeHtml(memberName);
  const safeLeader = escapeHtml(leaderName);

  return sendEmail({
    to,
    subject: "DSSYWLC '25 — You've Been Registered!",
    textContent: [
      `Hi ${memberName},`,
      "",
      `You have been registered for the IEEE Delhi Section Students, Young Professionals, Women in Engineering and Life Members Congress (DSSYWLC '25) by ${leaderName} as part of a team registration.`,
      "Current status: Under review",
      "",
      `Track your profile here: ${profileUrl}`,
      "",
      "Cheers,",
      "Organizing Committee, DSSYWLC '25",
      "IEEE NSUT Student Branch",
      "Netaji Subhas University of Technology (NSUT)",
    ].join("\n"),
    htmlContent: `
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f3ef; padding: 40px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: left;">
              <tr>
                <td style="background-color: #7B1F34; padding: 32px 24px; text-align: center;">
                  <img src="${logoUrl}" alt="DSSYWLC '25 Logo" style="height: 56px; max-width: 100%; display: block; margin: 0 auto 12px auto; object-fit: contain;" />
                  <div style="font-size: 20px; font-weight: bold; color: #ffffff; letter-spacing: 1px; margin-bottom: 8px; font-family: Helvetica, Arial, sans-serif;">DSSYWLC '25</div>
                  <div style="font-size: 10px; font-weight: bold; color: #fecdd3; letter-spacing: 1.5px; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.25); display: inline-block; padding: 4px 12px; border-radius: 4px; background-color: rgba(255,255,255,0.08);">YOU'RE REGISTERED</div>
                </td>
              </tr>
              <tr>
                <td style="padding: 32px 24px;">
                  <p style="font-size: 15px; font-weight: bold; color: #7B1F34; margin-top: 0; margin-bottom: 16px;">Hi ${safeName},</p>
                  <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">
                    You have been registered for <strong>DSSYWLC '25</strong> by <strong>${safeLeader}</strong> as part of a team registration. Your registration is currently under review by our organizing committee.
                  </p>
                  <div style="background-color: #f8fafc; border-left: 4px solid #64748b; padding: 16px; margin: 24px 0; border-radius: 4px;">
                    <p style="font-size: 11px; font-weight: bold; color: #475569; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 6px 0;">REGISTRATION STATUS: UNDER REVIEW</p>
                    <p style="font-size: 13px; color: #334155; line-height: 1.5; margin: 0;">
                      You will be notified automatically via email once the review is complete. Use the button below to track your registration at any time.
                    </p>
                  </div>
                  <div style="text-align: center; margin: 32px 0 16px 0;">
                    <a href="${profileUrl}" style="display: inline-block; background-color: #7B1F34; color: #ffffff; text-decoration: none; padding: 12px 32px; font-size: 13px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 4px; box-shadow: 0 2px 4px rgba(123, 31, 52, 0.2);">TRACK MY REGISTRATION &rarr;</a>
                    <p style="font-size: 12px; color: #64748b; margin-top: 16px; margin-bottom: 0;">This link is personal and unique to you. Do not share it with others.</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background-color: #7B1F34; color: #fecdd3; font-size: 11px; text-align: center; padding: 16px 24px; line-height: 1.4;">
                  DSSYWLC '25 &bull; Automated email &bull; Do not reply
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  });
}
