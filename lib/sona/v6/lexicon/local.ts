/**
 * Local Lexicon - القاموس المحلي
 * Fallback للملفات المحلية عندما لا تتوفر APIs خارجية
 */

import {
  LexiconEntry,
  IdiomEntry,
  WordType,
  Tense,
  ConnectorEntry,
} from '../types';

// ============================================
// بيانات القاموس المحلي المدمجة
// ============================================

/**
 * كلمات أساسية مدمجة للاستخدام الفوري
 */
const EMBEDDED_WORDS: Record<string, LexiconEntry> = {
  // أفعال شائعة
  يحتفل: {
    word: 'يحتفل',
    type: 'verb',
    synonyms: ['يبتهج', 'يفرح', 'يهنئ'],
    frequency: 90,
    category: 'celebration',
  },
  يولد: {
    word: 'يولد',
    type: 'verb',
    synonyms: ['يأتي للحياة', 'يُخلق'],
    frequency: 85,
    category: 'birth',
  },
  يكبر: {
    word: 'يكبر',
    type: 'verb',
    synonyms: ['ينمو', 'يتطور', 'يزداد'],
    frequency: 80,
    category: 'growth',
  },
  يتمنى: {
    word: 'يتمنى',
    type: 'verb',
    synonyms: ['يرجو', 'يأمل', 'يطمح'],
    frequency: 85,
    category: 'wishes',
  },
  يحب: {
    word: 'يحب',
    type: 'verb',
    synonyms: ['يعشق', 'يهوى', 'يود'],
    frequency: 95,
    category: 'emotions',
  },
  يفرح: {
    word: 'يفرح',
    type: 'verb',
    synonyms: ['يسعد', 'يبتهج', 'يغتبط'],
    frequency: 90,
    category: 'emotions',
  },

  // أسماء شائعة
  عيد: {
    word: 'عيد',
    type: 'noun',
    synonyms: ['مناسبة', 'احتفال', 'ذكرى'],
    frequency: 95,
    category: 'celebration',
  },
  ميلاد: {
    word: 'ميلاد',
    type: 'noun',
    synonyms: ['ولادة', 'مولد'],
    frequency: 90,
    category: 'birth',
  },
  عمر: {
    word: 'عمر',
    type: 'noun',
    synonyms: ['سن', 'حياة', 'أيام'],
    frequency: 85,
    category: 'age',
  },
  سنة: {
    word: 'سنة',
    type: 'noun',
    synonyms: ['عام', 'حول'],
    frequency: 95,
    category: 'time',
  },
  حياة: {
    word: 'حياة',
    type: 'noun',
    synonyms: ['عيش', 'وجود', 'دنيا'],
    frequency: 90,
    category: 'life',
  },
  سعادة: {
    word: 'سعادة',
    type: 'noun',
    synonyms: ['فرح', 'بهجة', 'سرور'],
    frequency: 85,
    category: 'emotions',
  },
  حب: {
    word: 'حب',
    type: 'noun',
    synonyms: ['عشق', 'هوى', 'ود'],
    frequency: 90,
    category: 'emotions',
  },
  أمل: {
    word: 'أمل',
    type: 'noun',
    synonyms: ['رجاء', 'تفاؤل', 'طموح'],
    frequency: 80,
    category: 'emotions',
  },
  نجاح: {
    word: 'نجاح',
    type: 'noun',
    synonyms: ['توفيق', 'فوز', 'تحقيق'],
    frequency: 85,
    category: 'success',
  },
  صحة: {
    word: 'صحة',
    type: 'noun',
    synonyms: ['عافية', 'سلامة'],
    frequency: 90,
    category: 'health',
  },

  // صفات شائعة
  سعيد: {
    word: 'سعيد',
    type: 'adjective',
    synonyms: ['مسرور', 'فرح', 'مبتهج'],
    frequency: 95,
    category: 'emotions',
  },
  جميل: {
    word: 'جميل',
    type: 'adjective',
    synonyms: ['رائع', 'بديع', 'حسن'],
    frequency: 90,
    category: 'beauty',
  },
  مبارك: {
    word: 'مبارك',
    type: 'adjective',
    synonyms: ['ميمون', 'سعيد', 'طيب'],
    frequency: 85,
    category: 'blessing',
  },
  رائع: {
    word: 'رائع',
    type: 'adjective',
    synonyms: ['مذهل', 'عظيم', 'ممتاز'],
    frequency: 90,
    category: 'quality',
  },
  خاص: {
    word: 'خاص',
    type: 'adjective',
    synonyms: ['مميز', 'فريد', 'استثنائي'],
    frequency: 85,
    category: 'special',
  },
  جديد: {
    word: 'جديد',
    type: 'adjective',
    synonyms: ['حديث', 'طازج', 'مستحدث'],
    frequency: 90,
    category: 'newness',
  },
};

/**
 * مرادفات مدمجة
 */
const EMBEDDED_SYNONYMS: Record<string, string[]> = {
  سعيد: ['مسرور', 'فرح', 'مبتهج', 'منشرح', 'مغتبط'],
  جميل: ['رائع', 'بديع', 'حسن', 'أنيق', 'فاتن'],
  كبير: ['ضخم', 'عظيم', 'هائل', 'واسع', 'فسيح'],
  صغير: ['ضئيل', 'قليل', 'يسير', 'طفيف', 'محدود'],
  سريع: ['عاجل', 'خاطف', 'متسارع', 'فوري'],
  بطيء: ['متأني', 'متمهل', 'رويد', 'هادئ'],
  قوي: ['متين', 'صلب', 'راسخ', 'شديد'],
  ضعيف: ['واهن', 'هزيل', 'خائر', 'متهالك'],
  يحب: ['يعشق', 'يهوى', 'يود', 'يميل'],
  يكره: ['يبغض', 'يمقت', 'ينفر', 'يستاء'],
  يفرح: ['يسعد', 'يبتهج', 'يغتبط', 'ينشرح'],
  يحزن: ['يأسى', 'يكتئب', 'يغتم', 'يتألم'],
};

/**
 * تعبيرات اصطلاحية مدمجة
 */
const EMBEDDED_IDIOMS: IdiomEntry[] = [
  {
    expression: 'كل عام وأنت بخير',
    meaning: 'تهنئة بمناسبة سعيدة',
    usage: 'both',
    examples: ['كل عام وأنت بخير بمناسبة عيد ميلادك'],
    category: 'celebration',
  },
  {
    expression: 'عقبال مئة سنة',
    meaning: 'دعاء بطول العمر',
    usage: 'informal',
    examples: ['عقبال مئة سنة يا صديقي'],
    category: 'birthday',
  },
  {
    expression: 'أطال الله عمرك',
    meaning: 'دعاء بطول العمر',
    usage: 'formal',
    examples: ['أطال الله عمرك ومتعك بالصحة'],
    category: 'wishes',
  },
  {
    expression: 'بارك الله فيك',
    meaning: 'دعاء بالبركة',
    usage: 'both',
    examples: ['بارك الله فيك وفي عمرك'],
    category: 'blessing',
  },
  {
    expression: 'من العايدين',
    meaning: 'تهنئة بالعيد',
    usage: 'informal',
    examples: ['من العايدين الفايزين'],
    category: 'celebration',
  },
];

/**
 * روابط مدمجة
 */
const EMBEDDED_CONNECTORS: ConnectorEntry[] = [
  {
    word: 'و',
    type: 'addition',
    usage: 'للربط بين جملتين',
    alternatives: ['كما', 'أيضاً', 'بالإضافة'],
  },
  {
    word: 'لكن',
    type: 'contrast',
    usage: 'للتناقض',
    alternatives: ['غير أن', 'إلا أن', 'بيد أن'],
  },
  {
    word: 'لذلك',
    type: 'result',
    usage: 'للنتيجة',
    alternatives: ['وبالتالي', 'ومن ثم', 'لهذا'],
  },
  {
    word: 'مثلاً',
    type: 'example',
    usage: 'للتمثيل',
    alternatives: ['على سبيل المثال', 'كمثال'],
  },
  {
    word: 'عندما',
    type: 'time',
    usage: 'للزمن',
    alternatives: ['حين', 'لما', 'وقت'],
  },
  {
    word: 'إذا',
    type: 'condition',
    usage: 'للشرط',
    alternatives: ['لو', 'إن', 'متى'],
  },
];

// ============================================
// فئة القاموس المحلي
// ============================================

export class LocalLexicon {
  private words: Map<string, LexiconEntry>;
  private synonyms: Map<string, string[]>;
  private idioms: IdiomEntry[];
  private connectors: ConnectorEntry[];
  private fileDataLoaded = false;

  constructor() {
    // تهيئة بالبيانات المدمجة
    this.words = new Map(Object.entries(EMBEDDED_WORDS));
    this.synonyms = new Map(Object.entries(EMBEDDED_SYNONYMS));
    this.idioms = [...EMBEDDED_IDIOMS];
    this.connectors = [...EMBEDDED_CONNECTORS];
  }

  /**
   * تحميل البيانات من الملفات المحلية
   */
  async loadFromFiles(): Promise<void> {
    if (this.fileDataLoaded) return;

    try {
      // تحميل في بيئة Node.js فقط
      if (typeof window === 'undefined') {
        const fs = await import('fs/promises');
        const path = await import('path');
        const basePath = path.join(process.cwd(), 'data/sona/lexicon');

        // تحميل الكلمات
        try {
          const wordsContent = await fs.readFile(
            path.join(basePath, 'words.json'),
            'utf-8'
          );
          const wordsData = JSON.parse(wordsContent);
          this.parseWordsFile(wordsData);
        } catch (e) {
          console.warn('Could not load words.json, using embedded data');
        }

        // تحميل المرادفات
        try {
          const synonymsContent = await fs.readFile(
            path.join(basePath, 'synonyms.json'),
            'utf-8'
          );
          const synonymsData = JSON.parse(synonymsContent);
          this.parseSynonymsFile(synonymsData);
        } catch (e) {
          console.warn('Could not load synonyms.json, using embedded data');
        }

        // تحميل التعبيرات
        try {
          const idiomsContent = await fs.readFile(
            path.join(basePath, 'idioms.json'),
            'utf-8'
          );
          const idiomsData = JSON.parse(idiomsContent);
          if (idiomsData.idioms) {
            this.idioms = [...this.idioms, ...idiomsData.idioms];
          }
        } catch (e) {
          console.warn('Could not load idioms.json, using embedded data');
        }
      }

      this.fileDataLoaded = true;
    } catch (error) {
      console.error('Error loading local lexicon files:', error);
    }
  }

  /**
   * تحليل ملف الكلمات
   */
  private parseWordsFile(data: any): void {
    if (!data.words) return;

    const categories = [
      'nouns',
      'verbs',
      'adjectives',
      'adverbs',
      'connectors',
    ];
    const typeMap: Record<string, WordType> = {
      nouns: 'noun',
      verbs: 'verb',
      adjectives: 'adjective',
      adverbs: 'adverb',
      connectors: 'connector',
    };

    for (const category of categories) {
      if (data.words[category]) {
        for (const [subCategory, wordList] of Object.entries(
          data.words[category]
        )) {
          if (Array.isArray(wordList)) {
            for (const word of wordList) {
              if (!this.words.has(word)) {
                this.words.set(word, {
                  word,
                  type: typeMap[category],
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
  }

  /**
   * تحليل ملف المرادفات
   */
  private parseSynonymsFile(data: any): void {
    if (!data.synonyms) return;

    for (const [word, syns] of Object.entries(data.synonyms)) {
      if (Array.isArray(syns)) {
        const existing = this.synonyms.get(word) || [];
        this.synonyms.set(word, [
          ...new Set([...existing, ...(syns as string[])]),
        ]);
      }
    }
  }

  /**
   * البحث عن كلمة
   */
  lookup(word: string): LexiconEntry | null {
    const entry = this.words.get(word);
    if (entry) {
      const synonyms = this.synonyms.get(word) || [];
      return { ...entry, synonyms };
    }
    return null;
  }

  /**
   * الحصول على مرادفات
   */
  getSynonyms(word: string): string[] {
    return this.synonyms.get(word) || [];
  }

  /**
   * الحصول على تعبيرات اصطلاحية
   */
  getIdioms(category?: string): IdiomEntry[] {
    if (category) {
      return this.idioms.filter((i) => i.category === category);
    }
    return this.idioms;
  }

  /**
   * الحصول على روابط
   */
  getConnectors(type?: ConnectorEntry['type']): ConnectorEntry[] {
    if (type) {
      return this.connectors.filter((c) => c.type === type);
    }
    return this.connectors;
  }

  /**
   * الحصول على كلمة عشوائية
   */
  getRandomWord(type?: WordType, category?: string): string {
    const matching: string[] = [];

    for (const [word, entry] of this.words) {
      if (
        (!type || entry.type === type) &&
        (!category || entry.category === category)
      ) {
        matching.push(word);
      }
    }

    if (matching.length === 0) return '';
    return matching[Math.floor(Math.random() * matching.length)];
  }

  /**
   * اقتراح بديل لكلمة
   */
  suggestAlternative(word: string): string {
    const synonyms = this.getSynonyms(word);
    if (synonyms.length === 0) return word;
    return synonyms[Math.floor(Math.random() * synonyms.length)];
  }

  /**
   * تصريف فعل بسيط
   */
  conjugate(verb: string, tense: Tense): string {
    switch (tense) {
      case 'future':
        return `سـ${verb}`;
      case 'imperative':
        if (verb.startsWith('ي')) {
          return verb.substring(1);
        }
        return verb;
      default:
        return verb;
    }
  }

  /**
   * الحصول على إحصائيات
   */
  getStats(): {
    words: number;
    synonyms: number;
    idioms: number;
    connectors: number;
  } {
    return {
      words: this.words.size,
      synonyms: this.synonyms.size,
      idioms: this.idioms.length,
      connectors: this.connectors.length,
    };
  }
}

// ============================================
// تصدير instance واحد
// ============================================

export const localLexicon = new LocalLexicon();
export default localLexicon;
