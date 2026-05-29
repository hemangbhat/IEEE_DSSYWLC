/**
 * Minimal in-memory rate limiter (fixed window per key).
 *
 * NOTE: This is best-effort. On serverless platforms (Netlify functions)
 * the in-process Map is per-instance and resets on cold start, so it does
 * not provide hard guarantees across instances. It is a cheap defence-in-depth
 * layer; the primary bot protection is the Turnstile CAPTCHA. For strict,
 * cross-instance limits, back this with a shared store (e.g. Upstash Redis).
 */

type Entry = { count: number; expiresAt: number };

const stores = new Map<string, Map<string, Entry>>();

function getStore(namespace: string): Map<string, Entry> {
  let store = stores.get(namespace);
  if (!store) {
    store = new Map<string, Entry>();
    stores.set(namespace, store);
  }
  return store;
}

/**
 * Returns true if `key` has exceeded `max` requests within `windowMs`.
 * Otherwise records the request and returns false.
 */
export function isRateLimited(
  namespace: string,
  key: string,
  max: number,
  windowMs: number,
): boolean {
  const store = getStore(namespace);
  const now = Date.now();

  // Opportunistic cleanup of expired entries.
  for (const [k, v] of store.entries()) {
    if (v.expiresAt <= now) {
      store.delete(k);
    }
  }

  const existing = store.get(key);

  if (!existing || existing.expiresAt <= now) {
    store.set(key, { count: 1, expiresAt: now + windowMs });
    return false;
  }

  if (existing.count >= max) {
    return true;
  }

  existing.count += 1;
  return false;
}
