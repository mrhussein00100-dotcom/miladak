/**
 * Enhanced Robots.txt Configuration
 * ملف robots.txt محسن لمحركات البحث
 */

import { MetadataRoute } from 'next';
import { SEO_CONFIG, ROBOTS_CONFIG } from '@/lib/seo/config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SEO_CONFIG.baseUrl;

  return {
    rules: [
      // قواعد عامة لجميع الزواحف
      {
        userAgent: '*',
        allow: [...ROBOTS_CONFIG.allowedPaths],
        disallow: [...ROBOTS_CONFIG.disallowedPaths],
      },
      // قواعد خاصة بـ Googlebot
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/'],
      },
      // قواعد خاصة بـ Bingbot
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/'],
      },
      // قواعد خاصة بـ Googlebot-Image
      {
        userAgent: 'Googlebot-Image',
        allow: ['/images/', '/uploads/', '/icon.svg', '/favicon.svg'],
        disallow: ['/admin/', '/api/'],
      },
      // منع AdsBot من الصفحات الخاصة
      {
        userAgent: 'AdsBot-Google',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // منع زواحف غير مرغوبة
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
