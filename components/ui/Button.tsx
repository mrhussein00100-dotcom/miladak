import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'xl';
  icon?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      icon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 shadow-lg hover:shadow-xl',
          {
            // Default - gradient primary button
            'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 active:scale-95 shadow-blue-500/25':
              variant === 'default',
            // Ghost - subtle hover effect
            'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100':
              variant === 'ghost',
            // Outline - modern border with gradient on hover
            'border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-purple-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950 dark:hover:to-purple-950 hover:text-blue-700 dark:hover:text-purple-300 hover:scale-105':
              variant === 'outline',
            // Secondary - soft gradient
            'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-200 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-500 hover:scale-105':
              variant === 'secondary',
          },
          {
            'h-10 px-4 py-2 text-sm': size === 'default',
            'h-9 px-3 text-xs': size === 'sm',
            'h-12 px-6 text-base': size === 'lg',
            'h-14 px-8 text-lg': size === 'xl',
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {icon && <span className="text-lg">{icon}</span>}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };

// CelebrationButton component - Enhanced for all themes
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
        'celebration-button button-ripple pulse-button glow-button',
        'inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition-all duration-300 relative overflow-hidden group',
        // Enhanced gradient with better contrast for all themes
        'bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white',
        'hover:from-pink-600 hover:via-purple-700 hover:to-blue-700',
        'shadow-2xl hover:shadow-pink-500/25 hover:shadow-2xl',
        'hover:scale-110 active:scale-95 transform-gpu',
        // Animated background effect
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
        // Ring effect on focus
        'focus:ring-4 focus:ring-pink-500/50 focus:outline-none',
        // Accessibility improvements
        'focus-visible:ring-4 focus-visible:ring-pink-500/50 focus-visible:outline-none',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        {
          'h-10 px-4 py-2 text-sm': size === 'sm',
          'h-12 px-6 py-3 text-base': size === 'default',
          'h-14 px-8 py-4 text-lg font-black': size === 'lg',
          'h-16 px-10 py-5 text-xl font-black': size === 'xl',
        },
        className
      )}
      ref={ref}
      {...buttonProps}
    >
      <span className="relative z-10 flex items-center gap-2">
        <span className="animate-pulse">🎉</span>
        {children}
        <span className="animate-bounce">✨</span>
      </span>
    </button>
  );
});
CelebrationButton.displayName = 'CelebrationButton';
