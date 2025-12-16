'use client';

import React from 'react';
import { Position } from '@/lib/cards/decorations';

interface FlowersProps {
  positions: Position[];
  colors: string[];
  animated?: boolean;
  opacity?: number;
}

export function Flowers({
  positions,
  colors,
  animated = true,
  opacity = 0.7,
}: FlowersProps) {
  return (
    <>
      {positions.map((pos, index) => (
        <div
          key={index}
          className={`absolute pointer-events-none ${
            animated ? 'animate-sway' : ''
          }`}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: `rotate(${pos.rotation || 0}deg) scale(${
              pos.scale || 1
            })`,
            opacity,
            animationDelay: `${index * 0.5}s`,
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Petals */}
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <ellipse
                key={i}
                cx="16"
                cy="8"
                rx="5"
                ry="8"
                fill={colors[index % colors.length]}
                transform={`rotate(${angle} 16 16)`}
              />
            ))}
            {/* Center */}
            <circle cx="16" cy="16" r="4" fill="#FFD700" />
          </svg>
        </div>
      ))}
    </>
  );
}

export default Flowers;
