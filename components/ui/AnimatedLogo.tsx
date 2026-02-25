'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedLogoProps {
  className?: string;
}

// أيقونات مناسبة للميلاد وموضوع الموقع
const birthdayIcons = [
  '🎂', // كعكة عيد الميلاد
  '🎉', // احتفال
  '🎈', // بالون
  '🎁', // هدية
  '🌟', // نجمة
  '✨', // تلألؤ
  '🎊', // كونفيتي
  '💫', // نجمة متلألئة
  '🎯', // هدف (رمز للدقة في حساب العمر)
  '⏰', // ساعة (رمز للوقت)
  '🥳', // وجه احتفالي
  '🎀', // شريط هدية
];

export function AnimatedLogo({ className = '' }: AnimatedLogoProps) {
  const [currentIcon, setCurrentIcon] = useState('🎂');
  const [rotation, setRotation] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // اختيار أيقونة عشوائية عند التحميل
    const randomIndex = Math.floor(Math.random() * birthdayIcons.length);
    setCurrentIcon(birthdayIcons[randomIndex]);

    // اختيار اتجاه دوران عشوائي (يمين أو يسار)
    const randomRotation = Math.random() > 0.5 ? 360 : -360;
    setRotation(randomRotation);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center ${className}`}
      >
        <span className="text-white font-bold text-lg">م</span>
      </div>
    );
  }

  return (
    <motion.div
      className={`h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 flex items-center justify-center shadow-lg ${className}`}
      initial={{ rotate: 0, scale: 0.8 }}
      animate={{
        rotate: rotation,
        scale: 1,
      }}
      transition={{
        duration: 1.2,
        ease: 'easeOut',
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.15,
        rotate: rotation + 20,
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        className="text-xl filter drop-shadow-sm"
        animate={{
          y: [0, -2, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {currentIcon}
      </motion.span>
    </motion.div>
  );
}
