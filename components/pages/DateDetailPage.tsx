'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import HistoricalEventCard from '@/components/enhanced/HistoricalEventCard';
import CelebrityCard from '@/components/enhanced/CelebrityCard';
import BirthstoneCard from '@/components/enhanced/BirthstoneCard';
import BirthFlowerCard from '@/components/enhanced/BirthFlowerCard';
import Link from 'next/link';
import SocialShare from '@/components/SocialShare';

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
  } | null;
  birthFlower: { name: string; meaning: string; symbolism: string } | null;
  luckyColor: { color: string; meaning: string; hex: string } | null;
  facts: string[];
  zodiacSigns: string[];
  events: string[];
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
        // Load static data
        const { dailyEvents: staticEvents, dailyBirthdays: staticBirthdays } = await import('@/lib/dailyData');
        const currentStaticEvents = staticEvents.filter(e => e.day === day && e.month === month);
        const currentStaticBirthdays = staticBirthdays.filter(b => b.day === day && b.month === month);

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

        if (eventsData.success) {
          const apiEvents = eventsData.data.events || [];
          const mergedEvents = [...apiEvents];
          
          currentStaticEvents.forEach((staticEvent, index) => {
            if (!mergedEvents.some((e: any) => e.title === staticEvent.title)) {
              mergedEvents.push({
                id: -1 * (index + 1), // Negative ID for static data
                title: staticEvent.title,
                description: staticEvent.description,
                year: staticEvent.year || 0,
                category: staticEvent.category
              });
            }
          });
          setEvents(mergedEvents);
        } else {
          setEvents(currentStaticEvents.map((e, i) => ({
            id: -1 * (i + 1),
            title: e.title,
            description: e.description,
            year: e.year || 0,
            category: e.category
          })));
        }

        if (celebritiesData.success) {
          const apiCelebrities = celebritiesData.data.celebrities || [];
          const mergedCelebrities = [...apiCelebrities];

          currentStaticBirthdays.forEach((staticCeleb, index) => {
            if (!mergedCelebrities.some((c: any) => c.name === staticCeleb.name)) {
              mergedCelebrities.push({
                id: -1 * (index + 1),
                name: staticCeleb.name,
                profession: staticCeleb.profession,
                birth_year: staticCeleb.birthYear
              });
            }
          });
          setCelebrities(mergedCelebrities);
        } else {
           setCelebrities(currentStaticBirthdays.map((c, i) => ({
             id: -1 * (i + 1),
             name: c.name,
             profession: c.profession,
             birth_year: c.birthYear
           })));
        }

        if (monthlyData.success) setMonthlyInfo(monthlyData.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        // Fallback to static data
        const { dailyEvents, dailyBirthdays } = await import('@/lib/dailyData');
        const currentStaticEvents = dailyEvents.filter(e => e.day === day && e.month === month);
        const currentStaticBirthdays = dailyBirthdays.filter(b => b.day === day && b.month === month);

        setEvents(currentStaticEvents.map((e, i) => ({
          id: -1 * (i + 1),
          title: e.title,
          description: e.description,
          year: e.year || 0,
          category: e.category
        })));

        setCelebrities(currentStaticBirthdays.map((c, i) => ({
          id: -1 * (i + 1),
          name: c.name,
          profession: c.profession,
          birth_year: c.birthYear
        })));
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
            اكتشف أسرار وما يميز هذا اليوم
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-blue-600">
              {events.length}
            </div>
            <div className="text-sm text-gray-500">حدث تاريخي</div>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-amber-600">
              {celebrities.length}
            </div>
            <div className="text-sm text-gray-500">مشهور</div>
          </Card>
          {monthlyInfo?.zodiacSigns && monthlyInfo.zodiacSigns.length > 0 && (
             <Card className="p-4 text-center hover:shadow-md transition-shadow col-span-2 md:col-span-2">
               <div className="text-lg font-bold text-purple-600">
                 {monthlyInfo.zodiacSigns.join(' / ')}
               </div>
               <div className="text-sm text-gray-500">الأبراج الفلكية</div>
             </Card>
          )}
        </div>

        {/* Monthly Info Section - Always visible now */}
        {monthlyInfo && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">💎</span>
              معلومات شهر {monthName}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {monthlyInfo.birthstone && (
                <BirthstoneCard birthstone={monthlyInfo.birthstone} />
              )}
              {monthlyInfo.birthFlower && (
                <BirthFlowerCard birthFlower={monthlyInfo.birthFlower} />
              )}
            </div>

            {/* Lucky Color & Facts */}
            <div className="grid md:grid-cols-2 gap-6">
              {monthlyInfo.luckyColor && (
                 <Card className="p-6 border-t-4" style={{ borderTopColor: monthlyInfo.luckyColor.hex }}>
                   <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                     🎨 لون الحظ: {monthlyInfo.luckyColor.color}
                   </h3>
                   <p className="text-gray-600 dark:text-gray-300">
                     {monthlyInfo.luckyColor.meaning}
                   </p>
                   <div 
                     className="mt-4 h-12 rounded-lg w-full shadow-inner"
                     style={{ backgroundColor: monthlyInfo.luckyColor.hex }}
                   />
                 </Card>
              )}

              {monthlyInfo.facts && monthlyInfo.facts.length > 0 && (
                <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                  <h3 className="font-bold text-lg mb-4 text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                    💡 هل تعلم عن شهر {monthName}؟
                  </h3>
                  <ul className="space-y-2">
                    {monthlyInfo.facts.map((fact, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-indigo-500 mt-1">•</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {monthlyInfo.events && monthlyInfo.events.length > 0 && (
                <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                  <h3 className="font-bold text-lg mb-4 text-green-700 dark:text-green-300 flex items-center gap-2">
                    🗓️ أحداث ومناسبات شهر {monthName}
                  </h3>
                  <ul className="space-y-2">
                    {monthlyInfo.events.map((event, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{event}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          </section>
        )}

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
                  className="block text-center text-blue-600 hover:underline mt-4"
                >
                  عرض المزيد ({events.length - 10} حدث آخر)
                </Link>
              )}
            </div>
          ) : (
            <Card className="p-8 text-center bg-gray-50 dark:bg-gray-800 border-dashed">
              <div className="text-4xl mb-3">📜</div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                لا توجد أحداث مسجلة
              </h3>
              <p className="text-gray-500 text-sm">
                لم نقم بتسجيل أحداث تاريخية لهذا اليوم بعد.
              </p>
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
            <Card className="p-8 text-center bg-gray-50 dark:bg-gray-800 border-dashed">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                لا يوجد مشاهير
              </h3>
              <p className="text-gray-500 text-sm">
                لم نجد مشاهير مسجلين في قاعدة بياناتنا لهذا اليوم.
              </p>
            </Card>
          )}
        </section>

        {/* Share Section */}
        <section className="mb-12">
            <SocialShare 
                title={`أحداث ومشاهير يوم ${day} ${monthName}`} 
                url={`/date/${month}/${day}`} 
                description={`اكتشف الأحداث التاريخية والمشاهير الذين ولدوا في ${day} ${monthName}. معلومات شاملة عن هذا اليوم.`} 
            />
        </section>

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
