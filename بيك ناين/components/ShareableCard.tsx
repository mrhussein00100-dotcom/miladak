'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Download,
  Share2,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  Palette,
  Printer,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import type { AgeData } from '@/lib/calculations/ageCalculations';
import { formatArabicNumber } from '@/lib/formatArabic';
import ShareModal from './ShareModal';
import { generatePDF } from '@/lib/generatePDF';

interface ShareableCardProps {
  ageData: AgeData;
}

type CardTheme = 'miladak' | 'purple' | 'ocean' | 'sunset' | 'forest' | 'gold';

const themes: Record<CardTheme, { gradient: string; name: string }> = {
  miladak: {
    gradient: 'linear-gradient(135deg, #ff0080 0%, #00d4ff 50%, #adff2f 100%)',
    name: '🎂 ميلادك',
  },
  purple: {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    name: '💜 بنفسجي',
  },
  ocean: {
    gradient: 'linear-gradient(135deg, #0077b6 0%, #00b4d8 50%, #90e0ef 100%)',
    name: '🌊 محيطي',
  },
  sunset: {
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)',
    name: '🌅 غروب',
  },
  forest: {
    gradient: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 50%, #95d5b2 100%)',
    name: '🌲 غابة',
  },
  gold: {
    gradient: 'linear-gradient(135deg, #b8860b 0%, #ffd700 50%, #fff8dc 100%)',
    name: '✨ ذهبي',
  },
};

export default function ShareableCard({ ageData }: ShareableCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<CardTheme>('miladak');
  const cardRef = useRef<HTMLDivElement>(null);

  const generateImage = useCallback(async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        width: 540,
        height: 540,
      });

      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png', 1.0);
      });
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  }, []);

  const handleDownload = async () => {
    setIsGenerating(true);
    setShowCard(true);

    // انتظر قليلاً لتحميل البطاقة
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const blob = await generateImage();
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `my-age-card-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      await generatePDF(ageData);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('حدث خطأ في إنشاء ملف PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    // إنشاء نافذة طباعة منسقة
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>بطاقة العمر - miladak.com</title>
        <style>
          @media print { @page { margin: 2cm; size: A4; } }
          body {
            font-family: 'Segoe UI', Tahoma, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            direction: rtl;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #4F46E5;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 { color: #4F46E5; font-size: 28px; margin: 0 0 10px 0; }
          .age-main {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            margin-bottom: 30px;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          .age-main h2 { font-size: 48px; margin: 0 0 10px 0; }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .stat-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
          }
          .stat-card h3 { color: #4F46E5; font-size: 14px; margin: 0 0 10px 0; }
          .stat-card .value { font-size: 24px; font-weight: bold; color: #1e293b; }
          .footer {
            text-align: center;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
            margin-top: 40px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎂 بطاقة العمر الشخصية</h1>
          <p>miladak.com - احسب عمرك بدقة</p>
        </div>
        <div class="age-main">
          <h2>${formatArabicNumber(ageData.years)} سنة</h2>
          <div>${formatArabicNumber(ageData.months)} شهر و ${formatArabicNumber(
      ageData.days
    )} يوم</div>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <h3>إجمالي الأيام</h3>
            <p class="value">${formatArabicNumber(ageData.totalDays)}</p>
          </div>
          <div class="stat-card">
            <h3>إجمالي الساعات</h3>
            <p class="value">${formatArabicNumber(ageData.totalHours)}</p>
          </div>
          <div class="stat-card">
            <h3>البرج الفلكي</h3>
            <p class="value">⭐ ${ageData.zodiacSign}</p>
          </div>
          <div class="stat-card">
            <h3>عيد الميلاد القادم</h3>
            <p class="value">بعد ${formatArabicNumber(
              ageData.nextBirthday.daysUntil
            )} يوم</p>
          </div>
        </div>
        <div class="footer">
          <p>تم إنشاء هذه البطاقة في ${new Date().toLocaleDateString(
            'ar-SA'
          )}</p>
          <p><strong>miladak.com</strong></p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  return (
    <div className="space-y-6">
      {/* أزرار التحكم */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => setShowCard(!showCard)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-all shadow-md hover:shadow-lg"
        >
          <ImageIcon className="w-4 h-4" />
          <span>{showCard ? 'إخفاء البطاقة' : 'عرض البطاقة'}</span>
        </button>

        <button
          onClick={() => setShowShareModal(true)}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
          <span>مشاركة وتحميل</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>تحميل صورة</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:opacity-90 transition-all shadow-md hover:shadow-lg"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة</span>
        </button>
      </div>

      {/* البطاقة القابلة للتحميل */}
      {/* اختيار القالب */}
      {showCard && (
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <Palette className="w-4 h-4 text-muted-foreground" />
          {(Object.keys(themes) as CardTheme[]).map((theme) => (
            <button
              key={theme}
              onClick={() => setCurrentTheme(theme)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                currentTheme === theme
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {themes[theme].name}
            </button>
          ))}
        </div>
      )}

      {showCard && (
        <div className="flex justify-center overflow-x-auto pb-4">
          <div
            ref={cardRef}
            className="w-[540px] h-[540px] min-w-[540px] relative overflow-hidden rounded-3xl shadow-2xl"
            style={{
              background: themes[currentTheme].gradient,
            }}
          >
            {/* خلفية زخرفية */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-8 right-8 text-7xl">🎂</div>
              <div className="absolute bottom-8 left-8 text-5xl">🎈</div>
              <div className="absolute top-1/4 left-8 text-4xl">✨</div>
              <div className="absolute bottom-1/4 right-8 text-4xl">🎁</div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] opacity-20">
                🎉
              </div>
            </div>

            {/* نجوم متناثرة */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-yellow-300 opacity-60"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    fontSize: `${8 + Math.random() * 12}px`,
                  }}
                >
                  ⭐
                </div>
              ))}
            </div>

            {/* المحتوى الرئيسي */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-white text-center">
              {/* العنوان */}
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-1">🎂 بطاقة ميلادي 🎂</h2>
              </div>

              {/* العمر الرئيسي */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-4 w-full max-w-md">
                <div className="flex justify-center items-baseline gap-2 mb-2">
                  <span className="text-6xl font-black">
                    {formatArabicNumber(ageData.years)}
                  </span>
                  <span className="text-2xl">سنة</span>
                </div>
                <div className="flex justify-center gap-4 text-lg">
                  <span>{formatArabicNumber(ageData.months)} شهر</span>
                  <span>•</span>
                  <span>{formatArabicNumber(ageData.days)} يوم</span>
                </div>
              </div>

              {/* إحصائيات */}
              <div className="grid grid-cols-2 gap-3 mb-4 w-full max-w-md">
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                  <div className="text-2xl font-bold">
                    {formatArabicNumber(ageData.totalDays)}
                  </div>
                  <div className="text-xs opacity-80">يوم من الحياة</div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                  <div className="text-2xl font-bold">
                    {formatArabicNumber(ageData.nextBirthday.daysUntil)}
                  </div>
                  <div className="text-xs opacity-80">يوم لعيد ميلادي</div>
                </div>
              </div>

              {/* الأبراج */}
              <div className="flex justify-center gap-4 mb-4">
                <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2">
                  <span className="text-sm">⭐ {ageData.zodiacSign}</span>
                </div>
                {ageData.chineseZodiac && (
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2">
                    <span className="text-sm">🐉 {ageData.chineseZodiac}</span>
                  </div>
                )}
              </div>

              {/* الشعار */}
              <div className="mt-auto pt-4">
                <div className="bg-white/25 backdrop-blur-sm rounded-full px-6 py-2 inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-bold">miladak.com</span>
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* نافذة المشاركة المنبثقة */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        ageData={ageData}
        onDownloadImage={handleDownload}
        onDownloadPDF={handleDownloadPDF}
        onPrint={handlePrint}
      />
    </div>
  );
}
