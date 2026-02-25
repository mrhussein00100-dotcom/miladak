/**
 * SONA v5 - Advanced Arabic Content Generator
 * نظام توليد المحتوى العربي المتقدم
 *
 * الإصدار 5.0 - تحسينات جذرية:
 * - سلاسل ماركوف للتوليد الطبيعي
 * - بنك عبارات ضخم (1000+ عبارة)
 * - مركب جمل ذكي
 * - خلاط محتوى متقدم
 * - تنويع حقيقي في كل مرة
 */

// المولد الرئيسي
export {
  SonaV5Generator,
  sonaV5Generator,
  generateWithSonaV5,
} from './sonaV5Generator';
export type { SonaV5Request, SonaV5Response } from './sonaV5Generator';

// سلاسل ماركوف
export { ArabicMarkovChain, arabicMarkov } from './markovChain';
export type { MarkovState, MarkovModel } from './markovChain';

// بنك العبارات
export {
  MASSIVE_INTROS,
  MASSIVE_TRANSITIONS,
  MASSIVE_CONCLUSIONS,
  DESCRIPTIVE_SENTENCES,
  LINKING_PHRASES,
  getRandomPhrase,
  getRandomTransition,
  getRandomConclusion,
  getRandomDescriptive,
  getRandomLinking,
} from './massivePhraseBank';

// مركب الجمل
export { SentenceComposer, sentenceComposer } from './sentenceComposer';
export type { SentencePattern } from './sentenceComposer';

// خلاط المحتوى
export { ContentMixer, contentMixer } from './contentMixer';
export type { ContentBlock, MixerConfig } from './contentMixer';

// نصوص التدريب
export {
  BIRTHDAY_CORPUS,
  ZODIAC_CORPUS,
  HEALTH_CORPUS,
  GENERAL_CORPUS,
  DATES_CORPUS,
  getAllCorpus,
  getCorpusByCategory,
} from './trainingCorpus';
