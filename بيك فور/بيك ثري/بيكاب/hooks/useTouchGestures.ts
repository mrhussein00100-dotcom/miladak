'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface TouchPosition {
  x: number;
  y: number;
}

interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
}

interface UseTouchGesturesOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onLongPress?: () => void;
  onDoubleTap?: () => void;
  onPullToRefresh?: () => Promise<void>;
  swipeThreshold?: number;
  longPressDelay?: number;
  doubleTapDelay?: number;
  pullToRefreshThreshold?: number;
}

interface UseTouchGesturesReturn {
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
  swipeDirection: SwipeDirection;
  isLongPressing: boolean;
  isPullingToRefresh: boolean;
  pullDistance: number;
  isRefreshing: boolean;
}

export function useTouchGestures(
  options: UseTouchGesturesOptions = {}
): UseTouchGesturesReturn {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onLongPress,
    onDoubleTap,
    onPullToRefresh,
    swipeThreshold = 50,
    longPressDelay = 500,
    doubleTapDelay = 300,
    pullToRefreshThreshold = 80,
  } = options;

  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>({
    direction: null,
    distance: 0,
  });
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [isPullingToRefresh, setIsPullingToRefresh] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const touchStartRef = useRef<TouchPosition | null>(null);
  const touchStartTimeRef = useRef<number>(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapTimeRef = useRef<number>(0);
  const isScrollingRef = useRef(false);

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      touchStartTimeRef.current = Date.now();
      isScrollingRef.current = false;

      // بدء مؤقت الضغط المطول
      if (onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          setIsLongPressing(true);
          onLongPress();
        }, longPressDelay);
      }

      // التحقق من النقر المزدوج
      if (onDoubleTap) {
        const now = Date.now();
        if (now - lastTapTimeRef.current < doubleTapDelay) {
          onDoubleTap();
          lastTapTimeRef.current = 0;
        } else {
          lastTapTimeRef.current = now;
        }
      }

      // بدء السحب للتحديث
      if (onPullToRefresh && window.scrollY === 0) {
        setIsPullingToRefresh(true);
      }
    },
    [onLongPress, onDoubleTap, onPullToRefresh, longPressDelay, doubleTapDelay]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      // إلغاء الضغط المطول إذا تحرك المستخدم
      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        clearLongPressTimer();
        setIsLongPressing(false);
      }

      // تحديد اتجاه السحب
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX > absY && absX > 10) {
        isScrollingRef.current = false;
        setSwipeDirection({
          direction: deltaX > 0 ? 'right' : 'left',
          distance: absX,
        });
      } else if (absY > absX && absY > 10) {
        isScrollingRef.current = true;
        setSwipeDirection({
          direction: deltaY > 0 ? 'down' : 'up',
          distance: absY,
        });
      }

      // السحب للتحديث
      if (isPullingToRefresh && deltaY > 0 && window.scrollY === 0) {
        setPullDistance(Math.min(deltaY, pullToRefreshThreshold * 1.5));
        if (deltaY > pullToRefreshThreshold) {
          // يمكن إضافة haptic feedback هنا
        }
      }
    },
    [clearLongPressTimer, isPullingToRefresh, pullToRefreshThreshold]
  );

  const handleTouchEnd = useCallback(
    async (e: React.TouchEvent) => {
      clearLongPressTimer();
      setIsLongPressing(false);

      if (!touchStartRef.current) return;

      const touchEnd = e.changedTouches[0];
      const deltaX = touchEnd.clientX - touchStartRef.current.x;
      const deltaY = touchEnd.clientY - touchStartRef.current.y;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // تنفيذ السحب
      if (absX > swipeThreshold && absX > absY) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      } else if (absY > swipeThreshold && absY > absX) {
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }

      // تنفيذ السحب للتحديث
      if (
        isPullingToRefresh &&
        pullDistance > pullToRefreshThreshold &&
        onPullToRefresh
      ) {
        setIsRefreshing(true);
        try {
          await onPullToRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }

      // إعادة تعيين الحالة
      touchStartRef.current = null;
      setSwipeDirection({ direction: null, distance: 0 });
      setIsPullingToRefresh(false);
      setPullDistance(0);
    },
    [
      clearLongPressTimer,
      swipeThreshold,
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
      isPullingToRefresh,
      pullDistance,
      pullToRefreshThreshold,
      onPullToRefresh,
    ]
  );

  // تنظيف المؤقتات عند إلغاء التثبيت
  useEffect(() => {
    return () => {
      clearLongPressTimer();
    };
  }, [clearLongPressTimer]);

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    swipeDirection,
    isLongPressing,
    isPullingToRefresh,
    pullDistance,
    isRefreshing,
  };
}

export default useTouchGestures;
