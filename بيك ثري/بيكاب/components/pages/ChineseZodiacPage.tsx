'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import ChineseZodiacCard from '@/components/enhanced/ChineseZodiacCard';

/**
 * Chinese Zodiac Page Component
 * Feature: frontend-database-integration
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */

const ZODIAC_ANIMALS = [
  {
    animal: 'الفأر',
    animalEn: 'Rat',
    emoji: '🐀',
    years: [1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020],
  },
  {
    animal: 'الثور',
    animalEn: 'Ox',
    emoji: '🐂',
    years: [1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021],
  },
  {
    animal: 'النمر',
    animalEn: 'Tiger',
    emoji: '🐅',
    years: [1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022],
  },
  {
    animal: 'الأرنب',
    animalEn: 'Rabbit',
    emoji: '🐇',
    years: [1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023],
  },
  {
    animal: 'التنين',
    animalEn: 'Dragon',
    emoji: '🐉',
    years: [1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024],
  },
  {
    animal: 'الأفعى',
    animalEn: 'Snake',
    emoji: '🐍',
    years: [1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025],
  },
  {
    animal: 'الحصان',
    animalEn: 'Horse',
    emoji: '🐎',
    years: [1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026],
  },
  {
    animal: 'الماعز',
    animalEn: 'Goat',
    emoji: '🐐',
    years: [1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027],
  },
  {
    animal: 'القرد',
    animalEn: 'Monkey',
    emoji: '🐒',
    years: [1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028],
  },
  {
    animal: 'الديك',
    animalEn: 'Rooster',
    emoji: '🐓',
    years: [1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029],
  },
  {
    animal: 'الكلب',
    animalEn: 'Dog',
    emoji: '🐕',
    years: [1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030],
  },
  {
    animal: 'الخنزير',
    animalEn: 'Pig',
    emoji: '🐖',
    years: [1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031],
  },
];

interface ZodiacData {
  animal: string;
  animalEn: string;
  element: string;
  elementEn: string;
  traits: string[];
  description: string;
  compatibility: string[];
  luckyNumbers: number[];
  luckyColors: string[];
}

export default function ChineseZodiacPageClient() {
  const [year, setYear] = useState('');
  const [result, setResult] = useState<ZodiacData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateZodiac = async () => {
    if (!year) {
      setError('يرجى إدخال سنة الميلاد');
      return;
    }

    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
      setError('السنة يجب أن تكون بين 1900 و 2100');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/chinese-zodiac?year=${yearNum}`);
      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error?.message || 'حدث خطأ');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            🐉 البرج الصيني
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            اكتشف برجك الصيني بناءً على سنة ميلادك وتعرف على صفاتك وتوافقك مع
            الآخرين
          </p>
        </div>

        {/* Calculator */}
        <Card className="p-6 mb-12 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-center mb-4">
            احسب برجك الصيني
          </h2>
          <div className="flex gap-3">
            <Input
              type="number"
              placeholder="أدخل سنة ميلادك"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="1900"
              max="2100"
              className="flex-1"
            />
            <Button onClick={calculateZodiac} disabled={loading}>
              {loading ? 'جاري...' : 'احسب'}
            </Button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </Card>

        {/* Result */}
        {result && (
          <div className="mb-12">
            <ChineseZodiacCard zodiac={result} />
          </div>
        )}

        {/* All Zodiac Animals Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            الأبراج الصينية الاثني عشر
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ZODIAC_ANIMALS.map((zodiac) => (
              <Card
                key={zodiac.animal}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setYear(zodiac.years[zodiac.years.length - 1].toString());
                  calculateZodiac();
                }}
              >
                <div className="text-center">
                  <div className="text-5xl mb-2">{zodiac.emoji}</div>
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    {zodiac.animal}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {zodiac.animalEn}
                  </p>
                  <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                    {zodiac.years.slice(-3).join('، ')}...
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
