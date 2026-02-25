'use client';

import { ReactNode, Children, cloneElement, isValidElement } from 'react';

interface StaggerProps {
  children: ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
  className?: string;
}

export function Stagger({ 
  children, 
  staggerDelay = 100, 
  initialDelay = 0,
  className 
}: StaggerProps) {
  return (
    <div className={className}>
      {Children.map(children, (child, index) => {
        if (isValidElement(child)) {
          return cloneElement(child as React.ReactElement<{ delay?: number }>, {
            delay: initialDelay + (index * staggerDelay),
          });
        }
        return child;
      })}
    </div>
  );
}
