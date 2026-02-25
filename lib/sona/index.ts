/**
 * SONA v4 - Smart Offline Native AI
 * نظام توليد المقالات العربية
 */

// Types
export * from './types';

// Topic Analyzer
export { TopicAnalyzer, topicAnalyzer } from './topicAnalyzer';

// Template Engine
export { TemplateEngine, templateEngine } from './templateEngine';

// Rephraser
export { Rephraser, rephraser } from './rephraser';
export type {
  SynonymDictionary,
  RephrasingOptions,
  RephrasingResult,
} from './rephraser';

// Content Generator
export { ContentGenerator, contentGenerator } from './contentGenerator';

// Quality Checker
export { QualityChecker, qualityChecker } from './qualityChecker';
export type { StructureReport, DetailedQualityReport } from './qualityChecker';

// Topic Binder
export { TopicBinder, topicBinder } from './topicBinder';
export type { TopicBinderConfig, TopicBinderResult } from './topicBinder';

// Strict Quality Gate
export {
  StrictQualityGate,
  strictQualityGate,
  STRICT_WORD_COUNT_LIMITS,
  STRICT_REQUIRED_SECTIONS,
} from './strictQualityGate';
export type { QualityGateConfig, QualityGateResult } from './strictQualityGate';

// Fallback Content System
export { FallbackContentSystem, fallbackContentSystem } from './fallbackSystem';
export type {
  FallbackTemplate,
  FallbackResult,
  FallbackSystemConfig,
} from './fallbackSystem';

// ============================================
// Enhanced Components (v5) - المكونات المحسّنة
// ============================================

// Enhanced Topic Analyzer
export {
  EnhancedTopicAnalyzer,
  enhancedTopicAnalyzer,
} from './enhancedTopicAnalyzer';
export type {
  DeepTopicAnalysis,
  ContentType,
  AudienceType,
  DetailLevel,
} from './enhancedTopicAnalyzer';

// Dynamic Content Builder
export {
  DynamicContentBuilder,
  dynamicContentBuilder,
} from './dynamicContentBuilder';
export type {
  ContentSection,
  KnowledgeEntry,
  BuilderConfig,
} from './dynamicContentBuilder';

// Phrase Variator
export { PhraseVariator, phraseVariator } from './phraseVariator';
export type { PresentationStyle, VariationOptions } from './phraseVariator';

// Enhanced Quality Validator
export {
  EnhancedQualityValidator,
  enhancedQualityValidator,
} from './enhancedQualityValidator';
export type {
  QualityIssue,
  EnhancedQualityReport,
  ValidationConfig,
} from './enhancedQualityValidator';

// Enhanced Generator (Main Entry Point for v5)
export {
  EnhancedGenerator,
  enhancedGenerator,
  generateEnhancedArticle,
} from './enhancedGenerator';
export type {
  EnhancedGenerationRequest,
  EnhancedGenerationResponse,
} from './enhancedGenerator';
