/**
 * SONA v4 Type Definitions
 * أنواع البيانات لنظام SONA
 */

// Topic Categories
export type TopicCategory =
  | 'birthday'
  | 'zodiac'
  | 'health'
  | 'dates'
  | 'general';

// Tone types
export type ContentTone = 'formal' | 'casual' | 'friendly' | 'engaging' | 'seo';

// Article length
export type ArticleLength = 'short' | 'medium' | 'long' | 'comprehensive';

// Extracted entities from topic
export interface ExtractedEntities {
  names: string[];
  dates: string[];
  numbers: number[];
  zodiacSigns: string[];
  ages: number[];
  keywords: string[];
}

// Topic analysis result
export interface TopicAnalysis {
  category: TopicCategory;
  subCategory?: string;
  extractedEntities: ExtractedEntities;
  keywords: string[];
  suggestedSections: string[];
  tone: ContentTone;
  confidence: number;
}

// Generation request
export interface GenerationRequest {
  topic: string;
  length: ArticleLength;
  style?: ContentTone;
  includeKeywords?: string[];
  category?: TopicCategory;
  customSettings?: Partial<GenerationSettings>;
}

// Generation settings
export interface GenerationSettings {
  articleLength: ArticleLength;
  wordCountTargets: {
    short: number;
    medium: number;
    long: number;
    comprehensive: number;
  };
  keywordDensity: number;
  minKeywordOccurrences: number;
  maxKeywordOccurrences: number;
  minQualityScore: number;
  maxRetries: number;
  diversityLevel: 'low' | 'medium' | 'high' | 'maximum';
  enableSynonymReplacement: boolean;
  enableSentenceVariation: boolean;
  enableFAQGeneration: boolean;
  enableTipsGeneration: boolean;
  enableCTAs: boolean;
}

// Quality report
export interface QualityReport {
  overallScore: number;
  diversityScore: number;
  keywordDensity: number;
  readabilityScore: number;
  structureScore: number;
  suggestions: string[];
  passed: boolean;
}

// Generated content
export interface GeneratedContent {
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

// Template types
export interface Template {
  id: string;
  template: string;
  variables: string[];
  tone?: ContentTone;
  length?: 'short' | 'medium' | 'long';
  type?: string;
}

export interface TemplateFile {
  category: string;
  templates: Template[];
}

// FAQ type
export interface FAQ {
  question: string;
  answer: string;
}

// Zodiac sign data
export interface ZodiacSign {
  name: string;
  englishName: string;
  element: string;
  quality: string;
  dates: string;
  planet: string;
  symbol: string;
  color: string;
  stone: string;
  luckyNumbers: number[];
  luckyDay: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  compatibility: string[];
  incompatibility: string[];
  facts: string[];
  tips: string[];
  career: string[];
  health: string[];
  celebrities: string[];
}

// Content metadata for tracking
export interface ContentMetadata {
  topic: string;
  category: TopicCategory;
  generatedAt: Date;
  usedTemplates: string[];
  wordCount: number;
  qualityScore: number;
}
