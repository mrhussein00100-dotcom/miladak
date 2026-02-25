'use client';

import React from 'react';
import { Position } from '@/lib/cards/decorations';

interface ConfettiProps {
  positions: Position[];
  colors: string[];
  animated?: boolean;
  opacity?: number;
}

export function Confetti({
  positions,
  colors,
  animated = true,
  opacity = 0.9,
}: ConfettiProps) {
  const shapes = ['rect', 'circle', 'triangle'];

  return (
    <>
      {positions.map((pos, index) => {
        const shape = shapes[index % shapes.length];
        const color = colors[index % colors.length];

        return (
          <div
            key={index}
            className={`absolute pointer-events-none ${
              animated ? 'animate-confetti-fall' : ''
            }`}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `rotate(${pos.rotation || 0}deg) scale(${
                pos.scale || 1
              })`,
              opacity,
              animationDelay: `${index * 0.15}s`,
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill={color}
              xmlns="http://www.w3.org/2000/svg"
            >
              {shape === 'rect' && (
                <rect x="2" y="2" width="8" height="8" rx="1" />
              )}
              {shape === 'circle' && <circle cx="6" cy="6" r="5" />}
              {shape === 'triangle' && <polygon points="6,1 11,11 1,11" />}
            </svg>
          </div>
        );
      })}
    </>
  );
}

export default Confetti;
