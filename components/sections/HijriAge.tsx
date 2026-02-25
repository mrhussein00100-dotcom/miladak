'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AgeData } from '@/types';
import { formatArabicNumber } from '@/lib/formatArabic';

interface Props {
  ageData: AgeData;
}

// أسماء الأشهر الهجرية
const hijriMonths = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الثاني',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

// حساب العمر بالهجري بدقة
function calculateHijriAge(birthDate: Date): {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  birthHijri: { year: number; month: number; day: number; monthName: string };
  todayHijri: { year: number; month: number; day: number; monthName: string };
} {
  // تحويل التاريخ الميلادي إلى هجري
  function gregorianToHijri(date: Date): {
    year: number;
    month: number;
    day: number;
  } {
    const jd =
      Math.floor((date.getTime() - new Date(1970, 0, 1).getTime()) / 86400000) +
      2440588;
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j =
      Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
      Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
    const l3 =
      l2 -
      Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
      Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
      29;
    const month = Math.floor((24 * l3) / 709);
    const day = l3 - Math.floor((709 * month) / 24);
    const year = 30 * n + j - 30;

    return { year, month, day };
  }

  const birthHijriRaw = gregorianToHijri(birthDate);
  const todayHijriRaw = gregorianToHijri(new Date());

  const birthHijri = {
    ...birthHijriRaw,
    monthName: hijriMonths[birthHijriRaw.month - 1] || '',
  };

  const todayHijri = {
    ...todayHijriRaw,
    monthName: hijriMonths[todayHijriRaw.month - 1] || '',
  };

  // حساب الفرق
  let years = todayHijri.year - birthHijri.year;
  let months = todayHijri.month - birthHijri.month;
  let days = todayHijri.day - birthHijri.day;

  if (days < 0) {
    months--;
    days += 30; // متوسط أيام الشهر الهجري
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // حساب إجمالي الأيام الهجرية (تقريبي)
  const totalDays = Math.floor(
    (todayHijri.year - birthHijri.year) * 354.36667 +
      (todayHijri.month - birthHijri.month) * 29.53 +
      (todayHijri.day - birthHijri.day)
  );

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    totalDays: Math.max(0, totalDays),
    birthHijri,
    todayHijri,
  };
}

export default function HijriAge({ ageData }: Props) {
  const hijriData = useMemo(
    () => calculateHijriAge(ageData.birthDate),
    [ageData.birthDate]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-emerald-500/20"
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          className="text-4xl"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🌙
        </motion.div>
        <div>
          <h3 className="text-xl font-bold">عمرك بالتقويم الهجري</h3>
          <p className="text-sm text-muted-foreground">حسب التقويم الإسلامي</p>
        </div>
      </div>

      {/* العمر الهجري */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-white/50 dark:bg-white/5 rounded-xl">
          <motion.div
            className="text-3xl font-black text-emerald-600 dark:text-emerald-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            {formatArabicNumber(hijriData.years)}
          </motion.div>
          <div className="text-sm text-muted-foreground mt-1">سنة هجرية</div>
        </div>
        <div className="text-center p-4 bg-white/50 dark:bg-white/5 rounded-xl">
          <motion.div
            className="text-3xl font-black text-teal-600 dark:text-teal-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            {formatArabicNumber(hijriData.months)}
          </motion.div>
          <div className="text-sm text-muted-foreground mt-1">شهر</div>
        </div>
        <div className="text-center p-4 bg-white/50 dark:bg-white/5 rounded-xl">
          <motion.div
            className="text-3xl font-black text-cyan-600 dark:text-cyan-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
          >
            {formatArabicNumber(hijriData.days)}
          </motion.div>
          <div className="text-sm text-muted-foreground mt-1">يوم</div>
        </div>
      </div>

      {/* تفاصيل التاريخ */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-white/50 dark:bg-white/5 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📅</span>
            <span className="font-semibold">تاريخ ميلادك الهجري</span>
          </div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {formatArabicNumber(hijriData.birthHijri.day)}{' '}
            {hijriData.birthHijri.monthName}{' '}
            {formatArabicNumber(hijriData.birthHijri.year)} هـ
          </div>
        </div>

        <div className="p-4 bg-white/50 dark:bg-white/5 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📆</span>
            <span className="font-semibold">التاريخ الهجري اليوم</span>
          </div>
          <div className="text-lg font-bold text-teal-600 dark:text-teal-400">
            {formatArabicNumber(hijriData.todayHijri.day)}{' '}
            {hijriData.todayHijri.monthName}{' '}
            {formatArabicNumber(hijriData.todayHijri.year)} هـ
          </div>
        </div>
      </div>

      {/* إجمالي الأيام الهجرية */}
      <div className="mt-4 p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl text-center">
        <div className="text-sm text-muted-foreground mb-1">
          إجمالي عمرك بالأيام الهجرية
        </div>
        <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
          {formatArabicNumber(hijriData.totalDays)} يوم هجري
        </div>
      </div>

      {/* ملاحظة */}
      <p className="text-xs text-muted-foreground text-center mt-4">
        💡 السنة الهجرية أقصر من الميلادية بحوالي 11 يوماً
      </p>
    </motion.div>
  );
}
