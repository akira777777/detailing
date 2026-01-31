import React, { useRef } from 'react';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// Компонент с эффектом появления при скролле
export const ScrollReveal = ({ 
  children, 
  direction = 'up',
  delay = 0,
  className = ''
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  const directions = {
    up: { hidden: { opacity: 0, y: 100 }, visible: { opacity: 1, y: 0 } },
    down: { hidden: { opacity: 0, y: -100 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -100 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0 } },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={directions[direction]}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Компонент с эффектом масштабирования при скролле
export const ScrollScale = ({ children, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

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

// Компонент с эффектом вращения при скролле
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

// Компонент с параллакс эффектом
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

// Компонент с анимацией счётчика при скролле
export const CountUp = ({ 
  from = 0, 
  to = 100, 
  duration = 2,
  className = ''
}) => {
  const ref = useRef(null);
  const [count, setCount] = React.useState(from);
  const isInView = useInView(ref, { once: true });

  React.useEffect(() => {
    if (!isInView) return;

    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(from + (to - from) * progress));
        requestAnimationFrame(animate);
      } else {
        setCount(to);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, from, to, duration]);

  return <span ref={ref} className={className}>{count.toLocaleString()}</span>;
};

// Компонент с анимацией линии при скролле
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

// Компонент с эффектом размытия при скролле
export const ScrollBlur = ({ children, className = '' }) => {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 500], [0, 10]);

  return (
    <motion.div
      ref={ref}
      style={{ filter: blur.get() !== 0 ? `blur(${blur}px)` : 'blur(0px)' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// AosReveal - refactored to use Framer Motion instead of AOS
export const AosReveal = ({ 
  children, 
  animation = 'fade-up',
  duration = 800,
  delay = 0,
  className = ''
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  // Map AOS animation names to Framer Motion variants
  const animations = {
    'fade-up': { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } },
    'fade-down': { hidden: { opacity: 0, y: -50 }, visible: { opacity: 1, y: 0 } },
    'fade-left': { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } },
    'fade-right': { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
    'zoom-in': { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } },
    'zoom-out': { hidden: { opacity: 0, scale: 1.2 }, visible: { opacity: 1, scale: 1 } },
    'flip-up': { hidden: { opacity: 0, rotateX: 90 }, visible: { opacity: 1, rotateX: 0 } },
    'flip-down': { hidden: { opacity: 0, rotateX: -90 }, visible: { opacity: 1, rotateX: 0 } },
  };

  const variant = animations[animation] || animations['fade-up'];

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

// Компонент для стикирующих элементов с анимацией
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
