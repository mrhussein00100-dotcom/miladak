'use client';

import { motion } from 'framer-motion';

interface FloatingElementsProps {
  elements?: string[];
  count?: number;
  speed?: 'slow' | 'normal' | 'fast';
}

const defaultElements = ['🎈', '⭐', '🎉', '✨', '🎊', '💫', '🌟', '🎁', '🎂', '🥳'];

export function FloatingElements({
  elements = defaultElements,
  count = 15,
  speed = 'normal',
}: FloatingElementsProps) {
  const speedMultiplier = {
    slow: 1.5,
    normal: 1,
    fast: 0.6,
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(count)].map((_, i) => {
        const element = elements[i % elements.length];
        const duration = (15 + Math.random() * 10) * speedMultiplier[speed];
        const delay = Math.random() * 10;
        const startX = Math.random() * 100;
        const size = 1 + Math.random() * 1.5;

        return (
          <motion.div
            key={i}
            className="absolute text-2xl md:text-3xl"
            style={{
              left: `${startX}%`,
              fontSize: `${size}rem`,
            }}
            initial={{ y: '110vh', opacity: 0, rotate: 0 }}
            animate={{
              y: '-10vh',
              opacity: [0, 0.7, 0.7, 0],
              rotate: [0, 180, 360],
              x: [0, Math.sin(i) * 50, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {element}
          </motion.div>
        );
      })}
    </div>
  );
}

// Floating balloons specifically
export function FloatingBalloons({ count = 8 }: { count?: number }) {

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl md:text-4xl"
          style={{ left: `${(i * 12.5) % 100}%` }}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{
            y: '-10vh',
            opacity: [0, 0.8, 0.8, 0],
            x: [0, Math.sin(i * 0.5) * 30, 0],
          }}
          transition={{
            duration: 20 + i * 2,
            delay: i * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          🎈
        </motion.div>
      ))}
    </div>
  );
}

// Floating stars for dark mode
export function FloatingStars({ count = 20 }: { count?: number }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0.5, 1, 0.5],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {Math.random() > 0.5 ? '⭐' : '✨'}
        </motion.div>
      ))}
    </div>
  );
}

export default FloatingElements;
