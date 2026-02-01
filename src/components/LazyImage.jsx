import React, { useState } from 'react';

const LazyImage = ({ src, alt, className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${!isLoaded ? 'blur-sm bg-[#222]' : ''} transition-all duration-500`}
      loading="lazy"
      onLoad={() => setIsLoaded(true)}
    />
  );
};

export default LazyImage;
