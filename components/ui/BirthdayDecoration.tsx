'use client';

import { motion } from 'framer-motion';

interface BirthdayDecorationProps {
  className?: string;
}

// زينة عيد الميلاد للسقف
export function BirthdayDecoration({
  className = '',
}: BirthdayDecorationProps) {
  // عناصر الزينة المعلقة
  const decorations = [
    { emoji: '🎈', x: 5, delay: 0, color: '#FF6B8A' },
    { emoji: '🎀', x: 15, delay: 0.1, color: '#B794F6' },
    { emoji: '🎁', x: 25, delay: 0.2, color: '#4FD1C5' },
    { emoji: '⭐', x: 35, delay: 0.3, color: '#FFD700' },
    { emoji: '🎂', x: 50, delay: 0.4, color: '#FF6B8A' },
    { emoji: '⭐', x: 65, delay: 0.3, color: '#FFD700' },
    { emoji: '🎁', x: 75, delay: 0.2, color: '#4FD1C5' },
    { emoji: '🎀', x: 85, delay: 0.1, color: '#B794F6' },
    { emoji: '🎈', x: 95, delay: 0, color: '#FF6B8A' },
  ];

  // البالونات الصغيرة
  const smallBalloons = [
    { x: 10, size: 12, color: '#FF6B8A', delay: 0.5 },
    { x: 30, size: 10, color: '#B794F6', delay: 0.7 },
    { x: 50, size: 14, color: '#4FD1C5', delay: 0.6 },
    { x: 70, size: 11, color: '#FFD700', delay: 0.8 },
    { x: 90, size: 13, color: '#FF0080', delay: 0.4 },
  ];

  return (
    <div
      className={`absolute top-0 left-0 right-0 h-16 overflow-hidden pointer-events-none ${className}`}
    >
      {/* الخلفية المتدرجة للسقف */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-secondary/5 to-transparent" />

      {/* خط الزينة الرئيسي (الجارلاند) */}
      <svg
        className="absolute top-0 left-0 w-full h-12"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
      >
        {/* الخط المتموج للزينة */}
        <motion.path
          d="M0,6 Q12.5,2 25,6 T50,6 T75,6 T100,6"
          fill="none"
          stroke="url(#garlandGradient)"
          strokeWidth="0.8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        {/* خط ثاني للعمق */}
        <motion.path
          d="M0,8 Q12.5,4 25,8 T50,8 T75,8 T100,8"
          fill="none"
          stroke="url(#garlandGradient2)"
          strokeWidth="0.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient
            id="garlandGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#FF6B8A" />
            <stop offset="25%" stopColor="#B794F6" />
            <stop offset="50%" stopColor="#4FD1C5" />
            <stop offset="75%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FF6B8A" />
          </linearGradient>
          <linearGradient
            id="garlandGradient2"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#B794F6" />
            <stop offset="50%" stopColor="#FF6B8A" />
            <stop offset="100%" stopColor="#B794F6" />
          </linearGradient>
        </defs>
      </svg>

      {/* الزينة المعلقة */}
      {decorations.map((item, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ left: `${item.x}%`, top: 0 }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: item.delay, duration: 0.5, type: 'spring' }}
        >
          {/* الخيط */}
          <div
            className="w-px mx-auto"
            style={{
              height: `${8 + (index % 3) * 4}px`,
              background: `linear-gradient(to bottom, ${item.color}, transparent)`,
            }}
          />
          {/* الأيقونة */}
          <motion.span
            className="block text-sm filter drop-shadow-sm"
            animate={{
              y: [0, 2, 0],
              rotate: [-3, 3, -3],
            }}
            transition={{
              duration: 2 + index * 0.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {item.emoji}
          </motion.span>
        </motion.div>
      ))}

      {/* البالونات الصغيرة المتحركة */}
      {smallBalloons.map((balloon, index) => (
        <motion.div
          key={`balloon-${index}`}
          className="absolute rounded-full"
          style={{
            left: `${balloon.x}%`,
            width: balloon.size,
            height: balloon.size,
            background: `radial-gradient(circle at 30% 30%, white, ${balloon.color})`,
            boxShadow: `0 2px 4px ${balloon.color}40`,
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{
            y: [4, 8, 4],
            opacity: 0.8,
          }}
          transition={{
            y: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: balloon.delay,
            },
            opacity: { duration: 0.5, delay: balloon.delay },
          }}
        />
      ))}

      {/* النجوم اللامعة */}
      {[20, 40, 60, 80].map((x, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute text-xs"
          style={{ left: `${x}%`, top: '2px' }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
}
