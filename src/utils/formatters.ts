/**
 * Date formatting utilities with caching for performance
 */

interface FormatterCache {
  [key: string]: Intl.DateTimeFormat;
}

const formattersCache: FormatterCache = {};

interface DateTimeFormatOptions {
  locale?: string;
  options: Intl.DateTimeFormatOptions;
}

function getCachedFormatter(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = JSON.stringify({ locale, options });
  if (!formattersCache[key]) {
    formattersCache[key] = new Intl.DateTimeFormat(locale, options);
  }
  return formattersCache[key];
}

/**
 * Formats a date as "Month Year" (e.g., "January 2024")
 */
export const formatMonthYear = (date: Date, locale = 'en-US'): string => {
  return getCachedFormatter(locale, { month: 'long', year: 'numeric' }).format(date);
};

/**
 * Formats a date as "Month Day, Year" (e.g., "January 15, 2024")
 */
export const formatFullDate = (date: Date, locale = 'en-US'): string => {
  return getCachedFormatter(locale, { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
};

/**
 * Formats a date as abbreviated month (e.g., "Jan")
 */
export const formatShortMonth = (date: Date, locale = 'en-US'): string => {
  return getCachedFormatter(locale, { month: 'short' }).format(date);
};

/**
 * Formats a date as "Mon Day, Year" (e.g., "Jan 15, 2024")
 */
export const formatShortDate = (date: Date, locale = 'en-US'): string => {
  return getCachedFormatter(locale, { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

/**
 * Formats a number as currency
 */
export const formatCurrency = (amount: number, currency = 'USD', locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Formats a number with thousand separators
 */
export const formatNumber = (num: number, locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale).format(num);
};
