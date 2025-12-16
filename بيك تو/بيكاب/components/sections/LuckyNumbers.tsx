'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AgeData } from '@/types';
import { formatArabicNumber } from '@/lib/formatArabic';

interface Props {
  ageData: AgeData;
}

// حساب الأرقام المحظوظة بناءً على تاريخ الميلاد
function calculateLuckyNumbers(birthDate: Date): {
  lifePathNumber: number;
  destinyNumber: number;
  luckyNumbers: number[];
  luckyDay: string;
  luckyColor: { name: string; hex: string };
} {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();

  // حساب رقم مسار الحياة (Life Path Number)
  const reduceToSingleDigit = (num: number): number => {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
      num = String(num)
        .split('')
        .reduce((a, b) => a + parseInt(b), 0);
    }
    return num;
  };

  const daySum = reduceToSingleDigit(day);
  const monthSum = reduceToSingleDigit(month);
  const yearSum = reduceToSingleDigit(
    String(year)
      .split('')
      .reduce((a, b) => a + parseInt(b), 0)
  );
  const lifePathNumber = reduceToSingleDigit(daySum + monthSum + yearSum);

  // رقم القدر
  const destinyNumber = reduceToSingleDigit(day + month);

  // الأرقام المحظوظة
  const luckyNumbers = [
    lifePathNumber,
    destinyNumber,
    (day % 9) + 1,
    ((month + day) % 9) + 1,
    ((year % 100) % 9) + 1,
  ]
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 5);

  // اليوم المحظوظ
  const days = [
    'الأحد',
    'الإثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
    'السبت',
  ];
  const luckyDay = days[lifePathNumber % 7];

  // اللون المحظوظ
  const colors = [
    { name: 'الأحمر', hex: '#EF4444' },
    { name: 'البرتقالي', hex: '#F97316' },
    { name: 'الأصفر', hex: '#EAB308' },
    { name: 'الأخضر', hex: '#22C55E' },
    { name: 'الأزرق', hex: '#3B82F6' },
    { name: 'النيلي', hex: '#6366F1' },
    { name: 'البنفسجي', hex: '#A855F7' },
    { name: 'الوردي', hex: '#EC4899' },
    { name: 'الذهبي', hex: '#F59E0B' },
  ];
  const luckyColor = colors[lifePathNumber % colors.length];

  return { lifePathNumber, destinyNumber, luckyNumbers, luckyDay, luckyColor };
}

// معاني أرقام مسار الحياة
const lifePathMeanings: Record<number, { title: string; traits: string[] }> = {
  1: { title: 'القائد', traits: ['مستقل', 'طموح', 'مبدع', 'واثق'] },
  2: { title: 'الدبلوماسي', traits: ['متعاون', 'حساس', 'صبور', 'متوازن'] },
  3: { title: 'المبدع', traits: ['متفائل', 'اجتماعي', 'معبر', 'موهوب'] },
  4: { title: 'الباني', traits: ['عملي', 'منظم', 'مخلص', 'مثابر'] },
  5: { title: 'المغامر', traits: ['حر', 'متكيف', 'فضولي', 'نشيط'] },
  6: { title: 'الراعي', traits: ['مسؤول', 'محب', 'متوازن', 'داعم'] },
  7: { title: 'الباحث', traits: ['تحليلي', 'روحاني', 'حكيم', 'متأمل'] },
  8: { title: 'المنجز', traits: ['طموح', 'قوي', 'ناجح', 'عملي'] },
  9: { title: 'الإنساني', traits: ['كريم', 'متسامح', 'حكيم', 'ملهم'] },
  11: { title: 'الملهم', traits: ['حدسي', 'روحاني', 'ملهم', 'حساس'] },
  22: { title: 'الباني الأعظم', traits: ['رؤيوي', 'عملي', 'قوي', 'منجز'] },
  33: { title: 'المعلم', traits: ['محب', 'ملهم', 'خادم', 'روحاني'] },
};

export default function LuckyNumbers({ ageData }: Props) {
  const luckyData = useMemo(
    () => calculateLuckyNumbers(ageData.birthDate),
    [ageData.birthDate]
  );

  const meaning =
    lifePathMeanings[luckyData.lifePathNumber] || lifePathMeanings[9];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-2xl p-6 border border-amber-500/20"
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          className="text-4xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          🔮
        </motion.div>
        <div>
          <h3 className="text-xl font-bold">أرقامك المحظوظة</h3>
          <p className="text-sm text-muted-foreground">
            بناءً على تاريخ ميلادك
          </p>
        </div>
      </div>

      {/* رقم مسار الحياة */}
      <div className="mb-6 p-4 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-xl text-center">
        <div className="text-sm text-muted-foreground mb-1">رقم مسار حياتك</div>
        <motion.div
          className="text-5xl font-black text-amber-600 dark:text-amber-400 mb-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          {formatArabicNumber(luckyData.lifePathNumber)}
        </motion.div>
        <div className="text-lg font-bold mb-2">{meaning.title}</div>
        <div className="flex flex-wrap justify-center gap-2">
          {meaning.traits.map((trait, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-white/50 dark:bg-white/10 rounded-full text-sm"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* الأرقام المحظوظة */}
      <div className="mb-4">
        <div className="text-sm font-semibold mb-2 flex items-center gap-2">
          <span>🍀</span> أرقامك المحظوظة
        </div>
        <div className="flex flex-wrap gap-2">
          {luckyData.luckyNumbers.map((num, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 text-white flex items-center justify-center text-xl font-bold shadow-lg"
            >
              {formatArabicNumber(num)}
            </motion.div>
          ))}
        </div>
      </div>

      {/* اليوم واللون المحظوظ */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-white/50 dark:bg-white/5 rounded-xl">
          <div className="text-sm text-muted-foreground mb-1">
            📅 يومك المحظوظ
          </div>
          <div className="font-bold text-lg">{luckyData.luckyDay}</div>
        </div>
        <div className="p-3 bg-white/50 dark:bg-white/5 rounded-xl">
          <div className="text-sm text-muted-foreground mb-1">
            🎨 لونك المحظوظ
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: luckyData.luckyColor.hex }}
            />
            <span className="font-bold">{luckyData.luckyColor.name}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        💫 هذه الأرقام مستوحاة من علم الأعداد (Numerology) للتسلية فقط
      </p>
    </motion.div>
  );
}
