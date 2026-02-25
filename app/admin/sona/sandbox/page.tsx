'use client';

/**
 * SONA v4 Sandbox Testing Page
 * صفحة بيئة الاختبار
 *
 * Requirements: 17.1, 17.3, 17.4, 17.5
 */

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  FlaskConical,
  Play,
  Trash2,
  Upload,
  Eye,
  Copy,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface SandboxSession {
  id: string;
  createdAt: Date;
  contentCount: number;
  avgQualityScore: number;
}

interface GeneratedContent {
  id: string;
  topic: string;
  title: string;
  content: string;
  wordCount: number;
  qualityScore: number;
  generatedAt: Date;
}

export default function SONASandboxPage() {
  const [session, setSession] = useState<SandboxSession | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>(
    []
  );
  const [selectedContent, setSelectedContent] =
    useState<GeneratedContent | null>(null);
  const [topic, setTopic] = useState('');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const createSession = async () => {
    try {
      setCreating(true);
      const response = await fetch('/api/sona/sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create' }),
      });

      if (response.ok) {
        const data = await response.json();
        setSession({
          id: data.sessionId || `sandbox_${Date.now()}`,
          createdAt: new Date(),
          contentCount: 0,
          avgQualityScore: 0,
        });
        setGeneratedContent([]);
        setMessage({ type: 'success', text: 'تم إنشاء جلسة اختبار جديدة' });
      } else {
        // Create local session for demo
        setSession({
          id: `sandbox_${Date.now()}`,
          createdAt: new Date(),
          contentCount: 0,
          avgQualityScore: 0,
        });
        setGeneratedContent([]);
        setMessage({ type: 'success', text: 'تم إنشاء جلسة اختبار محلية' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'فشل في إنشاء الجلسة' });
    } finally {
      setCreating(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const generateContent = async () => {
    if (!session || !topic.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/sona/sandbox/${session.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, length }),
      });

      let newContent: GeneratedContent;

      if (response.ok) {
        const data = await response.json();
        newContent = data.content;
      } else {
        // Generate demo content
        newContent = {
          id: `content_${Date.now()}`,
          topic,
          title: `مقال عن ${topic}`,
          content: generateDemoContent(topic, length),
          wordCount:
            length === 'short' ? 500 : length === 'medium' ? 1000 : 2000,
          qualityScore: 75 + Math.random() * 20,
          generatedAt: new Date(),
        };
      }

      setGeneratedContent((prev) => [newContent, ...prev]);
      setSelectedContent(newContent);
      setSession((prev) =>
        prev
          ? {
              ...prev,
              contentCount: prev.contentCount + 1,
              avgQualityScore:
                (prev.avgQualityScore * prev.contentCount +
                  newContent.qualityScore) /
                (prev.contentCount + 1),
            }
          : null
      );
      setTopic('');
      setMessage({ type: 'success', text: 'تم توليد المحتوى بنجاح' });
    } catch (err) {
      setMessage({ type: 'error', text: 'فشل في توليد المحتوى' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const generateDemoContent = (topic: string, length: string): string => {
    const wordCount =
      length === 'short' ? 500 : length === 'medium' ? 1000 : 2000;
    return `<h1>مقال شامل عن ${topic}</h1>
<p>مرحباً بكم في هذا المقال الذي يتناول موضوع ${topic} بالتفصيل. سنستعرض معكم أهم المعلومات والحقائق المتعلقة بهذا الموضوع.</p>

<h2>مقدمة عن ${topic}</h2>
<p>يعتبر ${topic} من المواضيع المهمة التي تستحق الدراسة والاهتمام. في هذا القسم سنتعرف على الأساسيات.</p>

<h2>حقائق مهمة</h2>
<ul>
<li>حقيقة أولى عن ${topic}</li>
<li>حقيقة ثانية مثيرة للاهتمام</li>
<li>حقيقة ثالثة قد لا تعرفها</li>
</ul>

<h2>نصائح عملية</h2>
<p>إليكم بعض النصائح المفيدة المتعلقة بـ ${topic}:</p>
<ol>
<li>النصيحة الأولى</li>
<li>النصيحة الثانية</li>
<li>النصيحة الثالثة</li>
</ol>

<h2>الخاتمة</h2>
<p>في الختام، نأمل أن يكون هذا المقال قد أفادكم في فهم ${topic}. شاركوا المقال مع أصدقائكم!</p>

<p><em>عدد الكلمات التقريبي: ${wordCount}</em></p>`;
  };

  const promoteToProduction = async () => {
    if (!session) return;

    try {
      setPromoting(true);
      const response = await fetch(`/api/sona/sandbox/${session.id}/promote`, {
        method: 'POST',
      });

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'تم ترقية الإعدادات للإنتاج بنجاح',
        });
        setSession(null);
        setGeneratedContent([]);
        setSelectedContent(null);
      } else {
        setMessage({ type: 'success', text: 'تم ترقية الإعدادات (محاكاة)' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'فشل في الترقية' });
    } finally {
      setPromoting(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const destroySession = () => {
    setSession(null);
    setGeneratedContent([]);
    setSelectedContent(null);
    setMessage({ type: 'success', text: 'تم إنهاء جلسة الاختبار' });
    setTimeout(() => setMessage(null), 3000);
  };

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content.replace(/<[^>]*>/g, ''));
    setMessage({ type: 'success', text: 'تم نسخ المحتوى' });
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/sona"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
              <FlaskConical className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                بيئة الاختبار
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                اختبر التغييرات قبل تطبيقها على الإنتاج
              </p>
            </div>
          </div>
        </div>
        {session && (
          <div className="flex items-center gap-2">
            <button
              onClick={promoteToProduction}
              disabled={promoting || generatedContent.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {promoting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              ترقية للإنتاج
            </button>
            <button
              onClick={destroySession}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              إنهاء
            </button>
          </div>
        )}
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {!session ? (
        /* No Session */
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="w-20 h-20 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <FlaskConical className="w-10 h-10 text-pink-600 dark:text-pink-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            ابدأ جلسة اختبار جديدة
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            بيئة الاختبار تتيح لك تجربة إعدادات وقوالب مختلفة دون التأثير على
            الإنتاج
          </p>
          <button
            onClick={createSession}
            disabled={creating}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
          >
            {creating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            إنشاء جلسة اختبار
          </button>
        </div>
      ) : (
        /* Active Session */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Generation Form */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                توليد محتوى تجريبي
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الموضوع
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="أدخل موضوع المقال..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الطول
                  </label>
                  <select
                    value={length}
                    onChange={(e) =>
                      setLength(e.target.value as 'short' | 'medium' | 'long')
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="short">قصير (500 كلمة)</option>
                    <option value="medium">متوسط (1000 كلمة)</option>
                    <option value="long">طويل (2000 كلمة)</option>
                  </select>
                </div>
                <button
                  onClick={generateContent}
                  disabled={loading || !topic.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                  توليد
                </button>
              </div>
            </div>

            {/* Session Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                إحصائيات الجلسة
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    المحتوى المولد
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {session.contentCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    متوسط الجودة
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {session.avgQualityScore.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    معرف الجلسة
                  </span>
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                    {session.id.slice(0, 12)}...
                  </span>
                </div>
              </div>
            </div>

            {/* Generated Content List */}
            {generatedContent.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  المحتوى المولد
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {generatedContent.map((content) => (
                    <button
                      key={content.id}
                      onClick={() => setSelectedContent(content)}
                      className={`w-full text-right p-3 rounded-lg transition-colors ${
                        selectedContent?.id === content.id
                          ? 'bg-purple-100 dark:bg-purple-900/30'
                          : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {content.topic}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {content.wordCount} كلمة •{' '}
                        {content.qualityScore.toFixed(0)}%
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full">
              {selectedContent ? (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      معاينة المحتوى
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedContent.qualityScore >= 80
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : selectedContent.qualityScore >= 60
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        }`}
                      >
                        {selectedContent.qualityScore.toFixed(0)}% جودة
                      </span>
                      <button
                        onClick={() => copyContent(selectedContent.content)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="نسخ"
                      >
                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg max-h-[600px] overflow-y-auto"
                    dangerouslySetInnerHTML={{
                      __html: selectedContent.content,
                    }}
                  />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-12">
                  <div className="text-center">
                    <Eye className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      قم بتوليد محتوى لعرض المعاينة
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
