'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import ChineseZodiacCard from './ChineseZodiacCard';
import BirthstoneCard from './BirthstoneCard';
import BirthFlowerCard from './BirthFlowerCard';
import HistoricalEventCard from './HistoricalEventCard';
import CelebrityCard from './CelebrityCard';

/**
 * Enhanced Age Calculator Component
 * Feature: frontend-database-integration
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6
 */

interface EnhancedBirthInfo {
  age: {
    years: number;
    months: number;
    days: number;
    totalDays: number;
  };
  lifeStats: {
    heartbeats: number;
    breaths: number;
    sleepHours: number;
  };
  chineseZodiac: {
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
  birthstone: { name: string; description: string } | null;
  birthFlower: { name: string; description: string } | null;
  luckyColor: { name: string; hex: string } | null;
  dailyEvents: Array<{ title: string; description: string; category: string }>;
  famousBirthdays: Array<{
    name: string;
    profession: string;
    birth_year: number;
  }>;
}

export default function EnhancedAgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EnhancedBirthInfo | null>(null);

  const handleCalculate = async () => {
    if (!birthDate) {
      setError('يرجى إدخال تاريخ الميلاد');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/birthday-info/enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthDate }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'حدث خطأ في حساب العمر');
      }
    } catch {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          احسب عمرك واكتشف معلومات مميزة عن يوم ميلادك
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="flex-1"
            max={new Date().toISOString().split('T')[0]}
          />
          <Button onClick={handleCalculate} disabled={loading}>
            {loading ? 'جاري الحساب...' : 'احسب عمري'}
          </Button>
        </div>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </Card>

      {/* Results Section */}
      {result && (
        <div className="space-y-8">
          {/* Age Result */}
          <Card className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <h3 className="text-xl font-bold text-center mb-4">عمرك</h3>
            <div className="text-center">
              <p className="text-4xl font-bold">
                {result.age.years} سنة و {result.age.months} شهر و{' '}
                {result.age.days} يوم
              </p>
              <p className="mt-2 opacity-80">
                إجمالي {result.age.totalDays.toLocaleString('ar-EG')} يوم
              </p>
            </div>
          </Card>

          {/* Chinese Zodiac */}
          {result.chineseZodiac && (
            <ChineseZodiacCard zodiac={result.chineseZodiac} />
          )}

          {/* Monthly Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result.birthstone && (
              <BirthstoneCard
                birthstone={{
                  name: result.birthstone.name,
                  properties: result.birthstone.description || '',
                  color: '',
                  meaning: '',
                }}
              />
            )}
            {result.birthFlower && (
              <BirthFlowerCard
                birthFlower={{
                  name: result.birthFlower.name,
                  meaning: result.birthFlower.description || '',
                  symbolism: '',
                }}
              />
            )}
            {result.luckyColor && (
              <Card className="p-4">
                <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">
                  🎨 لونك المحظوظ
                </h4>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: result.luckyColor.hex }}
                  />
                  <span className="text-gray-600 dark:text-gray-300">
                    {result.luckyColor.name}
                  </span>
                </div>
              </Card>
            )}
          </div>

          {/* Historical Events */}
          {result.dailyEvents.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                📅 أحداث تاريخية في يوم ميلادك
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.dailyEvents.map((event, index) => (
                  <HistoricalEventCard
                    key={index}
                    event={{
                      id: index,
                      title: event.title,
                      description: event.description,
                      year: 0,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Famous Birthdays */}
          {result.famousBirthdays.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                🌟 مشاهير ولدوا في نفس يومك
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.famousBirthdays.map((celebrity, index) => (
                  <CelebrityCard
                    key={index}
                    celebrity={{
                      id: index,
                      name: celebrity.name,
                      profession: celebrity.profession,
                      birth_year: celebrity.birth_year,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
