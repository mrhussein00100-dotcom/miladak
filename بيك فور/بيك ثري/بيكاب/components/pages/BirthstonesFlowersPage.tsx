'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import BirthstoneCard from '@/components/enhanced/BirthstoneCard';
import BirthFlowerCard from '@/components/enhanced/BirthFlowerCard';

/**
 * Birthstones and Flowers Page Component
 * Feature: frontend-database-integration
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

interface MonthlyInfo {
  month: number;
  birthstone: {
    name: string;
    properties: string;
    color: string;
    meaning: string;
  };
  birthFlower: {
    name: string;
    meaning: string;
    symbolism: string;
  };
  luckyColor: {
    color: string;
    meaning: string;
    hex: string;
  };
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

export default function BirthstonesFlowersPageClient() {
  const [monthlyData, setMonthlyData] = useState<MonthlyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  useEffect(() => {
    const fetchAllMonths = async () => {
      setLoading(true);
      const data: MonthlyInfo[] = [];

      for (let month = 1; month <= 12; month++) {
        try {
          const response = await fetch(`/api/monthly-info/${month}`);
          const result = await response.json();
          if (result.success) {
            data.push({ month, ...result.data });
          }
        } catch (err) {
          console.error(`Error fetching month ${month}:`, err);
        }
      }

      setMonthlyData(data);
      setLoading(false);
    };

    fetchAllMonths();
  }, []);

  const selectedData = selectedMonth
    ? monthlyData.find((d) => d.month === selectedMonth)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            💎 أحجار وزهور الميلاد
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            اكتشف حجر ميلادك وزهرة ميلادك ولونك المحظوظ حسب شهر ميلادك
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {MONTHS.map((month, i) => (
            <button
              key={i}
              onClick={() =>
                setSelectedMonth(selectedMonth === i + 1 ? null : i + 1)
              }
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedMonth === i + 1
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
              }`}
            >
              {month}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : selectedData ? (
          /* Selected Month Detail */
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">
              شهر {MONTHS[selectedMonth! - 1]}
            </h2>
            <BirthstoneCard birthstone={selectedData.birthstone} />
            <BirthFlowerCard birthFlower={selectedData.birthFlower} />
            {selectedData.luckyColor && (
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                    style={{ backgroundColor: selectedData.luckyColor.hex }}
                  />
                  <div>
                    <h4 className="text-lg font-bold">اللون المحظوظ</h4>
                    <p className="text-xl text-gray-700 dark:text-gray-300">
                      {selectedData.luckyColor.color}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedData.luckyColor.meaning}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        ) : (
          /* All Months Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monthlyData.map((data) => (
              <Card
                key={data.month}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedMonth(data.month)}
              >
                <h3 className="text-xl font-bold mb-4 text-center">
                  {MONTHS[data.month - 1]}
                </h3>
                <div className="space-y-3 text-center">
                  <div>
                    <span className="text-2xl">💎</span>
                    <p className="font-medium">{data.birthstone?.name}</p>
                  </div>
                  <div>
                    <span className="text-2xl">🌸</span>
                    <p className="font-medium">{data.birthFlower?.name}</p>
                  </div>
                  {data.luckyColor && (
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: data.luckyColor.hex }}
                      />
                      <span className="text-sm">{data.luckyColor.color}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
