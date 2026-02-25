'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import DualDateInput from '@/components/ui/DualDateInput';
import { formatArabicNumber } from '@/lib/formatArabic';
import {
  Calendar,
  CheckCircle,
  PartyPopper,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

const celebrationTypes = [
  {
    id: 'birthday',
    name: 'عيد ميلاد',
    emoji: '🎂',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'wedding',
    name: 'زفاف',
    emoji: '💒',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'graduation',
    name: 'تخرج',
    emoji: '🎓',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'baby',
    name: 'مولود جديد',
    emoji: '👶',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'anniversary',
    name: 'ذكرى سنوية',
    emoji: '💕',
    color: 'from-red-500 to-pink-500',
  },
  {
    id: 'other',
    name: 'مناسبة أخرى',
    emoji: '🎉',
    color: 'from-amber-500 to-orange-500',
  },
];

const checklistItems: Record<string, string[]> = {
  birthday: [
    '💰 تحديد الميزانية',
    '📍 اختيار المكان',
    '💌 إرسال الدعوات',
    '🎂 طلب الكيك',
    '🎈 تجهيز الزينة',
    '🎁 شراء الهدايا',
    '🎮 تحضير الألعاب',
    '🎵 ترتيب الموسيقى',
  ],
  wedding: [
    '🏛️ حجز القاعة',
    '📸 اختيار المصور',
    '💌 تجهيز الدعوات',
    '💐 اختيار الكوشة',
    '🍽️ ترتيب الضيافة',
    '🎵 حجز الفرقة الموسيقية',
    '👗 تجهيز الملابس',
    '💍 شراء الخواتم',
  ],
  graduation: [
    '📍 حجز المكان',
    '🎂 طلب الكيك',
    '🎁 تجهيز الهدايا',
    '💌 إرسال الدعوات',
    '📸 ترتيب الصور',
    '🎓 تجهيز الروب والقبعة',
  ],
  baby: [
    '🛏️ تجهيز غرفة الطفل',
    '🍼 شراء المستلزمات',
    '🧳 تحضير حقيبة المستشفى',
    '👨‍👩‍👧 ترتيب الزيارات',
    '📸 حجز مصور',
    '🎀 تجهيز الزينة',
  ],
  anniversary: [
    '🍽️ حجز مطعم',
    '🎁 شراء هدية',
    '🎊 ترتيب مفاجأة',
    '🌹 تجهيز الورود',
    '📸 حجز مصور',
  ],
  other: [
    '💰 تحديد الميزانية',
    '📍 اختيار المكان',
    '💌 إرسال الدعوات',
    '🍽️ تجهيز الضيافة',
    '🎈 تجهيز الزينة',
    '📸 ترتيب التصوير',
  ],
};

export default function CelebrationPlanner() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [error, setError] = useState('');

  const toggleItem = (item: string) => {
    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const daysUntilEvent = eventDate
    ? Math.ceil(
        (eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
    : null;

  const handleReset = () => {
    setSelectedType(null);
    setEventDate(null);
    setCheckedItems([]);
    setError('');
  };

  const getSelectedTypeInfo = () => {
    return celebrationTypes.find((t) => t.id === selectedType);
  };

  const progress = selectedType
    ? Math.round(
        (checkedItems.length / (checklistItems[selectedType]?.length || 1)) *
          100
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Type Selection */}
      <Card className="border-2 border-pink-200 dark:border-pink-800">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <PartyPopper className="w-6 h-6 text-pink-600" />
            اختر نوع المناسبة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {celebrationTypes.map((type) => (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedType(type.id);
                  setCheckedItems([]);
                }}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  selectedType === type.id
                    ? `border-pink-500 bg-gradient-to-br ${type.color} text-white shadow-lg`
                    : 'border-gray-200 dark:border-gray-700 hover:border-pink-300 bg-white dark:bg-gray-800'
                }`}
              >
                <span className="text-3xl block mb-2">{type.emoji}</span>
                <span className="font-medium">{type.name}</span>
              </motion.button>
            ))}
          </div>

          {selectedType && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-4 rounded-xl"
            >
              <DualDateInput
                value={eventDate}
                onChange={setEventDate}
                label="📅 تاريخ المناسبة"
                minDate={new Date()}
              />
            </motion.div>
          )}

          {selectedType && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-5 h-5 ml-2" />
                إعادة تعيين
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Countdown */}
      {daysUntilEvent !== null && daysUntilEvent > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-2 border-purple-200 dark:border-purple-800 overflow-hidden">
            <CardHeader
              className={`bg-gradient-to-r ${
                getSelectedTypeInfo()?.color || 'from-pink-500 to-purple-500'
              } text-white`}
            >
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6" />
                {getSelectedTypeInfo()?.emoji} العد التنازلي
                <Sparkles className="w-6 h-6" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className={`inline-block p-8 bg-gradient-to-br ${
                  getSelectedTypeInfo()?.color || 'from-pink-500 to-purple-500'
                } rounded-3xl shadow-xl`}
              >
                <div className="text-6xl font-bold text-white mb-2">
                  {formatArabicNumber(daysUntilEvent)}
                </div>
                <div className="text-xl text-white/90">يوم متبقي</div>
              </motion.div>

              {eventDate && (
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  📅{' '}
                  {eventDate.toLocaleDateString('ar-SA', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Checklist */}
      {selectedType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                قائمة التحضيرات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    التقدم
                  </span>
                  <span className="font-bold text-green-600">
                    {formatArabicNumber(progress)}%
                  </span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  />
                </div>
              </div>

              {/* Checklist Items */}
              <div className="space-y-3">
                {checklistItems[selectedType]?.map((item, index) => (
                  <motion.label
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                      checkedItems.includes(item)
                        ? 'bg-green-50 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700'
                        : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-transparent'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems.includes(item)}
                      onChange={() => toggleItem(item)}
                      className="w-5 h-5 rounded text-green-500 focus:ring-green-500"
                    />
                    <span
                      className={`flex-1 ${
                        checkedItems.includes(item)
                          ? 'line-through text-gray-400'
                          : ''
                      }`}
                    >
                      {item}
                    </span>
                    {checkedItems.includes(item) && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </motion.label>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl text-center">
                <p className="text-green-700 dark:text-green-300">
                  ✅ تم إنجاز {formatArabicNumber(checkedItems.length)} من{' '}
                  {formatArabicNumber(
                    checklistItems[selectedType]?.length || 0
                  )}{' '}
                  مهام
                </p>
                {progress === 100 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-lg font-bold"
                  >
                    🎉 مبروك! أنت جاهز للمناسبة!
                  </motion.p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
