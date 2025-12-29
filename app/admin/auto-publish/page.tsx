'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Save,
  Play,
  RefreshCw,
  CheckCircle,
  XCircle,
  Sparkles,
} from 'lucide-react';

interface AutoPublishSettings {
  is_enabled: number;
  publish_time: string;
  frequency: 'daily' | 'weekly';
  topics: string;
  default_category_id: number | null;
  ai_provider: string;
  content_length: string;
  last_run: string | null;
}

interface PublishLog {
  id: number;
  article_id: number | null;
  status: 'success' | 'failed' | 'retry';
  error_message: string | null;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

export default function AutoPublishPage() {
  const [settings, setSettings] = useState<AutoPublishSettings | null>(null);
  const [logs, setLogs] = useState<PublishLog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);

  // بيانات النموذج
  const [enabled, setEnabled] = useState(false);
  const [publishTime, setPublishTime] = useState('09:00');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [topics, setTopics] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [provider, setProvider] = useState('gemini');
  const [contentLength, setContentLength] = useState('medium');

  // جلب البيانات
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, logsRes, categoriesRes] = await Promise.all([
          fetch('/api/admin/auto-publish'),
          fetch('/api/admin/auto-publish/logs'),
          fetch('/api/admin/categories'),
        ]);

        const settingsData = await settingsRes.json();
        const logsData = await logsRes.json();
        const categoriesData = await categoriesRes.json();

        if (settingsData.success && settingsData.data) {
          const s = settingsData.data;
          setSettings(s);
          setEnabled(s.is_enabled === 1);
          setPublishTime(s.publish_time || '09:00');
          setFrequency(s.frequency || 'daily');
          setTopics(s.topics ? JSON.parse(s.topics).join('\n') : '');
          setCategoryId(s.default_category_id);
          setProvider(s.ai_provider || 'gemini');
          setContentLength(s.content_length || 'medium');
        }

        if (logsData.success) {
          setLogs(logsData.data || []);
        }

        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // حفظ الإعدادات
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/auto-publish', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_enabled: enabled,
          publish_time: publishTime,
          frequency,
          topics: topics.split('\n').filter((t) => t.trim()),
          default_category_id: categoryId,
          ai_provider: provider,
          content_length: contentLength,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('تم حفظ الإعدادات بنجاح');
      } else {
        alert(data.error || 'فشل في حفظ الإعدادات');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('حدث خطأ أثناء الحفظ');
    }
    setSaving(false);
  };

  // تشغيل النشر يدوياً
  const handleRun = async () => {
    if (!confirm('هل تريد تشغيل النشر التلقائي الآن؟')) return;

    setRunning(true);
    try {
      const res = await fetch('/api/admin/auto-publish/run', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        alert('تم النشر بنجاح!');
        // إعادة جلب السجلات
        const logsRes = await fetch('/api/admin/auto-publish/logs');
        const logsData = await logsRes.json();
        if (logsData.success) {
          setLogs(logsData.data || []);
        }
      } else {
        alert(data.error || 'فشل في النشر');
      }
    } catch (error) {
      console.error('Run error:', error);
      alert('حدث خطأ أثناء النشر');
    }
    setRunning(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/admin"
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-500" />
                النشر التلقائي
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                إعدادات النشر التلقائي اليومي للمقالات
              </p>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={handleRun}
              disabled={running}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 text-sm"
            >
              {running ? (
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              <span className="hidden xs:inline">تشغيل الآن</span>
              <span className="xs:hidden">تشغيل</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 text-sm"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              حفظ
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              الإعدادات
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <label
                  htmlFor="enabled"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  تفعيل النشر التلقائي
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  وقت النشر
                </label>
                <input
                  type="time"
                  value={publishTime}
                  onChange={(e) => setPublishTime(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  التكرار
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                >
                  <option value="daily">يومياً</option>
                  <option value="weekly">أسبوعياً</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  التصنيف الافتراضي
                </label>
                <select
                  value={categoryId || ''}
                  onChange={(e) =>
                    setCategoryId(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                >
                  <option value="">اختر تصنيف</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  مزود الذكاء الاصطناعي
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                >
                  <option value="gemini">Gemini (مجاني)</option>
                  <option value="local">المولد المحلي</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  طول المحتوى
                </label>
                <select
                  value={contentLength}
                  onChange={(e) => setContentLength(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                >
                  <option value="short">قصير (500 كلمة)</option>
                  <option value="medium">متوسط (1500 كلمة)</option>
                  <option value="long">طويل (3000 كلمة)</option>
                  <option value="comprehensive">شامل (5000+ كلمة)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  المواضيع (موضوع في كل سطر)
                </label>
                <textarea
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                  placeholder="عيد ميلاد سعيد&#10;برج الحمل&#10;حساب العمر"
                  rows={5}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Logs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              سجل النشر
            </h2>

            {logs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد سجلات بعد</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-xl border ${
                      log.status === 'success'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {log.status === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className="text-sm font-medium">
                        {log.status === 'success' ? 'نجح' : 'فشل'}
                      </span>
                      <span className="text-xs text-gray-500 mr-auto">
                        {new Date(log.created_at).toLocaleString('ar-SA')}
                      </span>
                    </div>
                    {log.error_message && (
                      <p className="text-xs text-red-600 mt-1">
                        {log.error_message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
