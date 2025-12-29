/**
 * SONA v4 Plugins Index
 * فهرس الإضافات - يصدر جميع الـ plugins المتاحة
 */

export { birthdayPlugin } from './birthday.plugin';
export { zodiacPlugin } from './zodiac.plugin';
export { healthPlugin } from './health.plugin';

// Re-export plugin manager types
export type {
  SONAPlugin,
  KnowledgeData,
  Templates,
  SynonymDictionary,
} from '../pluginManager';
