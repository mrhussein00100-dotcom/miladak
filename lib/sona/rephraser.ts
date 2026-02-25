/**
 * SONA v4 Rephraser
 * معيد الصياغة - يعيد صياغة النصوص بطرق متنوعة
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 11.1, 11.2, 11.3, 11.4, 11.5
 */

import * as fs from 'fs';
import * as path from 'path';

// Types
export interface SynonymDictionary {
  verbs: Record<string, string[]>;
  adjectives: Record<string, string[]>;
  nouns: Record<string, string[]>;
  adverbs: Record<string, string[]>;
  connectors: Record<string, string[]>;
}

export interface RephrasingOptions {
  synonymReplacementRate?: number; // 0-1, default 0.3
  sentenceVariation?: boolean;
  rhetoricalVariety?: boolean;
  preserveKeywords?: string[];
}

export interface RephrasingResult {
  original: string;
  rephrased: string;
  changes: number;
  synonymsUsed: string[];
}

// Base path for SONA data
const SONA_DATA_PATH = path.join(process.cwd(), 'data', 'sona');

// Cache for synonyms
let synonymsCache: SynonymDictionary | null = null;

/**
 * Load synonyms dictionary
 */
function loadSynonyms(): SynonymDictionary {
  if (synonymsCache) {
    return synonymsCache;
  }

  const filePath = path.join(SONA_DATA_PATH, 'synonyms', 'arabic.json');

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      synonymsCache = JSON.parse(content);
      return synonymsCache!;
    }
  } catch (error) {
    console.error('Error loading synonyms:', error);
  }

  // Return empty dictionary if file not found
  return {
    verbs: {},
    adjectives: {},
    nouns: {},
    adverbs: {},
    connectors: {},
  };
}

/**
 * Rephraser Class
 * يعيد صياغة النصوص العربية بطرق متنوعة
 */
export class Rephraser {
  private synonyms: SynonymDictionary;
  private allSynonymsFlat: Map<string, string[]>;

  constructor() {
    this.synonyms = loadSynonyms();
    this.allSynonymsFlat = this.flattenSynonyms();
  }

  /**
   * تسطيح قاموس المرادفات للبحث السريع
   */
  private flattenSynonyms(): Map<string, string[]> {
    const flat = new Map<string, string[]>();

    for (const category of Object.values(this.synonyms)) {
      for (const [word, syns] of Object.entries(category)) {
        flat.set(word, syns as string[]);
      }
    }

    return flat;
  }

  /**
   * الحصول على مرادفات كلمة
   */
  getSynonyms(word: string): string[] {
    return this.allSynonymsFlat.get(word) || [];
  }

  /**
   * الحصول على مرادف سياقي
   */
  getContextualSynonym(word: string, context?: string): string {
    const synonyms = this.getSynonyms(word);

    if (synonyms.length === 0) {
      return word;
    }

    // Simple random selection for now
    // Could be enhanced with context-aware selection
    return synonyms[Math.floor(Math.random() * synonyms.length)];
  }

  /**
   * إعادة صياغة جملة واحدة - إنتاج صياغات متعددة
   * Requirements: 11.1
   */
  rephraseSentence(sentence: string, count: number = 5): string[] {
    const results: string[] = [];
    const words = sentence.split(/\s+/);

    for (let i = 0; i < count; i++) {
      let rephrased = sentence;
      const usedReplacements = new Set<string>();

      // Try different replacement strategies for each version
      for (const word of words) {
        const cleanWord = word.replace(/[^\u0600-\u06FF]/g, '');
        const synonyms = this.getSynonyms(cleanWord);

        if (synonyms.length > 0 && !usedReplacements.has(cleanWord)) {
          // Use different synonym for each version
          const synonymIndex =
            (i + Math.floor(Math.random() * synonyms.length)) % synonyms.length;
          const synonym = synonyms[synonymIndex];

          // Only replace if we haven't used this word yet
          if (Math.random() < 0.5 + i * 0.1) {
            // Increase replacement rate for later versions
            rephrased = rephrased.replace(new RegExp(cleanWord, 'g'), synonym);
            usedReplacements.add(cleanWord);
          }
        }
      }

      // Apply sentence structure variations
      if (i % 2 === 1) {
        rephrased = this.varySentenceStructure(rephrased);
      }

      // Only add if different from original and not duplicate
      if (rephrased !== sentence && !results.includes(rephrased)) {
        results.push(rephrased);
      }
    }

    // If we couldn't generate enough variations, add more with different strategies
    while (results.length < count) {
      const variation = this.applyRhetoricalVariation(sentence, results.length);
      if (!results.includes(variation) && variation !== sentence) {
        results.push(variation);
      } else {
        // Add with minor modifications
        const modified = this.addMinorVariation(sentence, results.length);
        if (!results.includes(modified)) {
          results.push(modified);
        } else {
          break; // Prevent infinite loop
        }
      }
    }

    return results.slice(0, count);
  }

  /**
   * إضافة تنويع بسيط
   */
  private addMinorVariation(sentence: string, index: number): string {
    const prefixes = [
      'في الواقع، ',
      'بالفعل، ',
      'حقاً، ',
      'من المؤكد أن ',
      'لا شك أن ',
    ];
    const suffixes = [' بالتأكيد', ' فعلاً', ' حقاً', ' بلا شك', ''];

    const prefix = prefixes[index % prefixes.length];
    const suffix = suffixes[index % suffixes.length];

    return prefix + sentence + suffix;
  }

  /**
   * إعادة صياغة فقرة كاملة
   * Requirements: 11.2
   */
  rephraseParagraph(paragraph: string, options?: RephrasingOptions): string {
    const sentences = this.splitIntoSentences(paragraph);
    const rephrasedSentences: string[] = [];

    for (let i = 0; i < sentences.length; i++) {
      let sentence = sentences[i];

      // Apply synonym replacement
      sentence = this.replaceSynonyms(sentence, options);

      // Vary sentence length occasionally
      if (options?.sentenceVariation !== false && i % 3 === 0) {
        sentence = this.varySentenceLength(sentence);
      }

      // Add rhetorical variety
      if (options?.rhetoricalVariety !== false && i % 4 === 0) {
        sentence = this.addRhetoricalVariety(sentence);
      }

      rephrasedSentences.push(sentence);
    }

    // Optionally reorder sentences while maintaining coherence
    if (sentences.length > 3) {
      // Keep first and last sentences in place, shuffle middle
      const first = rephrasedSentences[0];
      const last = rephrasedSentences[rephrasedSentences.length - 1];
      const middle = rephrasedSentences.slice(1, -1);

      // Light shuffle - swap adjacent pairs occasionally
      for (let i = 0; i < middle.length - 1; i += 2) {
        if (Math.random() < 0.3) {
          [middle[i], middle[i + 1]] = [middle[i + 1], middle[i]];
        }
      }

      return [first, ...middle, last].join(' ');
    }

    return rephrasedSentences.join(' ');
  }

  /**
   * استبدال الكلمات بمرادفاتها
   * Requirements: 3.1, 11.3
   */
  replaceSynonyms(text: string, options?: RephrasingOptions): string {
    const rate = options?.synonymReplacementRate ?? 0.3;
    const preserveKeywords = new Set(options?.preserveKeywords || []);

    let result = text;
    const words = text.split(/\s+/);
    let replacements = 0;
    const targetReplacements = Math.ceil(words.length * rate);

    for (const word of words) {
      if (replacements >= targetReplacements) break;

      const cleanWord = word.replace(/[^\u0600-\u06FF]/g, '');

      // Skip preserved keywords
      if (preserveKeywords.has(cleanWord)) continue;

      const synonyms = this.getSynonyms(cleanWord);

      if (synonyms.length > 0 && Math.random() < rate) {
        const synonym = synonyms[Math.floor(Math.random() * synonyms.length)];
        // Preserve punctuation
        const replacement = word.replace(cleanWord, synonym);
        result = result.replace(word, replacement);
        replacements++;
      }
    }

    return result;
  }

  /**
   * تنويع طول الجمل
   * Requirements: 3.2
   */
  varySentenceLength(text: string): string {
    const sentences = this.splitIntoSentences(text);
    const result: string[] = [];

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      const words = sentence.split(/\s+/);

      // Short sentences (< 5 words) - might expand
      if (words.length < 5 && Math.random() < 0.4) {
        result.push(this.expandSentence(sentence));
      }
      // Long sentences (> 15 words) - might split
      else if (words.length > 15 && Math.random() < 0.4) {
        result.push(...this.splitLongSentence(sentence));
      }
      // Medium sentences - keep as is or slightly modify
      else {
        result.push(sentence);
      }
    }

    return result.join(' ');
  }

  /**
   * إضافة تنوع بلاغي
   * Requirements: 3.3
   */
  addRhetoricalVariety(text: string): string {
    const random = Math.random();

    // Convert to question (استفهام)
    if (random < 0.25) {
      return this.convertToQuestion(text);
    }
    // Add exclamation (تعجب)
    else if (random < 0.5) {
      return this.addExclamation(text);
    }
    // Add emphasis
    else if (random < 0.75) {
      return this.addEmphasis(text);
    }

    return text;
  }

  /**
   * تغيير صيغة الجملة
   * Requirements: 11.4
   */
  changeSentenceVoice(sentence: string): string {
    // Simple voice change patterns
    const activeToPassive: [RegExp, string][] = [
      [/يكتب\s+(\S+)\s+(\S+)/g, 'يُكتب $2 بواسطة $1'],
      [/يقرأ\s+(\S+)\s+(\S+)/g, 'يُقرأ $2 بواسطة $1'],
      [/يستخدم\s+(\S+)\s+(\S+)/g, 'يُستخدم $2 بواسطة $1'],
    ];

    let result = sentence;
    for (const [pattern, replacement] of activeToPassive) {
      if (pattern.test(result)) {
        result = result.replace(pattern, replacement);
        break;
      }
    }

    return result;
  }

  /**
   * دمج أو تقسيم الجمل
   * Requirements: 11.5
   */
  mergeSentences(sentence1: string, sentence2: string): string {
    const connectors = [
      'و',
      'كما أن',
      'بالإضافة إلى ذلك',
      'فضلاً عن ذلك',
      'علاوة على ذلك',
    ];

    const connector = connectors[Math.floor(Math.random() * connectors.length)];

    // Remove period from first sentence
    const s1 = sentence1.replace(/[.،؟!]$/, '');
    // Make second sentence start with lowercase (if applicable)
    const s2 = sentence2.charAt(0).toLowerCase() + sentence2.slice(1);

    return `${s1}، ${connector} ${s2}`;
  }

  /**
   * تقسيم جملة طويلة
   */
  splitLongSentence(sentence: string): string[] {
    const words = sentence.split(/\s+/);

    if (words.length <= 10) {
      return [sentence];
    }

    // Find a good split point (after a connector or comma)
    const midPoint = Math.floor(words.length / 2);
    const splitRange = [midPoint - 3, midPoint + 3];

    let splitIndex = midPoint;
    for (let i = splitRange[0]; i <= splitRange[1]; i++) {
      if (i >= 0 && i < words.length) {
        const word = words[i];
        if (['و', 'أو', 'ثم', 'لكن', 'غير', 'إلا'].includes(word)) {
          splitIndex = i;
          break;
        }
      }
    }

    const first = words.slice(0, splitIndex).join(' ') + '.';
    const second = words.slice(splitIndex).join(' ');

    return [first, second];
  }

  /**
   * توسيع جملة قصيرة
   */
  private expandSentence(sentence: string): string {
    const expansions = [
      'من المهم أن نذكر أن ',
      'تجدر الإشارة إلى أن ',
      'من الجدير بالذكر أن ',
      'لا بد من التأكيد على أن ',
    ];

    const expansion = expansions[Math.floor(Math.random() * expansions.length)];
    return expansion + sentence;
  }

  /**
   * تحويل إلى سؤال
   */
  private convertToQuestion(text: string): string {
    const questionStarters = [
      'هل تعلم أن ',
      'هل فكرت يوماً في أن ',
      'ما رأيك في أن ',
      'ألم تلاحظ أن ',
    ];

    const starter =
      questionStarters[Math.floor(Math.random() * questionStarters.length)];
    const cleanText = text.replace(/[.،؟!]$/, '');

    return starter + cleanText + '؟';
  }

  /**
   * إضافة تعجب
   */
  private addExclamation(text: string): string {
    const exclamations = [
      'يا له من أمر رائع! ',
      'من المدهش أن ',
      'حقاً! ',
      'لا يصدق! ',
    ];

    const exclamation =
      exclamations[Math.floor(Math.random() * exclamations.length)];
    return exclamation + text;
  }

  /**
   * إضافة تأكيد
   */
  private addEmphasis(text: string): string {
    const emphases = ['بالتأكيد، ', 'من المؤكد أن ', 'لا شك أن ', 'بلا ريب، '];

    const emphasis = emphases[Math.floor(Math.random() * emphases.length)];
    return emphasis + text;
  }

  /**
   * تغيير بنية الجملة
   */
  private varySentenceStructure(sentence: string): string {
    // Try to move adverbs or prepositional phrases
    const patterns: [RegExp, string][] = [
      // Move time expressions to beginning
      [/(.+)\s+(اليوم|غداً|أمس|دائماً|أحياناً)([.،؟!]?)$/, '$2، $1$3'],
      // Move manner expressions
      [/(.+)\s+(بسرعة|ببطء|بسهولة|بصعوبة)([.،؟!]?)$/, '$2، $1$3'],
    ];

    for (const [pattern, replacement] of patterns) {
      if (pattern.test(sentence)) {
        return sentence.replace(pattern, replacement);
      }
    }

    return sentence;
  }

  /**
   * تطبيق تنويع بلاغي
   */
  private applyRhetoricalVariation(sentence: string, index: number): string {
    const variations = [
      (s: string) => this.convertToQuestion(s),
      (s: string) => this.addExclamation(s),
      (s: string) => this.addEmphasis(s),
      (s: string) => this.varySentenceStructure(s),
      (s: string) => this.changeSentenceVoice(s),
    ];

    const variation = variations[index % variations.length];
    return variation(sentence);
  }

  /**
   * تقسيم النص إلى جمل
   */
  private splitIntoSentences(text: string): string[] {
    // Split on Arabic and English sentence endings
    return text.split(/(?<=[.،؟!])\s+/).filter((s) => s.trim().length > 0);
  }

  /**
   * إعادة صياغة نص كامل مع تقرير
   */
  rephraseWithReport(
    text: string,
    options?: RephrasingOptions
  ): RephrasingResult {
    const original = text;
    const rephrased = this.rephraseParagraph(text, options);

    // Count changes
    const originalWords = original.split(/\s+/);
    const rephrasedWords = rephrased.split(/\s+/);

    let changes = 0;
    const synonymsUsed: string[] = [];

    for (
      let i = 0;
      i < Math.min(originalWords.length, rephrasedWords.length);
      i++
    ) {
      if (originalWords[i] !== rephrasedWords[i]) {
        changes++;
        const cleanOriginal = originalWords[i].replace(/[^\u0600-\u06FF]/g, '');
        const cleanRephrased = rephrasedWords[i].replace(
          /[^\u0600-\u06FF]/g,
          ''
        );

        if (this.getSynonyms(cleanOriginal).includes(cleanRephrased)) {
          synonymsUsed.push(`${cleanOriginal} → ${cleanRephrased}`);
        }
      }
    }

    return {
      original,
      rephrased,
      changes,
      synonymsUsed,
    };
  }

  /**
   * حساب نسبة التغيير
   */
  calculateChangeRate(original: string, rephrased: string): number {
    const originalWords = original.split(/\s+/);
    const rephrasedWords = rephrased.split(/\s+/);

    let differences = 0;
    const maxLength = Math.max(originalWords.length, rephrasedWords.length);

    for (let i = 0; i < maxLength; i++) {
      if (originalWords[i] !== rephrasedWords[i]) {
        differences++;
      }
    }

    return differences / maxLength;
  }

  /**
   * إعادة تحميل المرادفات
   */
  reloadSynonyms(): void {
    synonymsCache = null;
    this.synonyms = loadSynonyms();
    this.allSynonymsFlat = this.flattenSynonyms();
  }
}

// Export singleton instance
export const rephraser = new Rephraser();
