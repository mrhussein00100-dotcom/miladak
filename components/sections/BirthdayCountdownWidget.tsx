'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AgeData } from '@/types';
import { formatArabicNumber } from '@/lib/formatArabic';

interface Props {
  ageData: AgeData;
}

export default function BirthdayCountdownWidget({ ageData }: Props) {
  const [timeLeft, setTimeLeft] = useState({
    days: ageData.nextBirthday.daysUntil,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // حساب الوقت المتبقي بدقة
    const calculateTimeLeft = () => {
      const now = new Date();
      const birthDate = new Date(ageData.birthDate);

      // تاريخ عيد الميلاد القادم
      let nextBirthday = new Date(
        now.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
      );

      if (nextBirthday <= now) {
        nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
      }

      const diff = nextBirthday.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [ageData.birthDate]);

  const isToday =
    timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0;

  if (isToday) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-2xl p-8 text-white text-center relative overflow-hidden"
      >
        {/* Celebration effects */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.div
          className="text-6xl mb-4"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          🎂🎉🎊
        </motion.div>
        <h3 className="text-3xl font-black mb-2">عيد ميلاد سعيد!</h3>
        <p className="text-xl opacity-90">كل عام وأنت بخير! 🎈</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20"
    >
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold flex items-center justify-center gap-2">
          <span>🎂</span> العد التنازلي لعيد ميلادك
        </h3>
        <p className="text-sm text-muted-foreground">
          ستصبح {formatArabicNumber(ageData.nextBirthday.age)} سنة
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          {
            value: timeLeft.days,
            label: 'يوم',
            color: 'from-blue-500 to-cyan-500',
          },
          {
            value: timeLeft.hours,
            label: 'ساعة',
            color: 'from-purple-500 to-pink-500',
          },
          {
            value: timeLeft.minutes,
            label: 'دقيقة',
            color: 'from-orange-500 to-red-500',
          },
          {
            value: timeLeft.seconds,
            label: 'ثانية',
            color: 'from-green-500 to-emerald-500',
          },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1, type: 'spring' }}
            className="text-center"
          >
            <div
              className={`bg-gradient-to-br ${item.color} rounded-xl p-3 text-white mb-1`}
            >
              <motion.div
                key={item.value}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-2xl md:text-3xl font-black tabular-nums"
              >
                {formatArabicNumber(item.value)}
              </motion.div>
            </div>
            <div className="text-xs text-muted-foreground">{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>آخر عيد ميلاد</span>
          <span>عيد الميلاد القادم</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${((365 - timeLeft.days) / 365) * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
