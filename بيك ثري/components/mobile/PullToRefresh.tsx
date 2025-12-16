'use client';

import { useState, useCallback, ReactNode } from 'react';
import { useTouchGestures } from '@/hooks/useTouchGestures';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
  threshold?: number;
}

export function PullToRefresh({
  children,
  onRefresh,
  className,
  threshold = 80,
}: PullToRefreshProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const { handlers, pullDistance, isPullingToRefresh, isRefreshing } =
    useTouchGestures({
      onPullToRefresh: handleRefresh,
      pullToRefreshThreshold: threshold,
    });

  const progress = Math.min(pullDistance / threshold, 1);
  const shouldTrigger = pullDistance > threshold;

  return (
    <div className={cn('relative', className)} {...handlers}>
      {/* مؤشر السحب للتحديث */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 flex items-center justify-center',
          'transition-all duration-200 overflow-hidden z-10',
          isPullingToRefresh || isRefreshing ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          height: isPullingToRefresh ? pullDistance : isRefreshing ? 60 : 0,
        }}
      >
        <div
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full',
            'bg-primary/10 text-primary transition-all',
            shouldTrigger && 'bg-primary/20'
          )}
          style={{
            transform: `rotate(${progress * 360}deg)`,
          }}
        >
          <RefreshCw
            className={cn(
              'w-5 h-5',
              (isRefreshing || refreshing) && 'animate-spin'
            )}
          />
        </div>
      </div>

      {/* المحتوى */}
      <div
        style={{
          transform: isPullingToRefresh
            ? `translateY(${pullDistance * 0.5}px)`
            : 'none',
          transition: isPullingToRefresh ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default PullToRefresh;
