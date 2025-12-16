import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-primary text-white hover:bg-primary/90': variant === 'default',
            'hover:bg-muted hover:text-foreground': variant === 'ghost',
            'border border-border bg-background hover:bg-muted':
              variant === 'outline',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80':
              variant === 'secondary',
          },
          {
            'h-10 px-4 py-2': size === 'default',
            'h-9 px-3 text-sm': size === 'sm',
            'h-11 px-8': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };

// CelebrationButton component
export interface CelebrationButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'default' | 'sm' | 'lg' | 'xl';
}

export const CelebrationButton = React.forwardRef<
  HTMLButtonElement,
  CelebrationButtonProps
>(({ className, size = 'default', children, ...props }, ref) => {
  // Filter out non-standard HTML attributes
  const { loading, ...buttonProps } = props as any;

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-bold transition-all',
        'bg-gradient-to-r from-primary to-secondary text-white',
        'hover:shadow-xl hover:scale-105 active:scale-95',
        {
          'h-10 px-4 py-2 text-sm': size === 'sm',
          'h-12 px-6 py-3 text-base': size === 'default',
          'h-14 px-8 py-4 text-lg': size === 'lg',
          'h-16 px-10 py-5 text-xl': size === 'xl',
        },
        className
      )}
      ref={ref}
      {...buttonProps}
    >
      {children}
    </button>
  );
});
CelebrationButton.displayName = 'CelebrationButton';
