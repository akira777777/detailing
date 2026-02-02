/**
 * Centralized Intl formatters to avoid expensive re-instantiation in components and loops.
 * Defined at the module level for maximum performance.
 */

export const monthYearFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric'
});

export const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric'
});

export const shortMonthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short'
});

export const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});
