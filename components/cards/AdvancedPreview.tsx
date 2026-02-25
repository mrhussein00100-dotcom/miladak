'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Smartphone, Monitor, Tablet, RotateCcw } from 'lucide-react';
import CardDecorations from './CardDecorations';
import type { CardTemplate } from '@/lib/cards/modernTemplates';

interface AdvancedPreviewProps {
  template: CardTemplate;
  cardData: {
    name?: string;
    age?: number;
    showAge?: boolean;
    greeting?: string;
    message?: string;
    signature?: string;
    fontSize?: number;
    fontFamily?: string;
  };
  cardRef?: React.RefObject<HTMLDivElement>;
}

type PreviewMode = 'desktop' | 'tablet' | 'mobile';

export default function AdvancedPreview({
  template,
  cardData,
  cardRef,
}: AdvancedPreviewProps) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [showDecorations, setShowDecorations] = useState(true);
  const [animationEnabled, setAnimationEnabled] = useState(true);

  const previewModes = [
    {
      id: 'desktop',
      name: 'سطح المكتب',
      icon: Monitor,
      width: '400px',
      height: '300px',
    },
    {
      id: 'tablet',
      name: 'تابلت',
      icon: Tablet,
      width: '320px',
      height: '240px',
    },
    {
      id: 'mobile',
      name: 'موبايل',
      icon: Smartphone,
      width: '280px',
      height: '210px',
    },
  ];

  const currentMode =
    previewModes.find((mode) => mode.id === previewMode) || previewModes[0];

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Eye className="text-purple-500" />
          معاينة متقدمة
        </h3>

        {/* Preview Mode Selector */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          {previewModes.map((mode) => (
            <motion.button
              key={mode.id}
              onClick={() => setPreviewMode(mode.id as PreviewMode)}
              className={`p-2 rounded-md transition-all ${
                previewMode === mode.id
                  ? 'bg-white dark:bg-gray-600 shadow-sm text-purple-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={mode.name}
            >
              <mode.icon size={16} />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showDecorations}
              onChange={(e) => setShowDecorations(e.target.checked)}
              className="w-4 h-4 rounded text-purple-500 focus:ring-purple-500"
            />
            <span>الزخارف</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={animationEnabled}
              onChange={(e) => setAnimationEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-purple-500 focus:ring-purple-500"
            />
            <span>الحركة</span>
          </label>
        </div>

        <motion.button
          onClick={() => {
            setShowDecorations(true);
            setAnimationEnabled(true);
          }}
          className="flex items-center gap-1 text-purple-500 hover:text-purple-600"
          whileHover={{ scale: 1.05 }}
        >
          <RotateCcw size={14} />
          إعادة تعيين
        </motion.button>
      </div>

      {/* Preview Container */}
      <div className="flex justify-center mb-4">
        <div
          className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4 transition-all duration-300"
          style={{
            width: 'fit-content',
            minWidth: currentMode.width,
          }}
        >
          <motion.div
            ref={cardRef}
            className="mx-auto rounded-2xl overflow-hidden shadow-2xl"
            style={{
              width: currentMode.width,
              height: currentMode.height,
            }}
            layout
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-full h-full p-6 flex flex-col justify-center items-center text-center relative"
              style={{
                background: template.style.background,
                color: template.style.textColor,
                fontFamily: cardData.fontFamily || 'Cairo',
              }}
              initial={animationEnabled ? { scale: 0.9, opacity: 0 } : {}}
              animate={animationEnabled ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
            >
              {/* Decorations */}
              {showDecorations && (
                <CardDecorations
                  theme="colorful"
                  size={
                    previewMode === 'mobile'
                      ? 'sm'
                      : previewMode === 'tablet'
                      ? 'md'
                      : 'lg'
                  }
                />
              )}

              {/* Content */}
              <div className="z-10 space-y-2">
                <AnimatePresence>
                  {cardData.greeting && (
                    <motion.h2
                      className="font-bold leading-tight"
                      style={{
                        fontSize: `${Math.max(
                          12,
                          (cardData.fontSize || 18) *
                            (previewMode === 'mobile'
                              ? 0.7
                              : previewMode === 'tablet'
                              ? 0.85
                              : 1) +
                            4
                        )}px`,
                        color: template.style.accentColor,
                      }}
                      initial={animationEnabled ? { y: -10, opacity: 0 } : {}}
                      animate={animationEnabled ? { y: 0, opacity: 1 } : {}}
                      exit={animationEnabled ? { y: -10, opacity: 0 } : {}}
                    >
                      {cardData.greeting}
                    </motion.h2>
                  )}

                  {cardData.name && (
                    <motion.div
                      className="font-semibold"
                      style={{
                        fontSize: `${Math.max(
                          10,
                          (cardData.fontSize || 18) *
                            (previewMode === 'mobile'
                              ? 0.7
                              : previewMode === 'tablet'
                              ? 0.85
                              : 1) +
                            2
                        )}px`,
                      }}
                      initial={animationEnabled ? { y: -10, opacity: 0 } : {}}
                      animate={animationEnabled ? { y: 0, opacity: 1 } : {}}
                      exit={animationEnabled ? { y: -10, opacity: 0 } : {}}
                      transition={{ delay: 0.1 }}
                    >
                      {cardData.name}
                      {cardData.showAge && cardData.age && (
                        <span
                          className="mr-2 px-2 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: template.style.accentColor,
                            color: '#ffffff',
                            fontSize: `${Math.max(
                              8,
                              (cardData.fontSize || 18) *
                                (previewMode === 'mobile'
                                  ? 0.5
                                  : previewMode === 'tablet'
                                  ? 0.6
                                  : 0.7)
                            )}px`,
                          }}
                        >
                          {cardData.age} سنة
                        </span>
                      )}
                    </motion.div>
                  )}

                  {cardData.message && (
                    <motion.p
                      className="leading-relaxed"
                      style={{
                        fontSize: `${Math.max(
                          8,
                          (cardData.fontSize || 18) *
                            (previewMode === 'mobile'
                              ? 0.7
                              : previewMode === 'tablet'
                              ? 0.85
                              : 1)
                        )}px`,
                      }}
                      initial={animationEnabled ? { y: -10, opacity: 0 } : {}}
                      animate={animationEnabled ? { y: 0, opacity: 1 } : {}}
                      exit={animationEnabled ? { y: -10, opacity: 0 } : {}}
                      transition={{ delay: 0.2 }}
                    >
                      {cardData.message}
                    </motion.p>
                  )}

                  {cardData.signature && (
                    <motion.div
                      className="font-medium italic mt-2"
                      style={{
                        fontSize: `${Math.max(
                          6,
                          (cardData.fontSize || 18) *
                            (previewMode === 'mobile'
                              ? 0.6
                              : previewMode === 'tablet'
                              ? 0.75
                              : 0.9) -
                            2
                        )}px`,
                      }}
                      initial={animationEnabled ? { y: -10, opacity: 0 } : {}}
                      animate={animationEnabled ? { y: 0, opacity: 1 } : {}}
                      exit={animationEnabled ? { y: -10, opacity: 0 } : {}}
                      transition={{ delay: 0.3 }}
                    >
                      {cardData.signature}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Preview Info */}
      <div className="text-center text-sm text-gray-500">
        <div className="flex items-center justify-center gap-4">
          <span>
            الحجم: {currentMode.width} × {currentMode.height}
          </span>
          <span>•</span>
          <span>الوضع: {currentMode.name}</span>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
        <div className="text-xs text-blue-700 dark:text-blue-300">
          💡 <strong>نصيحة:</strong> جرب الأوضاع المختلفة لترى كيف ستبدو البطاقة
          على الأجهزة المختلفة
        </div>
      </div>
    </div>
  );
}
