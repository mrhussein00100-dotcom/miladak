'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
}

/**
 * SafeImage component with error handling and fallback support
 */
export function SafeImage({
  src,
  alt,
  fill = false,
  className = '',
  priority = false,
  sizes,
  fallbackSrc,
  width,
  height,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return null;
  }

  const imageProps: any = {
    src: imgSrc,
    alt,
    className,
    priority,
    onError: handleError,
  };

  if (fill) {
    imageProps.fill = true;
    if (sizes) imageProps.sizes = sizes;
  } else {
    if (width) imageProps.width = width;
    if (height) imageProps.height = height;
  }

  return <Image {...imageProps} />;
}
