'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cake,
  Calendar,
  Calculator,
  Sparkles,
  Gift,
  PartyPopper,
} from 'lucide-react';
import Link from 'next/link';

// Confetti configuration - deterministic for consistent rendering
const CONFETTI_CONFIG = Array.from({ length: 20 }).map((_, i) => {
  const idx = i + 1;
  const x = (idx * 37) % 100;
  const duration = 2 + ((idx * 17) % 30) / 10;
  const delay = ((idx * 13) % 20) / 10;
  const initialRotate = (idx * 53) % 360;
  const animateRotate = (idx * 97) % 720;
  return { x, duration, delay, initialRotate, animateRotate };
});

export default function WelcomeScreen() {
  const [show, setShow] = useState(false); // Start hidden
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // تأخير قبل ظهور الشاشة الترحيبية (300ms)
    const showTimer = setTimeout(() => {
      setShow(true);
    }, 300);

    // Progress bar animation - starts after showing
    const progressTimer = setTimeout(() => {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 35); // أبطأ قليلاً

      // Cleanup progress interval
      setTimeout(() => clearInterval(progressInterval), 2500);
    }, 400);

    // Hide screen after 3.5 seconds total
    const hideTimer = setTimeout(() => {
      setShow(false);
    }, 3500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(progressTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center z-[9999]"
          role="dialog"
          aria-label="شاشة ترحيب موقع ميلادك"
        >
          {/* Background Confetti */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {CONFETTI_CONFIG.map((cfg, i) => (
              <motion.div
                key={i}
                initial={{
                  y: -100,
                  x: `${cfg.x}vw`,
                  rotate: cfg.initialRotate,
                }}
                animate={{
                  y: '110vh',
                  rotate: cfg.animateRotate,
                }}
                transition={{
                  duration: cfg.duration,
                  repeat: Infinity,
                  delay: cfg.delay,
                }}
                className={`absolute w-3 h-3 rounded-full ${
                  i % 4 === 0
                    ? 'bg-pink-400'
                    : i % 4 === 1
                    ? 'bg-blue-400'
                    : i % 4 === 2
                    ? 'bg-yellow-400'
                    : 'bg-purple-400'
                }`}
              />
            ))}
          </div>

          <div className="relative text-center">
            {/* Main Logo with Bounce */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                duration: 0.8,
              }}
              className="relative mb-8"
            >
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative inline-block"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-full blur-3xl bg-gradient-to-r from-purple-400 to-blue-400 opacity-30 animate-pulse" />

                {/* Main Circle */}
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                  <Cake className="w-16 h-16 text-white" />
                </div>

                {/* Floating Sparkles */}
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.3, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute -top-3 -right-3"
                >
                  <Sparkles className="w-7 h-7 text-yellow-400 drop-shadow-lg" />
                </motion.div>

                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.3, 1] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: 0.5,
                  }}
                  className="absolute -bottom-3 -left-3"
                >
                  <Gift className="w-7 h-7 text-pink-400 drop-shadow-lg" />
                </motion.div>

                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.3, 1] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: 1,
                  }}
                  className="absolute -top-3 -left-3"
                >
                  <PartyPopper className="w-7 h-7 text-blue-400 drop-shadow-lg" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Welcome Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3">
                مرحباً بك
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                في{' '}
                <Link href="/" className="gradient-text">
                  ميلادك
                </Link>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                اكتشف عمرك بدقة مع معلومات وإحصائيات ممتعة
              </p>
            </motion.div>

            {/* Animated Icons Row */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center gap-4 mt-8 mb-8"
            >
              {[
                {
                  icon: Calendar,
                  color: 'text-blue-500',
                  bg: 'bg-blue-100 dark:bg-blue-900/30',
                },
                {
                  icon: Calculator,
                  color: 'text-purple-500',
                  bg: 'bg-purple-100 dark:bg-purple-900/30',
                },
                {
                  icon: Sparkles,
                  color: 'text-yellow-500',
                  bg: 'bg-yellow-100 dark:bg-yellow-900/30',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                    ease: 'easeInOut',
                  }}
                  className={`${item.bg} rounded-2xl p-4 shadow-lg`}
                >
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                </motion.div>
              ))}
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="w-80 max-w-full mx-auto"
            >
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 rounded-full"
                />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-sm text-gray-500 dark:text-gray-400 mt-3"
              >
                {progress}%
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
