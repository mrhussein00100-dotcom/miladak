'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

/**
 * Today In History Section Component
 * Feature: frontend-database-integration
 * Requirements: 7.1
 */

interface Event {
  id: number;
  title: string;
  description: string;
  year: number;
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

export default function TodayInHistorySection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/daily-events/${month}/${day}`);
        const data = await response.json();
        if (data.success) {
          setEvents(data.data.events?.slice(0, 3) || []);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [month, day]);

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) return null;

  return (
    <section className="py-12 bg-blue-50 dark:bg-blue-900/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            📜 في مثل هذا اليوم ({day} {MONTHS[month - 1]})
          </h2>
          <Link
            href={`/date/${month}/${day}`}
            className="text-blue-600 hover:underline text-sm"
          >
            عرض الكل
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {events.map((event) => (
            <Card key={event.id} className="p-4">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {event.year}
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                {event.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {event.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
