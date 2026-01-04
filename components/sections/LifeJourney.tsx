'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AgeData } from '@/lib/calculations/ageCalculations';
import { formatArabicNumber } from '@/lib/formatArabic';

interface Props {
  ageData: AgeData;
}

// حساب الإنجازات والمراحل المهمة المتنوعة
function getLifeMilestones(years: number, totalDays: number) {
  const milestones = [];
  const totalHours = totalDays * 24;
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = Math.floor(totalDays / 30.44);

  // إنجازات متنوعة حسب العمر والأيام
  const diverseMilestones = [
    // إنجازات الأيام
    {
      condition: totalDays >= 100,
      label: 'أول ١٠٠ يوم',
      icon: '🌟',
      category: 'days',
      color: 'from-yellow-500/20 to-amber-500/20',
    },
    {
      condition: totalDays >= 365,
      label: 'سنة كاملة',
      icon: '🎂',
      category: 'years',
      color: 'from-pink-500/20 to-rose-500/20',
    },
    {
      condition: totalDays >= 1000,
      label: 'ألف يوم',
      icon: '🏆',
      category: 'days',
      color: 'from-amber-500/20 to-orange-500/20',
    },
    {
      condition: totalDays >= 5000,
      label: '٥ آلاف يوم',
      icon: '⭐',
      category: 'days',
      color: 'from-purple-500/20 to-pink-500/20',
    },
    {
      condition: totalDays >= 10000,
      label: '١٠ آلاف يوم',
      icon: '💎',
      category: 'days',
      color: 'from-blue-500/20 to-cyan-500/20',
    },

    // إنجازات الأسابيع
    {
      condition: totalWeeks >= 52,
      label: '٥٢ أسبوع',
      icon: '📆',
      category: 'weeks',
      color: 'from-green-500/20 to-emerald-500/20',
    },
    {
      condition: totalWeeks >= 500,
      label: '٥٠٠ أسبوع',
      icon: '📅',
      category: 'weeks',
      color: 'from-teal-500/20 to-cyan-500/20',
    },
    {
      condition: totalWeeks >= 1000,
      label: 'ألف أسبوع',
      icon: '🗓️',
      category: 'weeks',
      color: 'from-indigo-500/20 to-purple-500/20',
    },

    // إنجازات الساعات
    {
      condition: totalHours >= 10000,
      label: '١٠ آلاف ساعة',
      icon: '⏰',
      category: 'hours',
      color: 'from-orange-500/20 to-red-500/20',
    },
    {
      condition: totalHours >= 100000,
      label: '١٠٠ ألف ساعة',
      icon: '⌛',
      category: 'hours',
      color: 'from-rose-500/20 to-pink-500/20',
    },

    // إنجازات السنوات المميزة
    {
      condition: years >= 5,
      label: 'نصف عقد',
      icon: '🌸',
      category: 'years',
      color: 'from-pink-500/20 to-fuchsia-500/20',
    },
    {
      condition: years >= 10,
      label: 'عقد كامل',
      icon: '🎯',
      category: 'years',
      color: 'from-blue-500/20 to-indigo-500/20',
    },
    {
      condition: years >= 18,
      label: 'سن الرشد',
      icon: '🎓',
      category: 'milestone',
      color: 'from-green-500/20 to-teal-500/20',
    },
    {
      condition: years >= 21,
      label: 'الحادية والعشرون',
      icon: '🔑',
      category: 'milestone',
      color: 'from-amber-500/20 to-yellow-500/20',
    },
    {
      condition: years >= 25,
      label: 'ربع قرن',
      icon: '👑',
      category: 'years',
      color: 'from-purple-500/20 to-violet-500/20',
    },
    {
      condition: years >= 30,
      label: 'ثلاثة عقود',
      icon: '💫',
      category: 'years',
      color: 'from-cyan-500/20 to-blue-500/20',
    },
    {
      condition: years >= 40,
      label: 'أربعة عقود',
      icon: '🌟',
      category: 'years',
      color: 'from-emerald-500/20 to-green-500/20',
    },
    {
      condition: years >= 50,
      label: 'نصف قرن',
      icon: '🏅',
      category: 'years',
      color: 'from-yellow-500/20 to-orange-500/20',
    },
    {
      condition: years >= 60,
      label: 'ستة عقود',
      icon: '🎖️',
      category: 'years',
      color: 'from-red-500/20 to-rose-500/20',
    },
    {
      condition: years >= 70,
      label: 'سبعة عقود',
      icon: '🌈',
      category: 'years',
      color: 'from-violet-500/20 to-purple-500/20',
    },
    {
      condition: years >= 80,
      label: 'ثمانية عقود',
      icon: '🦋',
      category: 'years',
      color: 'from-sky-500/20 to-blue-500/20',
    },
    {
      condition: years >= 100,
      label: 'قرن كامل!',
      icon: '🎊',
      category: 'years',
      color:
        'from-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20',
    },

    // إنجازات خاصة
    {
      condition: totalDays >= 1111,
      label: '١١١١ يوم',
      icon: '✨',
      category: 'special',
      color: 'from-fuchsia-500/20 to-pink-500/20',
    },
    {
      condition: totalDays >= 2222,
      label: '٢٢٢٢ يوم',
      icon: '🌙',
      category: 'special',
      color: 'from-indigo-500/20 to-blue-500/20',
    },
    {
      condition: totalDays >= 3333,
      label: '٣٣٣٣ يوم',
      icon: '🔮',
      category: 'special',
      color: 'from-purple-500/20 to-violet-500/20',
    },
    {
      condition: totalMonths >= 100,
      label: '١٠٠ شهر',
      icon: '🌕',
      category: 'months',
      color: 'from-slate-500/20 to-gray-500/20',
    },
    {
      condition: totalMonths >= 200,
      label: '٢٠٠ شهر',
      icon: '🌖',
      category: 'months',
      color: 'from-zinc-500/20 to-neutral-500/20',
    },
  ];

  // فلترة الإنجازات المحققة
  for (const m of diverseMilestones) {
    if (m.condition) {
      milestones.push({
        type: m.category,
        label: m.label,
        icon: m.icon,
        achieved: true,
        color: m.color,
      });
    }
  }

  // إيجاد الإنجاز القادم
  const nextMilestones = [
    { days: 100, label: '١٠٠ يوم', icon: '🌟' },
    { days: 365, label: 'سنة كاملة', icon: '🎂' },
    { days: 1000, label: 'ألف يوم', icon: '🏆' },
    { days: 1111, label: '١١١١ يوم', icon: '✨' },
    { days: 2000, label: 'ألفي يوم', icon: '⭐' },
    { days: 2222, label: '٢٢٢٢ يوم', icon: '🌙' },
    { days: 3333, label: '٣٣٣٣ يوم', icon: '🔮' },
    { days: 5000, label: '٥ آلاف يوم', icon: '💎' },
    { days: 10000, label: '١٠ آلاف يوم', icon: '👑' },
    { days: 15000, label: '١٥ ألف يوم', icon: '🎯' },
    { days: 20000, label: '٢٠ ألف يوم', icon: '🏅' },
  ];

  for (const nm of nextMilestones) {
    if (totalDays < nm.days) {
      milestones.push({
        type: 'next',
        label: nm.label,
        icon: nm.icon,
        achieved: false,
        remaining: nm.days - totalDays,
      });
      break;
    }
  }

  return milestones;
}

// حساب نسبة العمر المتوقع
function getLifeProgress(years: number) {
  const avgLifeExpectancy = 75; // متوسط العمر المتوقع
  const percentage = Math.min((years / avgLifeExpectancy) * 100, 100);
  return {
    percentage: Math.round(percentage),
    remaining: Math.max(avgLifeExpectancy - years, 0),
    message:
      percentage < 25
        ? 'في بداية الرحلة! 🌱'
        : percentage < 50
        ? 'في ربيع العمر! 🌸'
        : percentage < 75
        ? 'في قمة العطاء! ⭐'
        : 'حكمة وخبرة! 👑',
  };
}

// حقائق ممتعة عن العمر
function getFunFacts(ageData: AgeData) {
  const { years, totalDays, totalHours } = ageData;

  return [
    {
      icon: '🌍',
      fact: `دار حولك الأرض ${formatArabicNumber(years)} مرة حول الشمس`,
    },
    {
      icon: '🌙',
      fact: `شهدت ${formatArabicNumber(
        Math.floor(totalDays / 29.5)
      )} دورة قمرية كاملة`,
    },
    {
      icon: '💓',
      fact: `نبض قلبك أكثر من ${formatArabicNumber(
        Math.floor(totalDays * 100000)
      )} نبضة`,
    },
    {
      icon: '😴',
      fact: `نمت تقريباً ${formatArabicNumber(
        Math.floor(totalDays / 3)
      )} يوم من حياتك`,
    },
    {
      icon: '🍽️',
      fact: `تناولت حوالي ${formatArabicNumber(totalDays * 3)} وجبة`,
    },
    {
      icon: '👣',
      fact: `مشيت تقريباً ${formatArabicNumber(
        Math.floor(totalDays * 5000)
      )} خطوة`,
    },
    {
      icon: '💧',
      fact: `شربت حوالي ${formatArabicNumber(
        Math.floor(totalDays * 2)
      )} لتر ماء`,
    },
    {
      icon: '😊',
      fact: `ضحكت تقريباً ${formatArabicNumber(
        Math.floor(totalDays * 15)
      )} مرة`,
    },
  ];
}

export default function LifeJourney({ ageData }: Props) {
  const milestones = useMemo(
    () => getLifeMilestones(ageData.years, ageData.totalDays),
    [ageData.years, ageData.totalDays]
  );

  const lifeProgress = useMemo(
    () => getLifeProgress(ageData.years),
    [ageData.years]
  );

  const funFacts = useMemo(() => getFunFacts(ageData), [ageData]);

  const achievedMilestones = milestones.filter((m) => m.achieved);
  const nextMilestone = milestones.find((m) => !m.achieved);

  return (
    <div className="space-y-6">
      {/* شريط التقدم في الحياة */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20"
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold flex items-center gap-2">
            <span>🚀</span> رحلة حياتك
          </h4>
          <span className="text-sm bg-primary/20 px-3 py-1 rounded-full text-primary font-medium">
            {lifeProgress.message}
          </span>
        </div>

        <div className="relative h-6 bg-muted rounded-full overflow-hidden mb-3">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${lifeProgress.percentage}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
            {formatArabicNumber(lifeProgress.percentage)}%
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          عشت {formatArabicNumber(ageData.years)} سنة من متوسط العمر المتوقع (
          {formatArabicNumber(75)} سنة)
        </p>
      </motion.div>

      {/* الإنجاز القادم */}
      {nextMilestone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20"
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl">{nextMilestone.icon}</div>
            <div className="flex-1">
              <h4 className="font-bold text-lg">الإنجاز القادم 🎯</h4>
              <p className="text-muted-foreground">{nextMilestone.label}</p>
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                متبقي {formatArabicNumber(nextMilestone.remaining || 0)} يوم
              </p>
            </div>
            <motion.div
              className="text-5xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🏆
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* حقائق ممتعة */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl p-6 border border-border"
      >
        <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span>🎉</span> حقائق ممتعة عن حياتك
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {funFacts.slice(0, 6).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm">{item.fact}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* الإنجازات المحققة */}
      {achievedMilestones.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>🏅</span> إنجازاتك المميزة
            <span className="text-sm font-normal text-muted-foreground">
              ({formatArabicNumber(achievedMilestones.length)} إنجاز)
            </span>
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {achievedMilestones.slice(-12).map((milestone, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className={`relative overflow-hidden p-4 rounded-xl bg-gradient-to-br ${
                  (milestone as any).color || 'from-primary/10 to-secondary/10'
                } border border-primary/20 text-center cursor-default`}
              >
                <motion.span
                  className="text-3xl block mb-2"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  {milestone.icon}
                </motion.span>
                <span className="text-sm font-bold block">
                  {milestone.label}
                </span>
                <motion.span
                  className="absolute top-1 left-1 text-green-500 text-xs"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                >
                  ✓
                </motion.span>
              </motion.div>
            ))}
          </div>

          {achievedMilestones.length > 12 && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              وأكثر من {formatArabicNumber(achievedMilestones.length - 12)}{' '}
              إنجاز آخر! 🎉
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
