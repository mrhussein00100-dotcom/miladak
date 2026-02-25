/**
 * مكون رسائل الحالة والأخطاء
 */

'use client';

import { AlertCircle, CheckCircle, X, RefreshCw } from 'lucide-react';
import type { StatusMessagesProps } from '@/types/rewriter-enhanced';

export default function StatusMessages({
  error,
  success,
  onDismiss,
}: StatusMessagesProps) {
  if (!error && !success) return null;

  return (
    <div className="mb-6">
      {/* رسالة الخطأ */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                حدث خطأ
              </h4>
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>

              {/* اقتراحات الحلول */}
              <div className="mt-3 text-xs text-red-600 dark:text-red-300">
                <p className="font-medium mb-1">💡 جرب الحلول التالية:</p>
                <ul className="list-disc list-inside space-y-0.5 mr-4">
                  <li>تأكد من اتصالك بالإنترنت</li>
                  <li>تحقق من صحة الرابط إذا كنت تستخدم جلب من رابط</li>
                  <li>جرب نموذج ذكاء اصطناعي مختلف</li>
                  <li>قلل من طول المحتوى إذا كان طويلاً جداً</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.location.reload()}
                className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="إعادة تحميل الصفحة"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={onDismiss}
                className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="إغلاق الرسالة"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* رسالة النجاح */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                تم بنجاح
              </h4>
              <p className="text-sm text-green-700 dark:text-green-400">
                {success}
              </p>
            </div>

            <button
              onClick={onDismiss}
              className="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
              title="إغلاق الرسالة"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
