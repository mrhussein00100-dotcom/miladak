/**
 * SONA v6 Types - Smart Orchestrator
 * نموذج ذكي يجمع بين Groq/Gemini + مكتبات NLP + قواميس ضخمة
 */

// ============================================
// أنواع AI Providers
// ============================================

export type AIProviderName = 'groq' | 'gemini' | 'openai';

export interface AIProviderConfig {
  name: AIProviderName;
  priority: number;
  costPerToken: number;
  maxTokens: number;
  enabled: boolean;
  dailyLimit: number;
}

export interface AIProviderResponse {
  content: string;
  provider: AIProviderName;
  tokens: number;
  cost: number;
  latency: number;
}

export interface ProviderUsage {
  provider: AIProviderName;
  tokensUsed: number;
  costToday: number;
  requestsToday: number;
  lastRequest: Date;
}

// ============================================
// أنواع الكلمات والقواميس
// ============================================

export type WordType =
  | 'verb'
  | 'noun'
  | 'adjective'
  | 'adverb'
  | 'connector'
  | 'idiom';

export type Tense = 'past' | 'present' | 'future' | 'imperative';

export type Person = 'first' | 'second' | 'third';

export type Gender = 'masculine' | 'feminine';

export type Number = 'singular' | 'dual' | 'plural';

export interface VerbForms {
  past: string;
  present: string;
  imperative: string;
  participle: string;
  masdar: string; // المصدر
}

export interface LexiconEntry {
  word: string;
  type: WordType;
  root?: string;
  synonyms: string[];
  antonyms?: string[];
  examples?: string[];
  frequency: number; // 1-100 شيوع الاستخدام
  forms?: VerbForms;
  category?: string;
}

export interface IdiomEntry {
  expression: string;
  meaning: string;
  usage: 'formal' | 'informal' | 'both';
  examples: string[];
  category: string;
}

export interface ConnectorEntry {
  word: string;
  type: 'addition' | 'contrast' | 'result' | 'example' | 'time' | 'condition';
  usage: string;
  alternatives: string[];
}

// ============================================
// أنواع تحليل الجمل
// ============================================

export interface Token {
  text: string;
  lemma: string;
  pos: PartOfSpeech;
  root?: string;
  features: TokenFeatures;
}

export type PartOfSpeech =
  | 'NOUN'
  | 'VERB'
  | 'ADJ'
  | 'ADV'
  | 'PREP'
  | 'CONJ'
  | 'PRON'
  | 'DET'
  | 'NUM'
  | 'PUNCT'
  | 'PART';

export interface TokenFeatures {
  gender?: Gender;
  number?: Number;
  person?: Person;
  tense?: Tense;
  definite?: boolean;
}

export interface Dependency {
  head: number;
  dependent: number;
  relation: string;
}

export interface SentenceAnalysis {
  tokens: Token[];
  dependencies: Dependency[];
  isValid: boolean;
  errors: GrammarError[];
  suggestions: string[];
}

export interface GrammarError {
  position: number;
  type: 'agreement' | 'syntax' | 'spelling' | 'punctuation';
  message: string;
  suggestion?: string;
}

export interface GrammarResult {
  isValid: boolean;
  score: number; // 0-100
  errors: GrammarError[];
}

// ============================================
// أنواع تتبع السياق
// ============================================

export interface SimilarityResult {
  isSimilar: boolean;
  similarityScore: number; // 0-100
  similarSentence?: string;
  suggestion?: string;
}

export interface ContextState {
  articleId: string;
  usedSentences: Map<string, number>; // sentence hash -> paragraph index
  usedKeywords: Map<string, number[]>; // keyword -> paragraph indices
  usedConnectors: Set<string>;
  usedIdioms: Set<string>;
  usedWords: Map<string, number>; // word -> count
  paragraphCount: number;
  wordCount: number;
  lastTopic: string;
}

// ============================================
// أنواع التأليف
// ============================================

export type WritingStyle =
  | 'narrative'
  | 'analytical'
  | 'instructional'
  | 'descriptive'
  | 'persuasive';

export interface CompositionParams {
  topic: string;
  keywords: string[];
  style: WritingStyle;
  maxLength: number;
  minLength?: number;
  context: string[]; // الجمل السابقة
  category?: TopicCategory;
}

export interface SentenceTemplate {
  pattern: string;
  slots: SlotDefinition[];
  style: WritingStyle;
  category?: string;
}

export interface SlotDefinition {
  name: string;
  type: 'noun' | 'verb' | 'adjective' | 'number' | 'name' | 'custom';
  required: boolean;
  options?: string[];
}

// ============================================
// أنواع الجودة
// ============================================

export interface QualityReport {
  score: number; // 0-100
  passed: boolean;
  repetitionScore: number;
  diversityScore: number;
  genericScore: number;
  grammarScore: number;
  coherenceScore: number;
  weakParts: WeakPart[];
  suggestions: string[];
  details: QualityDetails;
}

export interface QualityDetails {
  totalWords: number;
  uniqueWords: number;
  sentenceCount: number;
  avgSentenceLength: number;
  repeatedPhrases: string[];
  genericSentences: string[];
  grammarErrors: GrammarError[];
}

export interface WeakPart {
  startIndex: number;
  endIndex: number;
  text: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
}

export interface RepetitionReport {
  score: number;
  repeatedPhrases: Array<{
    phrase: string;
    count: number;
    positions: number[];
  }>;
}

export interface DiversityReport {
  score: number;
  uniqueWords: number;
  totalWords: number;
  ratio: number;
  suggestions: string[];
}

export interface GenericReport {
  score: number;
  genericSentences: Array<{
    sentence: string;
    position: number;
    suggestion: string;
  }>;
}

// ============================================
// أنواع التوليد
// ============================================

export type TopicCategory =
  | 'birthday'
  | 'zodiac'
  | 'health'
  | 'dates'
  | 'pregnancy'
  | 'general';

export type ArticleLength = 'short' | 'medium' | 'long' | 'comprehensive';

export interface GenerationRequest {
  topic: string;
  length: ArticleLength;
  style?: WritingStyle;
  category?: TopicCategory;
  includeKeywords?: string[];
  maxRetries?: number;
  minQualityScore?: number;
  preferSona?: boolean;
}

export interface GenerationResult {
  content: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  wordCount: number;
  provider: 'sona' | 'groq' | 'gemini';
  qualityScore: number;
  qualityReport: QualityReport;
  generationTime: number;
  retryCount: number;
  fallbackUsed: boolean;
  fallbackReason?: string;
}

export interface FailureLog {
  timestamp: Date;
  request: GenerationRequest;
  reason: string;
  qualityScore?: number;
  retryCount: number;
}

// ============================================
// أنواع التكوين
// ============================================

export interface QualityThresholds {
  minOverallScore: number;
  maxRepetition: number;
  minDiversity: number;
  maxGeneric: number;
  minGrammar: number;
  maxRetries: number;
  fallbackThreshold: number;
}

export interface GeneratorConfig {
  quality: QualityThresholds;
  wordCountTargets: Record<ArticleLength, { min: number; max: number }>;
  enableFallback: boolean;
  preferredFallback: 'groq' | 'gemini';
  logFailures: boolean;
  cacheEnabled: boolean;
}

// ============================================
// ثوابت افتراضية
// ============================================

export const DEFAULT_QUALITY_THRESHOLDS: QualityThresholds = {
  minOverallScore: 70,
  maxRepetition: 10,
  minDiversity: 50,
  maxGeneric: 15,
  minGrammar: 90,
  maxRetries: 3,
  fallbackThreshold: 70,
};

export const DEFAULT_WORD_COUNT_TARGETS: Record<
  ArticleLength,
  { min: number; max: number }
> = {
  short: { min: 400, max: 700 },
  medium: { min: 800, max: 1200 },
  long: { min: 1500, max: 2500 },
  comprehensive: { min: 2500, max: 4000 },
};

export const DEFAULT_CONFIG: GeneratorConfig = {
  quality: DEFAULT_QUALITY_THRESHOLDS,
  wordCountTargets: DEFAULT_WORD_COUNT_TARGETS,
  enableFallback: true,
  preferredFallback: 'groq',
  logFailures: true,
  cacheEnabled: true,
};

// ============================================
// أنواع Orchestrator
// ============================================

export interface OrchestratorConfig {
  providers: AIProviderConfig[];
  cache: CacheConfig;
  quality: QualityThresholds;
  prompts: PromptConfig;
}

export interface CacheConfig {
  enabled: boolean;
  ttlHours: number;
  maxSize: number;
}

export interface PromptConfig {
  systemPrompt: string;
  categoryPrompts: Record<TopicCategory, CategoryPrompt>;
}

export interface CategoryPrompt {
  system: string;
  template: string;
  examples?: string[];
}

export interface OrchestratorResult {
  content: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  provider: AIProviderName;
  qualityScore: number;
  cached: boolean;
  cost: number;
  latency: number;
  enhancementIterations: number;
}

// ============================================
// أنواع Enhancer
// ============================================

export interface EnhanceOptions {
  targetQuality: number;
  maxIterations: number;
  focusAreas: EnhanceFocusArea[];
  useAI: boolean;
  useLexicon: boolean;
}

export type EnhanceFocusArea =
  | 'coherence'
  | 'vocabulary'
  | 'specificity'
  | 'grammar'
  | 'repetition';

export interface EnhanceResult {
  original: string;
  enhanced: string;
  iterations: number;
  improvements: string[];
  qualityBefore: number;
  qualityAfter: number;
}

// ============================================
// أنواع Cache
// ============================================

export interface CacheEntry {
  key: string;
  content: string;
  metadata: CacheMetadata;
  createdAt: Date;
  expiresAt: Date;
}

export interface CacheMetadata {
  topic: string;
  category: TopicCategory;
  provider: AIProviderName;
  qualityScore: number;
  wordCount: number;
}

// ============================================
// أنواع Usage Tracking
// ============================================

export interface UsageStats {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  byProvider: Record<AIProviderName, ProviderUsage>;
  cacheHits: number;
  cacheMisses: number;
}

export interface UsageLog {
  timestamp: Date;
  provider: AIProviderName;
  tokens: number;
  cost: number;
  cached: boolean;
  topic: string;
  category: TopicCategory;
}

// ============================================
// أنواع الأخطاء
// ============================================

export class SONAError extends Error {
  constructor(
    message: string,
    public code: SONAErrorCode,
    public provider?: AIProviderName,
    public recoverable: boolean = true
  ) {
    super(message);
    this.name = 'SONAError';
  }
}

export type SONAErrorCode =
  | 'PROVIDER_UNAVAILABLE'
  | 'RATE_LIMIT_EXCEEDED'
  | 'QUALITY_TOO_LOW'
  | 'CACHE_ERROR'
  | 'NLP_ERROR'
  | 'LEXICON_ERROR'
  | 'ALL_PROVIDERS_FAILED'
  | 'INVALID_REQUEST';
