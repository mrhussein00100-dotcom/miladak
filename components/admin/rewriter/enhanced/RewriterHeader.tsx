/**
 * مكون العنوان والإحصائيات لصفحة إعادة الصياغة المحسنة
 */

'use client';

import { RefreshCw, FileText, BarChart3 } from 'lucide-react';
import type { RewriterHeaderProps } from '@/types/rewriter-enhanced';

export default function RewriterHeader({
  sourceWordCount,
  rewrittenWordCount,
  isProcessing,
}: RewriterHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* العنوان الرئيسي */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <RefreshCw
              className={`w-6 h-6 text-white ${
                isProcessing ? 'animate-spin' : ''
              }`}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              إعادة الصياغة بالذكاء الاصطناعي
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              أعد صياغة المحتوى باستخدام نماذج AI متعددة مع خيارات متقدمة
            </p>
          </div>
        </div>

        {/* الإحصائيات */}
        <div className="flex items-center gap-6">
          {/* إحصائيات المحتوى الأصلي */}
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {sourceWordCount.toLocaleString()}
              </div>
              <div className="text-xs text-blue-500 dark:text-blue-300">
                كلمة أصلية
              </div>
            </div>
          </div>

          {/* سهم التحويل */}
          {rewrittenWordCount > 0 && (
            <div className="hidden sm:flex items-center">
              <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative">
                <div className="absolute -right-1 -top-1 w-2 h-2 bg-purple-600 rounded-full"></div>
              </div>
            </div>
          )}

          {/* إحصائيات المحتوى المُعاد صياغته */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              rewrittenWordCount > 0
                ? 'bg-green-50 dark:bg-green-900/20'
                : 'bg-gray-50 dark:bg-gray-800/50'
            }`}
          >
            <BarChart3
              className={`w-4 h-4 ${
                rewrittenWordCount > 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-400'
              }`}
            />
            <div className="text-center">
              <div
                className={`text-lg font-semibold ${
                  rewrittenWordCount > 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-400'
                }`}
              >
                {rewrittenWordCount.toLocaleString()}
              </div>
              <div
                className={`text-xs ${
                  rewrittenWordCount > 0
                    ? 'text-green-500 dark:text-green-300'
                    : 'text-gray-400'
                }`}
              >
                كلمة جديدة
              </div>
            </div>
          </div>

          {/* مؤشر التقدم */}
          {isProcessing && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                جاري المعالجة...
              </span>
            </div>
          )}
        </div>
      </div>

      {/* شريط التقدم للمعالجة */}
      {isProcessing && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-1 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}
