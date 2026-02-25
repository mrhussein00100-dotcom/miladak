'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import DualDateInput from '@/components/ui/DualDateInput';
import { formatArabicNumber } from '@/lib/formatArabic';
import {
  Calendar,
  Baby,
  Heart,
  Clock,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface PregnancyResult {
  weeks: number;
  days: number;
  trimester: string;
  trimesterNumber: number;
  dueDate: string;
  daysRemaining: number;
  progress: number;
  babySize: string;
  babyDevelopment: string;
  tips: string[];
}

const BABY_SIZES: Record<number, { size: string; development: string }> = {
  4: { size: 'حبة الخشخاش 🌱', development: 'بدأ تكوين الأعضاء الأساسية' },
  5: { size: 'بذرة السمسم', development: 'القلب يبدأ بالنبض' },
  6: { size: 'حبة العدس', development: 'تتشكل ملامح الوجه' },
  7: { size: 'حبة التوت 🫐', development: 'تتكون الأصابع' },
  8: { size: 'حبة الفاصولياء', development: 'يبدأ بالتحرك' },
  9: { size: 'حبة العنب 🍇', development: 'تتشكل الأذنان' },
  10: { size: 'حبة الزيتون 🫒', development: 'تتكون الأظافر' },
  11: { size: 'حبة التين', development: 'يمكنه فتح وإغلاق يديه' },
  12: { size: 'حبة الليمون 🍋', development: 'تتكون الأعضاء التناسلية' },
  14: { size: 'حبة الخوخ 🍑', development: 'يمكنه التثاؤب' },
  16: { size: 'حبة الأفوكادو 🥑', development: 'يمكنه سماع صوتك' },
  18: { size: 'حبة البطاطا الحلوة 🍠', development: 'يتحرك بنشاط' },
  20: { size: 'حبة الموز 🍌', development: 'يمكنه التذوق' },
  22: { size: 'حبة البابايا', development: 'تتطور حاسة اللمس' },
  24: { size: 'كوز الذرة 🌽', development: 'يستجيب للأصوات' },
  26: { size: 'حبة الخس', development: 'يفتح عينيه' },
  28: { size: 'حبة الباذنجان 🍆', development: 'يحلم أثناء النوم' },
  30: { size: 'حبة الملفوف 🥬', development: 'يكتسب وزناً' },
  32: { size: 'حبة جوز الهند 🥥', development: 'الرئتان تنضجان' },
  34: { size: 'حبة الأناناس 🍍', development: 'يستعد للولادة' },
  36: { size: 'حبة الشمام 🍈', development: 'ينزل للحوض' },
  38: { size: 'حبة اليقطين 🎃', development: 'مكتمل النمو' },
  40: { size: 'حبة البطيخ 🍉', development: 'جاهز للولادة!' },
};

const TRIMESTER_TIPS: Record<number, string[]> = {
  1: [
    '💊 تناولي حمض الفوليك يومياً',
    '🥗 تجنبي الأطعمة النيئة والمأكولات البحرية',
    '😴 احصلي على قسط كافٍ من الراحة',
    '💧 اشربي الكثير من الماء',
    '🏥 حددي موعد أول زيارة للطبيب',
  ],
  2: [
    '🏃‍♀️ مارسي التمارين الخفيفة كالمشي',
    '🥩 تناولي الأطعمة الغنية بالحديد',
    '👶 تابعي حركة الجنين',
    '📸 يمكنك إجراء فحص السونار التفصيلي',
    '🛍️ ابدئي بتجهيز مستلزمات الطفل',
  ],
  3: [
    '🧳 جهزي حقيبة المستشفى',
    '🧘‍♀️ تعلمي تقنيات التنفس والاسترخاء',
    '😌 استريحي قدر الإمكان',
    '📝 ضعي خطة الولادة',
    '👨‍👩‍👧 تحدثي مع طفلك',
  ],
};

export default function PregnancyStagesCalculator() {
  const [lastPeriodDate, setLastPeriodDate] = useState<Date | null>(null);
  const [result, setResult] = useState<PregnancyResult | null>(null);
  const [error, setError] = useState('');

  const getBabyInfo = (weeks: number) => {
    const weekKeys = Object.keys(BABY_SIZES)
      .map(Number)
      .sort((a, b) => a - b);
    for (let i = weekKeys.length - 1; i >= 0; i--) {
      if (weeks >= weekKeys[i]) {
        return BABY_SIZES[weekKeys[i]];
      }
    }
    return { size: 'صغير جداً', development: 'في بداية التكوين' };
  };

  const calculate = () => {
    setError('');
    if (!lastPeriodDate) {
      setError('يرجى إدخال تاريخ آخر دورة شهرية');
      return;
    }

    const today = new Date();
    if (lastPeriodDate > today) {
      setError('لا يمكن أن يكون التاريخ في المستقبل');
      return;
    }

    const diffTime = today.getTime() - lastPeriodDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 300) {
      setError('التاريخ المدخل قديم جداً، يرجى التحقق');
      return;
    }

    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;

    // Due date is 280 days (40 weeks) from LMP
    const dueDate = new Date(lastPeriodDate);
    dueDate.setDate(dueDate.getDate() + 280);

    const daysRemaining = Math.max(
      0,
      Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    );
    const progress = Math.min(100, (diffDays / 280) * 100);

    let trimester = '';
    let trimesterNumber = 1;

    if (weeks < 13) {
      trimester = 'الثلث الأول';
      trimesterNumber = 1;
    } else if (weeks < 27) {
      trimester = 'الثلث الثاني';
      trimesterNumber = 2;
    } else {
      trimester = 'الثلث الثالث';
      trimesterNumber = 3;
    }

    const babyInfo = getBabyInfo(weeks);

    setResult({
      weeks,
      days,
      trimester,
      trimesterNumber,
      dueDate: dueDate.toLocaleDateString('ar-SA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      daysRemaining,
      progress,
      babySize: babyInfo.size,
      babyDevelopment: babyInfo.development,
      tips: TRIMESTER_TIPS[trimesterNumber],
    });
  };

  const handleReset = () => {
    setLastPeriodDate(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-pink-200 dark:border-pink-800">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Baby className="w-6 h-6 text-pink-600" />
            أدخلي تاريخ آخر دورة شهرية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="glass p-4 rounded-xl">
            <DualDateInput
              value={lastPeriodDate}
              onChange={setLastPeriodDate}
              label="🩸 تاريخ آخر دورة شهرية"
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
              onClick={calculate}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 px-8"
            >
              <Baby className="w-5 h-5 ml-2" />
              احسبي مرحلة الحمل
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
          className="space-y-6"
        >
          {/* Progress Card */}
          <Card className="border-2 border-purple-200 dark:border-purple-800 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6" />
                🤰 تقدم الحمل
                <Sparkles className="w-6 h-6" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Current Week */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-full"
                >
                  <span className="text-pink-700 dark:text-pink-300 font-bold text-2xl">
                    الأسبوع {formatArabicNumber(result.weeks)} و{' '}
                    {formatArabicNumber(result.days)} أيام
                  </span>
                </motion.div>
                <p className="text-lg font-bold mt-3 gradient-text">
                  {result.trimester}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="px-4">
                <div className="relative h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-white drop-shadow">
                      {formatArabicNumber(Math.round(result.progress))}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>🌱 بداية الحمل</span>
                  <span>👶 الولادة</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Calendar className="w-8 h-8 text-pink-500" />}
              value={result.dueDate}
              label="موعد الولادة المتوقع"
              color="pink"
            />
            <StatCard
              icon={<Clock className="w-8 h-8 text-purple-500" />}
              value={`${formatArabicNumber(result.daysRemaining)} يوم`}
              label="متبقي على الولادة"
              color="purple"
            />
            <StatCard
              icon={<Baby className="w-8 h-8 text-blue-500" />}
              value={result.babySize}
              label="حجم الجنين تقريباً"
              color="blue"
            />
            <StatCard
              icon={<Heart className="w-8 h-8 text-red-500 animate-pulse" />}
              value={`${formatArabicNumber(result.weeks)} أسبوع`}
              label="عمر الحمل"
              color="red"
            />
          </div>

          {/* Baby Development */}
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-4xl mb-3">👶</div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                  تطور الجنين هذا الأسبوع
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {result.babyDevelopment}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <CardTitle className="text-center">
                💡 نصائح لـ{result.trimester}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {result.tips.map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg"
                  >
                    {tip}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Encouragement */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-6 rounded-2xl text-center">
            <p className="text-lg text-pink-700 dark:text-pink-300">
              💕 كل يوم يمر يقربك من لقاء طفلك الحبيب!
              <br />
              <span className="text-sm">استمتعي بهذه الرحلة الجميلة 🌸</span>
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    pink: 'from-pink-500 to-rose-500',
    purple: 'from-purple-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
    red: 'from-red-500 to-pink-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="glass p-4 rounded-2xl text-center"
    >
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-lg font-bold text-gray-800 dark:text-white mb-1">
        {value}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400">{label}</div>
    </motion.div>
  );
}
