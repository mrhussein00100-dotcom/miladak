'use client';

import { useState } from 'react';

export default function TestGroqPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testGroq = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-groq');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'خطأ في الاتصال',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            اختبار Groq API
          </h1>

          <button
            onClick={testGroq}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? 'جاري الاختبار...' : 'اختبار Groq'}
          </button>

          {result && (
            <div className="mt-6 p-4 rounded-lg border">
              <h3 className="font-semibold mb-3">النتيجة:</h3>

              {result.success ? (
                <div className="text-green-600">
                  <p className="font-medium">✅ {result.message}</p>
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {result.content}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-red-600">
                  <p className="font-medium">❌ فشل الاختبار</p>
                  <p className="text-sm mt-2">{result.error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
