/**
 * أدوات تحسين الأداء للواجهة المحسنة لإعادة الصياغة
 */

import { useCallback, useMemo, useRef } from 'react';

// ===== Debounce Hook =====
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
}

// ===== Throttle Hook =====
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      }
    }) as T,
    [callback, delay]
  );
}

// ===== Memoized Word Count =====
export function useWordCount(text: string): number {
  return useMemo(() => {
    if (!text || typeof text !== 'string') return 0;
    return text
      .replace(/<[^>]*>/g, '') // إزالة HTML tags
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }, [text]);
}

// ===== Character Count =====
export function useCharCount(text: string): number {
  return useMemo(() => {
    if (!text || typeof text !== 'string') return 0;
    return text.replace(/<[^>]*>/g, '').length;
  }, [text]);
}

// ===== Local Storage Hook =====
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue];
}

// ===== Performance Monitoring =====
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(label: string): () => void {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (!this.metrics.has(label)) {
        this.metrics.set(label, []);
      }

      this.metrics.get(label)!.push(duration);

      // Keep only last 100 measurements
      const measurements = this.metrics.get(label)!;
      if (measurements.length > 100) {
        measurements.shift();
      }

      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    };
  }

  getAverageTime(label: string): number {
    const measurements = this.metrics.get(label);
    if (!measurements || measurements.length === 0) return 0;

    const sum = measurements.reduce((acc, time) => acc + time, 0);
    return sum / measurements.length;
  }

  getMetrics(): Record<string, { average: number; count: number }> {
    const result: Record<string, { average: number; count: number }> = {};

    for (const [label, measurements] of this.metrics.entries()) {
      result[label] = {
        average: this.getAverageTime(label),
        count: measurements.length,
      };
    }

    return result;
  }

  clear(): void {
    this.metrics.clear();
  }
}

// ===== Memory Usage Monitoring =====
export function getMemoryUsage(): {
  used: number;
  total: number;
  percentage: number;
} | null {
  if (typeof window === 'undefined' || !('memory' in performance)) {
    return null;
  }

  const memory = (performance as any).memory;
  return {
    used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
    total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
    percentage: Math.round(
      (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
    ),
  };
}

// ===== Lazy Loading Hook =====
export function useLazyLoad<T>(
  loadFunction: () => Promise<T>,
  dependencies: any[] = []
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  reload: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await loadFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}

// ===== Intersection Observer Hook =====
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options]);

  return isIntersecting;
}

// ===== Bundle Size Analyzer =====
export function analyzeBundleSize(): void {
  if (typeof window === 'undefined') return;

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(
    document.querySelectorAll('link[rel="stylesheet"]')
  );

  console.group('📦 Bundle Analysis');

  console.log('Scripts:', scripts.length);
  scripts.forEach((script, index) => {
    console.log(`${index + 1}. ${(script as HTMLScriptElement).src}`);
  });

  console.log('Stylesheets:', styles.length);
  styles.forEach((style, index) => {
    console.log(`${index + 1}. ${(style as HTMLLinkElement).href}`);
  });

  console.groupEnd();
}

// ===== Error Boundary Hook =====
export function useErrorBoundary(): {
  hasError: boolean;
  error: Error | null;
  resetError: () => void;
} {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(new Error(event.message));
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setHasError(true);
      setError(new Error(event.reason));
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection
      );
    };
  }, []);

  const resetError = useCallback(() => {
    setHasError(false);
    setError(null);
  }, []);

  return { hasError, error, resetError };
}

// ===== Import useState =====
import { useState, useEffect } from 'react';
