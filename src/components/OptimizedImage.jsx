import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * @typedef {Object} OptimizedImageProps
 * @property {string} src - The fallback image source URL (original format)
 * @property {string} [webpSrc] - The WebP format image source URL for modern browsers
 * @property {string} alt - Alternative text for accessibility
 * @property {number} width - Original image width in pixels
 * @property {number} height - Original image height in pixels
 * @property {boolean} [critical=false] - If true, loads immediately without lazy loading
 * @property {string} [srcSet] - Responsive image srcSet attribute for the fallback format
 * @property {string} [webpSrcSet] - Responsive image srcSet attribute for WebP format
 * @property {string} [sizes] - Image sizes attribute for responsive images
 * @property {string} [placeholder] - Base64 encoded blur placeholder image
 * @property {string} [className] - Additional CSS classes
 * @property {React.CSSProperties} [style] - Additional inline styles
 * @property {function} [onLoad] - Callback when image finishes loading
 * @property {function} [onError] - Callback when image fails to load
 * @property {string} [loading='lazy'] - Native loading attribute (eager|lazy)
 * @property {Object} [imgProps] - Additional props to pass to the img element
 */

/**
 * Checks if the browser supports WebP format
 * @returns {boolean}
 */
const supportsWebP = () => {
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};

/**
 * Generates a tiny blur placeholder from dimensions
 * This creates a transparent 1x1 pixel as fallback if no placeholder provided
 * @param {number} width
 * @param {number} height
 * @returns {string}
 */
const generatePlaceholder = (width, height) => {
  // Create a tiny SVG placeholder that maintains aspect ratio
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="#f0f0f0"/>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * OptimizedImage Component
 * 
 * A performance-optimized image component with:
 * - WebP format support with automatic fallback
 * - Intersection Observer for true lazy loading
 * - Blur placeholder while loading
 * - Responsive srcSet support
 * - Critical image loading (immediate, not lazy)
 * - Aspect ratio calculation to prevent layout shift (CLS)
 * 
 * @param {OptimizedImageProps} props
 * @returns {JSX.Element}
 */
const OptimizedImage = ({
  src,
  webpSrc,
  alt,
  width,
  height,
  critical = false,
  srcSet,
  webpSrcSet,
  sizes,
  placeholder,
  className = '',
  style = {},
  onLoad,
  onError,
  loading: nativeLoading = 'lazy',
  imgProps = {},
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(critical);
  const [hasError, setHasError] = useState(false);
  const [webPSupported, setWebPSupported] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Calculate aspect ratio percentage for padding-bottom technique
  const aspectRatio = (height / width) * 100;

  // Generate placeholder if not provided
  const blurPlaceholder = placeholder || generatePlaceholder(width, height);

  // Check WebP support on mount
  useEffect(() => {
    setWebPSupported(supportsWebP());
  }, []);

  // Set up Intersection Observer for lazy loading
  useEffect(() => {
    // Skip if critical image or already in view
    if (critical || isInView) return;

    const imgElement = imgRef.current;
    if (!imgElement) return;

    // Check for IntersectionObserver support
    if ('IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              // Disconnect observer after image enters viewport
              if (observerRef.current) {
                observerRef.current.disconnect();
              }
            }
          });
        },
        {
          rootMargin: '50px 0px', // Start loading 50px before it enters viewport
          threshold: 0.01,
        }
      );

      // Observe a wrapper element or the image itself
      observerRef.current.observe(imgElement);
    } else {
      // Fallback for browsers without IntersectionObserver
      setIsInView(true);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [critical, isInView]);

  // Handle image load event
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  }, [onLoad]);

  // Handle image error event
  const handleError = useCallback(() => {
    setHasError(true);
    if (onError) onError();
  }, [onError]);

  // Determine which source to use based on WebP support
  const currentSrc = webPSupported && webpSrc ? webpSrc : src;
  const currentSrcSet = webPSupported && webpSrcSet ? webpSrcSet : srcSet;

  // Container styles with aspect ratio padding
  const containerStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: width ? `${width}px` : '100%',
    ...style,
  };

  // Aspect ratio placeholder (prevents CLS)
  const aspectRatioStyle = {
    paddingBottom: `${aspectRatio}%`,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    backgroundImage: `url(${blurPlaceholder})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: isLoaded ? 'none' : 'blur(10px)',
    transition: 'filter 0.3s ease-out',
  };

  // Image styles
  const imageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-out',
  };

  // Render picture element for WebP with fallback
  const renderPicture = () => {
    const loadingAttr = critical ? 'eager' : nativeLoading;

    if (webpSrc) {
      return (
        <picture>
          {/* WebP source */}
          <source
            srcSet={webpSrcSet || webpSrc}
            sizes={sizes}
            type="image/webp"
          />
          {/* Fallback source */}
          <source
            srcSet={srcSet || src}
            sizes={sizes}
            type={`image/${src.split('.').pop()}`}
          />
          {/* Fallback img */}
          <img
            ref={imgRef}
            src={isInView ? src : blurPlaceholder}
            srcSet={isInView ? srcSet : undefined}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={loadingAttr}
            decoding={critical ? 'sync' : 'async'}
            onLoad={handleLoad}
            onError={handleError}
            style={imageStyle}
            className={className}
            {...imgProps}
          />
        </picture>
      );
    }

    // No WebP support needed, render simple img
    return (
      <img
        ref={imgRef}
        src={isInView ? currentSrc : blurPlaceholder}
        srcSet={isInView ? currentSrcSet : undefined}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={loadingAttr}
        decoding={critical ? 'sync' : 'async'}
        onLoad={handleLoad}
        onError={handleError}
        style={imageStyle}
        className={className}
        {...imgProps}
      />
    );
  };

  return (
    <div style={containerStyle} {...rest}>
      {/* Aspect ratio wrapper */}
      <div style={aspectRatioStyle}>
        {renderPicture()}
      </div>
      
      {/* Error state */}
      {hasError && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            color: '#666',
            fontSize: '14px',
          }}
        >
          Failed to load image
        </div>
      )}
    </div>
  );
};

/**
 * Predefined blur placeholder data URLs for common aspect ratios
 * These are tiny base64-encoded blurred images that can be used as placeholders
 */
export const BlurPlaceholders = {
  /** 16:9 aspect ratio placeholder */
  ratio16x9: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiA5Ij48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+',
  /** 4:3 aspect ratio placeholder */
  ratio4x3: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0IDMiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmMGYwZjAiLz48L3N2Zz4=',
  /** 1:1 aspect ratio placeholder */
  ratio1x1: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxIDEiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmMGYwZjAiLz48L3N2Zz4=',
  /** 3:2 aspect ratio placeholder */
  ratio3x2: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzIDIiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmMGYwZjAiLz48L3N2Zz4=',
};

/**
 * Utility function to generate a blur hash placeholder
 * This is a simplified version - for production, consider using the blurhash library
 * 
 * @param {number} width
 * @param {number} height
 * @param {string} color - Hex color code (e.g., '#e0e0e0')
 * @returns {string}
 */
export const generateColorPlaceholder = (width, height, color = '#f0f0f0') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="${color}"/>
  </svg>`;
  return `data:image/svg+xml;base64,${typeof window !== 'undefined' ? btoa(svg) : Buffer.from(svg).toString('base64')}`;
};

export default OptimizedImage;
