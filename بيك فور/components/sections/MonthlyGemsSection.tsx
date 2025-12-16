'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

/**
 * Monthly Gems Section Component
 * Feature: frontend-database-integration
 * Requirements: 7.4
 */

interface MonthlyInfo {
  birthstone: { name: string; color: string };
  birthFlower: { name: string };
  luckyColor: { color: string; hex: string };
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

export default function MonthlyGemsSection() {
  const [monthlyInfo, setMonthlyInfo] = useState<MonthlyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    const fetchMonthlyInfo = async () => {
      try {
        const response = await fetch(`/api/monthly-info/${currentMonth}`);
        const data = await response.json();
        if (data.success) {
          setMonthlyInfo(data.data);
        }
      } catch (err) {
        console.error('Error fetching monthly info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyInfo();
  }, [currentMonth]);

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
        </div>
      </section>
    );
  }

  if (!monthlyInfo) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            💎 كنوز شهر {MONTHS[currentMonth - 1]}
          </h2>
          <Link
            href="/birthstones-flowers"
            className="text-purple-600 hover:underline text-sm"
          >
            عرض كل الشهور
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Birthstone */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <div className="text-4xl mb-3">💎</div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-1">
              حجر الشهر
            </h3>
            <p className="text-xl text-purple-600 dark:text-purple-400">
              {monthlyInfo.birthstone?.name}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {monthlyInfo.birthstone?.color}
            </p>
          </Card>

          {/* Birth Flower */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="text-4xl mb-3">🌸</div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-1">
              زهرة الشهر
            </h3>
            <p className="text-xl text-green-600 dark:text-green-400">
              {monthlyInfo.birthFlower?.name}
            </p>
          </Card>

          {/* Lucky Color */}
          {monthlyInfo.luckyColor && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-full"
                  style={{ backgroundColor: monthlyInfo.luckyColor.hex }}
                />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-1">
                اللون المحظوظ
              </h3>
              <p className="text-xl text-gray-700 dark:text-gray-300">
                {monthlyInfo.luckyColor.color}
              </p>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
