/**
 * مكون مراقبة الأداء للواجهة المحسنة لإعادة الصياغة
 */

'use client';

import { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Zap } from 'lucide-react';
import { PerformanceMonitor, getMemoryUsage } from '@/lib/utils/performance';

interface PerformanceMonitorProps {
  show?: boolean;
}

export default function PerformanceMonitorComponent({
  show = false,
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<
    Record<string, { average: number; count: number }>
  >({});
  const [memoryUsage, setMemoryUsage] = useState<{
    used: number;
    total: number;
    percentage: number;
  } | null>(null);

  useEffect(() => {
    if (!show) return;

    const monitor = PerformanceMonitor.getInstance();

    const updateMetrics = () => {
      setMetrics(monitor.getMetrics());
      setMemoryUsage(getMemoryUsage());
    };

    // Update every 2 seconds
    const interval = setInterval(updateMetrics, 2000);
    updateMetrics(); // Initial update

    return () => {
      clearInterval(interval);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm z-50">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-blue-500" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          مراقب الأداء
        </h3>
      </div>

      {/* Memory Usage */}
      {memoryUsage && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <HardDrive className="w-3 h-3 text-green-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              الذاكرة
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${memoryUsage.percentage}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">
              {memoryUsage.used}MB / {memoryUsage.total}MB
            </span>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      <div className="space-y-2">
        {Object.entries(metrics).map(([label, data]) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {label}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {data.average.toFixed(1)}ms ({data.count})
            </div>
          </div>
        ))}
      </div>

      {/* Clear Button */}
      <button
        onClick={() => {
          PerformanceMonitor.getInstance().clear();
          setMetrics({});
        }}
        className="mt-3 w-full text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
      >
        مسح البيانات
      </button>
    </div>
  );
}
