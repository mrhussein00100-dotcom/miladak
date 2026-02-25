'use client';

import React from 'react';

interface AgeBadgeProps {
  age: number;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
  className?: string;
}

/**
 * Decorative age badge component for birthday cards
 * Displays age in a beautiful circular badge
 */
export function AgeBadge({
  age,
  size = 'medium',
  color = '#FFFFFF',
  backgroundColor = 'linear-gradient(135deg, #FF6B8A 0%, #B794F6 100%)',
  animated = true,
  className = '',
}: AgeBadgeProps) {
  const sizeClasses = {
    small: 'w-16 h-16 text-xl',
    medium: 'w-24 h-24 text-3xl',
    large: 'w-32 h-32 text-4xl',
  };

  const ringSize = {
    small: 'w-20 h-20',
    medium: 'w-28 h-28',
    large: 'w-36 h-36',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      {/* Outer decorative ring */}
      <div
        className={`absolute ${ringSize[size]} rounded-full opacity-30 ${
          animated ? 'animate-pulse-slow' : ''
        }`}
        style={{ background: backgroundColor }}
      />

      {/* Main badge */}
      <div
        className={`
          relative ${sizeClasses[size]} rounded-full 
          flex flex-col items-center justify-center
          font-bold shadow-lg
          ${animated ? 'animate-bounce-in' : ''}
        `}
        style={{
          background: backgroundColor,
          color: color,
        }}
      >
        <span className="leading-none">{age}</span>
        <span className="text-xs opacity-80 mt-1">سنة</span>
      </div>

      {/* Sparkle decorations */}
      {animated && (
        <>
          <div className="absolute -top-1 -right-1 text-yellow-400 animate-twinkle">
            ✨
          </div>
          <div
            className="absolute -bottom-1 -left-1 text-yellow-400 animate-twinkle"
            style={{ animationDelay: '0.5s' }}
          >
            ✨
          </div>
        </>
      )}
    </div>
  );
}

export default AgeBadge;
