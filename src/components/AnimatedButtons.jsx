import React from 'react';

import { motion } from 'framer-motion';
import { useSound } from '../utils/soundManager';

// Animated button with micro-interactions
export const AnimatedButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  withSound = true,
}) => {
  const { playTone } = useSound();

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };

  const handleClick = (e) => {
    if (withSound && !disabled) {
      playTone(600, 50, 0.2);
    }
    onClick?.(e);
  };

  const rippleVariants = {
    tap: {
      opacity: [0.3, 0],
      scale: 2,
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.button
      className={`relative font-semibold rounded-lg transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={handleClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? 'tap' : undefined}
      variants={{
        tap: { scale: 0.98 }
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Ripple effect - pointer-events-none prevents double invocation issues */}
      <motion.span
        className="absolute inset-0 rounded-lg bg-white opacity-0 pointer-events-none"
        variants={rippleVariants}
        initial={false}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// Button with pulsing state
export const PulseButton = ({ children, onClick, className = '' }) => {
  const { playTone } = useSound();

  return (
    <motion.button
      className={`relative px-6 py-3 font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg ${className}`}
      onClick={(e) => {
        playTone(800, 100, 0.3);
        onClick?.(e);
      }}
      whileHover="hover"
      whileTap="tap"
      animate={{
        boxShadow: [
          '0 0 0 0 rgba(168, 85, 247, 0.7)',
          '0 0 0 10px rgba(168, 85, 247, 0)',
        ],
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <motion.span
        variants={{
          hover: { scale: 1.05 },
          tap: { scale: 0.95 }
        }}
        className="block pointer-events-none"
      >
        {children}
      </motion.span>
    </motion.button>
  );
};

// Button with loading state
export const LoadingButton = ({ 
  children, 
  isLoading = false, 
  onClick, 
  className = '' 
}) => {
  return (
    <motion.button
      className={`px-6 py-2 font-semibold rounded-lg bg-blue-500 text-white disabled:opacity-50 ${className}`}
      onClick={onClick}
      disabled={isLoading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="flex items-center justify-center gap-2"
        animate={isLoading ? { opacity: 0.7 } : {}}
      >
        {isLoading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
          />
        )}
        <span>{isLoading ? 'Loading...' : children}</span>
      </motion.div>
    </motion.button>
  );
};

// Interactive button with tooltip
export const TooltipButton = ({ 
  children, 
  tooltip, 
  onClick, 
  className = '' 
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div className="relative inline-block">
      <motion.button
        className={`px-4 py-2 font-semibold rounded-lg bg-blue-500 text-white ${className}`}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.button>

      {/* Tooltip */}
      <motion.div
        className="absolute bottom-full left-1/2 mb-2 px-3 py-1 text-sm text-white bg-gray-900 rounded whitespace-nowrap pointer-events-none"
        style={{ x: '-50%' }}
        animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
      >
        {tooltip}
        <div className="absolute top-full left-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"
          style={{ transform: 'translateX(-50%)' }}
        />
      </motion.div>
    </motion.div>
  );
};
