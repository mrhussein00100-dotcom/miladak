'use client';

import { Card } from '@/components/ui/Card';
import Link from 'next/link';

/**
 * Your Chinese Zodiac Section Component
 * Feature: frontend-database-integration
 * Requirements: 7.3
 */

const ZODIAC_ANIMALS = [
  { animal: 'الفأر', emoji: '🐀' },
  { animal: 'الثور', emoji: '🐂' },
  { animal: 'النمر', emoji: '🐅' },
  { animal: 'الأرنب', emoji: '🐇' },
  { animal: 'التنين', emoji: '🐉' },
  { animal: 'الأفعى', emoji: '🐍' },
  { animal: 'الحصان', emoji: '🐎' },
  { animal: 'الماعز', emoji: '🐐' },
  { animal: 'القرد', emoji: '🐒' },
  { animal: 'الديك', emoji: '🐓' },
  { animal: 'الكلب', emoji: '🐕' },
  { animal: 'الخنزير', emoji: '🐖' },
];

function getZodiacForYear(year: number) {
  const index = (year - 4) % 12;
  return ZODIAC_ANIMALS[index];
}

export default function YourChineseZodiacSection() {
  const currentYear = new Date().getFullYear();
  const currentZodiac = getZodiacForYear(currentYear);

  return (
    <section className="py-12 bg-red-50 dark:bg-red-900/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            🐉 البرج الصيني لعام {currentYear}
          </h2>
          <Link
            href="/chinese-zodiac"
            className="text-red-600 hover:underline text-sm"
          >
            اكتشف برجك
          </Link>
        </div>
        <Card className="p-6 bg-gradient-to-r from-red-100 to-yellow-100 dark:from-red-900/30 dark:to-yellow-900/30">
          <div className="flex items-center gap-6">
            <div className="text-7xl">{currentZodiac.emoji}</div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                عام {currentZodiac.animal}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {currentYear} هو عام {currentZodiac.animal} في التقويم الصيني
              </p>
              <Link
                href="/chinese-zodiac"
                className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                اكتشف برجك الصيني
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
