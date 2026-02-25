'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ALL_TEMPLATES,
  CardTemplate,
  TEMPLATE_CATEGORIES,
  TemplateCategory,
} from '@/lib/cards/templates';

interface CardData {
  recipientName: string;
  message: string;
  age: string;
  templateId: string;
}

export default function SimpleCardGenerator() {
  const [cardData, setCardData] = useState<CardData>({
    recipientName: '',
    message: '',
    age: '',
    templateId: ALL_TEMPLATES[0]?.id || '',
  });
  const [selectedCategory, setSelectedCategory] = useState<
    TemplateCategory | 'all'
  >('all');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const selectedTemplate =
    ALL_TEMPLATES.find((t) => t.id === cardData.templateId) || ALL_TEMPLATES[0];
  const filteredTemplates =
    selectedCategory === 'all'
      ? ALL_TEMPLATES
      : ALL_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleInputChange = (field: keyof CardData, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = useCallback(async () => {
    if (!cardRef.current) return;

    setIsSaving(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `birthday-card-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error saving card:', error);
      alert('حدث خطأ أثناء حفظ البطاقة');
    } finally {
      setIsSaving(false);
    }
  }, []);

  const handleShare = useCallback(async () => {
    const text = `🎂 ${
      cardData.recipientName
        ? `عيد ميلاد سعيد ${cardData.recipientName}!`
        : 'عيد ميلاد سعيد!'
    }\n${cardData.message || selectedTemplate.defaultContent.message}`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (e) {
        // User cancelled
      }
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    }
  }, [cardData, selectedTemplate]);

  // Card Preview Component
  const CardPreview = () => (
    <div
      ref={cardRef}
      className="relative w-full max-w-md mx-auto aspect-[4/5] overflow-hidden"
      style={{
        background: selectedTemplate.style.background,
        border: selectedTemplate.style.border,
        borderRadius: selectedTemplate.style.borderRadius,
        boxShadow: selectedTemplate.style.boxShadow,
        fontFamily: selectedTemplate.style.fontFamily,
        color: selectedTemplate.style.color,
        padding: selectedTemplate.style.padding,
      }}
    >
      <div className="h-full flex flex-col items-center justify-center text-center gap-4">
        {/* Emojis */}
        <div className="text-4xl">
          {selectedTemplate.defaultContent.emojis.join(' ')}
        </div>

        {/* Greeting */}
        <h2 className="text-2xl md:text-3xl font-bold">
          {cardData.recipientName
            ? `عيد ميلاد سعيد ${cardData.recipientName}!`
            : selectedTemplate.defaultContent.greeting}
        </h2>

        {/* Age Badge */}
        {cardData.age && (
          <div className="text-5xl font-bold opacity-80">{cardData.age}</div>
        )}

        {/* Message */}
        <p className="text-lg opacity-90 max-w-xs">
          {cardData.message || selectedTemplate.defaultContent.message}
        </p>

        {/* Signature */}
        <p className="text-sm opacity-70 mt-4">
          {selectedTemplate.defaultContent.signature}
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Mobile Preview Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2"
        >
          {showPreview ? '✏️ العودة للتعديل' : '👁️ معاينة البطاقة'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Panel - Hidden on mobile when preview is shown */}
        <div className={`space-y-6 ${showPreview ? 'hidden lg:block' : ''}`}>
          {/* Step 1: Choose Template */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                1
              </span>
              اختر التصميم
            </h3>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              {TEMPLATE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {cat.nameAr}
                </button>
              ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleInputChange('templateId', template.id)}
                  className={`aspect-square rounded-lg p-2 transition-all ${
                    cardData.templateId === template.id
                      ? 'ring-2 ring-primary ring-offset-2'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    background: template.style.background,
                    border: template.style.border,
                  }}
                >
                  <span className="text-lg">
                    {template.defaultContent.emojis[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Customize */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                2
              </span>
              خصص البطاقة
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  اسم صاحب العيد
                </label>
                <input
                  type="text"
                  value={cardData.recipientName}
                  onChange={(e) =>
                    handleInputChange('recipientName', e.target.value)
                  }
                  placeholder="مثال: أحمد"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  العمر (اختياري)
                </label>
                <input
                  type="number"
                  value={cardData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="مثال: 25"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  رسالة التهنئة
                </label>
                <textarea
                  value={cardData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Save & Share */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                3
              </span>
              احفظ وشارك
            </h3>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    جاري الحفظ...
                  </>
                ) : (
                  <>💾 حفظ الصورة</>
                )}
              </button>

              <button
                onClick={handleShare}
                className="flex-1 py-3 px-4 bg-green-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90"
              >
                📤 مشاركة
              </button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className={`${!showPreview ? 'hidden lg:block' : ''}`}>
          <div className="sticky top-4">
            <h3 className="font-bold mb-4 text-center lg:text-right">
              👁️ معاينة البطاقة
            </h3>
            <motion.div
              key={cardData.templateId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <CardPreview />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
