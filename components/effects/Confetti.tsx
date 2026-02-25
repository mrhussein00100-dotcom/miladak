'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfettiProps {
  show: boolean;
  duration?: number;
  particleCount?: number;
}

const colors = ['#FF6B8A', '#B794F6', '#4FD1C5', '#FFD93D', '#6BCB77', '#FF9F43', '#EE5A24'];

export function Confetti({ show, duration = 4000, particleCount = 50 }: ConfettiProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(particleCount)].map((_, i) => {
        const randomX = Math.random() * 100;
        const randomDelay = Math.random() * 0.5;
        const randomDuration = 2 + Math.random() * 2;
        const randomRotation = Math.random() * 720 - 360;
        const shape = Math.random() > 0.5 ? 'rounded-sm' : 'rounded-full';
        const size = 8 + Math.random() * 8;

        return (
          <motion.div
            key={i}
            className={`absolute ${shape}`}
            style={{
              width: size,
              height: size,
              backgroundColor: colors[i % colors.length],
              left: `${randomX}%`,
              top: -20,
            }}
            initial={{ y: -20, rotate: 0, opacity: 1 }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
              rotate: randomRotation,
              opacity: [1, 1, 0],
              x: [0, (Math.random() - 0.5) * 200],
            }}
            transition={{
              duration: randomDuration,
              delay: randomDelay,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
}

// Continuous confetti rain for celebration mode
export function ConfettiRain({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${(i * 5) % 100}%`,
          }}
          animate={{
            y: ['-10%', '110%'],
            rotate: [0, 360],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

export default Confetti;
