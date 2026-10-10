/**
 * Global Phone Number Validation & Utility Library
 * Compliant with ITU-T Recommendation E.164 (International Public Telecommunication Numbering Plan).
 *
 * Rules:
 * 1. Must start with '+' international calling prefix.
 * 2. Country calling code (1 to 3 digits) follows '+', cannot start with 0.
 * 3. Total number of digits must be between 7 and 15 (ITU-T E.164 specification).
 * 4. Only standard grouping characters allowed (spaces, dashes, parentheses, dots).
 */

/**
 * Validates whether a phone number strictly follows the global E.164 international standard.
 * Examples of valid numbers:
 * - "+91 98765 43210", "+919876543210"
 * - "+1 (555) 234-5678", "+15552345678"
 * - "+44 20 7946 0958"
 *
 * Examples of invalid numbers:
 * - "3333" (no country code, only 4 digits)
 * - "9876543210" (missing country code '+')
 * - "+3333" (too short, min 7 digits under E.164)
 * - "+0123456789" (country code cannot start with 0)
 * - "+1234567890123456" (exceeds 15 digit maximum)
 */
export function isValidGlobalPhoneNumber(phone: string | null | undefined): boolean {
  if (!phone) return false;
  const trimmed = phone.trim();
  if (!trimmed) return false;

  // Must strictly start with '+'
  if (!trimmed.startsWith('+')) {
    return false;
  }

  // Allowed characters: leading '+', digits, and common grouping separators
  const allowedCharactersRegex = /^\+[0-9\s\-().]+$/;
  if (!allowedCharactersRegex.test(trimmed)) {
    return false;
  }

  // Extract only numeric digits
  const digitsOnly = trimmed.replace(/\D/g, '');

  // Must have digits and country code cannot start with '0'
  if (digitsOnly.length === 0 || digitsOnly.startsWith('0')) {
    return false;
  }

  // ITU-T E.164 standard: total length between 7 and 15 digits inclusive
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return false;
  }

  return true;
}

/**
 * Validates an optional phone number.
 * Returns true if blank/empty/undefined (allowing users to clear or omit phone),
 * but if provided, requires strict global standard compliance.
 */
export function isOptionalValidGlobalPhone(phone: string | null | undefined): boolean {
  if (!phone || !phone.trim()) {
    return true;
  }
  return isValidGlobalPhoneNumber(phone);
}

/**
 * Normalizes any valid global phone number into canonical E.164 format:
 * e.g., "+91 98765 43210" -> "+919876543210"
 * e.g., "+1 (555) 234-5678" -> "+15552345678"
 */
export function normalizeGlobalPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  const trimmed = phone.trim();
  if (!trimmed) return '';

  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';

  return `+${digits}`;
}

/**
 * Formats a global phone number for human-friendly display in UI.
 * Standardizes common international patterns (e.g. +91, +1, +44).
 */
export function formatGlobalPhoneDisplay(phone?: string | null): string {
  if (!phone) return '';
  const trimmed = phone.trim();
  if (!trimmed) return '';

  const canonical = normalizeGlobalPhoneNumber(trimmed);
  if (!canonical || !canonical.startsWith('+')) {
    return trimmed;
  }

  const digits = canonical.slice(1);

  // US/Canada (+1): +1 (XXX) XXX-XXXX
  if (digits.startsWith('1') && digits.length === 11) {
    const area = digits.slice(1, 4);
    const middle = digits.slice(4, 7);
    const last = digits.slice(7);
    return `+1 (${area}) ${middle}-${last}`;
  }

  // India (+91): +91 XXXXX XXXXX
  if (digits.startsWith('91') && digits.length === 12) {
    const part1 = digits.slice(2, 7);
    const part2 = digits.slice(7);
    return `+91 ${part1} ${part2}`;
  }

  // UK (+44): +44 XXXX XXXXXX (12 digits) or +44 XX XXXX XXXX
  if (digits.startsWith('44') && digits.length === 12) {
    const area = digits.slice(2, 4);
    const part1 = digits.slice(4, 8);
    const part2 = digits.slice(8);
    return `+44 ${area} ${part1} ${part2}`;
  }

  // Generic international fallback: space after 1-3 digit country code
  // If user already had good spacing, preserve clean format
  if (trimmed.includes(' ') && isValidGlobalPhoneNumber(trimmed)) {
    return trimmed.replace(/\s+/g, ' ');
  }

  // Format default with country code prefix separated
  if (digits.length >= 10) {
    const ccLength = digits.length > 11 ? (digits.startsWith('9') || digits.startsWith('8') ? 2 : 3) : 1;
    const cc = digits.slice(0, ccLength);
    const rest = digits.slice(ccLength);
    return `+${cc} ${rest}`;
  }

  return canonical;
}
