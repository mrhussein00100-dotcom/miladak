'use client';

import { useState, useEffect } from 'react';
import {
  Key,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface KeyStatus {
  name: string;
  configured: boolean;
  working: boolean;
  error?: string;
  keysCount?: number;
}

interface ApiKeysStatus {
  gemini: {
    configured: boolean;
    working: boolean;
    keysCount: number;
    keys: { index: number; working: boolean; error?: string }[];
  };
  groq: KeyStatus;
  cohere: KeyStatus;
  huggingface: KeyStatus;
  pexels: KeyStatus;
}

export default function ApiKeysPage() {
  const [status, setStatus] = useState<ApiKeysStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/check-api-keys');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error fetching API keys status:', error);
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

  const StatusIcon = ({
    working,
    configured,
  }: {
    working: boolean;
    configured: boolean;
  }) => {
    if (!configured) return <XCircle className="w-5 h-5 text-gray-500" />;
    if (working) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <Key className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              🔑 إدارة مفاتيح API
            </h1>
            <p className="text-gray-400">مراقبة حالة مفاتيح الخدمات الخارجية</p>
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

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        </div>
      ) : status ? (
        <div className="space-y-6">
          {/* Gemini Keys - Special Section */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Google Gemini
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {status.gemini.keysCount} مفتاح مُعد • تبديل تلقائي عند
                    انتهاء الحصة
                  </p>
                </div>
              </div>
              <StatusIcon
                working={status.gemini.working}
                configured={status.gemini.configured}
              />
            </div>

            {status.gemini.keys && status.gemini.keys.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                {status.gemini.keys.map((key, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      key.working
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">
                        المفتاح {key.index}
                      </span>
                      {key.working ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    {key.error && (
                      <p className="text-red-400 text-xs mt-1">{key.error}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Other API Keys */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Groq */}
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <span className="text-xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Groq</h3>
                    <p className="text-gray-400 text-sm">
                      سريع جداً - Fallback
                    </p>
                  </div>
                </div>
                <StatusIcon
                  working={status.groq?.working || false}
                  configured={status.groq?.configured || false}
                />
              </div>
            </div>

            {/* Cohere */}
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🧠</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Cohere</h3>
                    <p className="text-gray-400 text-sm">معالجة اللغة</p>
                  </div>
                </div>
                <StatusIcon
                  working={status.cohere?.working || false}
                  configured={status.cohere?.configured || false}
                />
              </div>
            </div>

            {/* Pexels */}
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📷</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Pexels</h3>
                    <p className="text-gray-400 text-sm">صور مجانية</p>
                  </div>
                </div>
                <StatusIcon
                  working={status.pexels?.working || false}
                  configured={status.pexels?.configured || false}
                />
              </div>
            </div>

            {/* HuggingFace */}
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🤗</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      HuggingFace
                    </h3>
                    <p className="text-gray-400 text-sm">نماذج مفتوحة</p>
                  </div>
                </div>
                <StatusIcon
                  working={status.huggingface?.working || false}
                  configured={status.huggingface?.configured || false}
                />
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <h3 className="text-blue-400 font-bold mb-2">💡 معلومات مهمة</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>
                • Gemini يدعم حتى 10 مفاتيح للتبديل التلقائي (20 طلب/يوم لكل
                مفتاح)
              </li>
              <li>
                • عند انتهاء حصة مفتاح، يتم التبديل تلقائياً للمفتاح التالي
              </li>
              <li>• Groq يُستخدم كـ fallback عند فشل جميع مفاتيح Gemini</li>
              <li>• أضف المفاتيح في ملف .env.local أو في إعدادات Vercel</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          فشل في تحميل حالة المفاتيح
        </div>
      )}
    </div>
  );
}
