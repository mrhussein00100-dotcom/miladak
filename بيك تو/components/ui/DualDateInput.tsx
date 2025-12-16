'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DualDateInputProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  supportHijri?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

// تحويل الأرقام للعربية
const toArabicNumerals = (num: number) => {
  return String(num)
    .split('')
    .map((d) => String.fromCharCode(0x0660 + parseInt(d)))
    .join('');
};

export default function DualDateInput({
  value,
  onChange,
  label,
  placeholder = 'اختر التاريخ',
  supportHijri = false,
  minDate,
  maxDate,
  className = '',
}: DualDateInputProps) {
  const [inputMode, setInputMode] = useState<'calendar' | 'simple'>('simple');
  const [simpleYear, setSimpleYear] = useState('');
  const [simpleMonth, setSimpleMonth] = useState('');
  const [simpleDay, setSimpleDay] = useState('');

  // توليد السنوات
  const currentYearVal = maxDate?.getFullYear() || new Date().getFullYear();
  const minYear = minDate?.getFullYear() || 1900;

  const years = useMemo(() => {
    return Array.from({ length: currentYearVal - minYear + 1 }, (_, i) => {
      const year = currentYearVal - i;
      return { value: String(year), label: toArabicNumerals(year) };
    });
  }, [currentYearVal, minYear]);

  // أسماء الشهور
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

  // توليد الأيام حسب الشهر والسنة
  const daysCount = useMemo(() => {
    if (simpleYear && simpleMonth) {
      return new Date(Number(simpleYear), Number(simpleMonth), 0).getDate();
    }
    return 31;
  }, [simpleYear, simpleMonth]);

  const days = useMemo(() => {
    return Array.from({ length: daysCount }, (_, i) => ({
      value: String(i + 1),
      label: toArabicNumerals(i + 1),
    }));
  }, [daysCount]);

  // مزامنة القيمة مع الحقول
  useEffect(() => {
    if (value) {
      setSimpleYear(String(value.getFullYear()));
      setSimpleMonth(String(value.getMonth() + 1));
      setSimpleDay(String(value.getDate()));
    } else {
      setSimpleYear('');
      setSimpleMonth('');
      setSimpleDay('');
    }
  }, [value]);

  // تحديث القيمة عند تغيير الحقول البسيطة
  useEffect(() => {
    if (simpleYear && simpleMonth && simpleDay) {
      const max = new Date(
        Number(simpleYear),
        Number(simpleMonth),
        0
      ).getDate();
      const day = Math.min(Number(simpleDay), max);
      const newDate = new Date(
        Number(simpleYear),
        Number(simpleMonth) - 1,
        day
      );

      if (!isNaN(newDate.getTime())) {
        if (!value || newDate.getTime() !== value.getTime()) {
          onChange(newDate);
        }
      }
    }
  }, [simpleYear, simpleMonth, simpleDay]);

  // معالجة تغيير التقويم
  const handleCalendarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;
    if (dateStr) {
      const newDate = new Date(dateStr);
      if (!isNaN(newDate.getTime())) {
        onChange(newDate);
      }
    } else {
      onChange(null);
    }
  };

  // تنسيق التاريخ للتقويم
  const calendarValue = value ? value.toISOString().split('T')[0] : '';

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label و Toggle */}
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setInputMode('calendar')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              inputMode === 'calendar'
                ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            📅 التقويم
          </button>
          <button
            type="button"
            onClick={() => setInputMode('simple')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              inputMode === 'simple'
                ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            🔢 بالأرقام
          </button>
        </div>
      </div>

      {/* حقول الإدخال */}
      <motion.div
        key={inputMode}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {inputMode === 'calendar' ? (
          <div className="relative">
            <input
              type="date"
              value={calendarValue}
              onChange={handleCalendarChange}
              max={maxDate?.toISOString().split('T')[0]}
              min={minDate?.toISOString().split('T')[0]}
              className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-all duration-200 text-lg"
              dir="ltr"
            />
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {/* اليوم */}
            <select
              value={simpleDay}
              onChange={(e) => setSimpleDay(e.target.value)}
              className="h-12 px-3 rounded-xl border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-all duration-200 text-base cursor-pointer"
              dir="rtl"
            >
              <option value="">اليوم</option>
              {days.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* الشهر */}
            <select
              value={simpleMonth}
              onChange={(e) => setSimpleMonth(e.target.value)}
              className="h-12 px-3 rounded-xl border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-all duration-200 text-base cursor-pointer"
              dir="rtl"
            >
              <option value="">الشهر</option>
              {months.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* السنة */}
            <select
              value={simpleYear}
              onChange={(e) => setSimpleYear(e.target.value)}
              className="h-12 px-3 rounded-xl border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-all duration-200 text-base cursor-pointer"
              dir="rtl"
            >
              <option value="">السنة</option>
              {years.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </motion.div>

      {/* معلومة مساعدة */}
      {value && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-gray-500 dark:text-gray-400 text-center"
        >
          📅 التاريخ المحدد:{' '}
          {value.toLocaleDateString('ar-SA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </motion.div>
      )}
    </div>
  );
}
