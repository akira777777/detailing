import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

// ============================================================================
// Spring Physics Configuration
// ============================================================================

const DEFAULT_SPRING_CONFIG = {
  stiffness: 100,
  damping: 10,
  mass: 1,
  precision: 0.01,
};

/**
 * Calculate spring physics for natural motion
 * @param {number} current - Current value
 * @param {number} target - Target value
 * @param {number} velocity - Current velocity
 * @param {Object} config - Spring configuration
 * @returns {Object} New value and velocity
 */
const calculateSpring = (current, target, velocity, config) => {
  const { stiffness, damping, mass } = { ...DEFAULT_SPRING_CONFIG, ...config };
  
  const displacement = current - target;
  const springForce = -stiffness * displacement;
  const dampingForce = -damping * velocity;
  const acceleration = (springForce + dampingForce) / mass;
  
  const newVelocity = velocity + acceleration;
  const newValue = current + newVelocity;
  
  return { value: newValue, velocity: newVelocity };
};

/**
 * Check if spring has reached equilibrium
 */
const isSpringAtRest = (value, target, velocity, precision) => {
  return Math.abs(value - target) < precision && Math.abs(velocity) < precision;
};

// ============================================================================
// useReducedMotion Hook
// ============================================================================

/**
 * Hook to detect user's prefers-reduced-motion preference
 * @returns {boolean} True if user prefers reduced motion
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// ============================================================================
// usePageVisibility Hook (Internal)
// ============================================================================

/**
 * Hook to track page visibility for performance optimization
 * @returns {boolean} True if page is visible
 */
const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return isVisible;
};

// ============================================================================
// useRafAnimation Hook
// ============================================================================

/**
 * Hook for smooth animations using requestAnimationFrame
 * @param {Object} options - Animation options
 * @param {number} options.from - Starting value
 * @param {number} options.to - Target value
 * @param {number} options.duration - Duration in milliseconds
 * @param {string} options.easing - Easing function name ('linear', 'easeInOut', 'easeOut', 'spring')
 * @param {Object} options.springConfig - Spring physics configuration
 * @param {boolean} options.autoStart - Whether to start animation automatically
 * @param {Function} options.onUpdate - Callback on each frame
 * @param {Function} options.onComplete - Callback when animation completes
 * @returns {Object} Animation state and controls
 */
export const useRafAnimation = (options = {}) => {
  const {
    from = 0,
    to = 100,
    duration = 500,
    easing = 'easeInOut',
    springConfig = DEFAULT_SPRING_CONFIG,
    autoStart = true,
    onUpdate,
    onComplete,
  } = options;

  const [value, setValue] = useState(from);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const velocityRef = useRef(0);
  const currentValueRef = useRef(from);
  
  const prefersReducedMotion = useReducedMotion();
  const isPageVisible = usePageVisibility();

  // Easing functions
  const easingFunctions = useMemo(() => ({
    linear: (t) => t,
    easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeOut: (t) => t * (2 - t),
    easeIn: (t) => t * t,
    spring: null, // Handled separately
  }), []);

  const start = useCallback(() => {
    // If reduced motion is preferred, jump to end
    if (prefersReducedMotion) {
      setValue(to);
      currentValueRef.current = to;
      setIsComplete(true);
      onComplete?.();
      return;
    }

    setIsAnimating(true);
    setIsComplete(false);
    startTimeRef.current = null;
    velocityRef.current = 0;
    currentValueRef.current = from;
    setValue(from);

    const animate = (timestamp) => {
      if (!isPageVisible) {
        // Pause animation when tab is hidden
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      if (easing === 'spring') {
        // Spring physics animation
        const result = calculateSpring(
          currentValueRef.current,
          to,
          velocityRef.current,
          springConfig
        );
        
        currentValueRef.current = result.value;
        velocityRef.current = result.velocity;
        
        setValue(result.value);
        onUpdate?.(result.value);

        if (isSpringAtRest(result.value, to, result.velocity, springConfig.precision || 0.01)) {
          setValue(to);
          setIsAnimating(false);
          setIsComplete(true);
          onComplete?.();
          return;
        }
      } else {
        // Duration-based animation
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const easingFn = easingFunctions[easing] || easingFunctions.easeInOut;
        const easedProgress = easingFn(progress);
        const currentValue = from + (to - from) * easedProgress;
        
        currentValueRef.current = currentValue;
        setValue(currentValue);
        onUpdate?.(currentValue);

        if (progress >= 1) {
          setValue(to);
          setIsAnimating(false);
          setIsComplete(true);
          onComplete?.();
          return;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [from, to, duration, easing, springConfig, prefersReducedMotion, isPageVisible, onUpdate, onComplete, easingFunctions]);

  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsAnimating(false);
  }, []);

  const reset = useCallback(() => {
    stop();
    setValue(from);
    currentValueRef.current = from;
    setIsComplete(false);
  }, [from, stop]);

  // Auto-start animation
  useEffect(() => {
    if (autoStart) {
      start();
    }
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [autoStart, start]);

  return {
    value,
    isAnimating,
    isComplete,
    start,
    stop,
    reset,
  };
};

// ============================================================================
// useIntersectionAnimation Hook
// ============================================================================

// Shared observer cache to prevent memory leaks
const observerCache = new Map();

/**
 * Hook to trigger animations only when element is visible
 * @param {Object} options - Intersection Observer options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.rootMargin - Margin around root
 * @param {Element} options.root - Root element
 * @param {boolean} options.triggerOnce - Whether to trigger only once
 * @param {Function} options.onEnter - Callback when element enters viewport
 * @param {Function} options.onLeave - Callback when element leaves viewport
 * @returns {Object} Ref and visibility state
 */
export const useIntersectionAnimation = (options = {}) => {
  const {
    threshold = 0.2,
    rootMargin = '0px',
    root = null,
    triggerOnce = true,
    onEnter,
    onLeave,
  } = options;

  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const callbackRef = useRef({ onEnter, onLeave });

  // Update callback ref to avoid re-creating observer
  useEffect(() => {
    callbackRef.current = { onEnter, onLeave };
  }, [onEnter, onLeave]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Don't observe if already triggered and triggerOnce is true
    if (triggerOnce && hasTriggered) return;

    // Create cache key
    const cacheKey = JSON.stringify({ threshold, rootMargin, root: root?.toString() });
    
    let observer = observerCache.get(cacheKey);
    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const isIntersecting = entry.isIntersecting;
            
            if (isIntersecting) {
              setIsVisible(true);
              callbackRef.current.onEnter?.(entry);
              
              if (triggerOnce) {
                setHasTriggered(true);
                observer.unobserve(entry.target);
              }
            } else if (!triggerOnce) {
              setIsVisible(false);
              callbackRef.current.onLeave?.(entry);
            }
          });
        },
        { threshold, rootMargin, root }
      );
      observerCache.set(cacheKey, observer);
    }

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, root, triggerOnce, hasTriggered]);

  return { ref, isVisible, hasTriggered };
};

// ============================================================================
// useSpring Hook (Convenience wrapper)
// ============================================================================

/**
 * Hook for spring-based animations
 * @param {Object} options - Spring animation options
 * @param {number} options.from - Starting value
 * @param {number} options.to - Target value
 * @param {Object} options.config - Spring configuration
 * @param {boolean} options.autoStart - Whether to start automatically
 * @returns {Object} Spring animation state and controls
 */
export const useSpring = (options = {}) => {
  const springOptions = {
    ...options,
    easing: 'spring',
  };

  return useRafAnimation(springOptions);
};

// ============================================================================
// useAnimatedValue Hook (For continuous value animation)
// ============================================================================

/**
 * Hook for animating a value with smooth transitions
 * @param {number} targetValue - The target value to animate to
 * @param {Object} options - Animation options
 * @returns {number} Current animated value
 */
export const useAnimatedValue = (targetValue, options = {}) => {
  const {
    duration = 300,
    easing = 'easeOut',
    springConfig = DEFAULT_SPRING_CONFIG,
  } = options;

  const [currentValue, setCurrentValue] = useState(targetValue);
  const rafRef = useRef(null);
  const startValueRef = useRef(targetValue);
  const startTimeRef = useRef(null);
  const targetRef = useRef(targetValue);
  const velocityRef = useRef(0);
  
  const prefersReducedMotion = useReducedMotion();
  const isPageVisible = usePageVisibility();

  useEffect(() => {
    // If reduced motion, jump to target immediately
    if (prefersReducedMotion) {
      setCurrentValue(targetValue);
      startValueRef.current = targetValue;
      return;
    }

    targetRef.current = targetValue;
    startValueRef.current = currentValue;
    startTimeRef.current = null;
    velocityRef.current = 0;

    const easingFunctions = {
      linear: (t) => t,
      easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
      easeOut: (t) => t * (2 - t),
      easeIn: (t) => t * t,
    };

    const animate = (timestamp) => {
      if (!isPageVisible) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      if (easing === 'spring') {
        const result = calculateSpring(
          currentValue,
          targetValue,
          velocityRef.current,
          springConfig
        );
        
        velocityRef.current = result.velocity;
        setCurrentValue(result.value);

        if (!isSpringAtRest(result.value, targetValue, result.velocity, springConfig.precision || 0.01)) {
          rafRef.current = requestAnimationFrame(animate);
        }
      } else {
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const easingFn = easingFunctions[easing] || easingFunctions.easeOut;
        const easedProgress = easingFn(progress);
        
        const newValue = startValueRef.current + (targetValue - startValueRef.current) * easedProgress;
        setCurrentValue(newValue);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      }
    };

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [targetValue, duration, easing, springConfig, prefersReducedMotion, isPageVisible]);

  return currentValue;
};

// ============================================================================
// useStaggeredAnimation Hook (For animating multiple elements)
// ============================================================================

/**
 * Hook for staggered animations on multiple elements
 * @param {number} count - Number of elements to animate
 * @param {Object} options - Stagger options
 * @param {number} options.staggerDelay - Delay between each element in ms
 * @param {number} options.baseDelay - Initial delay in ms
 * @returns {Object} Animation states and refs
 */
export const useStaggeredAnimation = (count, options = {}) => {
  const { staggerDelay = 50, baseDelay = 0 } = options;
  const [visibleItems, setVisibleItems] = useState(new Set());
  const timeoutsRef = useRef([]);

  const start = useCallback(() => {
    // Clear any existing timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setVisibleItems(new Set());

    for (let i = 0; i < count; i++) {
      const timeout = setTimeout(() => {
        setVisibleItems((prev) => new Set([...prev, i]));
      }, baseDelay + i * staggerDelay);
      
      timeoutsRef.current.push(timeout);
    }
  }, [count, staggerDelay, baseDelay]);

  const reset = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setVisibleItems(new Set());
  }, []);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const isItemVisible = useCallback((index) => visibleItems.has(index), [visibleItems]);

  return {
    start,
    reset,
    isItemVisible,
    visibleCount: visibleItems.size,
    isComplete: visibleItems.size === count,
  };
};

// ============================================================================
// Default Export
// ============================================================================

export default {
  useRafAnimation,
  useReducedMotion,
  useIntersectionAnimation,
  useSpring,
  useAnimatedValue,
  useStaggeredAnimation,
};
