import React, { useState, useEffect } from 'react';

const LazyImage = ({ src, alt, placeholder = 'blur', className = '' }) => {
  const [imageSrc, setImageSrc] = useState(placeholder === 'blur' ? null : src);
  const [imageRef, setImageRef] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let observer;

    const img = new Image();

    const onLoad = () => {
      setIsLoading(false);
      setImageSrc(src);
    };

    if (imageRef) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            img.onload = onLoad;
            img.src = src;
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(imageRef);
    }

    return () => {
      if (observer && imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [src, imageRef]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23222" width="400" height="400"/%3E%3C/svg%3E'}
      alt={alt}
      className={`${className} ${isLoading ? 'blur-sm' : ''} transition-all duration-500`}
      loading="lazy"
    />
  );
};

export default LazyImage;
