// Performance optimization utilities

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Check if device is mobile/low-end
 */
export const isLowEndDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for mobile
  const isMobile = window.innerWidth <= 768;
  
  // Check for low memory (if available)
  const hasLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4;
  
  // Check for slow connection
  const hasSlowConnection = (navigator as any).connection && 
    ((navigator as any).connection.effectiveType === 'slow-2g' || 
     (navigator as any).connection.effectiveType === '2g');
  
  return isMobile || hasLowMemory || hasSlowConnection;
};

/**
 * Get optimized animation settings based on device capabilities
 */
export const getAnimationSettings = () => {
  const reducedMotion = prefersReducedMotion();
  const lowEnd = isLowEndDevice();
  
  if (reducedMotion) {
    return {
      duration: 0,
      ease: "linear" as const,
      animate: false,
      transition: { duration: 0 }
    };
  }
  
  if (lowEnd) {
    return {
      duration: 0.2,
      ease: "easeOut" as const,
      animate: true,
      transition: { duration: 0.2, ease: "easeOut" }
    };
  }
  
  return {
    duration: 0.5,
    ease: "easeInOut" as const,
    animate: true,
    transition: { duration: 0.5, ease: "easeInOut" }
  };
};

/**
 * Debounce function for performance
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for performance
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Request idle callback with fallback
 */
export const requestIdleCallback = (callback: () => void, timeout = 5000) => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return (window as any).requestIdleCallback(callback, { timeout });
  } else {
    return setTimeout(callback, 1);
  }
};

/**
 * Cancel idle callback with fallback
 */
export const cancelIdleCallback = (id: number) => {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    (window as any).cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
};

/**
 * Intersection Observer for lazy loading
 */
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  });
};
