'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import CelebrityCard from '@/components/enhanced/CelebrityCard';

/**
 * Celebrities Page Component
 * Feature: frontend-database-integration
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

interface Celebrity {
  id: number;
  name: string;
  profession: string;
  birth_year: number;
  month: number;
  day: number;
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

export default function CelebritiesPageClient() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCelebrities = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/daily-birthdays/${month}/${day}`);
      const data = await response.json();
      if (data.success) {
        setCelebrities(data.data.celebrities || []);
      }
    } catch (err) {
      console.error('Error fetching celebrities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCelebrities();
  }, [month, day]);

  const filteredCelebrities = searchQuery
    ? celebrities.filter(
        (c) =>
          c.name.includes(searchQuery) || c.profession.includes(searchQuery)
      )
    : celebrities;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            ⭐ مشاهير ولدوا في يومك
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            اكتشف من يشاركك يوم ميلادك من المشاهير
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">الشهر</label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              >
                {MONTHS.map((m, i) => (
                  <option key={i} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">اليوم</label>
              <Input
                type="number"
                min="1"
                max="31"
                value={day}
                onChange={(e) => setDay(parseInt(e.target.value) || 1)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">بحث</label>
              <Input
                type="text"
                placeholder="ابحث عن مشهور..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            مشاهير ولدوا في {day} {MONTHS[month - 1]}
          </h2>
          <p className="text-sm text-gray-500">
            {filteredCelebrities.length} مشهور
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : filteredCelebrities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredCelebrities.map((celebrity) => (
              <CelebrityCard key={celebrity.id} celebrity={celebrity} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-500">لا يوجد مشاهير لهذا التاريخ</p>
          </Card>
        )}
      </div>
    </div>
  );
}
