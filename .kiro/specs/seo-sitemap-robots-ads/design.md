# Design Document: SEO Sitemap, Robots & Ads

## Overview

هذا التصميم يوضح كيفية تحسين SEO لموقع ميلادك من خلال:

1. Sitemap ديناميكي يجلب المحتوى من قاعدة البيانات تلقائياً
2. ملف robots.txt محسن لمحركات البحث
3. ملف ads.txt للربح من AdSense
4. Structured Data (JSON-LD) لتحسين ظهور الموقع في نتائج البحث

## Architecture

```mermaid
graph TB
    subgraph "SEO Files"
        A[sitemap.ts] --> B[Dynamic Sitemap Generator]
        C[robots.ts] --> D[Robots.txt Generator]
        E[ads.txt Route] --> F[Ads.txt File]
    end

    subgraph "Data Sources"
        G[(Database)]
        H[Environment Variables]
    end

    subgraph "Output"
        I[/sitemap.xml]
        J[/robots.txt]
        K[/ads.txt]
    end

    B --> G
    B --> I
    D --> J
    E --> H
    E --> K

    subgraph "Structured Data"
        L[JSON-LD Components]
        M[Article Schema]
        N[WebApplication Schema]
        O[Organization Schema]
    end
```

## Components and Interfaces

### 1. Dynamic Sitemap Generator (`app/sitemap.ts`)

```typescript
interface SitemapEntry {
  url: string;
  lastModified: Date;
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

interface SitemapConfig {
  baseUrl: string;
  staticPages: SitemapEntry[];
  dynamicSources: {
    articles: () => Promise<SitemapEntry[]>;
    tools: () => Promise<SitemapEntry[]>;
    categories: () => Promise<SitemapEntry[]>;
  };
}
```

### 2. Robots.txt Generator (`app/robots.ts`)

```typescript
interface RobotsConfig {
  rules: {
    userAgent: string;
    allow?: string[];
    disallow?: string[];
    crawlDelay?: number;
  }[];
  sitemap: string;
  host?: string;
}
```

### 3. Ads.txt Route (`app/ads.txt/route.ts`)

```typescript
interface AdsEntry {
  domain: string;
  publisherId: string;
  relationship: 'DIRECT' | 'RESELLER';
  certificationId?: string;
}
```

### 4. SEO Utilities (`lib/seo/`)

```typescript
// JSON-LD Schema Types
interface ArticleSchema {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: PersonSchema;
  publisher: OrganizationSchema;
}

interface WebApplicationSchema {
  '@context': 'https://schema.org';
  '@type': 'WebApplication';
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
}

interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
}
```

## Data Models

### Sitemap Data Flow

```typescript
// From articles table
interface ArticleSitemapData {
  slug: string;
  updated_at: string;
  published: number;
}

// From tools table
interface ToolSitemapData {
  name: string; // slug
  href: string;
  is_active: number;
}

// Priority Configuration
const PRIORITY_CONFIG = {
  home: 1.0,
  tools: 0.9,
  toolPages: 0.8,
  articles: 0.8,
  categories: 0.7,
  staticPages: 0.5,
};
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Sitemap Completeness

_For any_ published article in the database, the generated sitemap SHALL contain a URL entry for that article with the correct slug and lastModified date matching the article's updated_at field.
**Validates: Requirements 1.1, 1.3, 1.6**

### Property 2: Tool Inclusion

_For any_ active tool in the database, the generated sitemap SHALL contain a URL entry for that tool with appropriate priority (0.8) and change frequency (monthly).
**Validates: Requirements 1.2, 1.4**

### Property 3: Priority Assignment

_For any_ URL in the sitemap, the priority value SHALL be within the range [0.0, 1.0] and SHALL match the expected priority for its page type (home: 1.0, tools: 0.9, articles: 0.8, static: 0.5-0.7).
**Validates: Requirements 1.7**

### Property 4: Ads.txt Format Compliance

_For any_ ads.txt entry, the format SHALL follow the IAB specification: `domain, publisher-id, relationship[, certification-id]` where relationship is either DIRECT or RESELLER.
**Validates: Requirements 3.2**

### Property 5: Environment Variable Configuration

_For any_ configuration value in ads.txt, if an environment variable is set, the generated file SHALL use that value instead of the default.
**Validates: Requirements 3.5**

### Property 6: Sitemap Size Compliance

_For any_ generated sitemap file, the total number of URLs SHALL not exceed 50,000 and the uncompressed file size SHALL not exceed 50MB.
**Validates: Requirements 5.1, 5.3**

## Error Handling

### Database Errors

- إذا فشل الاتصال بقاعدة البيانات، يتم إرجاع sitemap يحتوي فقط على الصفحات الثابتة
- يتم تسجيل الخطأ في console للمراقبة

### Missing Environment Variables

- إذا لم يتم تعيين `ADSENSE_PUBLISHER_ID`، يتم إرجاع ملف ads.txt فارغ مع تعليق
- يتم عرض تحذير في وضع التطوير

### Invalid Data

- يتم تجاهل المقالات بدون slug صالح
- يتم تجاهل الأدوات غير النشطة

## Testing Strategy

### Unit Testing

- اختبار دوال توليد URLs
- اختبار تنسيق التواريخ
- اختبار قيم الأولوية

### Property-Based Testing

سيتم استخدام مكتبة `fast-check` للاختبارات:

1. **Sitemap Completeness Test**: توليد مقالات عشوائية والتحقق من ظهورها في الـ sitemap
2. **Priority Range Test**: التحقق من أن جميع قيم الأولوية ضمن النطاق المسموح
3. **Ads.txt Format Test**: توليد إدخالات عشوائية والتحقق من صحة التنسيق

### Integration Testing

- اختبار الـ sitemap مع قاعدة بيانات حقيقية
- اختبار robots.txt مع محاكاة طلبات الزواحف

### Test Annotations

كل اختبار property-based يجب أن يحتوي على تعليق بالصيغة:

```typescript
// **Feature: seo-sitemap-robots-ads, Property {number}: {property_text}**
```
