'use client';

import React from 'react';
import { Position } from '@/lib/cards/decorations';

interface BalloonsProps {
  positions: Position[];
  colors: string[];
  animated?: boolean;
  opacity?: number;
}

export function Balloons({
  positions,
  colors,
  animated = true,
  opacity = 0.8,
}: BalloonsProps) {
  return (
    <>
      {positions.map((pos, index) => (
        <div
          key={index}
          className={`absolute pointer-events-none ${
            animated ? 'animate-float' : ''
          }`}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: `rotate(${pos.rotation || 0}deg) scale(${
              pos.scale || 1
            })`,
            opacity,
            animationDelay: `${index * 0.3}s`,
          }}
        >
          <svg
            width="40"
            height="60"
            viewBox="0 0 40 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Balloon */}
            <ellipse
              cx="20"
              cy="20"
              rx="18"
              ry="22"
              fill={colors[index % colors.length]}
            />
            {/* Highlight */}
            <ellipse cx="14" cy="14" rx="4" ry="6" fill="white" opacity="0.4" />
            {/* Knot */}
            <path
              d="M18 42 L20 45 L22 42"
              stroke={colors[index % colors.length]}
              strokeWidth="2"
              fill="none"
            />
            {/* String */}
            <path
              d="M20 45 Q22 52 18 60"
              stroke="#888"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>
      ))}
    </>
  );
}

export default Balloons;
