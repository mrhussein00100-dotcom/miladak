'use client';

/**
 * SONA v4 Admin Dashboard
 * لوحة تحكم SONA الرئيسية
 *
 * Requirements: 13.1
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Settings,
  FileText,
  Puzzle,
  BarChart3,
  FlaskConical,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
} from 'lucide-react';

interface DashboardStats {
  totalGenerations: number;
  successfulGenerations: number;
  failedGenerations: number;
  avgQualityScore: number;
  avgGenerationTime: number;
  recentTrend: 'improving' | 'stable' | 'declining';
  topCategories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
}

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

export default function SONADashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sona/stats');
      if (!response.ok) throw new Error('فشل في جلب الإحصائيات');
      const data = await response.json();
      setStats(data.data || data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
      // Set default stats for demo
      setStats({
        totalGenerations: 0,
        successfulGenerations: 0,
        failedGenerations: 0,
        avgQualityScore: 0,
        avgGenerationTime: 0,
        recentTrend: 'stable',
        topCategories: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const quickActions: QuickAction[] = [
    {
      title: 'الإعدادات',
      description: 'تخصيص إعدادات التوليد والجودة',
      href: '/admin/sona/settings',
      icon: <Settings className="w-6 h-6" />,
      color: 'bg-blue-500',
    },
    {
      title: 'القوالب',
      description: 'إدارة قوالب المحتوى',
      href: '/admin/sona/templates',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      title: 'الإضافات',
      description: 'إدارة plugins النظام',
      href: '/admin/sona/plugins',
      icon: <Puzzle className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
    {
      title: 'التحليلات',
      description: 'عرض إحصائيات الأداء',
      href: '/admin/sona/analytics',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-orange-500',
    },
    {
      title: 'بيئة الاختبار',
      description: 'اختبار التغييرات قبل التطبيق',
      href: '/admin/sona/sandbox',
      icon: <FlaskConical className="w-6 h-6" />,
      color: 'bg-pink-500',
    },
  ];

  const getTrendIcon = () => {
    if (!stats) return <Minus className="w-5 h-5 text-gray-400" />;
    switch (stats.recentTrend) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'declining':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTrendText = () => {
    if (!stats) return 'غير محدد';
    switch (stats.recentTrend) {
      case 'improving':
        return 'تحسن';
      case 'declining':
        return 'تراجع';
      default:
        return 'مستقر';
    }
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              SONA v4
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              نظام توليد المحتوى الذكي
            </p>
          </div>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          تحديث
        </button>
      </div>

      {error && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-800 dark:text-yellow-200">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي التوليدات"
          value={stats?.totalGenerations || 0}
          icon={<Zap className="w-5 h-5" />}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="معدل النجاح"
          value={
            stats && stats.totalGenerations > 0
              ? `${Math.round(
                  (stats.successfulGenerations / stats.totalGenerations) * 100
                )}%`
              : '0%'
          }
          icon={<CheckCircle className="w-5 h-5" />}
          color="green"
          loading={loading}
        />
        <StatCard
          title="متوسط الجودة"
          value={stats ? `${stats.avgQualityScore.toFixed(1)}%` : '0%'}
          icon={<BarChart3 className="w-5 h-5" />}
          color="purple"
          loading={loading}
        />
        <StatCard
          title="متوسط الوقت"
          value={
            stats ? `${(stats.avgGenerationTime / 1000).toFixed(1)}ث` : '0ث'
          }
          icon={<Clock className="w-5 h-5" />}
          color="orange"
          loading={loading}
        />
      </div>

      {/* Trend & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            اتجاه الأداء
          </h3>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
              {getTrendIcon()}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {getTrendText()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                خلال آخر 7 أيام
              </p>
            </div>
          </div>
          {stats && stats.failedGenerations > 0 && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-300">
                {stats.failedGenerations} عملية فاشلة
              </span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            الوصول السريع
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div
                  className={`p-3 ${action.color} rounded-xl text-white mb-2 group-hover:scale-110 transition-transform`}
                >
                  {action.icon}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                  {action.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Top Categories */}
      {stats && stats.topCategories.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            أكثر الفئات استخداماً
          </h3>
          <div className="space-y-3">
            {stats.topCategories.slice(0, 5).map((cat, index) => (
              <div key={cat.category} className="flex items-center gap-4">
                <span className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {cat.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {cat.count} ({cat.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon,
  color,
  loading,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
  loading: boolean;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green:
      'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple:
      'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    orange:
      'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      </div>
      {loading ? (
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      )}
    </div>
  );
}
