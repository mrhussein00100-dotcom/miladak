'use client';

import React from 'react';

interface RibbonBannerProps {
  text: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color?: string;
  backgroundColor?: string;
  className?: string;
}

/**
 * Decorative ribbon banner component for birthday cards
 * Displays special messages in a corner ribbon
 */
export function RibbonBanner({
  text,
  position = 'top-right',
  color = '#FFFFFF',
  backgroundColor = '#FF6B8A',
  className = '',
}: RibbonBannerProps) {
  const positionStyles = {
    'top-left': {
      top: '20px',
      left: '-35px',
      transform: 'rotate(-45deg)',
    },
    'top-right': {
      top: '20px',
      right: '-35px',
      transform: 'rotate(45deg)',
    },
    'bottom-left': {
      bottom: '20px',
      left: '-35px',
      transform: 'rotate(45deg)',
    },
    'bottom-right': {
      bottom: '20px',
      right: '-35px',
      transform: 'rotate(-45deg)',
    },
  };

  return (
    <div
      className={`
        absolute w-[150px] text-center py-1 px-2
        text-sm font-bold shadow-md
        animate-slide-up
        ${className}
      `}
      style={{
        ...positionStyles[position],
        color,
        backgroundColor,
      }}
    >
      {text}
    </div>
  );
}

/**
 * Simple banner component (horizontal)
 */
export function SimpleBanner({
  text,
  color = '#FFFFFF',
  backgroundColor = 'linear-gradient(90deg, #FF6B8A 0%, #B794F6 100%)',
  className = '',
}: Omit<RibbonBannerProps, 'position'>) {
  return (
    <div
      className={`
        w-full text-center py-2 px-4
        text-sm font-bold
        animate-fade-in
        ${className}
      `}
      style={{
        color,
        background: backgroundColor,
      }}
    >
      {text}
    </div>
  );
}

export default RibbonBanner;
