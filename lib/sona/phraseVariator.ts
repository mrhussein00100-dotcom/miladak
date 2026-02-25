/**
 * SONA Phrase Variator - منوع العبارات
 * يوفر تنويعاً في المقدمات والانتقالات والخواتيم لتجنب التكرار
 *
 * Requirements: 3.4, 4.3
 */

// ============================================
// أنواع البيانات
// ============================================

export type PresentationStyle =
  | 'narrative'
  | 'analytical'
  | 'comparative'
  | 'list';

export interface VariationOptions {
  topic?: string;
  category?: string;
  style?: PresentationStyle;
  audience?: string;
}

// ============================================
// المقدمات المتنوعة (50+)
// ============================================

const INTRO_VARIATIONS = {
  informative: [
    'في هذا المقال الشامل، سنتناول {topic} بالتفصيل ونقدم لكم معلومات قيمة.',
    'مرحباً بكم! اليوم سنتحدث عن {topic} ونكتشف معاً أهم المعلومات.',
    'هل تساءلتم يوماً عن {topic}؟ في هذا المقال ستجدون كل ما تحتاجون معرفته.',
    'نقدم لكم دليلاً شاملاً عن {topic} يجيب على جميع تساؤلاتكم.',
    '{topic} من المواضيع المهمة التي تستحق الاهتمام. دعونا نتعرف عليها معاً.',
  ],
  celebratory: [
    'في هذه المناسبة السعيدة، نحتفل معكم ونقدم أجمل التهاني!',
    'يسعدنا أن نشارككم فرحة هذه المناسبة المميزة!',
    'مناسبة سعيدة تستحق أجمل الكلمات وأصدق التهاني!',
    'نحتفل معكم بهذا اليوم المميز ونتمنى لكم كل السعادة!',
    'في أجواء الفرح والسعادة، نقدم لكم أجمل التهاني والأمنيات!',
  ],
  educational: [
    'تعلموا معنا كل ما تحتاجون معرفته عن {topic}.',
    'في هذا الدليل التعليمي، سنشرح لكم {topic} خطوة بخطوة.',
    'اكتشفوا معنا أسرار {topic} وتعلموا كيفية الاستفادة منها.',
    'نقدم لكم شرحاً مبسطاً وواضحاً عن {topic}.',
    'هل تريدون تعلم المزيد عن {topic}؟ أنتم في المكان الصحيح!',
  ],
  supportive: [
    'نحن هنا لمساعدتكم في فهم {topic} بشكل أفضل.',
    'لا تقلقوا، سنرشدكم خطوة بخطوة في موضوع {topic}.',
    'نفهم أن {topic} قد يكون محيراً، لذلك جمعنا لكم أهم المعلومات.',
    'معاً سنكتشف كل ما يخص {topic} بطريقة سهلة ومبسطة.',
    'نقدم لكم الدعم والمعلومات التي تحتاجونها عن {topic}.',
  ],
  analytical: [
    'دعونا نحلل {topic} بعمق ونفهم جوانبه المختلفة.',
    'في هذا التحليل الشامل، سنستكشف {topic} من جميع الزوايا.',
    'نقدم لكم دراسة تفصيلية عن {topic} وأهم جوانبه.',
    'سنتناول {topic} بنظرة تحليلية شاملة.',
    'اكتشفوا معنا التفاصيل الدقيقة عن {topic}.',
  ],
};

// ============================================
// الانتقالات المتنوعة (30+)
// ============================================

const TRANSITION_PHRASES = [
  // انتقالات إضافية
  'بالإضافة إلى ذلك،',
  'علاوة على ما سبق،',
  'ومن الجدير بالذكر أن',
  'كما أن',
  'ومن المهم أيضاً',
  'ولا يفوتنا أن نذكر',
  'ومما يستحق الذكر',
  'وتجدر الإشارة إلى',

  // انتقالات سببية
  'وبناءً على ذلك،',
  'ولهذا السبب،',
  'ونتيجة لذلك،',
  'وبالتالي،',
  'ومن هنا،',

  // انتقالات مقارنة
  'من ناحية أخرى،',
  'وفي المقابل،',
  'وعلى النقيض من ذلك،',
  'وبالمقارنة،',

  // انتقالات زمنية
  'وفي هذا السياق،',
  'وفي ضوء ذلك،',
  'ومن هذا المنطلق،',
  'وفي إطار ذلك،',

  // انتقالات تأكيدية
  'والأهم من ذلك،',
  'وما يؤكد ذلك،',
  'ولعل من أبرز',
  'ومن أهم ما يميز',

  // انتقالات توضيحية
  'وبعبارة أخرى،',
  'أي أن',
  'وهذا يعني أن',
  'ولتوضيح ذلك،',

  // انتقالات استنتاجية
  'وخلاصة القول،',
  'ومما سبق نستنتج أن',
  'وبإيجاز،',
];

// ============================================
// الخواتيم المتنوعة (30+)
// ============================================

const CONCLUSION_VARIATIONS = {
  summary: [
    'في الختام، نأمل أن يكون هذا المقال قد أفادكم.',
    'ختاماً، قدمنا لكم أهم المعلومات عن هذا الموضوع.',
    'وبهذا نكون قد استعرضنا أهم جوانب الموضوع.',
    'نأمل أن تكونوا قد استفدتم من هذا المقال الشامل.',
    'هذا كل ما تحتاجون معرفته عن هذا الموضوع.',
  ],
  callToAction: [
    'شاركوا هذا المقال مع أصدقائكم وأحبائكم!',
    'لا تنسوا متابعتنا للمزيد من المقالات المفيدة!',
    'جربوا أدوات ميلادك المجانية واكتشفوا المزيد!',
    'تابعونا على وسائل التواصل الاجتماعي!',
    'اتركوا تعليقاتكم وآراءكم في الأسفل!',
  ],
  wishful: [
    'نتمنى لكم كل التوفيق والسعادة!',
    'دمتم بخير وسعادة!',
    'نأمل أن تحققوا كل أمانيكم!',
    'مع أطيب التمنيات بالتوفيق!',
    'نتمنى لكم حياة سعيدة ومليئة بالإنجازات!',
  ],
  informative: [
    'للمزيد من المعلومات، تصفحوا موقع ميلادك.',
    'اكتشفوا المزيد من المقالات المفيدة على موقعنا.',
    'زوروا قسم الأدوات للاستفادة من خدماتنا المجانية.',
    'تابعونا للحصول على أحدث المقالات والمعلومات.',
    'استكشفوا المزيد من المواضيع المشابهة على موقعنا.',
  ],
  celebratory: [
    'كل عام وأنتم بخير!',
    'نتمنى لكم أوقاتاً سعيدة!',
    'عيد سعيد ومبارك!',
    'أسعد الله أيامكم!',
    'دامت أفراحكم!',
  ],
  encouraging: [
    'لا تترددوا في تجربة ما تعلمتموه!',
    'ابدأوا اليوم وستلاحظون الفرق!',
    'الخطوة الأولى هي الأهم، فابدأوا الآن!',
    'ثقوا بأنفسكم وستحققون النجاح!',
    'كل رحلة تبدأ بخطوة، فلا تترددوا!',
  ],
};

// ============================================
// بدائل العبارات العامة
// ============================================

const GENERIC_PHRASE_REPLACEMENTS: Record<string, string[]> = {
  'من المهم': ['من الضروري', 'من الأساسي', 'لا بد من', 'يجب', 'من اللازم'],
  'يجب أن': ['من الضروري أن', 'ينبغي أن', 'من المهم أن', 'يتعين', 'يلزم أن'],
  'بشكل عام': ['عموماً', 'في الغالب', 'في معظم الأحيان', 'عادةً', 'في العادة'],
  'في الواقع': ['حقيقةً', 'فعلياً', 'في الحقيقة', 'واقعياً', 'بالفعل'],
  'على سبيل المثال': [
    'مثلاً',
    'كمثال على ذلك',
    'ومن الأمثلة',
    'نذكر منها',
    'كأن',
  ],
  'من ناحية أخرى': [
    'وفي المقابل',
    'وعلى الجانب الآخر',
    'بينما',
    'في حين أن',
    'وبالمقارنة',
  ],
  'في النهاية': [
    'ختاماً',
    'وأخيراً',
    'في الختام',
    'وفي نهاية المطاف',
    'وبالنهاية',
  ],
  'كثير من': ['العديد من', 'الكثير من', 'عدد كبير من', 'معظم', 'غالبية'],
  'بالإضافة إلى': ['فضلاً عن', 'علاوة على', 'إلى جانب', 'بجانب', 'ومع'],
  'من أجل': ['بهدف', 'بغرض', 'لأجل', 'سعياً إلى', 'بغية'],
};

// ============================================
// فئة منوع العبارات
// ============================================

export class PhraseVariator {
  private usedIntros: Set<string> = new Set();
  private usedTransitions: Set<string> = new Set();
  private usedConclusions: Set<string> = new Set();
  private currentStyle: PresentationStyle = 'narrative';

  /**
   * الحصول على مقدمة متنوعة
   * Requirements: 3.4
   */
  getIntroVariation(topic: string, style: string = 'informative'): string {
    const variations =
      INTRO_VARIATIONS[style as keyof typeof INTRO_VARIATIONS] ||
      INTRO_VARIATIONS.informative;

    const intro = this.getRandomUnused(variations, this.usedIntros);
    return intro.replace(/{topic}/g, topic);
  }

  /**
   * الحصول على انتقال عشوائي
   * Requirements: 3.4
   */
  getTransitionPhrase(): string {
    return this.getRandomUnused(TRANSITION_PHRASES, this.usedTransitions);
  }

  /**
   * الحصول على خاتمة متنوعة
   * Requirements: 3.4
   */
  getConclusionVariation(topic: string, type: string = 'summary'): string {
    const variations =
      CONCLUSION_VARIATIONS[type as keyof typeof CONCLUSION_VARIATIONS] ||
      CONCLUSION_VARIATIONS.summary;

    return this.getRandomUnused(variations, this.usedConclusions);
  }

  /**
   * استبدال العبارات العامة
   * Requirements: 4.3
   */
  replaceGenericPhrase(phrase: string): string {
    for (const [generic, replacements] of Object.entries(
      GENERIC_PHRASE_REPLACEMENTS
    )) {
      if (phrase.includes(generic)) {
        const replacement =
          replacements[Math.floor(Math.random() * replacements.length)];
        phrase = phrase.replace(generic, replacement);
      }
    }
    return phrase;
  }

  /**
   * استبدال جميع العبارات العامة في نص
   */
  replaceAllGenericPhrases(text: string): string {
    let result = text;
    for (const [generic, replacements] of Object.entries(
      GENERIC_PHRASE_REPLACEMENTS
    )) {
      const regex = new RegExp(generic, 'g');
      let match;
      while ((match = regex.exec(result)) !== null) {
        // استخدام بديل مختلف في كل مرة
        const replacement =
          replacements[Math.floor(Math.random() * replacements.length)];
        result =
          result.substring(0, match.index) +
          replacement +
          result.substring(match.index + generic.length);
      }
    }
    return result;
  }

  /**
   * تحديد أسلوب العرض
   */
  getPresentationStyle(): PresentationStyle {
    const styles: PresentationStyle[] = [
      'narrative',
      'analytical',
      'comparative',
      'list',
    ];
    this.currentStyle = styles[Math.floor(Math.random() * styles.length)];
    return this.currentStyle;
  }

  /**
   * الحصول على أسلوب العرض الحالي
   */
  getCurrentStyle(): PresentationStyle {
    return this.currentStyle;
  }

  /**
   * تنويع جملة
   */
  varySentence(sentence: string): string {
    // استبدال العبارات العامة
    let varied = this.replaceGenericPhrase(sentence);

    // إضافة انتقال في بداية الجملة أحياناً
    if (Math.random() > 0.7 && !this.startsWithTransition(varied)) {
      varied =
        this.getTransitionPhrase() +
        ' ' +
        varied.charAt(0).toLowerCase() +
        varied.slice(1);
    }

    return varied;
  }

  /**
   * التحقق مما إذا كانت الجملة تبدأ بانتقال
   */
  private startsWithTransition(sentence: string): boolean {
    return TRANSITION_PHRASES.some((t) => sentence.startsWith(t));
  }

  /**
   * الحصول على عنصر عشوائي غير مستخدم
   */
  private getRandomUnused(arr: string[], usedSet: Set<string>): string {
    const unused = arr.filter((item) => !usedSet.has(item));

    if (unused.length === 0) {
      // إعادة تعيين إذا استُخدمت جميع العناصر
      usedSet.clear();
      return arr[Math.floor(Math.random() * arr.length)];
    }

    const selected = unused[Math.floor(Math.random() * unused.length)];
    usedSet.add(selected);
    return selected;
  }

  /**
   * إعادة تعيين الحالة
   */
  reset(): void {
    this.usedIntros.clear();
    this.usedTransitions.clear();
    this.usedConclusions.clear();
  }

  /**
   * الحصول على قائمة الانتقالات
   */
  getAllTransitions(): string[] {
    return [...TRANSITION_PHRASES];
  }

  /**
   * الحصول على عدد الانتقالات المتاحة
   */
  getAvailableTransitionsCount(): number {
    return TRANSITION_PHRASES.length - this.usedTransitions.size;
  }
}

// تصدير نسخة واحدة
export const phraseVariator = new PhraseVariator();
