'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface LuckyNumbersData {
  numbers: number[];
  zodiacAnimal: string;
  zodiacColors: string[];
  description: string;
}

interface LuckyNumbersCardProps {
  numbers: LuckyNumbersData;
  year: number;
}

// معاني الأرقام المحظوظة
const NUMBER_MEANINGS: Record<number, string> = {
  1: 'القيادة والاستقلالية - رقم الرواد والمبدعين',
  2: 'التعاون والشراكة - رقم التوازن والانسجام',
  3: 'الإبداع والتواصل - رقم الفن والتعبير',
  4: 'الاستقرار والعمل الجاد - رقم البناء والتأسيس',
  5: 'الحرية والمغامرة - رقم التغيير والتطور',
  6: 'الحب والمسؤولية - رقم الأسرة والرعاية',
  7: 'الحكمة والروحانية - رقم التأمل والبحث',
  8: 'النجاح المالي والقوة - رقم الإنجاز والثروة',
  9: 'الإنسانية والعطاء - رقم الحكمة والكمال',
};

// نصائح استخدام الأرقام
const NUMBER_TIPS: Record<number, string[]> = {
  1: [
    'استخدم هذا الرقم في بداية مشاريعك الجديدة',
    'اختر التواريخ التي تحتوي على الرقم 1 للقرارات المهمة',
    'ضع الرقم 1 في رقم هاتفك أو عنوانك إن أمكن',
  ],
  2: [
    'مثالي للشراكات والتعاون مع الآخرين',
    'استخدمه في المناسبات الاجتماعية والعائلية',
    'اختر اليوم الثاني من الشهر للقاءات المهمة',
  ],
  3: [
    'ممتاز للأنشطة الإبداعية والفنية',
    'استخدمه في مشاريع التواصل والكتابة',
    'اختر الساعة الثالثة للأعمال الإبداعية',
  ],
  4: [
    'مثالي لبناء الأسس القوية والتخطيط',
    'استخدمه في الاستثمارات طويلة المدى',
    'اختر اليوم الرابع لاتخاذ قرارات مالية',
  ],
  5: [
    'ممتاز للسفر والمغامرات الجديدة',
    'استخدمه عند تغيير المهنة أو المكان',
    'اختر اليوم الخامس للتجارب الجديدة',
  ],
  6: [
    'مثالي للأمور العائلية والعلاقات',
    'استخدمه في شراء المنزل أو الزواج',
    'اختر اليوم السادس للقاءات العائلية',
  ],
  7: [
    'ممتاز للدراسة والبحث والتأمل',
    'استخدمه في الأنشطة الروحية والتعليمية',
    'اختر اليوم السابع للتفكير والتخطيط',
  ],
  8: [
    'مثالي للأعمال التجارية والاستثمار',
    'استخدمه في المشاريع المالية الكبيرة',
    'اختر اليوم الثامن لتوقيع العقود',
  ],
  9: [
    'ممتاز للأعمال الخيرية والإنسانية',
    'استخدمه في مساعدة الآخرين والعطاء',
    'اختر اليوم التاسع للأنشطة التطوعية',
  ],
};

// رموز الأبراج الصينية
const ZODIAC_EMOJIS: Record<string, string> = {
  الفأر: '🐭',
  الثور: '🐂',
  النمر: '🐅',
  الأرنب: '🐰',
  التنين: '🐉',
  الثعبان: '🐍',
  الحصان: '🐎',
  الماعز: '🐐',
  القرد: '🐒',
  الديك: '🐓',
  الكلب: '🐕',
  الخنزير: '🐷',
};

export default function LuckyNumbersCard({
  numbers,
  year,
}: LuckyNumbersCardProps) {
  const zodiacEmoji = ZODIAC_EMOJIS[numbers.zodiacAnimal] || '🔮';

  return (
    <Card className="w-full max-w-md mx-auto bg-card text-card-foreground shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
          <span className="text-2xl">🔢</span>
          أرقامك المحظوظة
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          سنة {year} - برج {numbers.zodiacAnimal}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* البرج الصيني */}
        <div className="text-center bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 rounded-lg p-4">
          <div className="text-4xl mb-2">{zodiacEmoji}</div>
          <h3 className="text-xl font-bold mb-1">
            برج {numbers.zodiacAnimal}
          </h3>
          <p className="text-sm text-muted-foreground">
            {numbers.description}
          </p>
        </div>

        {/* الأرقام المحظوظة */}
        <div>
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <span>✨</span>
            أرقامك المحظوظة
          </h4>
          <div className="flex justify-center gap-3 mb-4">
            {numbers.numbers.map((number, index) => (
              <div
                key={index}
                className="w-12 h-12 bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
              >
                {number}
              </div>
            ))}
          </div>
        </div>

        {/* معاني الأرقام */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <span>📖</span>
            معاني أرقامك
          </h4>
          {numbers.numbers.map((number, index) => (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {number}
                </span>
                <span className="font-medium text-foreground text-sm">
                  الرقم {number}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {NUMBER_MEANINGS[number] || 'رقم محظوظ يجلب الطاقة الإيجابية'}
              </p>
            </div>
          ))}
        </div>

        {/* ألوان البرج */}
        <div>
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <span>🎨</span>
            ألوان برجك المحظوظة
          </h4>
          <div className="flex flex-wrap gap-2">
            {numbers.zodiacColors.map((color, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
              >
                {color}
              </Badge>
            ))}
          </div>
        </div>

        {/* نصائح الاستخدام */}
        <div className="bg-gradient-to-r from-muted/50 to-muted/30 dark:from-muted/20 dark:to-card rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <span>💡</span>
            نصائح لاستخدام أرقامك
          </h4>
          <ul className="space-y-2">
            {numbers.numbers.slice(0, 2).map((number, index) => {
              const tips = NUMBER_TIPS[number] || [
                'استخدم هذا الرقم في حياتك اليومية',
              ];
              return (
                <li
                  key={index}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-primary mt-1">•</span>
                  <span>{tips[0]}</span>
                </li>
              );
            })}
            <li className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                اجمع أرقامك المحظوظة للحصول على رقم قوي (
                {numbers.numbers.reduce((a, b) => a + b, 0)})
              </span>
            </li>
          </ul>
        </div>

        {/* شريط الأرقام في الأسفل */}
        <div className="flex justify-center gap-1">
          {numbers.numbers.map((number, index) => (
            <div
              key={index}
              className="w-8 h-2 bg-gradient-to-r from-primary to-secondary rounded-full"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
