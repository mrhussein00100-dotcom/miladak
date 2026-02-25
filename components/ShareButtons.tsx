'use client';

import { useState } from 'react';
import { Copy, Check, Share2, MessageCircle, Send } from 'lucide-react';
import type { AgeData } from '@/lib/calculations/ageCalculations';
import { formatArabicNumber } from '@/lib/formatArabic';

interface ShareButtonsProps {
  ageData: AgeData;
}

const ShareButtons = ({ ageData }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const shareText = `🎂 عمري ${formatArabicNumber(
    ageData.years
  )} سنة و${formatArabicNumber(ageData.months)} شهر و${formatArabicNumber(
    ageData.days
  )} يوم!
✨ إجمالي ${formatArabicNumber(ageData.totalDays)} يوم من الحياة
⭐ برجي: ${ageData.zodiacSign}
🐉 البرج الصيني: ${ageData.chineseZodiac || '-'}
🎁 عيد ميلادي القادم بعد ${formatArabicNumber(
    ageData.nextBirthday.daysUntil
  )} يوم

احسب عمرك الآن على miladak.com 🎉`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(
      'https://miladak.com'
    )}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'نتائج حساب عمري',
          text: shareText,
          url: 'https://miladak.com',
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:opacity-90 transition-all shadow-md hover:shadow-lg"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            <span>تم النسخ!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>نسخ</span>
          </>
        )}
      </button>

      <button
        onClick={handleWhatsApp}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:opacity-90 transition-all shadow-md hover:shadow-lg"
      >
        <MessageCircle className="w-4 h-4" />
        <span>واتساب</span>
      </button>

      <button
        onClick={handleTelegram}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition-all shadow-md hover:shadow-lg"
      >
        <Send className="w-4 h-4" />
        <span>تيليجرام</span>
      </button>

      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition-all shadow-md hover:shadow-lg"
      >
        <Share2 className="w-4 h-4" />
        <span>مشاركة</span>
      </button>
    </div>
  );
};

export default ShareButtons;
