# Design Document

## Overview

تحسين جذري لنظام Sona لتوليد محتوى عربي احترافي ومتخصص. الهدف هو الانتقال من نظام قوالب ثابتة إلى نظام ذكي يفهم الموضوع ويولد محتوى فريد ومفيد.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Sona Enhanced System                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Topic     │───▶│  Knowledge  │───▶│  Content    │     │
│  │  Analyzer   │    │   Fetcher   │    │  Builder    │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│         │                  │                  │             │
│         ▼                  ▼                  ▼             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  Entity     │    │  Specialized│    │  Section    │     │
│  │  Extractor  │    │  Knowledge  │    │  Generator  │     │
│  └─────────────┘    │    Base     │    └─────────────┘     │
│                     └─────────────┘           │             │
│                                               ▼             │
│                                        ┌─────────────┐     │
│                                        │  Quality    │     │
│                                        │  Validator  │     │
│                                        └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. TopicAnalyzer (محلل الموضوع المحسّن)

```typescript
interface TopicAnalysis {
  // التصنيف الأساسي
  category: TopicCategory;
  subCategory?: string;

  // الكيانات المستخرجة
  entities: {
    names: string[];
    dates: string[];
    numbers: number[];
    concepts: string[];
  };

  // نوع المحتوى المطلوب
  contentType: 'informational' | 'tutorial' | 'comparison' | 'guide' | 'faq';

  // الجمهور المستهدف
  audience: 'general' | 'parents' | 'pregnant' | 'children' | 'professionals';

  // الأسئلة الضمنية
  implicitQuestions: string[];

  // الكلمات المفتاحية الأساسية
  primaryKeywords: string[];

  // مستوى التفصيل المطلوب
  detailLevel: 'basic' | 'intermediate' | 'advanced';
}

interface TopicAnalyzerInterface {
  analyze(topic: string): TopicAnalysis;
  extractEntities(topic: string): TopicAnalysis['entities'];
  detectContentType(topic: string): TopicAnalysis['contentType'];
  identifyAudience(topic: string): TopicAnalysis['audience'];
  generateImplicitQuestions(topic: string, category: TopicCategory): string[];
}
```

### 2. SpecializedKnowledgeBase (قاعدة المعرفة المتخصصة)

```typescript
interface KnowledgeEntry {
  // معلومات أساسية
  facts: FactEntry[];

  // أمثلة عملية
  examples: ExampleEntry[];

  // إحصائيات ودراسات
  statistics: StatisticEntry[];

  // نصائح متخصصة
  tips: TipEntry[];

  // أسئلة شائعة
  faqs: FAQEntry[];

  // روابط لأدوات ميلادك
  relatedTools: ToolLink[];
}

interface FactEntry {
  content: string;
  source?: string;
  isScientific: boolean;
  relevanceScore: number;
}

interface ExampleEntry {
  scenario: string;
  explanation: string;
  outcome: string;
}

interface StatisticEntry {
  value: string | number;
  description: string;
  source?: string;
  year?: number;
}

interface TipEntry {
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

interface FAQEntry {
  question: string;
  answer: string;
  relatedTool?: string;
}

interface ToolLink {
  name: string;
  href: string;
  description: string;
  relevance: number;
}
```

### 3. ContentBuilder (باني المحتوى الديناميكي)

```typescript
interface ContentSection {
  type:
    | 'intro'
    | 'facts'
    | 'howto'
    | 'tips'
    | 'examples'
    | 'faq'
    | 'conclusion'
    | 'tools';
  title: string;
  content: string;
  priority: number;
}

interface ContentBuilderInterface {
  // بناء هيكل المقال
  buildStructure(
    analysis: TopicAnalysis,
    knowledge: KnowledgeEntry
  ): ContentSection[];

  // توليد المقدمة
  generateIntro(topic: string, analysis: TopicAnalysis): string;

  // توليد قسم الحقائق
  generateFactsSection(facts: FactEntry[], topic: string): string;

  // توليد قسم الخطوات
  generateHowToSection(topic: string, analysis: TopicAnalysis): string;

  // توليد قسم النصائح
  generateTipsSection(tips: TipEntry[], topic: string): string;

  // توليد قسم الأمثلة
  generateExamplesSection(examples: ExampleEntry[]): string;

  // توليد قسم الأسئلة الشائعة
  generateFAQSection(faqs: FAQEntry[]): string;

  // توليد الخاتمة
  generateConclusion(topic: string, analysis: TopicAnalysis): string;

  // توليد قسم الأدوات المرتبطة
  generateToolsSection(tools: ToolLink[]): string;
}
```

### 4. QualityValidator (مدقق الجودة)

```typescript
interface QualityReport {
  score: number; // 0-100
  passed: boolean;
  issues: QualityIssue[];
  suggestions: string[];
}

interface QualityIssue {
  type: 'repetition' | 'generic' | 'short' | 'disconnected' | 'low_vocabulary';
  severity: 'error' | 'warning';
  location?: string;
  suggestion: string;
}

interface QualityValidatorInterface {
  validate(content: string, topic: string): QualityReport;
  checkRepetition(content: string): QualityIssue[];
  checkGenericPhrases(content: string): QualityIssue[];
  checkVocabularyDiversity(content: string): number;
  checkCoherence(content: string): number;
  checkMinimumLength(content: string, targetWords: number): boolean;
}
```

### 5. PhraseVariator (منوع العبارات)

```typescript
interface PhraseVariatorInterface {
  // تنويع المقدمات
  getIntroVariation(topic: string, style: string): string;

  // تنويع الانتقالات
  getTransitionPhrase(): string;

  // تنويع الخواتيم
  getConclusionVariation(topic: string): string;

  // استبدال العبارات العامة
  replaceGenericPhrase(phrase: string): string;

  // تنويع أساليب العرض
  getPresentationStyle(): 'narrative' | 'analytical' | 'comparative' | 'list';
}
```

## Data Models

### قاعدة المعرفة المتخصصة لميلادك

```typescript
// معرفة حساب العمر
const AGE_KNOWLEDGE: KnowledgeEntry = {
  facts: [
    {
      content:
        'السنة الميلادية تساوي 365.2422 يوماً بالضبط، لذلك نضيف يوماً كل 4 سنوات (السنة الكبيسة)',
      isScientific: true,
      relevanceScore: 0.9,
    },
    {
      content:
        'السنة الهجرية تساوي 354.36667 يوماً، أي أقصر من الميلادية بـ 10.875 يوماً',
      isScientific: true,
      relevanceScore: 0.9,
    },
    // ... المزيد من الحقائق
  ],
  statistics: [
    {
      value: '2,500,000,000',
      description: 'متوسط عدد الثواني التي يعيشها الإنسان',
      source: 'دراسات متوسط العمر',
    },
    {
      value: '100,000',
      description: 'عدد نبضات القلب يومياً',
      source: 'جمعية القلب الأمريكية',
    },
  ],
  // ... باقي البيانات
};

// معرفة الأبراج
const ZODIAC_KNOWLEDGE: Record<string, KnowledgeEntry> = {
  الحمل: {
    facts: [
      {
        content:
          'برج الحمل (21 مارس - 19 أبريل) هو أول الأبراج الفلكية، يحكمه كوكب المريخ',
        isScientific: false,
        relevanceScore: 1.0,
      },
      {
        content: 'عنصر برج الحمل هو النار، مما يمنحه الحماس والطاقة والشجاعة',
        isScientific: false,
        relevanceScore: 0.9,
      },
    ],
    tips: [
      {
        title: 'نقاط القوة',
        content: 'الشجاعة، الحماس، التفاؤل، الصدق، القيادة',
        priority: 'high',
        actionable: false,
      },
      {
        title: 'نقاط الضعف',
        content: 'التسرع، العناد، قلة الصبر، الاندفاع',
        priority: 'high',
        actionable: true,
      },
    ],
    // ... باقي البيانات لكل برج
  },
  // ... باقي الأبراج
};

// معرفة الحمل
const PREGNANCY_KNOWLEDGE: Record<number, KnowledgeEntry> = {
  // الأسبوع 1-4
  1: {
    facts: [
      {
        content:
          'في الأسبوع الأول، يحدث التبويض والإخصاب. البويضة المخصبة تبدأ رحلتها نحو الرحم',
        isScientific: true,
        relevanceScore: 1.0,
      },
    ],
    tips: [
      {
        title: 'تناولي حمض الفوليك',
        content:
          'ابدئي بتناول 400 ميكروغرام من حمض الفوليك يومياً لمنع تشوهات الأنبوب العصبي',
        priority: 'high',
        actionable: true,
      },
    ],
  },
  // ... باقي الأسابيع
};
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: تنوع المحتوى

_For any_ موضوعين متشابهين، عند توليد مقالين، يجب أن يكون التشابه بينهما أقل من 30%
**Validates: Requirements 3.3**

### Property 2: عدم التكرار

_For any_ مقال مولّد، يجب ألا تتكرر أي جملة أكثر من مرة واحدة
**Validates: Requirements 6.1**

### Property 3: تنوع المفردات

_For any_ مقال مولّد، يجب أن تكون نسبة الكلمات الفريدة إلى إجمالي الكلمات أكبر من 40%
**Validates: Requirements 6.2**

### Property 4: عدم وجود عبارات عامة

_For any_ مقال مولّد، يجب ألا تتجاوز نسبة الجمل العامة 20% من إجمالي الجمل
**Validates: Requirements 6.5**

### Property 5: ترابط المحتوى

_For any_ مقال مولّد، يجب أن يكون كل قسم مرتبطاً بالموضوع الرئيسي
**Validates: Requirements 6.3**

### Property 6: استخراج الكيانات

_For any_ موضوع يحتوي على أسماء أو تواريخ أو أرقام، يجب أن يستخرجها المحلل بشكل صحيح
**Validates: Requirements 1.1**

### Property 7: تخصص المحتوى

_For any_ موضوع عن برج معين، يجب أن يحتوي المقال على معلومات خاصة بهذا البرج وليست عامة
**Validates: Requirements 7.2**

## Error Handling

1. **فشل تحليل الموضوع**: استخدام التصنيف العام مع تحذير
2. **نقص في قاعدة المعرفة**: توليد محتوى عام مع إشارة للمستخدم
3. **فشل اختبار الجودة**: إعادة توليد الأجزاء الضعيفة (حد أقصى 3 محاولات)
4. **محتوى قصير جداً**: توسيع المحتوى بمعلومات إضافية من قاعدة المعرفة

## Testing Strategy

### Unit Tests

- اختبار استخراج الكيانات من مواضيع مختلفة
- اختبار تصنيف المواضيع
- اختبار توليد كل نوع من الأقسام
- اختبار مدقق الجودة

### Property-Based Tests

- اختبار تنوع المحتوى عبر 100 موضوع
- اختبار عدم التكرار في 100 مقال
- اختبار تنوع المفردات
- اختبار عدم وجود عبارات عامة

### Integration Tests

- اختبار التدفق الكامل من الموضوع إلى المقال
- اختبار جودة المقالات لكل فئة من فئات ميلادك
