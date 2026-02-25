
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Star, History, ArrowLeft, PartyPopper } from 'lucide-react';
import { dailyEvents, dailyBirthdays } from '@/lib/dailyData';
import { getZodiacSign } from '@/lib/zodiac';

export default function TodayHighlights() {
  const [today, setToday] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [birthdays, setBirthdays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    setToday(now);
    setMounted(true);

    const fetchHighlights = async () => {
      try {
        setLoading(true);
        const day = now.getDate();
        const month = now.getMonth() + 1;
        
        // Load static data first
        const { dailyEvents: staticEvents, dailyBirthdays: staticBirthdays } = await import('@/lib/dailyData');
        const currentStaticEvents = staticEvents.filter(e => e.day === day && e.month === month);
        const currentStaticBirthdays = staticBirthdays.filter(b => b.day === day && b.month === month);

        const response = await fetch(`/api/daily-highlights?day=${day}&month=${month}`);
        
        if (response.ok) {
          const data = await response.json();
          const apiEvents = data.events || [];
          const apiBirthdays = data.birthdays || [];

          // Merge and deduplicate events by title
          const mergedEvents = [...apiEvents];
          currentStaticEvents.forEach(staticEvent => {
            if (!mergedEvents.some(e => e.title === staticEvent.title)) {
              mergedEvents.push(staticEvent);
            }
          });

          // Merge and deduplicate birthdays by name
          const mergedBirthdays = [...apiBirthdays];
          currentStaticBirthdays.forEach(staticBirthday => {
            if (!mergedBirthdays.some(b => b.name === staticBirthday.name)) {
              mergedBirthdays.push(staticBirthday);
            }
          });

          setEvents(mergedEvents);
          setBirthdays(mergedBirthdays);
        } else {
          // Fallback to static data if API fails
          setEvents(currentStaticEvents);
          setBirthdays(currentStaticBirthdays);
        }
      } catch (error) {
        console.error('Failed to fetch highlights:', error);
        // Fallback to static data
        const { dailyEvents, dailyBirthdays } = await import('@/lib/dailyData');
        const day = now.getDate();
        const month = now.getMonth() + 1;
        setEvents(dailyEvents.filter(e => e.day === day && e.month === month));
        setBirthdays(dailyBirthdays.filter(b => b.day === day && b.month === month));
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  if (!mounted || !today) return null;

  const day = today.getDate();
  const month = today.getMonth() + 1;
  const zodiacSign = getZodiacSign(month, day);

  // If no data, show nearest upcoming or just month data (simplified for now)
  const hasData = events.length > 0 || birthdays.length > 0;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-background dark:via-background/50 dark:to-background border-y border-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 flex items-center gap-3">
              <Calendar className="text-indigo-600 dark:text-indigo-400" />
              حدث في مثل هذا اليوم
            </h2>
            <p className="text-muted-foreground mt-2">
              {day} {today.toLocaleDateString('ar-SA', { month: 'long' })} - برج {zodiacSign}
            </p>
          </div>
          
          <Link 
            href={`/date/${month}/${day}`}
            className="group flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors bg-white dark:bg-card px-4 py-2 rounded-full shadow-sm border border-indigo-100 dark:border-border"
          >
            عرض التفاصيل الكاملة
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-8 animate-pulse">
             <div className="bg-card rounded-2xl p-6 h-64 border border-border"></div>
             <div className="bg-card rounded-2xl p-6 h-64 border border-border"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Birthdays Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-6 shadow-xl border border-border relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 dark:bg-pink-500/10 rounded-bl-full opacity-50 -mr-10 -mt-10"></div>
              
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-card-foreground relative z-10">
                <div className="p-2 bg-pink-100 dark:bg-pink-500/20 rounded-lg text-pink-600 dark:text-pink-400">
                  <PartyPopper className="w-5 h-5" />
                </div>
                مواليد اليوم
              </h3>

              {birthdays.length > 0 ? (
                <div className="space-y-4">
                  {birthdays.slice(0, 3).map((person, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {person.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-card-foreground">{person.name}</h4>
                        <p className="text-sm text-muted-foreground">{person.profession} ({person.birthYear ? today.getFullYear() - person.birthYear + ' سنة' : ''})</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>لا توجد بيانات لمشاهير في هذا اليوم.</p>
                  <Link href="/celebrities" className="text-pink-600 dark:text-pink-400 text-sm hover:underline mt-2 inline-block">
                    تصفح جميع المشاهير
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Events Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-6 shadow-xl border border-border relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 dark:bg-blue-500/10 rounded-bl-full opacity-50 -mr-10 -mt-10"></div>
              
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-card-foreground relative z-10">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
                  <History className="w-5 h-5" />
                </div>
                أحداث تاريخية
              </h3>

              {events.length > 0 ? (
                <div className="space-y-4">
                  {events.slice(0, 3).map((event, idx) => (
                    <div key={idx} className="flex gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="flex-shrink-0 w-12 text-center">
                        <span className="block text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-lg">
                          {event.year || '----'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-card-foreground">{event.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>لا توجد أحداث مسجلة لهذا اليوم.</p>
                  <Link href="/historical-events" className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-2 inline-block">
                    تصفح جميع الأحداث
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
