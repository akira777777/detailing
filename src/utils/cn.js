/**
 * Utility function to concatenate class names
 * Filters out falsy values and joins with spaces
 * 
 * @param {...(string|false|null|undefined)} classes - Class names to concatenate
 * @returns {string} Combined class string
 * 
 * @example
 * cn('base-class', isActive && 'active', 'another-class')
 * // Returns: 'base-class active another-class' (if isActive is true)
 */
export const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
};

/**
 * Generates tailwind class for focus ring
 * @returns {string} Focus ring classes
 */
export const focusRing = () =>
    'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background-light dark:focus-within:ring-offset-background-dark';
