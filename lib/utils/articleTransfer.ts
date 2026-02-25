/**
 * أدوات نقل المقال من نظام إعادة الصياغة إلى المحرر
 */

import type {
  RewriteResult,
  GeneratedImage,
  ArticleTransferData,
} from '@/types/rewriter';

const STORAGE_KEY = 'articleTransfer';

/**
 * حفظ بيانات المقال للنقل
 */
export function saveArticleForTransfer(
  result: RewriteResult,
  images?: GeneratedImage[],
  suggestedCategory?: string
): void {
  const transferData: ArticleTransferData = {
    title: result.title,
    content: result.content,
    metaDescription: result.metaDescription,
    keywords: result.keywords,
    images: images || [],
    suggestedCategory,
    source: 'rewriter',
    timestamp: Date.now(),
  };

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(transferData));
}

/**
 * قراءة بيانات المقال المنقولة
 */
export function getTransferredArticle(): ArticleTransferData | null {
  try {
    const data = sessionStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data) as ArticleTransferData;

    // التحقق من صلاحية البيانات (أقل من ساعة)
    const oneHour = 60 * 60 * 1000;
    if (Date.now() - parsed.timestamp > oneHour) {
      clearTransferredArticle();
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * مسح بيانات المقال المنقولة
 */
export function clearTransferredArticle(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

/**
 * التحقق من وجود بيانات منقولة
 */
export function hasTransferredArticle(): boolean {
  return getTransferredArticle() !== null;
}

export default {
  saveArticleForTransfer,
  getTransferredArticle,
  clearTransferredArticle,
  hasTransferredArticle,
};
