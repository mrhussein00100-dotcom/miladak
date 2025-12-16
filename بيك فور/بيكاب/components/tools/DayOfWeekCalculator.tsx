'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import DualDateInput from '@/components/ui/DualDateInput';
import { CalendarDays, RotateCcw, Calendar } from 'lucide-react';

const ARABIC_DAYS = [
  {
    name: 'الأحد',
    english: 'Sunday',
    emoji: '☀️',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    name: 'الإثنين',
    english: 'Monday',
    emoji: '🌙',
    color: 'from-gray-500 to-slate-500',
  },
  {
    name: 'الثلاثاء',
    english: 'Tuesday',
    emoji: '🔥',
    color: 'from-red-500 to-orange-500',
  },
  {
    name: 'الأربعاء',
    english: 'Wednesday',
    emoji: '💧',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'الخميس',
    english: 'Thursday',
    emoji: '⚡',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    name: 'الجمعة',
    english: 'Friday',
    emoji: '🌟',
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'السبت',
    english: 'Saturday',
    emoji: '🌍',
    color: 'from-teal-500 to-cyan-500',
  },
];

interface DayResult {
  dayIndex: number;
  dayName: string;
  dayEnglish: string;
  emoji: string;
  color: string;
  formattedDate: string;
}

export function DayOfWeekCalculator() {
  const [date, setDate] = useState<Date | null>(null);
  const [result, setResult] = useState<DayResult | null>(null);
  const [error, setError] = useState('');

  const calculateDay = () => {
    setError('');
    if (!date) {
      setError('يرجى إدخال التاريخ');
      return;
    }
    const dayIndex = date.getDay();
    const dayInfo = ARABIC_DAYS[dayIndex];
    setResult({
      dayIndex,
      dayName: dayInfo.name,
      dayEnglish: dayInfo.english,
      emoji: dayInfo.emoji,
      color: dayInfo.color,
      formattedDate: date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    });
  };

  const handleReset = () => {
    setDate(null);
    setResult(null);
    setError('');
  };

  const setToday = () => {
    setDate(new Date());
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-violet-200 dark:border-violet-800">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <CalendarDays className="w-6 h-6 text-violet-600" />
            أدخل التاريخ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="glass p-4 rounded-xl">
            <DualDateInput value={date} onChange={setDate} label="📅 التاريخ" />
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

          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <Button
              onClick={calculateDay}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 px-8"
            >
              <CalendarDays className="w-5 h-5 ml-2" />
              اعرف اليوم
            </Button>
            <Button variant="outline" onClick={setToday}>
              <Calendar className="w-5 h-5 ml-2" />
              اليوم
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
          <Card className="border-2 border-green-200 dark:border-green-800 overflow-hidden">
            <CardHeader
              className={`bg-gradient-to-r ${result.color} text-white`}
            >
              <CardTitle className="text-center">✅ النتيجة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* النتيجة الرئيسية */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className={`text-center p-8 bg-gradient-to-br ${result.color} rounded-2xl shadow-xl`}
              >
                <div className="text-7xl mb-4">{result.emoji}</div>
                <div className="text-4xl font-bold text-white mb-2">
                  {result.dayName}
                </div>
                <div className="text-xl text-white/90">{result.dayEnglish}</div>
              </motion.div>

              {/* التاريخ */}
              <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  📅 التاريخ
                </div>
                <div className="font-semibold text-lg">
                  {result.formattedDate}
                </div>
              </div>

              {/* جميع أيام الأسبوع */}
              <div className="grid grid-cols-7 gap-2">
                {ARABIC_DAYS.map((day, index) => (
                  <motion.div
                    key={day.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className={`text-center p-2 rounded-lg ${
                      index === result.dayIndex
                        ? `bg-gradient-to-br ${day.color} text-white shadow-lg scale-110`
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    <div className="text-lg">{day.emoji}</div>
                    <div className="text-xs font-medium truncate">
                      {day.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
