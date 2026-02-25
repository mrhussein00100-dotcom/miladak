'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import DualDateInput from '@/components/ui/DualDateInput';
import { formatArabicNumber } from '@/lib/formatArabic';
import { Timer, RotateCcw, Zap } from 'lucide-react';

interface AgeInSecondsResult {
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
  weeks: number;
  months: number;
  years: number;
}

export function AgeInSecondsCalculator() {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [result, setResult] = useState<AgeInSecondsResult | null>(null);
  const [error, setError] = useState('');

  const calculateAge = () => {
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
    updateAge(birthDate);
  };

  const updateAge = (birth: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - birth.getTime();
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44);
    const years = Math.floor(days / 365.25);
    setResult({ seconds, minutes, hours, days, weeks, months, years });
  };

  useEffect(() => {
    if (!result || !birthDate) return;
    const interval = setInterval(() => updateAge(birthDate), 1000);
    return () => clearInterval(interval);
  }, [result, birthDate]);

  const handleReset = () => {
    setBirthDate(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Timer className="w-6 h-6 text-blue-600" />
            أدخل تاريخ ميلادك
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="glass p-4 rounded-xl">
            <DualDateInput
              value={birthDate}
              onChange={setBirthDate}
              label="🎂 تاريخ الميلاد"
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
              onClick={calculateAge}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 px-8"
            >
              <Timer className="w-5 h-5 ml-2" />
              احسب عمري
            </Button>
            {result && (
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-5 h-5 ml-2" />
                إعادة تعيين
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Zap className="w-6 h-6" />
                ⏱️ عمرك بالتفصيل - مباشر
                <Zap className="w-6 h-6" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* العداد الرئيسي - الثواني */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="text-center p-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-xl"
              >
                <div className="text-5xl md:text-6xl font-bold text-white mb-2 font-mono animate-pulse">
                  {formatArabicNumber(result.seconds)}
                </div>
                <div className="text-xl text-white/90">⚡ ثانية</div>
              </motion.div>

              {/* التفاصيل */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <AgeBox
                  label="دقيقة"
                  value={result.minutes}
                  icon="⏱️"
                  color="purple"
                />
                <AgeBox
                  label="ساعة"
                  value={result.hours}
                  icon="⏰"
                  color="pink"
                />
                <AgeBox
                  label="يوم"
                  value={result.days}
                  icon="📅"
                  color="indigo"
                />
                <AgeBox
                  label="أسبوع"
                  value={result.weeks}
                  icon="📆"
                  color="cyan"
                />
                <AgeBox
                  label="شهر"
                  value={result.months}
                  icon="🗓️"
                  color="green"
                />
                <AgeBox
                  label="سنة"
                  value={result.years}
                  icon="🎂"
                  color="orange"
                />
              </div>

              {/* معلومة */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-center">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  ⚡ العداد يتحدث تلقائياً كل ثانية!
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

function AgeBox({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    purple: 'from-purple-500 to-pink-500',
    pink: 'from-pink-500 to-rose-500',
    indigo: 'from-indigo-500 to-purple-500',
    cyan: 'from-cyan-500 to-blue-500',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-amber-500',
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`text-center p-4 bg-gradient-to-br ${colorClasses[color]} rounded-xl shadow-lg`}
    >
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-xl font-bold text-white font-mono">
        {formatArabicNumber(value)}
      </div>
      <div className="text-sm text-white/80">{label}</div>
    </motion.div>
  );
}
