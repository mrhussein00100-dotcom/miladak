'use client';

import React from 'react';
import { Position } from '@/lib/cards/decorations';

interface SparklesProps {
  positions: Position[];
  colors: string[];
  animated?: boolean;
  opacity?: number;
}

export function Sparkles({
  positions,
  colors,
  animated = true,
  opacity = 0.6,
}: SparklesProps) {
  return (
    <>
      {positions.map((pos, index) => (
        <div
          key={index}
          className={`absolute pointer-events-none ${
            animated ? 'animate-sparkle' : ''
          }`}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: `rotate(${pos.rotation || 0}deg) scale(${
              pos.scale || 1
            })`,
            opacity,
            animationDelay: `${index * 0.25}s`,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill={colors[index % colors.length]}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 4-point sparkle */}
            <path d="M10 0 L11 8 L20 10 L11 12 L10 20 L9 12 L0 10 L9 8 Z" />
          </svg>
        </div>
      ))}
    </>
  );
}

export default Sparkles;
