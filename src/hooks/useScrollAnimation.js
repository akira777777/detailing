import { useEffect, useRef, useState } from 'react';

// Maps stringified options to the observer instance
const observers = new Map();
// Maps the observer instance to a map of elements -> callbacks
const observerCallbacks = new WeakMap();

const handleIntersections = (entries, observer) => {
  const callbacks = observerCallbacks.get(observer);
  if (!callbacks) return;

  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const callback = callbacks.get(entry.target);
      if (callback) {
        callback(true);
        // Once visible, we unobserve (trigger once behavior)
        observer.unobserve(entry.target);
        callbacks.delete(entry.target);
      }
    }
  });
};

const getObserver = (options) => {
  // Default threshold is 0.1 in the original code logic
  const effectiveOptions = { threshold: 0.1, ...options };
  const { root, ...rest } = effectiveOptions;

  // If root is provided, we create a dedicated observer (no caching for simplicity/safety)
  // as WeakMap keys must be objects and JSON.stringify fails on DOM elements.
  if (root) {
    const observer = new IntersectionObserver(handleIntersections, effectiveOptions);
    observerCallbacks.set(observer, new Map());
    return observer;
  }

  // Create a stable key for the options
  // Sort keys to ensure deterministic stringification
  const key = JSON.stringify(rest, Object.keys(rest).sort());

  if (!observers.has(key)) {
    const observer = new IntersectionObserver(handleIntersections, effectiveOptions);
    observerCallbacks.set(observer, new Map());
    observers.set(key, observer);
  }

  return observers.get(key);
};

export const useScrollAnimation = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Serialize options to avoid re-running effect on every render if options is a new object.
  // We exclude 'root' from stringification as it is usually a DOM element.
  const optionsKey = JSON.stringify(options, (key, val) => {
    if (key === 'root') return undefined;
    return val;
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = getObserver(options);
    const callbacks = observerCallbacks.get(observer);

    if (callbacks) {
      callbacks.set(element, setIsVisible);
      observer.observe(element);
    }

    return () => {
      if (callbacks) {
        callbacks.delete(element);
      }
      observer.unobserve(element);
    };
    // We intentionally exclude 'options' from dependencies to avoid re-running on identity change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey, options.root]);

  return { ref, isVisible };
};

export const useParallax = (speed = 0.5) => {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const elementTop = rect.top;
        const scrollAmount = window.innerHeight - elementTop;
        setOffset(scrollAmount * speed);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
