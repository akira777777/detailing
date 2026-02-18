/**
 * Utility function to concatenate class names
 * Filters out falsy values and joins with spaces
 */

type ClassName = string | false | null | undefined | 0 | '';

/**
 * Concatenates class names, filtering out falsy values
 * @param classes - Class names to concatenate
 * @returns Combined class string
 * 
 * @example
 * cn('base-class', isActive && 'active', 'another-class')
 * // Returns: 'base-class active another-class' (if isActive is true)
 */
export const cn = (...classes: ClassName[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Generates tailwind class for focus ring
 * @returns Focus ring classes
 */
export const focusRing = (): string =>
  'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background-light dark:focus-within:ring-offset-background-dark';
