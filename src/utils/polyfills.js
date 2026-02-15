/**
 * Polyfills for cross-browser compatibility
 * These are inline implementations to avoid external dependencies
 */

// Check if polyfills are needed
const needsPolyfills = () => {
  return (
    typeof window !== 'undefined' &&
    (!window.ResizeObserver || !window.IntersectionObserver)
  );
};

/**
 * Load polyfills - now using inline implementations only
 */
export async function loadPolyfills() {
  // Skip if all features are natively supported
  if (!needsPolyfills()) {
    return Promise.resolve();
  }

  const polyfills = [];

  // IntersectionObserver polyfill for Safari < 12.1
  if (typeof window !== 'undefined' && !window.IntersectionObserver) {
    const ioPkg = 'intersection-observer';
    polyfills.push(
      import(/* @vite-ignore */ ioPkg)
        .then(() => console.log('Loaded IntersectionObserver polyfill'))
        .catch(() => {
          // Polyfill package not installed - provide minimal fallback
          console.warn('IntersectionObserver polyfill not available, using fallback');
          window.IntersectionObserver = class IntersectionObserver {
            constructor(callback) {
              this.callback = callback;
            }
            observe() {}
            unobserve() {}
            disconnect() {}
          };
        })
    );
  }

  // ResizeObserver polyfill for Safari < 13.1
  if (typeof window !== 'undefined' && !window.ResizeObserver) {
    const roPkg = 'resize-observer-polyfill';
    polyfills.push(
      import(/* @vite-ignore */ roPkg)
        .then(module => {
          window.ResizeObserver = module.default || module;
          console.log('Loaded ResizeObserver polyfill');
        })
        .catch(() => {
          // Polyfill package not installed - provide minimal fallback
          console.warn('ResizeObserver polyfill not available, using fallback');
          window.ResizeObserver = class ResizeObserver {
            constructor(callback) {
              this.callback = callback;
            }
            observe() {}
            unobserve() {}
            disconnect() {}
          };
        })
    );
  }

  // Smooth scroll polyfill for older browsers
  if (typeof window !== 'undefined' && !('scrollBehavior' in document.documentElement.style)) {
    const ssPkg = 'smoothscroll-polyfill';
    polyfills.push(
      import(/* @vite-ignore */ ssPkg)
        .then(module => {
          module.polyfill();
          console.log('Loaded smooth scroll polyfill');
        })
        .catch(() => {
          // Polyfill not critical - scroll will just be instant
          console.warn('Smooth scroll polyfill not available');
        })
    );
  }

  await Promise.all(polyfills);
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
