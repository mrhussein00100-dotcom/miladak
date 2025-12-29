/**
 * SONA v4 Topic Analyzer - Enhanced Version
 * محلل الموضوع المحسّن - يحلل النص ويستخرج الكيانات والفئات
 *
 * Requirements: 1.1, 4.1, 4.2, 4.3, 4.4, 4.5, 6.1, 6.2, 6.3, 6.5
 */

import {
  TopicAnalysis,
  TopicCategory,
  ExtractedEntities,
  ContentTone,
  ArticleLength,
} from './types';
import { REQUIRED_SECTIONS_CONFIG } from './sectionManager';

// Arabic zodiac signs
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

// English zodiac signs (for detection)
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

// Birthday related keywords
const BIRTHDAY_KEYWORDS = [
  'عيد ميلاد',
  'ميلاد',
  'عمر',
  'سنة',
  'سنوات',
  'مولود',
  'مواليد',
  'احتفال',
  'تهنئة',
  'كيك',
  'هدية',
  'هدايا',
  'حفلة',
  'birthday',
  'age',
];

// Health related keywords
const HEALTH_KEYWORDS = [
  'صحة',
  'صحي',
  'طبي',
  'علاج',
  'مرض',
  'أمراض',
  'تغذية',
  'رياضة',
  'وزن',
  'سعرات',
  'فيتامين',
  'نوم',
  'health',
  'medical',
  'fitness',
];

// Date related keywords
const DATE_KEYWORDS = [
  'تاريخ',
  'يوم',
  'شهر',
  'سنة',
  'تقويم',
  'هجري',
  'ميلادي',
  'تحويل',
  'حدث',
  'أحداث',
  'ذكرى',
  'date',
  'calendar',
];

// Arabic months
const ARABIC_MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الثاني',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

// Common Arabic names - قائمة موسعة للأسماء العربية الشائعة
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
  'زياد',
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

// All Arabic names combined
const ARABIC_NAMES = [...ARABIC_NAMES_MALE, ...ARABIC_NAMES_FEMALE];

// Common Arabic names patterns (for compound names)
const ARABIC_NAME_PREFIXES = ['عبد', 'أبو', 'أم', 'ابن', 'بنت'];

/**
 * Enhanced Topic Analysis Result
 */
export interface EnhancedTopicAnalysis extends TopicAnalysis {
  requiredKeywords: string[];
  requiredSections: string[];
  wordCountLimits: { min: number; max: number };
}

/**
 * Topic Analyzer Class
 * يحلل الموضوع ويستخرج المعلومات المهمة
 */
export class TopicAnalyzer {
  /**
   * تحليل الموضوع بالكامل
   */
  analyze(topic: string, length: ArticleLength = 'medium'): TopicAnalysis {
    const normalizedTopic = this.normalizeTopic(topic);
    const entities = this.extractEntities(normalizedTopic);
    const category = this.detectCategory(normalizedTopic, entities);
    const keywords = this.suggestKeywords(normalizedTopic, category, entities);
    const sections = this.suggestSections(category, entities);
    const tone = this.detectTone(normalizedTopic);
    const confidence = this.calculateConfidence(category, entities, keywords);

    return {
      category,
      subCategory: this.detectSubCategory(category, entities),
      extractedEntities: entities,
      keywords,
      suggestedSections: sections,
      tone,
      confidence,
    };
  }

  /**
   * تحليل محسّن مع الكلمات المفتاحية المطلوبة والأقسام
   */
  analyzeEnhanced(
    topic: string,
    length: ArticleLength = 'medium'
  ): EnhancedTopicAnalysis {
    const baseAnalysis = this.analyze(topic, length);
    const requiredKeywords = this.extractRequiredKeywords(topic, baseAnalysis);
    const requiredSections = this.getRequiredSectionsForLength(length);
    const wordCountLimits = this.getWordCountLimits(length);

    return {
      ...baseAnalysis,
      requiredKeywords,
      requiredSections,
      wordCountLimits,
    };
  }

  /**
   * استخراج الكلمات المفتاحية المطلوبة (يجب أن تظهر في المحتوى)
   * Requirements: 2.4 - إنشاء قائمة الكلمات الإجبارية
   */
  extractRequiredKeywords(topic: string, analysis: TopicAnalysis): string[] {
    const required: Set<string> = new Set();

    // 1. استخراج الكلمات المهمة من الموضوع
    const topicWords = topic.split(/\s+/).filter((w) => w.length > 2);
    topicWords.forEach((word) => {
      const cleanWord = word.replace(/[^\u0600-\u06FFa-zA-Z]/g, '');
      if (cleanWord.length > 2 && !this.isStopWord(cleanWord)) {
        required.add(cleanWord);
      }
    });

    // 2. إضافة الكيانات المستخرجة (الأسماء إجبارية)
    const { names, zodiacSigns, ages } = analysis.extractedEntities;

    // الأسماء إجبارية - يجب ذكرها في المحتوى
    names.forEach((name) => {
      required.add(name);
    });

    // الأبراج إجبارية
    zodiacSigns.forEach((sign) => {
      required.add(sign);
    });

    // 3. إضافة كلمات مفتاحية حسب الفئة
    switch (analysis.category) {
      case 'birthday':
        // كلمات عيد الميلاد الإجبارية
        required.add('عيد');
        required.add('ميلاد');
        // إذا كان هناك عمر، يجب ذكره
        if (ages.length > 0) {
          required.add(ages[0].toString());
        }
        break;

      case 'zodiac':
        required.add('برج');
        // إضافة اسم البرج إذا وجد
        if (zodiacSigns.length > 0) {
          required.add(zodiacSigns[0]);
        }
        break;

      case 'health':
        required.add('صحة');
        break;

      case 'dates':
        required.add('تاريخ');
        break;
    }

    // 4. إضافة الكلمات المفتاحية المستخرجة من التحليل
    analysis.keywords.slice(0, 3).forEach((kw) => {
      if (kw.length > 2 && !this.isStopWord(kw)) {
        required.add(kw);
      }
    });

    // تحويل Set إلى Array وتحديد الحد الأقصى
    return [...required].slice(0, 10);
  }

  /**
   * الحصول على الأقسام المطلوبة حسب الطول
   */
  getRequiredSectionsForLength(length: ArticleLength): string[] {
    const sections: string[] = ['intro', 'conclusion'];
    const config = REQUIRED_SECTIONS_CONFIG[length];

    if (config.faq) sections.push('faq');
    if (config.tips) sections.push('tips');

    return sections;
  }

  /**
   * الحصول على حدود عدد الكلمات
   */
  getWordCountLimits(length: ArticleLength): { min: number; max: number } {
    const limits: Record<ArticleLength, { min: number; max: number }> = {
      short: { min: 400, max: 600 },
      medium: { min: 800, max: 1200 },
      long: { min: 1500, max: 2500 },
      comprehensive: { min: 2500, max: 4000 },
    };
    return limits[length];
  }

  /**
   * التحقق من أن الكلمة stop word
   */
  private isStopWord(word: string): boolean {
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
      'كانت',
      'هو',
      'هي',
      'أن',
      'ما',
      'لا',
      'كل',
      'بعض',
      'أي',
      'the',
      'a',
      'an',
      'is',
      'are',
      'was',
      'were',
      'of',
      'to',
      'in',
      'for',
    ];
    return stopWords.includes(word.toLowerCase());
  }

  /**
   * تطبيع النص
   */
  private normalizeTopic(topic: string): string {
    return topic.trim().toLowerCase().replace(/\s+/g, ' ');
  }

  /**
   * استخراج الكيانات من النص
   */
  extractEntities(text: string): ExtractedEntities {
    return {
      names: this.extractNames(text),
      dates: this.extractDates(text),
      numbers: this.extractNumbers(text),
      zodiacSigns: this.extractZodiacSigns(text),
      ages: this.extractAges(text),
      keywords: this.extractKeywords(text),
    };
  }

  /**
   * استخراج الأسماء من النص - محسّن بشكل جذري
   * Requirements: 2.1 - استخراج الأسماء العربية بدقة
   */
  private extractNames(text: string): string[] {
    const names: string[] = [];
    const originalText = text;

    // الكلمات الشائعة التي يجب استبعادها
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
      'صحة',
      'نصائح',
      'معلومات',
      'أفضل',
      'أهم',
      'كيف',
      'ماذا',
      'لماذا',
      'متى',
      'أين',
    ];

    // 1. البحث المباشر عن الأسماء العربية الشائعة في النص
    ARABIC_NAMES.forEach((name) => {
      // البحث عن الاسم ككلمة كاملة
      const regex = new RegExp(`\\b${name}\\b`, 'gi');
      if (regex.test(originalText) && !names.includes(name)) {
        names.push(name);
      }
    });

    // 2. استخراج الأسماء بعد كلمات مفتاحية محددة
    const nameContextPatterns = [
      /(?:اسم[هـ]?[اي]?|اسمه|اسمها)\s+([أ-ي\u0600-\u06FF]+)/gi,
      /(?:لـ|ل)\s*([أ-ي\u0600-\u06FF]+)/gi,
      /(?:عيد ميلاد|ميلاد|تهنئة|تهاني)\s+([أ-ي\u0600-\u06FF]+)/gi,
      /(?:الأخ|الأخت|السيد|السيدة|الطفل|الطفلة)\s+([أ-ي\u0600-\u06FF]+)/gi,
      /(?:صديق[تي]?|حبيب[تي]?)\s+([أ-ي\u0600-\u06FF]+)/gi,
    ];

    nameContextPatterns.forEach((pattern) => {
      let match;
      const patternCopy = new RegExp(pattern.source, pattern.flags);
      while ((match = patternCopy.exec(originalText)) !== null) {
        const potentialName = match[1]?.trim();
        if (
          potentialName &&
          potentialName.length >= 2 &&
          potentialName.length <= 20 &&
          !commonWords.includes(potentialName) &&
          !names.includes(potentialName)
        ) {
          // التحقق من أن الاسم يبدو كاسم حقيقي
          if (this.looksLikeName(potentialName)) {
            names.push(potentialName);
          }
        }
      }
    });

    // 3. البحث عن الأسماء المركبة (عبدالله، عبدالرحمن، إلخ)
    ARABIC_NAME_PREFIXES.forEach((prefix) => {
      const regex = new RegExp(`(${prefix}[أ-ي\u0600-\u06FF]+)`, 'gi');
      let match;
      while ((match = regex.exec(originalText)) !== null) {
        const compoundName = match[1]?.trim();
        if (
          compoundName &&
          compoundName.length > 3 &&
          !names.includes(compoundName)
        ) {
          names.push(compoundName);
        }
      }
    });

    // 4. استخراج الأسماء الإنجليزية
    const englishNamePattern = /\b([A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})?)\b/g;
    let englishMatch;
    while ((englishMatch = englishNamePattern.exec(originalText)) !== null) {
      const englishName = englishMatch[1]?.trim();
      if (
        englishName &&
        englishName.length >= 3 &&
        !names.includes(englishName)
      ) {
        // استبعاد الكلمات الإنجليزية الشائعة
        const commonEnglishWords = [
          'The',
          'This',
          'That',
          'What',
          'When',
          'Where',
          'How',
          'Why',
        ];
        if (!commonEnglishWords.includes(englishName)) {
          names.push(englishName);
        }
      }
    }

    return names.slice(0, 5); // الحد الأقصى 5 أسماء
  }

  /**
   * التحقق من أن النص يبدو كاسم حقيقي
   */
  private looksLikeName(text: string): boolean {
    // الاسم يجب أن يكون بين 2-20 حرف
    if (text.length < 2 || text.length > 20) return false;

    // الاسم لا يجب أن يحتوي على أرقام
    if (/\d/.test(text)) return false;

    // الاسم لا يجب أن يحتوي على علامات ترقيم
    if (/[.,!?؟،:;]/.test(text)) return false;

    // الاسم يجب أن يبدأ بحرف عربي أو إنجليزي
    if (!/^[أ-ي\u0600-\u06FFa-zA-Z]/.test(text)) return false;

    return true;
  }

  /**
   * استخراج التواريخ من النص
   */
  private extractDates(text: string): string[] {
    const dates: string[] = [];

    // Various date patterns
    const datePatterns = [
      /\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}/g, // 01/01/2024 or 1-1-24
      /\d{1,2}\s+(?:يناير|فبراير|مارس|أبريل|مايو|يونيو|يوليو|أغسطس|سبتمبر|أكتوبر|نوفمبر|ديسمبر)\s*\d{0,4}/gi,
      /\d{1,2}\s+(?:محرم|صفر|ربيع|جمادى|رجب|شعبان|رمضان|شوال|ذو)/gi,
    ];

    datePatterns.forEach((pattern) => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          if (!dates.includes(match)) {
            dates.push(match);
          }
        });
      }
    });

    return dates;
  }

  /**
   * استخراج الأرقام من النص
   */
  private extractNumbers(text: string): number[] {
    const numbers: number[] = [];
    const matches = text.match(/\d+/g);

    if (matches) {
      matches.forEach((match) => {
        const num = parseInt(match, 10);
        if (!isNaN(num) && !numbers.includes(num)) {
          numbers.push(num);
        }
      });
    }

    return numbers;
  }

  /**
   * استخراج الأبراج من النص
   */
  private extractZodiacSigns(text: string): string[] {
    const signs: string[] = [];
    const lowerText = text.toLowerCase();

    // Check Arabic zodiac signs
    ZODIAC_SIGNS_AR.forEach((sign) => {
      if (text.includes(sign)) {
        signs.push(sign);
      }
    });

    // Check English zodiac signs
    ZODIAC_SIGNS_EN.forEach((sign, index) => {
      if (lowerText.includes(sign)) {
        const arabicSign = ZODIAC_SIGNS_AR[index];
        if (!signs.includes(arabicSign)) {
          signs.push(arabicSign);
        }
      }
    });

    return signs;
  }

  /**
   * استخراج الأعمار من النص - محسّن بشكل جذري
   * Requirements: 2.2 - استخراج الأعمار من سياقات مختلفة
   */
  private extractAges(text: string): number[] {
    const ages: number[] = [];

    // الأرقام العربية إلى إنجليزية
    const arabicToEnglishNumbers: Record<string, string> = {
      '٠': '0',
      '١': '1',
      '٢': '2',
      '٣': '3',
      '٤': '4',
      '٥': '5',
      '٦': '6',
      '٧': '7',
      '٨': '8',
      '٩': '9',
    };

    // تحويل الأرقام العربية إلى إنجليزية
    let normalizedText = text;
    Object.entries(arabicToEnglishNumbers).forEach(([ar, en]) => {
      normalizedText = normalizedText.replace(new RegExp(ar, 'g'), en);
    });

    // أنماط استخراج الأعمار - موسعة ومحسنة
    const agePatterns = [
      // أنماط مباشرة مع كلمات العمر
      /(\d+)\s*(?:سنة|سنوات|عام|أعوام|years?|yo|yrs?)/gi,
      /(?:عمر[هـ]?[اي]?|age|عمره|عمرها|بعمر)\s*:?\s*(\d+)/gi,
      /(\d+)\s*(?:عيد ميلاد)/gi,
      /يبلغ\s*(?:من العمر)?\s*(\d+)/gi,
      /بعمر\s*(\d+)/gi,
      /(\d+)\s*عاماً/gi,
      /(\d+)\s*عامًا/gi,

      // أنماط عيد الميلاد
      /عيد ميلاد[هـ]?\s*(?:ال)?(\d+)/gi,
      /الـ?\s*(\d+)\s*(?:من عمر[هـ]?|عيد ميلاد)/gi,
      /(?:يحتفل|تحتفل|نحتفل)\s*بـ?\s*(?:عيد ميلاد[هـ]?)?\s*(?:ال)?(\d+)/gi,

      // أنماط السن والعمر
      /(?:سن|في سن)\s*(\d+)/gi,
      /(?:أتم|أتمت|يتم|تتم)\s*(\d+)/gi,
      /(?:بلغ|بلغت|يبلغ|تبلغ)\s*(\d+)/gi,

      // أنماط مع الأسماء
      /[أ-ي\u0600-\u06FF]+\s+(\d+)\s*(?:سنة|عام)/gi,

      // أنماط الأرقام الترتيبية
      /(?:العام|السنة)\s*(?:ال)?(\d+)/gi,
    ];

    agePatterns.forEach((pattern) => {
      let match;
      const patternCopy = new RegExp(pattern.source, pattern.flags);
      while ((match = patternCopy.exec(normalizedText)) !== null) {
        const ageStr = match[1];
        if (ageStr) {
          const age = parseInt(ageStr, 10);
          // التحقق من أن العمر منطقي (1-150)
          if (age > 0 && age <= 150 && !ages.includes(age)) {
            ages.push(age);
          }
        }
      }
    });

    // إذا لم نجد أعمار بالأنماط المحددة، نبحث عن أرقام في سياق عيد الميلاد
    if (ages.length === 0) {
      // البحث عن أرقام قريبة من كلمات عيد الميلاد
      const birthdayContext =
        /(?:عيد|ميلاد|birthday|احتفال)[^.]*?(\d{1,3})[^.]*?(?:سنة|عام|year)?/gi;
      let contextMatch;
      while ((contextMatch = birthdayContext.exec(normalizedText)) !== null) {
        const age = parseInt(contextMatch[1], 10);
        if (age >= 1 && age <= 120 && !ages.includes(age)) {
          ages.push(age);
        }
      }
    }

    // ترتيب الأعمار من الأصغر للأكبر
    ages.sort((a, b) => a - b);

    return ages.slice(0, 3); // الحد الأقصى 3 أعمار
  }

  /**
   * استخراج الكلمات المفتاحية من النص
   */
  private extractKeywords(text: string): string[] {
    const keywords: string[] = [];
    const words = text.split(/\s+/);

    // Filter meaningful words (length > 2, not common stop words)
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
      'كانت',
      'هو',
      'هي',
      'أن',
      'ما',
      'لا',
      'the',
      'a',
      'an',
      'is',
      'are',
      'was',
      'were',
      'of',
      'to',
      'in',
      'for',
    ];

    words.forEach((word) => {
      const cleanWord = word.replace(/[^\u0600-\u06FFa-zA-Z]/g, '');
      if (
        cleanWord.length > 2 &&
        !stopWords.includes(cleanWord.toLowerCase()) &&
        !keywords.includes(cleanWord)
      ) {
        keywords.push(cleanWord);
      }
    });

    return keywords.slice(0, 10); // Return top 10 keywords
  }

  /**
   * تحديد فئة الموضوع
   */
  detectCategory(topic: string, entities?: ExtractedEntities): TopicCategory {
    const lowerTopic = topic.toLowerCase();
    const ents = entities || this.extractEntities(topic);

    // Check for zodiac signs first (highest priority if found)
    if (ents.zodiacSigns.length > 0) {
      return 'zodiac';
    }

    // Check for zodiac keywords
    if (
      ZODIAC_SIGNS_AR.some((sign) => topic.includes(sign)) ||
      ZODIAC_SIGNS_EN.some((sign) => lowerTopic.includes(sign)) ||
      lowerTopic.includes('برج') ||
      lowerTopic.includes('أبراج') ||
      lowerTopic.includes('zodiac') ||
      lowerTopic.includes('horoscope')
    ) {
      return 'zodiac';
    }

    // Check for birthday keywords
    if (
      BIRTHDAY_KEYWORDS.some(
        (kw) => lowerTopic.includes(kw) || topic.includes(kw)
      )
    ) {
      return 'birthday';
    }

    // Check for health keywords
    if (
      HEALTH_KEYWORDS.some(
        (kw) => lowerTopic.includes(kw) || topic.includes(kw)
      )
    ) {
      return 'health';
    }

    // Check for date keywords
    if (
      DATE_KEYWORDS.some(
        (kw) => lowerTopic.includes(kw) || topic.includes(kw)
      ) ||
      ents.dates.length > 0
    ) {
      return 'dates';
    }

    // Default to general
    return 'general';
  }

  /**
   * تحديد الفئة الفرعية
   */
  private detectSubCategory(
    category: TopicCategory,
    entities: ExtractedEntities
  ): string | undefined {
    switch (category) {
      case 'zodiac':
        return entities.zodiacSigns[0]; // Return first zodiac sign
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
      case 'health':
        // Could detect specific health topics
        return undefined;
      default:
        return undefined;
    }
  }

  /**
   * اقتراح الكلمات المفتاحية
   */
  suggestKeywords(
    topic: string,
    category: TopicCategory,
    entities?: ExtractedEntities
  ): string[] {
    const keywords: string[] = [];
    const ents = entities || this.extractEntities(topic);

    // Add extracted keywords
    keywords.push(...ents.keywords);

    // Add category-specific keywords
    switch (category) {
      case 'zodiac':
        keywords.push('برج', 'أبراج', 'فلك', 'توقعات');
        if (ents.zodiacSigns.length > 0) {
          keywords.push(`برج ${ents.zodiacSigns[0]}`);
          keywords.push(`صفات ${ents.zodiacSigns[0]}`);
        }
        break;
      case 'birthday':
        keywords.push('عيد ميلاد', 'تهنئة', 'احتفال', 'هدايا');
        if (ents.ages.length > 0) {
          keywords.push(`عيد ميلاد ${ents.ages[0]}`);
        }
        if (ents.names.length > 0) {
          keywords.push(`عيد ميلاد ${ents.names[0]}`);
        }
        break;
      case 'health':
        keywords.push('صحة', 'نصائح صحية', 'عافية');
        break;
      case 'dates':
        keywords.push('تاريخ', 'تقويم', 'أحداث');
        break;
      default:
        keywords.push('معلومات', 'دليل', 'نصائح');
    }

    // Remove duplicates and return
    return [...new Set(keywords)].slice(0, 15);
  }

  /**
   * اقتراح الأقسام المناسبة للمقال
   */
  private suggestSections(
    category: TopicCategory,
    entities: ExtractedEntities
  ): string[] {
    const sections: string[] = [];

    // Common sections
    sections.push('introduction');

    switch (category) {
      case 'zodiac':
        sections.push('traits', 'compatibility', 'strengths', 'weaknesses');
        sections.push('love', 'career', 'health-tips');
        if (entities.zodiacSigns.length > 0) {
          sections.push('celebrities');
        }
        break;
      case 'birthday':
        sections.push('celebration-ideas', 'wishes', 'gift-ideas');
        if (entities.ages.length > 0) {
          sections.push('age-meaning', 'milestones');
        }
        sections.push('traditions', 'party-planning');
        break;
      case 'health':
        sections.push('importance', 'tips', 'prevention');
        sections.push('nutrition', 'exercise', 'mental-health');
        break;
      case 'dates':
        sections.push('historical-events', 'significance');
        sections.push('calendar-info', 'celebrations');
        break;
      default:
        sections.push('overview', 'details', 'tips');
        sections.push('facts', 'benefits');
    }

    // Common ending sections
    sections.push('faq', 'conclusion');

    return sections;
  }

  /**
   * تحديد نبرة المحتوى
   */
  private detectTone(topic: string): ContentTone {
    const lowerTopic = topic.toLowerCase();

    // Formal indicators
    if (
      lowerTopic.includes('علمي') ||
      lowerTopic.includes('بحث') ||
      lowerTopic.includes('دراسة') ||
      lowerTopic.includes('طبي')
    ) {
      return 'formal';
    }

    // Casual/friendly indicators
    if (
      lowerTopic.includes('عيد') ||
      lowerTopic.includes('احتفال') ||
      lowerTopic.includes('مرح') ||
      lowerTopic.includes('ممتع')
    ) {
      return 'friendly';
    }

    // SEO-focused
    if (
      lowerTopic.includes('كيف') ||
      lowerTopic.includes('أفضل') ||
      lowerTopic.includes('دليل')
    ) {
      return 'seo';
    }

    // Default to engaging
    return 'engaging';
  }

  /**
   * حساب مستوى الثقة في التحليل
   */
  private calculateConfidence(
    category: TopicCategory,
    entities: ExtractedEntities,
    keywords: string[]
  ): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence based on entities found
    if (entities.zodiacSigns.length > 0) confidence += 0.2;
    if (entities.names.length > 0) confidence += 0.1;
    if (entities.ages.length > 0) confidence += 0.1;
    if (entities.dates.length > 0) confidence += 0.1;
    if (keywords.length > 5) confidence += 0.1;

    // Category-specific confidence boost
    if (category !== 'general') confidence += 0.1;

    return Math.min(confidence, 1.0);
  }
}

// Export singleton instance
export const topicAnalyzer = new TopicAnalyzer();
