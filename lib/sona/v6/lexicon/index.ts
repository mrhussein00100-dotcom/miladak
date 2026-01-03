/**
 * Lexicon Module - وحدة القواميس العربية
 * تصدير جميع مكونات القاموس
 */

export { ArabicLexiconAPI, lexiconAPI } from './api';
export type { LexiconAPI } from './api';
export { LocalLexicon, localLexicon } from './local';

// Re-export types from main types file
export type {
  LexiconEntry,
  IdiomEntry,
  WordType,
  Tense,
  VerbForms,
  ConnectorEntry,
} from '../types';

// Default export
import { lexiconAPI } from './api';
export default lexiconAPI;
