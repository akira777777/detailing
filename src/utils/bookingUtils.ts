/**
 * Utility functions for booking related logic.
 */

import type { TFunction } from 'i18next';

interface Modules {
  [key: string]: boolean;
}

/**
 * Returns the display name for a package based on selected modules.
 */
export const getPackageName = (modules: Modules = {}, t: TFunction | null = null): string => {
  // Validate input
  if (typeof modules !== 'object' || modules === null) {
    return t ? t('calculator.step_3.modules.basic.title', 'Basic Detailing') : 'Basic Detailing';
  }

  const selected = Object.keys(modules).filter((k) => modules[k]);

  if (selected.length === 0) {
    return t ? t('calculator.step_3.modules.basic.title', 'Basic Detailing') : 'Basic Detailing';
  }

  if (selected.length === 1) {
    if (selected[0] === 'coating') {
      return t ? t('calculator.step_3.modules.coating.title', 'Ceramic Coating Package') : 'Ceramic Coating Package';
    }
    if (selected[0] === 'correction') {
      return t ? t('calculator.step_3.modules.correction.title', 'Paint Correction Package') : 'Paint Correction Package';
    }
    if (selected[0] === 'interior') {
      return t ? t('calculator.step_3.modules.interior.title', 'Interior Detail Package') : 'Interior Detail Package';
    }
  }

  return t ? t('calculator.step_3.modules.custom.title', 'Custom Concours Package') : 'Custom Concours Package';
};

/**
 * Validates a booking date
 */
export const isValidBookingDate = (date: unknown): boolean => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const bookingDate = new Date(date);
  bookingDate.setHours(0, 0, 0, 0);

  // Date must be in the future
  return bookingDate >= today;
};

/**
 * Validates a time slot string
 */
export const isValidTimeSlot = (time: unknown): boolean => {
  if (typeof time !== 'string') {
    return false;
  }

  const timeRegex = /^(0[0-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
  return timeRegex.test(time);
};

/**
 * Formats a date for API submission (YYYY-MM-DD)
 */
export const formatDateForApi = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date object');
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Formats a time string for display
 */
export const formatTimeForDisplay = (time: string): string => {
  if (!isValidTimeSlot(time)) {
    return '';
  }

  return time;
};

/**
 * Calculates the total price for a booking
 */
export const calculateTotalPrice = (
  basePrice: number,
  modulePrices: number[],
  conditionMultiplier: number
): number => {
  const modulesTotal = modulePrices.reduce((sum, price) => sum + price, 0);
  const subtotal = basePrice + modulesTotal;
  return subtotal * (1 + conditionMultiplier);
};
 * Utility functions for booking related logic.
 */

import type { TFunction } from 'i18next';

interface Modules {
  [key: string]: boolean;
}

/**
 * Returns the display name for a package based on selected modules.
 */
export const getPackageName = (modules: Modules = {}, t: TFunction | null = null): string => {
  // Validate input
  if (typeof modules !== 'object' || modules === null) {
    return t ? t('calculator.step_3.modules.basic.title', 'Basic Detailing') : 'Basic Detailing';
  }

  const selected = Object.keys(modules).filter((k) => modules[k]);

  if (selected.length === 0) {
    return t ? t('calculator.step_3.modules.basic.title', 'Basic Detailing') : 'Basic Detailing';
  }

  if (selected.length === 1) {
    if (selected[0] === 'coating') {
      return t ? t('calculator.step_3.modules.coating.title', 'Ceramic Coating Package') : 'Ceramic Coating Package';
    }
    if (selected[0] === 'correction') {
      return t ? t('calculator.step_3.modules.correction.title', 'Paint Correction Package') : 'Paint Correction Package';
    }
    if (selected[0] === 'interior') {
      return t ? t('calculator.step_3.modules.interior.title', 'Interior Detail Package') : 'Interior Detail Package';
    }
  }

  return t ? t('calculator.step_3.modules.custom.title', 'Custom Concours Package') : 'Custom Concours Package';
};

/**
 * Validates a booking date
 */
export const isValidBookingDate = (date: unknown): boolean => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const bookingDate = new Date(date);
  bookingDate.setHours(0, 0, 0, 0);

  // Date must be in the future
  return bookingDate >= today;
};

/**
 * Validates a time slot string
 */
export const isValidTimeSlot = (time: unknown): boolean => {
  if (typeof time !== 'string') {
    return false;
  }

  const timeRegex = /^(0[0-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
  return timeRegex.test(time);
};

/**
 * Formats a date for API submission (YYYY-MM-DD)
 */
export const formatDateForApi = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date object');
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Formats a time string for display
 */
export const formatTimeForDisplay = (time: string): string => {
  if (!isValidTimeSlot(time)) {
    return '';
  }

  return time;
};

/**
 * Calculates the total price for a booking
 */
export const calculateTotalPrice = (
  basePrice: number,
  modulePrices: number[],
  conditionMultiplier: number
): number => {
  const modulesTotal = modulePrices.reduce((sum, price) => sum + price, 0);
  const subtotal = basePrice + modulesTotal;
  return subtotal * (1 + conditionMultiplier);
};

