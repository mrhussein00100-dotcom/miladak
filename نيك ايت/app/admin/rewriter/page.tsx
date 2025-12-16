'use client';

/**
 * صفحة إعادة الصياغة المتقدمة
 */

import { useState } from 'react';
import TextRewriter from '@/components/admin/rewriter/TextRewriter';
import UrlRewriter from '@/components/admin/rewriter/UrlRewriter';
import RewriteHistory from '@/components/admin/rewriter/RewriteHistory';
import ResultsComparison from '@/components/admin/rewriter/ResultsComparison';
import type {
  RewriteResult,
  RewriteSettings,
  GeneratedImage,
} from '@/types/rewriter';

type TabType = 'text' | 'url' | 'history';

export default function RewriterPage() {
  const [activeTab, setActiveTab] = useState<TabType>('text');
  const [results, setResults] = useState<RewriteResult[]>([]);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [originalContent, setOriginalContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResults = (
    newResults: RewriteResult[],
    original: string,
    newImages?: GeneratedImage[]
  ) => {
    setResults(newResults);
    setOriginalContent(original);
    if (newImages) setImages(newImages);
  };

  const handleTransferToEditor = (result: RewriteResult) => {
    // حفظ البيانات في sessionStorage للنقل
    const transferData = {
      title: result.title,
      content: result.content,
      metaDescription: result.metaDescription,
      keywords: result.keywords,
      images: images,
      source: 'rewriter',
      timestamp: Date.now(),
    };
    sessionStorage.setItem('articleTransfer', JSON.stringify(transferData));

    // الانتقال لصفحة إنشاء المقال
    window.location.href = '/admin/articles/new';
  };

  const tabs = [
    { id: 'text' as TabType, label: 'من النص', icon: '📝' },
    { id: 'url' as TabType, label: 'من الرابط', icon: '🔗' },
    { id: 'history' as TabType, label: 'السجل', icon: '📋' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* العنوان */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>✨</span>
            نظام إعادة الصياغة المتقدم
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            أعد صياغة المحتوى باستخدام نماذج AI متعددة مع مقارنة النتائج
          </p>
        </div>

        {/* التبويبات */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors
                    ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }
                  `}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* محتوى التبويب */}
          <div className="p-6">
            {activeTab === 'text' && (
              <TextRewriter
                onResults={handleResults}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}
            {activeTab === 'url' && (
              <UrlRewriter
                onResults={handleResults}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}
            {activeTab === 'history' && (
              <RewriteHistory
                onRestore={(record) => {
                  setResults(record.results);
                  setOriginalContent(record.originalContent);
                  if (record.images) setImages(record.images);
                  setActiveTab('text');
                }}
              />
            )}
          </div>
        </div>

        {/* نتائج إعادة الصياغة */}
        {results.length > 0 && activeTab !== 'history' && (
          <ResultsComparison
            results={results}
            originalContent={originalContent}
            images={images}
            onTransferToEditor={handleTransferToEditor}
            onClear={() => {
              setResults([]);
              setImages([]);
              setOriginalContent('');
            }}
          />
        )}
      </div>
    </div>
  );
}
