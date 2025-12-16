# Design Document: نظام إدارة المقالات والتصنيفات

## Overview

نظام شامل لإدارة المقالات والتصنيفات في لوحة تحكم موقع ميلادك، يتضمن مولدات ذكاء اصطناعي متعددة (مجانية ومدفوعة)، مولد محلي مخصص، نظام صور ذكي مع قاموس ترجمة، ونظام نشر تلقائي يومي.

## Architecture

```mermaid
graph TB
    subgraph "Frontend - Admin Panel"
        AP[Admin Pages]
        AE[Article Editor]
        CM[Category Manager]
        AI_UI[AI Generator UI]
    end

    subgraph "API Layer"
        AA[/api/admin/articles]
        AC[/api/admin/categories]
        AG[/api/admin/ai/generate]
        AR[/api/admin/ai/rewrite]
        AIM[/api/admin/images]
    end

    subgraph "AI Providers"
        GEM[Gemini API]
        OAI[OpenAI API]
        COH[Cohere API]
        HF[HuggingFace API]
        LOCAL[Local AI Generator]
    end

    subgraph "Image Services"
        PEX[Pexels API]
        UNS[Unsplash API]
        PIX[Pixabay API]
        DICT[Arabic Dictionary]
    end

    subgraph "Database"
        DB[(SQLite)]
        ART[articles]
        CAT[categories]
        TPL[templates]
        TRANS[translations]
    end

    AP --> AA
    AE --> AG
    AE --> AR
    AE --> AIM
    CM --> AC

    AG --> GEM
    AG --> OAI
    AG --> COH
    AG --> HF
    AG --> LOCAL

    AIM --> DICT
    AIM --> PEX
    AIM --> UNS
    AIM --> PIX

    AA --> DB
    AC --> DB
    LOCAL --> TPL
    DICT --> TRANS
```

## Components and Interfaces

### 1. Database Schema

```sql
-- جدول المقالات
CREATE TABLE articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    category_id INTEGER REFERENCES categories(id),
    status TEXT DEFAULT 'draft', -- draft, published, scheduled, trash
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT, -- JSON array
    views INTEGER DEFAULT 0,
    author TEXT DEFAULT 'admin',
    ai_provider TEXT, -- which AI generated this
    publish_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول التصنيفات
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#6366f1',
    icon TEXT,
    parent_id INTEGER REFERENCES categories(id),
    sort_order INTEGER DEFAULT 0,
    article_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول قوالب المولد المحلي
CREATE TABLE ai_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- birthday, zodiac, age, events
    template_content TEXT NOT NULL, -- with {{placeholders}}
    variables TEXT, -- JSON array of required variables
    min_words INTEGER DEFAULT 500,
    max_words INTEGER DEFAULT 2000,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول قاموس الترجمة للصور
CREATE TABLE image_translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    arabic_term TEXT NOT NULL,
    english_terms TEXT NOT NULL, -- JSON array of translations
    context TEXT, -- birthday, zodiac, celebration, etc.
    priority INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول إعدادات النشر التلقائي
CREATE TABLE auto_publish_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    is_enabled INTEGER DEFAULT 0,
    publish_time TEXT DEFAULT '09:00',
    frequency TEXT DEFAULT 'daily', -- daily, weekly
    topics TEXT, -- JSON array
    default_category_id INTEGER REFERENCES categories(id),
    ai_provider TEXT DEFAULT 'gemini',
    content_length TEXT DEFAULT 'medium',
    last_run DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول سجل النشر التلقائي
CREATE TABLE auto_publish_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER REFERENCES articles(id),
    status TEXT, -- success, failed, retry
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 2. AI Generator Interface

```typescript
// types/ai-generator.ts
interface AIProvider {
  name: string;
  id: 'gemini' | 'openai' | 'claude' | 'cohere' | 'huggingface' | 'local';
  isFree: boolean;
  maxTokens: number;
  supportsArabic: boolean;
}

interface GenerationRequest {
  topic: string;
  length: 'short' | 'medium' | 'long' | 'comprehensive'; // 500, 1500, 3000, 5000+
  provider: AIProvider['id'];
  style?: 'formal' | 'casual' | 'seo' | 'academic';
  includeKeywords?: string[];
  category?: string;
}

interface GenerationResponse {
  content: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  wordCount: number;
  provider: string;
  generationTime: number;
}

interface RewriteRequest {
  content: string;
  provider: AIProvider['id'];
  style: 'formal' | 'casual' | 'seo' | 'simplified' | 'academic';
}

interface RewriteResponse {
  original: string;
  rewritten: string;
  wordCount: number;
  provider: string;
}
```

### 3. Local AI Generator

```typescript
// lib/ai/local-generator.ts
interface LocalTemplate {
  id: number;
  name: string;
  category: 'birthday' | 'zodiac' | 'age' | 'events' | 'general';
  templateContent: string;
  variables: string[];
  minWords: number;
  maxWords: number;
}

interface TemplateVariables {
  name?: string;
  age?: number;
  birthDate?: string;
  zodiacSign?: string;
  chineseZodiac?: string;
  birthstone?: string;
  birthFlower?: string;
  luckyNumber?: number;
  luckyColor?: string;
  historicalEvents?: string[];
  celebrities?: string[];
}

class LocalAIGenerator {
  // توليد مقال من القوالب
  generateArticle(
    topic: string,
    length: string,
    variables: TemplateVariables
  ): GenerationResponse;

  // دمج عدة قوالب لمقال طويل
  combineTemplates(
    templates: LocalTemplate[],
    variables: TemplateVariables
  ): string;

  // إعادة صياغة محلية
  rewriteContent(content: string, style: string): string;

  // توليد عناوين
  generateTitles(topic: string, count: number): string[];
}
```

### 4. Image Service Interface

```typescript
// lib/images/image-service.ts
interface ImageSearchRequest {
  query: string; // Arabic or English
  provider: 'pexels' | 'unsplash' | 'pixabay';
  count?: number;
  orientation?: 'landscape' | 'portrait' | 'square';
}

interface ImageResult {
  id: string;
  url: string;
  thumbnailUrl: string;
  photographer: string;
  source: string;
  relevanceScore: number;
}

interface ArabicTranslation {
  arabicTerm: string;
  englishTerms: string[];
  context: string;
}

class ImageService {
  // ترجمة المصطلح العربي
  translateToEnglish(arabicTerm: string): string[];

  // البحث عن صور
  searchImages(request: ImageSearchRequest): Promise<ImageResult[]>;

  // ترتيب النتائج حسب الصلة
  rankByRelevance(images: ImageResult[], keywords: string[]): ImageResult[];

  // تحسين الصورة
  optimizeImage(imageUrl: string): Promise<string>;
}
```

## Data Models

### Article Model

```typescript
interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  categoryId: number;
  category?: Category;
  status: 'draft' | 'published' | 'scheduled' | 'trash';
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  views: number;
  author: string;
  aiProvider?: string;
  publishDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Category Model

```typescript
interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  parentId?: number;
  parent?: Category;
  children?: Category[];
  sortOrder: number;
  articleCount: number;
  createdAt: Date;
}
```

## Error Handling

```typescript
// lib/errors/ai-errors.ts
class AIGenerationError extends Error {
  constructor(
    message: string,
    public provider: string,
    public canRetry: boolean,
    public fallbackProvider?: string
  ) {
    super(message);
  }
}

class ImageSearchError extends Error {
  constructor(
    message: string,
    public provider: string,
    public suggestedKeywords?: string[]
  ) {
    super(message);
  }
}

// Fallback chain for AI providers
const AI_FALLBACK_CHAIN = ['gemini', 'cohere', 'huggingface', 'local'];
```

## Testing Strategy

### Unit Tests

- اختبار دوال المولد المحلي
- اختبار ترجمة المصطلحات العربية
- اختبار تحويل القوالب

### Integration Tests

- اختبار APIs المقالات والتصنيفات
- اختبار الاتصال بمزودي الذكاء الاصطناعي
- اختبار البحث عن الصور

### E2E Tests

- اختبار إنشاء مقال كامل مع AI
- اختبار النشر التلقائي
- اختبار إدارة التصنيفات

## File Structure

```
app/
├── admin/
│   ├── articles/
│   │   ├── page.tsx              # قائمة المقالات
│   │   ├── new/
│   │   │   └── page.tsx          # إنشاء مقال جديد
│   │   └── [id]/
│   │       └── page.tsx          # تعديل مقال
│   └── categories/
│       └── page.tsx              # إدارة التصنيفات
├── api/
│   └── admin/
│       ├── articles/
│       │   ├── route.ts          # GET, POST
│       │   └── [id]/
│       │       └── route.ts      # GET, PUT, DELETE
│       ├── categories/
│       │   ├── route.ts          # GET, POST
│       │   └── [id]/
│       │       └── route.ts      # GET, PUT, DELETE
│       ├── ai/
│       │   ├── generate/
│       │   │   └── route.ts      # POST - توليد محتوى
│       │   ├── rewrite/
│       │   │   └── route.ts      # POST - إعادة صياغة
│       │   ├── meta/
│       │   │   └── route.ts      # POST - توليد ميتا
│       │   └── titles/
│       │       └── route.ts      # POST - توليد عناوين
│       ├── images/
│       │   ├── search/
│       │   │   └── route.ts      # GET - بحث صور
│       │   └── translate/
│       │       └── route.ts      # POST - ترجمة مصطلح
│       └── auto-publish/
│           ├── route.ts          # GET, PUT - إعدادات
│           └── run/
│               └── route.ts      # POST - تشغيل يدوي

components/
└── admin/
    ├── articles/
    │   ├── ArticlesList.tsx      # قائمة المقالات
    │   ├── ArticleEditor.tsx     # محرر المقالات
    │   ├── ArticleForm.tsx       # نموذج المقال
    │   └── ArticlePreview.tsx    # معاينة المقال
    ├── categories/
    │   ├── CategoriesList.tsx    # قائمة التصنيفات
    │   ├── CategoryForm.tsx      # نموذج التصنيف
    │   └── CategoryTree.tsx      # شجرة التصنيفات
    ├── ai/
    │   ├── AIGeneratorPanel.tsx  # لوحة التوليد
    │   ├── ProviderSelector.tsx  # اختيار المزود
    │   ├── RewritePanel.tsx      # لوحة إعادة الصياغة
    │   └── MetaGenerator.tsx     # توليد الميتا
    └── images/
        ├── ImageSearch.tsx       # بحث الصور
        ├── ImagePicker.tsx       # اختيار الصورة
        └── TranslationHelper.tsx # مساعد الترجمة

lib/
├── ai/
│   ├── providers/
│   │   ├── gemini.ts            # Gemini API
│   │   ├── openai.ts            # OpenAI API
│   │   ├── cohere.ts            # Cohere API
│   │   ├── huggingface.ts       # HuggingFace API
│   │   └── local.ts             # المولد المحلي
│   ├── generator.ts             # AI Generator main
│   ├── rewriter.ts              # إعادة الصياغة
│   └── templates.ts             # قوالب المولد المحلي
├── images/
│   ├── providers/
│   │   ├── pexels.ts            # Pexels API
│   │   ├── unsplash.ts          # Unsplash API
│   │   └── pixabay.ts           # Pixabay API
│   ├── translator.ts            # مترجم المصطلحات
│   └── dictionary.ts            # قاموس الترجمة
└── db/
    ├── articles.ts              # عمليات المقالات
    ├── categories.ts            # عمليات التصنيفات
    └── templates.ts             # عمليات القوالب
```

## UI Components Design

### Articles List Page

- جدول مع: العنوان، التصنيف، الحالة، التاريخ، المشاهدات
- فلترة حسب: الحالة، التصنيف، التاريخ
- بحث في العنوان والمحتوى
- أزرار: إضافة، تعديل، حذف، معاينة
- Pagination مع 20 مقال لكل صفحة

### Article Editor Page

- محرر WYSIWYG مع toolbar كامل
- Sidebar يمين: التصنيف، الحالة، تاريخ النشر
- Sidebar يسار: AI Tools، SEO، الصورة البارزة
- Auto-save كل 30 ثانية
- معاينة فورية

### AI Generator Panel

- اختيار المزود (dropdown مع أيقونات)
- حقل الموضوع
- اختيار الطول (radio buttons)
- اختيار النمط
- زر التوليد مع loading state
- عرض النتيجة مع خيارات: استخدام، إعادة توليد، تعديل

### Categories Manager

- شجرة تصنيفات قابلة للسحب والإفلات
- نموذج إضافة/تعديل في modal
- Color picker للألوان
- Icon picker للأيقونات
- عداد المقالات لكل تصنيف
