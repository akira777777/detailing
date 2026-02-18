/**
 * Application-wide configuration constants
 */

/**
 * Application metadata
 */
export const APP_CONFIG = {
    name: 'DETAILING SALON LUX',
    tagline: 'Premium Automotive Care Excellence',
    description: 'Professional automotive detailing services featuring precision paint correction, ceramic coating, and interior detailing',
    url: 'https://detailingsalonlux.com',
    email: 'info@detailingsalonlux.com',
    phone: '+420 XXX XXX XXX',
    owner: 'PAN STEPAN',
    developer: 'Artem Mikhailov'
};

/**
 * Theme configuration
 */
export const THEME_CONFIG = {
    storageKey: 'luxe-detail-theme',
    defaultTheme: 'dark'
};

/**
 * Toast notification configuration
 */
export const TOAST_CONFIG = {
    duration: {
        success: 3000,
        error: 5000,
        info: 3000,
        warning: 4000
    },
    maxToasts: 5
};

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
    theme: 'luxe-detail-theme',
    bookingConfig: 'detailingConfig',
    userPreferences: 'luxe-detail-preferences'
};

/**
 * API endpoints (for backend integration)
 */
export const API_ENDPOINTS = {
    bookings: '/api/bookings',
    pricing: '/api/pricing',
    availability: '/api/availability'
};

/**
 * Animation durations (milliseconds)
 */
export const ANIMATION_DURATION = {
    fast: 150,
    normal: 300,
    slow: 500
};

/**
 * Breakpoints (must match Tailwind config)
 */
export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
};
