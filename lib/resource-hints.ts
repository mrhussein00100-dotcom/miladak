/**
 * Resource Hints Configuration
 * 
 * This file contains all resource hints for optimizing page load performance:
 * - preconnect: Establish early connections to important third-party origins
 * - dns-prefetch: Resolve DNS for third-party domains ahead of time
 * - preload: Load critical resources early
 */

export interface ResourceHint {
  rel: 'preconnect' | 'dns-prefetch' | 'preload' | 'prefetch';
  href: string;
  as?: string;
  type?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
}

/**
 * Preconnect hints - Establish early connections
 * Use for critical third-party origins that will be used soon
 */
export const preconnectHints: ResourceHint[] = [
  {
    rel: 'preconnect',
    href: 'https://fonts.googleapis.com',
  },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
];

/**
 * DNS Prefetch hints - Resolve DNS early
 * Use for third-party domains that will be used later
 */
export const dnsPrefetchHints: ResourceHint[] = [
  {
    rel: 'dns-prefetch',
    href: 'https://www.google-analytics.com',
  },
  {
    rel: 'dns-prefetch',
    href: 'https://www.googletagmanager.com',
  },
  {
    rel: 'dns-prefetch',
    href: 'https://images.unsplash.com',
  },
  {
    rel: 'dns-prefetch',
    href: 'https://images.pexels.com',
  },
  {
    rel: 'dns-prefetch',
    href: 'https://www.gstatic.com',
  },
];

/**
 * Preload hints - Load critical resources early
 * Use sparingly for resources needed for initial render
 */
export const preloadHints: ResourceHint[] = [
  // Fonts are handled by next/font automatically
  // Add other critical resources here if needed
];

/**
 * Get all resource hints
 */
export function getAllResourceHints(): ResourceHint[] {
  return [...preconnectHints, ...dnsPrefetchHints, ...preloadHints];
}

/**
 * Get resource hints by type
 */
export function getResourceHintsByType(
  type: 'preconnect' | 'dns-prefetch' | 'preload' | 'prefetch'
): ResourceHint[] {
  return getAllResourceHints().filter((hint) => hint.rel === type);
}

/**
 * Generate link tag attributes for a resource hint
 */
export function getResourceHintAttributes(hint: ResourceHint): Record<string, string> {
  const attrs: Record<string, string> = {
    rel: hint.rel,
    href: hint.href,
  };

  if (hint.as) attrs.as = hint.as;
  if (hint.type) attrs.type = hint.type;
  if (hint.crossOrigin) attrs.crossOrigin = hint.crossOrigin;

  return attrs;
}

/**
 * Performance optimization tips:
 * 
 * 1. Preconnect (highest priority):
 *    - Use for critical third-party origins
 *    - Limit to 2-3 origins (expensive operation)
 *    - Example: fonts, analytics
 * 
 * 2. DNS Prefetch (medium priority):
 *    - Use for third-party domains used later
 *    - Cheaper than preconnect
 *    - Example: image CDNs, social media
 * 
 * 3. Preload (critical resources):
 *    - Use for resources needed for initial render
 *    - Be careful not to overuse (can delay other resources)
 *    - Example: critical fonts, hero images
 * 
 * 4. Prefetch (low priority):
 *    - Use for resources needed for next navigation
 *    - Loaded during idle time
 *    - Example: next page resources
 */
