/**
 * مكون إدخال الرابط وجلب المحتوى من الروابط الخارجية
 */

'use client';

import { useState } from 'react';
import {
  Link as LinkIcon,
  Download,
  Loader,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import type { UrlInputProps } from '@/types/rewriter-enhanced';

export default function UrlInput({
  url,
  onUrlChange,
  onFetch,
  isLoading,
  disabled,
}: UrlInputProps) {
  const [isValidUrl, setIsValidUrl] = useState(true);

  const validateUrl = (inputUrl: string) => {
    if (!inputUrl.trim()) {
      setIsValidUrl(true);
      return;
    }

    try {
      new URL(inputUrl);
      setIsValidUrl(true);
    } catch {
      setIsValidUrl(false);
    }
  };

  const handleUrlChange = (newUrl: string) => {
    onUrlChange(newUrl);
    validateUrl(newUrl);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && url.trim() && isValidUrl) {
      onFetch();
    }
  };

  const canFetch =
    url.trim().length > 0 && isValidUrl && !isLoading && !disabled;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
          <LinkIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            جلب المحتوى من رابط
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            أدخل رابط المقال لاستخراج المحتوى تلقائياً
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* حقل إدخال الرابط */}
        <div className="relative">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="https://example.com/article"
                disabled={disabled || isLoading}
                className={`
                  w-full px-4 py-3 pr-10 rounded-lg border transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${
                    !isValidUrl && url.trim()
                      ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900'
                  }
                  ${
                    disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }
                  text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                `}
              />

              {/* أيقونة الحالة */}
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                {url.trim() &&
                  (isValidUrl ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ))}
              </div>
            </div>

            {/* زر الجلب */}
            <button
              onClick={onFetch}
              disabled={!canFetch}
              className={`
                px-6 py-3 rounded-lg font-medium text-white transition-all duration-200
                flex items-center gap-2 whitespace-nowrap min-w-[120px] justify-center
                ${
                  canFetch
                    ? 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'
                    : 'bg-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  جلب...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  جلب المقال
                </>
              )}
            </button>
          </div>

          {/* رسالة خطأ التحقق من الرابط */}
          {!isValidUrl && url.trim() && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span>الرجاء إدخال رابط صحيح</span>
            </div>
          )}
        </div>

        {/* نصائح الاستخدام */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
            💡 نصائح للحصول على أفضل النتائج:
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• تأكد من أن الرابط يحتوي على مقال أو محتوى نصي</li>
            <li>• تجنب الروابط المحمية بكلمة مرور</li>
            <li>• الروابط من المواقع الإخبارية والمدونات تعطي أفضل النتائج</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
