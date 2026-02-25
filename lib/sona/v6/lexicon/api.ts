/**
 * Lexicon API - واجهة القواميس العربية
 * يدعم القواميس الخارجية (Almaany) والملفات المحلية كـ fallback
 */

import { LexiconEntry, IdiomEntry, WordType, VerbForms, Tense } from '../types';

// ============================================
// واجهة Lexicon API
// ============================================

export interface LexiconAPI {
  lookup(word: string): Promise<LexiconEntry | null>;
  getSynonyms(word: string): Promise<string[]>;
  getAntonyms(word: string): Promise<string[]>;
  conjugate(verb: string, tense: Tense): Promise<string>;
  getIdioms(context: string): Promise<IdiomEntry[]>;
  suggestAlternative(word: string, context: string): Promise<string>;
  getRandomWord(type: WordType, category?: string): Promise<string>;
}

// ============================================
// تنفيذ Lexicon API
// ============================================

export class ArabicLexiconAPI implements LexiconAPI {
  private localWords: Map<string, LexiconEntry> = new Map();
  private localSynonyms: Map<string, string[]> = new Map();
  private localIdioms: IdiomEntry[] = [];
  private initialized = false;

  constructor() {
    this.initializeLocal();
  }

  /**
   * تهيئة البيانات المحلية
   */
  private async initializeLocal(): Promise<void> {
    if (this.initialized) return;

    try {
      // تحميل الكلمات
      const wordsData = await this.loadLocalFile('words.json');
      if (wordsData?.words) {
        this.parseWords(wordsData.words);
      }

      // تحميل المرادفات
      const synonymsData = await this.loadLocalFile('synonyms.json');
      if (synonymsData?.synonyms) {
        this.parseSynonyms(synonymsData.synonyms);
      }

      // تحميل التعبيرات الاصطلاحية
      const idiomsData = await this.loadLocalFile('idioms.json');
      if (idiomsData?.idioms) {
        this.localIdioms = idiomsData.idioms;
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize local lexicon:', error);
    }
  }

  /**
   * تحميل ملف محلي
   */
  private async loadLocalFile(filename: string): Promise<any> {
    try {
      // في بيئة Node.js
      if (typeof window === 'undefined') {
        const fs = await import('fs/promises');
        const path = await import('path');
        const filePath = path.join(
          process.cwd(),
          'data/sona/lexicon',
          filename
        );
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
      }
      // في بيئة المتصفح
      const response = await fetch(`/data/sona/lexicon/${filename}`);
      return await response.json();
    } catch (error) {
      console.error(`Failed to load ${filename}:`, error);
      return null;
    }
  }

  /**
   * تحليل الكلمات من البيانات المحلية
   */
  private parseWords(words: any): void {
    const categories = [
      'nouns',
      'verbs',
      'adjectives',
      'adverbs',
      'connectors',
    ];

    for (const category of categories) {
      if (words[category]) {
        for (const [subCategory, wordList] of Object.entries(words[category])) {
          if (Array.isArray(wordList)) {
            for (const word of wordList) {
              this.localWords.set(word, {
                word,
                type: this.categoryToType(category),
                synonyms: [],
                frequency: 50,
                category: subCategory,
              });
            }
          }
        }
      }
    }
  }

  /**
   * تحويل الفئة إلى نوع الكلمة
   */
  private categoryToType(category: string): WordType {
    const mapping: Record<string, WordType> = {
      nouns: 'noun',
      verbs: 'verb',
      adjectives: 'adjective',
      adverbs: 'adverb',
      connectors: 'connector',
    };
    return mapping[category] || 'noun';
  }

  /**
   * تحليل المرادفات من البيانات المحلية
   */
  private parseSynonyms(synonyms: any): void {
    for (const [word, syns] of Object.entries(synonyms)) {
      if (Array.isArray(syns)) {
        this.localSynonyms.set(word, syns as string[]);
      }
    }
  }

  /**
   * البحث عن كلمة
   */
  async lookup(word: string): Promise<LexiconEntry | null> {
    await this.initializeLocal();

    // البحث في القاموس المحلي أولاً
    const localEntry = this.localWords.get(word);
    if (localEntry) {
      // إضافة المرادفات إذا وجدت
      const synonyms = this.localSynonyms.get(word) || [];
      return { ...localEntry, synonyms };
    }

    // محاولة البحث في API خارجي (Almaany)
    try {
      const externalEntry = await this.lookupExternal(word);
      if (externalEntry) {
        return externalEntry;
      }
    } catch (error) {
      console.warn('External lookup failed, using local only');
    }

    return null;
  }

  /**
   * البحث في API خارجي (Almaany)
   */
  private async lookupExternal(word: string): Promise<LexiconEntry | null> {
    // Almaany لا يوفر API عام، لذا نستخدم البيانات المحلية فقط
    // يمكن إضافة APIs أخرى هنا في المستقبل
    return null;
  }

  /**
   * الحصول على مرادفات كلمة
   */
  async getSynonyms(word: string): Promise<string[]> {
    await this.initializeLocal();

    // البحث في المرادفات المحلية
    const localSynonyms = this.localSynonyms.get(word);
    if (localSynonyms && localSynonyms.length > 0) {
      return localSynonyms;
    }

    // البحث في الكلمات المشابهة
    const entry = await this.lookup(word);
    if (entry?.synonyms && entry.synonyms.length > 0) {
      return entry.synonyms;
    }

    return [];
  }

  /**
   * الحصول على أضداد كلمة
   */
  async getAntonyms(word: string): Promise<string[]> {
    await this.initializeLocal();

    const entry = await this.lookup(word);
    return entry?.antonyms || [];
  }

  /**
   * تصريف الفعل
   */
  async conjugate(verb: string, tense: Tense): Promise<string> {
    await this.initializeLocal();

    const entry = await this.lookup(verb);
    if (entry?.forms) {
      switch (tense) {
        case 'past':
          return entry.forms.past || verb;
        case 'present':
          return entry.forms.present || verb;
        case 'future':
          return `سـ${entry.forms.present || verb}`;
        case 'imperative':
          return entry.forms.imperative || verb;
        default:
          return verb;
      }
    }

    // تصريف بسيط للأفعال غير الموجودة
    return this.simpleConjugate(verb, tense);
  }

  /**
   * تصريف بسيط للأفعال
   */
  private simpleConjugate(verb: string, tense: Tense): string {
    switch (tense) {
      case 'future':
        return `سـ${verb}`;
      case 'imperative':
        // إزالة الياء من بداية الفعل المضارع
        if (verb.startsWith('ي')) {
          return verb.substring(1);
        }
        return verb;
      default:
        return verb;
    }
  }

  /**
   * الحصول على تعبيرات اصطلاحية مناسبة للسياق
   */
  async getIdioms(context: string): Promise<IdiomEntry[]> {
    await this.initializeLocal();

    const contextWords = context.toLowerCase().split(/\s+/);
    const relevantIdioms: IdiomEntry[] = [];

    for (const idiom of this.localIdioms) {
      // التحقق من تطابق الفئة أو الكلمات
      const idiomWords = idiom.expression.toLowerCase().split(/\s+/);
      const hasMatch = contextWords.some(
        (word) =>
          idiomWords.includes(word) ||
          idiom.category.toLowerCase().includes(word)
      );

      if (hasMatch) {
        relevantIdioms.push(idiom);
      }
    }

    // إرجاع أفضل 5 تعبيرات
    return relevantIdioms.slice(0, 5);
  }

  /**
   * اقتراح بديل لكلمة في سياق معين
   */
  async suggestAlternative(word: string, context: string): Promise<string> {
    const synonyms = await this.getSynonyms(word);

    if (synonyms.length === 0) {
      return word;
    }

    // اختيار مرادف عشوائي
    const randomIndex = Math.floor(Math.random() * synonyms.length);
    return synonyms[randomIndex];
  }

  /**
   * الحصول على كلمة عشوائية من نوع معين
   */
  async getRandomWord(type: WordType, category?: string): Promise<string> {
    await this.initializeLocal();

    const matchingWords: string[] = [];

    for (const [word, entry] of this.localWords) {
      if (entry.type === type) {
        if (!category || entry.category === category) {
          matchingWords.push(word);
        }
      }
    }

    if (matchingWords.length === 0) {
      return '';
    }

    const randomIndex = Math.floor(Math.random() * matchingWords.length);
    return matchingWords[randomIndex];
  }

  /**
   * الحصول على كلمات حسب الفئة
   */
  async getWordsByCategory(category: string): Promise<string[]> {
    await this.initializeLocal();

    const words: string[] = [];

    for (const [word, entry] of this.localWords) {
      if (entry.category === category) {
        words.push(word);
      }
    }

    return words;
  }

  /**
   * البحث عن كلمات تحتوي على نص معين
   */
  async searchWords(query: string): Promise<LexiconEntry[]> {
    await this.initializeLocal();

    const results: LexiconEntry[] = [];

    for (const [word, entry] of this.localWords) {
      if (word.includes(query)) {
        results.push(entry);
      }
    }

    return results.slice(0, 20);
  }

  /**
   * الحصول على إحصائيات القاموس
   */
  async getStats(): Promise<{
    totalWords: number;
    totalSynonyms: number;
    totalIdioms: number;
    categories: string[];
  }> {
    await this.initializeLocal();

    const categories = new Set<string>();
    for (const entry of this.localWords.values()) {
      if (entry.category) {
        categories.add(entry.category);
      }
    }

    return {
      totalWords: this.localWords.size,
      totalSynonyms: this.localSynonyms.size,
      totalIdioms: this.localIdioms.length,
      categories: Array.from(categories),
    };
  }
}

// ============================================
// تصدير instance واحد
// ============================================

export const lexiconAPI = new ArabicLexiconAPI();
