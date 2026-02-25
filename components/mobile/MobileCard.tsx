'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MobileCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  fullWidth?: boolean;
  pressable?: boolean;
}

export function MobileCard({
  children,
  className,
  onClick,
  variant = 'default',
  fullWidth = true,
  pressable = true,
}: MobileCardProps) {
  const variants = {
    default: 'bg-card border border-border',
    elevated: 'bg-card shadow-lg',
    outlined: 'bg-transparent border-2 border-border',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl p-4 transition-all duration-200',
        variants[variant],
        fullWidth && 'w-full',
        pressable && onClick && 'active:scale-[0.98] cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

interface MobileCardHeaderProps {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export function MobileCardHeader({
  children,
  className,
  icon,
}: MobileCardHeaderProps) {
  return (
    <div className={cn('flex items-center gap-3 mb-3', className)}>
      {icon && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

interface MobileCardTitleProps {
  children: ReactNode;
  className?: string;
}

export function MobileCardTitle({ children, className }: MobileCardTitleProps) {
  return (
    <h3
      className={cn('font-bold text-base text-foreground truncate', className)}
    >
      {children}
    </h3>
  );
}

interface MobileCardDescriptionProps {
  children: ReactNode;
  className?: string;
  lines?: 1 | 2 | 3;
}

export function MobileCardDescription({
  children,
  className,
  lines = 2,
}: MobileCardDescriptionProps) {
  const lineClamp = {
    1: 'line-clamp-1',
    2: 'line-clamp-2',
    3: 'line-clamp-3',
  };

  return (
    <p
      className={cn(
        'text-sm text-muted-foreground',
        lineClamp[lines],
        className
      )}
    >
      {children}
    </p>
  );
}

interface MobileCardContentProps {
  children: ReactNode;
  className?: string;
}

export function MobileCardContent({
  children,
  className,
}: MobileCardContentProps) {
  return <div className={cn('', className)}>{children}</div>;
}

interface MobileCardFooterProps {
  children: ReactNode;
  className?: string;
}

export function MobileCardFooter({
  children,
  className,
}: MobileCardFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between mt-4 pt-3 border-t border-border',
        className
      )}
    >
      {children}
    </div>
  );
}

export default MobileCard;
