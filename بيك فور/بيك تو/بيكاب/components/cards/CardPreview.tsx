/**
 * Card Preview Component - Live preview of the birthday card
 * Enhanced with decorations and animations - Full card design
 */
'use client';

import React from 'react';
import {
  type CardTemplate,
  getTemplateDecorations,
  getTemplateAnimation,
} from '@/lib/cards/templates';
import { DecorationLayer } from './DecorationLayer';
import { AgeBadge } from './AgeBadge';
import { AnimatedGreeting } from './AnimatedGreeting';

interface CardPreviewProps {
  template: CardTemplate | null;
  name: string;
  age?: number;
  showAge: boolean;
  greeting: string;
  message: string;
  signature: string;
  fontFamily?: string;
  fontSize?: number;
  showDecorations?: boolean;
}

export function CardPreview({
  template,
  name,
  age,
  showAge,
  greeting,
  message,
  signature,
  fontFamily,
  fontSize = 18,
  showDecorations = true,
}: CardPreviewProps) {
  if (!template) {
    return (
      <div className="aspect-[4/5] bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl flex items-center justify-center shadow-xl">
        <div className="text-center text-gray-500 dark:text-gray-400 p-8">
          <div className="text-6xl mb-4 animate-bounce">🎂</div>
          <p className="text-lg font-medium">اختر تصميماً للبطاقة</p>
          <p className="text-sm mt-2 opacity-70">
            من القوالب المتاحة على اليسار
          </p>
        </div>
      </div>
    );
  }

  const displayName = name || 'الاسم';
  const displayGreeting =
    greeting || template?.defaultContent?.greeting || 'عيد ميلاد سعيد';
  const displayMessage =
    message ||
    template?.defaultContent?.message ||
    'أتمنى لك يوماً سعيداً مليئاً بالفرح والسعادة';
  const displaySignature =
    signature || template?.defaultContent?.signature || 'مع أطيب التمنيات';
  const displayEmojis = template?.defaultContent?.emojis || [
    '🎂',
    '🎉',
    '✨',
    '🎈',
    '🎁',
  ];

  // Get decorations and animation for this template with safety checks
  const decorations = template ? getTemplateDecorations(template) : [];
  const animation = template
    ? getTemplateAnimation(template)
    : {
        textEffect: 'none' as const,
        entrance: 'fade' as const,
        decorationEffect: 'pulse' as const,
        duration: 1,
      };

  return (
    <div
      className="aspect-[4/5] relative overflow-hidden transition-all duration-500 animate-scale-in shadow-2xl"
      style={{
        background: template.style.background,
        border: template.style.border || '3px solid rgba(255,255,255,0.3)',
        borderRadius: template.style.borderRadius || '24px',
        boxShadow:
          template.style.boxShadow || '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '0',
        fontFamily:
          fontFamily || template.style.fontFamily || 'Cairo, sans-serif',
        color: template.style.color,
        textAlign: template.style.textAlign || 'center',
      }}
    >
      {/* Decoration Layer */}
      {showDecorations && decorations.length > 0 && (
        <DecorationLayer decorations={decorations} />
      )}

      {/* Inner Content Container */}
      <div className="h-full flex flex-col relative z-10 p-6 md:p-8">
        {/* Top Emojis Row */}
        <div className="flex justify-center gap-2 mb-4">
          {displayEmojis.slice(0, 3).map((emoji, i) => (
            <span
              key={i}
              className="text-3xl md:text-4xl inline-block animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1.5s',
              }}
            >
              {emoji}
            </span>
          ))}
        </div>

        {/* Main Content - Fills the card */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-2">
          {/* Greeting with animation */}
          <div className="mb-6">
            <AnimatedGreeting
              text={displayGreeting}
              effect={animation.textEffect}
              color={template.style.color}
              fontSize={`${fontSize * 1.8}px`}
              fontFamily={fontFamily || template.style.fontFamily}
            />
          </div>

          {/* Decorative Line */}
          <div className="w-24 h-1 bg-current opacity-30 rounded-full mb-6" />

          {/* Name with optional age badge */}
          <div className="mb-6">
            <p
              className="font-bold animate-slide-up mb-3"
              style={{
                fontSize: `${fontSize * 1.6}px`,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {displayName}
            </p>
            {showAge && age && (
              <div className="flex justify-center mt-3">
                <AgeBadge age={age} size="medium" animated={showDecorations} />
              </div>
            )}
          </div>

          {/* Message - Larger and more prominent */}
          <p
            className="opacity-90 leading-relaxed animate-fade-in max-w-[90%] mx-auto"
            style={{
              fontSize: `${fontSize * 1.1}px`,
              animationDelay: '0.3s',
              lineHeight: '1.8',
            }}
          >
            {displayMessage}
          </p>
        </div>

        {/* Bottom Section - Signature */}
        <div className="mt-auto pt-4">
          {/* Bottom Emojis */}
          <div className="flex justify-center gap-2 mb-3">
            {displayEmojis.slice(3, 5).map((emoji, i) => (
              <span
                key={i}
                className="text-2xl inline-block animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {emoji}
              </span>
            ))}
          </div>

          {/* Signature */}
          <div
            className="pt-3 border-t border-current/20 animate-fade-in"
            style={{ animationDelay: '0.5s' }}
          >
            <p
              className="italic opacity-80 font-medium"
              style={{ fontSize: `${fontSize}px` }}
            >
              {displaySignature}
            </p>
          </div>
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-3 left-3 text-2xl opacity-50 animate-spin-slow">
        ✨
      </div>
      <div
        className="absolute top-3 right-3 text-2xl opacity-50 animate-spin-slow"
        style={{ animationDirection: 'reverse' }}
      >
        ✨
      </div>
      <div className="absolute bottom-3 left-3 text-2xl opacity-50 animate-pulse">
        🎀
      </div>
      <div
        className="absolute bottom-3 right-3 text-2xl opacity-50 animate-pulse"
        style={{ animationDelay: '0.5s' }}
      >
        🎀
      </div>
    </div>
  );
}

export default CardPreview;
