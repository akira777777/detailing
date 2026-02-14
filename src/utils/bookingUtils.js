/**
 * Utility functions for booking related logic.
 */

/**
 * Returns the display name for a package based on selected modules.
 * @param {Object} modules - The modules from booking store.
 * @returns {string}
 */
export const getPackageName = (modules, t) => {
  const selected = Object.keys(modules).filter(k => modules[k]);
  if (selected.length === 0) return t ? t('calculator.step_3.modules.basic.title', 'Basic Detailing') : 'Basic Detailing';
  if (selected.length === 1) {
    if (selected[0] === 'coating') return t ? t('calculator.step_3.modules.coating.title') : 'Ceramic Coating Package';
    if (selected[0] === 'correction') return t ? t('calculator.step_3.modules.correction.title') : 'Paint Correction Package';
    return t ? t('calculator.step_3.modules.interior.title') : 'Interior Detail Package';
  }
  return t ? t('calculator.step_3.modules.custom.title', 'Custom Concours Package') : 'Custom Concours Package';
};
