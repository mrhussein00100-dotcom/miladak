'use client';

import { Card } from '@/components/ui/Card';

/**
 * Chinese Zodiac Card Component
 * Feature: frontend-database-integration
 * Requirements: 1.1, 3.3
 */

interface ChineseZodiacCardProps {
  zodiac: {
    animal: string;
    animalEn: string;
    element: string;
    elementEn: string;
    traits: string[];
    description: string;
    compatibility: string[];
    luckyNumbers: number[];
    luckyColors: string[];
  };
}

const ZODIAC_EMOJIS: Record<string, string> = {
  الفأر: '🐀',
  الثور: '🐂',
  النمر: '🐅',
  الأرنب: '🐇',
  التنين: '🐉',
  الأفعى: '🐍',
  الحصان: '🐎',
  الماعز: '🐐',
  القرد: '🐒',
  الديك: '🐓',
  الكلب: '🐕',
  الخنزير: '🐖',
};

export default function ChineseZodiacCard({ zodiac }: ChineseZodiacCardProps) {
  const emoji = ZODIAC_EMOJIS[zodiac.animal] || '🔮';

  return (
    <Card className="p-6 bg-gradient-to-br from-red-50 to-yellow-50 dark:from-red-900/20 dark:to-yellow-900/20">
      <div className="flex items-start gap-4">
        <div className="text-6xl">{emoji}</div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            برجك الصيني: {zodiac.animal}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {zodiac.animalEn} • عنصر {zodiac.element} ({zodiac.elementEn})
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {zodiac.description}
          </p>

          {/* Traits */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
              صفاتك:
            </h4>
            <div className="flex flex-wrap gap-2">
              {zodiac.traits.map((trait, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Compatibility */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
              متوافق مع:
            </h4>
            <div className="flex flex-wrap gap-2">
              {zodiac.compatibility.map((animal, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm"
                >
                  {ZODIAC_EMOJIS[animal] || ''} {animal}
                </span>
              ))}
            </div>
          </div>

          {/* Lucky Numbers & Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
                أرقامك المحظوظة:
              </h4>
              <div className="flex gap-2">
                {zodiac.luckyNumbers.map((num, index) => (
                  <span
                    key={index}
                    className="w-8 h-8 flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full font-bold"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
                ألوانك المحظوظة:
              </h4>
              <div className="flex flex-wrap gap-1">
                {zodiac.luckyColors.map((color, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
