/**
 * Cloudflare Turnstile verification.
 *
 * Turnstile is a free, privacy-friendly CAPTCHA alternative used to stop
 * bots from spamming the registration endpoint (which writes to the DB,
 * sends email via Brevo, and calls the Google Sheets API).
 *
 * Required env vars (set both to enable protection):
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY — public site key, rendered in the widget
 *   TURNSTILE_SECRET_KEY           — secret key, used server-side to verify
 *
 * If TURNSTILE_SECRET_KEY is unset, verification is skipped (the site keeps
 * working exactly as before) — see isTurnstileConfigured().
 */

const VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** True when the secret key is configured and verification should run. */
export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

/**
 * Verify a Turnstile token with Cloudflare.
 * Returns true when the token is valid, false otherwise.
 * If Turnstile is not configured, returns true (no-op) so the flow is unchanged.
 */
export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // Not configured.
  if (!secret) {
    // Fail CLOSED in production: the CAPTCHA is the primary bot protection, so
    // a missing secret must reject rather than silently let spam through. This
    // means TURNSTILE_SECRET_KEY MUST be set in production — otherwise every
    // submission is rejected (a loud, immediate, safe failure).
    if (process.env.NODE_ENV === "production") {
      console.error(
        "TURNSTILE_SECRET_KEY is not set in production — rejecting submission. " +
          "Set the secret to enable CAPTCHA verification.",
      );
      return false;
    }
    // Outside production, skip verification so local/dev flows keep working.
    console.warn(
      "Turnstile not configured — skipping CAPTCHA verification (non-production).",
    );
    return true;
  }

  if (!token) {
    return false;
  }

  try {
    const body = new URLSearchParams();
    body.append("secret", secret);
    body.append("response", token);
    if (remoteIp) {
      body.append("remoteip", remoteIp);
    }

    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Turnstile verify HTTP error:", response.status);
      return false;
    }

    const data = (await response.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error("Turnstile verification failed:", error);
    return false;
  }
}
