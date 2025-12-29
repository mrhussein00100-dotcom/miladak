/**
 * Sitemap Utilities
 * أدوات مساعدة لتوليد Sitemap
 */

import { SITEMAP_LIMITS, SEO_CONFIG } from './config';
import type { SitemapEntry } from './types';

/**
 * تقسيم URLs إلى مجموعات للـ sitemap
 * كل مجموعة لا تتجاوز الحد الأقصى المسموح
 */
export function splitUrlsIntoSitemaps(urls: SitemapEntry[]): SitemapEntry[][] {
  const { maxUrlsPerSitemap } = SITEMAP_LIMITS;
  const sitemaps: SitemapEntry[][] = [];

  for (let i = 0; i < urls.length; i += maxUrlsPerSitemap) {
    sitemaps.push(urls.slice(i, i + maxUrlsPerSitemap));
  }

  return sitemaps.length > 0 ? sitemaps : [[]];
}

/**
 * التحقق مما إذا كان يجب استخدام sitemap index
 */
export function shouldUseSitemapIndex(totalUrls: number): boolean {
  return totalUrls > SITEMAP_LIMITS.maxUrlsPerSitemap;
}

/**
 * توليد sitemap index entries
 */
export function generateSitemapIndexEntries(
  sitemapCount: number
): { loc: string; lastmod: string }[] {
  const entries: { loc: string; lastmod: string }[] = [];
  const now = new Date().toISOString();

  for (let i = 0; i < sitemapCount; i++) {
    entries.push({
      loc: `${SEO_CONFIG.baseUrl}/sitemap-${i}.xml`,
      lastmod: now,
    });
  }

  return entries;
}

/**
 * حساب حجم الـ sitemap التقريبي
 */
export function estimateSitemapSize(urls: SitemapEntry[]): number {
  // تقدير تقريبي: كل URL يأخذ حوالي 500 بايت في المتوسط
  const avgBytesPerUrl = 500;
  const headerFooterBytes = 200;

  return headerFooterBytes + urls.length * avgBytesPerUrl;
}

/**
 * التحقق من صحة URL
 */
export function isValidSitemapUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * تنظيف وتصفية URLs
 */
export function sanitizeSitemapUrls(urls: SitemapEntry[]): SitemapEntry[] {
  return urls.filter((entry) => {
    // التحقق من صحة URL
    if (!isValidSitemapUrl(entry.url)) return false;

    // التحقق من صحة الأولوية
    if (entry.priority < 0 || entry.priority > 1) return false;

    return true;
  });
}

/**
 * ترتيب URLs حسب الأولوية
 */
export function sortByPriority(urls: SitemapEntry[]): SitemapEntry[] {
  return [...urls].sort((a, b) => b.priority - a.priority);
}

export default {
  splitUrlsIntoSitemaps,
  shouldUseSitemapIndex,
  generateSitemapIndexEntries,
  estimateSitemapSize,
  isValidSitemapUrl,
  sanitizeSitemapUrls,
  sortByPriority,
};
