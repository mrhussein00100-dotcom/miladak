'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AgeData } from '@/types';
import { formatArabicNumber } from '@/lib/formatArabic';

interface Props {
  ageData: AgeData;
  userName?: string;
}

// تحديد مرحلة العمر والمخاطبة المناسبة
function getAgeStageInfo(years: number, months: number, totalDays: number) {
  // رضيع (0-1 سنة)
  if (years === 0) {
    if (totalDays <= 30) {
      return {
        stage: 'مولود جديد',
        emoji: '👶',
        greeting: 'أهلاً بالملاك الصغير!',
        message: `عمرك ${formatArabicNumber(
          totalDays
        )} يوم فقط! ما أجمل بداية الحياة 💕`,
        color: 'from-pink-400 to-rose-500',
        tips: [
          'النوم الكافي مهم جداً',
          'الرضاعة الطبيعية أفضل غذاء',
          'الحب والحنان أساس النمو',
        ],
      };
    }
    if (totalDays <= 90) {
      return {
        stage: 'رضيع',
        emoji: '👶',
        greeting: 'يا أجمل رضيع!',
        message: `عمرك ${formatArabicNumber(months)} شهر و ${formatArabicNumber(
          totalDays % 30
        )} يوم! تنمو بسرعة 🌟`,
        color: 'from-pink-400 to-purple-500',
        tips: [
          'ابتسامتك الأولى قريبة!',
          'صوتك يتطور كل يوم',
          'عيناك تتابع الحركة الآن',
        ],
      };
    }
    return {
      stage: 'رضيع',
      emoji: '👶',
      greeting: 'يا حلو يا صغير!',
      message: `عمرك ${formatArabicNumber(months)} شهر! قريباً ستبدأ بالحبو 🎈`,
      color: 'from-purple-400 to-pink-500',
      tips: [
        'وقت اللعب مهم للتطور',
        'الأصوات والألوان تحفز الدماغ',
        'الروتين يمنحك الأمان',
      ],
    };
  }

  // طفل صغير (1-3 سنوات)
  if (years >= 1 && years < 3) {
    return {
      stage: 'طفل صغير',
      emoji: '🧒',
      greeting: 'يا بطل صغير!',
      message: `عمرك ${formatArabicNumber(years)} سنة! عالم الاكتشاف ينتظرك 🌈`,
      color: 'from-yellow-400 to-orange-500',
      tips: [
        'كل يوم مغامرة جديدة',
        'الكلمات الأولى سحرية',
        'اللعب هو طريقتك للتعلم',
      ],
    };
  }

  // طفل (3-6 سنوات)
  if (years >= 3 && years < 6) {
    return {
      stage: 'طفل',
      emoji: '👦',
      greeting: 'يا بطل!',
      message: `عمرك ${formatArabicNumber(years)} سنوات! أنت تكبر بسرعة 🚀`,
      color: 'from-green-400 to-teal-500',
      tips: [
        'الخيال صديقك الأفضل',
        'الأصدقاء يجعلون الحياة أجمل',
        'كل سؤال يفتح باباً للمعرفة',
      ],
    };
  }

  // طفل مدرسي (6-12 سنة)
  if (years >= 6 && years < 12) {
    return {
      stage: 'طفل مدرسي',
      emoji: '📚',
      greeting: 'يا نجم!',
      message: `عمرك ${formatArabicNumber(
        years
      )} سنوات! المدرسة مغامرة رائعة 🎒`,
      color: 'from-blue-400 to-indigo-500',
      tips: [
        'القراءة تفتح عوالم جديدة',
        'الرياضة تقوي الجسم والعقل',
        'الصداقات الحقيقية كنز',
      ],
    };
  }

  // مراهق (12-18 سنة)
  if (years >= 12 && years < 18) {
    return {
      stage: 'مراهق',
      emoji: '🌟',
      greeting: 'يا شاب/شابة!',
      message: `عمرك ${formatArabicNumber(
        years
      )} سنة! مرحلة التحولات الكبرى 💪`,
      color: 'from-purple-500 to-pink-500',
      tips: [
        'اكتشف شغفك الحقيقي',
        'التعلم المستمر مفتاح النجاح',
        'كن صادقاً مع نفسك',
      ],
    };
  }

  // شاب (18-25 سنة)
  if (years >= 18 && years < 25) {
    return {
      stage: 'شاب',
      emoji: '🎓',
      greeting: 'يا شاب/شابة!',
      message: `عمرك ${formatArabicNumber(years)} سنة! بداية الاستقلالية 🌍`,
      color: 'from-cyan-500 to-blue-500',
      tips: ['استثمر في نفسك', 'جرب أشياء جديدة', 'ابنِ علاقات قوية'],
    };
  }

  // شاب ناضج (25-35 سنة)
  if (years >= 25 && years < 35) {
    return {
      stage: 'شاب ناضج',
      emoji: '💼',
      greeting: 'أهلاً!',
      message: `عمرك ${formatArabicNumber(
        years
      )} سنة! سنوات البناء والإنجاز 🏆`,
      color: 'from-emerald-500 to-teal-500',
      tips: ['وازن بين العمل والحياة', 'استثمر للمستقبل', 'الصحة أولوية'],
    };
  }

  // راشد (35-45 سنة)
  if (years >= 35 && years < 45) {
    return {
      stage: 'راشد',
      emoji: '🎯',
      greeting: 'أهلاً بك!',
      message: `عمرك ${formatArabicNumber(
        years
      )} سنة! قمة العطاء والإنتاجية ⭐`,
      color: 'from-amber-500 to-orange-500',
      tips: ['خبرتك ثروة', 'شارك معرفتك', 'اهتم بصحتك'],
    };
  }

  // ناضج (45-60 سنة)
  if (years >= 45 && years < 60) {
    return {
      stage: 'ناضج',
      emoji: '🌳',
      greeting: 'أهلاً بالحكيم!',
      message: `عمرك ${formatArabicNumber(years)} سنة! سنوات الحكمة والخبرة 🌟`,
      color: 'from-orange-500 to-red-500',
      tips: ['خبرتك تنير الطريق للآخرين', 'الصحة استثمار', 'استمتع بثمار جهدك'],
    };
  }

  // كبير (60-75 سنة)
  if (years >= 60 && years < 75) {
    return {
      stage: 'كبير',
      emoji: '👴',
      greeting: 'أهلاً بالعزيز!',
      message: `عمرك ${formatArabicNumber(
        years
      )} سنة! سنوات الحكمة والسكينة 🕊️`,
      color: 'from-indigo-500 to-purple-500',
      tips: [
        'شارك حكمتك مع الأجيال',
        'النشاط الخفيف مفيد',
        'العائلة أجمل نعمة',
      ],
    };
  }

  // مسن (75+ سنة)
  return {
    stage: 'مسن',
    emoji: '👑',
    greeting: 'أهلاً بالغالي!',
    message: `عمرك ${formatArabicNumber(years)} سنة! تاج على رؤوسنا 👑`,
    color: 'from-yellow-500 to-amber-500',
    tips: ['كل يوم نعمة', 'ذكرياتك كنز', 'محبة الأحباء أجمل هدية'],
  };
}

export default function AgeGreeting({ ageData, userName }: Props) {
  const stageInfo = useMemo(
    () => getAgeStageInfo(ageData.years, ageData.months, ageData.totalDays),
    [ageData.years, ageData.months, ageData.totalDays]
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stageInfo.color} p-6 text-white shadow-xl`}
    >
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl" />
      </div>

      <div className="relative z-10">
        {/* الإيموجي والتحية */}
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            className="text-5xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {stageInfo.emoji}
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold">{stageInfo.greeting}</h3>
            <span className="text-sm opacity-90 bg-white/20 px-3 py-1 rounded-full">
              {stageInfo.stage}
            </span>
          </div>
        </div>

        {/* الرسالة الرئيسية */}
        <p className="text-lg mb-4 leading-relaxed">{stageInfo.message}</p>

        {/* النصائح */}
        <div className="space-y-2">
          <p className="text-sm font-semibold opacity-90">💡 نصائح لك:</p>
          <ul className="space-y-1">
            {stageInfo.tips.map((tip, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-2 text-sm"
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                {tip}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
