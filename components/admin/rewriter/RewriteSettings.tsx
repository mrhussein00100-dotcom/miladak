'use client';

/**
 * مكون إعدادات إعادة الصياغة
 */

import type {
  RewriteSettings as Settings,
  AIProvider,
  WritingStyle,
  TargetAudience,
  AI_PROVIDER_LABELS,
  WRITING_STYLE_LABELS,
  TARGET_AUDIENCE_LABELS,
} from '@/types/rewriter';

interface RewriteSettingsProps {
  settings: Settings;
  onChange: (settings: Settings) => void;
  disabled?: boolean;
}

const AI_PROVIDERS: { id: AIProvider; label: string; icon: string }[] = [
  { id: 'sona-enhanced' as AIProvider, label: 'SONA 4.01', icon: '🚀' },
  { id: 'gemini', label: 'Gemini', icon: '🌟' },
  { id: 'groq', label: 'Groq', icon: '⚡' },
  { id: 'cohere', label: 'Cohere', icon: '🔮' },
  { id: 'huggingface', label: 'HuggingFace', icon: '🤗' },
  { id: 'local', label: 'Local (SONA)', icon: '🏠' },
  { id: 'sona-v4' as AIProvider, label: 'SONA v4', icon: '🌟' },
];

const WRITING_STYLES: { id: WritingStyle; label: string }[] = [
  { id: 'formal', label: 'رسمي' },
  { id: 'informal', label: 'غير رسمي' },
  { id: 'academic', label: 'أكاديمي' },
  { id: 'journalistic', label: 'صحفي' },
];

const TARGET_AUDIENCES: { id: TargetAudience; label: string }[] = [
  { id: 'general', label: 'عام' },
  { id: 'expert', label: 'متخصص' },
  { id: 'children', label: 'أطفال' },
  { id: 'youth', label: 'شباب' },
];

export default function RewriteSettings({
  settings,
  onChange,
  disabled,
}: RewriteSettingsProps) {
  const toggleModel = (model: AIProvider) => {
    const models = settings.models.includes(model)
      ? settings.models.filter((m) => m !== model)
      : [...settings.models, model];
    onChange({ ...settings, models });
  };

  return (
    <div className="space-y-6">
      {/* اختيار النماذج */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          نماذج AI (اختر واحد أو أكثر للمقارنة)
        </label>
        <div className="flex flex-wrap gap-2">
          {AI_PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              type="button"
              onClick={() => toggleModel(provider.id)}
              disabled={disabled}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${
                  settings.models.includes(provider.id)
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span>{provider.icon}</span>
              {provider.label}
            </button>
          ))}
        </div>
        {settings.models.length === 0 && (
          <p className="text-red-500 text-sm mt-2">
            يجب اختيار نموذج واحد على الأقل
          </p>
        )}
      </div>

      {/* عدد الكلمات */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          عدد الكلمات المطلوب:{' '}
          <span className="text-blue-500">{settings.wordCount}</span>
        </label>
        <input
          type="range"
          min="100"
          max="5000"
          step="100"
          value={settings.wordCount}
          onChange={(e) =>
            onChange({ ...settings, wordCount: parseInt(e.target.value) })
          }
          disabled={disabled}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>100</span>
          <span>1000</span>
          <span>2500</span>
          <span>5000</span>
        </div>
      </div>

      {/* نمط الكتابة والجمهور */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            نمط الكتابة
          </label>
          <select
            value={settings.style}
            onChange={(e) =>
              onChange({ ...settings, style: e.target.value as WritingStyle })
            }
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {WRITING_STYLES.map((style) => (
              <option key={style.id} value={style.id}>
                {style.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            الجمهور المستهدف
          </label>
          <select
            value={settings.audience}
            onChange={(e) =>
              onChange({
                ...settings,
                audience: e.target.value as TargetAudience,
              })
            }
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {TARGET_AUDIENCES.map((audience) => (
              <option key={audience.id} value={audience.id}>
                {audience.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* خيارات توليد الصور */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center gap-3 mb-3">
          <input
            type="checkbox"
            id="generateImages"
            checked={settings.generateImages}
            onChange={(e) =>
              onChange({ ...settings, generateImages: e.target.checked })
            }
            disabled={disabled}
            className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
          />
          <label
            htmlFor="generateImages"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            توليد صور تلقائية للمحتوى
          </label>
        </div>

        {settings.generateImages && (
          <div className="grid grid-cols-2 gap-4 mr-7">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                عدد الصور
              </label>
              <select
                value={settings.imageCount}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    imageCount: parseInt(e.target.value),
                  })
                }
                disabled={disabled}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                نمط الصور
              </label>
              <select
                value={settings.imageStyle}
                onChange={(e) =>
                  onChange({ ...settings, imageStyle: e.target.value as any })
                }
                disabled={disabled}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="realistic">واقعية</option>
                <option value="illustration">رسوم توضيحية</option>
                <option value="diagram">مخططات</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
