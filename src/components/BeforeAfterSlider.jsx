import React, { useState, useRef, useEffect } from 'react';

const BeforeAfterSlider = ({ beforeImage, afterImage, alt }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    }
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleTouchStart = () => setIsDragging(true);

  const handleMouseUp = () => setIsDragging(false);
  const handleTouchEnd = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleTouchEnd);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
    } else {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    }
    return () => {
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
    }
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none cursor-ew-resize group"
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
      <div
        className="absolute inset-0 w-full h-full overflow-hidden border-r-4 border-primary transition-all duration-75"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt={`Before ${alt}`}
          className="absolute inset-0 w-full h-full object-cover max-w-none group-hover:scale-105 transition-transform duration-300"
          style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100%' }}
          loading="lazy"
        />
         <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded text-white text-xs font-bold uppercase z-10 animate-pulse-soft">Before</div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute inset-y-0 transition-all duration-75"
        style={{ left: `${sliderPosition}%` }}
      >
        <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-10 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(0,145,255,0.5)] z-20 hover:scale-125 active:scale-110 transition-transform animate-glow cursor-grab active:cursor-grabbing group-hover:shadow-[0_0_30px_rgba(0,145,255,0.8)]"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
          <span className="material-symbols-outlined text-white animate-float">unfold_more</span>
        </div>
      </div>

      {/* Indicator lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-y-0 left-1/4 w-px bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-y-0 right-1/4 w-px bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
