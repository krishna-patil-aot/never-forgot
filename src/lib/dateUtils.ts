import moment from 'moment';

/**
 * Deterministic date formatter powered by moment.js.
 * Produces identical formatted strings across SSR and client rendering.
 */
export function formatDisplayDate(
  dateInput: string | Date | undefined | null,
  formatStr: string = 'DD MMM YYYY'
): string {
  if (!dateInput) return '';
  const m = moment(dateInput);
  if (!m.isValid()) return String(dateInput);
  return m.format(formatStr);
}

/**
 * Format relative time (e.g., "in 5 days", "3 weeks ago")
 */
export function formatRelativeFromNow(
  dateInput: string | Date | undefined | null
): string {
  if (!dateInput) return '';
  const m = moment(dateInput);
  if (!m.isValid()) return '';
  return m.fromNow();
}

/**
 * Calculate the exact days remaining until an expiry or renewal date.
 * Returns negative numbers if already expired.
 */
export function getDaysRemaining(
  dateInput: string | Date | undefined | null
): number {
  if (!dateInput) return 0;
  const target = moment(dateInput).startOf('day');
  const today = moment().startOf('day');
  return target.diff(today, 'days');
}

/**
 * Human-friendly calendar date (e.g. "Today", "Tomorrow", "Next Friday")
 */
export function formatCalendarDate(
  dateInput: string | Date | undefined | null
): string {
  if (!dateInput) return '';
  const m = moment(dateInput);
  if (!m.isValid()) return '';
  return m.calendar(null, {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd [next week]',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'DD MMM YYYY',
  });
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
  const m = moment(dateInput);
  if (!m.isValid()) return undefined;
  return m.startOf('day').toDate();
}

/**
 * Parse any date input safely into a local Date set to the end of the day (23:59:59.999).
 */
export function parseToEndOfDay(
  dateInput?: string | Date | null
): Date | undefined {
  if (!dateInput) return undefined;
  const m = moment(dateInput);
  if (!m.isValid()) return undefined;
  return m.endOf('day').toDate();
}

/**
 * Checks whether candidateDate is strictly before baseDate (comparing by start of day).
 */
export function isDateBefore(
  candidateDate: string | Date,
  baseDate: string | Date
): boolean {
  if (!candidateDate || !baseDate) return false;
  const candidate = moment(candidateDate).startOf('day');
  const base = moment(baseDate).startOf('day');
  if (!candidate.isValid() || !base.isValid()) return false;
  return candidate.isBefore(base);
}

/**
 * Checks whether candidateDate is on or after baseDate (comparing by start of day).
 */
export function isDateAfterOrEqual(
  candidateDate: string | Date,
  baseDate: string | Date
): boolean {
  if (!candidateDate || !baseDate) return true;
  const candidate = moment(candidateDate).startOf('day');
  const base = moment(baseDate).startOf('day');
  if (!candidate.isValid() || !base.isValid()) return true;
  return candidate.isSameOrAfter(base);
}

export { moment };
