# Feature Design: SONA v4 Enhancement

## Overview

تحسين جذري لنموذج SONA ليصبح نظام توليد مقالات عربية متكامل وقابل للتوسع غير المحدود. يعتمد التصميم على:

1. **بنية معيارية (Modular Architecture)** - أجزاء صغيرة قابلة للتركيب
2. **ملفات JSON خارجية** - قاعدة معرفة وقوالب منفصلة عن الكود
3. **نظام إعادة صياغة ذكي** - تنويع لغوي حقيقي
4. **تكامل مع Vercel Postgres** - تتبع المحتوى ومنع التكرار

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SONA v4 System                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Control Panel (Admin UI)                          │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │   │
│  │  │  Settings   │  │  Templates  │  │  Analytics  │  │  Sandbox   │  │   │
│  │  │  Manager    │  │  Manager    │  │  Dashboard  │  │  Testing   │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      Plugin System                                   │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │  │ Birthday │  │  Zodiac  │  │  Health  │  │ [Custom] │  ...       │   │
│  │  │  Plugin  │  │  Plugin  │  │  Plugin  │  │  Plugin  │            │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │   Topic      │───▶│   Content    │───▶│   Quality    │                  │
│  │   Analyzer   │    │   Generator  │    │   Checker    │                  │
│  └──────────────┘    └──────────────┘    └──────────────┘                  │
│         │                   │                   │                           │
│         ▼                   ▼                   ▼                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Data Layer (JSON Files)                          │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  knowledge/  │  templates/  │  synonyms/  │  phrases/  │  plugins/  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Vercel Postgres (Tracking)                        │   │
│  │  generated_hashes │ generation_stats │ settings │ template_versions │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         API Layer                                    │   │
│  │  POST /api/sona/generate  │  GET /api/sona/stats  │  ...            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Topic Analyzer (محلل الموضوع)

```typescript
interface TopicAnalysis {
  category: TopicCategory;
  subCategory?: string;
  extractedEntities: {
    names: string[];
    dates: string[];
    numbers: number[];
    zodiacSigns: string[];
    ages: number[];
  };
  keywords: string[];
  suggestedSections: string[];
  tone: 'formal' | 'casual' | 'friendly';
}

interface TopicAnalyzer {
  analyze(topic: string): TopicAnalysis;
  extractEntities(text: string): ExtractedEntities;
  detectCategory(topic: string): TopicCategory;
  suggestKeywords(topic: string, category: TopicCategory): string[];
}
```

### 2. Content Generator (مولد المحتوى)

```typescript
interface ContentGenerator {
  generate(request: GenerationRequest): Promise<GeneratedContent>;
  generateIntro(topic: string, analysis: TopicAnalysis): string;
  generateSection(sectionType: string, context: SectionContext): string;
  generateConclusion(topic: string, analysis: TopicAnalysis): string;
  generateFAQ(topic: string, count: number): FAQ[];
  generateTips(topic: string, count: number): string[];
}

interface GenerationRequest {
  topic: string;
  length: 'short' | 'medium' | 'long' | 'comprehensive';
  style?: 'formal' | 'casual' | 'seo';
  includeKeywords?: string[];
  category?: string;
}

interface GeneratedContent {
  content: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  wordCount: number;
  qualityReport: QualityReport;
  usedTemplates: string[];
  generationTime: number;
}
```

### 3. Template Engine (محرك القوالب)

```typescript
interface TemplateEngine {
  loadTemplates(category: string): Promise<Templates>;
  selectIntro(analysis: TopicAnalysis): IntroTemplate;
  selectParagraph(sectionType: string): ParagraphTemplate;
  selectConclusion(analysis: TopicAnalysis): ConclusionTemplate;
  fillTemplate(template: string, variables: Record<string, any>): string;
}

interface Templates {
  intros: IntroTemplate[];
  paragraphs: Record<string, ParagraphTemplate[]>;
  conclusions: ConclusionTemplate[];
  transitions: string[];
  ctas: string[];
}
```

### 4. Rephraser (معيد الصياغة)

```typescript
interface Rephraser {
  rephraseSentence(sentence: string): string[];
  rephraseParagraph(paragraph: string): string;
  replaceSynonyms(text: string): string;
  varySentenceLength(text: string): string;
  addRhetoricalVariety(text: string): string;
}

interface SynonymDictionary {
  getSynonyms(word: string): string[];
  getContextualSynonym(word: string, context: string): string;
}
```

### 5. Quality Checker (مدقق الجودة)

```typescript
interface QualityChecker {
  checkQuality(content: string, analysis: TopicAnalysis): QualityReport;
  calculateDiversityScore(content: string): number;
  calculateKeywordDensity(content: string, keywords: string[]): number;
  calculateReadabilityScore(content: string): number;
  checkStructure(content: string): StructureReport;
}

interface QualityReport {
  overallScore: number;
  diversityScore: number;
  keywordDensity: number;
  readabilityScore: number;
  structureScore: number;
  suggestions: string[];
  passed: boolean;
}
```

### 6. Content Tracker (متتبع المحتوى)

```typescript
interface ContentTracker {
  saveContentHash(hash: string, metadata: ContentMetadata): Promise<void>;
  checkSimilarity(content: string): Promise<SimilarityResult>;
  getStats(): Promise<GenerationStats>;
  recordGeneration(metadata: GenerationMetadata): Promise<void>;
}

interface ContentMetadata {
  topic: string;
  category: string;
  generatedAt: Date;
  usedTemplates: string[];
  wordCount: number;
}
```

### 7. Plugin System (نظام الإضافات)

```typescript
interface SONAPlugin {
  name: string;
  version: string;
  category: string;
  enabled: boolean;

  // Lifecycle hooks
  onInit?(): Promise<void>;
  onDestroy?(): Promise<void>;

  // Content hooks
  beforeAnalyze?(topic: string): string;
  afterAnalyze?(analysis: TopicAnalysis): TopicAnalysis;
  beforeGenerate?(request: GenerationRequest): GenerationRequest;
  afterGenerate?(content: GeneratedContent): GeneratedContent;

  // Data providers
  getKnowledge?(): Promise<KnowledgeData>;
  getTemplates?(): Promise<Templates>;
  getSynonyms?(): Promise<SynonymDictionary>;
}

interface PluginManager {
  register(plugin: SONAPlugin): void;
  unregister(pluginName: string): void;
  enable(pluginName: string): void;
  disable(pluginName: string): void;
  getPlugin(name: string): SONAPlugin | undefined;
  getAllPlugins(): SONAPlugin[];
  executeHook<T>(hookName: string, data: T): Promise<T>;
}

// Example Plugin Implementation
const birthdayPlugin: SONAPlugin = {
  name: 'birthday',
  version: '1.0.0',
  category: 'أعياد الميلاد',
  enabled: true,

  async getKnowledge() {
    return import('../data/sona/knowledge/birthday.json');
  },

  async getTemplates() {
    return import('../data/sona/templates/birthday/');
  },

  afterAnalyze(analysis) {
    // Add birthday-specific analysis
    if (analysis.extractedEntities.ages.length > 0) {
      analysis.suggestedSections.push('milestone-celebration');
    }
    return analysis;
  },
};
```

### 8. Settings Manager (مدير الإعدادات)

```typescript
interface SONASettings {
  // Article Settings
  articleLength: 'short' | 'medium' | 'long' | 'comprehensive';
  wordCountTargets: {
    short: number; // 500
    medium: number; // 1000
    long: number; // 2000
    comprehensive: number; // 3000
  };

  // SEO Settings
  keywordDensity: number; // 1-5%
  minKeywordOccurrences: number;
  maxKeywordOccurrences: number;

  // Quality Settings
  minQualityScore: number; // 70
  maxRetries: number; // 3
  diversityLevel: 'low' | 'medium' | 'high' | 'maximum';

  // Template Settings
  templateRotation: boolean;
  excludedTemplates: string[];
  preferredTemplates: string[];

  // Feature Toggles
  enableSynonymReplacement: boolean;
  enableSentenceVariation: boolean;
  enableFAQGeneration: boolean;
  enableTipsGeneration: boolean;
  enableCTAs: boolean;
}

interface SettingsManager {
  getSettings(): Promise<SONASettings>;
  updateSettings(settings: Partial<SONASettings>): Promise<void>;
  resetToDefaults(): Promise<void>;
  validateSettings(settings: Partial<SONASettings>): ValidationResult;

  // Runtime settings (stored in Postgres)
  getRuntimeSetting(key: string): Promise<any>;
  setRuntimeSetting(key: string, value: any): Promise<void>;
}

// Default Settings
const DEFAULT_SETTINGS: SONASettings = {
  articleLength: 'medium',
  wordCountTargets: {
    short: 500,
    medium: 1000,
    long: 2000,
    comprehensive: 3000,
  },
  keywordDensity: 3,
  minKeywordOccurrences: 3,
  maxKeywordOccurrences: 5,
  minQualityScore: 70,
  maxRetries: 3,
  diversityLevel: 'high',
  templateRotation: true,
  excludedTemplates: [],
  preferredTemplates: [],
  enableSynonymReplacement: true,
  enableSentenceVariation: true,
  enableFAQGeneration: true,
  enableTipsGeneration: true,
  enableCTAs: true,
};
```

### 9. Template Version Manager (مدير إصدارات القوالب)

```typescript
interface TemplateVersion {
  id: string;
  templateId: string;
  version: number;
  content: string;
  createdAt: Date;
  createdBy: string;
  changeDescription?: string;
}

interface TemplateVersionManager {
  saveVersion(
    templateId: string,
    content: string,
    description?: string
  ): Promise<TemplateVersion>;
  getVersions(templateId: string): Promise<TemplateVersion[]>;
  getVersion(templateId: string, version: number): Promise<TemplateVersion>;
  rollback(templateId: string, version: number): Promise<void>;
  compare(templateId: string, v1: number, v2: number): Promise<VersionDiff>;
  archive(templateId: string): Promise<void>;
  restore(templateId: string): Promise<void>;
}

interface VersionDiff {
  added: string[];
  removed: string[];
  modified: string[];
}
```

### 10. Export/Import Manager (مدير التصدير والاستيراد)

```typescript
interface ExportOptions {
  includeKnowledge: boolean;
  includeTemplates: boolean;
  includeSynonyms: boolean;
  includeSettings: boolean;
  includeStats: boolean;
  format: 'zip' | 'json';
}

interface ImportOptions {
  conflictResolution: 'replace' | 'merge' | 'skip';
  validateBeforeImport: boolean;
}

interface ExportImportManager {
  export(options: ExportOptions): Promise<Blob>;
  import(file: File, options: ImportOptions): Promise<ImportResult>;
  exportStats(): Promise<CSVBlob>;
  validateImportFile(file: File): Promise<ValidationResult>;
}

interface ImportResult {
  success: boolean;
  imported: {
    knowledge: number;
    templates: number;
    synonyms: number;
  };
  skipped: number;
  errors: string[];
}
```

### 11. Sandbox Manager (مدير بيئة الاختبار)

```typescript
interface SandboxManager {
  createSandbox(): Promise<SandboxSession>;
  destroySandbox(sessionId: string): Promise<void>;
  generateInSandbox(
    sessionId: string,
    request: GenerationRequest
  ): Promise<GeneratedContent>;
  compareWithProduction(
    sessionId: string,
    request: GenerationRequest
  ): Promise<ComparisonResult>;
  promoteToProduction(sessionId: string): Promise<void>;
}

interface SandboxSession {
  id: string;
  createdAt: Date;
  settings: SONASettings;
  templates: Templates;
  generatedContent: GeneratedContent[];
}

interface ComparisonResult {
  sandbox: GeneratedContent;
  production: GeneratedContent;
  differences: {
    qualityScoreDiff: number;
    wordCountDiff: number;
    keywordDensityDiff: number;
    structureDiff: string[];
  };
}
```

### 12. Analytics & Logging (التحليلات والتسجيل)

```typescript
interface SONAAnalytics {
  // Generation Stats
  getTotalGenerations(period?: DateRange): Promise<number>;
  getAverageQualityScore(period?: DateRange): Promise<number>;
  getMostUsedTemplates(limit: number): Promise<TemplateUsage[]>;
  getLeastUsedTemplates(limit: number): Promise<TemplateUsage[]>;
  getCategoryDistribution(): Promise<CategoryStats[]>;

  // Performance Stats
  getAverageGenerationTime(): Promise<number>;
  getErrorRate(): Promise<number>;
  getRetryRate(): Promise<number>;

  // Quality Analysis
  getQualityTrend(period: DateRange): Promise<QualityTrend[]>;
  getLowQualityTemplates(): Promise<TemplateQuality[]>;
  getDiversityScore(): Promise<number>;
}

interface SONALogger {
  logGeneration(metadata: GenerationLog): Promise<void>;
  logError(error: Error, context: ErrorContext): Promise<void>;
  logTemplateUsage(templateId: string): Promise<void>;
  getRecentLogs(limit: number): Promise<LogEntry[]>;
  exportLogs(period: DateRange, format: 'json' | 'csv'): Promise<Blob>;
}

interface GenerationLog {
  timestamp: Date;
  topic: string;
  category: string;
  duration: number;
  qualityScore: number;
  templatesUsed: string[];
  wordCount: number;
  success: boolean;
  retries: number;
}
```

### 13. SONA API (واجهة برمجة التطبيقات)

```typescript
// API Routes
interface SONAAPIRoutes {
  // Generation
  'POST /api/sona/generate': {
    request: GenerationRequest;
    response: GeneratedContent;
  };

  // Categories & Templates
  'GET /api/sona/categories': {
    response: CategoryInfo[];
  };
  'GET /api/sona/templates/:category': {
    response: Templates;
  };

  // Settings
  'GET /api/sona/settings': {
    response: SONASettings;
  };
  'PUT /api/sona/settings': {
    request: Partial<SONASettings>;
    response: SONASettings;
  };

  // Analytics
  'GET /api/sona/stats': {
    response: GenerationStats;
  };
  'GET /api/sona/analytics': {
    query: { period?: string };
    response: AnalyticsData;
  };

  // Plugins
  'GET /api/sona/plugins': {
    response: PluginInfo[];
  };
  'PUT /api/sona/plugins/:name/toggle': {
    response: { enabled: boolean };
  };

  // Export/Import
  'POST /api/sona/export': {
    request: ExportOptions;
    response: Blob;
  };
  'POST /api/sona/import': {
    request: FormData; // file + options
    response: ImportResult;
  };

  // Sandbox
  'POST /api/sona/sandbox/create': {
    response: SandboxSession;
  };
  'POST /api/sona/sandbox/:id/generate': {
    request: GenerationRequest;
    response: GeneratedContent;
  };
  'POST /api/sona/sandbox/:id/promote': {
    response: { success: boolean };
  };
}

// API Response Format
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    duration: number;
    version: string;
  };
}
```

````

## Data Models

### Knowledge Base Structure (data/sona/knowledge/)

```json
// zodiac.json
{
  "الحمل": {
    "element": "ناري",
    "dates": "21 مارس - 19 أبريل",
    "planet": "المريخ",
    "traits": ["الشجاعة", "الحماس", "القيادة"],
    "strengths": ["التصميم", "الثقة"],
    "weaknesses": ["التسرع", "العناد"],
    "compatibility": ["الأسد", "القوس"],
    "color": "الأحمر",
    "stone": "الماس",
    "facts": [
      "برج الحمل هو أول الأبراج الفلكية...",
      "يتميز مواليد الحمل بالطاقة العالية..."
    ],
    "tips": [
      "استغل طاقتك في مشاريع إبداعية...",
      "تعلم الصبر لتحقيق أهدافك..."
    ]
  }
}

// birthday.json
{
  "traditions": {
    "arabic": ["تقاليد عربية..."],
    "western": ["تقاليد غربية..."],
    "asian": ["تقاليد آسيوية..."]
  },
  "ideas": {
    "gifts": ["أفكار هدايا..."],
    "decorations": ["أفكار ديكور..."],
    "activities": ["أنشطة ممتعة..."]
  },
  "facts": ["حقائق عن أعياد الميلاد..."],
  "greetings": ["عبارات تهنئة..."]
}
````

### Templates Structure (data/sona/templates/)

```json
// intros.json
{
  "general": [
    {
      "id": "intro_1",
      "template": "مرحباً بكم في {site_name}! في هذا المقال الشامل، سنتناول {topic} بالتفصيل...",
      "variables": ["site_name", "topic"],
      "tone": "friendly"
    },
    {
      "id": "intro_2",
      "template": "هل تبحثون عن معلومات موثوقة حول {topic}؟ أنتم في المكان الصحيح...",
      "variables": ["topic"],
      "tone": "engaging"
    }
  ],
  "birthday": [...],
  "zodiac": [...],
  "health": [...]
}

// paragraphs.json
{
  "facts": [
    {
      "id": "facts_1",
      "template": "<h2>حقائق مهمة عن {topic}</h2>\n<p>هناك العديد من الحقائق المثيرة حول {topic}:</p>\n<ul>\n{facts_list}\n</ul>",
      "variables": ["topic", "facts_list"]
    }
  ],
  "tips": [...],
  "howto": [...],
  "faq": [...]
}

// conclusions.json
{
  "general": [
    {
      "id": "conclusion_1",
      "template": "في الختام، نأمل أن يكون هذا المقال قد أفادكم في فهم {topic}. شاركوا المقال مع أصدقائكم!",
      "variables": ["topic"]
    }
  ]
}
```

### Synonyms Structure (data/sona/synonyms/)

```json
// arabic.json
{
  "مهم": ["ضروري", "أساسي", "جوهري", "حيوي", "رئيسي"],
  "جميل": ["رائع", "بديع", "ساحر", "فاتن", "أخاذ"],
  "كبير": ["ضخم", "هائل", "عظيم", "واسع", "شاسع"],
  "صغير": ["ضئيل", "قليل", "محدود", "بسيط", "يسير"],
  "سريع": ["عاجل", "فوري", "خاطف", "متسارع", "سريع البديهة"],
  "يساعد": ["يعين", "يدعم", "يسهم", "يعاون", "يؤازر"],
  "يقدم": ["يوفر", "يمنح", "يعرض", "يطرح", "يتيح"],
  "معلومات": ["بيانات", "حقائق", "تفاصيل", "معطيات", "إيضاحات"]
}
```

### Phrases Library (data/sona/phrases/)

```json
// transitions.json
{
  "addition": [
    "بالإضافة إلى ذلك",
    "علاوة على ذلك",
    "فضلاً عن ذلك",
    "كما أن",
    "ومن الجدير بالذكر"
  ],
  "contrast": [
    "من ناحية أخرى",
    "على العكس من ذلك",
    "بينما",
    "في المقابل",
    "ومع ذلك"
  ],
  "conclusion": [
    "في الختام",
    "وخلاصة القول",
    "وبناءً على ما سبق",
    "ومما تقدم نستنتج",
    "وفي نهاية المطاف"
  ],
  "example": [
    "على سبيل المثال",
    "من الأمثلة على ذلك",
    "كمثال على ذلك",
    "ومن ذلك",
    "نذكر منها"
  ]
}

// greetings.json
{
  "birthday": [
    "كل عام وأنت بألف خير",
    "عيد ميلاد سعيد ومبارك",
    "أتمنى لك عاماً مليئاً بالسعادة",
    "عقبال مئة سنة من العمر المديد",
    "أجمل التهاني بمناسبة عيد ميلادك"
  ]
}

// ctas.json
{
  "tools": [
    "جرب حاسبة العمر المجانية من ميلادك",
    "اكتشف برجك الآن مع أدوات ميلادك",
    "استخدم محول التواريخ لتحويل تاريخك"
  ],
  "share": [
    "شارك هذا المقال مع أصدقائك",
    "لا تنسَ مشاركة المقال مع من تحب",
    "انشر الفائدة وشارك المقال"
  ]
}
```

### Postgres Database Schema

```sql
-- جدول الإعدادات (Runtime Settings)
CREATE TABLE sona_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(100)
);

-- جدول بصمات المحتوى
CREATE TABLE generated_content_hashes (
  id SERIAL PRIMARY KEY,
  content_hash VARCHAR(64) UNIQUE NOT NULL,
  topic VARCHAR(500) NOT NULL,
  category VARCHAR(100) NOT NULL,
  word_count INTEGER NOT NULL,
  quality_score DECIMAL(5,2),
  templates_used JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول إحصائيات التوليد
CREATE TABLE generation_stats (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  total_generations INTEGER DEFAULT 0,
  successful_generations INTEGER DEFAULT 0,
  failed_generations INTEGER DEFAULT 0,
  avg_quality_score DECIMAL(5,2),
  avg_generation_time INTEGER, -- milliseconds
  category_breakdown JSONB,
  template_usage JSONB,
  UNIQUE(date)
);

-- جدول إصدارات القوالب
CREATE TABLE template_versions (
  id SERIAL PRIMARY KEY,
  template_id VARCHAR(100) NOT NULL,
  version INTEGER NOT NULL,
  content TEXT NOT NULL,
  change_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100),
  is_archived BOOLEAN DEFAULT FALSE,
  UNIQUE(template_id, version)
);

-- جدول سجلات التوليد
CREATE TABLE generation_logs (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  topic VARCHAR(500),
  category VARCHAR(100),
  duration INTEGER, -- milliseconds
  quality_score DECIMAL(5,2),
  templates_used JSONB,
  word_count INTEGER,
  success BOOLEAN,
  retries INTEGER DEFAULT 0,
  error_message TEXT
);

-- جدول الـ Plugins
CREATE TABLE sona_plugins (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  version VARCHAR(20),
  enabled BOOLEAN DEFAULT TRUE,
  config JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_content_hashes_category ON generated_content_hashes(category);
CREATE INDEX idx_content_hashes_created ON generated_content_hashes(created_at);
CREATE INDEX idx_generation_logs_timestamp ON generation_logs(timestamp);
CREATE INDEX idx_generation_logs_category ON generation_logs(category);
CREATE INDEX idx_template_versions_template ON template_versions(template_id);
```

### File Structure (بنية الملفات)

```
📁 data/sona/
├── 📁 knowledge/                    # قاعدة المعرفة (JSON ثابتة)
│   ├── zodiac.json                  # معلومات الأبراج
│   ├── birthday.json                # معلومات أعياد الميلاد
│   ├── health.json                  # معلومات صحية
│   ├── dates.json                   # معلومات التواريخ
│   └── [category].json              # فئات إضافية
│
├── 📁 templates/                    # القوالب
│   ├── 📁 intros/                   # قوالب المقدمات
│   │   ├── general.json             # مقدمات عامة
│   │   ├── birthday.json            # مقدمات أعياد الميلاد
│   │   ├── zodiac.json              # مقدمات الأبراج
│   │   └── health.json              # مقدمات صحية
│   │
│   ├── 📁 paragraphs/               # قوالب الفقرات
│   │   ├── facts.json               # فقرات الحقائق
│   │   ├── tips.json                # فقرات النصائح
│   │   ├── howto.json               # فقرات كيفية
│   │   └── faq.json                 # فقرات الأسئلة
│   │
│   └── 📁 conclusions/              # قوالب الخاتمات
│       ├── general.json
│       └── [category].json
│
├── 📁 synonyms/                     # المرادفات
│   ├── arabic.json                  # مرادفات عربية
│   └── contextual.json              # مرادفات سياقية
│
├── 📁 phrases/                      # العبارات
│   ├── transitions.json             # عبارات الانتقال
│   ├── greetings.json               # عبارات التهنئة
│   └── ctas.json                    # دعوات للعمل
│
├── 📁 plugins/                      # الإضافات
│   ├── birthday.plugin.ts
│   ├── zodiac.plugin.ts
│   ├── health.plugin.ts
│   └── [custom].plugin.ts
│
└── 📁 config/                       # الإعدادات
    ├── defaults.json                # الإعدادات الافتراضية
    └── schema.json                  # مخطط التحقق
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Content Diversity

_For any_ two articles generated about the same topic, the similarity between them should be less than 50%
**Validates: Requirements 2.5**

### Property 2: Template Variety

_For any_ 10 articles generated, at least 8 different intro templates, 15 different paragraph templates, and 6 different conclusion templates should be used
**Validates: Requirements 2.2, 2.3, 2.4**

### Property 3: Keyword Density

_For any_ generated article, the main keyword should appear 3-5 times naturally distributed throughout the content
**Validates: Requirements 6.1**

### Property 4: Meta Description Length

_For any_ generated meta description, the length should be between 150-160 characters
**Validates: Requirements 6.4**

### Property 5: Interactive Elements

_For any_ long article (2000+ words), it should contain at least 3 FAQs, 5 tips, and 2 CTAs
**Validates: Requirements 5.1, 5.2, 5.5**

### Property 6: Quality Score Threshold

_For any_ generated article, if the quality score is below 70%, the system should regenerate with different templates
**Validates: Requirements 8.4**

### Property 7: Content Hash Uniqueness

_For any_ generated article, its hash should be stored in the database and checked against existing hashes
**Validates: Requirements 12.1, 12.2**

### Property 8: Synonym Replacement

_For any_ generated paragraph, at least 20% of common words should be replaced with synonyms
**Validates: Requirements 3.1, 10.1**

### Property 9: Sentence Length Variety

_For any_ generated article, sentence lengths should vary with standard deviation > 5 words
**Validates: Requirements 3.2**

### Property 10: Contextual Personalization

_For any_ topic containing a person's name, the generated content should include that name at least 3 times
**Validates: Requirements 4.1**

### Property 11: Zodiac Information Accuracy

_For any_ article about a specific zodiac sign, it should contain accurate information about that sign's element, dates, and traits
**Validates: Requirements 1.2, 4.3**

### Property 12: Rephrasing Variety

_For any_ sentence passed to the rephraser, it should produce at least 5 different valid rephrasings
**Validates: Requirements 11.1**

### Property 13: Settings Persistence

_For any_ settings change made through the control panel, the change should be immediately reflected in subsequent generations
**Validates: Requirements 13.2**

### Property 14: Plugin Isolation

_For any_ plugin that fails during execution, the main generation process should continue without interruption
**Validates: Requirements 14.4**

### Property 15: Template Version Integrity

_For any_ template rollback operation, the restored version should be identical to the original saved version
**Validates: Requirements 15.3**

### Property 16: Export/Import Round Trip

_For any_ exported data, importing it back should produce identical data (excluding timestamps)
**Validates: Requirements 16.1, 16.2**

### Property 17: Sandbox Isolation

_For any_ content generated in sandbox mode, it should not affect production data or statistics
**Validates: Requirements 17.2**

### Property 18: API Response Consistency

_For any_ API request, the response should follow the standard format with success/error fields and appropriate HTTP codes
**Validates: Requirements 19.5**

### Property 19: Logging Completeness

_For any_ generation operation, all relevant metadata (duration, templates, quality) should be logged
**Validates: Requirements 18.1**

### Property 20: Category Extension

_For any_ new category added via plugin, it should be automatically available for content generation without code changes
**Validates: Requirements 14.5, 20.4**

## Error Handling

### Data Loading Errors

- If a JSON file fails to load, use fallback data from memory
- Log the error and continue with degraded functionality
- Notify admin of missing data files

### Quality Check Failures

- If quality score < 70%, retry up to 3 times with different templates
- If still failing, return best attempt with warning
- Log failed generations for analysis

### Database Connection Errors

- If Postgres is unavailable, skip hash checking
- Continue generation without tracking
- Queue hash saves for later retry

### Template Not Found

- If specific template category not found, use general templates
- Log missing template categories
- Gracefully degrade to simpler content

### Plugin Errors

- If a plugin throws an error, catch and log it
- Continue with other plugins and core functionality
- Mark plugin as "errored" in admin panel
- Provide detailed error context for debugging

### Settings Validation Errors

- Validate all settings before applying
- Reject invalid values with clear error messages
- Maintain previous valid settings on failure

### API Errors

- Return consistent error format with code and message
- Use appropriate HTTP status codes (400, 401, 404, 500)
- Include request ID for debugging
- Rate limit to prevent abuse

### Sandbox Errors

- Isolate sandbox errors from production
- Auto-cleanup failed sandbox sessions
- Provide rollback capability

## Testing Strategy

### Unit Tests

- Test TopicAnalyzer with various topic formats
- Test TemplateEngine template selection and filling
- Test Rephraser synonym replacement
- Test QualityChecker scoring algorithms
- Test SettingsManager validation and persistence
- Test PluginManager lifecycle hooks
- Test TemplateVersionManager versioning operations
- Test ExportImportManager data integrity

### Property-Based Tests (using fast-check)

- Test content diversity across multiple generations
- Test keyword density distribution
- Test meta description length constraints
- Test quality score thresholds
- Test hash uniqueness
- Test settings persistence round-trip
- Test plugin isolation on failure
- Test template version rollback integrity
- Test export/import round-trip
- Test sandbox isolation
- Test API response consistency

### Integration Tests

- Test full generation pipeline
- Test Postgres integration for tracking
- Test JSON file loading
- Test error handling scenarios
- Test plugin system with multiple plugins
- Test settings changes affecting generation
- Test API endpoints with various inputs
- Test sandbox to production promotion

### Test Configuration

- Minimum 100 iterations per property test
- Use seeded random for reproducibility
- Test with Arabic text edge cases
- Mock external dependencies for unit tests
- Use test database for integration tests

### Test File Structure

```
📁 __tests__/
├── 📁 unit/
│   ├── topicAnalyzer.test.ts
│   ├── templateEngine.test.ts
│   ├── rephraser.test.ts
│   ├── qualityChecker.test.ts
│   ├── settingsManager.test.ts
│   ├── pluginManager.test.ts
│   └── versionManager.test.ts
│
├── 📁 property/
│   ├── contentDiversity.property.ts
│   ├── keywordDensity.property.ts
│   ├── qualityThreshold.property.ts
│   ├── settingsPersistence.property.ts
│   ├── pluginIsolation.property.ts
│   ├── exportImportRoundTrip.property.ts
│   └── sandboxIsolation.property.ts
│
└── 📁 integration/
    ├── generationPipeline.test.ts
    ├── postgresTracking.test.ts
    ├── apiEndpoints.test.ts
    └── pluginSystem.test.ts
```
