'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import DualDateInput from '@/components/ui/DualDateInput';
import { formatArabicNumber } from '@/lib/formatArabic';
import { ArrowUpDown, Calculator, RotateCcw } from 'lucide-react';

interface DaysResult {
  days: number;
  weeks: number;
  months: number;
  years: number;
  hours: number;
  minutes: number;
  isNegative: boolean;
}

export function DaysBetweenCalculator() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [result, setResult] = useState<DaysResult | null>(null);
  const [error, setError] = useState('');

  const calculateDays = () => {
    setError('');

    if (!startDate || !endDate) {
      setError('يرجى إدخال كلا التاريخين');
      return;
    }

    const diffMs = endDate.getTime() - startDate.getTime();
    const isNegative = diffMs < 0;
    const absDiffMs = Math.abs(diffMs);

    const days = Math.floor(absDiffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44);
    const years = Math.floor(days / 365.25);
    const hours = Math.floor(absDiffMs / (1000 * 60 * 60));
    const minutes = Math.floor(absDiffMs / (1000 * 60));

    setResult({
      days,
      weeks,
      months,
      years,
      hours,
      minutes,
      isNegative,
    });
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setResult(null);
    setError('');
  };

  const swapDates = () => {
    const temp = startDate;
    setStartDate(endDate);
    setEndDate(temp);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Calculator className="w-6 h-6 text-blue-600" />
            أدخل التاريخين
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* التاريخ الأول */}
          <div className="glass p-4 rounded-xl">
            <DualDateInput
              value={startDate}
              onChange={setStartDate}
              label="📅 التاريخ الأول"
              placeholder="أدخل التاريخ (مثال: 15/06/1990)"
              supportHijri
            />
          </div>

          {/* زر التبديل */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={swapDates}
              className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all"
              title="تبديل التاريخين"
            >
              <ArrowUpDown className="w-5 h-5" />
            </motion.button>
          </div>

          {/* التاريخ الثاني */}
          <div className="glass p-4 rounded-xl">
            <DualDateInput
              value={endDate}
              onChange={setEndDate}
              label="📅 التاريخ الثاني"
              placeholder="أدخل التاريخ (مثال: 25/12/2024)"
              supportHijri
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
              onClick={calculateDays}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 px-8"
            >
              <Calculator className="w-5 h-5 ml-2" />
              احسب الفرق
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
          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-center text-green-700 dark:text-green-400">
                ✅{' '}
                {result.isNegative
                  ? 'التاريخ الأول بعد الثاني بـ'
                  : 'الفرق بين التاريخين'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* النتيجة الرئيسية */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="text-center p-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl"
              >
                <div className="text-6xl font-bold text-white mb-2">
                  {formatArabicNumber(result.days)}
                </div>
                <div className="text-xl text-white/90">📅 يوم</div>
              </motion.div>

              {/* التفاصيل */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ResultBox
                  label="أسبوع"
                  value={result.weeks}
                  icon="📆"
                  color="purple"
                />
                <ResultBox
                  label="شهر"
                  value={result.months}
                  icon="🗓️"
                  color="pink"
                />
                <ResultBox
                  label="سنة"
                  value={result.years}
                  icon="📅"
                  color="indigo"
                />
                <ResultBox
                  label="ساعة"
                  value={result.hours}
                  icon="⏰"
                  color="orange"
                />
                <ResultBox
                  label="دقيقة"
                  value={result.minutes}
                  icon="⏱️"
                  color="green"
                />
              </div>

              {/* معلومة إضافية */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-center">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 هذا يعادل تقريباً{' '}
                  {formatArabicNumber(Math.floor(result.days / 7))} أسبوع و{' '}
                  {formatArabicNumber(result.days % 7)} أيام
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

function ResultBox({
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
    orange: 'from-orange-500 to-amber-500',
    green: 'from-green-500 to-emerald-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`text-center p-4 bg-gradient-to-br ${colorClasses[color]} rounded-xl shadow-lg`}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-white">
        {formatArabicNumber(value)}
      </div>
      <div className="text-sm text-white/80">{label}</div>
    </motion.div>
  );
}
