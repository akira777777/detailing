import React, { useRef } from 'react';

import { motion, useScroll, useTransform, useInView, useMotionValue, animate } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Optimization: Static variants moved outside component to prevent recreation on every render
const REVEAL_DIRECTIONS = {
  up: { hidden: { opacity: 0, y: 100 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -100 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -100 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0 } },
};

// Component with reveal effect on scroll - Optimized with shared IntersectionObserver
export const ScrollReveal = ({ 
  children, 
  direction = 'up',
  delay = 0,
  once = true,
  className = ''
}) => {
  // Fix: Destructure isInView from useScrollAnimation (was isVisible)
  const { ref, isInView } = useScrollAnimation({ once, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={REVEAL_DIRECTIONS[direction]}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Component with scaling effect on scroll - Optimized with shared IntersectionObserver
export const ScrollScale = ({ children, once = true, className = '' }) => {
  // Fix: Destructure isInView from useScrollAnimation (was isVisible)
  const { ref, isInView } = useScrollAnimation({ once, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Component with rotation effect on scroll
export const ScrollRotate = ({ children, className = '' }) => {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 1000], [0, 360]);

  return (
    <motion.div
      ref={ref}
      style={{ rotate }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Component with parallax effect
export const Parallax = ({ children, offset = 50, className = '' }) => {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, offset]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Component with counter animation on scroll - Optimized with MotionValue to bypass React re-renders
export const CountUp = ({ 
  from = 0, 
  to = 100, 
  duration = 2,
  className = ''
}) => {
  const ref = useRef(null);
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());
  const isInView = useInView(ref, { once: true });

  React.useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, {
        duration,
        ease: "easeOut"
      });
      return controls.stop;
    }
  }, [isInView, count, to, duration]);

  return <motion.span ref={ref} className={className}>{rounded}</motion.span>;
};

// Component with line animation on scroll
export const ScrollLine = ({ className = '' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className={`h-1 bg-gradient-to-r from-blue-500 to-purple-500 origin-left ${className}`}>
      <motion.div
        style={{ scaleX }}
        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
      />
    </div>
  );
};

// Component with blur effect on scroll
export const ScrollBlur = ({ children, className = '' }) => {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const filter = useTransform(
    scrollY,
    [0, 500],
    ['blur(0px)', 'blur(10px)']
  );

  return (
    <motion.div
      ref={ref}
      style={{ filter }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// AosReveal - refactored to use shared IntersectionObserver and Framer Motion
// Optimization: Static mapping moved outside component to prevent recreation
const AOS_VARIANTS = {
  'fade-up': { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } },
  'fade-down': { hidden: { opacity: 0, y: -50 }, visible: { opacity: 1, y: 0 } },
  'fade-left': { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } },
  'fade-right': { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
  'zoom-in': { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } },
  'zoom-out': { hidden: { opacity: 0, scale: 1.2 }, visible: { opacity: 1, scale: 1 } },
  'flip-up': { hidden: { opacity: 0, rotateX: 90 }, visible: { opacity: 1, rotateX: 0 } },
  'flip-down': { hidden: { opacity: 0, rotateX: -90 }, visible: { opacity: 1, rotateX: 0 } },
};

// AosReveal - refactored to use Framer Motion instead of AOS
export const AosReveal = ({ 
  children, 
  animation = 'fade-up',
  duration = 800,
  delay = 0,
  once = true,
  className = ''
}) => {
  // Fix: Destructure isInView from useScrollAnimation (was isVisible)
  const { ref, isInView } = useScrollAnimation({ once, amount: 0.2 });

  const variant = AOS_VARIANTS[animation] || AOS_VARIANTS['fade-up'];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variant}
      transition={{ duration: duration / 1000, delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  );
};

// Component for sticky elements with animation
export const StickyScroll = ({ children, className = '' }) => {
  const ref = useRef(null);
  const { scrollY } = useScroll({ target: ref });
  const y = useTransform(scrollY, [0, 500], [0, -200]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={`sticky top-0 ${className}`}
    >
      {children}
    </motion.div>
  );
};
