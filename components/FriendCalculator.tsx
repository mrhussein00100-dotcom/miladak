'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  calculateAge,
  validateBirthDate,
} from '@/lib/calculations/ageCalculations';
import { formatArabicNumber } from '@/lib/formatArabic';
import { Button, CelebrationButton } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle, StatCard } from './ui/Card';
import { BirthdayDecoration } from './ui/BirthdayDecoration';
import { cn } from '@/lib/utils';
import type { AgeData } from '@/types';

interface FriendCalculatorProps {
  onResult?: (result: { name: string; age: AgeData }) => void;
  showInlineResult?: boolean;
}

export function FriendCalculator({
  onResult,
  showInlineResult = true,
}: FriendCalculatorProps) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<{ name: string; age: AgeData } | null>(
    null
  );
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [inputMode, setInputMode] = useState<'calendar' | 'simple'>('simple');
  const [simpleYear, setSimpleYear] = useState('');
  const [simpleMonth, setSimpleMonth] = useState('');
  const [simpleDay, setSimpleDay] = useState('');

  const toArabicNumerals = (num: number) => {
    return String(num)
      .split('')
      .map((d) => String.fromCharCode(0x0660 + parseInt(d)))
      .join('');
  };

  const currentYearVal = new Date().getFullYear();
  const years = Array.from({ length: currentYearVal - 1900 + 1 }, (_, i) => {
    const year = currentYearVal - i;
    return { value: String(year), label: toArabicNumerals(year) };
  });

  const months = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ].map((label, i) => ({ value: String(i + 1), label }));

  const daysCount =
    simpleYear && simpleMonth
      ? new Date(Number(simpleYear), Number(simpleMonth), 0).getDate()
      : 31;
  const days = Array.from({ length: daysCount }, (_, i) => ({
    value: String(i + 1),
    label: toArabicNumerals(i + 1),
  }));

  // Sync inputs
  useEffect(() => {
    if (simpleYear && simpleMonth && simpleDay) {
      const max = new Date(
        Number(simpleYear),
        Number(simpleMonth),
        0
      ).getDate();
      if (Number(simpleDay) > max) setSimpleDay(String(max));
    }
  }, [simpleYear, simpleMonth, simpleDay]);

  useEffect(() => {
    if (simpleYear && simpleMonth && simpleDay) {
      const dateStr = `${simpleYear}-${String(Number(simpleMonth)).padStart(
        2,
        '0'
      )}-${String(Number(simpleDay)).padStart(2, '0')}`;
      if (dateStr !== birthDate) setBirthDate(dateStr);
    }
  }, [simpleYear, simpleMonth, simpleDay, birthDate]);

  const handleCalculate = async () => {
    setError('');

    if (!name.trim()) {
      setError('برجاء إدخال اسم الصديق');
      return;
    }
    if (!birthDate) {
      setError('الرجاء إدخال تاريخ ميلاد الصديق');
      return;
    }

    setIsLoading(true);

    try {
      const date = new Date(birthDate);
      const validation = validateBirthDate(date);

      if (!validation.valid) {
        setError(validation.error || 'تاريخ غير صحيح');
        setIsLoading(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const ageData = calculateAge(date);
      const res = { name: name.trim(), age: ageData };
      setResult(res);
      onResult?.(res);
    } catch {
      setError('حدث خطأ في حساب العمر');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setName('');
    setBirthDate('');
    setSimpleYear('');
    setSimpleMonth('');
    setSimpleDay('');
    setResult(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      <Card variant="glow" className="relative overflow-visible">
        <BirthdayDecoration />

        <CardHeader className="text-center pb-2 pt-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-3xl">👥</span>
            <CardTitle className="text-2xl text-gradient">
              احسب لصديقك
            </CardTitle>
            <span className="text-3xl">🎂</span>
          </div>
          <p className="text-sm text-muted-foreground">
            أدخل اسم وتاريخ ميلاد صديقك لتحصل على نتائج دقيقة
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {/* Name Input */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-2">
              <span>👤</span> اسم الصديق
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-festive w-full h-12 px-4 text-lg"
              placeholder="مثال: محمد"
            />
          </div>

          {/* Date Input */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <span>📅</span> تاريخ الميلاد
              </label>
              <div className="inline-flex bg-muted p-1 rounded-xl">
                <button
                  onClick={() => setInputMode('calendar')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    inputMode === 'calendar'
                      ? 'bg-card shadow text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  📅 التقويم
                </button>
                <button
                  onClick={() => setInputMode('simple')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    inputMode === 'simple'
                      ? 'bg-card shadow text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  🔢 بالأرقام
                </button>
              </div>
            </div>

            {inputMode === 'calendar' ? (
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="input-festive w-full h-12 px-4 text-lg"
                dir="ltr"
              />
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    value: simpleDay,
                    setter: setSimpleDay,
                    options: days,
                    placeholder: 'اليوم',
                  },
                  {
                    value: simpleMonth,
                    setter: setSimpleMonth,
                    options: months,
                    placeholder: 'الشهر',
                  },
                  {
                    value: simpleYear,
                    setter: setSimpleYear,
                    options: years,
                    placeholder: 'السنة',
                  },
                ].map((field, i) => (
                  <select
                    key={i}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    className="input-festive h-12 px-3 text-base"
                    dir="rtl"
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2"
            >
              <span>⚠️</span> {error}
            </motion.div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <CelebrationButton
              onClick={handleCalculate}
              loading={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'جاري الحساب...' : 'احسب الآن 🎉'}
            </CelebrationButton>

            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
              className="w-full"
            >
              مسح 🗑️
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      <AnimatePresence>
        {showInlineResult && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">👤</span>
                  <span className="text-gradient">{result.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Age Breakdown */}
                <div className="grid grid-cols-3 gap-4">
                  <StatCard
                    icon="🎂"
                    value={formatArabicNumber(result.age.years)}
                    label="سنة"
                    color="primary"
                  />
                  <StatCard
                    icon="📅"
                    value={formatArabicNumber(result.age.months)}
                    label="شهر"
                    color="secondary"
                  />
                  <StatCard
                    icon="☀️"
                    value={formatArabicNumber(result.age.days)}
                    label="يوم"
                    color="accent"
                  />
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
                    <div className="text-sm text-muted-foreground mb-1">
                      📆 يوم الميلاد
                    </div>
                    <div className="font-semibold">{result.age.dayOfWeek}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
                    <div className="text-sm text-muted-foreground mb-1">
                      ⭐ البرج
                    </div>
                    <div className="font-semibold">{result.age.zodiacSign}</div>
                  </div>
                </div>

                {/* Next Birthday */}
                <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20">
                  <div className="text-3xl font-bold text-gradient mb-2">
                    {formatArabicNumber(result.age.nextBirthday.daysUntil)}
                  </div>
                  <div className="text-muted-foreground">
                    يوم متبقي لعيد ميلاده 🎁
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
