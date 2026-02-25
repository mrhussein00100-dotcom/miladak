# Design Document

## Overview

SONA v6 هو **منسق ذكي (Smart Orchestrator)** يجمع بين أفضل المكونات الخارجية لإنتاج محتوى عربي احترافي. بدلاً من محاولة بناء نموذج AI مستقل، نستفيد من:

1. **Groq/Gemini/OpenAI** للتوليد الذكي
2. **مكتبات NLP عربية** للتحليل اللغوي
3. **قواميس ضخمة** للمفردات والمرادفات
4. **Prompts متخصصة** لمواضيع ميلادك

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SONA v6 - Smart Orchestrator                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    AI_Orchestrator                           │    │
│  │  (المنسق الرئيسي - يدير كل المكونات الخارجية)               │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│         ┌────────────────────┼────────────────────┐                 │
│         │                    │                    │                 │
│         ▼                    ▼                    ▼                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │
│  │ AI_Provider │    │ External_NLP│    │ Lexicon_API │             │
│  │             │    │             │    │             │             │
│  │ • Groq API  │    │ • CAMeL     │    │ • Almaany   │             │
│  │ • Gemini    │    │ • Farasa    │    │ • Local JSON│             │
│  │ • OpenAI    │    │ • ArabicNLP │    │ • 50K+ words│             │
│  └─────────────┘    └─────────────┘    └─────────────┘             │
│         │                    │                    │                 │
│         └────────────────────┼────────────────────┘                 │
│                              │                                       │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                  Content_Enhancer                            │    │
│  │  (يحسن المحتوى باستخدام AI + NLP + Lexicon)                 │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                  Quality_Analyzer                            │    │
│  │  (يقيم الجودة ويقترح تحسينات)                               │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│                    ┌─────────────────┐                              │
│                    │  Final Content  │                              │
│                    │  (جودة 80%+)    │                              │
│                    └─────────────────┘                              │
└─────────────────────────────────────────────────────────────────────┘
```

## Components

### 1. AI_Orchestrator (المنسق الرئيسي)

المسؤولية: إدارة التواصل مع جميع المكونات الخارجية

```typescript
interface AIOrchestrator {
  // توليد محتوى كامل
  generateContent(request: GenerationRequest): Promise<GenerationResult>;

  // اختيار أفضل مزود AI
  selectProvider(request: GenerationRequest): AIProvider;

  // إدارة الـ cache
  getCachedContent(key: string): string | null;
  setCachedContent(key: string, content: string): void;

  // مراقبة الاستخدام
  trackUsage(provider: string, tokens: number, cost: number): void;
  getUsageStats(): UsageStats;
}

interface GenerationRequest {
  topic: string;
  category: TopicCategory;
  length: ArticleLength;
  keywords?: string[];
  style?: WritingStyle;
}

interface GenerationResult {
  content: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  provider: string;
  qualityScore: number;
  cost: number;
  cached: boolean;
}
```

### 2. AI_Provider (مزودي AI الخارجيين)

المسؤولية: التواصل مع APIs الذكاء الاصطناعي

```typescript
interface AIProvider {
  name: string;
  priority: number;
  costPerToken: number;

  // توليد نص
  generate(prompt: string, options: GenerateOptions): Promise<string>;

  // تحسين نص
  enhance(text: string, instructions: string): Promise<string>;

  // تقييم جودة
  evaluateQuality(text: string): Promise<QualityScore>;

  // التحقق من التوفر
  isAvailable(): Promise<boolean>;
}

// مزودي AI المدعومين
const providers: AIProvider[] = [
  new GroqProvider(), // الأسرع والأرخص
  new GeminiProvider(), // الأذكى للعربية
  new OpenAIProvider(), // الأكثر موثوقية
];
```

### 3. External_NLP (مكتبات NLP الخارجية)

المسؤولية: تحليل وتحسين النصوص العربية

```typescript
interface ExternalNLP {
  // تحليل الجملة
  analyze(text: string): Promise<NLPAnalysis>;

  // التشكيل
  addDiacritics(text: string): Promise<string>;

  // التحقق من القواعد
  checkGrammar(text: string): Promise<GrammarResult>;

  // استخراج الكيانات
  extractEntities(text: string): Promise<Entity[]>;

  // تصحيح الأخطاء
  correctErrors(text: string): Promise<string>;
}

interface NLPAnalysis {
  tokens: Token[];
  sentences: Sentence[];
  entities: Entity[];
  sentiment: Sentiment;
  language: string;
  confidence: number;
}
```

### 4. Lexicon_API (واجهة القواميس)

المسؤولية: توفير مفردات ومرادفات غنية

```typescript
interface LexiconAPI {
  // البحث عن كلمة
  lookup(word: string): Promise<LexiconEntry | null>;

  // الحصول على مرادفات
  getSynonyms(word: string): Promise<string[]>;

  // الحصول على أضداد
  getAntonyms(word: string): Promise<string[]>;

  // تصريف الفعل
  conjugate(verb: string, tense: Tense): Promise<string>;

  // تعبيرات اصطلاحية
  getIdioms(context: string): Promise<Idiom[]>;

  // اقتراح بديل
  suggestAlternative(word: string, context: string): Promise<string>;
}

interface LexiconEntry {
  word: string;
  definitions: string[];
  synonyms: string[];
  antonyms: string[];
  examples: string[];
  root: string;
  type: WordType;
  frequency: number;
}
```

### 5. Content_Enhancer (محسن المحتوى)

المسؤولية: تحسين المحتوى باستخدام AI

```typescript
interface ContentEnhancer {
  // تحسين شامل
  enhance(content: string, options: EnhanceOptions): Promise<string>;

  // إعادة صياغة جملة
  rephraseSentence(sentence: string): Promise<string>;

  // إضافة تفاصيل
  addDetails(content: string, topic: string): Promise<string>;

  // تحسين الترابط
  improveCoherence(content: string): Promise<string>;

  // استبدال الجمل العامة
  replaceGenericSentences(content: string): Promise<string>;
}

interface EnhanceOptions {
  targetQuality: number;
  maxIterations: number;
  focusAreas: ('coherence' | 'vocabulary' | 'specificity')[];
}
```

### 6. Quality_Analyzer (محلل الجودة)

المسؤولية: تقييم جودة المحتوى

```typescript
interface QualityAnalyzer {
  // تحليل شامل
  analyze(content: string, topic: string): Promise<QualityReport>;

  // فحص التكرار
  checkRepetition(content: string): RepetitionReport;

  // فحص التنوع
  checkDiversity(content: string): DiversityReport;

  // فحص الجمل العامة
  checkGenericContent(content: string): GenericReport;

  // مقارنة بمعايير AI
  compareToAIStandards(content: string): ComparisonReport;
}

interface QualityReport {
  overallScore: number;
  repetitionScore: number;
  diversityScore: number;
  specificityScore: number;
  coherenceScore: number;
  issues: QualityIssue[];
  suggestions: string[];
  passesThreshold: boolean;
}
```

## Specialized Prompts

### قاعدة Prompts لمواضيع ميلادك

```typescript
const SPECIALIZED_PROMPTS = {
  zodiac: {
    system: `أنت خبير في الأبراج والفلك. اكتب محتوى عربي احترافي عن الأبراج.
    - قدم معلومات دقيقة ومتخصصة
    - اذكر صفات البرج، توافقاته، حجره الكريم، لونه المحظوظ
    - تجنب الجمل العامة والتكرار
    - استخدم لغة عربية فصحى سليمة`,

    template: (sign: string) => `اكتب مقالاً شاملاً عن برج ${sign} يتضمن:
    1. صفات مواليد البرج الشخصية
    2. نقاط القوة والضعف
    3. التوافق مع الأبراج الأخرى
    4. الحجر الكريم واللون المحظوظ
    5. نصائح للتعامل مع مواليد هذا البرج`,
  },

  birthday: {
    system: `أنت كاتب محتوى متخصص في التهاني والاحتفالات.
    - اكتب تهاني صادقة ومؤثرة
    - خصص المحتوى للعمر المذكور
    - قدم أفكار هدايا واحتفالات مناسبة
    - استخدم لغة دافئة وإيجابية`,

    template: (
      name: string,
      age: number
    ) => `اكتب مقالاً عن عيد ميلاد ${name} الذي يبلغ ${age} عاماً يتضمن:
    1. تهنئة مميزة ومؤثرة
    2. أفكار هدايا مناسبة للعمر
    3. أفكار للاحتفال
    4. رسائل تهنئة متنوعة
    5. نصائح لجعل اليوم مميزاً`,
  },

  pregnancy: {
    system: `أنت طبيب متخصص في صحة الحمل والأمومة.
    - قدم معلومات طبية دقيقة وموثوقة
    - اذكر تطور الجنين في كل أسبوع
    - قدم نصائح صحية للأم
    - تجنب المعلومات المضللة`,

    template: (
      week: number
    ) => `اكتب مقالاً طبياً عن الأسبوع ${week} من الحمل يتضمن:
    1. تطور الجنين في هذا الأسبوع
    2. التغيرات في جسم الأم
    3. الأعراض المتوقعة
    4. نصائح صحية وغذائية
    5. متى يجب استشارة الطبيب`,
  },

  age: {
    system: `أنت خبير في حساب العمر والتقويمات.
    - قدم معلومات دقيقة عن حساب العمر
    - اشرح الفروقات بين التقويمات
    - قدم حقائق مثيرة عن الأعمار`,

    template: (age: number) => `اكتب مقالاً عن عمر ${age} سنة يتضمن:
    1. مراحل الحياة في هذا العمر
    2. إنجازات مشاهير في هذا العمر
    3. نصائح صحية ونفسية
    4. حقائق مثيرة عن هذا العمر`,
  },
};
```

## Data Flow

```
1. طلب توليد محتوى
        │
        ▼
2. AI_Orchestrator يحلل الطلب
        │
        ├── يحدد الفئة (برج/عيد ميلاد/حمل/عمر)
        ├── يختار Prompt المتخصص
        └── يتحقق من الـ cache
        │
        ▼
3. إذا لم يوجد في cache:
        │
        ├── يختار أفضل AI_Provider
        ├── يرسل Prompt المتخصص
        └── يستقبل المحتوى الأولي
        │
        ▼
4. Content_Enhancer يحسن المحتوى:
        │
        ├── يستخدم External_NLP للتحقق اللغوي
        ├── يستخدم Lexicon_API لتنويع المفردات
        └── يستخدم AI لتحسين الجمل الضعيفة
        │
        ▼
5. Quality_Analyzer يقيم الجودة:
        │
        ├── إذا الجودة >= 80%: ✅ إرجاع المحتوى
        └── إذا الجودة < 80%: 🔄 إعادة التحسين
        │
        ▼
6. تخزين في cache + إرجاع النتيجة
```

## External Dependencies

### مكتبات NPM المطلوبة

```json
{
  "dependencies": {
    "@google/generative-ai": "^0.1.0",
    "groq-sdk": "^0.3.0",
    "openai": "^4.0.0",
    "axios": "^1.6.0",
    "node-cache": "^5.1.2"
  }
}
```

### APIs الخارجية

| API     | الغرض            | التكلفة          |
| ------- | ---------------- | ---------------- |
| Groq    | توليد سريع ورخيص | $0.05/1M tokens  |
| Gemini  | أفضل للعربية     | مجاني (حدود)     |
| OpenAI  | الأكثر موثوقية   | $0.002/1K tokens |
| Almaany | قاموس عربي       | مجاني            |

## File Structure

```
lib/sona/v6/
├── index.ts                 # نقطة الدخول
├── orchestrator.ts          # AI_Orchestrator
├── providers/
│   ├── index.ts
│   ├── groq.ts              # Groq Provider
│   ├── gemini.ts            # Gemini Provider
│   └── openai.ts            # OpenAI Provider
├── nlp/
│   ├── index.ts
│   └── arabicNLP.ts         # External NLP wrapper
├── lexicon/
│   ├── index.ts
│   ├── api.ts               # Lexicon API
│   └── local.ts             # Local JSON fallback
├── enhancer.ts              # Content_Enhancer
├── analyzer.ts              # Quality_Analyzer
├── prompts/
│   ├── index.ts
│   ├── zodiac.ts
│   ├── birthday.ts
│   ├── pregnancy.ts
│   └── age.ts
├── cache.ts                 # Caching system
├── usage.ts                 # Usage tracking
└── types.ts                 # TypeScript types

data/sona/
├── lexicon/
│   ├── words.json           # 50,000+ كلمة
│   ├── synonyms.json        # مرادفات
│   ├── idioms.json          # تعبيرات اصطلاحية
│   └── verbs.json           # تصريفات الأفعال
└── prompts/
    └── templates.json       # قوالب Prompts
```

## Quality Metrics

| المقياس          | الحد الأدنى | الهدف |
| ---------------- | ----------- | ----- |
| الدرجة الإجمالية | 80%         | 90%+  |
| تكرار الجمل      | < 5%        | < 2%  |
| تنوع المفردات    | > 60%       | > 80% |
| الجمل العامة     | < 10%       | < 3%  |
| صحة نحوية        | > 95%       | > 99% |

## Cost Management

```typescript
const COST_LIMITS = {
  daily: {
    groq: 1000, // $1/day
    gemini: 0, // مجاني
    openai: 500, // $0.50/day
  },
  perRequest: {
    maxTokens: 2000,
    maxRetries: 3,
  },
};

// استراتيجية اختيار المزود
function selectProvider(request: GenerationRequest): AIProvider {
  // 1. جرب Gemini أولاً (مجاني)
  if (geminiAvailable && !geminiLimitReached) {
    return geminiProvider;
  }

  // 2. ثم Groq (سريع ورخيص)
  if (groqAvailable && !groqLimitReached) {
    return groqProvider;
  }

  // 3. أخيراً OpenAI (الأغلى)
  return openaiProvider;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system._

### Property 1: AI Provider Fallback

_For any_ generation request, if the primary AI provider fails, the system should automatically try the next available provider until content is generated or all providers are exhausted.
**Validates: Requirements 3.4**

### Property 2: Quality Threshold

_For any_ generated content, the quality score must be >= 80% before returning to the user, or the content must be enhanced until it reaches this threshold.
**Validates: Requirements 5.4**

### Property 3: Cache Consistency

_For any_ cached content, retrieving it should return the exact same content that was stored.
**Validates: Requirements 6.1**

### Property 4: Cost Tracking

_For any_ API call, the cost must be tracked and the daily limit must not be exceeded.
**Validates: Requirements 6.2, 6.4**

### Property 5: Specialized Prompts

_For any_ topic category (zodiac, birthday, pregnancy, age), the system must use the specialized prompt for that category.
**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

## Error Handling

```typescript
class SONAError extends Error {
  constructor(
    message: string,
    public code: string,
    public provider?: string,
    public recoverable: boolean = true
  ) {
    super(message);
  }
}

// أنواع الأخطاء
const ERROR_CODES = {
  PROVIDER_UNAVAILABLE: 'PROVIDER_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  QUALITY_TOO_LOW: 'QUALITY_TOO_LOW',
  CACHE_ERROR: 'CACHE_ERROR',
  NLP_ERROR: 'NLP_ERROR',
  LEXICON_ERROR: 'LEXICON_ERROR',
};
```

## Testing Strategy

### Unit Tests

- اختبار كل Provider منفصلاً
- اختبار Lexicon API
- اختبار Quality Analyzer

### Integration Tests

- اختبار التكامل بين المكونات
- اختبار الـ fallback بين المزودين
- اختبار الـ caching

### Property-Based Tests

- اختبار خصائص الجودة
- اختبار خصائص الـ fallback
- اختبار خصائص التكلفة
