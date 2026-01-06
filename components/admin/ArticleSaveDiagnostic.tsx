'use client';

import { useState } from 'react';
import {
  Bug,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Copy,
  Download,
} from 'lucide-react';

interface DiagnosticResult {
  timestamp: string;
  userAgent: string;
  contentLength: number;
  imageCount: number;
  duplicateImages: Array<{ url: string; count: number }>;
  saveAttempt: {
    success: boolean;
    error?: string;
    details?: string;
    responseTime: number;
  };
  debugInfo: {
    contentSample: string;
    sanitizedSample: string;
    validationResult: any;
  };
}

export default function ArticleSaveDiagnostic() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [testContent, setTestContent] = useState(`
<h2>اختبار تشخيصي للصور</h2>
<p>هذا محتوى تجريبي لاختبار مشكلة حفظ المقالات.</p>

<figure class="my-6">
  <img src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg" alt="صورة تجريبية 1" class="w-full rounded-xl" />
  <figcaption>صورة في figure</figcaption>
</figure>

<p>نص بين الصورتين.</p>

<div class="text-center my-6">
  <img src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg" alt="صورة تجريبية 2" class="rounded-lg shadow-lg" />
</div>

<h3>قسم آخر</h3>
<p>نص قبل الصورة الثالثة.</p>
<img src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg" alt="صورة تجريبية 3" class="w-full rounded-xl my-6" />
<p>نص في النهاية.</p>
`);

  const runDiagnostic = async () => {
    setIsRunning(true);

    try {
      const startTime = Date.now();

      // 1. تحليل المحتوى
      const debugResponse = await fetch('/api/debug-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: testContent }),
      });

      const debugData = await debugResponse.json();

      // 2. محاولة حفظ تجريبية (بدون حفظ فعلي)
      const saveResponse = await fetch('/api/admin/articles/test-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: testContent,
          dryRun: true, // محاولة تجريبية فقط
        }),
      });

      const saveData = await saveResponse.json();
      const responseTime = Date.now() - startTime;

      // 3. جمع معلومات التشخيص
      const result: DiagnosticResult = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        contentLength: testContent.length,
        imageCount: (testContent.match(/<img[^>]*>/gi) || []).length,
        duplicateImages: debugData.success
          ? debugData.data.original.duplicates
          : [],
        saveAttempt: {
          success: saveResponse.ok && saveData.success,
          error: saveData.error,
          details: saveData.details,
          responseTime,
        },
        debugInfo: {
          contentSample: testContent.substring(0, 200) + '...',
          sanitizedSample: debugData.success
            ? debugData.data.sanitized.contentLength > 0
              ? debugData.data.sanitizedSample.substring(0, 200) + '...'
              : 'لا توجد تغييرات'
            : 'فشل التحليل',
          validationResult: debugData,
        },
      };

      setResults((prev) => [result, ...prev]);
    } catch (error) {
      console.error('Diagnostic error:', error);

      const errorResult: DiagnosticResult = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        contentLength: testContent.length,
        imageCount: (testContent.match(/<img[^>]*>/gi) || []).length,
        duplicateImages: [],
        saveAttempt: {
          success: false,
          error: error instanceof Error ? error.message : 'خطأ غير معروف',
          responseTime: 0,
        },
        debugInfo: {
          contentSample: testContent.substring(0, 200) + '...',
          sanitizedSample: 'فشل التحليل',
          validationResult: null,
        },
      };

      setResults((prev) => [errorResult, ...prev]);
    }

    setIsRunning(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `article-save-diagnostic-${
      new Date().toISOString().split('T')[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bug className="w-6 h-6 text-blue-500" />
          تشخيص مشكلة حفظ المقالات
        </h2>
        <div className="flex gap-2">
          {results.length > 0 && (
            <button
              onClick={downloadResults}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
            >
              <Download className="w-4 h-4" />
              تحميل النتائج
            </button>
          )}
          <button
            onClick={runDiagnostic}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                جاري التشخيص...
              </>
            ) : (
              <>
                <Bug className="w-4 h-4" />
                تشغيل التشخيص
              </>
            )}
          </button>
        </div>
      </div>

      {/* محتوى الاختبار */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          محتوى الاختبار (يمكنك تعديله لاختبار حالات مختلفة)
        </label>
        <textarea
          value={testContent}
          onChange={(e) => setTestContent(e.target.value)}
          rows={8}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 font-mono text-sm"
          dir="ltr"
        />
        <p className="text-xs text-gray-500 mt-1">
          طول المحتوى: {testContent.length} حرف | عدد الصور:{' '}
          {(testContent.match(/<img[^>]*>/gi) || []).length}
        </p>
      </div>

      {/* النتائج */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-white">
            نتائج التشخيص ({results.length})
          </h3>

          {results.map((result, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {result.saveAttempt.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="font-medium text-sm">
                    {new Date(result.timestamp).toLocaleString('ar-SA')}
                  </span>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(JSON.stringify(result, null, 2))
                  }
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  نسخ
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    معلومات المحتوى
                  </h4>
                  <div className="space-y-1 text-gray-600 dark:text-gray-400">
                    <div>طول المحتوى: {result.contentLength} حرف</div>
                    <div>عدد الصور: {result.imageCount}</div>
                    <div>صور مكررة: {result.duplicateImages.length}</div>
                    {result.duplicateImages.map((dup, i) => (
                      <div key={i} className="text-xs pl-4">
                        • {dup.url.substring(0, 30)}... ({dup.count} مرات)
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    نتيجة الحفظ
                  </h4>
                  <div className="space-y-1 text-gray-600 dark:text-gray-400">
                    <div>
                      النجاح: {result.saveAttempt.success ? 'نعم' : 'لا'}
                    </div>
                    <div>
                      وقت الاستجابة: {result.saveAttempt.responseTime}ms
                    </div>
                    {result.saveAttempt.error && (
                      <div className="text-red-600 dark:text-red-400">
                        خطأ: {result.saveAttempt.error}
                      </div>
                    )}
                    {result.saveAttempt.details && (
                      <div className="text-yellow-600 dark:text-yellow-400 text-xs">
                        تفاصيل: {result.saveAttempt.details}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <details className="text-xs">
                  <summary className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    عرض التفاصيل التقنية
                  </summary>
                  <div className="mt-2 space-y-2 text-gray-600 dark:text-gray-400">
                    <div>
                      <strong>المتصفح:</strong> {result.userAgent}
                    </div>
                    <div>
                      <strong>عينة المحتوى:</strong>
                      <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
                        {result.debugInfo.contentSample}
                      </pre>
                    </div>
                    <div>
                      <strong>المحتوى المنظف:</strong>
                      <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
                        {result.debugInfo.sanitizedSample}
                      </pre>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* تعليمات */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          كيفية الاستخدام:
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>1. اضغط على "تشغيل التشخيص" لاختبار المحتوى الحالي</li>
          <li>2. يمكنك تعديل محتوى الاختبار لتجربة حالات مختلفة</li>
          <li>3. راجع النتائج لمعرفة ما إذا كانت هناك مشاكل</li>
          <li>4. استخدم "تحميل النتائج" لحفظ التقرير للمطورين</li>
        </ul>
      </div>
    </div>
  );
}
