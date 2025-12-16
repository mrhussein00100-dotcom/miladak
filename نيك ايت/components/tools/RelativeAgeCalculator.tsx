'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface RelativeAgeResult {
  person1Age: { years: number; months: number; days: number };
  person2Age: { years: number; months: number; days: number };
  difference: { years: number; months: number; days: number };
  olderPerson: 1 | 2;
  percentageOlder: number;
}

function calculateRelativeAge(date1: Date, date2: Date): RelativeAgeResult {
  const now = new Date();

  const getAge = (birthDate: Date) => {
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    return { years, months, days };
  };

  const age1 = getAge(date1);
  const age2 = getAge(date2);

  const totalDays1 = Math.floor(
    (now.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalDays2 = Math.floor(
    (now.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24)
  );

  const olderPerson = totalDays1 > totalDays2 ? 1 : 2;
  const diffDays = Math.abs(totalDays1 - totalDays2);

  const diffYears = Math.floor(diffDays / 365);
  const diffMonths = Math.floor((diffDays % 365) / 30);
  const diffDaysRemainder = diffDays % 30;

  const percentageOlder = Math.round(
    (Math.max(totalDays1, totalDays2) / Math.min(totalDays1, totalDays2) - 1) *
      100
  );

  return {
    person1Age: age1,
    person2Age: age2,
    difference: {
      years: diffYears,
      months: diffMonths,
      days: diffDaysRemainder,
    },
    olderPerson,
    percentageOlder,
  };
}

export function RelativeAgeCalculator() {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [result, setResult] = useState<RelativeAgeResult | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    setError('');

    if (!date1 || !date2) {
      setError('يرجى إدخال تاريخي الميلاد');
      return;
    }

    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const now = new Date();

    if (d1 > now || d2 > now) {
      setError('لا يمكن أن يكون تاريخ الميلاد في المستقبل');
      return;
    }

    setResult(calculateRelativeAge(d1, d2));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>أدخل تاريخي الميلاد</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                الشخص الأول
              </label>
              <Input
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                الشخص الثاني
              </label>
              <Input
                type="date"
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button onClick={handleCalculate} className="w-full">
            احسب الفرق
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">عمر الشخص الأول</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold gradient-text">
                {result.person1Age.years} سنة
              </p>
              <p className="text-muted-foreground">
                {result.person1Age.months} شهر و {result.person1Age.days} يوم
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">عمر الشخص الثاني</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold gradient-text">
                {result.person2Age.years} سنة
              </p>
              <p className="text-muted-foreground">
                {result.person2Age.months} شهر و {result.person2Age.days} يوم
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">فرق العمر</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                {result.difference.years} سنة
              </p>
              <p className="text-muted-foreground">
                {result.difference.months} شهر و {result.difference.days} يوم
              </p>
              <p className="text-sm mt-2">
                الشخص {result.olderPerson === 1 ? 'الأول' : 'الثاني'} أكبر بـ{' '}
                {result.percentageOlder}%
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
