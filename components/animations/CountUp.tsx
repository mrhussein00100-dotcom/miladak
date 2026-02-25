'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  separator?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  onComplete?: () => void;
}

export function CountUp({ 
  end, 
  start = 0, 
  duration = 2000,
  delay = 0,
  decimals = 0,
  separator = ',',
  prefix = '',
  suffix = '',
  className,
  onComplete
}: CountUpProps) {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const diff = end - start;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (diff * easeOut);
        
        setCount(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(end);
          onComplete?.();
        }
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isVisible, start, end, duration, delay, onComplete]);

  const formatNumber = (num: number) => {
    const fixed = num.toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join('.');
  };

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
}
