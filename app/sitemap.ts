/**
 * Dynamic Sitemap Generator
 * يولد sitemap ديناميكي يجلب المقالات والأدوات من قاعدة البيانات
 */

import { MetadataRoute } from 'next';
import {
  SEO_CONFIG,
  SITEMAP_PRIORITY,
  SITEMAP_CHANGE_FREQ,
  STATIC_PAGES,
} from '@/lib/seo/config';

const BASE_URL = SEO_CONFIG.baseUrl.replace(/\/+$/, '');

export const revalidate = 0;

function joinUrl(path: string) {
  const cleanedPath = path.replace(/^\/+/, '');
  return cleanedPath ? `${BASE_URL}/${cleanedPath}` : BASE_URL;
}

/**
 * جلب المقالات المنشورة من قاعدة البيانات
 */
async function getPublishedArticles() {
  try {
    // استخدم قاعدة البيانات مباشرة بدلاً من API
    const unifiedDb = (await import('@/lib/db/unified-connection')).default;
    await unifiedDb.initialize();

    const articles = await unifiedDb.query(
      "SELECT slug, updated_at FROM articles WHERE CAST(published AS TEXT) IN ('1', 'true', 't') ORDER BY created_at DESC"
    );
    return articles;
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error);
    return [];
  }
}

/**
 * جلب الأدوات النشطة من قاعدة البيانات
 */
async function getActiveTools() {
  try {
    // استخدم قاعدة البيانات مباشرة بدلاً من API
    const unifiedDb = (await import('@/lib/db/unified-connection')).default;
    await unifiedDb.initialize();

    const tools = await unifiedDb.query(
      "SELECT href FROM tools WHERE CAST(is_active AS TEXT) IN ('1', 'true', 't') ORDER BY sort_order"
    );
    return tools;
  } catch (error) {
    console.error('Error fetching tools for sitemap:', error);
    return [];
  }
}

/**
 * جلب التصنيفات من قاعدة البيانات
 */
async function getCategories() {
  try {
    // استخدم قاعدة البيانات مباشرة بدلاً من API
    const unifiedDb = (await import('@/lib/db/unified-connection')).default;
    await unifiedDb.initialize();

    const categories = await unifiedDb.query(
      'SELECT slug FROM article_categories ORDER BY sort_order'
    );
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * جلب روابط الأيام (366 يوم)
 */
function getDayLinks() {
  const days: { path: string }[] = [];
  for (let month = 1; month <= 12; month++) {
    const daysInMonth = new Date(2024, month, 0).getDate(); // 2024 سنة كبيسة لضمان وجود 29 فبراير
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ path: `/date/${month}/${day}` });
    }
  }
  return days;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1. الصفحات الثابتة
  const staticPages: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: joinUrl(page.path),
    lastModified: now,
    changeFrequency: page.changeFreq,
    priority: page.priority,
  }));

  // 1.5 روابط التواريخ اليومية
  const dayPages: MetadataRoute.Sitemap = getDayLinks().map((day) => ({
    url: joinUrl(day.path),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  try {
    const [articles, tools, categories] = await Promise.all([
      getPublishedArticles(),
      getActiveTools(),
      getCategories(),
    ]);

    // 2. صفحات المقالات من قاعدة البيانات
    const articlePages: MetadataRoute.Sitemap = Array.isArray(articles)
      ? articles.map((article: any) => ({
          url: joinUrl(`/articles/${article.slug}`),
          lastModified: article.updated_at ? new Date(article.updated_at) : now,
          changeFrequency: SITEMAP_CHANGE_FREQ.articlePage,
          priority: SITEMAP_PRIORITY.articlePage,
        }))
      : [];

    // 3. صفحات الأدوات من قاعدة البيانات
    const toolPages: MetadataRoute.Sitemap = Array.isArray(tools)
      ? tools.map((tool: any) => ({
          url: joinUrl(tool.href),
          lastModified: now,
          changeFrequency: SITEMAP_CHANGE_FREQ.toolPage,
          priority: SITEMAP_PRIORITY.toolPage,
        }))
      : [];

    // 4. صفحات التصنيفات
    const categoryPages: MetadataRoute.Sitemap = Array.isArray(categories)
      ? categories.map((category: any) => ({
          url: joinUrl(`/categories/${category.slug}`),
          lastModified: now,
          changeFrequency: SITEMAP_CHANGE_FREQ.categoryPage,
          priority: SITEMAP_PRIORITY.categoryPage,
        }))
      : [];

    // دمج جميع الصفحات
    return [
      ...staticPages,
      ...articlePages,
      ...toolPages,
      ...categoryPages,
      ...dayPages,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // في حالة الخطأ، أرجع الصفحات الثابتة فقط
    return staticPages;
  }
}
