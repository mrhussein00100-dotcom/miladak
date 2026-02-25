/**
 * الصفحة الرئيسية المحسنة لإعادة الصياغة
 */

'use client';

import { useRewriterState } from '@/hooks/useRewriterState';
import {
  RewriterHeader,
  RewriterTabs,
  UrlInput,
  RewriterSettings,
  ContentArea,
  ActionButtons,
  StatusMessages,
} from './index';

export default function EnhancedRewriterPage() {
  const {
    state,
    setSourceContent,
    setExternalUrl,
    setActiveTab,
    updateSettings,
    fetchFromUrl,
    rewriteContent,
    copyToClipboard,
    resetAll,
    clearMessages,
    canRewrite,
    canCopy,
    isProcessing,
  } = useRewriterState();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* العنوان والإحصائيات */}
        <RewriterHeader
          sourceWordCount={state.sourceWordCount}
          rewrittenWordCount={state.rewrittenWordCount}
          isProcessing={isProcessing}
        />

        {/* رسائل الحالة */}
        <StatusMessages
          error={state.error}
          success={state.success}
          onDismiss={clearMessages}
        />

        {/* التبويبات */}
        <RewriterTabs
          activeTab={state.activeTab}
          onTabChange={setActiveTab}
          disabled={isProcessing}
        />

        {/* إدخال الرابط (إذا كان التبويب نشط) */}
        {state.activeTab === 'url' && (
          <UrlInput
            url={state.externalUrl}
            onUrlChange={setExternalUrl}
            onFetch={fetchFromUrl}
            isLoading={state.isFetching}
            disabled={isProcessing}
          />
        )}

        {/* إعدادات إعادة الصياغة */}
        <RewriterSettings
          settings={state.settings}
          onSettingsChange={updateSettings}
          disabled={isProcessing}
        />

        {/* منطقة المحتوى */}
        <ContentArea
          sourceContent={state.sourceContent}
          rewrittenContent={state.rewrittenContent}
          isTextMode={state.activeTab === 'text'}
          onSourceChange={setSourceContent}
          isLoading={state.isLoading}
        />

        {/* أزرار التحكم */}
        <ActionButtons
          onRewrite={rewriteContent}
          onReset={resetAll}
          onCopy={copyToClipboard}
          canRewrite={canRewrite}
          canCopy={canCopy}
          isLoading={state.isLoading}
        />

        {/* معلومات إضافية */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-6 px-6 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>متصل</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>آمن ومشفر</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>متعدد النماذج</span>
            </div>
          </div>
        </div>

        {/* تذييل الصفحة */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            تم تطوير هذه الأداة باستخدام أحدث تقنيات الذكاء الاصطناعي لضمان أفضل
            جودة في إعادة الصياغة
          </p>
        </footer>
      </div>
    </div>
  );
}
