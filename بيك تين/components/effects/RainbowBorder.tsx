'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RainbowBorderProps {
  children: React.ReactNode;
  className?: string;
  borderWidth?: number;
  animated?: boolean;
  speed?: 'slow' | 'normal' | 'fast';
}

export function RainbowBorder({
  children,
  className,
  borderWidth = 3,
  animated = true,
  speed = 'normal',
}: RainbowBorderProps) {
  const speedMap = {
    slow: 6,
    normal: 3,
    fast: 1.5,
  };

  return (
    <div className={cn('relative p-[3px] rounded-2xl overflow-hidden', className)}>
      {/* Rainbow gradient border */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(
            var(--rainbow-angle, 0deg),
            #FF6B8A,
            #FF9F43,
            #FFD93D,
            #6BCB77,
            #4FD1C5,
            #B794F6,
            #FF6B8A
          )`,
          padding: borderWidth,
        }}
        animate={animated ? {
          '--rainbow-angle': ['0deg', '360deg'],
        } as Record<string, string[]> : undefined}
        transition={{
          duration: speedMap[speed],
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Content container */}
      <div className="relative bg-card rounded-xl z-10">
        {children}
      </div>
    </div>
  );
}

// Glow border for dark mode
export function GlowBorder({
  children,
  className,
  color = 'primary',
  intensity = 'medium',
}: {
  children: React.ReactNode;
  className?: string;
  color?: 'primary' | 'secondary' | 'accent';
  intensity?: 'low' | 'medium' | 'high';
}) {
  const colorMap = {
    primary: 'rgba(255, 107, 138, VAR)',
    secondary: 'rgba(183, 148, 246, VAR)',
    accent: 'rgba(79, 209, 197, VAR)',
  };

  const intensityMap = {
    low: 0.3,
    medium: 0.5,
    high: 0.7,
  };

  const glowColor = colorMap[color].replace('VAR', String(intensityMap[intensity]));

  return (
    <motion.div
      className={cn('relative rounded-2xl', className)}
      style={{
        boxShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor.replace(String(intensityMap[intensity]), String(intensityMap[intensity] * 0.5))}`,
      }}
      animate={{
        boxShadow: [
          `0 0 20px ${glowColor}, 0 0 40px ${glowColor.replace(String(intensityMap[intensity]), String(intensityMap[intensity] * 0.5))}`,
          `0 0 30px ${glowColor}, 0 0 60px ${glowColor.replace(String(intensityMap[intensity]), String(intensityMap[intensity] * 0.7))}`,
          `0 0 20px ${glowColor}, 0 0 40px ${glowColor.replace(String(intensityMap[intensity]), String(intensityMap[intensity] * 0.5))}`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

// Animated gradient border
export function AnimatedGradientBorder({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative p-[2px] rounded-2xl overflow-hidden group', className)}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'conic-gradient(from 0deg, #FF6B8A, #B794F6, #4FD1C5, #FFD93D, #FF6B8A)',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <div className="relative bg-card rounded-xl z-10">
        {children}
      </div>
    </div>
  );
}

export default RainbowBorder;
