# Design Document

## Overview

نظام توليد محتوى محلي شامل ومتفوق يحل مشاكل Gemini و Groq المتكررة. يعتمد على محرك محلي متطور مع قوالب ديناميكية غير محدودة، ويستخدم جدول الكلمات المفتاحية في قاعدة البيانات للتنوع والدقة في المحتوى والصور.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Unified Content Generator                         │
│                    (lib/ai/unified-generator.ts)                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  Local Engine    │  │  Gemini Engine   │  │   Groq Engine    │  │
│  │  (PRIMARY)       │  │  (OPTIONAL)      │  │   (OPTIONAL)     │  │
│  │  - Always works  │  │  - API fallback  │  │   - API fallback │  │
│  │  - Rich content  │  │  - External AI   │  │   - External AI  │  │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘  │
│           │                     │                     │             │
│           └─────────────────────┼─────────────────────┘             │
│                                 │                                    │
│  ┌──────────────────────────────┴──────────────────────────────┐   │
│  │              Dynamic Template System                         │   │
│  │              (lib/ai/dynamic-templates.ts)                   │   │
│  │  - 1000+ intro variations                                    │   │
│  │  - 5000+ paragraph variations                                │   │
│  │  - 1000+ conclusion variations                               │   │
│  │  - Keyword-based content from database                       │   │
│  └──────────────────────────────┬──────────────────────────────┘   │
│                                 │                                    │
│  ┌──────────────────────────────┴──────────────────────────────┐   │
│  │              Smart Image Manager                             │   │
│  │              (lib/images/smart-images.ts)                    │   │
│  │  - No image repetition (database tracking)                   │   │
│  │  - Keyword-based search from database                        │   │
│  │  - Pexels + Unsplash providers                               │   │
│  │  - Relevance scoring                                         │   │
│  └──────────────────────────────┬──────────────────────────────┘   │
│                                 │                                    │
│  ┌──────────────────────────────┴──────────────────────────────┐   │
│  │              Quality Gate                                    │   │
│  │              (lib/ai/quality-gate.ts)                        │   │
│  │  - Article completeness check                                │   │
│  │  - Word count validation                                     │   │
│  │  - Section structure validation                              │   │
│  │  - SEO optimization check                                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Request
     │
     ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 1. Topic Analysis                                                    │
│    - Detect category (birthday, zodiac, health, pregnancy, general) │
│    - Extract entities (names, ages, zodiac signs)                   │
│    - Load keywords from database (page_keywords table)              │
└─────────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 2. Dynamic Template Selection                                        │
│    - Select templates based on category                              │
│    - Combine multiple template parts dynamically                     │
│    - Use synonyms and variations                                     │
│    - Track used combinations to prevent repetition                   │
└─────────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 3. Content Generation                                                │
│    - Generate introduction (proportional to length)                  │
│    - Generate main sections (4-15 based on length)                   │
│    - Generate FAQ section (3-10 questions)                           │
│    - Generate conclusion                                             │
│    - Scale all sections to target word count                         │
└─────────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 4. Quality Validation                                                │
│    - Check word count (800-6000 based on length)                     │
│    - Verify all sections present                                     │
│    - Check keyword density                                           │
│    - Validate HTML structure                                         │
│    - If incomplete: expand content until complete                    │
└─────────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 5. Smart Image Addition                                              │
│    - Load keywords from database for image search                    │
│    - Search Pexels + Unsplash with topic-specific keywords           │
│    - Check database for used images (prevent repetition)             │
│    - Score images by relevance                                       │
│    - Add featured image + inline images                              │
│    - Save used images to database                                    │
└─────────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 6. SEO Optimization                                                  │
│    - Generate SEO-optimized title (50-70 chars)                      │
│    - Generate meta description (150-160 chars)                       │
│    - Extract keywords from database                                  │
│    - Ensure Arabic SEO best practices                                │
└─────────────────────────────────────────────────────────────────────┘
     │
     ▼
Final Article (complete, with images, SEO-optimized)
```

## Component Details

### 1. Unified Generator (lib/ai/unified-generator.ts)

المحرك الرئيسي الذي يدير جميع مصادر التوليد.

```typescript
interface UnifiedGeneratorConfig {
  primaryProvider: 'local'; // المحرك المحلي دائماً الأساسي
  fallbackProviders: ('gemini' | 'groq')[]; // خيارات إضافية
  enableImages: boolean;
  imageProvider: 'smart'; // النظام الذكي الجديد
}

interface GenerationRequest {
  topic: string;
  length: 'short' | 'medium' | 'long' | 'comprehensive';
  category?: 'birthday' | 'zodiac' | 'health' | 'pregnancy' | 'age' | 'general';
  style?: 'formal' | 'casual' | 'seo';
  includeKeywords?: string[];
  includeImages?: boolean;
  imageCount?: number;
}

interface GenerationResponse {
  content: string; // HTML content
  title: string; // SEO title
  metaTitle: string; // Meta title
  metaDescription: string; // Meta description
  keywords: string[]; // Keywords from database
  wordCount: number; // Actual word count
  featuredImage?: string; // Featured image URL
  inlineImages?: string[]; // Inline image URLs
  provider: string; // Provider used
  generationTime: number; // Time in ms
  qualityScore: number; // Quality score 0-100
}
```

### 2. Dynamic Template System (lib/ai/dynamic-templates.ts)

نظام القوالب الديناميكية غير المحدود.

```typescript
interface TemplateSystem {
  // بنوك القوالب
  introBank: IntroTemplate[]; // 1000+ مقدمة
  sectionBank: SectionTemplate[]; // 5000+ قسم
  faqBank: FAQTemplate[]; // 500+ سؤال
  conclusionBank: ConclusionTemplate[]; // 1000+ خاتمة

  // بنوك العبارات
  transitionPhrases: string[]; // 200+ عبارة انتقالية
  emphasisPhrases: string[]; // 150+ عبارة تأكيدية
  callToActionPhrases: string[]; // 100+ عبارة CTA

  // تتبع الاستخدام
  usedCombinations: Set<string>; // منع التكرار
}

interface IntroTemplate {
  id: string;
  category: string;
  template: string;
  variables: string[];
  minWords: number;
  maxWords: number;
}

interface SectionTemplate {
  id: string;
  category: string;
  sectionType: 'info' | 'tips' | 'facts' | 'howto' | 'comparison';
  template: string;
  variables: string[];
  expandable: boolean; // يمكن توسيعه للمقالات الطويلة
}
```

### 3. Smart Image Manager (lib/images/smart-images.ts)

مدير الصور الذكي مع منع التكرار.

```typescript
interface SmartImageManager {
  // البحث الذكي
  searchByKeywords(keywords: string[], topic: string): Promise<ScoredImage[]>;

  // منع التكرار
  isImageUsed(imageId: string): Promise<boolean>;
  markImageAsUsed(imageId: string, articleId: number): Promise<void>;

  // اختيار الصور
  selectBestImages(images: ScoredImage[], count: number): ScoredImage[];

  // الصورة البارزة
  getFeaturedImage(topic: string, keywords: string[]): Promise<string | null>;
}

interface ScoredImage {
  id: string;
  url: string;
  urlLarge: string;
  alt: string;
  photographer: string;
  provider: 'pexels' | 'unsplash';
  relevanceScore: number; // 0-100
  isUsed: boolean;
}

// جدول تتبع الصور المستخدمة (في قاعدة البيانات)
interface UsedImage {
  id: number;
  image_id: string;
  image_url: string;
  article_id: number;
  used_at: string;
}
```

### 4. Quality Gate (lib/ai/quality-gate.ts)

بوابة الجودة للتحقق من اكتمال المحتوى.

```typescript
interface QualityGate {
  validate(content: string, config: QualityConfig): QualityResult;
  expandIfNeeded(content: string, targetWords: number): string;
  ensureCompleteness(content: string): string;
}

interface QualityConfig {
  targetLength: 'short' | 'medium' | 'long' | 'comprehensive';
  requiredSections: string[];
  minKeywordDensity: number;
  maxKeywordDensity: number;
}

interface QualityResult {
  passed: boolean;
  score: number; // 0-100
  wordCount: number;
  wordCountStatus: 'below' | 'ok' | 'above';
  missingSections: string[];
  keywordDensity: number;
  suggestions: string[];
}

// حدود عدد الكلمات الصارمة
const WORD_COUNT_LIMITS = {
  short: { min: 800, max: 1200, target: 1000 },
  medium: { min: 2000, max: 3000, target: 2500 },
  long: { min: 3500, max: 4500, target: 4000 },
  comprehensive: { min: 5000, max: 6000, target: 5500 },
};
```

### 5. Keywords Database Integration

استخدام جدول الكلمات المفتاحية الموجود.

```typescript
// جدول page_keywords الموجود في قاعدة البيانات
interface PageKeyword {
  id: number;
  page_slug: string;
  keyword: string;
  keyword_en: string; // الترجمة الإنجليزية للبحث عن الصور
  search_volume: number;
  category: string;
  created_at: string;
}

// دوال الوصول للكلمات المفتاحية
interface KeywordsService {
  getKeywordsByCategory(category: string): Promise<PageKeyword[]>;
  getKeywordsByTopic(topic: string): Promise<PageKeyword[]>;
  getEnglishKeywords(arabicKeywords: string[]): Promise<string[]>;
  getRandomKeywords(category: string, count: number): Promise<PageKeyword[]>;
}
```

## Database Schema Updates

### جدول تتبع الصور المستخدمة (جديد)

```sql
CREATE TABLE IF NOT EXISTS used_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_id TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  image_hash TEXT,
  photographer TEXT,
  provider TEXT DEFAULT 'pexels',
  article_id INTEGER,
  topic TEXT,
  used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES articles(id)
);

CREATE INDEX idx_used_images_image_id ON used_images(image_id);
CREATE INDEX idx_used_images_article_id ON used_images(article_id);
CREATE INDEX idx_used_images_provider ON used_images(provider);
```

### جدول تتبع القوالب المستخدمة (جديد)

```sql
CREATE TABLE IF NOT EXISTS used_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  template_hash TEXT NOT NULL,
  template_type TEXT NOT NULL,
  category TEXT,
  article_id INTEGER,
  used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES articles(id)
);

CREATE INDEX idx_used_templates_hash ON used_templates(template_hash);
CREATE INDEX idx_used_templates_category ON used_templates(category);
```

## File Structure

```
lib/
├── ai/
│   ├── unified-generator.ts      # المحرك الموحد الجديد
│   ├── dynamic-templates.ts      # نظام القوالب الديناميكية
│   ├── quality-gate.ts           # بوابة الجودة
│   ├── seo-optimizer.ts          # محسن السيو
│   └── providers/
│       ├── local-enhanced.ts     # المحرك المحلي المحسن
│       ├── gemini.ts             # (موجود - بدون تغيير)
│       └── groq.ts               # (موجود - بدون تغيير)
├── images/
│   ├── smart-images.ts           # مدير الصور الذكي الجديد
│   ├── image-tracker.ts          # تتبع الصور المستخدمة
│   ├── pexels.ts                 # (موجود - تحديث بسيط)
│   └── unsplash.ts               # (موجود - بدون تغيير)
├── db/
│   ├── keywords.ts               # خدمة الكلمات المفتاحية
│   ├── used-images.ts            # عمليات الصور المستخدمة
│   └── used-templates.ts         # عمليات القوالب المستخدمة
└── data/
    └── templates/
        ├── intros/               # قوالب المقدمات
        │   ├── birthday.json
        │   ├── zodiac.json
        │   ├── health.json
        │   ├── pregnancy.json
        │   └── general.json
        ├── sections/             # قوالب الأقسام
        │   ├── birthday.json
        │   ├── zodiac.json
        │   ├── health.json
        │   ├── pregnancy.json
        │   └── general.json
        ├── faqs/                 # قوالب الأسئلة
        │   └── all-categories.json
        └── conclusions/          # قوالب الخواتيم
            └── all-categories.json
```

## API Integration

### تحديث API التوليد الحالي

```typescript
// app/api/admin/ai/generate/route.ts
export async function POST(request: Request) {
  const body = await request.json();

  // استخدام المولد الموحد الجديد
  const generator = new UnifiedGenerator({
    primaryProvider: 'local',
    enableImages: body.includeImages !== false,
    imageProvider: 'smart',
  });

  const result = await generator.generate({
    topic: body.topic,
    length: body.length,
    category: body.category,
    includeImages: body.includeImages,
    imageCount: body.imageCount,
  });

  return NextResponse.json(result);
}
```

## Word Count Scaling

### توزيع الأقسام حسب طول المقال

```typescript
const SECTION_DISTRIBUTION = {
  short: {
    intro: { words: 100, paragraphs: 1 },
    sections: { count: 4, wordsEach: 150 },
    faq: { count: 3, wordsEach: 50 },
    conclusion: { words: 100, paragraphs: 1 },
    total: { min: 800, max: 1200 },
  },
  medium: {
    intro: { words: 200, paragraphs: 2 },
    sections: { count: 6, wordsEach: 300 },
    faq: { count: 5, wordsEach: 60 },
    conclusion: { words: 200, paragraphs: 2 },
    total: { min: 2000, max: 3000 },
  },
  long: {
    intro: { words: 300, paragraphs: 3 },
    sections: { count: 10, wordsEach: 350 },
    faq: { count: 7, wordsEach: 70 },
    conclusion: { words: 300, paragraphs: 3 },
    total: { min: 3500, max: 4500 },
  },
  comprehensive: {
    intro: { words: 400, paragraphs: 4 },
    sections: { count: 15, wordsEach: 350 },
    faq: { count: 10, wordsEach: 80 },
    conclusion: { words: 400, paragraphs: 4 },
    total: { min: 5000, max: 6000 },
  },
};
```

## SEO Title Patterns

### أنماط العناوين المحسنة للسيو

```typescript
const SEO_TITLE_PATTERNS = {
  birthday: [
    '{name} يحتفل بعيد ميلاده الـ{age} - تهاني وأفكار هدايا',
    'عيد ميلاد سعيد {name} - {age} عاماً من التميز',
    'أجمل تهاني عيد الميلاد لـ{name} في عامه الـ{age}',
    'احتفال عيد ميلاد {name} - أفكار وهدايا مميزة',
    '{name} {age} سنة - دليل الاحتفال الشامل',
  ],
  zodiac: [
    'برج {sign}: صفاته وتوافقه ونصائح {year}',
    'كل ما تريد معرفته عن برج {sign}',
    'برج {sign} - الصفات والتوافق والحظ',
    'توقعات برج {sign} وصفاته الشخصية',
    'دليل برج {sign} الشامل - صفات وتوافق',
  ],
  health: [
    '{topic} - دليل صحي شامل',
    'نصائح صحية: {topic}',
    '{topic} - معلومات طبية مهمة',
    'دليلك الصحي لـ{topic}',
  ],
  pregnancy: [
    'الأسبوع {week} من الحمل - دليل شامل',
    'الحمل في الأسبوع {week} - ماذا تتوقعين',
    'تطور الجنين في الأسبوع {week}',
    'دليل الحامل - الأسبوع {week}',
  ],
  general: [
    '{topic} - دليل شامل ومفصل',
    'كل ما تريد معرفته عن {topic}',
    '{topic}: معلومات ونصائح مهمة',
    'دليلك الشامل لـ{topic}',
  ],
};
```

## Error Handling

### استراتيجية التعامل مع الأخطاء

```typescript
class GenerationError extends Error {
  constructor(
    message: string,
    public code: string,
    public recoverable: boolean
  ) {
    super(message);
  }
}

const ERROR_CODES = {
  TOPIC_EMPTY: { code: 'TOPIC_EMPTY', recoverable: false },
  TEMPLATE_NOT_FOUND: { code: 'TEMPLATE_NOT_FOUND', recoverable: true },
  WORD_COUNT_FAILED: { code: 'WORD_COUNT_FAILED', recoverable: true },
  IMAGE_SEARCH_FAILED: { code: 'IMAGE_SEARCH_FAILED', recoverable: true },
  QUALITY_CHECK_FAILED: { code: 'QUALITY_CHECK_FAILED', recoverable: true },
};

// استراتيجية الاسترداد
async function generateWithRecovery(
  request: GenerationRequest
): Promise<GenerationResponse> {
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      return await generate(request);
    } catch (error) {
      if (error instanceof GenerationError && error.recoverable) {
        attempts++;
        console.log(`محاولة ${attempts}/${maxAttempts}...`);
        continue;
      }
      throw error;
    }
  }

  // استخدام المحتوى الاحتياطي
  return generateFallbackContent(request);
}
```

## Performance Considerations

### تحسينات الأداء

1. **التخزين المؤقت للقوالب**: تحميل القوالب مرة واحدة عند بدء التشغيل
2. **التخزين المؤقت للكلمات المفتاحية**: تخزين الكلمات المفتاحية في الذاكرة
3. **البحث المتوازي عن الصور**: البحث من Pexels و Unsplash بالتوازي
4. **التوليد التدريجي**: توليد الأقسام بشكل متوازي عند الإمكان

```typescript
// تحميل القوالب مرة واحدة
let templatesCache: TemplateSystem | null = null;

async function getTemplates(): Promise<TemplateSystem> {
  if (!templatesCache) {
    templatesCache = await loadAllTemplates();
  }
  return templatesCache;
}

// البحث المتوازي عن الصور
async function searchImagesParallel(
  keywords: string[]
): Promise<ScoredImage[]> {
  const [pexelsResults, unsplashResults] = await Promise.all([
    searchPexels(keywords),
    searchUnsplash(keywords),
  ]);

  return mergeAndScore([...pexelsResults, ...unsplashResults]);
}
```

## Testing Strategy

### خطة الاختبار

1. **اختبارات الوحدة**: لكل مكون على حدة
2. **اختبارات التكامل**: للتدفق الكامل
3. **اختبارات الجودة**: للتحقق من جودة المحتوى
4. **اختبارات الأداء**: للتحقق من سرعة التوليد

```typescript
// اختبار جودة المحتوى
describe('Content Quality', () => {
  it('should generate complete articles', async () => {
    const result = await generator.generate({
      topic: 'عيد ميلاد أحمد 25 سنة',
      length: 'medium',
    });

    expect(result.wordCount).toBeGreaterThanOrEqual(2000);
    expect(result.wordCount).toBeLessThanOrEqual(3000);
    expect(result.content).toContain('<h2>');
    expect(result.content).toContain('الخاتمة');
  });

  it('should not repeat images', async () => {
    const result1 = await generator.generate({
      topic: 'عيد ميلاد',
      length: 'short',
    });
    const result2 = await generator.generate({
      topic: 'عيد ميلاد',
      length: 'short',
    });

    expect(result1.featuredImage).not.toBe(result2.featuredImage);
  });
});
```

## Migration Plan

### خطة الترحيل

1. **المرحلة 1**: إنشاء الملفات الجديدة بدون تعديل الموجودة
2. **المرحلة 2**: إنشاء جداول قاعدة البيانات الجديدة
3. **المرحلة 3**: تحديث API للاستخدام الجديد
4. **المرحلة 4**: اختبار شامل
5. **المرحلة 5**: تفعيل النظام الجديد

```typescript
// التوافق مع النظام القديم
export async function generateArticle(
  request: GenerationRequest
): Promise<GenerationResponse> {
  // استخدام النظام الجديد
  const unifiedGenerator = new UnifiedGenerator();
  return unifiedGenerator.generate(request);
}

// الحفاظ على نفس الواجهة
export {
  generateArticle,
  generateArticleWithImages,
} from './unified-generator';
```
