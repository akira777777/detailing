import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useMotionValueEvent } from 'framer-motion';

/**
 * BeforeAfterSlider - High-performance slider component for comparing two images.
 * Optimized with Framer Motion values to avoid React re-renders during drag operations.
 * Uses CSS clip-path for efficient image revealing without layout recalculations.
 */
const BeforeAfterSlider = ({ beforeImage, afterImage, alt }) => {
  // Use MotionValue for position to update DOM directly without triggering component re-renders
  const sliderPosition = useMotionValue(50);
  const [isDragging, setIsDragging] = useState(false);
  const [ariaValueNow, setAriaValueNow] = useState(50);
  const containerRef = useRef(null);
  const rectRef = useRef(null);

  // Sync motion value with accessibility attributes.
  // When dragging, we update the DOM directly to maintain 60fps.
  // When not dragging (keyboard use), we use React state for clean updates.
  useMotionValueEvent(sliderPosition, "change", (latest) => {
    const rounded = Math.round(latest);
    if (isDragging) {
      if (containerRef.current) {
        containerRef.current.setAttribute('aria-valuenow', rounded.toString());
      }
    } else {
      setAriaValueNow(rounded);
    }
  });

  // Derive clipPath and handle position from the motion value
  // This allows the browser to handle the reveal effect efficiently
  const clipPath = useTransform(sliderPosition, (v) => `inset(0 ${100 - v}% 0 0)`);
  const left = useTransform(sliderPosition, (v) => `${v}%`);

  const handleMove = useCallback((clientX) => {
    // Use cached rect to avoid getBoundingClientRect reflows during mousemove
    const rect = rectRef.current;
    if (rect) {
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      sliderPosition.set(percentage);
    }
  }, [sliderPosition]);

  const handleDragStart = (clientX) => {
    if (containerRef.current) {
      // Cache the container dimensions only on drag start
      rectRef.current = containerRef.current.getBoundingClientRect();
      handleMove(clientX);
    }
    setIsDragging(true);
  };

  const handleMouseDown = (e) => handleDragStart(e.clientX);
  const handleTouchStart = (e) => handleDragStart(e.touches[0].clientX);

  const handleKeyDown = (e) => {
    const step = e.shiftKey ? 10 : 2;
    switch (e.key) {
      case 'ArrowLeft':
        sliderPosition.set(Math.max(0, sliderPosition.get() - step));
        break;
      case 'ArrowRight':
        sliderPosition.set(Math.min(100, sliderPosition.get() + step));
        break;
      case 'Home':
        sliderPosition.set(0);
        break;
      case 'End':
        sliderPosition.set(100);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) handleMove(e.clientX);
    };

    const handleTouchMove = (e) => {
      if (isDragging) handleMove(e.touches[0].clientX);
    };

    const handleStopDragging = () => {
      setIsDragging(false);
      setAriaValueNow(Math.round(sliderPosition.get()));
    };

    if (isDragging) {
      window.addEventListener('mouseup', handleStopDragging);
      window.addEventListener('touchend', handleStopDragging);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
    }

    return () => {
      window.removeEventListener('mouseup', handleStopDragging);
      window.removeEventListener('touchend', handleStopDragging);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDragging, handleMove, sliderPosition]);

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none cursor-ew-resize group outline-none focus-visible:ring-4 focus-visible:ring-primary/50 rounded-lg transition-shadow"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-label={`Before and after comparison for ${alt}. Use arrow keys to slide.`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={ariaValueNow}
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt={`After ${alt}`}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <div className="absolute top-4 right-4 bg-primary px-3 py-1 rounded text-white text-xs font-bold uppercase z-10 animate-pulse-soft">After</div>

      {/* Before Image (Foreground, clipped) */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden z-10"
        style={{ clipPath }}
      >
        <img
          src={beforeImage}
          alt={`Before ${alt}`}
          className="absolute inset-0 w-full h-full object-cover max-w-none group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded text-white text-xs font-bold uppercase z-10 animate-pulse-soft">Before</div>
      </motion.div>

      {/* Slider Handle and Separator */}
      <motion.div
        className="absolute inset-y-0 z-20 pointer-events-none"
        style={{ left }}
      >
        {/* Separator Line */}
        <div className="absolute inset-y-0 w-1 -translate-x-1/2 bg-primary shadow-[0_0_10px_rgba(0,145,255,0.5)]" />

        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-10 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(0,145,255,0.5)] hover:scale-125 active:scale-110 transition-transform animate-glow group-hover:shadow-[0_0_30px_rgba(0,145,255,0.8)]"
        >
          <span className="material-symbols-outlined text-white select-none transform rotate-90 animate-float">unfold_more</span>
        </div>
      </motion.div>

      {/* Indicator lines */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-y-0 left-1/4 w-px bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-y-0 right-1/4 w-px bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  );
};

export default BeforeAfterSlider;
