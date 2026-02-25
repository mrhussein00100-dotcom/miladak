'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

export function LoadingSpinner({
  size = 'md',
  className,
  text,
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        className
      )}
    >
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-muted border-t-primary',
          sizes[size]
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
}

interface LoadingDotsProps {
  className?: string;
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

interface LoadingBarProps {
  progress?: number;
  indeterminate?: boolean;
  className?: string;
}

export function LoadingBar({
  progress,
  indeterminate = false,
  className,
}: LoadingBarProps) {
  return (
    <div
      className={cn(
        'w-full h-1 bg-muted rounded-full overflow-hidden',
        className
      )}
    >
      {indeterminate ? (
        <div className="h-full bg-primary rounded-full animate-loading-bar" />
      ) : (
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${progress || 0}%` }}
        />
      )}
    </div>
  );
}

export default LoadingSpinner;
