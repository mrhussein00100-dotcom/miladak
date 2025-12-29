/**
 * Image utilities for handling local and external images
 */

export interface ImageSource {
  src: string;
  isExternal: boolean;
  isValid: boolean;
}

export interface ArticleWithImages {
  featured_image?: string | null;
  image?: string | null;
}

/**
 * Parse and validate an image path
 */
export function parseImageSource(
  imagePath: string | null | undefined
): ImageSource {
  if (!imagePath) {
    return { src: '', isExternal: false, isValid: false };
  }

  const trimmedPath = imagePath.trim();

  if (!trimmedPath) {
    return { src: '', isExternal: false, isValid: false };
  }

  // Check if external URL
  const isExternal =
    trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://');

  // Check if valid local path
  const isValidLocal = trimmedPath.startsWith('/');

  return {
    src: trimmedPath,
    isExternal,
    isValid: isExternal || isValidLocal,
  };
}

/**
 * Get the best image source from an article
 * Priority: featured_image > image
 */
export function getImageSrc(article: ArticleWithImages): string | null {
  // Priority: featured_image > image
  const imagePath = article.featured_image || article.image;
  const parsed = parseImageSource(imagePath);

  return parsed.isValid ? parsed.src : null;
}

/**
 * Check if an image path is external
 */
export function isExternalImage(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://');
}

/**
 * Check if an image path is local
 */
export function isLocalImage(src: string): boolean {
  return src.startsWith('/') && !isExternalImage(src);
}
