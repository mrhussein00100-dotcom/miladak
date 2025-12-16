'use client';

import { useState } from 'react';
import {
  X,
  RefreshCw,
  Loader,
  Link as LinkIcon,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArticleRewriterProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: string;
  onRewrite: (rewrittenContent: string) => void;
}

export default function ArticleRewriter({
  isOpen,
  onClose,
  currentContent,
  onRewrite,
}: ArticleRewriterProps) {
  const [loading, setLoading] = useState(false);
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');
  const [sourceContent, setSourceContent] = useState(currentContent);
  const [rewrittenContent, setRewrittenContent] = useState('');
  const [style, setStyle] = useState('professional');
  const [targetLength, setTargetLength] = useState('same');
  const [provider, setProvider] = useState('groq');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [useExternal, setUseExternal] = useState(false);

  const handleFetchExternal = async () => {
    if (!externalUrl.trim()) {
      setError('الرجاء إدخال رابط المقال');
      return;
    }

    setFetchingUrl(true);
    setError('');
    setSourceContent('');

    try {
      const response = await fetch('/api/ai/fetch-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: externalUrl.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setSourceContent(data.content);
        setError('');
      } else {
        setError(data.error || 'فشل جلب المقال');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setFetchingUrl(false);
    }
  };

  const handleRewrite = async () => {
    if (!sourceContent.trim()) {
      setError('لا يوجد محتوى لإعادة صياغته');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/rewrite-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: sourceContent,
          style,
          targetLength,
          provider,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRewrittenContent(data.rewritten_content);
      } else {
        setError(data.error || 'حدث خطأ أثناء إعادة الصياغة');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const handleUseRewritten = () => {
    if (rewrittenContent) {
      onRewrite(rewrittenContent);
      onClose();
    }
  };

  const handleUseRewrittenWithFormatting = async () => {
    if (rewrittenContent) {
      try {
        const { applyCompleteFormatting } = await import(
          '@/lib/utils/smartFormatter'
        );
        const formatted = applyCompleteFormatting(rewrittenContent, {
          addTOC: true,
        });
        onRewrite(formatted);
        onClose();
      } catch (error) {
        console.error('Formatting error:', error);
        // العودة للمحتوى غير المنسق في حالة الخطأ
        onRewrite(rewrittenContent);
        onClose();
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rewrittenContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSourceContent(currentContent);
    setRewrittenContent('');
    setExternalUrl('');
    setError('');
    setUseExternal(false);
    setCopied(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />

          {/* Modal - Clean Simple Design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 bg-white dark:bg-gray-900 rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Simple Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                إعادة الصياغة بالذكاء الاصطناعي
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  بدء جديد
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Simple Tabs */}
            <div className="flex gap-2 px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <button
                onClick={() => setUseExternal(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !useExternal
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FileText className="w-4 h-4 inline-block ml-2" />
                إدخال محتوى
              </button>
              <button
                onClick={() => setUseExternal(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  useExternal
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <LinkIcon className="w-4 h-4 inline-block ml-2" />
                جلب من رابط
              </button>
            </div>

            {/* URL Input (if external) */}
            {useExternal && (
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-800">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="الصق رابط المقال هنا..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) =>
                      e.key === 'Enter' && handleFetchExternal()
                    }
                  />
                  <button
                    onClick={handleFetchExternal}
                    disabled={fetchingUrl || !externalUrl.trim()}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    {fetchingUrl ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        جلب...
                      </>
                    ) : (
                      'جلب المقال'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Options */}
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-800">
              <div className="grid grid-cols-3 gap-3">
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="professional">احترافي</option>
                  <option value="simple">بسيط</option>
                  <option value="creative">إبداعي</option>
                  <option value="academic">أكاديمي</option>
                </select>

                <select
                  value={targetLength}
                  onChange={(e) => setTargetLength(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="shorter">أقصر</option>
                  <option value="same">نفس الطول</option>
                  <option value="longer">أطول</option>
                </select>

                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="groq">Groq (أسرع)</option>
                  <option value="gemini">Gemini (أذكى)</option>
                </select>
              </div>
            </div>

            {/* Content Area - Side by Side */}
            <div className="flex-1 flex overflow-hidden">
              {/* Before */}
              <div className="flex-1 flex flex-col border-l border-gray-200 dark:border-gray-800">
                <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    قبل
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {!useExternal ? (
                    <textarea
                      value={sourceContent}
                      onChange={(e) => setSourceContent(e.target.value)}
                      placeholder="الصق أو اكتب المحتوى هنا..."
                      className="w-full h-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-[15px]"
                    />
                  ) : (
                    <div className="prose dark:prose-invert prose-lg max-w-none">
                      {sourceContent ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: sourceContent }}
                        />
                      ) : (
                        <div className="text-center text-gray-400 py-20">
                          <LinkIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p className="text-sm">أدخل رابط واضغط جلب</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* After */}
              <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900/50">
                <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    بعد
                  </span>
                  {rewrittenContent && (
                    <button
                      onClick={handleCopy}
                      className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      {copied ? (
                        <Check className="w-3 h-3 inline" />
                      ) : (
                        <Copy className="w-3 h-3 inline" />
                      )}
                      {copied ? ' نُسخ' : ' نسخ'}
                    </button>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {rewrittenContent ? (
                    <div className="prose dark:prose-invert prose-lg max-w-none">
                      <div
                        dangerouslySetInnerHTML={{ __html: rewrittenContent }}
                      />
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-20">
                      <RefreshCw className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">
                        سيظهر المحتوى المُعاد صياغته هنا
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-6 mb-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Simple Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                إلغاء
              </button>
              <div className="flex gap-3">
                {rewrittenContent && (
                  <>
                    <button
                      onClick={handleUseRewritten}
                      className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                    >
                      استخدام المحتوى
                    </button>
                    <button
                      onClick={handleUseRewrittenWithFormatting}
                      className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      استخدام + تنسيق ذكي
                    </button>
                  </>
                )}
                <button
                  onClick={handleRewrite}
                  disabled={loading || !sourceContent.trim()}
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      جاري الصياغة...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      إعادة الصياغة
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
