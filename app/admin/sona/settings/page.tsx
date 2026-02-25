'use client';

/**
 * SONA v4 Settings Page
 * صفحة إعدادات SONA
 *
 * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Save,
  RotateCcw,
  Settings,
  FileText,
  Sparkles,
  Target,
  Gauge,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface SONASettings {
  articleLength: 'short' | 'medium' | 'long' | 'comprehensive';
  wordCountTargets: {
    short: number;
    medium: number;
    long: number;
    comprehensive: number;
  };
  keywordDensity: number;
  minKeywordOccurrences: number;
  maxKeywordOccurrences: number;
  minQualityScore: number;
  maxRetries: number;
  diversityLevel: 'low' | 'medium' | 'high' | 'maximum';
  templateRotation: boolean;
  enableSynonymReplacement: boolean;
  enableSentenceVariation: boolean;
  enableFAQGeneration: boolean;
  enableTipsGeneration: boolean;
  enableCTAs: boolean;
}

const DEFAULT_SETTINGS: SONASettings = {
  articleLength: 'medium',
  wordCountTargets: {
    short: 500,
    medium: 1000,
    long: 2000,
    comprehensive: 3000,
  },
  keywordDensity: 3,
  minKeywordOccurrences: 3,
  maxKeywordOccurrences: 5,
  minQualityScore: 70,
  maxRetries: 3,
  diversityLevel: 'high',
  templateRotation: true,
  enableSynonymReplacement: true,
  enableSentenceVariation: true,
  enableFAQGeneration: true,
  enableTipsGeneration: true,
  enableCTAs: true,
};

export default function SONASettingsPage() {
  const [settings, setSettings] = useState<SONASettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sona/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings({ ...DEFAULT_SETTINGS, ...data.data });
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/sona/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'تم حفظ الإعدادات بنجاح' });
      } else {
        throw new Error('فشل في حفظ الإعدادات');
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'حدث خطأ',
      });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    setMessage({
      type: 'success',
      text: 'تم إعادة الإعدادات للقيم الافتراضية',
    });
    setTimeout(() => setMessage(null), 3000);
  };

  const updateSetting = <K extends keyof SONASettings>(
    key: K,
    value: SONASettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

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
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                إعدادات SONA
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                تخصيص سلوك نظام التوليد
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetSettings}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            إعادة تعيين
          </button>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'جاري الحفظ...' : 'حفظ'}
          </button>
        </div>
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

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Article Settings */}
        <SettingsCard
          title="إعدادات المقال"
          icon={<FileText className="w-5 h-5" />}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                طول المقال الافتراضي
              </label>
              <select
                value={settings.articleLength}
                onChange={(e) =>
                  updateSetting(
                    'articleLength',
                    e.target.value as SONASettings['articleLength']
                  )
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="short">
                  قصير ({settings.wordCountTargets.short} كلمة)
                </option>
                <option value="medium">
                  متوسط ({settings.wordCountTargets.medium} كلمة)
                </option>
                <option value="long">
                  طويل ({settings.wordCountTargets.long} كلمة)
                </option>
                <option value="comprehensive">
                  شامل ({settings.wordCountTargets.comprehensive} كلمة)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                مستوى التنوع
              </label>
              <select
                value={settings.diversityLevel}
                onChange={(e) =>
                  updateSetting(
                    'diversityLevel',
                    e.target.value as SONASettings['diversityLevel']
                  )
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="low">منخفض</option>
                <option value="medium">متوسط</option>
                <option value="high">عالي</option>
                <option value="maximum">أقصى</option>
              </select>
            </div>
          </div>
        </SettingsCard>

        {/* SEO Settings */}
        <SettingsCard title="إعدادات SEO" icon={<Target className="w-5 h-5" />}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                كثافة الكلمات المفتاحية (%)
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={settings.keywordDensity}
                onChange={(e) =>
                  updateSetting('keywordDensity', parseFloat(e.target.value))
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>1%</span>
                <span className="font-medium text-purple-600">
                  {settings.keywordDensity}%
                </span>
                <span>5%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الحد الأدنى للتكرار
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.minKeywordOccurrences}
                  onChange={(e) =>
                    updateSetting(
                      'minKeywordOccurrences',
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الحد الأقصى للتكرار
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={settings.maxKeywordOccurrences}
                  onChange={(e) =>
                    updateSetting(
                      'maxKeywordOccurrences',
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </SettingsCard>

        {/* Quality Settings */}
        <SettingsCard
          title="إعدادات الجودة"
          icon={<Gauge className="w-5 h-5" />}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الحد الأدنى لدرجة الجودة (%)
              </label>
              <input
                type="range"
                min="50"
                max="90"
                step="5"
                value={settings.minQualityScore}
                onChange={(e) =>
                  updateSetting('minQualityScore', parseInt(e.target.value))
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>50%</span>
                <span className="font-medium text-purple-600">
                  {settings.minQualityScore}%
                </span>
                <span>90%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الحد الأقصى لإعادة المحاولة
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.maxRetries}
                onChange={(e) =>
                  updateSetting('maxRetries', parseInt(e.target.value))
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </SettingsCard>

        {/* Feature Toggles */}
        <SettingsCard title="الميزات" icon={<Sparkles className="w-5 h-5" />}>
          <div className="space-y-3">
            <ToggleOption
              label="تدوير القوالب"
              description="استخدام قوالب مختلفة في كل مرة"
              enabled={settings.templateRotation}
              onChange={(v) => updateSetting('templateRotation', v)}
            />
            <ToggleOption
              label="استبدال المرادفات"
              description="تنويع الكلمات باستخدام المرادفات"
              enabled={settings.enableSynonymReplacement}
              onChange={(v) => updateSetting('enableSynonymReplacement', v)}
            />
            <ToggleOption
              label="تنويع الجمل"
              description="تغيير طول وبنية الجمل"
              enabled={settings.enableSentenceVariation}
              onChange={(v) => updateSetting('enableSentenceVariation', v)}
            />
            <ToggleOption
              label="توليد الأسئلة الشائعة"
              description="إضافة قسم FAQ للمقالات"
              enabled={settings.enableFAQGeneration}
              onChange={(v) => updateSetting('enableFAQGeneration', v)}
            />
            <ToggleOption
              label="توليد النصائح"
              description="إضافة نصائح عملية للمقالات"
              enabled={settings.enableTipsGeneration}
              onChange={(v) => updateSetting('enableTipsGeneration', v)}
            />
            <ToggleOption
              label="دعوات للعمل (CTA)"
              description="إضافة روابط لأدوات ميلادك"
              enabled={settings.enableCTAs}
              onChange={(v) => updateSetting('enableCTAs', v)}
            />
          </div>
        </SettingsCard>
      </div>
    </div>
  );
}

function SettingsCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-purple-600 dark:text-purple-400">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function ToggleOption({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`p-1 rounded-full transition-colors ${
          enabled ? 'text-purple-600' : 'text-gray-400'
        }`}
      >
        {enabled ? (
          <ToggleRight className="w-8 h-8" />
        ) : (
          <ToggleLeft className="w-8 h-8" />
        )}
      </button>
    </div>
  );
}
