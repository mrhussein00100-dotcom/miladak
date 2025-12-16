'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if user prefers reduced motion
 * Returns true if user has enabled reduced motion in their system settings
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') return;

    // Create media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Returns animation props based on reduced motion preference
 * Use this to conditionally disable animations
 */
export function useAnimationProps() {
  const prefersReducedMotion = useReducedMotion();

  return {
    // For framer-motion
    animate: prefersReducedMotion ? false : undefined,
    transition: prefersReducedMotion ? { duration: 0 } : undefined,
    
    // Helper to conditionally apply animation classes
    animationClass: (className: string) => prefersReducedMotion ? '' : className,
    
    // Check if animations should be enabled
    shouldAnimate: !prefersReducedMotion,
  };
}

export default useReducedMotion;
