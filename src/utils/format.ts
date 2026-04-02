/**
 * Format a monetary amount to always show exactly 2 decimal places.
 * Handles null, undefined, empty string, and non-numeric values gracefully.
 */
export function fmtAmount(n: number | string | null | undefined): string {
  const num = parseFloat(String(n ?? 0));
  if (isNaN(num)) return "0.00";
  return num.toFixed(2);
}

/**
 * Format a count/number with K/M suffix for large values.
 * Examples: 1100 → "1.1k", 1110 → "1.11k", 2110000 → "2.11m", 999 → "999"
 */
export function fmtCount(n: number | string | null | undefined): string {
  const num = parseFloat(String(n ?? 0));
  if (isNaN(num)) return "0";
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "m";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(2).replace(/\.?0+$/, "") + "k";
  }
  return String(Math.floor(num));
}
