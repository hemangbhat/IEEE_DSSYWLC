// MaskUtils.tsx - utility functions to mask personal info

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!domain) return email;
  // Too short to reveal both ends without overlapping/duplicating — show only
  // the first character and mask the rest.
  if (localPart.length <= 4) {
    const first = localPart.slice(0, 1);
    return `${first}${"*".repeat(Math.max(1, localPart.length - 1))}@${domain}`;
  }
  const visibleStart = localPart.slice(0, 2);
  const visibleEnd = localPart.slice(-2);
  const maskedMiddle = "*".repeat(localPart.length - 4);
  return `${visibleStart}${maskedMiddle}${visibleEnd}@${domain}`;
}

// Show first 3 and last 2 digits of phone, mask the rest
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 5) return "*".repeat(digits.length);
  const start = digits.slice(0, 3);
  const end = digits.slice(-2);
  const masked = "*".repeat(digits.length - 5);
  return `${start}${masked}${end}`;
}
