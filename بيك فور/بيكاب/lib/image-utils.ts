/**
 * Generate a blur data URL for image placeholder
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f3f4f6"/>
    </svg>
  `;
  
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Get optimized image props for Next.js Image component
 */
export function getOptimizedImageProps(
  src: string,
  options: {
    priority?: boolean;
    quality?: number;
    sizes?: string;
  } = {}
) {
  const { priority = false, quality = 85, sizes } = options;

  return {
    src,
    quality,
    priority,
    sizes: sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    placeholder: 'blur' as const,
    blurDataURL: generateBlurDataURL(),
  };
}

/**
 * Image size presets for common use cases
 */
export const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 320, height: 240 },
  medium: { width: 640, height: 480 },
  large: { width: 1024, height: 768 },
  hero: { width: 1920, height: 1080 },
} as const;

/**
 * Responsive sizes string for different breakpoints
 */
export const RESPONSIVE_SIZES = {
  full: '100vw',
  half: '(max-width: 768px) 100vw, 50vw',
  third: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quarter: '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw',
} as const;
