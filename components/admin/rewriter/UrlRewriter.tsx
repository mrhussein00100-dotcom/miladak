'use client';

/**
 * مكون إعادة الصياغة من الرابط
 */

import { useState } from 'react';
import RewriteSettings from './RewriteSettings';
import type {
  RewriteSettings as Settings,
  RewriteResult,
  GeneratedImage,
  ExtractedContent,
} from '@/types/rewriter';

interface UrlRewriterProps {
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

export default function UrlRewriter({
  onResults,
  isLoading,
  setIsLoading,
}: UrlRewriterProps) {
  const [url, setUrl] = useState('');
  const [extractedContent, setExtractedContent] =
    useState<ExtractedContent | null>(null);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [error, setError] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);

  const handleExtract = async () => {
    if (!url.trim()) {
      setError('يرجى إدخال الرابط');
      return;
    }

    setError('');
    setIsExtracting(true);
    setExtractedContent(null);

    try {
      const response = await fetch('/api/admin/ai/extract-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          cleanAds: true,
          extractImages: true,
          extractMetadata: true,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'فشل في استخلاص المحتوى');
        return;
      }

      setExtractedContent(data);
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم');
      console.error(err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleRewrite = async () => {
    if (!extractedContent) return;

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/ai/rewrite-advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: extractedContent.title,
          content: extractedContent.cleanContent,
          ...settings,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'فشل في إعادة الصياغة');
        return;
      }

      onResults(data.results, extractedContent.cleanContent, data.images);
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* حقل الرابط */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          رابط المقال
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/article"
            disabled={isExtracting || isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={handleExtract}
            disabled={isExtracting || isLoading || !url.trim()}
            className={`
              px-6 py-3 rounded-lg font-medium text-white transition-all
              ${
                isExtracting || isLoading || !url.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
              }
            `}
          >
            {isExtracting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                استخلاص...
              </span>
            ) : (
              '📥 استخلاص'
            )}
          </button>
        </div>
      </div>

      {/* معاينة المحتوى المستخلص */}
      {extractedContent && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
            <span>✅</span>
            تم استخلاص المحتوى بنجاح
          </h3>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-500">العنوان:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {extractedContent.title}
              </p>
            </div>

            <div className="flex gap-4 text-gray-600 dark:text-gray-400">
              <span>📊 {extractedContent.metadata.wordCount} كلمة</span>
              {extractedContent.author && (
                <span>✍️ {extractedContent.author}</span>
              )}
              {extractedContent.images.length > 0 && (
                <span>🖼️ {extractedContent.images.length} صورة</span>
              )}
            </div>

            <div>
              <span className="text-gray-500">معاينة المحتوى:</span>
              <p className="text-gray-700 dark:text-gray-300 mt-1 line-clamp-4">
                {extractedContent.cleanContent.substring(0, 500)}...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* الإعدادات */}
      {extractedContent && (
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
      )}

      {/* رسالة الخطأ */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* زر إعادة الصياغة */}
      {extractedContent && (
        <button
          onClick={handleRewrite}
          disabled={isLoading || settings.models.length === 0}
          className={`
            w-full py-4 rounded-lg font-medium text-white transition-all
            ${
              isLoading || settings.models.length === 0
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
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
      )}
    </div>
  );
}
