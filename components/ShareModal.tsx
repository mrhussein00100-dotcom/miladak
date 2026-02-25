'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  X,
  MessageCircle,
  Send,
  Copy,
  Check,
  FileText,
  Printer,
  Image as ImageIcon,
} from 'lucide-react';

// أيقونات مخصصة للشبكات الاجتماعية
const FacebookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
import type { AgeData } from '@/lib/calculations/ageCalculations';
import { formatArabicNumber } from '@/lib/formatArabic';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  ageData: AgeData;
  onDownloadImage?: () => void;
  onDownloadPDF?: () => void;
  onPrint?: () => void;
}

export default function ShareModal({
  isOpen,
  onClose,
  ageData,
  onDownloadImage,
  onDownloadPDF,
  onPrint,
}: ShareModalProps) {
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

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, [shareText]);

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

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      'https://miladak.com'
    )}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent('https://miladak.com')}`;
    window.open(url, '_blank');
  };

  // إغلاق بالضغط على Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* خلفية معتمة */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* النافذة */}
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        {/* رأس النافذة */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">مشاركة النتائج</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* وسائل التواصل الاجتماعي */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              مشاركة على
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={handleWhatsApp}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-600 transition-colors"
              >
                <MessageCircle className="w-6 h-6" />
                <span className="text-xs">واتساب</span>
              </button>

              <button
                onClick={handleTelegram}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-colors"
              >
                <Send className="w-6 h-6" />
                <span className="text-xs">تيليجرام</span>
              </button>

              <button
                onClick={handleFacebook}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 transition-colors"
              >
                <FacebookIcon />
                <span className="text-xs">فيسبوك</span>
              </button>

              <button
                onClick={handleTwitter}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 transition-colors"
              >
                <TwitterIcon />
                <span className="text-xs">تويتر</span>
              </button>
            </div>
          </div>

          {/* نسخ النص */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              نسخ النص
            </h3>
            <div className="relative">
              <div className="bg-muted rounded-xl p-3 text-sm whitespace-pre-wrap max-h-32 overflow-y-auto">
                {shareText}
              </div>
              <button
                onClick={handleCopy}
                className={`absolute top-2 left-2 p-2 rounded-lg transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-background hover:bg-muted-foreground/10'
                }`}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* خيارات التحميل */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              تحميل وطباعة
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {onDownloadImage && (
                <button
                  onClick={() => {
                    onDownloadImage();
                    onClose();
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 transition-colors"
                >
                  <ImageIcon className="w-6 h-6" />
                  <span className="text-xs">صورة PNG</span>
                </button>
              )}

              {onDownloadPDF && (
                <button
                  onClick={() => {
                    onDownloadPDF();
                    onClose();
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                >
                  <FileText className="w-6 h-6" />
                  <span className="text-xs">ملف PDF</span>
                </button>
              )}

              {onPrint && (
                <button
                  onClick={() => {
                    onPrint();
                    onClose();
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-500/10 hover:bg-gray-500/20 text-gray-600 transition-colors"
                >
                  <Printer className="w-6 h-6" />
                  <span className="text-xs">طباعة</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
