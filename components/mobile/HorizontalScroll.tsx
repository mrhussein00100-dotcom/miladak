'use client';

import { ReactNode, useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
  showArrows?: boolean;
  gap?: 'sm' | 'md' | 'lg';
  snapToItems?: boolean;
}

export function HorizontalScroll({
  children,
  className,
  showArrows = true,
  gap = 'md',
  snapToItems = true,
}: HorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const gaps = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        scrollEl.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={cn('relative group', className)}>
      {/* أسهم التنقل - تظهر على الديسكتوب فقط */}
      {showArrows && canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className={cn(
            'absolute right-0 top-1/2 -translate-y-1/2 z-10',
            'hidden md:flex items-center justify-center',
            'w-10 h-10 rounded-full bg-background/90 shadow-lg border border-border',
            'text-foreground hover:bg-muted transition-all',
            'opacity-0 group-hover:opacity-100'
          )}
          aria-label="التمرير لليمين"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {showArrows && canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className={cn(
            'absolute left-0 top-1/2 -translate-y-1/2 z-10',
            'hidden md:flex items-center justify-center',
            'w-10 h-10 rounded-full bg-background/90 shadow-lg border border-border',
            'text-foreground hover:bg-muted transition-all',
            'opacity-0 group-hover:opacity-100'
          )}
          aria-label="التمرير لليسار"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* حاوية التمرير */}
      <div
        ref={scrollRef}
        className={cn(
          'flex overflow-x-auto scrollbar-hide',
          '-mx-4 px-4 md:mx-0 md:px-0',
          gaps[gap],
          snapToItems && 'snap-x snap-mandatory'
        )}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {children}
      </div>

      {/* مؤشرات التمرير للموبايل */}
      <div className="flex justify-center gap-1 mt-3 md:hidden">
        <div
          className={cn(
            'h-1 rounded-full transition-all',
            canScrollLeft ? 'w-2 bg-primary' : 'w-1 bg-muted'
          )}
        />
        <div className="w-8 h-1 rounded-full bg-primary" />
        <div
          className={cn(
            'h-1 rounded-full transition-all',
            canScrollRight ? 'w-2 bg-primary' : 'w-1 bg-muted'
          )}
        />
      </div>
    </div>
  );
}

interface HorizontalScrollItemProps {
  children: ReactNode;
  className?: string;
  width?: 'auto' | 'sm' | 'md' | 'lg' | 'full';
}

export function HorizontalScrollItem({
  children,
  className,
  width = 'auto',
}: HorizontalScrollItemProps) {
  const widths = {
    auto: 'w-auto',
    sm: 'w-[200px] min-w-[200px]',
    md: 'w-[280px] min-w-[280px]',
    lg: 'w-[350px] min-w-[350px]',
    full: 'w-[85vw] min-w-[85vw] md:w-auto md:min-w-0',
  };

  return (
    <div className={cn('flex-shrink-0 snap-start', widths[width], className)}>
      {children}
    </div>
  );
}

export default HorizontalScroll;
