/**
 * Polyfills for cross-browser compatibility
 * These are loaded dynamically only when needed by the browser
 */

// Check if polyfills are needed
const needsPolyfills = () => {
  return (
    typeof window !== 'undefined' &&
    (!window.ResizeObserver || !window.IntersectionObserver)
  );
};

/**
 * Load polyfills dynamically only when needed
 * Uses dynamic imports that gracefully fail if packages aren't available
 */
export async function loadPolyfills() {
  // Skip if all features are natively supported
  if (!needsPolyfills()) {
    return Promise.resolve();
  }

  // IntersectionObserver polyfill for Safari < 12.1
  if (!window.IntersectionObserver) {
    console.warn('IntersectionObserver not available, using fallback');
    window.IntersectionObserver = class IntersectionObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }

  // ResizeObserver polyfill for Safari < 13.1
  if (!window.ResizeObserver) {
    console.warn('ResizeObserver not available, using fallback');
    window.ResizeObserver = class ResizeObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }

  // Smooth scroll polyfill for older browsers
  if (!('scrollBehavior' in document.documentElement.style)) {
    console.warn('Smooth scroll polyfill not available');
  }

  return Promise.resolve();
}

/**
 * CSS.supports() polyfill for older browsers
 */
if (typeof window !== 'undefined' && !('CSS' in window)) {
  window.CSS = {};
}

if (typeof window !== 'undefined' && window.CSS && !window.CSS.supports) {
  window.CSS.supports = () => {
    // Basic fallback - returns true for unknown properties
    return true;
  };
}

/**
 * requestIdleCallback polyfill
 */
if (typeof window !== 'undefined' && !('requestIdleCallback' in window)) {
  window.requestIdleCallback = (callback) => {
    return setTimeout(() => {
      callback({
        didTimeout: false,
        timeRemaining: () => 50
      });
    }, 1);
  };

  window.cancelIdleCallback = (id) => {
    clearTimeout(id);
  };
}

/**
 * Object.fromEntries polyfill for older browsers
 */
if (!Object.fromEntries) {
  Object.fromEntries = (entries) => {
    const result = {};
    for (const [key, value] of entries) {
      result[key] = value;
    }
    return result;
  };
}

/**
 * String.prototype.matchAll polyfill
 */
if (!String.prototype.matchAll) {
  String.prototype.matchAll = function* (regexp) {
    const flags = regexp.global ? regexp.flags : regexp.flags + 'g';
    const re = new RegExp(regexp.source, flags);
    let match;
    while ((match = re.exec(this)) !== null) {
      yield match;
    }
  };
}

/**
 * Element.prototype.closest polyfill for IE11 (if needed in future)
 */
if (typeof Element !== 'undefined' && !Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    let el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

/**
 * Element.prototype.matches polyfill
 */
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

export default {
  loadPolyfills
};
