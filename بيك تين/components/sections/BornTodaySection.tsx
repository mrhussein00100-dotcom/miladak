'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

/**
 * Born Today Section Component
 * Feature: frontend-database-integration
 * Requirements: 7.2
 */

interface Celebrity {
  id: number;
  name: string;
  profession: string;
  birth_year: number;
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

export default function BornTodaySection() {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  useEffect(() => {
    const fetchCelebrities = async () => {
      try {
        const response = await fetch(`/api/daily-birthdays/${month}/${day}`);
        const data = await response.json();
        if (data.success) {
          setCelebrities(data.data.celebrities?.slice(0, 4) || []);
        }
      } catch (err) {
        console.error('Error fetching celebrities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCelebrities();
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

  if (celebrities.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            ⭐ ولدوا في مثل هذا اليوم
          </h2>
          <Link
            href="/celebrities"
            className="text-amber-600 hover:underline text-sm"
          >
            عرض الكل
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {celebrities.map((celebrity) => (
            <Card key={celebrity.id} className="p-4 text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                {celebrity.name}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {celebrity.profession}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {celebrity.birth_year}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
