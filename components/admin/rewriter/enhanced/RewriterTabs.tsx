/**
 * مكون التبويبات للتبديل بين أنماط الإدخال المختلفة
 */

'use client';

import { FileText, Link as LinkIcon } from 'lucide-react';
import type { RewriterTabsProps } from '@/types/rewriter-enhanced';

export default function RewriterTabs({
  activeTab,
  onTabChange,
  disabled,
}: RewriterTabsProps) {
  const tabs = [
    {
      id: 'text' as const,
      label: 'إدخال محتوى',
      icon: FileText,
      description: 'الصق أو اكتب المحتوى مباشرة',
    },
    {
      id: 'url' as const,
      label: 'جلب من رابط',
      icon: LinkIcon,
      description: 'استخرج المحتوى من رابط خارجي',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      {/* التبويبات */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => !disabled && onTabChange(tab.id)}
                disabled={disabled}
                className={`
                  flex items-center gap-3 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200
                  ${
                    isActive
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  }
                  ${
                    disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                  }
                `}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : ''
                  }`}
                />
                <div className="text-right">
                  <div className="font-medium">{tab.label}</div>
                  <div
                    className={`text-xs mt-0.5 ${
                      isActive
                        ? 'text-blue-500 dark:text-blue-300'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {tab.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* مؤشر التبويب النشط */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div
            className={`w-2 h-2 rounded-full ${
              activeTab === 'text' ? 'bg-blue-500' : 'bg-green-500'
            }`}
          ></div>
          <span>
            {activeTab === 'text'
              ? 'يمكنك الصق أو كتابة المحتوى في المنطقة أدناه'
              : 'أدخل رابط المقال لاستخراج المحتوى تلقائياً'}
          </span>
        </div>
      </div>
    </div>
  );
}
