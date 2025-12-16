'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import HistoricalEventCard from '@/components/enhanced/HistoricalEventCard';
import CelebrityCard from '@/components/enhanced/CelebrityCard';
import BirthstoneCard from '@/components/enhanced/BirthstoneCard';
import BirthFlowerCard from '@/components/enhanced/BirthFlowerCard';
import Link from 'next/link';

/**
 * Date Detail Page Component
 * Feature: frontend-database-integration
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

interface Event {
  id: number;
  title: string;
  description: string;
  year: number;
}

interface Celebrity {
  id: number;
  name: string;
  profession: string;
  birth_year: number;
}

interface MonthlyInfo {
  birthstone: {
    name: string;
    properties: string;
    color: string;
    meaning: string;
  };
  birthFlower: { name: string; meaning: string; symbolism: string };
  luckyColor: { color: string; meaning: string; hex: string };
}

const MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

interface DateDetailPageProps {
  month: number;
  day: number;
}

export default function DateDetailPageClient({
  month,
  day,
}: DateDetailPageProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [monthlyInfo, setMonthlyInfo] = useState<MonthlyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [eventsRes, celebritiesRes, monthlyRes] = await Promise.all([
          fetch(`/api/daily-events/${month}/${day}`),
          fetch(`/api/daily-birthdays/${month}/${day}`),
          fetch(`/api/monthly-info/${month}`),
        ]);

        const [eventsData, celebritiesData, monthlyData] = await Promise.all([
          eventsRes.json(),
          celebritiesRes.json(),
          monthlyRes.json(),
        ]);

        if (eventsData.success) setEvents(eventsData.data.events || []);
        if (celebritiesData.success)
          setCelebrities(celebritiesData.data.celebrities || []);
        if (monthlyData.success) setMonthlyInfo(monthlyData.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month, day]);

  const monthName = MONTHS[month - 1] || '';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-2">
            {day} {monthName}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            اكتشف ما يميز هذا اليوم
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {events.length}
            </div>
            <div className="text-sm text-gray-500">حدث تاريخي</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-amber-600">
              {celebrities.length}
            </div>
            <div className="text-sm text-gray-500">مشهور</div>
          </Card>
        </div>

        {/* Historical Events */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            📜 أحداث تاريخية
          </h2>
          {events.length > 0 ? (
            <div className="space-y-3">
              {events.slice(0, 10).map((event) => (
                <HistoricalEventCard key={event.id} event={event} />
              ))}
              {events.length > 10 && (
                <Link
                  href="/historical-events"
                  className="block text-center text-blue-600 hover:underline"
                >
                  عرض المزيد ({events.length - 10} حدث آخر)
                </Link>
              )}
            </div>
          ) : (
            <Card className="p-6 text-center text-gray-500">
              لا توجد أحداث مسجلة لهذا التاريخ
            </Card>
          )}
        </section>

        {/* Celebrities */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            ⭐ مشاهير ولدوا في هذا اليوم
          </h2>
          {celebrities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {celebrities.slice(0, 10).map((celebrity) => (
                <CelebrityCard key={celebrity.id} celebrity={celebrity} />
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center text-gray-500">
              لا يوجد مشاهير مسجلين لهذا التاريخ
            </Card>
          )}
        </section>

        {/* Monthly Info */}
        {monthlyInfo && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              💎 معلومات شهر {monthName}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {monthlyInfo.birthstone && (
                <BirthstoneCard birthstone={monthlyInfo.birthstone} />
              )}
              {monthlyInfo.birthFlower && (
                <BirthFlowerCard birthFlower={monthlyInfo.birthFlower} />
              )}
            </div>
          </section>
        )}

        {/* CTA */}
        <Card className="p-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h3 className="text-2xl font-bold mb-4">هل هذا يوم ميلادك؟</h3>
          <p className="mb-6">احسب عمرك واكتشف المزيد من المعلومات الشيقة</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            احسب عمرك الآن
          </Link>
        </Card>
      </div>
    </div>
  );
}
