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
