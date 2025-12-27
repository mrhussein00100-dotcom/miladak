/**
 * SONA v4 Topic Analyzer
 * محلل الموضوع - يحلل النص ويستخرج الكيانات والفئات
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

import {
  TopicAnalysis,
  TopicCategory,
  ExtractedEntities,
  ContentTone,
} from './types';

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

/**
 * Topic Analyzer Class
 * يحلل الموضوع ويستخرج المعلومات المهمة
 */
export class TopicAnalyzer {
  /**
   * تحليل الموضوع بالكامل
   */
  analyze(topic: string): TopicAnalysis {
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
   * استخراج الأسماء من النص
   */
  private extractNames(text: string): string[] {
    const names: string[] = [];

    // Pattern for Arabic names (words starting with ال or common name patterns)
    // Look for patterns like "اسم X" or "لـ X" or "عيد ميلاد X"
    const namePatterns = [
      /(?:اسم|لـ|عيد ميلاد|ميلاد)\s+([أ-ي]+(?:\s+[أ-ي]+)?)/gi,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g, // English names
    ];

    namePatterns.forEach((pattern) => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          const cleanName = match
            .replace(/^(اسم|لـ|عيد ميلاد|ميلاد)\s+/i, '')
            .trim();
          if (cleanName.length > 1 && !names.includes(cleanName)) {
            names.push(cleanName);
          }
        });
      }
    });

    return names;
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
   * استخراج الأعمار من النص
   */
  private extractAges(text: string): number[] {
    const ages: number[] = [];

    // Patterns for age extraction
    const agePatterns = [
      /(\d+)\s*(?:سنة|سنوات|عام|أعوام|years?|yo)/gi,
      /(?:عمر|age)\s*:?\s*(\d+)/gi,
      /(\d+)\s*(?:عيد ميلاد)/gi,
    ];

    agePatterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const age = parseInt(match[1], 10);
        if (age > 0 && age < 150 && !ages.includes(age)) {
          ages.push(age);
        }
      }
    });

    return ages;
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
