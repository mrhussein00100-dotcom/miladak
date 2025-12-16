'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatArabicNumber } from '@/lib/formatArabic';

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export function EventCountdownCalculator() {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [countdown, setCountdown] = useState<CountdownResult | null>(null);
  const [error, setError] = useState('');

  const startCountdown = () => {
    setError('');
    
    if (!eventDate) {
      setError('يرجى إدخال تاريخ الحدث');
      return;
    }
    
    const event = new Date(eventDate);
    if (isNaN(event.getTime())) {
      setError('تاريخ غير صحيح');
      return;
    }
    
    updateCountdown(event);
  };

  const updateCountdown = (eventDate: Date) => {
    const now = new Date();
    const diff = eventDate.getTime() - now.getTime();
    const isPast = diff < 0;
    const absDiff = Math.abs(diff);
    
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);
    
    setCountdown({ days, hours, minutes, seconds, isPast });
  };

  // Live countdown update
  useEffect(() => {
    if (!countdown || !eventDate) return;
    
    const event = new Date(eventDate);
    const interval = setInterval(() => {
      updateCountdown(event);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [countdown, eventDate]);

  const handleReset = () => {
    setEventName('');
    setEventDate('');
    setCountdown(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">أدخل تفاصيل الحدث</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            label="اسم الحدث (اختياري)"
            placeholder="مثال: عيد ميلادي، الإجازة، الزفاف..."
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
          
          <Input
            type="datetime-local"
            label="تاريخ ووقت الحدث"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            error={error}
          />
          
          <div className="flex gap-4 justify-center pt-4">
            <Button onClick={startCountdown}>
              ابدأ العد التنازلي
            </Button>
            {countdown && (
              <Button variant="outline" onClick={handleReset}>
                إعادة تعيين
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {countdown && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {countdown.isPast ? '⏰ مضى على' : '⏳ الوقت المتبقي لـ'}
              {eventName ? ` ${eventName}` : ' الحدث'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <CountdownBox value={countdown.days} label="يوم" />
              <CountdownBox value={countdown.hours} label="ساعة" />
              <CountdownBox value={countdown.minutes} label="دقيقة" />
              <CountdownBox value={countdown.seconds} label="ثانية" />
            </div>
            
            {countdown.isPast && (
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <p className="text-yellow-600 dark:text-yellow-400">
                  هذا الحدث قد مضى!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl">
      <div className="text-2xl md:text-3xl font-bold text-primary font-mono">
        {formatArabicNumber(value)}
      </div>
      <div className="text-xs md:text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
