/**
 * Application-wide configuration constants
 */

/**
 * Application metadata
 */
export const APP_CONFIG = {
  name: 'Luxe Detail',
  tagline: 'Modern Automotive Care',
  description: 'Premium automotive detailing services',
  url: 'https://luxedetail.com',
  email: 'info@luxedetail.com',
  phone: '+1 (555) 123-4567',
} as const;

/**
 * Theme configuration
 */
export const THEME_CONFIG = {
  storageKey: 'luxe-detail-theme',
  defaultTheme: 'dark' as const,
} as const;

/**
 * Toast notification configuration
 */
export const TOAST_CONFIG = {
  duration: {
    success: 3000,
    error: 5000,
    info: 3000,
    warning: 4000,
  },
  maxToasts: 5,
} as const;

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  theme: 'luxe-detail-theme',
  bookingConfig: 'detailingConfig',
  userPreferences: 'luxe-detail-preferences',
} as const;

/**
 * API endpoints (for backend integration)
 */
export const API_ENDPOINTS = {
  bookings: '/api/bookings',
  pricing: '/api/pricing',
  availability: '/api/availability',
} as const;

/**
 * Animation durations (milliseconds)
 */
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

/**
 * Breakpoints (must match Tailwind config)
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Type exports
 */
export type Theme = typeof THEME_CONFIG.defaultTheme;
export type Breakpoint = keyof typeof BREAKPOINTS;
export type ToastType = keyof typeof TOAST_CONFIG.duration;
