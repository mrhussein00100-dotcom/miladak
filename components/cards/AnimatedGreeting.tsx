'use client';

import React from 'react';

interface AnimatedGreetingProps {
  text: string;
  effect?: 'shimmer' | 'glow' | 'pulse' | 'none';
  color?: string;
  fontSize?: string;
  fontFamily?: string;
  className?: string;
}

/**
 * Animated greeting text component for birthday cards
 * Supports shimmer, glow, and pulse effects
 */
export function AnimatedGreeting({
  text = '',
  effect = 'shimmer',
  color,
  fontSize = '2rem',
  fontFamily,
  className = '',
}: AnimatedGreetingProps) {
  // Safety check for text
  const displayText = text || 'عيد ميلاد سعيد';

  const getEffectClass = () => {
    switch (effect) {
      case 'shimmer':
        return 'animate-shimmer bg-clip-text text-transparent bg-gradient-to-r from-current via-white to-current bg-[length:200%_auto]';
      case 'glow':
        return 'animate-glow';
      case 'pulse':
        return 'animate-pulse';
      default:
        return '';
    }
  };

  return (
    <h2
      className={`
        font-bold text-center leading-relaxed
        ${getEffectClass()}
        ${className}
      `}
      style={{
        color: effect === 'shimmer' ? undefined : color,
        fontSize,
        fontFamily: fontFamily || 'Cairo, sans-serif',
        // For shimmer effect, we need the gradient to show
        ...(effect === 'shimmer' && {
          backgroundImage: `linear-gradient(90deg, ${
            color || 'currentColor'
          } 0%, rgba(255,255,255,0.8) 50%, ${color || 'currentColor'} 100%)`,
        }),
      }}
    >
      {displayText}
    </h2>
  );
}

/**
 * Simple animated text without complex effects
 */
export function SimpleGreeting({
  text,
  color,
  fontSize = '2rem',
  fontFamily,
  className = '',
}: Omit<AnimatedGreetingProps, 'effect'>) {
  return (
    <h2
      className={`
        font-bold text-center leading-relaxed
        animate-fade-in
        ${className}
      `}
      style={{
        color,
        fontSize,
        fontFamily: fontFamily || 'Cairo, sans-serif',
      }}
    >
      {text}
    </h2>
  );
}

export default AnimatedGreeting;
