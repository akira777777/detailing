/**
 * Utility functions for booking related logic.
 */

/**
 * Returns the display name for a package based on selected modules.
 * @param {Object} modules - The modules from booking store.
 * @returns {string}
 */
export const getPackageName = (modules) => {
  const selected = Object.keys(modules).filter(k => modules[k]);
  if (selected.length === 0) return 'Basic Detailing';
  if (selected.length === 1) {
      if (selected[0] === 'coating') return 'Ceramic Coating Package';
      if (selected[0] === 'correction') return 'Paint Correction Package';
      return 'Interior Detail Package';
  }
  return 'Custom Concours Package';
};
