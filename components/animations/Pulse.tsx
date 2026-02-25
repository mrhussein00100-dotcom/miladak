'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PulseProps {
  children: ReactNode;
  color?: string;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'before:w-2 before:h-2',
  default: 'before:w-3 before:h-3',
  lg: 'before:w-4 before:h-4',
};

export function Pulse({ 
  children, 
  color = 'bg-green-500',
  size = 'default',
  className 
}: PulseProps) {
  return (
    <span className={cn('relative inline-flex items-center gap-2', className)}>
      <span className={cn(
        'relative flex',
        sizeStyles[size]
      )}>
        <span className={cn(
          'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
          color
        )} />
        <span className={cn(
          'relative inline-flex rounded-full',
          color,
          sizeStyles[size].replace('before:', '')
        )} />
      </span>
      {children}
    </span>
  );
}
