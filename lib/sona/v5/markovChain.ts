/**
 * SONA v5 - Markov Chain Text Generator
 * مولد نصوص عربية باستخدام سلاسل ماركوف
 *
 * يتعلم من النصوص العربية ويولد جمل جديدة طبيعية
 */

export interface MarkovState {
  word: string;
  nextWords: Map<string, number>;
  totalCount: number;
}

export interface MarkovModel {
  states: Map<string, MarkovState>;
  startWords: string[];
  endWords: Set<string>;
  order: number;
}

export class ArabicMarkovChain {
  private model: MarkovModel;
  private trained: boolean = false;

  constructor(order: number = 2) {
    this.model = {
      states: new Map(),
      startWords: [],
      endWords: new Set(),
      order,
    };
  }

  /**
   * تدريب النموذج على نص
   */
  train(text: string): void {
    const sentences = this.splitIntoSentences(text);

    for (const sentence of sentences) {
      const words = this.tokenize(sentence);
      if (words.length < 3) continue;

      // إضافة كلمة البداية
      this.model.startWords.push(words[0]);

      // إضافة كلمة النهاية
      this.model.endWords.add(words[words.length - 1]);

      // بناء السلسلة
      for (let i = 0; i < words.length - 1; i++) {
        const currentWord = words[i];
        const nextWord = words[i + 1];

        if (!this.model.states.has(currentWord)) {
          this.model.states.set(currentWord, {
            word: currentWord,
            nextWords: new Map(),
            totalCount: 0,
          });
        }

        const state = this.model.states.get(currentWord)!;
        const currentCount = state.nextWords.get(nextWord) || 0;
        state.nextWords.set(nextWord, currentCount + 1);
        state.totalCount++;
      }
    }

    this.trained = true;
  }

  /**
   * توليد جملة جديدة
   */
  generate(maxWords: number = 30, startWord?: string): string {
    if (!this.trained || this.model.startWords.length === 0) {
      return '';
    }

    const words: string[] = [];

    // اختيار كلمة البداية
    let currentWord = startWord || this.getRandomStartWord();
    words.push(currentWord);

    // توليد الكلمات التالية
    for (let i = 0; i < maxWords - 1; i++) {
      const state = this.model.states.get(currentWord);

      if (!state || state.nextWords.size === 0) {
        break;
      }

      const nextWord = this.selectNextWord(state);
      words.push(nextWord);
      currentWord = nextWord;

      // التوقف عند كلمة نهاية
      if (this.model.endWords.has(nextWord) && words.length >= 5) {
        break;
      }
    }

    return words.join(' ');
  }

  /**
   * توليد فقرة كاملة
   */
  generateParagraph(sentenceCount: number = 3): string {
    const sentences: string[] = [];

    for (let i = 0; i < sentenceCount; i++) {
      const sentence = this.generate(25);
      if (sentence) {
        sentences.push(this.capitalizeSentence(sentence));
      }
    }

    return sentences.join(' ');
  }

  /**
   * تقسيم النص إلى جمل
   */
  private splitIntoSentences(text: string): string[] {
    return text
      .split(/[.!؟،\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10);
  }

  /**
   * تقسيم الجملة إلى كلمات
   */
  private tokenize(sentence: string): string[] {
    return sentence
      .replace(/[^\u0600-\u06FF\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 0);
  }

  /**
   * اختيار كلمة بداية عشوائية
   */
  private getRandomStartWord(): string {
    const index = Math.floor(Math.random() * this.model.startWords.length);
    return this.model.startWords[index];
  }

  /**
   * اختيار الكلمة التالية بناءً على الاحتمالات
   */
  private selectNextWord(state: MarkovState): string {
    const random = Math.random() * state.totalCount;
    let cumulative = 0;

    for (const [word, count] of state.nextWords) {
      cumulative += count;
      if (random <= cumulative) {
        return word;
      }
    }

    // Fallback
    const words = Array.from(state.nextWords.keys());
    return words[Math.floor(Math.random() * words.length)];
  }

  /**
   * تكبير أول حرف في الجملة (للعربية: إضافة نقطة)
   */
  private capitalizeSentence(sentence: string): string {
    if (
      !sentence.endsWith('.') &&
      !sentence.endsWith('؟') &&
      !sentence.endsWith('!')
    ) {
      return sentence + '.';
    }
    return sentence;
  }

  /**
   * الحصول على حجم النموذج
   */
  getModelSize(): number {
    return this.model.states.size;
  }

  /**
   * هل النموذج مدرب؟
   */
  isTrained(): boolean {
    return this.trained;
  }
}

// نسخة مُدربة مسبقاً
export const arabicMarkov = new ArabicMarkovChain(2);
