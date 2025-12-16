# Design Document

## Overview

تصميم تحسينات شاملة لصفحة الأدوات الرئيسية وصفحات الأدوات الفردية في موقع ميلادك، مع التركيز على:

- الشكل والأناقة العصرية
- السرعة والأداء العالي
- جلب البيانات من قاعدة البيانات (المقالات والكلمات المفتاحية)
- تحسين SEO مع التركيز على علامة "ميلادك"

## Architecture

```mermaid
graph TB
    subgraph "صفحة الأدوات الرئيسية"
        TP[Tools Page] --> TPH[Enhanced Hero Section]
        TP --> TPC[Tools Page Client]
        TP --> TRA[Tool Random Articles]
        TP --> TKS[Keywords Section]
    end

    subgraph "صفحات الأدوات الفردية"
        TIP[Tool Individual Page] --> TPL[Tool Page Layout]
        TPL --> TIPH[Tool Hero Section]
        TPL --> TC[Tool Calculator]
        TPL --> TIRA[Tool Random Articles]
        TPL --> TIKS[Tool Keywords Section]
        TPL --> TSEO[Tool SEO Content]
    end

    subgraph "قاعدة البيانات"
        DB[(SQLite Database)]
        DB --> ART[Articles Table]
        DB --> CAT[Categories Table]
        DB --> TOOLS[Tools Table]
        DB --> TCAT[Tool Categories Table]
    end

    subgraph "API Routes"
        API[/api/random-articles] --> DB
        API2[/api/tools/keywords] --> DB
    end

    TRA --> API
    TIRA --> API
    TKS --> API2
    TIKS --> API2
```

## Components and Interfaces

### 1. Enhanced Hero Section (تحسين الهيدر)

```typescript
interface EnhancedHeroProps {
  title: string;
  description: string;
  toolsCount: number;
  categoriesCount: number;
  showStats?: boolean;
  gradient?: string;
}
```

التحسينات:

- خلفية متدرجة متحركة (animated gradient)
- عناصر زخرفية عائمة (floating decorative elements)
- إحصائيات متحركة مع spring animation
- تصميم متجاوب للجوال

### 2. Tool Random Articles Widget (المقالات العشوائية)

```typescript
interface ToolRandomArticlesProps {
  toolSlug: string;
  toolCategory?: string;
  count?: number; // default: 6
  title?: string;
  className?: string;
}

interface ArticleCard {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category_name: string;
  read_time: number;
}
```

جلب المقالات من قاعدة البيانات:

```sql
SELECT a.*, c.name as category_name
FROM articles a
LEFT JOIN categories c ON a.category_id = c.id
WHERE a.published = 1
AND (
  a.meta_keywords LIKE '%' || :toolSlug || '%'
  OR c.slug = :toolCategory
)
ORDER BY RANDOM()
LIMIT 6
```

### 3. Keywords Cloud Section (سحابة الكلمات المفتاحية)

```typescript
interface KeywordsSectionProps {
  toolSlug?: string;
  className?: string;
}

interface Keyword {
  text: string;
  weight: number; // 1-5 for size variation
  category: string;
}
```

جلب الكلمات المفتاحية من قاعدة البيانات:

```sql
SELECT meta_keywords FROM tools WHERE slug = :toolSlug
```

### 4. Tool Page Layout (تخطيط صفحة الأداة الموحد)

```typescript
interface ToolPageLayoutProps {
  children: React.ReactNode;
  toolName: string;
  toolSlug: string;
  toolDescription: string;
  toolIcon?: string;
  gradient?: string;
  showKeywords?: boolean;
  showArticles?: boolean;
  showAds?: boolean;
  seoContent?: React.ReactNode;
}
```

## Data Models

### استخدام قاعدة البيانات الموجودة فقط

الجداول المتاحة حالياً:

- `tools` (21 سجل) - الأدوات: id, slug, title, description, icon, category_id, href, featured, active, sort_order
- `tool_categories` (7 سجل) - تصنيفات الأدوات: id, name, slug, title, icon, sort_order
- `articles` (47 سجل) - المقالات: id, title, slug, excerpt, content, category_id, image, author, read_time, views, published, featured, meta_description, meta_keywords
- `categories` (53 سجل) - تصنيفات المقالات: id, name, slug, description, color

### إنشاء جدول page_keywords للكلمات المفتاحية

جدول مركزي لإدارة الكلمات المفتاحية لجميع صفحات الموقع:

```sql
CREATE TABLE IF NOT EXISTS page_keywords (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_type TEXT NOT NULL,        -- 'tool', 'article', 'page'
  page_slug TEXT NOT NULL,        -- slug الصفحة
  page_title TEXT NOT NULL,       -- عنوان الصفحة للعرض في لوحة التحكم
  keywords TEXT NOT NULL,         -- الكلمات المفتاحية (مفصولة بفاصلة)
  meta_description TEXT,          -- وصف الصفحة للسيو
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(page_type, page_slug)
);

CREATE INDEX IF NOT EXISTS idx_page_keywords_type ON page_keywords(page_type);
CREATE INDEX IF NOT EXISTS idx_page_keywords_slug ON page_keywords(page_slug);
```

### جلب الكلمات المفتاحية للصفحة

```sql
SELECT keywords, meta_description
FROM page_keywords
WHERE page_type = :pageType AND page_slug = :pageSlug
```

### جلب المقالات العشوائية المرتبطة بالأداة

```sql
-- جلب مقالات عشوائية مرتبطة بالأداة
SELECT a.id, a.title, a.slug, a.excerpt, a.image, a.read_time, c.name as category_name
FROM articles a
LEFT JOIN categories c ON a.category_id = c.id
WHERE a.published = 1
ORDER BY RANDOM()
LIMIT 6
```

### API لإدارة الكلمات المفتاحية (لوحة التحكم)

- GET /api/admin/page-keywords - جلب جميع الصفحات وكلماتها المفتاحية
- GET /api/admin/page-keywords/:type/:slug - جلب كلمات صفحة محددة
- POST /api/admin/page-keywords - إضافة كلمات مفتاحية لصفحة جديدة
- PUT /api/admin/page-keywords/:id - تحديث كلمات صفحة
- DELETE /api/admin/page-keywords/:id - حذف كلمات صفحة

### API Response للمقالات العشوائية

```typescript
interface RandomArticlesResponse {
  articles: ArticleCard[];
  total: number;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Statistics Display Accuracy

_For any_ tools page with N tools and M categories, the hero section statistics SHALL display exactly N for tools count and M for categories count.
**Validates: Requirements 1.3**

### Property 2: Featured Tools Ordering

_For any_ list of tools containing featured and non-featured items, featured tools SHALL always appear before non-featured tools in the display.
**Validates: Requirements 3.4**

### Property 3: Search and Filter Correctness

_For any_ search query or category filter, the filtered tools list SHALL contain only tools that match the query in title/description OR belong to the selected category.
**Validates: Requirements 3.5, 3.6**

### Property 4: Random Articles Relevance

_For any_ tool page, the random articles widget SHALL return exactly 6 articles from the database, and if matching articles exist, they SHALL be related to the tool's category or keywords.
**Validates: Requirements 4.1, 4.2**

### Property 5: Article Card Completeness

_For any_ article card displayed, it SHALL contain title, excerpt, and image fields from the database.
**Validates: Requirements 4.3**

### Property 6: Article Link Correctness

_For any_ article card, clicking it SHALL navigate to `/articles/{article.slug}`.
**Validates: Requirements 4.4**

### Property 7: SEO Meta Tags Completeness

_For any_ tool page, the meta tags SHALL include title containing "ميلادك", description, Open Graph tags, and canonical URL.
**Validates: Requirements 6.1, 6.3, 6.5**

### Property 8: Structured Data Validity

_For any_ tool page, the JSON-LD structured data SHALL be valid and include WebApplication schema type.
**Validates: Requirements 6.2**

### Property 9: Page Structure Consistency

_For any_ tool individual page, it SHALL include hero section, calculator section, random articles section, and breadcrumbs navigation.
**Validates: Requirements 7.1, 7.2, 7.3**

### Property 10: Dual Date Input Synchronization

_For any_ date selected via dropdown or calendar, both input modes SHALL display the same date value.
**Validates: Requirements 8.2, 8.3**

### Property 11: Reduced Motion Respect

_For any_ animation on the page, when user has `prefers-reduced-motion: reduce` enabled, animations SHALL be disabled or minimized.
**Validates: Requirements 10.3**

## Error Handling

### Database Errors

- إذا فشل جلب المقالات: عرض رسالة "لا توجد مقالات متاحة حالياً"
- إذا فشل جلب الكلمات المفتاحية: استخدام كلمات مفتاحية افتراضية

### API Errors

- استخدام try-catch في جميع API calls
- عرض skeleton loaders أثناء التحميل
- عرض رسائل خطأ ودية بالعربية

### Fallback Behavior

- إذا لم توجد مقالات مطابقة: جلب مقالات عامة شائعة
- إذا لم توجد كلمات مفتاحية: استخدام كلمات افتراضية للأداة

## Testing Strategy

### Unit Testing

- اختبار مكونات React بشكل منفصل
- اختبار دوال جلب البيانات من قاعدة البيانات
- اختبار تنسيق البيانات والتحويلات

### Property-Based Testing

سنستخدم مكتبة `fast-check` للاختبارات القائمة على الخصائص:

```typescript
import fc from 'fast-check';
```

كل اختبار خاصية يجب أن:

- يعمل على الأقل 100 تكرار
- يتضمن تعليق يربطه بالخاصية في مستند التصميم
- يستخدم generators ذكية لتوليد بيانات واقعية

### Integration Testing

- اختبار تكامل API مع قاعدة البيانات
- اختبار تحميل الصفحات الكاملة
- اختبار التنقل بين الصفحات

### Performance Testing

- قياس وقت تحميل الصفحة (هدف: < 1 ثانية)
- قياس وقت استجابة API (هدف: < 200ms)
- اختبار lazy loading للأقسام
