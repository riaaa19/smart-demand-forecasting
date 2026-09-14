/**
 * Format a number using the Indian numbering system.
 * e.g. 13890272 → "1,38,90,272"
 *      3813689 → "38,13,689"
 *      17666.17 → "17,666.17"
 */
export function formatIndianNumber(num: number, decimals = 0): string {
  if (num === null || num === undefined || !isFinite(num)) return '—';

  const fixed = num.toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');
  const isNeg = intPart.startsWith('-');
  const digits = isNeg ? intPart.slice(1) : intPart;

  let formatted: string;
  if (digits.length <= 3) {
    formatted = digits;
  } else {
    const last3 = digits.slice(-3);
    const remaining = digits.slice(0, -3);
    const pairs = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    formatted = pairs + ',' + last3;
  }

  const prefix = isNeg ? '-' : '';
  const suffix = decPart !== undefined ? '.' + decPart : '';
  return prefix + formatted + suffix;
}

/**
 * Format for chart axis ticks — Indian number system
 */
export function formatAxisTick(value: number): string {
  if (Math.abs(value) >= 100000) {
    return formatIndianNumber(Math.round(value));
  }
  return formatIndianNumber(value);
}

/**
 * Format percentage with specified decimal places
 */
export function formatPercent(value: number, decimals = 2): string {
  if (!isFinite(value)) return '—';
  return value.toFixed(decimals) + '%';
}
