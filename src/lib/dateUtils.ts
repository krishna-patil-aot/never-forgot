import {
  format,
  formatDistanceToNow,
  differenceInCalendarDays,
  startOfDay,
  endOfDay,
  isBefore as dateFnsIsBefore,
  isSameDay,
  isAfter as dateFnsIsAfter,
  isValid,
  parseISO,
} from 'date-fns';

/**
 * Safely parse any date input (string, Date, number, null) into a valid Date object.
 */
export function parseDateSafe(dateInput?: string | Date | number | null): Date | null {
  if (!dateInput) return null;
  if (dateInput instanceof Date) {
    return isNaN(dateInput.getTime()) ? null : dateInput;
  }
  if (typeof dateInput === 'string') {
    // Check YYYY-MM-DD or ISO string
    const cleanStr = dateInput.split('T')[0];
    const parts = cleanStr.split(/[-/]/);
    if (parts.length === 3 && parts[0].length === 4) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      if (isValid(d)) return d;
    }
    const isoParsed = parseISO(dateInput);
    if (isValid(isoParsed)) return isoParsed;
    const fallback = new Date(dateInput);
    return isValid(fallback) ? fallback : null;
  }
  const fallback = new Date(dateInput);
  return isValid(fallback) ? fallback : null;
}

/**
 * Deterministic date formatter powered by date-fns.
 * Produces identical formatted strings across SSR and client rendering.
 */
export function formatDisplayDate(
  dateInput: string | Date | undefined | null,
  formatPattern: string = 'dd MMM yyyy'
): string {
  if (!dateInput) return '';
  const date = parseDateSafe(dateInput);
  if (!date) return String(dateInput);
  try {
    return format(date, formatPattern);
  } catch {
    return String(dateInput);
  }
}

/**
 * Format relative time (e.g., "in 5 days", "3 weeks ago")
 */
export function formatRelativeFromNow(
  dateInput: string | Date | undefined | null
): string {
  if (!dateInput) return '';
  const date = parseDateSafe(dateInput);
  if (!date) return '';
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Calculate the exact days remaining until an expiry or renewal date.
 * Returns negative numbers if already expired.
 */
export function getDaysRemaining(
  dateInput: string | Date | undefined | null
): number {
  if (!dateInput) return 0;
  const date = parseDateSafe(dateInput);
  if (!date) return 0;
  const target = startOfDay(date);
  const today = startOfDay(new Date());
  return differenceInCalendarDays(target, today);
}

/**
 * Human-friendly calendar date (e.g. "Today", "Tomorrow", "Yesterday", "dd MMM yyyy")
 */
export function formatCalendarDate(
  dateInput: string | Date | undefined | null
): string {
  if (!dateInput) return '';
  const date = parseDateSafe(dateInput);
  if (!date) return '';
  const today = startOfDay(new Date());
  const target = startOfDay(date);
  const diffDays = differenceInCalendarDays(target, today);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return format(date, 'EEEE');
  return format(date, 'dd MMM yyyy');
}

/**
 * Format currency in Indian Rupees without server/client whitespace differences.
 */
export function formatCurrencyINR(amount: number): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `₹${formatted}`;
}

/**
 * Parse any date input safely into a local Date set to the start of the day (00:00:00.000).
 */
export function parseToStartOfDay(
  dateInput?: string | Date | null
): Date | undefined {
  if (!dateInput) return undefined;
  const date = parseDateSafe(dateInput);
  if (!date) return undefined;
  return startOfDay(date);
}

/**
 * Parse any date input safely into a local Date set to the end of the day (23:59:59.999).
 */
export function parseToEndOfDay(
  dateInput?: string | Date | null
): Date | undefined {
  if (!dateInput) return undefined;
  const date = parseDateSafe(dateInput);
  if (!date) return undefined;
  return endOfDay(date);
}

/**
 * Checks whether candidateDate is strictly before baseDate (comparing by start of day).
 */
export function isDateBefore(
  candidateDate: string | Date,
  baseDate: string | Date
): boolean {
  if (!candidateDate || !baseDate) return false;
  const candidate = parseDateSafe(candidateDate);
  const base = parseDateSafe(baseDate);
  if (!candidate || !base) return false;
  return dateFnsIsBefore(startOfDay(candidate), startOfDay(base));
}

/**
 * Checks whether candidateDate is on or after baseDate (comparing by start of day).
 */
export function isDateAfterOrEqual(
  candidateDate: string | Date,
  baseDate: string | Date
): boolean {
  if (!candidateDate || !baseDate) return true;
  const candidate = parseDateSafe(candidateDate);
  const base = parseDateSafe(baseDate);
  if (!candidate || !base) return true;
  const startCand = startOfDay(candidate);
  const startBase = startOfDay(base);
  return isSameDay(startCand, startBase) || dateFnsIsAfter(startCand, startBase);
}
