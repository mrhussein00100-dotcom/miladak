# Feature Design: Article Generation Quality Fix

## Overview

إصلاح جودة توليد المقالات في نظام SONA من خلال:

1. **طبقة تحقق من ارتباط المحتوى** - التأكد من أن المقال يتحدث عن الموضوع المطلوب
2. **نظام اكتمال المقال** - ضمان وجود جميع الأقسام المطلوبة
3. **التحكم في الطول** - ضبط عدد الكلمات ضمن الحدود المحددة
4. **فحص الجودة** - تقييم المحتوى قبل الإرجاع
5. **معالجة الأخطاء** - التعامل مع الحالات الاستثنائية

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Article Generation Quality System                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Generation Request                                │   │
│  │  { topic, length, category, keywords, variables }                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Topic Analyzer (Enhanced)                         │   │
│  │  - Extract keywords from topic                                       │   │
│  │  - Detect category (birthday, zodiac, health, etc.)                 │   │
│  │  - Extract entities (names, ages, zodiac signs)                     │   │
│  │  - Generate required sections list                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Content Generator (Enhanced)                      │   │
│  │  - Generate intro (topic-focused)                                    │   │
│  │  - Generate sections (based on analysis)                            │   │
│  │  - Generate FAQ (for long articles)                                 │   │
│  │  - Generate conclusion                                               │   │
│  │  - Ensure word count within limits                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Quality Validator (NEW)                           │   │
│  │  - Check topic relevance (keywords presence)                        │   │
│  │  - Check completeness (all sections present)                        │   │
│  │  - Check word count (within limits)                                 │   │
│  │  - Check repetition (no duplicate content)                          │   │
│  │  - Calculate quality score                                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                          ┌────────┴────────┐                               │
│                          │  Score >= 70%?  │                               │
│                          └────────┬────────┘                               │
│                     Yes ┌────────┴────────┐ No                             │
│                         │                  │                                │
│                         ▼                  ▼                                │
│  ┌──────────────────────────┐  ┌──────────────────────────┐               │
│  │   Return Content         │  │   Retry (max 3 times)    │               │
│  │   + Quality Report       │  │   or Return Best Result  │               │
│  └──────────────────────────┘  └──────────────────────────┘               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Enhanced Topic Analyzer

```typescript
interface EnhancedTopicAnalysis {
  topic: string;
  category: TopicCategory;
  keywords: string[]; // الكلمات المفتاحية المستخرجة
  requiredKeywords: string[]; // الكلمات التي يجب أن تظهر في المحتوى
  extractedEntities: {
    names: string[];
    ages: number[];
    zodiacSigns: string[];
    dates: string[];
  };
  requiredSections: string[]; // الأقسام المطلوبة
  suggestedWordCount: {
    min: number;
    max: number;
  };
}

interface TopicAnalyzerEnhanced {
  analyze(topic: string, length: ArticleLength): EnhancedTopicAnalysis;
  extractKeywords(topic: string): string[];
  detectCategory(topic: string): TopicCategory;
  extractEntities(topic: string): ExtractedEntities;
  getRequiredSections(category: TopicCategory, length: ArticleLength): string[];
}
```

### 2. Quality Validator (NEW)

```typescript
interface QualityValidationResult {
  passed: boolean;
  overallScore: number; // 0-100
  topicRelevanceScore: number; // 0-100
  completenessScore: number; // 0-100
  wordCountScore: number; // 0-100
  repetitionScore: number; // 0-100 (higher = less repetition)
  issues: QualityIssue[];
  suggestions: string[];
}

interface QualityIssue {
  type: 'topic_relevance' | 'completeness' | 'word_count' | 'repetition';
  severity: 'error' | 'warning';
  message: string;
  details?: any;
}

interface QualityValidator {
  validate(
    content: string,
    analysis: EnhancedTopicAnalysis,
    targetLength: ArticleLength
  ): QualityValidationResult;

  checkTopicRelevance(content: string, keywords: string[]): number;
  checkCompleteness(content: string, requiredSections: string[]): number;
  checkWordCount(content: string, min: number, max: number): number;
  checkRepetition(content: string): number;
}
```

### 3. Enhanced Content Generator

```typescript
interface EnhancedGenerationRequest {
  topic: string;
  length: ArticleLength;
  category?: string;
  includeKeywords?: string[];
  variables?: Record<string, any>;
  maxRetries?: number; // default: 3
  minQualityScore?: number; // default: 70
}

interface EnhancedGeneratedContent {
  content: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  wordCount: number;
  qualityReport: QualityValidationResult;
  usedTemplates: string[];
  generationTime: number;
  retryCount: number;
  warnings?: string[];
}

interface EnhancedContentGenerator {
  generate(
    request: EnhancedGenerationRequest
  ): Promise<EnhancedGeneratedContent>;

  // Internal methods
  generateWithValidation(
    request: EnhancedGenerationRequest,
    analysis: EnhancedTopicAnalysis
  ): Promise<EnhancedGeneratedContent>;

  ensureWordCount(
    content: string,
    analysis: EnhancedTopicAnalysis,
    min: number,
    max: number
  ): string;

  ensureCompleteness(content: string, analysis: EnhancedTopicAnalysis): string;
}
```

### 4. Word Count Manager

```typescript
interface WordCountLimits {
  short: { min: 400; max: 600 };
  medium: { min: 800; max: 1200 };
  long: { min: 1500; max: 2500 };
  comprehensive: { min: 2500; max: 4000 };
}

interface WordCountManager {
  getLimits(length: ArticleLength): { min: number; max: number };
  countWords(content: string): number;
  isWithinLimits(content: string, length: ArticleLength): boolean;

  expandContent(
    content: string,
    analysis: EnhancedTopicAnalysis,
    targetMin: number
  ): string;

  trimContent(content: string, targetMax: number): string;
}
```

### 5. Section Manager

```typescript
interface RequiredSections {
  intro: boolean;
  mainSections: number; // minimum H2 sections
  faq: boolean; // required for long/comprehensive
  tips: boolean;
  conclusion: boolean;
}

interface SectionManager {
  getRequiredSections(length: ArticleLength): RequiredSections;

  checkSections(content: string): {
    hasIntro: boolean;
    h2Count: number;
    hasFaq: boolean;
    hasTips: boolean;
    hasConclusion: boolean;
  };

  addMissingSection(
    content: string,
    sectionType: string,
    analysis: EnhancedTopicAnalysis
  ): string;
}
```

## Data Models

### Word Count Configuration

```typescript
const WORD_COUNT_CONFIG: Record<ArticleLength, { min: number; max: number }> = {
  short: { min: 400, max: 600 },
  medium: { min: 800, max: 1200 },
  long: { min: 1500, max: 2500 },
  comprehensive: { min: 2500, max: 4000 },
};
```

### Required Sections Configuration

```typescript
const REQUIRED_SECTIONS_CONFIG: Record<ArticleLength, RequiredSections> = {
  short: {
    intro: true,
    mainSections: 2,
    faq: false,
    tips: false,
    conclusion: true,
  },
  medium: {
    intro: true,
    mainSections: 3,
    faq: false,
    tips: true,
    conclusion: true,
  },
  long: {
    intro: true,
    mainSections: 4,
    faq: true,
    tips: true,
    conclusion: true,
  },
  comprehensive: {
    intro: true,
    mainSections: 5,
    faq: true,
    tips: true,
    conclusion: true,
  },
};
```

### Quality Thresholds

```typescript
const QUALITY_THRESHOLDS = {
  minOverallScore: 70,
  minTopicRelevance: 60,
  minCompleteness: 80,
  minWordCountScore: 70,
  minRepetitionScore: 60,
  maxRetries: 3,
};
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Topic Relevance

_For any_ generated article, at least 80% of the required keywords extracted from the topic should appear in the content.
**Validates: Requirements 1.1, 1.2, 1.3, 1.4**

### Property 2: Article Completeness

_For any_ generated article, it should contain: an introduction section, the minimum required H2 sections for its length, and a conclusion section.
**Validates: Requirements 2.1, 2.2, 2.3, 2.5, 2.6**

### Property 3: Word Count Within Limits

_For any_ generated article, the word count should be within the specified limits for the requested length (short: 400-600, medium: 800-1200, long: 1500-2500, comprehensive: 2500-4000).
**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

### Property 4: Quality Score Threshold

_For any_ successfully generated article, the overall quality score should be at least 70%.
**Validates: Requirements 5.1, 5.2, 5.3, 5.5**

### Property 5: Entity Extraction and Usage

_For any_ topic containing a person's name, age, or zodiac sign, the generated content should include that entity at least once.
**Validates: Requirements 6.1, 6.2, 6.3**

### Property 6: No Excessive Repetition

_For any_ generated article, the repetition score should be at least 60% (meaning less than 40% of content is repeated).
**Validates: Requirements 4.2, 4.4**

### Property 7: FAQ for Long Articles

_For any_ article with length 'long' or 'comprehensive', the content should include a FAQ section with at least 3 questions.
**Validates: Requirements 2.4**

### Property 8: Generation Performance

_For any_ article generation request, the total generation time (including retries) should not exceed 10 seconds.
**Validates: Requirements 8.1, 8.2, 8.4**

### Property 9: Title Contains Topic

_For any_ generated article, the title should contain at least one keyword from the original topic.
**Validates: Requirements 1.4**

### Property 10: Category Detection Accuracy

_For any_ topic containing category-specific keywords (birthday, zodiac, health), the system should correctly detect the category.
**Validates: Requirements 6.5**

## Error Handling

### Topic Analysis Errors

- If topic is empty or invalid, return clear error message
- If category cannot be detected, default to 'general' category
- If no keywords can be extracted, use topic words as keywords

### Content Generation Errors

- If generation fails, retry up to 3 times with different templates
- If all retries fail, return best result with warning
- If knowledge base fails to load, use fallback content

### Quality Validation Errors

- If quality score is below threshold after 3 retries, return best result with warning
- If specific section is missing, add it automatically
- If word count is out of range, adjust content accordingly

### Performance Errors

- If generation takes too long, return current result with timeout warning
- If caching fails, continue without cache

## Testing Strategy

### Unit Testing

- Test topic analyzer with various topics
- Test quality validator with different content samples
- Test word count manager with edge cases
- Test section manager with incomplete content

### Property-Based Testing

The following property-based tests will be implemented using fast-check:

1. **Topic Relevance Test**: Generate articles for random topics and verify keyword presence
2. **Completeness Test**: Generate articles of all lengths and verify section presence
3. **Word Count Test**: Generate articles and verify word count within limits
4. **Quality Score Test**: Generate articles and verify quality score >= 70%
5. **Entity Extraction Test**: Generate articles with entities and verify their presence
6. **Repetition Test**: Generate articles and verify repetition score >= 60%
7. **FAQ Test**: Generate long articles and verify FAQ presence
8. **Performance Test**: Generate articles and verify time < 10 seconds
9. **Title Test**: Generate articles and verify title contains topic keywords
10. **Category Test**: Generate articles with category keywords and verify detection

Each property-based test will:

- Run a minimum of 100 iterations
- Use smart generators for Arabic topics
- Tag with the corresponding correctness property
