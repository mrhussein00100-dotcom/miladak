'use client';

import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'gradient';
  showValue?: boolean;
  animated?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'h-1',
  default: 'h-2',
  lg: 'h-3',
};

const variantStyles = {
  default: 'bg-purple-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  gradient: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500',
};

export function Progress({ 
  value, 
  max = 100, 
  size = 'default',
  variant = 'default',
  showValue = false,
  animated = false,
  className 
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      <div className={cn(
        'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
        sizeStyles[size]
      )}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            variantStyles[variant],
            animated && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 text-left">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}
