'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'glow';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl bg-card text-card-foreground shadow-lg transition-all duration-300',
          {
            'card-festive hover:shadow-xl hover:-translate-y-1': variant === 'default',
            'card-glass': variant === 'glass',
            'card-festive card-glow': variant === 'glow',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-xl font-bold leading-none tracking-tight', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

// Celebration Card with decorative elements
interface CelebrationCardProps extends CardProps {
  icon?: React.ReactNode;
  gradient?: boolean;
}

const CelebrationCard = React.forwardRef<HTMLDivElement, CelebrationCardProps>(
  ({ className, icon, gradient = true, children, ...props }, ref) => (
    <Card
      ref={ref}
      variant="default"
      className={cn(
        'group relative overflow-hidden',
        gradient && 'bg-gradient-to-br from-card to-card/80',
        className
      )}
      {...props}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full translate-y-12 -translate-x-12" />
      </div>
      
      {/* Icon */}
      {icon && (
        <div className="absolute top-4 right-4 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">
          {icon}
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </Card>
  )
);
CelebrationCard.displayName = 'CelebrationCard';

// Stat Card for displaying statistics
interface StatCardProps extends CardProps {
  icon?: React.ReactNode;
  value: string | number;
  label: string;
  color?: 'primary' | 'secondary' | 'accent';
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, icon, value, label, color = 'primary', ...props }, ref) => {
    const colorClasses = {
      primary: 'from-primary/10 to-primary/5 border-primary/20',
      secondary: 'from-secondary/10 to-secondary/5 border-secondary/20',
      accent: 'from-accent/10 to-accent/5 border-accent/20',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'text-center p-4 rounded-2xl border-2 bg-gradient-to-br transition-all duration-300',
          'hover:scale-105 hover:-translate-y-1',
          colorClasses[color],
          className
        )}
        {...props}
      >
        {icon && (
          <div className="flex justify-center mb-2 text-2xl">
            {icon}
          </div>
        )}
        <div className="text-2xl font-black text-gradient mb-1">
          {value}
        </div>
        <div className="text-xs font-medium text-muted-foreground">
          {label}
        </div>
      </div>
    );
  }
);
StatCard.displayName = 'StatCard';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CelebrationCard,
  StatCard,
};
