'use client';

import { useState, useRef, useCallback, TouchEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import {
  cardTemplates,
  suggestedMessages,
  categoryLabels,
  getTemplatesByCategory,
  type CardTemplate,
  type CardData,
  type CardCategory,
  type WizardStep,
} from '@/types/cards';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface CardGeneratorProps {
  filterCategory?: CardCategory | null;
}

export default function CardGenerator({ filterCategory }: CardGeneratorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [recipientName, setRecipientName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>(
    cardTemplates[0]
  );
  const [message, setMessage] = useState(suggestedMessages[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const cardRef = useRef<HTMLDivElement>(null);
  const initialPinchDistance = useRef<number>(0);
  const swipeStartX = useRef<number>(0);
  const swipeEndX = useRef<number>(0);

  const steps: WizardStep[] = [
    {
      id: 0,
      title: 'الاسم',
      description: 'أدخل اسم المُهنأ',
      icon: '👤',
      isComplete: !!recipientName,
      isActive: currentStep === 0,
    },
    {
      id: 1,
      title: 'القالب',
      description: 'اختر تصميم البطاقة',
      icon: '🎨',
      isComplete: !!selectedTemplate,
      isActive: currentStep === 1,
    },
    {
      id: 2,
      title: 'الرسالة',
      description: 'اكتب رسالة التهنئة',
      icon: '✉️',
      isComplete: !!message,
      isActive: currentStep === 2,
    },
    {
      id: 3,
      title: 'المعاينة',
      description: 'راجع وشارك',
      icon: '👁️',
      isComplete: false,
      isActive: currentStep === 3,
    },
  ];

  const filteredTemplates = filterCategory
    ? getTemplatesByCategory(filterCategory)
    : cardTemplates;

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return recipientName.trim().length > 0;
      case 1:
        return !!selectedTemplate;
      case 2:
        return message.trim().length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `birthday-card-${recipientName || 'card'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [recipientName]);

  // Pinch-to-zoom handlers for mobile preview
  const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistance.current = distance;
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && initialPinchDistance.current > 0) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = distance / initialPinchDistance.current;
      setZoomLevel((prev) => Math.min(Math.max(prev * scale, 0.5), 3));
      initialPinchDistance.current = distance;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    initialPinchDistance.current = 0;
  }, []);

  // Swipe handlers for wizard navigation
  const handleWizardSwipeStart = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      swipeStartX.current = e.touches[0].clientX;
    },
    []
  );

  const handleWizardSwipeEnd = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      swipeEndX.current = e.changedTouches[0].clientX;
      const diff = swipeStartX.current - swipeEndX.current;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        if (diff > 0 && canProceed() && currentStep < steps.length - 1) {
          // Swipe left - next step
          handleNext();
        } else if (diff < 0 && currentStep > 0) {
          // Swipe right - previous step
          handlePrev();
        }
      }
    },
    [currentStep, canProceed]
  );

  const handleShare = useCallback(
    async (platform: 'whatsapp' | 'facebook' | 'twitter' | 'copy') => {
      const shareText = `🎂 بطاقة تهنئة لـ ${recipientName}\n${message}`;
      const shareUrl = window.location.href;

      switch (platform) {
        case 'whatsapp':
          window.open(
            `https://wa.me/?text=${encodeURIComponent(
              shareText + '\n' + shareUrl
            )}`,
            '_blank'
          );
          break;
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              shareUrl
            )}&quote=${encodeURIComponent(shareText)}`,
            '_blank'
          );
          break;
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              shareText
            )}&url=${encodeURIComponent(shareUrl)}`,
            '_blank'
          );
          break;
        case 'copy':
          await navigator.clipboard.writeText(shareUrl);
          alert('تم نسخ الرابط!');
          break;
      }
      setShowShareModal(false);
    },
    [recipientName, message]
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {steps.map((step, index) => (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center"
            >
              <button
                onClick={() => index <= currentStep && setCurrentStep(index)}
                disabled={index > currentStep}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all',
                  index <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                  index < currentStep && 'cursor-pointer hover:scale-110'
                )}
              >
                {step.icon}
              </button>
              <span
                className={cn(
                  'mt-2 text-xs font-medium hidden sm:block',
                  index <= currentStep
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-background border border-border rounded-2xl p-6 md:p-8"
          onTouchStart={handleWizardSwipeStart}
          onTouchEnd={handleWizardSwipeEnd}
        >
          {/* Step 0: Name Input */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">👤 اسم المُهنأ</h2>
                <p className="text-muted-foreground">
                  أدخل اسم الشخص الذي تريد تهنئته
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <Input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="مثال: أحمد"
                  className="text-center text-lg h-14"
                  maxLength={30}
                />
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {recipientName.length}/30 حرف
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Template Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">🎨 اختر القالب</h2>
                <p className="text-muted-foreground">
                  اختر تصميم البطاقة المناسب
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={cn(
                      'relative aspect-[4/5] rounded-xl overflow-hidden transition-all duration-200',
                      'hover:scale-105 hover:shadow-lg',
                      selectedTemplate.id === template.id &&
                        'ring-4 ring-primary ring-offset-2'
                    )}
                    style={{ background: template.background }}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <span className="text-4xl mb-2">{template.preview}</span>
                      <span className="text-sm font-medium">
                        {template.name}
                      </span>
                      <span className="text-xs opacity-70">
                        {categoryLabels[template.category]}
                      </span>
                    </div>
                    {selectedTemplate.id === template.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Message */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">✉️ رسالة التهنئة</h2>
                <p className="text-muted-foreground">
                  اختر رسالة جاهزة أو اكتب رسالتك
                </p>
              </div>

              <div className="space-y-4">
                {/* Suggested Messages */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedMessages.slice(0, 4).map((msg, i) => (
                    <button
                      key={i}
                      onClick={() => setMessage(msg)}
                      className={cn(
                        'px-3 py-2 rounded-full text-sm transition-all',
                        message === msg
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      )}
                    >
                      {msg.slice(0, 25)}...
                    </button>
                  ))}
                </div>

                {/* Custom Message */}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  className="w-full h-32 p-4 rounded-xl bg-muted border-0 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  maxLength={150}
                />
                <p className="text-xs text-muted-foreground text-center">
                  {message.length}/150 حرف
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">👁️ معاينة البطاقة</h2>
                <p className="text-muted-foreground">
                  راجع البطاقة ثم حملها أو شاركها
                </p>
              </div>

              {/* Card Preview */}
              <div className="flex justify-center">
                <div
                  ref={cardRef}
                  className="w-full max-w-sm aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
                  style={{ background: selectedTemplate.background }}
                >
                  <div
                    className="h-full flex flex-col items-center justify-center p-6 text-center"
                    style={{ color: selectedTemplate.textColor }}
                  >
                    {/* Decorations */}
                    <div className="flex gap-2 mb-4">
                      {selectedTemplate.decorations?.map((d, i) => (
                        <span
                          key={i}
                          className="text-3xl animate-bounce"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        >
                          {d}
                        </span>
                      ))}
                    </div>

                    {/* Name */}
                    <h3 className="text-3xl font-bold mb-4">{recipientName}</h3>

                    {/* Message */}
                    <p className="text-lg leading-relaxed mb-6">{message}</p>

                    {/* Footer */}
                    <div className="mt-auto opacity-70 text-sm">
                      miladak.com 🎂
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      جاري التحميل...
                    </>
                  ) : (
                    <>
                      <span>📥</span>
                      تحميل البطاقة
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2"
                >
                  <span>📤</span>
                  مشاركة
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFullPreview(true)}
                  className="flex items-center gap-2 md:hidden"
                >
                  <span>🔍</span>
                  تكبير
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <svg
            className="w-4 h-4 rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          السابق
        </Button>

        {currentStep < steps.length - 1 && (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2"
          >
            التالي
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        )}
      </div>

      {/* Full Screen Preview Modal - Mobile */}
      <AnimatePresence>
        {showFullPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 md:hidden"
            onClick={() => setShowFullPreview(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowFullPreview(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white"
            >
              ✕
            </button>

            {/* Zoom Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 bg-white/20 rounded-full px-4 py-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
                }}
                className="w-8 h-8 flex items-center justify-center text-white text-xl"
              >
                −
              </button>
              <span className="text-white text-sm min-w-[50px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomLevel((prev) => Math.min(prev + 0.25, 3));
                }}
                className="w-8 h-8 flex items-center justify-center text-white text-xl"
              >
                +
              </button>
            </div>

            {/* Card Preview */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: zoomLevel }}
              className="w-[80vw] max-w-sm aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: selectedTemplate.background }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="h-full flex flex-col items-center justify-center p-6 text-center"
                style={{ color: selectedTemplate.textColor }}
              >
                <div className="flex gap-2 mb-4">
                  {selectedTemplate.decorations?.map((d, i) => (
                    <span
                      key={i}
                      className="text-3xl animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <h3 className="text-3xl font-bold mb-4">{recipientName}</h3>
                <p className="text-lg leading-relaxed mb-6">{message}</p>
                <div className="mt-auto opacity-70 text-sm">miladak.com 🎂</div>
              </div>
            </motion.div>

            {/* Hint */}
            <p className="absolute top-16 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              استخدم إصبعين للتكبير والتصغير
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-center mb-6">
                📤 مشاركة البطاقة
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-500/10 hover:bg-green-500/20 transition-colors"
                >
                  <span className="text-3xl">💬</span>
                  <span className="text-sm font-medium">واتساب</span>
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                >
                  <span className="text-3xl">📘</span>
                  <span className="text-sm font-medium">فيسبوك</span>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 transition-colors"
                >
                  <span className="text-3xl">🐦</span>
                  <span className="text-sm font-medium">تويتر</span>
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                >
                  <span className="text-3xl">🔗</span>
                  <span className="text-sm font-medium">نسخ الرابط</span>
                </button>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full mt-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
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
