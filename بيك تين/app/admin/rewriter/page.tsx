'use client';

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
    copyToClipboard,
    resetAll,
    canRewrite,
    canCopy,
    isProcessing,
  } = useRewriterState();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
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
              modelUsed={state.modelUsed}
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
              canRewrite={canRewrite}
              canCopy={canCopy}
              canGenerateMeta={!!state.title && !!state.rewrittenContent}
              canAddToEditor={!!state.title && !!state.rewrittenContent}
              isLoading={state.isLoading}
              isGeneratingMeta={state.isGeneratingMeta}
            />
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              4 أساليب
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              احترافي، بسيط، إبداعي، أكاديمي
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl mb-2">📏</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              محتوى أطول
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              تحسين الجودة وزيادة الطول
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl mb-2">🏷️</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              سيو تلقائي
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              توليد الميتا والكلمات المفتاحية
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl mb-2">📝</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              إضافة مباشرة
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              إنشاء مقال في المحرر فوراً
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
