'use client';

import { useState } from 'react';
import { Bug, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ContentDebuggerProps {
  content: string;
  onContentFixed?: (fixedContent: string) => void;
}

interface DebugResult {
  success: boolean;
  data?: {
    original: {
      contentLength: number;
      imageCount: number;
      images: Array<{
        index: number;
        html: string;
        src: string;
        srcLength: number;
        hasSpecialChars: boolean;
        contextBefore: string;
        contextAfter: string;
        inFigure: boolean;
        inDiv: boolean;
      }>;
      duplicates: Array<{ url: string; count: number }>;
    };
    sanitized: {
      contentLength: number;
      imageCount: number;
      images: Array<any>;
      duplicates: Array<{ url: string; count: number }>;
    };
    comparison: {
      lengthDifference: number;
      contentChanged: boolean;
      imageCountChanged: boolean;
    };
    originalSample: string;
    sanitizedSample: string;
  };
  error?: string;
}

export default function ContentDebugger({
  content,
  onContentFixed,
}: ContentDebuggerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DebugResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const analyzeContent = async () => {
    if (!content) {
      alert('لا يوجد محتوى للتحليل');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/debug-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error analyzing content:', error);
      setResult({
        success: false,
        error: 'حدث خطأ أثناء تحليل المحتوى',
      });
    }
    setIsAnalyzing(false);
  };

  const getStatusIcon = () => {
    if (!result) return null;

    if (!result.success) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }

    if (result.data?.comparison.contentChanged) {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }

    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getStatusMessage = () => {
    if (!result) return '';

    if (!result.success) {
      return result.error || 'فشل التحليل';
    }

    if (result.data?.comparison.contentChanged) {
      return 'تم العثور على مشاكل وإصلاحها';
    }

    return 'المحتوى سليم';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <Bug className="w-5 h-5 text-blue-500" />
          تشخيص المحتوى
        </h3>
        <button
          onClick={analyzeContent}
          disabled={isAnalyzing || !content}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              جاري التحليل...
            </>
          ) : (
            <>
              <Bug className="w-4 h-4" />
              تحليل المحتوى
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          {/* النتيجة العامة */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {getStatusIcon()}
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {getStatusMessage()}
            </span>
          </div>

          {result.success && result.data && (
            <>
              {/* الإحصائيات الأساسية */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    طول المحتوى
                  </div>
                  <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                    {result.data.original.contentLength.toLocaleString()} حرف
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <div className="text-sm text-green-600 dark:text-green-400">
                    عدد الصور
                  </div>
                  <div className="text-lg font-bold text-green-900 dark:text-green-100">
                    {result.data.original.imageCount} صورة
                  </div>
                </div>
              </div>

              {/* التحذيرات */}
              {result.data.original.duplicates.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      صور مكررة
                    </span>
                  </div>
                  <div className="space-y-1">
                    {result.data.original.duplicates.map((dup, index) => (
                      <div
                        key={index}
                        className="text-xs text-yellow-700 dark:text-yellow-300"
                      >
                        {dup.url.substring(0, 50)}... (مكررة {dup.count} مرات)
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* التغييرات */}
              {result.data.comparison.contentChanged && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                      تم إجراء تعديلات
                    </span>
                  </div>
                  <div className="text-xs text-orange-700 dark:text-orange-300 space-y-1">
                    <div>
                      تغيير في الطول: {result.data.comparison.lengthDifference}{' '}
                      حرف
                    </div>
                    {result.data.comparison.imageCountChanged && (
                      <div>تغيير في عدد الصور</div>
                    )}
                  </div>
                </div>
              )}

              {/* تفاصيل الصور */}
              <div>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {showDetails ? 'إخفاء التفاصيل' : 'عرض تفاصيل الصور'}
                </button>

                {showDetails && (
                  <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                    {result.data.original.images.map((img, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs"
                      >
                        <div className="font-medium">صورة {img.index}</div>
                        <div className="text-gray-600 dark:text-gray-400">
                          URL: {img.src.substring(0, 50)}...
                        </div>
                        <div className="flex gap-4 text-gray-500 dark:text-gray-400">
                          <span>الطول: {img.srcLength}</span>
                          <span>
                            أحرف خاصة: {img.hasSpecialChars ? 'نعم' : 'لا'}
                          </span>
                          <span>في Figure: {img.inFigure ? 'نعم' : 'لا'}</span>
                          <span>في Div: {img.inDiv ? 'نعم' : 'لا'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {!result.success && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-800 dark:text-red-200">
                  {result.error}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
