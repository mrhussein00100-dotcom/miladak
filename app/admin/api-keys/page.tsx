'use client';

import { useState, useEffect } from 'react';
import {
  Key,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ExternalLink,
  Settings,
  Sparkles,
} from 'lucide-react';

interface KeyInfo {
  name: string;
  envVar: string;
  configured: boolean;
  working?: boolean;
  error?: string;
  keyPreview?: string;
  description: string;
  getKeyUrl: string;
  icon: string;
  color: string;
}

interface GeminiKeyInfo {
  index: number;
  working: boolean;
  error?: string;
  keyPreview?: string;
}

export default function ApiKeysPage() {
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [geminiKeys, setGeminiKeys] = useState<GeminiKeyInfo[]>([]);
  const [otherKeys, setOtherKeys] = useState<KeyInfo[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    configured: 0,
    working: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/check-api-keys');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // معالجة مفاتيح Gemini
      if (data.keys?.gemini?.keys) {
        setGeminiKeys(data.keys.gemini.keys);
      }

      // معالجة المفاتيح الأخرى
      const others: KeyInfo[] = [
        {
          name: 'Groq',
          envVar: 'GROQ_API_KEY',
          configured: data.keys?.groq?.configured || false,
          working: data.keys?.groq?.working,
          keyPreview: data.keys?.groq?.keyLength
            ? `${'*'.repeat(8)}...`
            : undefined,
          description: 'سريع جداً - يُستخدم كـ Fallback',
          getKeyUrl: 'https://console.groq.com/keys',
          icon: '⚡',
          color: 'from-orange-500 to-red-500',
        },
        {
          name: 'Cohere',
          envVar: 'COHERE_API_KEY',
          configured: data.keys?.cohere?.configured || false,
          working: data.keys?.cohere?.working,
          keyPreview: data.keys?.cohere?.keyLength
            ? `${'*'.repeat(8)}...`
            : undefined,
          description: 'معالجة اللغة الطبيعية',
          getKeyUrl: 'https://dashboard.cohere.ai/api-keys',
          icon: '🧠',
          color: 'from-purple-500 to-pink-500',
        },
        {
          name: 'Pexels',
          envVar: 'PEXELS_API_KEY',
          configured: data.keys?.pexels?.configured || false,
          working: data.keys?.pexels?.working,
          keyPreview: data.keys?.pexels?.keyLength
            ? `${'*'.repeat(8)}...`
            : undefined,
          description: 'صور مجانية عالية الجودة',
          getKeyUrl: 'https://www.pexels.com/api/',
          icon: '📷',
          color: 'from-green-500 to-teal-500',
        },
        {
          name: 'Unsplash',
          envVar: 'UNSPLASH_ACCESS_KEY',
          configured: data.keys?.unsplash?.configured || false,
          working: data.keys?.unsplash?.working,
          keyPreview: data.keys?.unsplash?.keyLength
            ? `${'*'.repeat(8)}...`
            : undefined,
          description: 'صور مجانية إضافية',
          getKeyUrl: 'https://unsplash.com/developers',
          icon: '🖼️',
          color: 'from-indigo-500 to-purple-500',
        },
        {
          name: 'OpenAI',
          envVar: 'OPENAI_API_KEY',
          configured: data.keys?.openai?.configured || false,
          working: data.keys?.openai?.working,
          keyPreview: data.keys?.openai?.keyLength
            ? `${'*'.repeat(8)}...`
            : undefined,
          description: 'GPT-4 و DALL-E',
          getKeyUrl: 'https://platform.openai.com/api-keys',
          icon: '🤖',
          color: 'from-emerald-500 to-green-500',
        },
        {
          name: 'HuggingFace',
          envVar: 'HUGGINGFACE_API_KEY',
          configured: data.keys?.huggingface?.configured || false,
          working: data.keys?.huggingface?.working,
          keyPreview: data.keys?.huggingface?.keyLength
            ? `${'*'.repeat(8)}...`
            : undefined,
          description: 'نماذج مفتوحة المصدر',
          getKeyUrl: 'https://huggingface.co/settings/tokens',
          icon: '🤗',
          color: 'from-yellow-500 to-amber-500',
        },
      ];

      setOtherKeys(others);

      // حساب الملخص
      const configuredCount =
        others.filter((k) => k.configured).length +
        (data.keys?.gemini?.configured ? 1 : 0);
      const workingCount =
        others.filter((k) => k.working).length +
        (data.keys?.gemini?.working ? 1 : 0);
      setSummary({
        total: others.length + 1,
        configured: configuredCount,
        working: workingCount,
      });
    } catch (err: any) {
      console.error('Error fetching API keys status:', err);
      setError(err.message || 'فشل في تحميل حالة المفاتيح');
    } finally {
      setLoading(false);
    }
  };

  const testKeys = async () => {
    setTesting(true);
    await fetchStatus();
    setTesting(false);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const toggleShowKey = (key: string) => {
    setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const StatusBadge = ({
    configured,
    working,
  }: {
    configured: boolean;
    working?: boolean;
  }) => {
    if (!configured) {
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-gray-700 text-gray-400 rounded-full text-xs">
          <XCircle className="w-3 h-3" />
          غير مُعد
        </span>
      );
    }
    if (working === true) {
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
          <CheckCircle className="w-3 h-3" />
          يعمل
        </span>
      );
    }
    if (working === false) {
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
          <AlertCircle className="w-3 h-3" />
          لا يعمل
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
        <AlertCircle className="w-3 h-3" />
        مُعد
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">جاري تحميل حالة المفاتيح...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">
            خطأ في تحميل المفاتيح
          </h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchStatus}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <Key className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              🔑 إدارة مفاتيح API
            </h1>
            <p className="text-gray-400 text-sm">
              التحكم في جميع مفاتيح الخدمات الخارجية
            </p>
          </div>
        </div>
        <button
          onClick={testKeys}
          disabled={testing}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {testing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5" />
          )}
          اختبار المفاتيح
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="text-3xl font-bold text-white">{summary.total}</div>
          <div className="text-gray-400 text-sm">إجمالي الخدمات</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="text-3xl font-bold text-green-400">
            {summary.configured}
          </div>
          <div className="text-gray-400 text-sm">مُعدة</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="text-3xl font-bold text-blue-400">
            {summary.working}
          </div>
          <div className="text-gray-400 text-sm">تعمل</div>
        </div>
      </div>

      {/* Gemini Keys Section */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-lg font-bold text-white">مفاتيح Gemini AI</h2>
              <p className="text-blue-100 text-sm">
                يدعم مفاتيح متعددة مع التبديل التلقائي
              </p>
            </div>
          </div>
        </div>
        <div className="p-4">
          {geminiKeys.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <p className="text-gray-400 mb-4">لم يتم تكوين أي مفتاح Gemini</p>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                احصل على مفتاح
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {geminiKeys.map((key, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    key.working
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        key.working ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <span className="text-white font-mono">
                      GEMINI_API_KEY{key.index > 1 ? `_${key.index}` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {key.working ? (
                      <span className="flex items-center gap-1 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        يعمل
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400 text-sm">
                        <XCircle className="w-4 h-4" />
                        {key.error || 'لا يعمل'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-sm">
                  💡 يمكنك إضافة حتى 10 مفاتيح: GEMINI_API_KEY,
                  GEMINI_API_KEY_2, GEMINI_API_KEY_3, ...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Other API Keys Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {otherKeys.map((keyInfo) => (
          <div
            key={keyInfo.name}
            className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
          >
            <div className={`bg-gradient-to-r ${keyInfo.color} p-3`}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{keyInfo.icon}</span>
                <span className="text-white font-bold">{keyInfo.name}</span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-gray-400 text-sm">{keyInfo.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs font-mono">
                  {keyInfo.envVar}
                </span>
                <StatusBadge
                  configured={keyInfo.configured}
                  working={keyInfo.working}
                />
              </div>

              {keyInfo.configured && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-400">
                    {showKeys[keyInfo.name]
                      ? keyInfo.keyPreview
                      : '••••••••••••'}
                  </div>
                  <button
                    onClick={() => toggleShowKey(keyInfo.name)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title={showKeys[keyInfo.name] ? 'إخفاء' : 'إظهار'}
                  >
                    {showKeys[keyInfo.name] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}

              <a
                href={keyInfo.getKeyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                {keyInfo.configured ? 'إدارة المفتاح' : 'احصل على مفتاح'}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions Box */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-500/30 p-6">
        <div className="flex items-start gap-4">
          <Settings className="w-8 h-8 text-purple-400 flex-shrink-0 mt-1" />
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">
              كيفية إضافة المفاتيح
            </h3>
            <div className="text-gray-300 text-sm space-y-2">
              <p>1. احصل على المفتاح من الرابط المقدم لكل خدمة</p>
              <p>
                2. أضف المفتاح في ملف{' '}
                <code className="bg-gray-800 px-2 py-1 rounded">
                  .env.local
                </code>
              </p>
              <p>3. أعد تشغيل الخادم لتطبيق التغييرات</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-400">
              <div># مثال على ملف .env.local</div>
              <div className="text-green-400">GEMINI_API_KEY=your_key_here</div>
              <div className="text-green-400">GEMINI_API_KEY_2=second_key</div>
              <div className="text-green-400">GROQ_API_KEY=your_groq_key</div>
              <div className="text-green-400">
                PEXELS_API_KEY=your_pexels_key
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
