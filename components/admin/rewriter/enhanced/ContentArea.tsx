/**
 * مكون منطقة المحتوى - عرض وتحرير المحتوى الأصلي والمُعاد صياغته
 */

'use client';

import {
  RefreshCw,
  Link as LinkIcon,
  Copy,
  Check,
  Tag,
  Hash,
  Edit3,
  Code,
  Eye,
} from 'lucide-react';
import { useState } from 'react';
import type { ContentAreaProps } from '@/types/rewriter-enhanced';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function ContentArea({
  title,
  sourceContent,
  rewrittenContent,
  rewrittenTitle,
  isTextMode,
  onTitleChange,
  onSourceChange,
  isLoading,
  generatedMeta,
  modelUsed,
}: ContentAreaProps) {
  const [copied, setCopied] = useState(false);
  const [editorMode, setEditorMode] = useState<'visual' | 'html' | 'preview'>(
    'visual'
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rewrittenContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // تنظيف العنوان من أي نصوص إضافية
  const cleanTitle = (title: string) => {
    if (!title) return '';

    return title
      .replace(
        /^(العنوان|عنوان|النص|المقترح|الجديد|المُعاد|صياغته|المعاد|كتابته)[:\-\s]*/gi,
        ''
      )
      .replace(/["""]/g, '')
      .replace(/^[:\-\s]+/g, '')
      .replace(/\n+/g, ' ')
      .trim();
  };

  const sourceWordCount = sourceContent
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const rewrittenWordCount = rewrittenContent
    .replace(/<[^>]*>/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Original Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            العنوان الأصلي
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="أدخل عنوان المقال..."
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg font-semibold"
          />
        </div>

        {/* Rewritten Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            العنوان المُعاد صياغته
            {modelUsed && (
              <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">
                {modelUsed}
              </span>
            )}
          </label>
          <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-900/50 dark:border-gray-600 dark:text-white text-lg font-semibold min-h-[52px] flex items-center">
            {rewrittenTitle ? (
              cleanTitle(rewrittenTitle)
            ) : (
              <span className="text-gray-400 italic">
                سيظهر العنوان المُعاد صياغته هنا
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Content */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              المحتوى الأصلي
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {sourceWordCount} كلمة
            </span>
          </div>

          {isTextMode ? (
            <textarea
              value={sourceContent}
              onChange={(e) => onSourceChange(e.target.value)}
              placeholder="الصق أو اكتب المحتوى هنا..."
              className="flex-1 min-h-[400px] px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900 dark:text-white"
              disabled={isLoading}
            />
          ) : (
            <div className="flex-1 min-h-[400px] px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-y-auto">
              {sourceContent ? (
                <div
                  className="prose dark:prose-invert prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: sourceContent }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <LinkIcon className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-sm">أدخل رابط واضغط جلب</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rewritten Content */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              المحتوى المُعاد صياغته
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {rewrittenWordCount} كلمة
              </span>
              {rewrittenContent && (
                <button
                  onClick={handleCopy}
                  className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
                >
                  {copied ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copied ? 'نُسخ' : 'نسخ'}
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 min-h-[400px] px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
            {rewrittenContent ? (
              <div
                className="prose dark:prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: rewrittenContent }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <RefreshCw className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">سيظهر المحتوى المُعاد صياغته هنا</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* محرر المحتوى المُعاد صياغته - للتعديل قبل النشر */}
      {rewrittenContent && (
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-500" />
              تحرير المحتوى قبل النشر
            </h3>

            {/* تبديل نوع المحرر */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setEditorMode('visual')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  editorMode === 'visual'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                محرر مرئي
              </button>
              <button
                onClick={() => setEditorMode('html')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  editorMode === 'html'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Code className="w-4 h-4" />
                HTML
              </button>
              <button
                onClick={() => setEditorMode('preview')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  editorMode === 'preview'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4" />
                معاينة
              </button>
            </div>
          </div>

          {editorMode === 'visual' ? (
            <RichTextEditor
              value={rewrittenContent}
              onChange={() => {}} // للقراءة فقط حالياً - يمكن تفعيل التعديل لاحقاً
              placeholder="المحتوى المُعاد صياغته..."
              minHeight="400px"
            />
          ) : editorMode === 'html' ? (
            <textarea
              value={rewrittenContent}
              readOnly
              className="w-full min-h-[400px] px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 font-mono text-sm"
              dir="ltr"
            />
          ) : (
            <div
              className="prose prose-lg dark:prose-invert max-w-none p-4 bg-gray-50 dark:bg-gray-900 rounded-xl min-h-[400px]"
              dangerouslySetInnerHTML={{ __html: rewrittenContent }}
            />
          )}
        </div>
      )}

      {/* Generated Meta & SEO */}
      {generatedMeta && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            الميتا والسيو المولد تلقائياً
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                عنوان الميتا
              </label>
              <div className="p-2 bg-white dark:bg-gray-800 rounded border text-sm">
                {generatedMeta.metaTitle}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                الرابط (Slug)
              </label>
              <div className="p-2 bg-white dark:bg-gray-800 rounded border text-sm">
                {generatedMeta.slug}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                وصف الميتا
              </label>
              <div className="p-2 bg-white dark:bg-gray-800 rounded border text-sm">
                {generatedMeta.metaDescription}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-1 text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                <Hash className="w-4 h-4" />
                الكلمات المفتاحية
              </label>
              <div className="flex flex-wrap gap-2">
                {generatedMeta.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
