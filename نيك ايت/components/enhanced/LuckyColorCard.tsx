'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface LuckyColorData {
  color: string;
  colorEn: string;
  meaning: string;
  hex?: string;
}

interface LuckyColorCardProps {
  color: LuckyColorData;
  month: number;
  monthName: string;
}

// خريطة الألوان مع hex codes
const COLOR_HEX_MAP: Record<string, string> = {
  الأبيض: '#FFFFFF',
  الأرجواني: '#8B5CF6',
  الأخضر: '#10B981',
  الوردي: '#EC4899',
  الأصفر: '#F59E0B',
  الأزرق: '#3B82F6',
  الأحمر: '#EF4444',
  البرتقالي: '#F97316',
  الذهبي: '#D4AF37',
  البني: '#92400E',
  الفضي: '#9CA3AF',
  'الأزرق الداكن': '#1E40AF',
  البنفسجي: '#8B5CF6',
  الزهري: '#EC4899',
  'الأخضر الفاتح': '#34D399',
  'الأزرق الفاتح': '#60A5FA',
};

// نصائح استخدام الألوان
const COLOR_TIPS: Record<string, string[]> = {
  الأبيض: [
    'استخدم الأبيض في ملابسك لجذب الطاقة الإيجابية',
    'أضف اللمسات البيضاء في ديكور منزلك',
    'الأبيض يرمز للنقاء والبداية الجديدة',
  ],
  الأرجواني: [
    'البنفسجي يعزز الحكمة والروحانية',
    'استخدمه في مساحة التأمل أو الدراسة',
    'يساعد على تطوير الحدس والإبداع',
  ],
  الأخضر: [
    'الأخضر يجلب الهدوء والتوازن',
    'مثالي للمساحات الطبيعية والحدائق',
    'يرمز للنمو والازدهار المالي',
  ],
  الوردي: [
    'الوردي يعزز الحب والرومانسية',
    'استخدمه في غرفة النوم أو المساحات الشخصية',
    'يجلب الطاقة الأنثوية والحنان',
  ],
  الأصفر: [
    'الأصفر ينشط العقل ويجلب السعادة',
    'مثالي للمطبخ أو مساحة العمل',
    'يرمز للذكاء والإبداع',
  ],
  الأزرق: [
    'الأزرق يهدئ الأعصاب ويعزز التركيز',
    'استخدمه في مكتبك أو غرفة الدراسة',
    'يرمز للثقة والاستقرار',
  ],
  الأحمر: [
    'الأحمر يعزز الطاقة والشغف',
    'استخدمه بحذر في المساحات النشطة',
    'يرمز للقوة والحيوية',
  ],
  البرتقالي: [
    'البرتقالي يجلب الحماس والإبداع',
    'مثالي للمساحات الاجتماعية',
    'يعزز التفاؤل والطاقة الإيجابية',
  ],
  الذهبي: [
    'الذهبي يجلب الثراء والنجاح',
    'استخدمه في الإكسسوارات والتفاصيل',
    'يرمز للفخامة والإنجاز',
  ],
  البني: [
    'البني يعزز الاستقرار والأمان',
    'مثالي للأثاث والديكور الطبيعي',
    'يرمز للتأسيس والثبات',
  ],
  الفضي: [
    'الفضي يعزز الحدس والوضوح',
    'استخدمه في الإكسسوارات التقنية',
    'يرمز للحداثة والأناقة',
  ],
};

export default function LuckyColorCard({
  color,
  month,
  monthName,
}: LuckyColorCardProps) {
  // الحصول على hex code للون
  const getColorHex = (colorName: string): string => {
    return COLOR_HEX_MAP[colorName] || color.hex || '#8B5CF6';
  };

  // الحصول على نصائح اللون
  const getColorTips = (colorName: string): string[] => {
    return (
      COLOR_TIPS[colorName] || [
        'استخدم هذا اللون في ملابسك اليومية',
        'أضفه إلى ديكور منزلك',
        'يجلب لك الطاقة الإيجابية',
      ]
    );
  };

  const colorHex = getColorHex(color.color);
  const tips = getColorTips(color.color);

  return (
    <Card className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
          <span className="text-2xl">🎨</span>
          لونك المحظوظ
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          شهر {monthName} ({month})
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* عرض اللون */}
        <div className="flex flex-col items-center space-y-4">
          {/* عينة اللون */}
          <div
            className="w-24 h-24 rounded-full shadow-lg border-4 border-white dark:border-gray-700 mx-auto"
            style={{ backgroundColor: colorHex }}
            aria-label={`عينة لون ${color.color}`}
          />

          {/* اسم اللون */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {color.color}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
              {color.colorEn}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
              {colorHex}
            </p>
          </div>
        </div>

        {/* معنى اللون */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
            <span>✨</span>
            معنى اللون
          </h4>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {color.meaning}
          </p>
        </div>

        {/* نصائح الاستخدام */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
            <span>💡</span>
            نصائح للاستخدام
          </h4>
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li
                key={index}
                className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
              >
                <span className="text-purple-500 mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* شريط اللون في الأسفل */}
        <div
          className="h-2 rounded-full w-full"
          style={{ backgroundColor: colorHex }}
          aria-hidden="true"
        />
      </CardContent>
    </Card>
  );
}
