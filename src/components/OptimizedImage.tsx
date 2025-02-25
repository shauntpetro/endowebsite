import React from 'react';
import { useOptimizedImage } from '../hooks/useOptimizedImage';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  className?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = React.memo(({
  src,
  alt,
  width = 800,
  className
}) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const optimizedSrc = useOptimizedImage({ src, width });

  return (
    <div ref={ref as any} className={className}>
      {isVisible && (
        <img
          src={optimizedSrc}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';