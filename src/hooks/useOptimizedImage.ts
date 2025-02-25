import { useState, useEffect } from 'react';

interface ImageOptions {
  src: string;
  width?: number;
  quality?: number;
}

export const useOptimizedImage = ({ src, width = 800, quality = 80 }: ImageOptions) => {
  const [optimizedSrc, setOptimizedSrc] = useState<string>('');

  useEffect(() => {
    if (src.includes('unsplash.com')) {
      const url = new URL(src);
      url.searchParams.set('w', width.toString());
      url.searchParams.set('q', quality.toString());
      url.searchParams.set('auto', 'format');
      setOptimizedSrc(url.toString());
    } else {
      setOptimizedSrc(src);
    }
  }, [src, width, quality]);

  return optimizedSrc;
};