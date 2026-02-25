'use client';

import { motion } from 'framer-motion';
import { AgeData } from '@/types';
import { formatArabicNumber } from '@/lib/formatArabic';

interface Props {
  ageData: AgeData;
}

export default function BirthdayCard({ ageData }: Props) {
  const daysUntil = ageData.nextBirthday.daysUntil;
  const nextAge = ageData.nextBirthday.age;

  // تحديد الرسالة حسب قرب عيد الميلاد
  const getMessage = () => {
    if (daysUntil === 0)
      return {
        text: '🎉 عيد ميلاد سعيد! 🎂',
        gradient: 'linear-gradient(135deg, #ff0080 0%, #ff6b8a 100%)',
      };
    if (daysUntil <= 7)
      return {
        text: '🎁 عيد ميلادك قريب جداً!',
        gradient: 'linear-gradient(135deg, #ff8c00 0%, #feca57 100%)',
      };
    if (daysUntil <= 30)
      return {
        text: '🎈 استعد للاحتفال!',
        gradient: 'linear-gradient(135deg, #b794f6 0%, #ff6b8a 100%)',
      };
    if (daysUntil <= 90)
      return {
        text: '⏳ العد التنازلي بدأ',
        gradient: 'linear-gradient(135deg, #00d4ff 0%, #4fd1c5 100%)',
      };
    return {
      text: '📅 موعد مميز قادم',
      gradient: 'linear-gradient(135deg, #ff0080 0%, #00d4ff 100%)',
    };
  };

  const { text: message, gradient } = getMessage();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl"
      style={{ background: gradient }}
    >
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 right-4 text-6xl">🎂</div>
        <div className="absolute bottom-4 left-4 text-4xl">🎈</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl opacity-10">
          🎁
        </div>
      </div>

      <div className="relative z-10">
        {/* العنوان */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold mb-1">{message}</h3>
          <p className="text-white/80 text-sm">عيد ميلادك القادم</p>
        </div>

        {/* العد التنازلي */}
        <div className="flex justify-center items-center gap-4 mb-4">
          <motion.div
            className="text-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="text-5xl font-black">
              {formatArabicNumber(daysUntil)}
            </div>
            <div className="text-sm text-white/80">يوم متبقي</div>
          </motion.div>
        </div>

        {/* العمر القادم */}
        <div className="text-center bg-white/20 rounded-xl p-3 backdrop-blur-sm">
          <p className="text-sm">
            ستصبح{' '}
            <span className="font-bold text-lg">
              {formatArabicNumber(nextAge)}
            </span>{' '}
            سنة 🎉
          </p>
        </div>

        {/* تاريخ عيد الميلاد */}
        <div className="mt-4 text-center text-white/70 text-xs">
          <p>📅 {ageData.nextBirthday.date}</p>
        </div>
      </div>

      {/* تأثيرات متحركة */}
      {daysUntil <= 7 && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {['🎈', '🎁', '✨', '🎊', '🎉'][i % 5]}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
