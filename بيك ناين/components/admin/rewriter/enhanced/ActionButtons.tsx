/**
 * مكون أزرار التحكم المحسنة
 */

'use client';

import {
  RefreshCw,
  RotateCcw,
  Copy,
  Sparkles,
  Loader,
  Tag,
  Edit3,
  Zap,
} from 'lucide-react';
import type { ActionButtonsProps } from '@/types/rewriter-enhanced';

export default function ActionButtons({
  onRewrite,
  onReset,
  onCopy,
  onGenerateMeta,
  onAddToEditor,
  canRewrite,
  canCopy,
  canGenerateMeta,
  canAddToEditor,
  isLoading,
  isGeneratingMeta,
}: ActionButtonsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col gap-4">
        {/* الزر الرئيسي */}
        <div className="flex justify-center">
          <button
            onClick={onRewrite}
            disabled={!canRewrite}
            className={`
              flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-white 
              transition-all duration-300 transform hover:scale-105 active:scale-95
              min-w-[250px] justify-center text-lg
              ${
                canRewrite
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-400 cursor-not-allowed shadow-none'
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader className="w-6 h-6 animate-spin" />
                <span>جاري إعادة الصياغة...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                <span>إعادة الصياغة المحسنة</span>
              </>
            )}
          </button>
        </div>

        {/* الأزرار الثانوية */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* زر النسخ */}
          {canCopy && (
            <button
              onClick={onCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 transition-all duration-200 font-medium"
            >
              <Copy className="w-4 h-4" />
              <span>نسخ النتيجة</span>
            </button>
          )}

          {/* زر توليد الميتا */}
          {canGenerateMeta && (
            <button
              onClick={onGenerateMeta}
              disabled={isGeneratingMeta}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 transition-all duration-200 font-medium disabled:opacity-50"
            >
              {isGeneratingMeta ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Tag className="w-4 h-4" />
              )}
              <span>{isGeneratingMeta ? 'توليد...' : 'توليد الميتا'}</span>
            </button>
          )}

          {/* زر إضافة للمحرر */}
          {canAddToEditor && (
            <button
              onClick={onAddToEditor}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 transition-all duration-200 font-medium"
            >
              <Edit3 className="w-4 h-4" />
              <span>إضافة للمحرر</span>
            </button>
          )}

          {/* زر البدء من جديد */}
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all duration-200 font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            <span>بدء جديد</span>
          </button>
        </div>

        {/* معلومات إضافية */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-500" />
                <span>محسن للجودة</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>محتوى أطول</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>سيو تلقائي</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>إضافة مباشرة</span>
              </div>
            </div>

            <div className="text-xs">
              {!canRewrite && (
                <span className="text-amber-600 dark:text-amber-400">
                  أدخل العنوان والمحتوى للبدء
                </span>
              )}
              {canRewrite && !isLoading && (
                <span className="text-green-600 dark:text-green-400">
                  جاهز لإعادة الصياغة المحسنة
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
