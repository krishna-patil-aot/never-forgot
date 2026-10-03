/**
 * Deterministic date formatter that produces identical strings in Node SSR and client browser environments.
 * Avoids toLocaleDateString() locale discrepancies that trigger React hydration mismatch errors.
 */
export function formatDisplayDate(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return String(dateInput);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = months[d.getUTCMonth()];
  const year = d.getUTCFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Format currency without server/client whitespace differences.
 */
export function formatCurrencyINR(amount: number): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `₹${formatted}`;
}
