'use client';

import React from 'react';
import { Position } from '@/lib/cards/decorations';

interface HeartsProps {
  positions: Position[];
  colors: string[];
  animated?: boolean;
  opacity?: number;
}

export function Hearts({
  positions,
  colors,
  animated = true,
  opacity = 0.8,
}: HeartsProps) {
  return (
    <>
      {positions.map((pos, index) => (
        <div
          key={index}
          className={`absolute pointer-events-none ${
            animated ? 'animate-pulse-slow' : ''
          }`}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: `rotate(${pos.rotation || 0}deg) scale(${
              pos.scale || 1
            })`,
            opacity,
            animationDelay: `${index * 0.4}s`,
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill={colors[index % colors.length]}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </>
  );
}

export default Hearts;
