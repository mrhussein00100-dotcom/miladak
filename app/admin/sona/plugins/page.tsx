'use client';

/**
 * SONA v4 Plugins Management Page
 * صفحة إدارة الإضافات
 *
 * Requirements: 14.1, 14.2, 14.3
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Puzzle,
  Power,
  PowerOff,
  RefreshCw,
  Info,
  CheckCircle,
  XCircle,
  Cake,
  Star,
  Heart,
  Package,
} from 'lucide-react';

interface Plugin {
  name: string;
  displayName: string;
  version: string;
  description: string;
  category: string;
  enabled: boolean;
  icon: string;
  features: string[];
}

const PLUGIN_ICONS: Record<string, React.ReactNode> = {
  birthday: <Cake className="w-6 h-6" />,
  zodiac: <Star className="w-6 h-6" />,
  health: <Heart className="w-6 h-6" />,
  default: <Package className="w-6 h-6" />,
};

export default function SONAPluginsPage() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    fetchPlugins();
  }, []);

  const fetchPlugins = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sona/plugins');
      if (response.ok) {
        const data = await response.json();
        setPlugins(data.data || data.plugins || getDefaultPlugins());
      } else {
        setPlugins(getDefaultPlugins());
      }
    } catch (err) {
      console.error('Failed to fetch plugins:', err);
      setPlugins(getDefaultPlugins());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultPlugins = (): Plugin[] => [
    {
      name: 'birthday',
      displayName: 'أعياد الميلاد',
      version: '1.0.0',
      description: 'إضافة محتوى متخصص لمقالات أعياد الميلاد والاحتفالات',
      category: 'أعياد الميلاد',
      enabled: true,
      icon: 'birthday',
      features: ['قوالب تهنئة', 'أفكار هدايا', 'تقاليد ثقافية', 'حسابات العمر'],
    },
    {
      name: 'zodiac',
      displayName: 'الأبراج',
      version: '1.0.0',
      description: 'إضافة معلومات فلكية ومحتوى متخصص للأبراج',
      category: 'الأبراج',
      enabled: true,
      icon: 'zodiac',
      features: ['صفات الأبراج', 'التوافق', 'الحظ اليومي', 'الأحجار الكريمة'],
    },
    {
      name: 'health',
      displayName: 'الصحة',
      version: '1.0.0',
      description: 'إضافة معلومات صحية ونصائح طبية موثوقة',
      category: 'الصحة',
      enabled: true,
      icon: 'health',
      features: [
        'نصائح صحية',
        'معلومات غذائية',
        'تمارين رياضية',
        'إحصائيات طبية',
      ],
    },
  ];

  const togglePlugin = async (pluginName: string) => {
    try {
      setToggling(pluginName);
      const response = await fetch(`/api/sona/plugins/${pluginName}/toggle`, {
        method: 'PUT',
      });

      if (response.ok) {
        setPlugins((prev) =>
          prev.map((p) =>
            p.name === pluginName ? { ...p, enabled: !p.enabled } : p
          )
        );
      }
    } catch (err) {
      console.error('Failed to toggle plugin:', err);
    } finally {
      setToggling(null);
    }
  };

  const enabledCount = plugins.filter((p) => p.enabled).length;

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
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Puzzle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                إدارة الإضافات
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {enabledCount} من {plugins.length} إضافة مفعلة
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={fetchPlugins}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          تحديث
        </button>
      </div>

      {/* Info Banner */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            الإضافات توسع قدرات SONA بإضافة قوالب ومعرفة متخصصة لفئات محتوى
            معينة.
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
            تعطيل إضافة لن يحذف بياناتها، ويمكنك إعادة تفعيلها في أي وقت.
          </p>
        </div>
      </div>

      {/* Plugins Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                </div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plugins.map((plugin) => (
            <div
              key={plugin.name}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all ${
                plugin.enabled
                  ? 'border-green-200 dark:border-green-800'
                  : 'border-gray-200 dark:border-gray-700 opacity-75'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-xl ${
                        plugin.enabled
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                      }`}
                    >
                      {PLUGIN_ICONS[plugin.icon] || PLUGIN_ICONS.default}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {plugin.displayName}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        v{plugin.version}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePlugin(plugin.name)}
                    disabled={toggling === plugin.name}
                    className={`p-2 rounded-lg transition-colors ${
                      plugin.enabled
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title={plugin.enabled ? 'تعطيل' : 'تفعيل'}
                  >
                    {toggling === plugin.name ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : plugin.enabled ? (
                      <Power className="w-5 h-5" />
                    ) : (
                      <PowerOff className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {plugin.description}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  {plugin.enabled ? (
                    <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      مفعل
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <XCircle className="w-3 h-3" />
                      معطل
                    </span>
                  )}
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {plugin.category}
                  </span>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    الميزات:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {plugin.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
