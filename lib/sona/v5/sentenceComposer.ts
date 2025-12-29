/**
 * SONA v5 - Smart Sentence Composer
 * مركب الجمل الذكي
 *
 * يبني جمل عربية طبيعية ومتنوعة من مكونات أساسية
 */

import {
  getRandomTransition,
  getRandomDescriptive,
  getRandomLinking,
  DESCRIPTIVE_SENTENCES,
  LINKING_PHRASES,
} from './massivePhraseBank';

// ============================================
// أنماط الجمل
// ============================================

export type SentencePattern =
  | 'statement' // جملة خبرية
  | 'question' // جملة استفهامية
  | 'imperative' // جملة أمرية
  | 'exclamatory' // جملة تعجبية
  | 'conditional'; // جملة شرطية

// ============================================
// مكونات الجمل
// ============================================

const SENTENCE_STARTERS = {
  statement: [
    'يُعد',
    'يُعتبر',
    'يتميز',
    'يشتهر',
    'يُصنف',
    'يندرج',
    'يتضمن',
    'يشمل',
    'يتسم',
    'يتحلى',
    'يمتاز',
    'يتفرد',
    'يبرز',
    'يظهر',
    'يتجلى',
    'يتبدى',
    'نلاحظ أن',
    'يتضح أن',
    'نستنتج أن',
    'يتبين أن',
    'نجد أن',
    'يظهر أن',
    'من المعروف أن',
    'من الثابت أن',
    'من المؤكد أن',
    'من الواضح أن',
    'تشير الدراسات إلى أن',
    'يؤكد الخبراء أن',
    'تدل الأبحاث على أن',
  ],

  question: [
    'هل تعلم أن',
    'هل تساءلت يوماً',
    'ما الذي يجعل',
    'كيف يمكن',
    'لماذا يعتبر',
    'ما هي أهمية',
    'ما هو السر وراء',
    'كيف نفهم',
    'ما الفرق بين',
    'أين تكمن',
    'متى يجب',
    'من يستطيع',
  ],

  imperative: [
    'احرص على',
    'تأكد من',
    'لا تنسَ',
    'تذكر دائماً',
    'اهتم بـ',
    'ركز على',
    'اعمل على',
    'حاول أن',
    'ابدأ بـ',
    'استمر في',
    'طور',
    'حسّن',
    'عزز',
    'ادعم',
    'شجع',
  ],

  exclamatory: [
    'ما أجمل',
    'ما أروع',
    'كم هو رائع',
    'يا له من',
    'ما أعظم',
    'كم هو مدهش',
    'ما أكثر',
    'يا لروعة',
    'ما أبدع',
    'كم هو مميز',
  ],

  conditional: [
    'إذا كنت',
    'عندما تريد',
    'في حال',
    'لو أردت',
    'متى ما',
    'كلما',
    'حين',
    'عند',
    'إن كنت',
    'لو كان',
  ],
};

const SENTENCE_MIDDLES = {
  descriptive: [
    'بشكل كبير',
    'بصورة ملحوظة',
    'بطريقة مميزة',
    'بأسلوب فريد',
    'بدرجة عالية',
    'بشكل واضح',
    'بصورة جلية',
    'بطريقة رائعة',
    'بأسلوب متميز',
    'بشكل ملفت',
    'بصورة مبهرة',
    'بطريقة استثنائية',
  ],

  comparative: [
    'أكثر من',
    'أفضل من',
    'أهم من',
    'أكبر من',
    'أقوى من',
    'مثل',
    'كـ',
    'على غرار',
    'بالمقارنة مع',
    'مقارنة بـ',
  ],

  temporal: [
    'دائماً',
    'غالباً',
    'أحياناً',
    'عادةً',
    'في كثير من الأحيان',
    'من وقت لآخر',
    'بشكل مستمر',
    'باستمرار',
    'بانتظام',
    'يومياً',
  ],

  quantitative: [
    'كثيراً',
    'قليلاً',
    'بعض',
    'معظم',
    'جميع',
    'كل',
    'العديد من',
    'الكثير من',
    'بضع',
    'عدة',
    'مختلف',
  ],
};

const SENTENCE_ENDINGS = {
  positive: [
    'بشكل إيجابي',
    'بنجاح',
    'بتميز',
    'بامتياز',
    'بفعالية',
    'بكفاءة',
    'بجدارة',
    'باقتدار',
    'بإتقان',
    'بمهارة',
  ],

  negative: ['للأسف', 'مع الأسف', 'بشكل سلبي', 'دون جدوى', 'بصعوبة'],

  neutral: [
    'في هذا المجال',
    'في هذا السياق',
    'في هذا الإطار',
    'في هذا الشأن',
    'على هذا الصعيد',
    'في هذا الجانب',
    'من هذه الناحية',
    'في هذا الخصوص',
  ],

  conclusive: [
    'في نهاية المطاف',
    'في الختام',
    'أخيراً',
    'وأخيراً',
    'في النهاية',
    'ختاماً',
    'وفي الأخير',
    'وبذلك',
  ],
};

// ============================================
// فئة مركب الجمل
// ============================================

export class SentenceComposer {
  private usedStarters: Set<string> = new Set();
  private usedMiddles: Set<string> = new Set();
  private usedEndings: Set<string> = new Set();
  private lastPattern: SentencePattern | null = null;

  /**
   * تركيب جملة جديدة
   */
  compose(
    subject: string,
    pattern: SentencePattern = 'statement',
    options: {
      addTransition?: boolean;
      addDescriptor?: boolean;
      addEnding?: boolean;
    } = {}
  ): string {
    const parts: string[] = [];

    // إضافة انتقال إذا طُلب
    if (options.addTransition && this.lastPattern !== null) {
      parts.push(getRandomTransition());
    }

    // بداية الجملة
    const starter = this.getUnusedItem(
      SENTENCE_STARTERS[pattern],
      this.usedStarters
    );
    parts.push(starter);

    // الموضوع
    parts.push(subject);

    // وصف إضافي
    if (options.addDescriptor) {
      const middle = this.getUnusedItem(
        SENTENCE_MIDDLES.descriptive,
        this.usedMiddles
      );
      parts.push(middle);
    }

    // نهاية الجملة
    if (options.addEnding) {
      const ending = this.getUnusedItem(
        SENTENCE_ENDINGS.neutral,
        this.usedEndings
      );
      parts.push(ending);
    }

    this.lastPattern = pattern;
    return this.formatSentence(parts.join(' '), pattern);
  }

  /**
   * تركيب جملة وصفية
   */
  composeDescriptive(subject: string, attribute: string): string {
    const templates = [
      `يتميز ${subject} بـ${attribute}`,
      `من أبرز ما يميز ${subject} هو ${attribute}`,
      `يتسم ${subject} بـ${attribute}`,
      `${subject} يتحلى بـ${attribute}`,
      `ما يميز ${subject} هو ${attribute}`,
      `يمتاز ${subject} بـ${attribute}`,
      `${subject} معروف بـ${attribute}`,
      `يشتهر ${subject} بـ${attribute}`,
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * تركيب جملة مقارنة
   */
  composeComparative(
    subject1: string,
    subject2: string,
    aspect: string
  ): string {
    const templates = [
      `${subject1} أكثر ${aspect} من ${subject2}`,
      `يتفوق ${subject1} على ${subject2} في ${aspect}`,
      `بالمقارنة مع ${subject2}، ${subject1} أفضل في ${aspect}`,
      `${subject1} يتميز عن ${subject2} في ${aspect}`,
      `على عكس ${subject2}، ${subject1} يتمتع بـ${aspect}`,
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * تركيب جملة سببية
   */
  composeCausal(cause: string, effect: string): string {
    const templates = [
      `بسبب ${cause}، ${effect}`,
      `نتيجة لـ${cause}، ${effect}`,
      `${effect} وذلك بسبب ${cause}`,
      `يعود ${effect} إلى ${cause}`,
      `${cause} يؤدي إلى ${effect}`,
      `من نتائج ${cause} أن ${effect}`,
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * تركيب جملة شرطية
   */
  composeConditional(condition: string, result: string): string {
    const templates = [
      `إذا ${condition}، فإن ${result}`,
      `عندما ${condition}، ${result}`,
      `في حال ${condition}، ${result}`,
      `متى ما ${condition}، ${result}`,
      `كلما ${condition}، ${result}`,
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * تركيب جملة نصيحة
   */
  composeAdvice(action: string, reason?: string): string {
    const starters = [
      'ننصحكم بـ',
      'من المفيد أن',
      'يُستحسن أن',
      'من الأفضل أن',
      'احرصوا على',
      'لا تنسوا أن',
      'تذكروا دائماً أن',
      'من الحكمة أن',
    ];

    const starter = starters[Math.floor(Math.random() * starters.length)];
    let sentence = `${starter}${action}`;

    if (reason) {
      const connectors = ['لأن', 'حيث أن', 'إذ أن', 'فـ'];
      const connector =
        connectors[Math.floor(Math.random() * connectors.length)];
      sentence += `، ${connector}${reason}`;
    }

    return sentence + '.';
  }

  /**
   * تركيب جملة حقيقة
   */
  composeFact(fact: string): string {
    const starters = [
      'من الحقائق المثيرة أن',
      'من المعروف أن',
      'تشير الدراسات إلى أن',
      'أثبتت الأبحاث أن',
      'من الثابت علمياً أن',
      'يؤكد الخبراء أن',
      'من المؤكد أن',
    ];

    const starter = starters[Math.floor(Math.random() * starters.length)];
    return `${starter} ${fact}.`;
  }

  /**
   * تركيب فقرة كاملة
   */
  composeParagraph(
    topic: string,
    points: string[],
    options: {
      includeIntro?: boolean;
      includeConclusion?: boolean;
    } = {}
  ): string {
    const sentences: string[] = [];

    // مقدمة الفقرة
    if (options.includeIntro) {
      sentences.push(this.compose(topic, 'statement', { addDescriptor: true }));
    }

    // النقاط الرئيسية
    points.forEach((point, index) => {
      const addTransition = index > 0;
      const pattern: SentencePattern =
        index % 2 === 0 ? 'statement' : 'imperative';
      sentences.push(this.compose(point, pattern, { addTransition }));
    });

    // خاتمة الفقرة
    if (options.includeConclusion) {
      sentences.push(
        this.compose(topic, 'statement', {
          addTransition: true,
          addEnding: true,
        })
      );
    }

    return sentences.join(' ');
  }

  /**
   * تنسيق الجملة
   */
  private formatSentence(sentence: string, pattern: SentencePattern): string {
    // تنظيف المسافات
    sentence = sentence.replace(/\s+/g, ' ').trim();

    // إضافة علامة الترقيم المناسبة
    if (!sentence.match(/[.!؟،]$/)) {
      switch (pattern) {
        case 'question':
          sentence += '؟';
          break;
        case 'exclamatory':
          sentence += '!';
          break;
        default:
          sentence += '.';
      }
    }

    return sentence;
  }

  /**
   * الحصول على عنصر غير مستخدم
   */
  private getUnusedItem(items: string[], usedSet: Set<string>): string {
    const unused = items.filter((item) => !usedSet.has(item));

    if (unused.length === 0) {
      usedSet.clear();
      return items[Math.floor(Math.random() * items.length)];
    }

    const selected = unused[Math.floor(Math.random() * unused.length)];
    usedSet.add(selected);
    return selected;
  }

  /**
   * إعادة تعيين الحالة
   */
  reset(): void {
    this.usedStarters.clear();
    this.usedMiddles.clear();
    this.usedEndings.clear();
    this.lastPattern = null;
  }
}

// نسخة جاهزة للاستخدام
export const sentenceComposer = new SentenceComposer();
