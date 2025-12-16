'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import DualDateInput from '@/components/ui/DualDateInput';
import { formatArabicNumber } from '@/lib/formatArabic';
import { Cake, PartyPopper, Clock, RotateCcw, Sparkles } from 'lucide-react';

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  nextAge: number;
  nextBirthdayDate: string;
}

export function BirthdayCountdown() {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState<CountdownResult | null>(null);
  const [error, setError] = useState('');

  const calculateCountdown = () => {
    setError('');
    if (!birthDate) {
      setError('يرجى إدخال تاريخ الميلاد');
      return;
    }
    const now = new Date();
    if (birthDate > now) {
      setError('لا يمكن أن يكون تاريخ الميلاد في المستقبل');
      return;
    }
    updateCountdown(birthDate);
  };

  const updateCountdown = (birth: Date) => {
    const now = new Date();
    const thisYearBirthday = new Date(
      now.getFullYear(),
      birth.getMonth(),
      birth.getDate()
    );
    let nextBirthday: Date;
    let nextAge: number;
    if (thisYearBirthday > now) {
      nextBirthday = thisYearBirthday;
      nextAge = now.getFullYear() - birth.getFullYear();
    } else {
      nextBirthday = new Date(
        now.getFullYear() + 1,
        birth.getMonth(),
        birth.getDate()
      );
      nextAge = now.getFullYear() - birth.getFullYear() + 1;
    }
    const diff = nextBirthday.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    setCountdown({
      days,
      hours,
      minutes,
      seconds,
      nextAge,
      nextBirthdayDate: nextBirthday.toLocaleDateString('ar-SA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    });
  };

  useEffect(() => {
    if (!countdown || !birthDate) return;
    const interval = setInterval(() => updateCountdown(birthDate), 1000);
    return () => clearInterval(interval);
  }, [countdown, birthDate]);

  const handleReset = () => {
    setBirthDate(null);
    setCountdown(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-pink-200 dark:border-pink-800">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Cake className="w-6 h-6 text-pink-600" />
            أدخل تاريخ ميلادك
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="glass p-4 rounded-xl">
            <DualDateInput
              value={birthDate}
              onChange={setBirthDate}
              label="🎂 تاريخ الميلاد"
              placeholder="أدخل تاريخ ميلادك (مثال: 15/06/1990)"
              supportHijri
              maxDate={new Date()}
            />
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500 text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg"
            >
              ⚠️ {error}
            </motion.p>
          )}
          <div className="flex gap-4 justify-center pt-4">
            <Button
              onClick={calculateCountdown}
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-90 px-8"
            >
              <Clock className="w-5 h-5 ml-2" />
              ابدأ العد التنازلي
            </Button>
            {countdown && (
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-5 h-5 ml-2" />
                إعادة تعيين
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {countdown && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-2 border-purple-200 dark:border-purple-800 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <PartyPopper className="w-6 h-6" />
                🎂 عيد ميلادك القادم
                <PartyPopper className="w-6 h-6" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-purple-700 dark:text-purple-300 font-medium">
                    {countdown.nextBirthdayDate}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <CountdownBox
                  value={countdown.days}
                  label="يوم"
                  icon="📅"
                  color="pink"
                />
                <CountdownBox
                  value={countdown.hours}
                  label="ساعة"
                  icon="⏰"
                  color="purple"
                />
                <CountdownBox
                  value={countdown.minutes}
                  label="دقيقة"
                  icon="⏱️"
                  color="indigo"
                />
                <CountdownBox
                  value={countdown.seconds}
                  label="ثانية"
                  icon="⚡"
                  color="rose"
                  animate
                />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
                className="text-center p-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl shadow-xl"
              >
                <div className="text-sm text-white/80 mb-2">🎉 ستصبح</div>
                <div className="text-5xl font-bold text-white mb-1">
                  {formatArabicNumber(countdown.nextAge)}
                </div>
                <div className="text-xl text-white/90">سنة</div>
              </motion.div>
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-4 rounded-xl text-center">
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  🎊 استعد للاحتفال! شارك هذا العد التنازلي مع أصدقائك وعائلتك
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

function CountdownBox({
  value,
  label,
  icon,
  color,
  animate = false,
}: {
  value: number;
  label: string;
  icon: string;
  color: string;
  animate?: boolean;
}) {
  const colorClasses: Record<string, string> = {
    pink: 'from-pink-500 to-rose-500',
    purple: 'from-purple-500 to-pink-500',
    indigo: 'from-indigo-500 to-purple-500',
    rose: 'from-rose-500 to-red-500',
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`text-center p-3 md:p-4 bg-gradient-to-br ${
        colorClasses[color]
      } rounded-xl shadow-lg ${animate ? 'animate-pulse' : ''}`}
    >
      <div className="text-lg md:text-xl mb-1">{icon}</div>
      <div className="text-xl md:text-3xl font-bold text-white">
        {formatArabicNumber(value)}
      </div>
      <div className="text-xs md:text-sm text-white/80">{label}</div>
    </motion.div>
  );
}
