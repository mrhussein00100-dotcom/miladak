/**
 * JSON-LD Schema Generators
 * مولدات البيانات المنظمة لـ SEO
 */

import { SEO_CONFIG, JSONLD_DEFAULTS } from './config';
import type {
  ArticleSchema,
  WebApplicationSchema,
  OrganizationSchema,
  WebSiteSchema,
  BreadcrumbSchema,
  FAQSchema,
} from './types';

/**
 * توليد schema للمؤسسة/الموقع
 */
export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.baseUrl,
    logo: `${SEO_CONFIG.baseUrl}${SEO_CONFIG.logo}`,
    description: SEO_CONFIG.defaultDescription,
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Arabic', 'English'],
    },
  };
}

/**
 * توليد schema للموقع
 */
export function generateWebSiteSchema(): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.baseUrl,
    description: SEO_CONFIG.defaultDescription,
    inLanguage: 'ar',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SEO_CONFIG.baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * توليد schema للمقال
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  author?: string;
  keywords?: string;
  category?: string;
  wordCount?: number;
}): ArticleSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image || `${SEO_CONFIG.baseUrl}${SEO_CONFIG.defaultImage}`,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Person',
      name: article.author || 'فريق ميلادك',
    },
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${SEO_CONFIG.baseUrl}${SEO_CONFIG.logo}`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SEO_CONFIG.baseUrl}/articles/${article.slug}`,
    },
    keywords: article.keywords,
    articleSection: article.category,
    wordCount: article.wordCount,
  };
}

/**
 * توليد schema لتطبيق الويب (الأدوات)
 */
export function generateWebApplicationSchema(tool: {
  name: string;
  description: string;
  url: string;
  category?: string;
}): WebApplicationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.description,
    url: tool.url,
    applicationCategory: tool.category || 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

/**
 * توليد schema للتنقل (Breadcrumb)
 */
export function generateBreadcrumbSchema(
  items: { name: string; url?: string }[]
): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * توليد schema للأسئلة الشائعة
 */
export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
): FAQSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * تحويل schema إلى script tag
 */
export function schemaToScript(schema: object): string {
  return JSON.stringify(schema);
}

export default {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateArticleSchema,
  generateWebApplicationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  schemaToScript,
};
