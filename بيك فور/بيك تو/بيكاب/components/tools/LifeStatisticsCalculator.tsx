'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatArabicNumber } from '@/lib/formatArabic';
import { calculateLifeStats } from '@/lib/calculations/ageCalculations';
import type { LifeStats } from '@/types';

export function LifeStatisticsCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [stats, setStats] = useState<LifeStats | null>(null);
  const [totalDays, setTotalDays] = useState(0);
  const [error, setError] = useState('');

  const calculateStats = () => {
    setError('');
    
    if (!birthDate) {
      setError('يرجى إدخال تاريخ الميلاد');
      return;
    }
    
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) {
      setError('تاريخ غير صحيح');
      return;
    }
    
    const now = new Date();
    if (birth > now) {
      setError('لا يمكن أن يكون تاريخ الميلاد في المستقبل');
      return;
    }
    
    const diffMs = now.getTime() - birth.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    setTotalDays(days);
    setStats(calculateLifeStats(days));
  };

  const handleReset = () => {
    setBirthDate('');
    setStats(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">أدخل تاريخ ميلادك</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="date"
            label="تاريخ الميلاد"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            error={error}
            max={new Date().toISOString().split('T')[0]}
          />
          
          <div className="flex gap-4 justify-center pt-4">
            <Button onClick={calculateStats}>
              اكتشف إحصاءاتك
            </Button>
            {stats && (
              <Button variant="outline" onClick={handleReset}>
                إعادة تعيين
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              🎉 إحصاءات حياتك الممتعة
            </CardTitle>
            <p className="text-center text-muted-foreground">
              خلال {formatArabicNumber(totalDays)} يوم من حياتك
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <StatBox emoji="❤️" label="نبضة قلب" value={stats.heartbeats} color="red" />
              <StatBox emoji="💨" label="نفس" value={stats.breaths} color="blue" />
              <StatBox emoji="😴" label="يوم نوم" value={stats.sleepDays} color="purple" />
              <StatBox emoji="🍽️" label="وجبة" value={stats.meals} color="green" />
              <StatBox emoji="👣" label="خطوة" value={stats.stepsWalked} color="yellow" />
              <StatBox emoji="👁️" label="رمشة عين" value={stats.blinks} color="indigo" />
              <StatBox emoji="😂" label="ضحكة" value={stats.laughs} color="pink" />
              <StatBox emoji="💧" label="لتر ماء" value={stats.waterLiters} color="cyan" />
              <StatBox emoji="🍕" label="كجم طعام" value={stats.foodKg} color="orange" />
              <StatBox emoji="🎬" label="فيلم" value={stats.moviesWatched} color="violet" />
              <StatBox emoji="💭" label="حلم" value={stats.dreams} color="teal" />
              <StatBox emoji="💬" label="كلمة" value={stats.wordsSpoken} color="rose" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatBox({ 
  emoji, 
  label, 
  value, 
  color 
}: { 
  emoji: string; 
  label: string; 
  value: number; 
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    pink: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    violet: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
    teal: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
    rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
  };

  return (
    <div className={`text-center p-4 rounded-xl ${colorClasses[color]}`}>
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="text-lg font-bold">{formatArabicNumber(value)}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
