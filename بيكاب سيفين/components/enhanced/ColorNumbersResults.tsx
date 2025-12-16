'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share2, Copy, MessageCircle, Twitter, Facebook } from 'lucide-react';
import LuckyColorCard from './LuckyColorCard';
import LuckyNumbersCard from './LuckyNumbersCard';
import {
  ColorsNumbersResult,
  createShareText,
  createShareUrl,
  copyToClipboard,
  formatDate,
  getMonthName,
} from '@/lib/colorNumbersUtils';

interface ColorNumbersResultsProps {
  result: ColorsNumbersResult;
  onShare?: (platform: string) => void;
}

export default function ColorNumbersResults({
  result,
  onShare,
}: ColorNumbersResultsProps) {
  const { luckyColor, luckyNumbers, birthDate } = result;
  const monthName = getMonthName(birthDate.month);
  const formattedDate = formatDate(
    birthDate.day,
    birthDate.month,
    birthDate.year
  );

  // مقارنة ألوان الشهر مع ألوان البرج
  const getColorComparison = () => {
    const monthColor = luckyColor.color;
    const zodiacColors = luckyNumbers.zodiacColors;

    const hasMatch = zodiacColors.includes(monthColor);

    return {
      hasMatch,
      message: hasMatch
        ? `🎉 رائع! لون شهرك "${monthColor}" يتطابق مع ألوان برجك المحظوظة!`
        : `💫 لون شهرك "${monthColor}" يكمل ألوان برجك بشكل جميل`,
    };
  };

  const colorComparison = getColorComparison();

  // مشاركة النتائج
  const handleShare = async (
    platform: 'whatsapp' | 'twitter' | 'facebook' | 'copy'
  ) => {
    const shareText = createShareText(result);

    if (platform === 'copy') {
      const success = await copyToClipboard(shareText);
      if (success) {
        // يمكن إضافة toast notification هنا
        console.log('تم نسخ النص بنجاح');
      }
    } else {
      const shareUrl = createShareUrl(platform, shareText);
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }

    onShare?.(platform);
  };

  return (
    <div className="space-y-6">
      {/* عنوان النتائج */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
            <span className="text-3xl">✨</span>
            نتائجك المحظوظة
          </CardTitle>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            لتاريخ ميلادك: {formattedDate}
          </p>
        </CardHeader>
      </Card>

      {/* مقارنة الألوان */}
      <Card
        className={`border-2 ${
          colorComparison.hasMatch
            ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
            : 'border-blue-300 bg-blue-50 dark:bg-blue-900/20'
        }`}
      >
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              🎨 مقارنة الألوان
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {colorComparison.message}
            </p>

            <div className="flex justify-center items-center gap-4 flex-wrap">
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  لون الشهر
                </div>
                <Badge variant="outline" className="bg-white dark:bg-gray-800">
                  {luckyColor.color}
                </Badge>
              </div>

              <div className="text-2xl">
                {colorComparison.hasMatch ? '🤝' : '🌈'}
              </div>

              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  ألوان البرج
                </div>
                <div className="flex gap-1 flex-wrap justify-center">
                  {luckyNumbers.zodiacColors.map((color, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className={`text-xs ${
                        color === luckyColor.color
                          ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-600 dark:text-green-300'
                          : 'bg-white dark:bg-gray-800'
                      }`}
                    >
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* عرض البطاقات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LuckyColorCard
          color={luckyColor}
          month={birthDate.month}
          monthName={monthName}
        />

        <LuckyNumbersCard numbers={luckyNumbers} year={birthDate.year} />
      </div>

      {/* نصائح شاملة */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span>🌟</span>
            نصائح شاملة لاستخدام ألوانك وأرقامك
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                <span>🎨</span>
                نصائح الألوان
              </h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• استخدم لون شهرك "{luckyColor.color}" في ملابسك المهمة</li>
                <li>• أضف ألوان برجك في ديكور مكتبك أو غرفتك</li>
                <li>• اجمع بين لون الشهر وألوان البرج في إطلالاتك</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                <span>🔢</span>
                نصائح الأرقام
              </h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>
                  • استخدم أرقامك ({luckyNumbers.numbers.join(', ')}) في
                  القرارات المهمة
                </li>
                <li>• اختر التواريخ التي تحتوي على هذه الأرقام</li>
                <li>
                  • مجموع أرقامك (
                  {luckyNumbers.numbers.reduce((a, b) => a + b, 0)}) رقم قوي لك
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* أزرار المشاركة */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            شارك نتائجك
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={() => handleShare('whatsapp')}
              className="bg-green-500 hover:bg-green-600 text-white"
              size="sm"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              واتساب
            </Button>

            <Button
              onClick={() => handleShare('twitter')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              size="sm"
            >
              <Twitter className="w-4 h-4 mr-2" />
              تويتر
            </Button>

            <Button
              onClick={() => handleShare('facebook')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Facebook className="w-4 h-4 mr-2" />
              فيسبوك
            </Button>

            <Button
              onClick={() => handleShare('copy')}
              variant="outline"
              size="sm"
            >
              <Copy className="w-4 h-4 mr-2" />
              نسخ
            </Button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
            شارك ألوانك وأرقامك المحظوظة مع أصدقائك واكتشفوا التوافق بينكم!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
