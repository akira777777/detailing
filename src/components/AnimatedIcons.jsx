import React from 'react';

import { motion } from 'framer-motion';

// Optimization: Static variants moved outside component
const LOGO_CONTAINER_VARIANTS = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const LOGO_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100 },
  },
};

export const AnimatedLogo = ({ className = '' }) => {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={`w-12 h-12 ${className}`}
      variants={LOGO_CONTAINER_VARIANTS}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Main circle */}
      <motion.circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        variants={LOGO_ITEM_VARIANTS}
      />

      {/* Inner element */}
      <motion.g variants={LOGO_ITEM_VARIANTS}>
        <motion.circle cx="50" cy="30" r="8" fill="currentColor" />
        <motion.circle cx="35" cy="55" r="8" fill="currentColor" />
        <motion.circle cx="65" cy="55" r="8" fill="currentColor" />
      </motion.g>

      {/* Connection lines */}
      <motion.g
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.6"
        variants={LOGO_ITEM_VARIANTS}
      >
        <motion.line x1="50" y1="38" x2="35" y2="47" />
        <motion.line x1="50" y1="38" x2="65" y2="47" />
        <motion.line x1="35" y1="63" x2="65" y2="63" />
      </motion.g>
    </motion.svg>
  );
};

// Animated heart icon
export const AnimatedHeartIcon = ({ className = '', filled = false }) => {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={className}
      initial={{ scale: 0.8 }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
      animate={filled ? { scale: [1, 1.2, 1] } : {}}
      transition={filled ? { duration: 0.3 } : {}}
    >
      <motion.path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
};

// Animated star icon
export const AnimatedStarIcon = ({ className = '', active = false }) => {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={className}
      animate={active ? { rotate: 360 } : {}}
      transition={{ duration: 0.5, type: 'spring' }}
      whileHover={{ scale: 1.15 }}
    >
      <motion.path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
};

const ARROW_ROTATIONS = {
  right: 0,
  down: 90,
  left: 180,
  up: 270,
};

// Animated arrow icon
export const AnimatedArrowIcon = ({ className = '', direction = 'right' }) => {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={className}
      animate={{ x: [0, 4, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      style={{ rotate: ARROW_ROTATIONS[direction] }}
    >
      <motion.path
        d="M5 12h14M12 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </motion.svg>
  );
};
