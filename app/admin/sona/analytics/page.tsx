'use client';

/**
 * SONA v4 Analytics Dashboard
 * لوحة التحليلات
 *
 * Requirements: 18.3, 18.4, 18.5
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Download,
  RefreshCw,
  Zap,
  Clock,
  Target,
  AlertTriangle,
} from 'lucide-react';

interface AnalyticsData {
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
    avgQualityScore: number;
  }>;
  topTemplates: Array<{
    templateId: string;
    usageCount: number;
    avgQualityScore: number;
  }>;
  qualityTrend: Array<{
    date: string;
    avgQualityScore: number;
    totalGenerations: number;
  }>;
  errorRate: number;
  diversityScore: number;
}

type DateRange = '7d' | '30d' | '90d';

export default function SONAAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sona/analytics?period=${dateRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data || getDefaultAnalytics());
      } else {
        setAnalytics(getDefaultAnalytics());
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setAnalytics(getDefaultAnalytics());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultAnalytics = (): AnalyticsData => ({
    totalGenerations: 0,
    successfulGenerations: 0,
    failedGenerations: 0,
    avgQualityScore: 0,
    avgGenerationTime: 0,
    recentTrend: 'stable',
    topCategories: [],
    topTemplates: [],
    qualityTrend: [],
    errorRate: 0,
    diversityScore: 0,
  });

  const exportReport = async () => {
    try {
      const response = await fetch('/api/sona/export?type=stats');
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sona-analytics-${dateRange}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to export report:', err);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'declining':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/sona"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                التحليلات
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                إحصائيات أداء SONA
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(['7d', '30d', '90d'] as DateRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  dateRange === range
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {range === '7d'
                  ? '7 أيام'
                  : range === '30d'
                  ? '30 يوم'
                  : '90 يوم'}
              </button>
            ))}
          </div>
          <button
            onClick={exportReport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            تصدير
          </button>
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 animate-pulse"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : analytics ? (
        <>
          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="إجمالي التوليدات"
              value={analytics.totalGenerations.toLocaleString()}
              icon={<Zap className="w-5 h-5" />}
              color="blue"
              subtitle={`${analytics.successfulGenerations} ناجح`}
            />
            <StatCard
              title="متوسط الجودة"
              value={`${analytics.avgQualityScore.toFixed(1)}%`}
              icon={<Target className="w-5 h-5" />}
              color="green"
              trend={analytics.recentTrend}
            />
            <StatCard
              title="متوسط الوقت"
              value={`${(analytics.avgGenerationTime / 1000).toFixed(1)}ث`}
              icon={<Clock className="w-5 h-5" />}
              color="purple"
            />
            <StatCard
              title="معدل الخطأ"
              value={`${analytics.errorRate.toFixed(1)}%`}
              icon={<AlertTriangle className="w-5 h-5" />}
              color={analytics.errorRate > 10 ? 'red' : 'orange'}
              subtitle={`${analytics.failedGenerations} فشل`}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quality Trend */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                اتجاه الجودة
              </h3>
              {analytics.qualityTrend.length > 0 ? (
                <div className="h-48 flex items-end gap-1">
                  {analytics.qualityTrend.slice(-14).map((point, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <div
                        className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t transition-all"
                        style={{ height: `${point.avgQualityScore}%` }}
                        title={`${point.date}: ${point.avgQualityScore.toFixed(
                          1
                        )}%`}
                      />
                      <span className="text-[10px] text-gray-400 rotate-45 origin-left">
                        {point.date.slice(-5)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400">
                  لا توجد بيانات كافية
                </div>
              )}
            </div>

            {/* Diversity Score */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                درجة التنوع
              </h3>
              <div className="flex items-center justify-center h-48">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${analytics.diversityScore * 4.4} 440`}
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {analytics.diversityScore.toFixed(0)}%
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      تنوع
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Categories & Templates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                أكثر الفئات استخداماً
              </h3>
              {analytics.topCategories.length > 0 ? (
                <div className="space-y-3">
                  {analytics.topCategories.slice(0, 5).map((cat, i) => (
                    <div key={cat.category} className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-full text-xs font-medium text-purple-600 dark:text-purple-400">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {cat.category}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {cat.count} ({cat.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            style={{ width: `${cat.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  لا توجد بيانات
                </div>
              )}
            </div>

            {/* Top Templates */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                أكثر القوالب استخداماً
              </h3>
              {analytics.topTemplates.length > 0 ? (
                <div className="space-y-3">
                  {analytics.topTemplates.slice(0, 5).map((template, i) => (
                    <div
                      key={template.templateId}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-full text-xs font-medium text-blue-600 dark:text-blue-400">
                          {i + 1}
                        </span>
                        <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                          {template.templateId}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {template.usageCount} استخدام
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            template.avgQualityScore >= 80
                              ? 'text-green-600 dark:text-green-400'
                              : template.avgQualityScore >= 60
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {template.avgQualityScore.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  لا توجد بيانات
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  subtitle,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  subtitle?: string;
  trend?: 'improving' | 'stable' | 'declining';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green:
      'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple:
      'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    orange:
      'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            {trend === 'improving' && (
              <TrendingUp className="w-4 h-4 text-green-500" />
            )}
            {trend === 'declining' && (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            {trend === 'stable' && <Minus className="w-4 h-4 text-gray-400" />}
          </div>
        )}
      </div>
    </div>
  );
}
