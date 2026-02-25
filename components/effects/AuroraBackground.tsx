'use client';

import { motion } from 'framer-motion';

interface AuroraBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

export function AuroraBackground({ intensity = 'medium' }: AuroraBackgroundProps) {
  const opacityMap = {
    low: 0.15,
    medium: 0.25,
    high: 0.35,
  };

  const baseOpacity = opacityMap[intensity];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Aurora Layer 1 - Primary */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, 
            transparent 0%, 
            rgba(79, 209, 197, ${baseOpacity}) 20%, 
            rgba(183, 148, 246, ${baseOpacity}) 40%, 
            rgba(255, 107, 138, ${baseOpacity}) 60%, 
            transparent 100%
          )`,
          filter: 'blur(60px)',
        }}
        animate={{
          y: ['-20%', '20%', '-20%'],
          opacity: [baseOpacity, baseOpacity * 1.5, baseOpacity],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Aurora Layer 2 - Secondary */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, 
            transparent 0%, 
            rgba(183, 148, 246, ${baseOpacity * 0.8}) 30%, 
            rgba(79, 209, 197, ${baseOpacity * 0.8}) 70%, 
            transparent 100%
          )`,
          filter: 'blur(80px)',
        }}
        animate={{
          x: ['-10%', '10%', '-10%'],
          y: ['10%', '-10%', '10%'],
          opacity: [baseOpacity * 0.8, baseOpacity * 1.2, baseOpacity * 0.8],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Aurora Layer 3 - Accent */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, 
            rgba(255, 107, 138, ${baseOpacity * 0.6}) 0%, 
            transparent 50%
          )`,
          filter: 'blur(100px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [baseOpacity * 0.5, baseOpacity, baseOpacity * 0.5],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

// Rainbow wave effect for Miladak mode
export function RainbowWave() {
  const colors = [
    'rgba(255, 107, 138, 0.3)',
    'rgba(255, 159, 67, 0.3)',
    'rgba(255, 217, 61, 0.3)',
    'rgba(107, 203, 119, 0.3)',
    'rgba(79, 209, 197, 0.3)',
    'rgba(183, 148, 246, 0.3)',
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {colors.map((color, i) => (
        <motion.div
          key={i}
          className="absolute w-full h-32"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            top: `${i * 15}%`,
            filter: 'blur(40px)',
          }}
          animate={{
            x: ['-100%', '100%'],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8 + i * 2,
            delay: i * 0.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

export default AuroraBackground;
