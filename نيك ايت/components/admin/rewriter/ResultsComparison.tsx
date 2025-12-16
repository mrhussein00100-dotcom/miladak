'use client';

/**
 * مكون مقارنة نتائج إعادة الصياغة
 */

import { useState } from 'react';
import QualityMetrics from './QualityMetrics';
import type {
  RewriteResult,
  GeneratedImage,
  AI_PROVIDER_LABELS,
} from '@/types/rewriter';

interface ResultsComparisonProps {
  results: RewriteResult[];
  originalContent: string;
  images?: GeneratedImage[];
  onTransferToEditor: (result: RewriteResult) => void;
  onClear: () => void;
}

const PROVIDER_LABELS: Record<string, string> = {
  gemini: 'Gemini',
  groq: 'Groq',
  cohere: 'Cohere',
  huggingface: 'HuggingFace',
  local: 'Local (SONA)',
};

export default function ResultsComparison({
  results,
  originalContent,
  images,
  onTransferToEditor,
  onClear,
}: ResultsComparisonProps) {
  const [selectedResult, setSelectedResult] = useState<string>(
    results[0]?.id || ''
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (result: RewriteResult) => {
    try {
      await navigator.clipboard.writeText(result.content);
      setCopiedId(result.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const selected = results.find((r) => r.id === selectedResult);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* العنوان */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <span>📊</span>
          نتائج إعادة الصياغة ({results.length} نموذج)
        </h2>
        <button
          onClick={onClear}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          مسح النتائج
        </button>
      </div>

      {/* تبويبات النماذج */}
      <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="flex">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => setSelectedResult(result.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${
                  selectedResult === result.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                }
              `}
            >
              <span className="text-lg">
                {result.model === 'gemini' && '🌟'}
                {result.model === 'groq' && '⚡'}
                {result.model === 'cohere' && '🔮'}
                {result.model === 'huggingface' && '🤗'}
                {result.model === 'local' && '🏠'}
              </span>
              {PROVIDER_LABELS[result.model] || result.model}
              <span
                className={`
                px-2 py-0.5 rounded-full text-xs
                ${
                  result.qualityScore >= 80
                    ? 'bg-green-100 text-green-700'
                    : result.qualityScore >= 60
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }
              `}
              >
                {result.qualityScore}%
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* محتوى النتيجة المختارة */}
      {selected && (
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* المحتوى */}
            <div className="lg:col-span-2 space-y-4">
              {/* العنوان */}
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  العنوان
                </label>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  {selected.title}
                </h3>
              </div>

              {/* المحتوى */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-500 dark:text-gray-400">
                    المحتوى
                  </label>
                  <span className="text-sm text-gray-500">
                    {selected.wordCount} كلمة
                  </span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {selected.content}
                  </div>
                </div>
              </div>

              {/* الكلمات المفتاحية */}
              {selected.keywords.length > 0 && (
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
                    الكلمات المفتاحية
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selected.keywords.map((keyword, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* وصف Meta */}
              {selected.metaDescription && (
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">
                    وصف Meta
                  </label>
                  <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm">
                    {selected.metaDescription}
                  </p>
                </div>
              )}
            </div>

            {/* الجودة والأزرار */}
            <div className="space-y-4">
              {/* مقاييس الجودة */}
              <QualityMetrics
                qualityScore={selected.qualityScore}
                readabilityScore={selected.readabilityScore}
                seoScore={selected.seoScore}
                uniquenessScore={selected.uniquenessScore}
              />

              {/* معلومات إضافية */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  معلومات
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">وقت التوليد</span>
                    <span className="text-gray-900 dark:text-white">
                      {(selected.generationTime / 1000).toFixed(1)}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">عدد الكلمات</span>
                    <span className="text-gray-900 dark:text-white">
                      {selected.wordCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="space-y-2">
                <button
                  onClick={() => onTransferToEditor(selected)}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>📝</span>
                    نقل إلى المحرر
                  </span>
                </button>

                <button
                  onClick={() => handleCopy(selected)}
                  className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  <span className="flex items-center justify-center gap-2">
                    {copiedId === selected.id ? (
                      <>
                        <span>✅</span>
                        تم النسخ!
                      </>
                    ) : (
                      <>
                        <span>📋</span>
                        نسخ المحتوى
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* الصور المولدة */}
      {images && images.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            الصور المولدة ({images.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.thumbnailUrl || image.url}
                  alt={image.alt}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <a
                    href={image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-sm"
                  >
                    عرض
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
