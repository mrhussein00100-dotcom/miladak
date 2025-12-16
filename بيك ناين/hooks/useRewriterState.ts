/**
 * Custom hook لإدارة حالة إعادة الصياغة المحسنة
 */

import { useState, useCallback, useMemo } from 'react';
import type {
  RewriterState,
  RewriteSettings,
  TabType,
  RewriteResponse,
  FetchResponse,
  DEFAULT_REWRITE_SETTINGS,
} from '@/types/rewriter-enhanced';

const initialSettings: RewriteSettings = {
  style: 'professional',
  targetLength: 'longer',
  provider: 'gemini',
  enhanceQuality: true,
  generateMeta: true,
  addToEditor: false,
};

const initialState: RewriterState = {
  title: '',
  sourceContent: '',
  rewrittenContent: '',
  rewrittenTitle: '',
  externalUrl: '',
  generatedMeta: null,
  activeTab: 'text',
  isLoading: false,
  isFetching: false,
  isGeneratingMeta: false,
  settings: initialSettings,
  error: null,
  success: null,
  sourceWordCount: 0,
  rewrittenWordCount: 0,
  modelUsed: null,
};

export function useRewriterState() {
  const [state, setState] = useState<RewriterState>(initialState);

  // ===== Content Management =====

  const setTitle = useCallback((title: string) => {
    setState((prev) => ({
      ...prev,
      title,
      error: null,
    }));
  }, []);

  const setSourceContent = useCallback((content: string) => {
    const wordCount = content.split(/\s+/).filter((w) => w.length > 0).length;
    setState((prev) => ({
      ...prev,
      sourceContent: content,
      sourceWordCount: wordCount,
      error: null,
    }));
  }, []);

  const setRewrittenContent = useCallback((content: string) => {
    const wordCount = content
      .replace(/<[^>]*>/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
    setState((prev) => ({
      ...prev,
      rewrittenContent: content,
      rewrittenWordCount: wordCount,
    }));
  }, []);

  const setExternalUrl = useCallback((url: string) => {
    setState((prev) => ({
      ...prev,
      externalUrl: url,
      error: null,
    }));
  }, []);

  // ===== Tab Management =====

  const setActiveTab = useCallback((tab: TabType) => {
    setState((prev) => ({
      ...prev,
      activeTab: tab,
      error: null,
    }));
  }, []);

  // ===== Settings Management =====

  const updateSettings = useCallback(
    (newSettings: Partial<RewriteSettings>) => {
      setState((prev) => ({
        ...prev,
        settings: { ...prev.settings, ...newSettings },
        error: null,
      }));
    },
    []
  );

  // ===== Loading States =====

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, isLoading: loading }));
  }, []);

  const setFetching = useCallback((fetching: boolean) => {
    setState((prev) => ({ ...prev, isFetching: fetching }));
  }, []);

  // ===== Error & Success Management =====

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error, success: null }));
  }, []);

  const setSuccess = useCallback((success: string | null) => {
    setState((prev) => ({ ...prev, success, error: null }));
  }, []);

  const clearMessages = useCallback(() => {
    setState((prev) => ({ ...prev, error: null, success: null }));
  }, []);

  // ===== API Functions =====

  const fetchFromUrl = useCallback(async () => {
    if (!state.externalUrl.trim()) {
      setError('الرجاء إدخال رابط المقال');
      return;
    }

    setFetching(true);
    setError(null);
    setSourceContent('');

    try {
      const response = await fetch('/api/ai/fetch-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: state.externalUrl.trim() }),
      });

      const data: FetchResponse = await response.json();

      if (data.success && data.content) {
        setSourceContent(data.content);
        setSuccess('تم جلب المحتوى بنجاح');
      } else {
        setError(data.error || 'فشل جلب المقال');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setFetching(false);
    }
  }, [state.externalUrl, setSourceContent]);

  const rewriteContent = useCallback(async () => {
    if (!state.sourceContent.trim()) {
      setError('لا يوجد محتوى لإعادة صياغته');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // استخدام API محسن لإعادة الصياغة
      const response = await fetch('/api/admin/ai/rewrite-enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: state.title,
          content: state.sourceContent,
          style: state.settings.style,
          targetLength: state.settings.targetLength,
          provider: state.settings.provider,
          enhanceQuality: state.settings.enhanceQuality,
          wordCount: Math.max(state.sourceWordCount * 1.5, 800), // ضمان طول أكبر
        }),
      });

      const data = await response.json();

      if (data.success && data.results && data.results.length > 0) {
        const bestResult = data.results[0]; // أخذ أفضل نتيجة
        setRewrittenContent(bestResult.content);

        // تحديث العنوان المُعاد صياغته والنموذج المستخدم
        setState((prev) => ({
          ...prev,
          rewrittenTitle: bestResult.title || prev.title,
          modelUsed:
            data.metadata?.modelUsed || bestResult.model || 'غير معروف',
        }));

        setSuccess(
          `تم إعادة الصياغة بنجاح باستخدام ${
            data.metadata?.modelUsed || bestResult.model || 'النموذج'
          }`
        );

        // توليد الميتا إذا كان مفعلاً
        if (state.settings.generateMeta) {
          generateMetaData(bestResult.title || state.title, bestResult.content);
        }

        // إضافة للمحرر إذا كان مفعلاً
        if (state.settings.addToEditor) {
          addToArticleEditor(
            bestResult.title || state.title,
            bestResult.content
          );
        }
      } else {
        setError(data.error || 'حدث خطأ أثناء إعادة الصياغة');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  }, [
    state.title,
    state.sourceContent,
    state.settings,
    state.sourceWordCount,
    setRewrittenContent,
  ]);

  // ===== Utility Functions =====

  const copyToClipboard = useCallback(async () => {
    if (!state.rewrittenContent) return;

    try {
      await navigator.clipboard.writeText(state.rewrittenContent);
      setSuccess('تم نسخ المحتوى بنجاح');
    } catch (err) {
      setError('فشل في نسخ المحتوى');
    }
  }, [state.rewrittenContent]);

  const resetAll = useCallback(() => {
    setState(initialState);
  }, []);

  // ===== Meta Generation =====
  const generateMetaData = useCallback(
    async (title: string, content: string) => {
      setState((prev) => ({ ...prev, isGeneratingMeta: true }));

      try {
        const response = await fetch('/api/admin/ai/generate-meta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            content,
            provider: state.settings.provider,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setState((prev) => ({
            ...prev,
            generatedMeta: {
              metaTitle: data.metaTitle,
              metaDescription: data.metaDescription,
              keywords: data.keywords,
              slug: data.slug,
            },
          }));
        }
      } catch (err) {
        console.error('Error generating meta:', err);
      } finally {
        setState((prev) => ({ ...prev, isGeneratingMeta: false }));
      }
    },
    [state.settings.provider]
  );

  // ===== Add to Editor =====
  const addToArticleEditor = useCallback(
    async (title: string, content: string) => {
      try {
        // إنشاء slug من العنوان
        const slug = (state.generatedMeta?.slug || title)
          .toLowerCase()
          .replace(/[^\u0600-\u06FF\w\s-]/g, '') // إزالة الرموز غير العربية والإنجليزية
          .replace(/\s+/g, '-') // استبدال المسافات بشرطات
          .replace(/-+/g, '-') // إزالة الشرطات المتكررة
          .trim();

        // الحصول على أول تصنيف متاح
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        const firstCategory =
          categoriesData.success && categoriesData.data.length > 0
            ? categoriesData.data[0]
            : null;

        if (!firstCategory) {
          setError('لا توجد تصنيفات متاحة. يرجى إنشاء تصنيف أولاً.');
          return;
        }

        // إنشاء مقال جديد في المحرر
        const response = await fetch('/api/admin/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            slug,
            content,
            excerpt: content.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
            category_id: firstCategory.id,
            published: 0, // مسودة
            featured: 0,
            author: 'AI Rewriter',
            meta_description: state.generatedMeta?.metaDescription || title,
            meta_keywords: state.generatedMeta?.keywords?.join(', ') || '',
            ai_provider: state.modelUsed || 'gemini',
          }),
        });

        const data = await response.json();

        if (data.success) {
          setSuccess('تم إضافة المقال للمحرر بنجاح');
          // إعادة توجيه المستخدم للمحرر
          setTimeout(() => {
            window.open(`/admin/articles/${data.data.id}`, '_blank');
          }, 1000);
        } else {
          setError(data.error || 'فشل في إضافة المقال للمحرر');
        }
      } catch (err: any) {
        console.error('Error adding to editor:', err);
        setError('حدث خطأ أثناء إضافة المقال للمحرر');
      }
    },
    [state.generatedMeta, state.modelUsed]
  );

  // ===== Computed Values =====

  const canRewrite = useMemo(() => {
    return state.sourceContent.trim().length > 0 && !state.isLoading;
  }, [state.sourceContent, state.isLoading]);

  const canCopy = useMemo(() => {
    return state.rewrittenContent.length > 0;
  }, [state.rewrittenContent]);

  const isProcessing = useMemo(() => {
    return state.isLoading || state.isFetching;
  }, [state.isLoading, state.isFetching]);

  return {
    // State
    state,

    // Content actions
    setTitle,
    setSourceContent,
    setRewrittenContent,
    setExternalUrl,

    // UI actions
    setActiveTab,
    updateSettings,

    // Status actions
    setError,
    setSuccess,
    clearMessages,

    // API actions
    fetchFromUrl,
    rewriteContent,
    generateMetaData,
    addToArticleEditor,

    // Utility actions
    copyToClipboard,
    resetAll,

    // Computed values
    canRewrite,
    canCopy,
    isProcessing,
  };
}
