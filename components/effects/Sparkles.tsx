'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SparklesProps {
  children?: React.ReactNode;
  color?: string;
  count?: number;
  minSize?: number;
  maxSize?: number;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

export function Sparkles({
  children,
  color = '#FFD700',
  count = 10,
  minSize = 10,
  maxSize = 20,
}: SparklesProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generateSparkle = (): Sparkle => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: minSize + Math.random() * (maxSize - minSize),
      delay: Math.random() * 2,
    });

    setSparkles(Array.from({ length: count }, generateSparkle));

    const interval = setInterval(() => {
      setSparkles(prev => {
        const newSparkles = [...prev];
        const indexToReplace = Math.floor(Math.random() * newSparkles.length);
        newSparkles[indexToReplace] = generateSparkle();
        return newSparkles;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [count, minSize, maxSize]);

  return (
    <div className="relative inline-block">
      {sparkles.map(sparkle => (
        <motion.svg
          key={sparkle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: sparkle.size,
            height: sparkle.size,
          }}
          viewBox="0 0 160 160"
          fill="none"
          initial={{ scale: 0, rotate: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 0],
            rotate: [0, 180],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            delay: sparkle.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
          }}
        >
          <path
            d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
            fill={color}
          />
        </motion.svg>
      ))}
      {children}
    </div>
  );
}

// Sparkle burst effect
export function SparkleBurst({ show, onComplete }: { show: boolean; onComplete?: () => void }) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {[...Array(20)].map((_, i) => {
            const angle = (i * 18 * Math.PI) / 180;
            const distance = 150 + Math.random() * 100;
            
            return (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1.5, 0],
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              >
                ✨
              </motion.div>
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}

export default Sparkles;
