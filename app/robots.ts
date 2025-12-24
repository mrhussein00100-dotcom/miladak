/**
 * Robots.txt Configuration
 * ملف robots.txt محسن لمحركات البحث
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/test-'],
      },
    ],
    sitemap: 'https://www.miladak.com/sitemap.xml',
  };
}
