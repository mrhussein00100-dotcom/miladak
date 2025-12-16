'use client';

import { useState, useEffect, useCallback } from 'react';

interface ScrollPosition {
  scrollY: number;
  scrollDirection: 'up' | 'down' | null;
  isScrolled: boolean;
  isCompact: boolean;
}

const SCROLL_THRESHOLD = 100;
const COMPACT_THRESHOLD = 50;

export function useScrollPosition(): ScrollPosition {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    scrollY: 0,
    scrollDirection: null,
    isScrolled: false,
    isCompact: false,
  });

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    setScrollPosition((prev) => {
      const scrollDirection = currentScrollY > prev.scrollY ? 'down' : 'up';
      const isScrolled = currentScrollY > SCROLL_THRESHOLD;

      // Compact mode: when scrolled down past threshold
      // Expand mode: when scrolling up or at top
      const isCompact =
        currentScrollY > COMPACT_THRESHOLD && scrollDirection === 'down';

      return {
        scrollY: currentScrollY,
        scrollDirection,
        isScrolled,
        isCompact: isScrolled ? isCompact : false,
      };
    });
  }, []);

  useEffect(() => {
    // Set initial scroll position
    setScrollPosition({
      scrollY: window.scrollY,
      scrollDirection: null,
      isScrolled: window.scrollY > SCROLL_THRESHOLD,
      isCompact: false,
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return scrollPosition;
}

export { SCROLL_THRESHOLD, COMPACT_THRESHOLD };
