/**
 * Master switch for registrations (both individual and bulk/team).
 *
 * Set to `true` to CLOSE all registrations — the forms show a "Registrations
 * Closed" message and the server actions reject any submissions.
 * Set to `false` to re-open registrations.
 *
 * This single flag controls BOTH /register and /bulk-register.
 */
export const REGISTRATIONS_CLOSED = true;
