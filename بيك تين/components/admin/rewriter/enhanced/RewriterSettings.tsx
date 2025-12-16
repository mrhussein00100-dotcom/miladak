/**
 * مكون إعدادات إعادة الصياغة المحسنة
 */

'use client';

import { Settings, Palette, Ruler, Cpu, Zap, Tag, Edit3 } from 'lucide-react';
import type { RewriterSettingsProps } from '@/types/rewriter-enhanced';

export default function RewriterSettings({
  settings,
  onSettingsChange,
  disabled,
}: RewriterSettingsProps) {
  const updateSettings = (newSettings: Partial<typeof settings>) => {
    onSettingsChange({ ...settings, ...newSettings });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            إعدادات إعادة الصياغة المحسنة
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            اختر الأسلوب والطول ونموذج الذكاء الاصطناعي والخيارات المتقدمة
          </p>
        </div>
      </div>

      {/* الإعدادات الأساسية */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* أسلوب الكتابة */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              أسلوب الكتابة
            </label>
          </div>
          <select
            value={settings.style}
            onChange={(e) => updateSettings({ style: e.target.value as any })}
            disabled={disabled}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <option value="professional">احترافي</option>
            <option value="simple">بسيط</option>
            <option value="creative">إبداعي</option>
            <option value="academic">أكاديمي</option>
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {settings.style === 'professional' &&
              'مناسب للمحتوى التجاري والرسمي'}
            {settings.style === 'simple' && 'لغة بسيطة وواضحة للجمهور العام'}
            {settings.style === 'creative' && 'أسلوب إبداعي وجذاب'}
            {settings.style === 'academic' && 'أسلوب علمي ومتخصص'}
          </p>
        </div>

        {/* طول المحتوى */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              طول المحتوى
            </label>
          </div>
          <select
            value={settings.targetLength}
            onChange={(e) =>
              updateSettings({ targetLength: e.target.value as any })
            }
            disabled={disabled}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <option value="shorter">أقصر (30% أقل)</option>
            <option value="same">نفس الطول</option>
            <option value="longer">أطول (50% أكثر) - مُوصى به</option>
            <option value="much_longer">أطول بكثير (100% أكثر)</option>
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {settings.targetLength === 'shorter' &&
              'تقليل المحتوى مع الحفاظ على المعنى'}
            {settings.targetLength === 'same' &&
              'الحفاظ على نفس طول المحتوى تقريباً'}
            {settings.targetLength === 'longer' &&
              'توسيع المحتوى بتفاصيل إضافية (مُوصى به)'}
            {settings.targetLength === 'much_longer' &&
              'توسيع كبير مع شرح مفصل'}
          </p>
        </div>

        {/* نموذج الذكاء الاصطناعي */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              نموذج الذكاء الاصطناعي
            </label>
          </div>
          <select
            value={settings.provider}
            onChange={(e) =>
              updateSettings({ provider: e.target.value as any })
            }
            disabled={disabled}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <option value="groq">Groq (أسرع)</option>
            <option value="gemini">Gemini (أذكى) - مُوصى به</option>
            <option value="cohere">Cohere (متوازن)</option>
            <option value="huggingface">HuggingFace (مفتوح)</option>
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {settings.provider === 'groq' && 'سرعة عالية في المعالجة'}
            {settings.provider === 'gemini' &&
              'جودة عالية في النتائج (مُوصى به)'}
            {settings.provider === 'cohere' && 'متوازن بين السرعة والجودة'}
            {settings.provider === 'huggingface' && 'نماذج مفتوحة المصدر'}
          </p>
        </div>
      </div>

      {/* الخيارات المتقدمة */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          خيارات متقدمة
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* تحسين الجودة */}
          <div className="flex items-start space-x-3 space-x-reverse">
            <input
              type="checkbox"
              id="enhanceQuality"
              checked={settings.enhanceQuality}
              onChange={(e) =>
                updateSettings({ enhanceQuality: e.target.checked })
              }
              disabled={disabled}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-1"
            />
            <div className="flex-1">
              <label
                htmlFor="enhanceQuality"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                تحسين الجودة
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                محتوى أطول وأكثر تفصيلاً مع شرح أعمق
              </p>
            </div>
          </div>

          {/* توليد الميتا */}
          <div className="flex items-start space-x-3 space-x-reverse">
            <input
              type="checkbox"
              id="generateMeta"
              checked={settings.generateMeta}
              onChange={(e) =>
                updateSettings({ generateMeta: e.target.checked })
              }
              disabled={disabled}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-1"
            />
            <div className="flex-1">
              <label
                htmlFor="generateMeta"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                توليد الميتا والسيو
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                عنوان ووصف وكلمات مفتاحية تلقائياً
              </p>
            </div>
          </div>

          {/* إضافة للمحرر */}
          <div className="flex items-start space-x-3 space-x-reverse">
            <input
              type="checkbox"
              id="addToEditor"
              checked={settings.addToEditor}
              onChange={(e) =>
                updateSettings({ addToEditor: e.target.checked })
              }
              disabled={disabled}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-1"
            />
            <div className="flex-1">
              <label
                htmlFor="addToEditor"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                إضافة للمحرر
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                إنشاء مقال جديد في المحرر مباشرة
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* معاينة الإعدادات */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          📋 ملخص الإعدادات المحددة:
        </h4>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
            {settings.style === 'professional' && 'احترافي'}
            {settings.style === 'simple' && 'بسيط'}
            {settings.style === 'creative' && 'إبداعي'}
            {settings.style === 'academic' && 'أكاديمي'}
          </span>
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
            {settings.targetLength === 'shorter' && 'أقصر'}
            {settings.targetLength === 'same' && 'نفس الطول'}
            {settings.targetLength === 'longer' && 'أطول'}
            {settings.targetLength === 'much_longer' && 'أطول بكثير'}
          </span>
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-xs font-medium">
            {settings.provider === 'groq' && 'Groq'}
            {settings.provider === 'gemini' && 'Gemini'}
            {settings.provider === 'cohere' && 'Cohere'}
            {settings.provider === 'huggingface' && 'HuggingFace'}
          </span>
        </div>

        {/* الخيارات المفعلة */}
        <div className="flex flex-wrap gap-2">
          {settings.enhanceQuality && (
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded text-xs">
              ✨ تحسين الجودة
            </span>
          )}
          {settings.generateMeta && (
            <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded text-xs">
              🏷️ توليد الميتا
            </span>
          )}
          {settings.addToEditor && (
            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded text-xs">
              📝 إضافة للمحرر
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
