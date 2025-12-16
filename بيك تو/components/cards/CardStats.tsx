'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Heart, Download } from 'lucide-react';

interface StatsData {
  totalCards: number;
  totalDownloads: number;
  popularTemplate: string;
  todayCards: number;
}

interface CardStatsProps {
  stats?: StatsData;
}

export default function CardStats({ stats }: CardStatsProps) {
  // Mock data for demonstration
  const defaultStats: StatsData = {
    totalCards: 12847,
    totalDownloads: 45632,
    popularTemplate: 'غروب ذهبي',
    todayCards: 234,
  };

  const displayStats = stats || defaultStats;

  const statItems = [
    {
      id: 'total-cards',
      label: 'إجمالي البطاقات',
      value: displayStats.totalCards.toLocaleString('ar-SA'),
      icon: Heart,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    },
    {
      id: 'downloads',
      label: 'مرات التحميل',
      value: displayStats.totalDownloads.toLocaleString('ar-SA'),
      icon: Download,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      id: 'today',
      label: 'بطاقات اليوم',
      value: displayStats.todayCards.toLocaleString('ar-SA'),
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      id: 'users',
      label: 'المستخدمون النشطون',
      value: '2.1K',
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
      <h3 className="text-xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        📊 إحصائيات المنصة
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {statItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${item.bgColor} rounded-2xl p-4 text-center`}
          >
            <div
              className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 ${item.color} mb-2`}
            >
              <item.icon size={20} />
            </div>
            <div className="font-bold text-lg">{item.value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {item.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Popular Template */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4">
        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
          🏆 القالب الأكثر شعبية
        </h4>
        <div className="flex items-center justify-between">
          <span className="font-bold text-purple-600 dark:text-purple-400">
            {displayStats.popularTemplate}
          </span>
          <span className="text-xs text-gray-500">استُخدم 1.2K مرة</span>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-6 space-y-2">
        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
          💡 نصائح سريعة
        </h4>
        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
          <div>• استخدم الألوان المتناسقة للحصول على أفضل نتيجة</div>
          <div>• اختر خطاً واضحاً وسهل القراءة</div>
          <div>• أضف لمسة شخصية برسالة من القلب</div>
        </div>
      </div>
    </div>
  );
}
