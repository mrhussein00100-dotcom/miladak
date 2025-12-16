/**
 * Dynamic Sitemap Generator
 * يولد sitemap ديناميكي يجلب المقالات والأدوات من قاعدة البيانات
 */

import { MetadataRoute } from 'next';
import { queryAll } from '@/lib/db/unified-database';
import {
  SEO_CONFIG,
  SITEMAP_PRIORITY,
  SITEMAP_CHANGE_FREQ,
  STATIC_PAGES,
} from '@/lib/seo/config';
import type { ArticleSitemapData, ToolSitemapData } from '@/lib/seo/types';

const BASE_URL = SEO_CONFIG.baseUrl;

/**
 * جلب المقالات المنشورة من قاعدة البيانات
 */
function getPublishedArticles(): ArticleSitemapData[] {
  try {
    return queryAll<ArticleSitemapData>(
      `SELECT slug, updated_at, published 
       FROM articles 
       WHERE published = 1 
       ORDER BY updated_at DESC`
    );
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error);
    return [];
  }
}

/**
 * جلب الأدوات النشطة من قاعدة البيانات
 */
function getActiveTools(): ToolSitemapData[] {
  try {
    return queryAll<ToolSitemapData>(
      `SELECT name, href, is_active 
       FROM tools 
       WHERE is_active = 1 
       ORDER BY sort_order ASC`
    );
  } catch (error) {
    console.error('Error fetching tools for sitemap:', error);
    return [];
  }
}

/**
 * جلب التصنيفات من قاعدة البيانات
 */
function getCategories(): { slug: string }[] {
  try {
    return queryAll<{ slug: string }>(
      `SELECT slug FROM categories WHERE slug IS NOT NULL`
    );
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
    return [];
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 1. الصفحات الثابتة
  const staticPages: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFreq,
    priority: page.priority,
  }));

  // 2. صفحات المقالات من قاعدة البيانات
  const articles = getPublishedArticles();
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/articles/${article.slug}`,
    lastModified: article.updated_at ? new Date(article.updated_at) : now,
    changeFrequency: SITEMAP_CHANGE_FREQ.articlePage,
    priority: SITEMAP_PRIORITY.articlePage,
  }));

  // 3. صفحات الأدوات من قاعدة البيانات
  const tools = getActiveTools();
  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${BASE_URL}${tool.href}`,
    lastModified: now,
    changeFrequency: SITEMAP_CHANGE_FREQ.toolPage,
    priority: SITEMAP_PRIORITY.toolPage,
  }));

  // 4. صفحات التصنيفات
  const categories = getCategories();
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/categories/${category.slug}`,
    lastModified: now,
    changeFrequency: SITEMAP_CHANGE_FREQ.categoryPage,
    priority: SITEMAP_PRIORITY.categoryPage,
  }));

  // دمج جميع الصفحات
  return [...staticPages, ...articlePages, ...toolPages, ...categoryPages];
}
