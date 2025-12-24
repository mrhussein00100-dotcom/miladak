'use client';

import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Type } from 'lucide-react';

interface FontOption {
  id: string;
  name: string;
  nameAr: string;
  family: string;
  preview: string;
  googleFontsUrl?: string;
}

const ARABIC_FONTS: FontOption[] = [
  {
    id: 'cairo',
    name: 'Cairo',
    nameAr: 'القاهرة',
    family: 'Cairo, sans-serif',
    preview: 'أهلاً وسهلاً',
    // Cairo محمّل بالفعل من next/font
  },
  {
    id: 'amiri',
    name: 'Amiri',
    nameAr: 'أميري',
    family: 'Amiri, serif',
    preview: 'مرحباً بكم',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap',
  },
  {
    id: 'noto-sans',
    name: 'Noto Sans Arabic',
    nameAr: 'نوتو سانس',
    family: 'Noto Sans Arabic, sans-serif',
    preview: 'عيد مبارك',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700&display=swap',
  },
  {
    id: 'tajawal',
    name: 'Tajawal',
    nameAr: 'تجوال',
    family: 'Tajawal, sans-serif',
    preview: 'كل عام وأنتم بخير',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap',
  },
  {
    id: 'ibm-plex',
    name: 'IBM Plex Arabic',
    nameAr: 'آي بي إم',
    family: 'IBM Plex Sans Arabic, sans-serif',
    preview: 'تهانينا الحارة',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap',
  },
  {
    id: 'almarai',
    name: 'Almarai',
    nameAr: 'المرعي',
    family: 'Almarai, sans-serif',
    preview: 'بارك الله فيكم',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Almarai:wght@400;700&display=swap',
  },
  {
    id: 'harmattan',
    name: 'Harmattan',
    nameAr: 'هرمتان',
    family: 'Harmattan, sans-serif',
    preview: 'كل عام وأنتم إلى الله أقرب',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Harmattan:wght@400;700&display=swap',
  },
  {
    id: 'changa',
    name: 'Changa',
    nameAr: 'تشانجا',
    family: 'Changa, sans-serif',
    preview: 'عيد ميلاد سعيد',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Changa:wght@400;600;700&display=swap',
  },
];

// تتبع الخطوط المحمّلة لتجنب التحميل المكرر
const loadedFonts = new Set<string>(['cairo']); // Cairo محمّل بالفعل

interface FontSelectorProps {
  selectedFont: string;
  onFontChange: (fontId: string) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

export default function FontSelector({
  selectedFont,
  onFontChange,
  fontSize,
  onFontSizeChange,
}: FontSelectorProps) {
  // تحميل الخط بشكل كسول عند اختياره
  const loadFont = useCallback((font: FontOption) => {
    if (!font.googleFontsUrl || loadedFonts.has(font.id)) return;

    const existingLink = document.querySelector(
      `link[href="${font.googleFontsUrl}"]`
    );
    if (existingLink) {
      loadedFonts.add(font.id);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = font.googleFontsUrl;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    loadedFonts.add(font.id);
  }, []);

  // تحميل الخط المختار عند تغييره
  useEffect(() => {
    const font = ARABIC_FONTS.find((f) => f.id === selectedFont);
    if (font) {
      loadFont(font);
    }
  }, [selectedFont, loadFont]);

  const handleFontChange = (fontId: string) => {
    const font = ARABIC_FONTS.find((f) => f.id === fontId);
    if (font) {
      loadFont(font);
    }
    onFontChange(fontId);
  };

  const getFontSizeLabel = (size: number) => {
    if (size <= 14) return 'صغير';
    if (size <= 18) return 'متوسط';
    if (size <= 22) return 'كبير';
    return 'كبير جداً';
  };

  return (
    <div className="space-y-6">
      {/* Font Family Selection */}
      <div>
        <label className="block text-sm font-medium mb-3 flex items-center gap-2">
          <Type className="text-purple-500" size={18} />
          شكل الخط ({ARABIC_FONTS.length} خطوط متاحة)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {ARABIC_FONTS.map((font) => (
            <motion.button
              key={font.id}
              onClick={() => handleFontChange(font.id)}
              className={`p-3 rounded-xl text-sm transition-all border-2 ${
                selectedFont === font.id
                  ? 'bg-purple-500 text-white border-purple-500 shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              style={{
                fontFamily: loadedFonts.has(font.id)
                  ? font.family
                  : 'Cairo, sans-serif',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-medium text-xs mb-1">{font.nameAr}</div>
              <div className="text-xs opacity-75">{font.preview}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Font Size Control */}
      <div>
        <label className="block text-sm font-medium mb-3">
          📏 حجم الخط:{' '}
          <span className="text-purple-500 font-bold">
            {getFontSizeLabel(fontSize)}
          </span>
        </label>
        <div className="space-y-3">
          <input
            type="range"
            min="12"
            max="28"
            step="2"
            value={fontSize}
            onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
            className="w-full accent-purple-500"
            aria-label="حجم الخط"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>صغير</span>
            <span>متوسط</span>
            <span>كبير</span>
            <span>كبير جداً</span>
          </div>
        </div>
      </div>

      {/* Font Preview */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          معاينة الخط
        </h4>
        <div
          className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg"
          style={{
            fontFamily:
              ARABIC_FONTS.find((f) => f.id === selectedFont)?.family ||
              'Cairo, sans-serif',
            fontSize: `${fontSize}px`,
          }}
        >
          كل عام وأنت بخير
        </div>
      </div>

      {/* Quick Font Size Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {[14, 18, 22, 26].map((size) => (
          <motion.button
            key={size}
            onClick={() => onFontSizeChange(size)}
            className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
              fontSize === size
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`حجم الخط ${getFontSizeLabel(size)}`}
          >
            {getFontSizeLabel(size)}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
