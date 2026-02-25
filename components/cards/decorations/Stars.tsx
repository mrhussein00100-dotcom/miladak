'use client';

import React from 'react';
import { Position } from '@/lib/cards/decorations';

interface StarsProps {
  positions: Position[];
  colors: string[];
  animated?: boolean;
  opacity?: number;
}

export function Stars({
  positions,
  colors,
  animated = true,
  opacity = 0.7,
}: StarsProps) {
  return (
    <>
      {positions.map((pos, index) => (
        <div
          key={index}
          className={`absolute pointer-events-none ${
            animated ? 'animate-twinkle' : ''
          }`}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: `rotate(${pos.rotation || 0}deg) scale(${
              pos.scale || 1
            })`,
            opacity,
            animationDelay: `${index * 0.2}s`,
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={colors[index % colors.length]}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21.02L12 17.77L6.82 21.02L8 14.14L3 9.27L9.91 8.26L12 2Z" />
          </svg>
        </div>
      ))}
    </>
  );
}

export default Stars;
