import posthog from "posthog-js";

const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

// Remove the secret `token` query param (used on /profiles to view a
// registration) from any URL we send to PostHog, so the profile-access token
// never leaves the browser to a third party. Other params (e.g. UTM) are kept.
function stripProfileToken(value: string): string {
  try {
    const url = new URL(value);
    if (url.searchParams.has("token")) {
      url.searchParams.delete("token");
      return url.toString();
    }
    return value;
  } catch {
    return value;
  }
}

if (posthogToken) {
  posthog.init(posthogToken, {
    api_host: posthogHost,
    defaults: "2026-01-30",
    before_send: (event) => {
      if (event?.properties) {
        const urlKeys = [
          "$current_url",
          "$referrer",
          "$initial_current_url",
          "$initial_referrer",
        ];
        for (const key of urlKeys) {
          const val = event.properties[key];
          if (typeof val === "string") {
            event.properties[key] = stripProfileToken(val);
          }
        }
      }
      return event;
    },
  });
}
