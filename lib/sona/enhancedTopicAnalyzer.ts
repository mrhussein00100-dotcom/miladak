/**
 * SONA Enhanced Topic Analyzer - محلل الموضوع المحسّن
 * يحلل الموضوع بعمق ويستخرج الكيانات والسياق والأسئلة الضمنية
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

import { TopicCategory, ExtractedEntities, ArticleLength } from './types';

// ============================================
// أنواع البيانات المحسّنة
// ============================================

export type ContentType =
  | 'informational'
  | 'tutorial'
  | 'comparison'
  | 'guide'
  | 'faq'
  | 'celebration'
  | 'analysis';
export type AudienceType =
  | 'general'
  | 'parents'
  | 'pregnant'
  | 'children'
  | 'professionals'
  | 'couples'
  | 'elderly';
export type DetailLevel = 'basic' | 'intermediate' | 'advanced';

export interface DeepTopicAnalysis {
  // التصنيف الأساسي
  category: TopicCategory;
  subCategory?: string;

  // الكيانات المستخرجة
  entities: ExtractedEntities & {
    concepts: string[];
    actions: string[];
    adjectives: string[];
  };

  // نوع المحتوى المطلوب
  contentType: ContentType;

  // الجمهور المستهدف
  audience: AudienceType;

  // الأسئلة الضمنية
  implicitQuestions: string[];

  // الكلمات المفتاحية
  primaryKeywords: string[];
  secondaryKeywords: string[];

  // مستوى التفصيل
  detailLevel: DetailLevel;

  // السياق العاطفي
  emotionalContext:
    | 'celebratory'
    | 'informative'
    | 'supportive'
    | 'educational'
    | 'neutral';

  // الموضوعات الفرعية المقترحة
  suggestedSubTopics: string[];

  // درجة الثقة في التحليل
  confidence: number;
}

// ============================================
// قوائم الكلمات المفتاحية للتصنيف
// ============================================

const CONTENT_TYPE_INDICATORS: Record<ContentType, string[]> = {
  informational: ['ما هو', 'ما هي', 'معلومات', 'حقائق', 'تعريف', 'معنى', 'شرح'],
  tutorial: ['كيف', 'طريقة', 'خطوات', 'دليل', 'تعلم', 'شرح كيفية'],
  comparison: ['مقارنة', 'الفرق بين', 'أفضل', 'أيهما', 'مقابل', 'vs'],
  guide: ['دليل', 'شامل', 'كامل', 'كل ما تحتاج', 'من الألف للياء'],
  faq: ['أسئلة', 'استفسارات', 'الأكثر شيوعاً', 'يسأل الناس'],
  celebration: ['عيد', 'احتفال', 'تهنئة', 'مبارك', 'سعيد', 'ذكرى'],
  analysis: ['تحليل', 'دراسة', 'بحث', 'استكشاف', 'فهم'],
};

const AUDIENCE_INDICATORS: Record<AudienceType, string[]> = {
  general: [],
  parents: ['أطفال', 'تربية', 'أبناء', 'والدين', 'أمهات', 'آباء', 'عائلة'],
  pregnant: ['حامل', 'حمل', 'جنين', 'ولادة', 'أسابيع الحمل'],
  children: ['للأطفال', 'صغار', 'أولاد', 'بنات', 'طفل', 'طفلة'],
  professionals: ['متخصص', 'احترافي', 'خبراء', 'متقدم'],
  couples: ['زوجين', 'زواج', 'شريك', 'حبيب', 'علاقة'],
  elderly: ['كبار السن', 'مسنين', 'جدي', 'جدتي', 'العمر الذهبي'],
};

const ARABIC_NAMES_MALE = [
  'محمد',
  'أحمد',
  'علي',
  'عمر',
  'خالد',
  'يوسف',
  'إبراهيم',
  'عبدالله',
  'عبدالرحمن',
  'سعد',
  'فهد',
  'سلطان',
  'ناصر',
  'سعود',
  'تركي',
  'بندر',
  'ماجد',
  'طلال',
  'وليد',
  'فيصل',
  'سامي',
  'حسن',
  'حسين',
  'مصطفى',
  'كريم',
  'ياسر',
  'هاني',
  'رامي',
  'طارق',
];

const ARABIC_NAMES_FEMALE = [
  'فاطمة',
  'مريم',
  'نور',
  'سارة',
  'ليلى',
  'هند',
  'نورة',
  'ريم',
  'دانة',
  'لمى',
  'هيا',
  'منى',
  'رنا',
  'دينا',
  'لينا',
  'ياسمين',
  'جنى',
  'سلمى',
  'أمل',
  'هدى',
  'سمر',
  'رغد',
  'شهد',
  'لجين',
  'غادة',
  'عبير',
  'أسماء',
  'زينب',
  'خديجة',
  'عائشة',
];

const ZODIAC_SIGNS_AR = [
  'الحمل',
  'الثور',
  'الجوزاء',
  'السرطان',
  'الأسد',
  'العذراء',
  'الميزان',
  'العقرب',
  'القوس',
  'الجدي',
  'الدلو',
  'الحوت',
];

const ZODIAC_SIGNS_EN = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
];

// ============================================
// الأسئلة الضمنية حسب الفئة
// ============================================

const IMPLICIT_QUESTIONS: Record<TopicCategory, string[]> = {
  birthday: [
    'كيف أحتفل بعيد الميلاد؟',
    'ما هي أفضل الهدايا؟',
    'ما هي أجمل عبارات التهنئة؟',
    'كيف أخطط لحفلة مميزة؟',
    'ما هي تقاليد الاحتفال؟',
  ],
  zodiac: [
    'ما هي صفات هذا البرج؟',
    'ما هي نقاط القوة والضعف؟',
    'ما هي الأبراج المتوافقة؟',
    'ما هو الحجر الكريم واللون المحظوظ؟',
    'ما هي النصائح لمواليد هذا البرج؟',
  ],
  health: [
    'كيف أحسب مؤشر كتلة الجسم؟',
    'ما هو الوزن المثالي؟',
    'كم سعرة حرارية أحتاج يومياً؟',
    'ما هي النصائح الصحية؟',
    'كيف أحافظ على صحتي؟',
  ],
  dates: [
    'كيف أحول التاريخ؟',
    'ما الفرق بين التقويمين؟',
    'ما هي الأحداث التاريخية في هذا اليوم؟',
    'كيف أحسب الأيام بين تاريخين؟',
  ],
  general: [
    'ما هي المعلومات الأساسية؟',
    'ما هي الفوائد؟',
    'ما هي النصائح المهمة؟',
    'كيف أستفيد من هذا الموضوع؟',
  ],
};

// ============================================
// فئة محلل الموضوع المحسّن
// ============================================

export class EnhancedTopicAnalyzer {
  /**
   * تحليل الموضوع بعمق
   * Requirements: 1.1, 1.2, 1.3, 1.4
   */
  analyzeTopicDeep(
    topic: string,
    length: ArticleLength = 'medium'
  ): DeepTopicAnalysis {
    const normalizedTopic = this.normalizeTopic(topic);

    // استخراج الكيانات
    const entities = this.extractEntities(normalizedTopic);

    // تحديد الفئة
    const category = this.detectCategory(normalizedTopic, entities);
    const subCategory = this.detectSubCategory(
      category,
      entities,
      normalizedTopic
    );

    // تحديد نوع المحتوى
    const contentType = this.detectContentType(normalizedTopic);

    // تحديد الجمهور
    const audience = this.identifyAudience(normalizedTopic);

    // استخراج الأسئلة الضمنية
    const implicitQuestions = this.generateImplicitQuestions(
      normalizedTopic,
      category,
      entities
    );

    // استخراج الكلمات المفتاحية
    const { primary, secondary } = this.extractKeywords(
      normalizedTopic,
      category,
      entities
    );

    // تحديد مستوى التفصيل
    const detailLevel = this.determineDetailLevel(length, contentType);

    // تحديد السياق العاطفي
    const emotionalContext = this.detectEmotionalContext(
      normalizedTopic,
      category
    );

    // اقتراح موضوعات فرعية
    const suggestedSubTopics = this.suggestSubTopics(
      category,
      entities,
      normalizedTopic
    );

    // حساب درجة الثقة
    const confidence = this.calculateConfidence(
      entities,
      category,
      contentType
    );

    return {
      category,
      subCategory,
      entities: {
        ...entities,
        concepts: this.extractConcepts(normalizedTopic),
        actions: this.extractActions(normalizedTopic),
        adjectives: this.extractAdjectives(normalizedTopic),
      },
      contentType,
      audience,
      implicitQuestions,
      primaryKeywords: primary,
      secondaryKeywords: secondary,
      detailLevel,
      emotionalContext,
      suggestedSubTopics,
      confidence,
    };
  }

  /**
   * استخراج الكيانات من النص
   * Requirements: 1.1
   */
  extractEntities(text: string): ExtractedEntities {
    return {
      names: this.extractNames(text),
      dates: this.extractDates(text),
      numbers: this.extractNumbers(text),
      zodiacSigns: this.extractZodiacSigns(text),
      ages: this.extractAges(text),
      keywords: this.extractTopicKeywords(text),
    };
  }

  /**
   * تحديد نوع المحتوى المطلوب
   * Requirements: 1.2
   */
  detectContentType(topic: string): ContentType {
    const lowerTopic = topic.toLowerCase();

    // البحث عن مؤشرات نوع المحتوى
    for (const [type, indicators] of Object.entries(CONTENT_TYPE_INDICATORS)) {
      for (const indicator of indicators) {
        if (lowerTopic.includes(indicator)) {
          return type as ContentType;
        }
      }
    }

    // تحديد افتراضي بناءً على السياق
    if (lowerTopic.includes('عيد') || lowerTopic.includes('تهنئة')) {
      return 'celebration';
    }

    if (lowerTopic.includes('برج') || lowerTopic.includes('صفات')) {
      return 'analysis';
    }

    return 'informational';
  }

  /**
   * تحديد الجمهور المستهدف
   * Requirements: 1.3
   */
  identifyAudience(topic: string): AudienceType {
    const lowerTopic = topic.toLowerCase();

    for (const [audience, indicators] of Object.entries(AUDIENCE_INDICATORS)) {
      for (const indicator of indicators) {
        if (lowerTopic.includes(indicator)) {
          return audience as AudienceType;
        }
      }
    }

    return 'general';
  }

  /**
   * استخراج الأسئلة الضمنية
   * Requirements: 1.4
   */
  generateImplicitQuestions(
    topic: string,
    category: TopicCategory,
    entities: ExtractedEntities
  ): string[] {
    const questions: string[] = [];
    const baseQuestions =
      IMPLICIT_QUESTIONS[category] || IMPLICIT_QUESTIONS.general;

    // إضافة الأسئلة الأساسية
    questions.push(...baseQuestions);

    // أسئلة مخصصة حسب الكيانات
    if (entities.names.length > 0) {
      const name = entities.names[0];
      if (category === 'birthday') {
        questions.push(`ما هي أفضل هدية لـ${name}؟`);
        questions.push(`كيف أكتب تهنئة مميزة لـ${name}؟`);
      }
    }

    if (entities.ages.length > 0) {
      const age = entities.ages[0];
      if (category === 'birthday') {
        questions.push(`ما هي أفكار الاحتفال بعمر ${age} سنة؟`);
        questions.push(`ما هي الهدايا المناسبة لعمر ${age}؟`);
      }
    }

    if (entities.zodiacSigns.length > 0) {
      const sign = entities.zodiacSigns[0];
      questions.push(`ما هي صفات برج ${sign}؟`);
      questions.push(`ما هي الأبراج المتوافقة مع ${sign}؟`);
      questions.push(`ما هو حجر الحظ لبرج ${sign}؟`);
    }

    return [...new Set(questions)].slice(0, 10);
  }

  // ============================================
  // دوال مساعدة خاصة
  // ============================================

  private normalizeTopic(topic: string): string {
    return topic.trim().replace(/\s+/g, ' ');
  }

  private extractNames(text: string): string[] {
    const names: string[] = [];
    const allNames = [...ARABIC_NAMES_MALE, ...ARABIC_NAMES_FEMALE];

    // البحث عن الأسماء المعروفة
    for (const name of allNames) {
      const regex = new RegExp(`\\b${name}\\b`, 'gi');
      if (regex.test(text)) {
        names.push(name);
      }
    }

    // البحث عن أسماء بعد كلمات مفتاحية
    const namePatterns = [
      /(?:عيد ميلاد|تهنئة|اسم)\s+([أ-ي\u0600-\u06FF]+)/gi,
      /(?:لـ|ل)\s*([أ-ي\u0600-\u06FF]{2,15})/gi,
    ];

    for (const pattern of namePatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const potentialName = match[1]?.trim();
        if (
          potentialName &&
          this.isValidName(potentialName) &&
          !names.includes(potentialName)
        ) {
          names.push(potentialName);
        }
      }
    }

    return names.slice(0, 5);
  }

  private isValidName(text: string): boolean {
    if (text.length < 2 || text.length > 20) return false;
    if (/\d/.test(text)) return false;
    if (/[.,!?؟،:;]/.test(text)) return false;

    const commonWords = [
      'سعيد',
      'جميل',
      'رائع',
      'مبارك',
      'كل',
      'عام',
      'يوم',
      'شهر',
      'سنة',
      'عيد',
      'ميلاد',
      'برج',
    ];
    return !commonWords.includes(text);
  }

  private extractDates(text: string): string[] {
    const dates: string[] = [];
    const datePatterns = [
      /\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}/g,
      /\d{1,2}\s+(?:يناير|فبراير|مارس|أبريل|مايو|يونيو|يوليو|أغسطس|سبتمبر|أكتوبر|نوفمبر|ديسمبر)\s*\d{0,4}/gi,
    ];

    for (const pattern of datePatterns) {
      const matches = text.match(pattern);
      if (matches) {
        dates.push(...matches.filter((m) => !dates.includes(m)));
      }
    }

    return dates;
  }

  private extractNumbers(text: string): number[] {
    const numbers: number[] = [];
    const matches = text.match(/\d+/g);

    if (matches) {
      for (const match of matches) {
        const num = parseInt(match, 10);
        if (!isNaN(num) && !numbers.includes(num)) {
          numbers.push(num);
        }
      }
    }

    return numbers;
  }

  private extractZodiacSigns(text: string): string[] {
    const signs: string[] = [];
    const lowerText = text.toLowerCase();

    for (const sign of ZODIAC_SIGNS_AR) {
      if (text.includes(sign)) {
        signs.push(sign);
      }
    }

    for (let i = 0; i < ZODIAC_SIGNS_EN.length; i++) {
      if (
        lowerText.includes(ZODIAC_SIGNS_EN[i]) &&
        !signs.includes(ZODIAC_SIGNS_AR[i])
      ) {
        signs.push(ZODIAC_SIGNS_AR[i]);
      }
    }

    return signs;
  }

  private extractAges(text: string): number[] {
    const ages: number[] = [];
    const agePatterns = [
      /(\d+)\s*(?:سنة|سنوات|عام|أعوام|years?)/gi,
      /(?:عمر[هـ]?[اي]?|age)\s*:?\s*(\d+)/gi,
      /بعمر\s*(\d+)/gi,
      /(\d+)\s*عاماً/gi,
    ];

    for (const pattern of agePatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const age = parseInt(match[1], 10);
        if (age > 0 && age <= 150 && !ages.includes(age)) {
          ages.push(age);
        }
      }
    }

    return ages.sort((a, b) => a - b).slice(0, 3);
  }

  private extractTopicKeywords(text: string): string[] {
    const stopWords = [
      'في',
      'من',
      'إلى',
      'على',
      'عن',
      'مع',
      'هذا',
      'هذه',
      'التي',
      'الذي',
      'كان',
      'هو',
      'هي',
      'أن',
      'ما',
      'لا',
    ];
    const words = text.split(/\s+/);
    const keywords: string[] = [];

    for (const word of words) {
      const cleanWord = word.replace(/[^\u0600-\u06FFa-zA-Z]/g, '');
      if (
        cleanWord.length > 2 &&
        !stopWords.includes(cleanWord.toLowerCase()) &&
        !keywords.includes(cleanWord)
      ) {
        keywords.push(cleanWord);
      }
    }

    return keywords.slice(0, 10);
  }

  private extractConcepts(text: string): string[] {
    const concepts: string[] = [];
    const conceptPatterns = [
      /(?:مفهوم|فكرة|معنى)\s+([أ-ي\u0600-\u06FF]+)/gi,
      /([أ-ي\u0600-\u06FF]+)\s+(?:هو|هي|يعني)/gi,
    ];

    for (const pattern of conceptPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        if (match[1] && !concepts.includes(match[1])) {
          concepts.push(match[1]);
        }
      }
    }

    return concepts;
  }

  private extractActions(text: string): string[] {
    const actionWords = [
      'احسب',
      'اكتشف',
      'تعرف',
      'اعرف',
      'حول',
      'قارن',
      'احتفل',
      'هنئ',
      'خطط',
    ];
    const actions: string[] = [];

    for (const action of actionWords) {
      if (text.includes(action)) {
        actions.push(action);
      }
    }

    return actions;
  }

  private extractAdjectives(text: string): string[] {
    const adjectives: string[] = [];
    const adjectivePatterns = [
      /(?:أفضل|أجمل|أحسن|أروع|أهم)/gi,
      /(?:جميل|رائع|مميز|فريد|خاص)/gi,
    ];

    for (const pattern of adjectivePatterns) {
      const matches = text.match(pattern);
      if (matches) {
        adjectives.push(...matches.filter((m) => !adjectives.includes(m)));
      }
    }

    return adjectives;
  }

  private detectCategory(
    topic: string,
    entities: ExtractedEntities
  ): TopicCategory {
    const lowerTopic = topic.toLowerCase();

    // الأبراج أولاً إذا وجدت
    if (
      entities.zodiacSigns.length > 0 ||
      lowerTopic.includes('برج') ||
      lowerTopic.includes('أبراج')
    ) {
      return 'zodiac';
    }

    // عيد الميلاد
    if (
      lowerTopic.includes('عيد ميلاد') ||
      lowerTopic.includes('تهنئة') ||
      lowerTopic.includes('احتفال ميلاد')
    ) {
      return 'birthday';
    }

    // الصحة
    if (
      lowerTopic.includes('bmi') ||
      lowerTopic.includes('وزن') ||
      lowerTopic.includes('سعرات') ||
      lowerTopic.includes('صحة')
    ) {
      return 'health';
    }

    // التواريخ
    if (
      lowerTopic.includes('تحويل') ||
      lowerTopic.includes('تاريخ') ||
      lowerTopic.includes('هجري') ||
      lowerTopic.includes('ميلادي')
    ) {
      return 'dates';
    }

    return 'general';
  }

  private detectSubCategory(
    category: TopicCategory,
    entities: ExtractedEntities,
    topic: string
  ): string | undefined {
    switch (category) {
      case 'zodiac':
        return entities.zodiacSigns[0];
      case 'birthday':
        if (entities.ages.length > 0) {
          const age = entities.ages[0];
          if (age <= 12) return 'kids';
          if (age <= 18) return 'teens';
          if (age <= 30) return 'young-adults';
          if (age <= 50) return 'adults';
          return 'seniors';
        }
        return undefined;
      default:
        return undefined;
    }
  }

  private extractKeywords(
    topic: string,
    category: TopicCategory,
    entities: ExtractedEntities
  ): { primary: string[]; secondary: string[] } {
    const primary: string[] = [];
    const secondary: string[] = [];

    // الكلمات من الموضوع
    const topicWords = topic.split(/\s+/).filter((w) => w.length > 2);
    primary.push(...topicWords.slice(0, 5));

    // الكيانات
    primary.push(...entities.names);
    primary.push(...entities.zodiacSigns);

    // كلمات حسب الفئة
    switch (category) {
      case 'birthday':
        secondary.push('عيد ميلاد', 'تهنئة', 'احتفال', 'هدايا', 'كعكة');
        break;
      case 'zodiac':
        secondary.push('برج', 'أبراج', 'صفات', 'توافق', 'حظ');
        break;
      case 'health':
        secondary.push('صحة', 'وزن', 'سعرات', 'لياقة', 'تغذية');
        break;
      case 'dates':
        secondary.push('تاريخ', 'تقويم', 'هجري', 'ميلادي', 'تحويل');
        break;
    }

    return {
      primary: [...new Set(primary)].slice(0, 10),
      secondary: [...new Set(secondary)].slice(0, 10),
    };
  }

  private determineDetailLevel(
    length: ArticleLength,
    contentType: ContentType
  ): DetailLevel {
    if (length === 'comprehensive' || length === 'long') {
      return 'advanced';
    }
    if (length === 'medium' || contentType === 'guide') {
      return 'intermediate';
    }
    return 'basic';
  }

  private detectEmotionalContext(
    topic: string,
    category: TopicCategory
  ): 'celebratory' | 'informative' | 'supportive' | 'educational' | 'neutral' {
    if (
      category === 'birthday' ||
      topic.includes('عيد') ||
      topic.includes('تهنئة') ||
      topic.includes('مبارك')
    ) {
      return 'celebratory';
    }
    if (
      topic.includes('كيف') ||
      topic.includes('تعلم') ||
      topic.includes('دليل')
    ) {
      return 'educational';
    }
    if (topic.includes('نصائح') || topic.includes('مساعدة')) {
      return 'supportive';
    }
    if (topic.includes('معلومات') || topic.includes('حقائق')) {
      return 'informative';
    }
    return 'neutral';
  }

  private suggestSubTopics(
    category: TopicCategory,
    entities: ExtractedEntities,
    topic: string
  ): string[] {
    const subTopics: string[] = [];

    switch (category) {
      case 'birthday':
        subTopics.push(
          'أفكار الهدايا',
          'عبارات التهنئة',
          'تخطيط الحفلة',
          'الكعكة والديكور',
          'التقاليد'
        );
        if (entities.ages.length > 0) {
          subTopics.push(`معنى عمر ${entities.ages[0]} سنة`);
        }
        break;
      case 'zodiac':
        if (entities.zodiacSigns.length > 0) {
          const sign = entities.zodiacSigns[0];
          subTopics.push(
            `صفات ${sign}`,
            `توافق ${sign}`,
            `نقاط القوة والضعف`,
            `الحجر الكريم`,
            `المشاهير`
          );
        }
        break;
      case 'health':
        subTopics.push(
          'حساب BMI',
          'الوزن المثالي',
          'السعرات الحرارية',
          'نصائح صحية',
          'التمارين'
        );
        break;
      case 'dates':
        subTopics.push(
          'التحويل',
          'الفرق بين التقويمين',
          'الأحداث التاريخية',
          'المناسبات'
        );
        break;
      default:
        subTopics.push('معلومات أساسية', 'نصائح مهمة', 'أسئلة شائعة');
    }

    return subTopics;
  }

  private calculateConfidence(
    entities: ExtractedEntities,
    category: TopicCategory,
    contentType: ContentType
  ): number {
    let confidence = 0.5;

    if (entities.zodiacSigns.length > 0) confidence += 0.2;
    if (entities.names.length > 0) confidence += 0.1;
    if (entities.ages.length > 0) confidence += 0.1;
    if (entities.dates.length > 0) confidence += 0.1;
    if (category !== 'general') confidence += 0.1;
    if (contentType !== 'informational') confidence += 0.05;

    return Math.min(confidence, 1.0);
  }
}

// تصدير نسخة واحدة
export const enhancedTopicAnalyzer = new EnhancedTopicAnalyzer();
