'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardDecorationsProps {
  theme: 'light' | 'dark' | 'colorful';
  size?: 'sm' | 'md' | 'lg';
}

export default function CardDecorations({
  theme,
  size = 'md',
}: CardDecorationsProps) {
  const decorations = [
    { emoji: '🎉', position: { top: '10%', left: '10%' }, delay: 0 },
    { emoji: '🎈', position: { top: '15%', right: '15%' }, delay: 0.2 },
    { emoji: '🎂', position: { bottom: '15%', left: '12%' }, delay: 0.4 },
    { emoji: '✨', position: { bottom: '10%', right: '10%' }, delay: 0.6 },
    { emoji: '🎊', position: { top: '50%', left: '5%' }, delay: 0.8 },
    { emoji: '🌟', position: { top: '60%', right: '8%' }, delay: 1.0 },
  ];

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <>
      {decorations.map((decoration, index) => (
        <motion.div
          key={index}
          className={`absolute ${sizeClasses[size]} opacity-20 pointer-events-none select-none`}
          style={decoration.position}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{
            opacity: 0.3,
            scale: 1,
            rotate: 0,
            y: [0, -5, 0],
          }}
          transition={{
            duration: 0.6,
            delay: decoration.delay,
            y: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          {decoration.emoji}
        </motion.div>
      ))}

      {/* Floating particles */}
      {theme === 'colorful' && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 rounded-full opacity-40"
              style={{
                background: `hsl(${i * 45}, 70%, 60%)`,
                top: `${20 + i * 10}%`,
                left: `${10 + i * 8}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
          ))}
        </>
      )}
    </>
  );
}
