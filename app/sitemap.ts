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

const BASE_URL = SEO_CONFIG.baseUrl;

/**
 * جلب المقالات المنشورة من قاعدة البيانات
 */
async function getPublishedArticles() {
  try {
    // في بيئة الإنتاج، سنجلب من PostgreSQL عبر API
    const response = await fetch(`${BASE_URL}/api/articles?published=true`, {
      cache: 'no-store',
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.articles || [];
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
    // في بيئة الإنتاج، سنجلب من PostgreSQL عبر API
    const response = await fetch(`${BASE_URL}/api/tools?active=true`, {
      cache: 'no-store',
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.tools || [];
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
    // في بيئة الإنتاج، سنجلب من PostgreSQL عبر API
    const response = await fetch(`${BASE_URL}/api/categories`, {
      cache: 'no-store',
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1. الصفحات الثابتة
  const staticPages: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFreq,
    priority: page.priority,
  }));

  try {
    // 2. صفحات المقالات من قاعدة البيانات
    const articles = await getPublishedArticles();
    const articlePages: MetadataRoute.Sitemap = Array.isArray(articles)
      ? articles.map((article: any) => ({
          url: `${BASE_URL}/articles/${article.slug}`,
          lastModified: article.updated_at ? new Date(article.updated_at) : now,
          changeFrequency: SITEMAP_CHANGE_FREQ.articlePage,
          priority: SITEMAP_PRIORITY.articlePage,
        }))
      : [];

    // 3. صفحات الأدوات من قاعدة البيانات
    const tools = await getActiveTools();
    const toolPages: MetadataRoute.Sitemap = Array.isArray(tools)
      ? tools.map((tool: any) => ({
          url: `${BASE_URL}${tool.href}`,
          lastModified: now,
          changeFrequency: SITEMAP_CHANGE_FREQ.toolPage,
          priority: SITEMAP_PRIORITY.toolPage,
        }))
      : [];

    // 4. صفحات التصنيفات
    const categories = await getCategories();
    const categoryPages: MetadataRoute.Sitemap = Array.isArray(categories)
      ? categories.map((category: any) => ({
          url: `${BASE_URL}/categories/${category.slug}`,
          lastModified: now,
          changeFrequency: SITEMAP_CHANGE_FREQ.categoryPage,
          priority: SITEMAP_PRIORITY.categoryPage,
        }))
      : [];

    // دمج جميع الصفحات
    return [...staticPages, ...articlePages, ...toolPages, ...categoryPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // في حالة الخطأ، أرجع الصفحات الثابتة فقط
    return staticPages;
  }
}
