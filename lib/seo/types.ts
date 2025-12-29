/**
 * SEO Types and Interfaces
 * أنواع TypeScript لـ Sitemap, Robots, و JSON-LD Schemas
 */

// ==================== Sitemap Types ====================

export interface SitemapEntry {
  url: string;
  lastModified: Date | string;
  changeFrequency:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority: number;
}

export interface ArticleSitemapData {
  slug: string;
  updated_at: string;
  published: number;
}

export interface ToolSitemapData {
  name: string;
  href: string;
  is_active: number;
}

export interface CategorySitemapData {
  slug: string;
  updated_at?: string;
}

// ==================== Robots Types ====================

export interface RobotsRule {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
}

export interface RobotsConfig {
  rules: RobotsRule[];
  sitemap: string;
  host?: string;
}

// ==================== Ads.txt Types ====================

export interface AdsEntry {
  domain: string;
  publisherId: string;
  relationship: 'DIRECT' | 'RESELLER';
  certificationId?: string;
}

// ==================== JSON-LD Schema Types ====================

export interface PersonSchema {
  '@type': 'Person';
  name: string;
  url?: string;
}

export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    '@type': 'ContactPoint';
    contactType: string;
    availableLanguage: string[];
  };
}

export interface ArticleSchema {
  '@context': 'https://schema.org';
  '@type': 'Article' | 'BlogPosting' | 'NewsArticle';
  headline: string;
  description: string;
  image: string | string[];
  datePublished: string;
  dateModified: string;
  author: PersonSchema | PersonSchema[];
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  mainEntityOfPage?: {
    '@type': 'WebPage';
    '@id': string;
  };
  keywords?: string;
  articleSection?: string;
  wordCount?: number;
}

export interface WebApplicationSchema {
  '@context': 'https://schema.org';
  '@type': 'WebApplication';
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  offers?: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: string;
    ratingCount: string;
  };
}

export interface WebSiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
  inLanguage?: string;
}

export interface BreadcrumbSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: {
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }[];
}

export interface FAQSchema {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: {
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }[];
}

// ==================== SEO Metadata Types ====================

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  openGraph?: OpenGraphData;
  twitter?: TwitterCardData;
  jsonLd?: object | object[];
}

export interface OpenGraphData {
  title: string;
  description: string;
  type: 'website' | 'article' | 'profile';
  url: string;
  image?: string;
  siteName?: string;
  locale?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

export interface TwitterCardData {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
}
