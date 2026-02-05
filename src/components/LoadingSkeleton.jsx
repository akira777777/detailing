import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonCard = () => (
  <div className="bg-white dark:bg-panel-dark rounded-xl p-6 border border-gray-200 dark:border-white/10 animate-pulse">
    <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/4 mb-4"></div>
    <div className="h-8 bg-gray-200 dark:bg-white/10 rounded w-3/4 mb-4"></div>
    <div className="h-20 bg-gray-200 dark:bg-white/10 rounded w-full"></div>
  </div>
);

export const SkeletonText = ({ lines = 3 }) => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: lines }).map((_, i) => (
      <div 
        key={i} 
        className="h-4 bg-gray-200 dark:bg-white/10 rounded"
        style={{ width: `${100 - (i * 15)}%` }}
      ></div>
    ))}
  </div>
);

export const SkeletonImage = ({ className = '' }) => (
  <div className={`bg-gray-200 dark:bg-white/10 animate-pulse ${className}`}>
    <div className="w-full h-full flex items-center justify-center">
      <svg 
        className="w-12 h-12 text-gray-300 dark:text-white/20" 
        fill="currentColor" 
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path 
          fillRule="evenodd" 
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
          clipRule="evenodd" 
        />
      </svg>
    </div>
  </div>
);

export const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark">
    <motion.div
      animate={{ 
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
      role="status"
      aria-label="Loading"
    />
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-4 text-gray-500 dark:text-white/50 text-sm font-medium"
    >
      Loading...
    </motion.p>
  </div>
);

export default { SkeletonCard, SkeletonText, SkeletonImage, PageLoader };
