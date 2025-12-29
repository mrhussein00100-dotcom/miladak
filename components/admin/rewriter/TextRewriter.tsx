'use client';

/**
 * مكون إعادة الصياغة من النص المباشر
 */

import { useState } from 'react';
import RewriteSettings from './RewriteSettings';
import type {
  RewriteSettings as Settings,
  RewriteResult,
  GeneratedImage,
  DEFAULT_REWRITE_SETTINGS,
} from '@/types/rewriter';

interface TextRewriterProps {
  onResults: (
    results: RewriteResult[],
    originalContent: string,
    images?: GeneratedImage[]
  ) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const defaultSettings: Settings = {
  models: ['gemini'],
  wordCount: 1000,
  style: 'formal',
  audience: 'general',
  generateImages: false,
  imageCount: 2,
  imageStyle: 'realistic',
};

export default function TextRewriter({
  onResults,
  isLoading,
  setIsLoading,
}: TextRewriterProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [error, setError] = useState('');

  const wordCount = content.split(/\s+/).filter((w) => w.length > 0).length;
  const charCount = content.length;

  const handleRewrite = async () => {
    if (!title.trim() || !content.trim()) {
      setError('يرجى إدخال العنوان والمحتوى');
      return;
    }

    if (settings.models.length === 0) {
      setError('يرجى اختيار نموذج واحد على الأقل');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/ai/rewrite-advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          ...settings,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'فشل في إعادة الصياغة');
        return;
      }

      onResults(data.results, content, data.images);
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* حقل العنوان */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          عنوان المقال
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="أدخل عنوان المقال..."
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* حقل المحتوى */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            محتوى المقال
          </label>
          <div className="text-sm text-gray-500">
            <span className="ml-4">{wordCount} كلمة</span>
            <span>{charCount} حرف</span>
          </div>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="الصق محتوى المقال هنا..."
          disabled={isLoading}
          rows={12}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* الإعدادات */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          إعدادات إعادة الصياغة
        </h3>
        <RewriteSettings
          settings={settings}
          onChange={setSettings}
          disabled={isLoading}
        />
      </div>

      {/* رسالة الخطأ */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* زر إعادة الصياغة */}
      <button
        onClick={handleRewrite}
        disabled={
          isLoading ||
          !title.trim() ||
          !content.trim() ||
          settings.models.length === 0
        }
        className={`
          w-full py-4 rounded-lg font-medium text-white transition-all
          ${
            isLoading ||
            !title.trim() ||
            !content.trim() ||
            settings.models.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            جاري إعادة الصياغة...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>✨</span>
            إعادة صياغة مع {settings.models.length} نموذج
          </span>
        )}
      </button>
    </div>
  );
}
