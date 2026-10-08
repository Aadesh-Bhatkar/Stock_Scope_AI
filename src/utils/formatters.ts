import { Currency } from '../types/stock';

/**
 * Format currency amounts with proper currency symbol and decimals
 */
export function formatCurrency(
  value: number | null | undefined,
  currency: Currency = 'USD',
  decimals: number = 2
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'Not available';
  }

  const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

  // Format with locale
  const formatted = value.toLocaleString(currency === 'INR' ? 'en-IN' : 'en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${symbol}${formatted}`;
}

/**
 * Format price change with +/- sign
 */
export function formatChange(
  change: number | null | undefined,
  currency: Currency = 'USD'
): string {
  if (change === null || change === undefined || isNaN(change)) {
    return '—';
  }
  const prefix = change > 0 ? '+' : '';
  return `${prefix}${formatCurrency(change, currency)}`;
}

/**
 * Format percentage change with +/- sign
 */
export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '—';
  }
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

/**
 * Format volume into compact abbreviations (e.g. 52.3M, 1.2B)
 */
export function formatVolume(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) {
    return 'Not available';
  }

  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  }
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  }
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

/**
 * Format date timestamp to readable string
 */
export function formatDate(dateString: string | number): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return String(dateString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return String(dateString);
  }
}

/**
 * Format timestamp for real-time update indicators
 */
export function formatTimestamp(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    });
  } catch {
    return isoString;
  }
}
