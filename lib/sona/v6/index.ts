/**
 * SONA v6 - Smart Orchestrator
 * نموذج ذكي يجمع بين Groq/Gemini + مكتبات NLP + قواميس ضخمة
 *
 * @description
 * SONA v6 ليس نموذج AI مستقل، بل هو منسق ذكي (Smart Orchestrator) يجمع بين:
 * - Groq/Gemini/OpenAI للتوليد الذكي
 * - Prompts متخصصة لمواضيع ميلادك (أبراج، عيد ميلاد، حمل، عمر)
 * - محلل جودة متقدم
 * - محسن محتوى تلقائي
 * - نظام cache لتقليل التكلفة
 * - تتبع الاستخدام والتكلفة
 *
 * @example
 * ```typescript
 * import sona from '@/lib/sona/v6';
 *
 * const result = await sona.generate({
 *   topic: 'برج الحمل',
 *   length: 'medium',
 *   category: 'zodiac',
 * });
 *
 * console.log(result.content);
 * console.log(result.qualityScore);
 * ```
 */

// Types
export * from './types';

// Core modules
export { default as orchestrator } from './orchestrator';
export { default as providers } from './providers';
export { default as prompts } from './prompts';
export { default as analyzer } from './analyzer';
export { default as enhancer } from './enhancer';
export { default as cache } from './cache';
export { default as usage } from './usage';
export { default as lexicon, lexiconAPI, ArabicLexiconAPI } from './lexicon';

// Main functions
import orchestrator from './orchestrator';
import providers from './providers';
import prompts from './prompts';
import analyzer from './analyzer';
import enhancer from './enhancer';
import cache from './cache';
import usage from './usage';
import lexicon from './lexicon';
import {
  GenerationRequest,
  OrchestratorResult,
  TopicCategory,
  ArticleLength,
} from './types';

/**
 * توليد محتوى باستخدام SONA v6
 */
export async function generate(
  request: GenerationRequest
): Promise<OrchestratorResult> {
  return orchestrator.generateContent(request);
}

/**
 * توليد مقال سريع
 */
export async function generateArticle(
  topic: string,
  options: {
    length?: ArticleLength;
    category?: TopicCategory;
    keywords?: string[];
  } = {}
): Promise<OrchestratorResult> {
  return orchestrator.generateContent({
    topic,
    length: options.length || 'medium',
    category: options.category,
    includeKeywords: options.keywords,
  });
}

/**
 * توليد محتوى عيد ميلاد
 */
export async function generateBirthdayContent(
  name: string,
  age: number,
  options: { length?: ArticleLength } = {}
): Promise<OrchestratorResult> {
  return orchestrator.generateContent({
    topic: `عيد ميلاد ${name} ${age} سنة`,
    length: options.length || 'medium',
    category: 'birthday',
  });
}

/**
 * توليد محتوى برج
 */
export async function generateZodiacContent(
  sign: string,
  options: { length?: ArticleLength; topic?: string } = {}
): Promise<OrchestratorResult> {
  return orchestrator.generateContent({
    topic: options.topic ? `برج ${sign} - ${options.topic}` : `برج ${sign}`,
    length: options.length || 'medium',
    category: 'zodiac',
  });
}

/**
 * توليد محتوى حمل
 */
export async function generatePregnancyContent(
  week: number,
  options: { length?: ArticleLength } = {}
): Promise<OrchestratorResult> {
  return orchestrator.generateContent({
    topic: `الأسبوع ${week} من الحمل`,
    length: options.length || 'long',
    category: 'pregnancy',
  });
}

/**
 * توليد محتوى عمر
 */
export async function generateAgeContent(
  age: number,
  options: { length?: ArticleLength } = {}
): Promise<OrchestratorResult> {
  return orchestrator.generateContent({
    topic: `عمر ${age} سنة`,
    length: options.length || 'medium',
    category: 'dates',
  });
}

/**
 * الحصول على إحصائيات SONA v6
 */
export function getStats() {
  return orchestrator.getStats();
}

// Default export
export default {
  generate,
  generateArticle,
  generateBirthdayContent,
  generateZodiacContent,
  generatePregnancyContent,
  generateAgeContent,
  getStats,
  orchestrator,
  providers,
  prompts,
  analyzer,
  enhancer,
  cache,
  usage,
  lexicon,
};
