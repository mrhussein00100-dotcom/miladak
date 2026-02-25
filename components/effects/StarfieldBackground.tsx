'use client';
import { motion } from 'framer-motion';

interface StarfieldBackgroundProps {
  starCount?: number;
  speed?: number;
}

export function StarfieldBackground({ starCount = 100, speed = 1 }: StarfieldBackgroundProps) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-gradient-to-b from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a1a]">
      {/* Static stars */}
      {[...Array(starCount)].map((_, i) => {
        const size = Math.random() * 3 + 1;
        const opacity = Math.random() * 0.5 + 0.3;
        const duration = (3 + Math.random() * 4) / speed;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [opacity, opacity * 1.5, opacity],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        );
      })}

      {/* Shooting stars */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`shooting-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            boxShadow: '0 0 6px 2px rgba(255,255,255,0.6), -20px 0 10px rgba(255,255,255,0.3)',
          }}
          initial={{
            left: `${20 + i * 30}%`,
            top: '-5%',
            opacity: 0,
          }}
          animate={{
            left: `${-10 + i * 30}%`,
            top: '50%',
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: 5 + i * 8,
            repeat: Infinity,
            repeatDelay: 15,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// Nebula effect for dark mode
export function NebulaBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(183,148,246,0.3) 0%, transparent 70%)',
          left: '10%',
          top: '20%',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(255,107,138,0.3) 0%, transparent 70%)',
          right: '10%',
          bottom: '20%',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.3, 0.2],
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

export default StarfieldBackground;
