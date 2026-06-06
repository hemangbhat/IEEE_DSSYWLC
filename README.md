# DSSYWLC Website

Official website and registration system for the **IEEE Delhi Section Students,
Young Professionals, Women in Engineering and Life Members Congress (DSSYWLC '25)**,
hosted at Netaji Subhas University of Technology (NSUT).

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS 4**
- **Drizzle ORM** on **Neon Postgres**
- **AWS S3** for uploads (presigned, direct-to-bucket)
- **Brevo** (HTTP API) for transactional email
- **Google Sheets API** for registration sync
- **Cloudflare Turnstile** for CAPTCHA + in-memory rate limiting
- **PostHog** for analytics

> Note: this Next.js version may differ from older docs — see `AGENTS.md`. Read
> the relevant guide under `node_modules/next/dist/docs/` before changing
> framework-level code.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev
```

Open http://localhost:3000.

In development, integrations degrade gracefully when their env vars are unset
(email/Sheets/CAPTCHA are skipped) so you can run the app without full config.
**In production, `TURNSTILE_SECRET_KEY` is required** — if it is missing,
registration submissions are rejected (fail-closed).

## Environment variables

All variables are documented in [`.env.example`](.env.example). Anything
prefixed with `NEXT_PUBLIC_` is exposed to the browser; everything else is
server-only and secret.

## Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the dev server                 |
| `npm run build` | Production build                     |
| `npm run start` | Run the production build             |
| `npm run lint`  | Run ESLint                           |

## Database & migrations

Schema lives in [`lib/db/schema.ts`](lib/db/schema.ts); generated SQL is under
[`drizzle/`](drizzle/). Generate a migration after schema changes with
`drizzle-kit generate`.

> **Applying migrations:** `drizzle-kit migrate` can hang against Neon. Apply
> migrations with a small Node HTTP script instead (see
> [`scripts/apply-phone-unique.mjs`](scripts/apply-phone-unique.mjs) for the
> pattern).

## Key routes

- `/` — landing page
- `/register` — multi-step registration (noindex)
- `/profiles?token=…` — registrant status page, gated by a per-registration token (noindex)
- `POST /api/upload` — issues presigned S3 upload URLs
- `POST /api/admin/update-status` — status sync from the admin sheet (auth via `x-admin-secret`)
