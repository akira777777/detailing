
const formattersCache = {};

function getCachedFormatter(locale, options) {
  const key = JSON.stringify({ locale, options });
  if (!formattersCache[key]) {
    formattersCache[key] = new Intl.DateTimeFormat(locale, options);
  }
  return formattersCache[key];
}

export const formatMonthYear = (date, locale = 'en-US') => {
  return getCachedFormatter(locale, { month: 'long', year: 'numeric' }).format(date);
};

export const formatFullDate = (date, locale = 'en-US') => {
  return getCachedFormatter(locale, { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
};

export const formatShortMonth = (date, locale = 'en-US') => {
  return getCachedFormatter(locale, { month: 'short' }).format(date);
};

export const formatShortDate = (date, locale = 'en-US') => {
  return getCachedFormatter(locale, { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

export const formatDateWithWeekday = (date, locale = 'en-US') => {
  return getCachedFormatter(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const formatWeekdayShort = (date, locale = 'en-US') => {
  return getCachedFormatter(locale, { weekday: 'short' }).format(date);
};
