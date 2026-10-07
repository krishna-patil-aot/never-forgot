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

export { moment };
