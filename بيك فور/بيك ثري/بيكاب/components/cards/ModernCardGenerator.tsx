'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import { Download, Share2, Copy, Sparkles, Heart, Gift } from 'lucide-react';
import CardDecorations from './CardDecorations';
import {
  MODERN_CARD_TEMPLATES,
  TEMPLATE_CATEGORIES,
  GREETING_MESSAGES,
  BIRTHDAY_MESSAGES,
  SIGNATURE_OPTIONS,
  type CardTemplate,
} from '@/lib/cards/modernTemplates';

interface CardData {
  name: string;
  age?: number;
  showAge: boolean;
  greeting: string;
  message: string;
  signature: string;
  fontSize: number;
  fontFamily: string;
  spacing: number;
}

// Social Media Sizes - مقاسات السوشيال ميديا
const CARD_SIZES = {
  'instagram-post': { width: 1080, height: 1080, name: 'إنستغرام - منشور' },
  'instagram-story': { width: 1080, height: 1920, name: 'إنستغرام - ستوري' },
  'facebook-post': { width: 1200, height: 630, name: 'فيسبوك - منشور' },
  'twitter-post': { width: 1024, height: 512, name: 'تويتر - منشور' },
  'whatsapp-status': { width: 1080, height: 1920, name: 'واتساب - حالة' },
  'linkedin-post': { width: 1200, height: 627, name: 'لينكد إن - منشور' },
  'youtube-thumbnail': {
    width: 1280,
    height: 720,
    name: 'يوتيوب - صورة مصغرة',
  },
  custom: { width: 800, height: 600, name: 'مقاس مخصص' },
};

// Font Options - خيارات الخطوط
const FONT_OPTIONS = [
  {
    id: 'classic',
    name: 'كلاسيكي أنيق',
    preview: 'أأ',
    fonts: ['Amiri', 'Cairo', 'Georgia', 'Times New Roman', 'serif'],
    description: 'خط تقليدي وأنيق مناسب للمناسبات الرسمية',
  },
  {
    id: 'modern',
    name: 'عصري وجريء',
    preview: 'أأ',
    fonts: ['Tajawal', 'Almarai', 'Roboto', 'Poppins', 'sans-serif'],
    description: 'خط حديث وواضح مناسب للتصاميم العصرية',
  },
  {
    id: 'artistic',
    name: 'فني ومميز',
    preview: 'أأ',
    fonts: [
      'Changa',
      'Montserrat',
      'Playfair Display',
      'Crimson Text',
      'serif',
    ],
    description: 'خط إبداعي ومميز يضيف لمسة فنية',
  },
];

export default function ModernCardGenerator() {
  const [cardData, setCardData] = useState<Partial<CardData>>({
    name: '',
    showAge: false,
    greeting: '',
    message: '',
    signature: '',
    fontSize: 18,
    fontFamily: 'classic',
    spacing: 1,
  });

  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>(
    MODERN_CARD_TEMPLATES[0]
  );
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeStep, setActiveStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cardSize, setCardSize] =
    useState<keyof typeof CARD_SIZES>('instagram-post');
  const [showShareModal, setShowShareModal] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const filteredTemplates =
    selectedCategory === 'all'
      ? MODERN_CARD_TEMPLATES
      : MODERN_CARD_TEMPLATES.filter((t) => t.category === selectedCategory);

  const generateRandomContent = useCallback(() => {
    const randomGreeting =
      GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)];
    const randomMessage =
      BIRTHDAY_MESSAGES[Math.floor(Math.random() * BIRTHDAY_MESSAGES.length)];
    const randomSignature =
      SIGNATURE_OPTIONS[Math.floor(Math.random() * SIGNATURE_OPTIONS.length)];

    setCardData((prev) => ({
      ...prev,
      greeting: randomGreeting,
      message: randomMessage,
      signature: randomSignature,
    }));
  }, []);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      const selectedSize = CARD_SIZES[cardSize];
      const aspectRatio = selectedSize.width / selectedSize.height;
      const isPortrait = aspectRatio < 1;

      // Calculate display dimensions (same logic as below)
      let previewWidth, previewHeight;
      if (isPortrait) {
        previewHeight = Math.min(400, selectedSize.height * 0.3);
        previewWidth = previewHeight * aspectRatio;
      } else {
        previewWidth = Math.min(400, selectedSize.width * 0.3);
        previewHeight = previewWidth / aspectRatio;
      }

      const options = {
        quality: 1,
        pixelRatio: 3,
        cacheBust: true,
        width: selectedSize.width,
        height: selectedSize.height,
        style: {
          transform: `scale(${selectedSize.width / previewWidth})`,
          transformOrigin: 'top left',
          width: `${previewWidth}px`,
          height: `${previewHeight}px`,
        },
      };

      let dataUrl;
      try {
        // Try with font embedding first
        dataUrl = await toPng(cardRef.current, options);
      } catch (fontError) {
        // If font embedding fails (Firefox issue), retry without fonts
        console.warn(
          'Font embedding failed, retrying without fonts:',
          fontError
        );
        dataUrl = await toPng(cardRef.current, {
          ...options,
          skipFonts: true,
        });
      }

      const link = document.createElement('a');
      link.download = `birthday-card-${cardData.name || 'card'}-${
        selectedSize.width
      }x${selectedSize.height}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('حدث خطأ أثناء تحميل البطاقة');
    } finally {
      setIsGenerating(false);
    }
  }, [cardData, cardSize, selectedTemplate]);

  // Generate card image for sharing
  const generateCardImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;

    try {
      const selectedSize = CARD_SIZES[cardSize];
      const aspectRatio = selectedSize.width / selectedSize.height;
      const isPortrait = aspectRatio < 1;

      // Calculate display dimensions
      let previewWidth, previewHeight;
      if (isPortrait) {
        previewHeight = Math.min(400, selectedSize.height * 0.3);
        previewWidth = previewHeight * aspectRatio;
      } else {
        previewWidth = Math.min(400, selectedSize.width * 0.3);
        previewHeight = previewWidth / aspectRatio;
      }

      const options = {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        width: selectedSize.width,
        height: selectedSize.height,
        style: {
          transform: `scale(${selectedSize.width / previewWidth})`,
          transformOrigin: 'top left',
          width: `${previewWidth}px`,
          height: `${previewHeight}px`,
        },
      };

      let dataUrl;
      try {
        // Try with font embedding first
        dataUrl = await toPng(cardRef.current, options);
      } catch (fontError) {
        // If font embedding fails (Firefox issue), retry without fonts
        console.warn(
          'Font embedding failed, retrying without fonts:',
          fontError
        );
        dataUrl = await toPng(cardRef.current, {
          ...options,
          skipFonts: true,
        });
      }

      // Convert data URL to blob
      const response = await fetch(dataUrl);
      return await response.blob();
    } catch (error) {
      console.error('Error generating card image:', error);
      return null;
    }
  };

  const shareWhatsApp = async () => {
    const blob = await generateCardImage();
    const text = `🎉 بطاقة تهنئة لـ ${cardData.name || 'شخص عزيز'}\n${
      cardData.greeting || 'عيد ميلاد سعيد'
    }\nmiladak.com`;

    if (blob && navigator.share && navigator.canShare) {
      try {
        const file = new File(
          [blob],
          `birthday-card-${cardData.name || 'card'}.png`,
          { type: 'image/png' }
        );

        // Check if files can be shared
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `🎉 بطاقة تهنئة لـ ${cardData.name || 'شخص عزيز'}`,
            text: `${cardData.greeting || 'عيد ميلاد سعيد'} 🎂\nmiladak.com`,
            files: [file],
          });
          return;
        }
      } catch (error) {
        // If user doesn't cancel, continue to fallback
        if ((error as Error).name === 'AbortError') {
          return;
        }
      }
    }

    // Fallback: open WhatsApp with text
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareTwitter = async () => {
    const blob = await generateCardImage();
    const text = `🎉 بطاقة تهنئة لـ ${cardData.name || 'شخص عزيز'} ${
      cardData.greeting || 'عيد ميلاد سعيد'
    } 🎂`;

    if (blob && navigator.share && navigator.canShare) {
      try {
        const file = new File(
          [blob],
          `birthday-card-${cardData.name || 'card'}.png`,
          { type: 'image/png' }
        );

        // Check if files can be shared
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `🎉 بطاقة تهنئة لـ ${cardData.name || 'شخص عزيز'}`,
            text: `${cardData.greeting || 'عيد ميلاد سعيد'} 🎂\nmiladak.com`,
            files: [file],
          });
          return;
        }
      } catch (error) {
        // If user doesn't cancel, continue to fallback
        if ((error as Error).name === 'AbortError') {
          return;
        }
      }
    }

    // Fallback: open Twitter with text
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent('https://miladak.com')}`,
      '_blank'
    );
  };

  const shareFacebook = async () => {
    const blob = await generateCardImage();
    const text = `🎉 بطاقة تهنئة لـ ${cardData.name || 'شخص عزيز'} ${
      cardData.greeting || 'عيد ميلاد سعيد'
    } 🎂`;

    if (blob && navigator.share && navigator.canShare) {
      try {
        const file = new File(
          [blob],
          `birthday-card-${cardData.name || 'card'}.png`,
          { type: 'image/png' }
        );

        // Check if files can be shared
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `🎉 بطاقة تهنئة لـ ${cardData.name || 'شخص عزيز'}`,
            text: `${cardData.greeting || 'عيد ميلاد سعيد'} 🎂\nmiladak.com`,
            files: [file],
          });
          return;
        }
      } catch (error) {
        // If user doesn't cancel, continue to fallback
        if ((error as Error).name === 'AbortError') {
          return;
        }
      }
    }

    // Fallback: open Facebook with URL
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        'https://miladak.com'
      )}&quote=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  const shareGeneral = async () => {
    const blob = await generateCardImage();
    if (blob && navigator.share && navigator.canShare) {
      try {
        const file = new File(
          [blob],
          `birthday-card-${cardData.name || 'card'}.png`,
          { type: 'image/png' }
        );

        // Check if files can be shared
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `🎉 بطاقة تهنئة لـ ${cardData.name || 'شخص عزيز'}`,
            text: `${cardData.greeting || 'عيد ميلاد سعيد'} 🎂\nmiladak.com`,
            files: [file],
          });
        } else {
          // Fallback: show share modal
          setShowShareModal(true);
        }
      } catch (error) {
        // If user cancels, do nothing. Otherwise show modal
        if ((error as Error).name !== 'AbortError') {
          setShowShareModal(true);
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      setShowShareModal(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      const text = `${cardData.greeting || 'عيد ميلاد سعيد'}\n${
        cardData.message || 'أتمنى لك يوماً سعيداً'
      }\n${cardData.signature || ''}`;
      await navigator.clipboard.writeText(text);
      alert('تم نسخ النص بنجاح! 📋');
    } catch {
      alert('حدث خطأ في النسخ');
    }
  };

  // Calculate responsive sizes
  const currentSize = CARD_SIZES[cardSize];
  const aspectRatio = currentSize.width / currentSize.height;
  const isPortrait = aspectRatio < 1;
  const isSquare = Math.abs(aspectRatio - 1) < 0.1;

  // Calculate display dimensions (max 400px)
  let displayWidth, displayHeight;
  if (isPortrait) {
    displayHeight = Math.min(400, currentSize.height * 0.3);
    displayWidth = displayHeight * aspectRatio;
  } else {
    displayWidth = Math.min(400, currentSize.width * 0.3);
    displayHeight = displayWidth / aspectRatio;
  }

  return (
    <div className="min-h-screen relative overflow-visible">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
        <div className="absolute inset-0 opacity-30">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          ></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-float blur-sm"></div>
        <div
          className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-float blur-sm"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20 animate-float blur-sm"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div
        className="relative z-10 container mx-auto px-4 py-8"
        style={{ overflow: 'visible' }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-black mb-4 flex items-center justify-center gap-4">
            <span className="text-5xl md:text-6xl not-prose">🎉</span>
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              مولد البطاقات السحري
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            صمم بطاقات تهنئة رائعة بمقاسات السوشيال ميديا المثالية
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-4 shadow-xl">
            <div className="flex items-center gap-4">
              {[
                { step: 1, icon: '🎨', label: 'التصميم' },
                { step: 2, icon: '✍️', label: 'المحتوى' },
                { step: 3, icon: '🎉', label: 'التخصيص' },
              ].map(({ step, icon, label }, index) => (
                <div key={step} className="flex items-center">
                  <motion.div
                    className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold ${
                      activeStep >= step
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-lg">{icon}</span>
                    <span className="text-xs">{step}</span>
                  </motion.div>
                  {index < 2 && (
                    <div
                      className={`w-12 h-1 mx-2 rounded ${
                        activeStep > step
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Preview - Compact */}
        <div className="lg:hidden mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-4 shadow-xl"
          >
            <h3 className="text-lg font-bold mb-3 text-center">
              👁️ معاينة سريعة
            </h3>

            <div className="flex justify-center items-center">
              <div
                className="rounded-xl shadow-lg overflow-hidden relative"
                style={{
                  width: `${Math.min(displayWidth * 0.8, 280)}px`,
                  height: `${Math.min(displayHeight * 0.8, 200)}px`,
                  background: selectedTemplate.style.background,
                  fontFamily: (
                    FONT_OPTIONS.find((f) => f.id === cardData.fontFamily) ||
                    FONT_OPTIONS[0]
                  ).fonts.join(', '),
                }}
              >
                <CardDecorations theme="colorful" size="sm" />

                <div
                  className="absolute inset-0 flex flex-col items-center justify-center text-center z-10"
                  style={{
                    padding: isPortrait
                      ? `${4 + (cardData.spacing || 1) * 2}%`
                      : '6%',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    className="w-full flex flex-col items-center justify-center"
                    style={{
                      color: selectedTemplate.style.textColor,
                      gap: `${
                        Math.min(displayWidth, displayHeight) *
                        0.03 *
                        (cardData.spacing || 1)
                      }px`,
                    }}
                  >
                    {cardData.greeting && (
                      <div
                        className="font-bold"
                        style={{
                          fontSize: `${
                            Math.min(displayWidth, displayHeight) * 0.04
                          }px`,
                          lineHeight: '1.3',
                        }}
                      >
                        {cardData.greeting}
                      </div>
                    )}

                    {cardData.name && (
                      <div
                        className="font-black"
                        style={{
                          fontSize: `${
                            Math.min(displayWidth, displayHeight) * 0.07
                          }px`,
                          textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                          lineHeight: '1.2',
                        }}
                      >
                        {cardData.name}
                      </div>
                    )}

                    {cardData.showAge && cardData.age && (
                      <div
                        className="inline-block bg-white/30 backdrop-blur-sm rounded-full"
                        style={{
                          padding: `${
                            Math.min(displayWidth, displayHeight) * 0.015
                          }px ${
                            Math.min(displayWidth, displayHeight) * 0.03
                          }px`,
                        }}
                      >
                        <div
                          className="font-bold"
                          style={{
                            fontSize: `${
                              Math.min(displayWidth, displayHeight) * 0.05
                            }px`,
                          }}
                        >
                          {cardData.age}
                        </div>
                        <div
                          style={{
                            fontSize: `${
                              Math.min(displayWidth, displayHeight) * 0.02
                            }px`,
                          }}
                        >
                          سنة
                        </div>
                      </div>
                    )}

                    {cardData.message && (
                      <div
                        style={{
                          fontSize: `${
                            Math.min(displayWidth, displayHeight) * 0.035
                          }px`,
                          lineHeight: '1.5',
                          maxWidth: '90%',
                          wordWrap: 'break-word',
                        }}
                      >
                        {cardData.message.length > 50
                          ? cardData.message.substring(0, 50) + '...'
                          : cardData.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* Website Link - Mobile */}
                <div
                  className="absolute bottom-1 right-2 opacity-30 text-xs"
                  style={{
                    color: selectedTemplate.style.textColor,
                    fontSize: `${
                      Math.min(displayWidth, displayHeight) * 0.02
                    }px`,
                  }}
                >
                  miladak.com
                </div>
              </div>
            </div>

            <div className="mt-3 text-center text-xs text-gray-500">
              {currentSize.width} × {currentSize.height} بكسل
            </div>
          </motion.div>
        </div>

        <div
          className="flex flex-col lg:flex-row gap-8 relative"
          style={{ alignItems: 'flex-start', overflow: 'visible' }}
        >
          {/* Left Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 w-full lg:w-1/2"
            style={{ minHeight: '150vh' }}
          >
            <AnimatePresence mode="wait">
              {/* Step 1: Template Selection */}
              {activeStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Gift className="text-purple-500" />
                    اختر التصميم المفضل
                  </h2>

                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {TEMPLATE_CATEGORIES.map((category) => (
                      <motion.button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedCategory === category.id
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {category.icon} {category.name}
                      </motion.button>
                    ))}
                  </div>

                  {/* Template Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 max-h-96 overflow-y-auto template-scrollbar">
                    {filteredTemplates.map((template) => (
                      <motion.div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template)}
                        className={`template-card-enhanced cursor-pointer rounded-2xl p-4 h-24 flex flex-col items-center justify-center ${
                          selectedTemplate.id === template.id
                            ? 'ring-4 ring-purple-500 ring-offset-2'
                            : ''
                        }`}
                        style={{ background: template.style.background }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-2xl mb-1">{template.preview}</div>
                        <div
                          className="text-xs font-medium text-center"
                          style={{ color: template.style.textColor }}
                        >
                          {template.name}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    onClick={() => setActiveStep(2)}
                    className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    التالي: أضف المحتوى ✨
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2: Content */}
              {activeStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Heart className="text-pink-500" />
                    اكتب رسالتك الخاصة
                  </h2>

                  <div className="space-y-5">
                    {/* Name Input */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        👤 اسم صاحب العيد
                      </label>
                      <input
                        type="text"
                        value={cardData.name || ''}
                        onChange={(e) =>
                          setCardData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="مثال: محمد"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/70 dark:bg-gray-700/70 text-right focus:ring-2 focus:ring-purple-500 focus:border-purple-500 enhanced-input"
                      />
                    </div>

                    {/* Age Input - Completely Separated */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        🎂 العمر (اختياري)
                      </label>
                      <input
                        type="number"
                        value={cardData.age || ''}
                        onChange={(e) =>
                          setCardData((prev) => ({
                            ...prev,
                            age: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          }))
                        }
                        placeholder="25"
                        min="0"
                        max="150"
                        className="w-24 px-3 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/70 dark:bg-gray-700/70 text-center focus:ring-2 focus:ring-purple-500 focus:border-purple-500 enhanced-input"
                      />
                    </div>

                    {/* Show Age Checkbox - Separate Row */}
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer bg-purple-50 dark:bg-purple-900/30 px-4 py-3 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors w-fit">
                        <input
                          type="checkbox"
                          checked={cardData.showAge || false}
                          onChange={(e) =>
                            setCardData((prev) => ({
                              ...prev,
                              showAge: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 rounded text-purple-500"
                        />
                        <span className="text-sm font-medium">
                          أظهر العمر في البطاقة
                        </span>
                      </label>
                    </div>

                    {/* Greeting Input */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        💬 التهنئة
                      </label>
                      <input
                        type="text"
                        value={cardData.greeting || ''}
                        onChange={(e) =>
                          setCardData((prev) => ({
                            ...prev,
                            greeting: e.target.value,
                          }))
                        }
                        placeholder="عيد ميلاد سعيد"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/70 dark:bg-gray-700/70 text-right focus:ring-2 focus:ring-purple-500 focus:border-purple-500 enhanced-input"
                      />
                    </div>

                    {/* Message Input */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        📝 الرسالة
                      </label>
                      <textarea
                        value={cardData.message || ''}
                        onChange={(e) =>
                          setCardData((prev) => ({
                            ...prev,
                            message: e.target.value,
                          }))
                        }
                        placeholder="أتمنى لك يوماً سعيداً مليئاً بالفرح والسعادة"
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/70 dark:bg-gray-700/70 text-right focus:ring-2 focus:ring-purple-500 focus:border-purple-500 enhanced-input resize-none"
                      />
                    </div>

                    {/* Signature Input */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        ✍️ التوقيع
                      </label>
                      <input
                        type="text"
                        value={cardData.signature || ''}
                        onChange={(e) =>
                          setCardData((prev) => ({
                            ...prev,
                            signature: e.target.value,
                          }))
                        }
                        placeholder="مع أطيب التمنيات"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/70 dark:bg-gray-700/70 text-right focus:ring-2 focus:ring-purple-500 focus:border-purple-500 enhanced-input"
                      />
                    </div>

                    {/* Random Content Button */}
                    <motion.button
                      onClick={generateRandomContent}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Sparkles size={20} />
                      اقتراحات عشوائية
                    </motion.button>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <motion.button
                      onClick={() => setActiveStep(1)}
                      className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-4 rounded-2xl font-bold"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      السابق
                    </motion.button>
                    <motion.button
                      onClick={() => setActiveStep(3)}
                      className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white py-4 rounded-2xl font-bold shadow-xl"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      التالي: التخصيص 🎨
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Customization */}
              {activeStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Sparkles className="text-yellow-500" />
                    التخصيص النهائي
                  </h2>

                  <div className="space-y-5">
                    {/* Card Size Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-3">
                        📐 مقاس البطاقة
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(CARD_SIZES).map(([key, size]) => (
                          <motion.button
                            key={key}
                            onClick={() =>
                              setCardSize(key as keyof typeof CARD_SIZES)
                            }
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                              cardSize === key
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {size.name}
                            <div className="text-[10px] opacity-70">
                              {size.width}×{size.height}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Font Family Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-3">
                        🎨 نوع الخط
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {FONT_OPTIONS.map((font) => (
                          <motion.button
                            key={font.id}
                            onClick={() =>
                              setCardData((prev) => ({
                                ...prev,
                                fontFamily: font.id,
                              }))
                            }
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              cardData.fontFamily === font.id
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                                : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div
                                  className="font-bold text-lg"
                                  style={{ fontFamily: font.fonts.join(', ') }}
                                >
                                  {font.name}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {font.description}
                                </div>
                              </div>
                              <div
                                className="text-4xl font-bold"
                                style={{ fontFamily: font.fonts.join(', ') }}
                              >
                                {font.preview}
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Element Spacing */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        📏 التباعد بين العناصر: {cardData.spacing}x
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={cardData.spacing || 1}
                        onChange={(e) =>
                          setCardData((prev) => ({
                            ...prev,
                            spacing: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>مضغوط</span>
                        <span>متوسط</span>
                        <span>متباعد</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4">
                      <motion.button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Download size={24} />
                        {isGenerating ? 'جاري التحميل...' : 'تحميل البطاقة'}
                      </motion.button>

                      <div className="space-y-3">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                          📤 مشاركة البطاقة
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <motion.button
                            onClick={shareWhatsApp}
                            className="bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 rounded-lg font-medium shadow-lg flex items-center justify-center gap-2 text-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Share2 size={16} />
                            واتساب
                          </motion.button>

                          <motion.button
                            onClick={shareTwitter}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-lg font-medium shadow-lg flex items-center justify-center gap-2 text-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Share2 size={16} />
                            تويتر
                          </motion.button>

                          <motion.button
                            onClick={shareGeneral}
                            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 rounded-lg font-medium shadow-lg flex items-center justify-center gap-2 text-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Share2 size={16} />
                            مشاركة عامة
                          </motion.button>

                          <motion.button
                            onClick={copyToClipboard}
                            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-2.5 rounded-lg font-medium shadow-lg flex items-center justify-center gap-2 text-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Copy size={16} />
                            نسخ النص
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => setActiveStep(2)}
                    className="w-full mt-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-4 rounded-2xl font-bold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    السابق
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Panel - Card Preview - Desktop Only */}
          <div
            className="hidden lg:block lg:w-1/2"
            style={{
              position: 'sticky',
              top: '2rem',
              alignSelf: 'flex-start',
              height: 'fit-content',
              maxHeight: 'calc(100vh - 4rem)',
              zIndex: 10,
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">
                👁️ معاينة البطاقة
              </h2>

              <div className="flex justify-center items-center min-h-[400px]">
                <div
                  ref={cardRef}
                  className="rounded-2xl shadow-2xl overflow-hidden relative"
                  style={{
                    width: `${displayWidth}px`,
                    height: `${displayHeight}px`,
                    background: selectedTemplate.style.background,
                    fontFamily: (
                      FONT_OPTIONS.find((f) => f.id === cardData.fontFamily) ||
                      FONT_OPTIONS[0]
                    ).fonts.join(', '),
                  }}
                >
                  <CardDecorations theme="colorful" size="md" />

                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center text-center z-10"
                    style={{
                      padding: isPortrait
                        ? `${3 + (cardData.spacing || 1) * 3}% 6% ${
                            2 + (cardData.spacing || 1) * 1
                          }% 6%`
                        : '6% 6% 4% 6%',
                      boxSizing: 'border-box',
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-full flex flex-col items-center justify-center"
                      style={{
                        color: selectedTemplate.style.textColor,
                        gap: `${
                          Math.min(displayWidth, displayHeight) *
                          0.06 *
                          (cardData.spacing || 1) *
                          (isPortrait ? 2 : 1.2)
                        }px`,
                      }}
                    >
                      {cardData.greeting && (
                        <div
                          className="font-bold"
                          style={{
                            fontSize: `${
                              Math.min(displayWidth, displayHeight) * 0.063
                            }px`,
                            lineHeight: '1.3',
                          }}
                        >
                          {cardData.greeting}
                        </div>
                      )}

                      {cardData.name && (
                        <div
                          className="font-black"
                          style={{
                            fontSize: `${
                              Math.min(displayWidth, displayHeight) * 0.1
                            }px`,
                            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                            lineHeight: '1.2',
                          }}
                        >
                          {cardData.name}
                        </div>
                      )}

                      {cardData.showAge && cardData.age && (
                        <div
                          className="inline-block bg-white/30 backdrop-blur-sm rounded-full"
                          style={{
                            padding: `${
                              Math.min(displayWidth, displayHeight) * 0.027
                            }px ${
                              Math.min(displayWidth, displayHeight) * 0.054
                            }px`,
                          }}
                        >
                          <div
                            className="font-bold"
                            style={{
                              fontSize: `${
                                Math.min(displayWidth, displayHeight) * 0.081
                              }px`,
                            }}
                          >
                            {cardData.age}
                          </div>
                          <div
                            style={{
                              fontSize: `${
                                Math.min(displayWidth, displayHeight) * 0.029
                              }px`,
                            }}
                          >
                            سنة
                          </div>
                        </div>
                      )}

                      {cardData.message && (
                        <div
                          style={{
                            fontSize: `${
                              Math.min(displayWidth, displayHeight) * 0.05
                            }px`,
                            lineHeight: '1.7',
                            maxWidth: '85%',
                            wordWrap: 'break-word',
                          }}
                        >
                          {cardData.message}
                        </div>
                      )}

                      {cardData.signature && (
                        <div
                          className="italic opacity-85"
                          style={{
                            fontSize: `${
                              Math.min(displayWidth, displayHeight) * 0.043
                            }px`,
                          }}
                        >
                          {cardData.signature}
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Website Link - Subtle */}
                  <div
                    className="absolute bottom-2 right-3 opacity-30 text-xs"
                    style={{
                      color: selectedTemplate.style.textColor,
                      fontSize: `${
                        Math.min(displayWidth, displayHeight) * 0.025
                      }px`,
                      fontFamily: (
                        FONT_OPTIONS.find(
                          (f) => f.id === cardData.fontFamily
                        ) || FONT_OPTIONS[0]
                      ).fonts.join(', '),
                    }}
                  >
                    miladak.com
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center text-sm text-gray-500">
                المقاس: {currentSize.width} × {currentSize.height} بكسل
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-center mb-2">
                📤 مشاركة البطاقة
              </h3>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                اختر المنصة المناسبة للمشاركة
              </p>

              {/* Social Media Buttons */}
              <div className="space-y-3 mb-4">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 px-2">
                  📱 مشاركة على السوشيال ميديا
                </p>

                <button
                  onClick={() => {
                    setShowShareModal(false);
                    shareWhatsApp();
                  }}
                  className="w-full flex items-center gap-3 p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all transform hover:scale-105"
                >
                  <span className="text-2xl">💬</span>
                  <span className="font-semibold">واتساب</span>
                </button>

                <button
                  onClick={() => {
                    setShowShareModal(false);
                    shareFacebook();
                  }}
                  className="w-full flex items-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all transform hover:scale-105"
                >
                  <span className="text-2xl">📘</span>
                  <span className="font-semibold">فيسبوك</span>
                </button>

                <button
                  onClick={() => {
                    setShowShareModal(false);
                    shareTwitter();
                  }}
                  className="w-full flex items-center gap-3 p-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl transition-all transform hover:scale-105"
                >
                  <span className="text-2xl">🐦</span>
                  <span className="font-semibold">تويتر / X</span>
                </button>
              </div>

              {/* Download & Copy Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 px-2">
                  💾 حفظ ونسخ
                </p>

                <button
                  onClick={() => {
                    setShowShareModal(false);
                    handleDownload();
                  }}
                  className="w-full flex items-center gap-3 p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all transform hover:scale-105"
                >
                  <Download size={20} />
                  <span className="font-semibold">تحميل البطاقة</span>
                </button>

                <button
                  onClick={() => {
                    setShowShareModal(false);
                    copyToClipboard();
                  }}
                  className="w-full flex items-center gap-3 p-4 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-all transform hover:scale-105"
                >
                  <Copy size={20} />
                  <span className="font-semibold">نسخ النص</span>
                </button>
              </div>

              <button
                onClick={() => setShowShareModal(false)}
                className="mt-6 w-full p-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-semibold transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                إلغاء
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
