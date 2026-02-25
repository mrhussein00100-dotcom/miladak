'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRewriterState } from '@/hooks/useRewriterState';
import RewriterHeader from '@/components/admin/rewriter/enhanced/RewriterHeader';
import RewriterTabs from '@/components/admin/rewriter/enhanced/RewriterTabs';
import UrlInput from '@/components/admin/rewriter/enhanced/UrlInput';
import RewriterSettings from '@/components/admin/rewriter/enhanced/RewriterSettings';
import ContentArea from '@/components/admin/rewriter/enhanced/ContentArea';
import ActionButtons from '@/components/admin/rewriter/enhanced/ActionButtons';
import StatusMessages from '@/components/admin/rewriter/enhanced/StatusMessages';
import '@/styles/rewriter-enhanced.css';

export default function RewriterPage() {
  const {
    state,
    setTitle,
    setSourceContent,
    setExternalUrl,
    setActiveTab,
    updateSettings,
    clearMessages,
    fetchFromUrl,
    rewriteContent,
    generateMetaData,
    addToArticleEditor,
    smartFormatContent,
    copyToClipboard,
    resetAll,
    canRewrite,
    canCopy,
    canSmartFormat,
    isProcessing,
  } = useRewriterState();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">العودة للوحة التحكم</span>
            <span className="sm:hidden">رجوع</span>
          </Link>
        </div>

        {/* Header */}
        <RewriterHeader
          sourceWordCount={state.sourceWordCount}
          rewrittenWordCount={state.rewrittenWordCount}
          isProcessing={isProcessing}
        />

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          {/* Tabs */}
          <RewriterTabs
            activeTab={state.activeTab}
            onTabChange={setActiveTab}
            disabled={isProcessing}
          />

          {/* URL Input (if external tab is active) */}
          {state.activeTab === 'url' && (
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <UrlInput
                  url={state.externalUrl}
                  onUrlChange={setExternalUrl}
                  onFetch={fetchFromUrl}
                  isLoading={state.isFetching}
                  disabled={isProcessing}
                />
              </div>
            </div>
          )}

          {/* Settings */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <RewriterSettings
                settings={state.settings}
                onSettingsChange={updateSettings}
                disabled={isProcessing}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            <ContentArea
              title={state.title}
              sourceContent={state.sourceContent}
              rewrittenContent={state.rewrittenContent}
              rewrittenTitle={state.rewrittenTitle}
              isTextMode={state.activeTab === 'text'}
              onTitleChange={setTitle}
              onSourceChange={setSourceContent}
              isLoading={state.isLoading}
              generatedMeta={state.generatedMeta}
              modelUsed={state.modelUsed || undefined}
            />
          </div>

          {/* Status Messages */}
          <StatusMessages
            error={state.error}
            success={state.success}
            onDismiss={clearMessages}
          />

          {/* Action Buttons */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <ActionButtons
              onRewrite={rewriteContent}
              onReset={resetAll}
              onCopy={copyToClipboard}
              onGenerateMeta={() =>
                generateMetaData(state.title, state.rewrittenContent)
              }
              onAddToEditor={() =>
                addToArticleEditor(state.title, state.rewrittenContent)
              }
              onSmartFormat={smartFormatContent}
              canRewrite={canRewrite}
              canCopy={canCopy}
              canGenerateMeta={!!state.title && !!state.rewrittenContent}
              canAddToEditor={!!state.title && !!state.rewrittenContent}
              canSmartFormat={canSmartFormat}
              isLoading={state.isLoading}
              isGeneratingMeta={state.isGeneratingMeta}
              isSmartFormatting={state.isSmartFormatting}
            />
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mt-6 sm:mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-xs sm:text-sm">
              4 أساليب
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">
              احترافي، بسيط، إبداعي، أكاديمي
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">📏</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-xs sm:text-sm">
              محتوى أطول
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">
              تحسين الجودة وزيادة الطول
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">✨</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-xs sm:text-sm">
              تنسيق ذكي
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">
              عناوين وفقرات منظمة تلقائياً
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🏷️</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-xs sm:text-sm">
              سيو تلقائي
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">
              توليد الميتا والكلمات المفتاحية
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 text-center col-span-2 sm:col-span-1">
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">📝</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-xs sm:text-sm">
              إضافة مباشرة
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">
              إنشاء مقال في المحرر فوراً
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
