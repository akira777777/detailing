import { useState, useEffect, useRef } from 'react';

/**
 * Shared IntersectionObserver pool to minimize main-thread overhead.
 */
const observers = new Map();

export const useScrollAnimation = ({ amount = 0.3, once = false } = {}) => {
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Create a stable key for the observer based on threshold
    const threshold = amount;
    const options = { threshold, root: null, rootMargin: '0px' };
    const key = JSON.stringify({ threshold, rootMargin: options.rootMargin });

    let observerEntry = observers.get(key);

    if (!observerEntry) {
      const instance = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const elementCallbacks = entry.target.__scroll_callbacks;
          if (elementCallbacks) {
            elementCallbacks.forEach((cb) => cb(entry.isIntersecting));
          }
        });
      }, options);

      observerEntry = { instance, usageCount: 0 };
      observers.set(key, observerEntry);
    }

    const handleIntersect = (isIntersecting) => {
      if (isIntersecting) {
        setIsInView(true);
        if (once) {
          cleanup();
        }
      } else if (!once) {
        setIsInView(false);
      }
    };

    const cleanup = () => {
      if (!element.__scroll_callbacks) return;

      element.__scroll_callbacks.delete(handleIntersect);
      if (element.__scroll_callbacks.size === 0) {
        observerEntry.instance.unobserve(element);
        delete element.__scroll_callbacks;
      }

      observerEntry.usageCount--;
      if (observerEntry.usageCount === 0) {
        observerEntry.instance.disconnect();
        observers.delete(key);
      }
    };

    if (!element.__scroll_callbacks) {
      element.__scroll_callbacks = new Set();
      observerEntry.instance.observe(element);
    }

    element.__scroll_callbacks.add(handleIntersect);
    observerEntry.usageCount++;

    return cleanup;
  }, [amount, once]);

  return { ref: elementRef, isInView };
};

export const useParallax = (speed = 0.5) => {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let ticking = false;
    let rafId = null;

    const handleScroll = () => {
      if (!ticking) {
        rafId = window.requestAnimationFrame(() => {
          if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const elementTop = rect.top;
            const scrollAmount = window.innerHeight - elementTop;
            setOffset(scrollAmount * speed);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [speed]);

  return { ref, offset };
};

export const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
};
