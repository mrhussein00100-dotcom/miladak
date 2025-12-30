'use client';

/**
 * صفحة اختبار للواجهة الجديدة لإعادة الصياغة
 * يمكن الوصول إليها عبر /admin/rewriter/test
 */

import { useState } from 'react';
import {
  RefreshCw,
  FileText,
  Link as LinkIcon,
  Settings,
  Loader,
  Copy,
  Check,
} from 'lucide-react';

export default function TestRewriterPage() {
  const [loading, setLoading] = useState(false);
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');
  const [sourceContent, setSourceContent] = useState('');
  const [rewrittenContent, setRewrittenContent] = useState('');
  const [style, setStyle] = useState('professional');
  const [targetLength, setTargetLength] = useState('same');
  const [provider, setProvider] = useState('groq');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);
  const [useExternal, setUseExternal] = useState(false);

  // حساب عدد الكلمات
  const sourceWordCount = sourceContent
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const rewrittenWordCount = rewrittenContent
    .replace(/<[^>]*>/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

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
        setSuccess('تم جلب المحتوى بنجاح');
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
        setSuccess('تم إعادة الصياغة بنجاح');
        setError('');
      } else {
        setError(data.error || 'حدث خطأ أثناء إعادة الصياغة');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rewrittenContent);
      setCopied(true);
      setSuccess('تم نسخ المحتوى بنجاح');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('فشل في نسخ المحتوى');
    }
  };

  const handleReset = () => {
    setSourceContent('');
    setRewrittenContent('');
    setExternalUrl('');
    setError('');
    setSuccess('');
    setUseExternal(false);
    setCopied(false);
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* العنوان الرئيسي */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  إعادة الصياغة بالذكاء الاصطناعي
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  أعد صياغة المحتوى باستخدام نماذج AI متعددة مع خيارات متقدمة
                </p>
              </div>
            </div>

            {/* الإحصائيات */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {sourceWordCount}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  كلمة أصلية
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {rewrittenWordCount}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  كلمة مُعاد صياغتها
                </div>
              </div>
              {(loading || fetchingUrl) && (
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">جاري المعالجة...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setUseExternal(false)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  !useExternal
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                disabled={loading || fetchingUrl}
              >
                <FileText className="w-4 h-4" />
                إدخال محتوى
              </button>
              <button
                onClick={() => setUseExternal(true)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  useExternal
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                disabled={loading || fetchingUrl}
              >
                <LinkIcon className="w-4 h-4" />
                جلب من رابط
              </button>
            </nav>
          </div>

          {/* URL Input */}
          {useExternal && (
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="الصق رابط المقال هنا... (مثال: https://example.com/article)"
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    onKeyDown={(e) =>
                      e.key === 'Enter' && handleFetchExternal()
                    }
                    disabled={loading || fetchingUrl}
                  />
                  <button
                    onClick={handleFetchExternal}
                    disabled={fetchingUrl || !externalUrl.trim() || loading}
                    className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    {fetchingUrl ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        جلب...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-4 h-4" />
                        جلب المقال
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Settings */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  إعدادات إعادة الصياغة
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    أسلوب الصياغة
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    disabled={loading || fetchingUrl}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="professional">احترافي</option>
                    <option value="simple">بسيط</option>
                    <option value="creative">إبداعي</option>
                    <option value="academic">أكاديمي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    طول المحتوى
                  </label>
                  <select
                    value={targetLength}
                    onChange={(e) => setTargetLength(e.target.value)}
                    disabled={loading || fetchingUrl}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="shorter">أقصر (30% أقل)</option>
                    <option value="same">نفس الطول</option>
                    <option value="longer">أطول (30% أكثر)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    نموذج الذكاء الاصطناعي
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    disabled={loading || fetchingUrl}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <optgroup label="🌟 SONA (محلي)">
                      <option value="sona-v6">
                        🌟 SONA 6.0 (المنسق الذكي)
                      </option>
                      <option value="sona-v5">⭐ SONA 5.0</option>
                      <option value="sona-enhanced">🚀 SONA 4.01</option>
                      <option value="sona">🟢 SONA v4</option>
                    </optgroup>
                    <optgroup label="☁️ سحابي">
                      <option value="groq">🟢 Groq (أسرع)</option>
                      <option value="gemini">🟢 Gemini (أذكى)</option>
                      <option value="cohere">🟢 Cohere</option>
                      <option value="huggingface">🟢 HuggingFace</option>
                    </optgroup>
                    <optgroup label="🖥️ محلي">
                      <option value="local">🟢 Local AI</option>
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
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

                {!useExternal ? (
                  <textarea
                    value={sourceContent}
                    onChange={(e) => setSourceContent(e.target.value)}
                    placeholder="الصق أو اكتب المحتوى هنا..."
                    className="flex-1 min-h-[400px] px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900 dark:text-white"
                    disabled={loading || fetchingUrl}
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
                      <p className="text-sm">
                        سيظهر المحتوى المُعاد صياغته هنا
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {(error || success) && (
            <div className="px-6 pb-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                        حدث خطأ
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-400">
                        {error}
                      </p>
                    </div>
                    <button
                      onClick={clearMessages}
                      className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 p-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                        تم بنجاح
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-400">
                        {success}
                      </p>
                    </div>
                    <button
                      onClick={clearMessages}
                      className="text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 p-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
                disabled={loading || fetchingUrl}
              >
                بدء جديد
              </button>

              <div className="flex gap-3">
                {rewrittenContent && (
                  <button
                    onClick={handleCopy}
                    className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
                    disabled={loading || fetchingUrl}
                  >
                    <Copy className="w-4 h-4" />
                    نسخ النتيجة
                  </button>
                )}
                <button
                  onClick={handleRewrite}
                  disabled={loading || fetchingUrl || !sourceContent.trim()}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
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
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              4 أساليب
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              احترافي، بسيط، إبداعي، أكاديمي
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-2xl mb-2">📏</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              3 أطوال
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              أقصر، نفس الطول، أطول
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-2xl mb-2">🔗</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              جلب من الروابط
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              استخراج المحتوى من المواقع
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              نماذج متعددة
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Groq (سريع) و Gemini (ذكي)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
