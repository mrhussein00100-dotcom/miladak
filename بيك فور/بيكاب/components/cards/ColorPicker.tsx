'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Sparkles, Sun, Moon } from 'lucide-react';

interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

const COLOR_SCHEMES: ColorScheme[] = [
  {
    id: 'sunset',
    name: 'غروب الشمس',
    primary: '#ff6b6b',
    secondary: '#feca57',
    accent: '#ff9ff3',
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    text: '#2d3436',
  },
  {
    id: 'ocean',
    name: 'المحيط الأزرق',
    primary: '#74b9ff',
    secondary: '#0984e3',
    accent: '#00cec9',
    background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
    text: '#ffffff',
  },
  {
    id: 'forest',
    name: 'الغابة الخضراء',
    primary: '#00b894',
    secondary: '#00cec9',
    accent: '#55a3ff',
    background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
    text: '#ffffff',
  },
  {
    id: 'royal',
    name: 'البنفسج الملكي',
    primary: '#6c5ce7',
    secondary: '#a29bfe',
    accent: '#fd79a8',
    background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
    text: '#ffffff',
  },
  {
    id: 'warm',
    name: 'الدفء الذهبي',
    primary: '#fdcb6e',
    secondary: '#e17055',
    accent: '#fd79a8',
    background: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
    text: '#2d3436',
  },
  {
    id: 'cool',
    name: 'البرودة الفضية',
    primary: '#636e72',
    secondary: '#2d3436',
    accent: '#00cec9',
    background: 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)',
    text: '#ffffff',
  },
];

interface ColorPickerProps {
  selectedScheme: string;
  onSchemeChange: (schemeId: string) => void;
  customColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  onCustomColorChange?: (colors: {
    primary: string;
    secondary: string;
    accent: string;
  }) => void;
}

export default function ColorPicker({
  selectedScheme,
  onSchemeChange,
  customColors,
  onCustomColorChange,
}: ColorPickerProps) {
  const [showCustom, setShowCustom] = useState(false);

  const handleCustomColorChange = (
    colorType: 'primary' | 'secondary' | 'accent',
    value: string
  ) => {
    if (onCustomColorChange && customColors) {
      onCustomColorChange({
        ...customColors,
        [colorType]: value,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Preset Color Schemes */}
      <div>
        <label className="block text-sm font-medium mb-3 flex items-center gap-2">
          <Palette className="text-purple-500" size={18} />
          مخططات الألوان
        </label>
        <div className="grid grid-cols-2 gap-3">
          {COLOR_SCHEMES.map((scheme) => (
            <motion.button
              key={scheme.id}
              onClick={() => onSchemeChange(scheme.id)}
              className={`relative p-3 rounded-xl border-2 transition-all ${
                selectedScheme === scheme.id
                  ? 'border-purple-500 shadow-lg'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Color Preview */}
              <div
                className="w-full h-12 rounded-lg mb-2"
                style={{ background: scheme.background }}
              />

              {/* Color Dots */}
              <div className="flex justify-center gap-1 mb-2">
                <div
                  className="w-3 h-3 rounded-full border border-white"
                  style={{ backgroundColor: scheme.primary }}
                />
                <div
                  className="w-3 h-3 rounded-full border border-white"
                  style={{ backgroundColor: scheme.secondary }}
                />
                <div
                  className="w-3 h-3 rounded-full border border-white"
                  style={{ backgroundColor: scheme.accent }}
                />
              </div>

              <div className="text-xs font-medium text-center">
                {scheme.name}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Custom Colors Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">ألوان مخصصة</span>
        <motion.button
          onClick={() => setShowCustom(!showCustom)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            showCustom
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showCustom ? 'إخفاء' : 'إظهار'}
        </motion.button>
      </div>

      {/* Custom Color Controls */}
      <AnimatePresence>
        {showCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <h4 className="text-sm font-medium mb-3">تخصيص الألوان</h4>
              <div className="space-y-3">
                {/* Primary Color */}
                <div className="flex items-center gap-3">
                  <label className="text-xs font-medium w-16">أساسي</label>
                  <input
                    type="color"
                    value={customColors?.primary || '#6c5ce7'}
                    onChange={(e) =>
                      handleCustomColorChange('primary', e.target.value)
                    }
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customColors?.primary || '#6c5ce7'}
                    onChange={(e) =>
                      handleCustomColorChange('primary', e.target.value)
                    }
                    className="flex-1 px-2 py-1 text-xs rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                </div>

                {/* Secondary Color */}
                <div className="flex items-center gap-3">
                  <label className="text-xs font-medium w-16">ثانوي</label>
                  <input
                    type="color"
                    value={customColors?.secondary || '#a29bfe'}
                    onChange={(e) =>
                      handleCustomColorChange('secondary', e.target.value)
                    }
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customColors?.secondary || '#a29bfe'}
                    onChange={(e) =>
                      handleCustomColorChange('secondary', e.target.value)
                    }
                    className="flex-1 px-2 py-1 text-xs rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                </div>

                {/* Accent Color */}
                <div className="flex items-center gap-3">
                  <label className="text-xs font-medium w-16">مميز</label>
                  <input
                    type="color"
                    value={customColors?.accent || '#fd79a8'}
                    onChange={(e) =>
                      handleCustomColorChange('accent', e.target.value)
                    }
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customColors?.accent || '#fd79a8'}
                    onChange={(e) =>
                      handleCustomColorChange('accent', e.target.value)
                    }
                    className="flex-1 px-2 py-1 text-xs rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme Suggestions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4">
        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
          <Sparkles size={16} className="text-yellow-500" />
          اقتراحات الألوان
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Sun size={14} className="text-yellow-500" />
            <span>ألوان دافئة للاحتفالات</span>
          </div>
          <div className="flex items-center gap-2">
            <Moon size={14} className="text-blue-500" />
            <span>ألوان باردة للأناقة</span>
          </div>
        </div>
      </div>
    </div>
  );
}
