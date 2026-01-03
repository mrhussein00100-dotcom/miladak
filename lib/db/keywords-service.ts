/**
 * خدمة الكلمات المفتاحية
 * للوصول لجدول page_keywords واستخدامه في التوليد والبحث عن الصور
 */

import { query, queryOne } from './database';

export interface PageKeyword {
  id: number;
  page_slug: string;
  keyword: string;
  keyword_en: string | null;
  search_volume: number;
  category: string | null;
  created_at: string;
}

// قاموس الترجمة للكلمات الشائعة
const TRANSLATION_DICTIONARY: Record<string, string> = {
  // عيد الميلاد
  'عيد ميلاد': 'birthday celebration',
  'عيد ميلاد سعيد': 'happy birthday',
  'تهنئة عيد ميلاد': 'birthday wishes',
  'كيكة عيد ميلاد': 'birthday cake',
  'هدايا عيد ميلاد': 'birthday gifts',
  'حفلة عيد ميلاد': 'birthday party',
  'شموع عيد ميلاد': 'birthday candles',
  بالونات: 'balloons',
  احتفال: 'celebration',
  تهنئة: 'congratulations',
  هدية: 'gift',
  كيك: 'cake',

  // الأبراج
  'برج الحمل': 'aries zodiac',
  'برج الثور': 'taurus zodiac',
  'برج الجوزاء': 'gemini zodiac',
  'برج السرطان': 'cancer zodiac',
  'برج الأسد': 'leo zodiac',
  'برج العذراء': 'virgo zodiac',
  'برج الميزان': 'libra zodiac',
  'برج العقرب': 'scorpio zodiac',
  'برج القوس': 'sagittarius zodiac',
  'برج الجدي': 'capricorn zodiac',
  'برج الدلو': 'aquarius zodiac',
  'برج الحوت': 'pisces zodiac',
  الحمل: 'aries',
  الثور: 'taurus',
  الجوزاء: 'gemini',
  السرطان: 'cancer',
  الأسد: 'leo',
  العذراء: 'virgo',
  الميزان: 'libra',
  العقرب: 'scorpio',
  القوس: 'sagittarius',
  الجدي: 'capricorn',
  الدلو: 'aquarius',
  الحوت: 'pisces',
  أبراج: 'zodiac signs',
  برج: 'zodiac sign',
  فلك: 'astrology',
  'توافق الأبراج': 'zodiac compatibility',
  'صفات برج': 'zodiac traits',

  // الصحة
  صحة: 'health wellness',
  وزن: 'weight',
  طول: 'height',
  'سعرات حرارية': 'calories',
  'مؤشر كتلة الجسم': 'BMI body mass index',
  'نظام غذائي': 'diet nutrition',
  تمارين: 'exercise fitness',
  لياقة: 'fitness',

  // الحمل
  حمل: 'pregnancy',
  حامل: 'pregnant',
  جنين: 'fetus baby',
  'أسبوع الحمل': 'pregnancy week',
  ولادة: 'birth delivery',
  مولود: 'newborn baby',
  رضيع: 'infant baby',

  // العمر
  عمر: 'age',
  'حساب العمر': 'age calculator',
  'كم عمري': 'how old am I',
  سنة: 'year',
  شهر: 'month',
  يوم: 'day',

  // العائلة
  عائلة: 'family',
  طفل: 'child kid',
  أطفال: 'children kids',
  أم: 'mother mom',
  أب: 'father dad',

  // عام
  سعيد: 'happy',
  جميل: 'beautiful',
  رائع: 'wonderful amazing',
  حب: 'love',
  فرح: 'joy happiness',
  ذكرى: 'anniversary memory',
};

// فئات الكلمات المفتاحية
export type KeywordCategory =
  | 'birthday'
  | 'zodiac'
  | 'health'
  | 'pregnancy'
  | 'age'
  | 'general';

/**
 * جلب الكلمات المفتاحية حسب الفئة
 */
export async function getKeywordsByCategory(
  category: KeywordCategory,
  limit: number = 50
): Promise<PageKeyword[]> {
  try {
    // محاولة جلب من جدول page_keywords
    const results = await query<PageKeyword>(
      `SELECT * FROM page_keywords WHERE category = ? ORDER BY search_volume DESC LIMIT ?`,
      [category, limit]
    );

    if (results.length > 0) {
      return results;
    }

    // إذا لم نجد، نرجع كلمات افتراضية
    return getDefaultKeywords(category);
  } catch (error) {
    console.warn(`⚠️ [KeywordsService] خطأ في جلب الكلمات المفتاحية:`, error);
    return getDefaultKeywords(category);
  }
}

/**
 * جلب الكلمات المفتاحية حسب الموضوع
 */
export async function getKeywordsByTopic(
  topic: string,
  limit: number = 20
): Promise<PageKeyword[]> {
  try {
    // البحث في الكلمات المفتاحية
    const results = await query<PageKeyword>(
      `SELECT * FROM page_keywords 
       WHERE keyword LIKE ? OR page_slug LIKE ?
       ORDER BY search_volume DESC LIMIT ?`,
      [`%${topic}%`, `%${topic}%`, limit]
    );

    if (results.length > 0) {
      return results;
    }

    // تحديد الفئة من الموضوع
    const category = detectCategoryFromTopic(topic);
    return getDefaultKeywords(category);
  } catch (error) {
    console.warn(
      `⚠️ [KeywordsService] خطأ في البحث عن الكلمات المفتاحية:`,
      error
    );
    const category = detectCategoryFromTopic(topic);
    return getDefaultKeywords(category);
  }
}

/**
 * ترجمة الكلمات العربية للإنجليزية
 */
export async function getEnglishKeywords(
  arabicKeywords: string[]
): Promise<string[]> {
  const englishKeywords: string[] = [];
  const seenKeywords = new Set<string>();

  for (const keyword of arabicKeywords) {
    // البحث في القاموس المحلي أولاً
    const translation = translateKeyword(keyword);
    if (translation && !seenKeywords.has(translation.toLowerCase())) {
      englishKeywords.push(translation);
      seenKeywords.add(translation.toLowerCase());
    }

    // محاولة جلب الترجمة من قاعدة البيانات
    try {
      const dbKeyword = await queryOne<PageKeyword>(
        `SELECT * FROM page_keywords WHERE keyword = ? AND keyword_en IS NOT NULL`,
        [keyword]
      );

      if (
        dbKeyword?.keyword_en &&
        !seenKeywords.has(dbKeyword.keyword_en.toLowerCase())
      ) {
        englishKeywords.push(dbKeyword.keyword_en);
        seenKeywords.add(dbKeyword.keyword_en.toLowerCase());
      }
    } catch (error) {
      // تجاهل الخطأ واستمر
    }
  }

  return englishKeywords;
}

/**
 * جلب كلمات عشوائية للتنوع
 */
export async function getRandomKeywords(
  category: KeywordCategory,
  count: number = 10
): Promise<PageKeyword[]> {
  try {
    const results = await query<PageKeyword>(
      `SELECT * FROM page_keywords 
       WHERE category = ? 
       ORDER BY RANDOM() LIMIT ?`,
      [category, count]
    );

    if (results.length > 0) {
      return results;
    }

    return getDefaultKeywords(category).slice(0, count);
  } catch (error) {
    console.warn(`⚠️ [KeywordsService] خطأ في جلب كلمات عشوائية:`, error);
    return getDefaultKeywords(category).slice(0, count);
  }
}

/**
 * ترجمة كلمة مفتاحية واحدة
 */
export function translateKeyword(keyword: string): string | null {
  // البحث المباشر
  if (TRANSLATION_DICTIONARY[keyword]) {
    return TRANSLATION_DICTIONARY[keyword];
  }

  // البحث في المفاتيح الأطول أولاً
  const sortedKeys = Object.keys(TRANSLATION_DICTIONARY).sort(
    (a, b) => b.length - a.length
  );

  for (const key of sortedKeys) {
    if (keyword.includes(key)) {
      return TRANSLATION_DICTIONARY[key];
    }
  }

  return null;
}

/**
 * ترجمة موضوع كامل للإنجليزية
 */
export function translateTopic(topic: string): string {
  const translations: string[] = [];
  let remainingTopic = topic;

  // ترتيب المفاتيح حسب الطول (الأطول أولاً)
  const sortedKeys = Object.keys(TRANSLATION_DICTIONARY).sort(
    (a, b) => b.length - a.length
  );

  for (const key of sortedKeys) {
    if (remainingTopic.includes(key)) {
      translations.push(TRANSLATION_DICTIONARY[key]);
      remainingTopic = remainingTopic.replace(new RegExp(key, 'g'), ' ');
    }
  }

  // إذا لم نجد ترجمات، نرجع كلمات افتراضية حسب السياق
  if (translations.length === 0) {
    const category = detectCategoryFromTopic(topic);
    return getDefaultEnglishKeywords(category);
  }

  return translations.slice(0, 5).join(' ');
}

/**
 * تحديد الفئة من الموضوع
 */
export function detectCategoryFromTopic(topic: string): KeywordCategory {
  const lowerTopic = topic.toLowerCase();

  // عيد الميلاد
  if (
    lowerTopic.includes('عيد ميلاد') ||
    lowerTopic.includes('ميلاد') ||
    lowerTopic.includes('تهنئة') ||
    lowerTopic.includes('كيك')
  ) {
    return 'birthday';
  }

  // الأبراج
  const zodiacSigns = [
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
  if (
    lowerTopic.includes('برج') ||
    lowerTopic.includes('أبراج') ||
    lowerTopic.includes('فلك') ||
    zodiacSigns.some((sign) => lowerTopic.includes(sign))
  ) {
    return 'zodiac';
  }

  // الصحة
  if (
    lowerTopic.includes('صحة') ||
    lowerTopic.includes('وزن') ||
    lowerTopic.includes('سعرات') ||
    lowerTopic.includes('تمارين')
  ) {
    return 'health';
  }

  // الحمل
  if (
    lowerTopic.includes('حمل') ||
    lowerTopic.includes('حامل') ||
    lowerTopic.includes('جنين') ||
    lowerTopic.includes('ولادة')
  ) {
    return 'pregnancy';
  }

  // العمر
  if (
    lowerTopic.includes('عمر') ||
    lowerTopic.includes('سنة') ||
    lowerTopic.includes('كم عمري')
  ) {
    return 'age';
  }

  return 'general';
}

/**
 * الكلمات المفتاحية الافتراضية لكل فئة
 */
function getDefaultKeywords(category: KeywordCategory): PageKeyword[] {
  const defaults: Record<KeywordCategory, string[]> = {
    birthday: [
      'عيد ميلاد سعيد',
      'تهنئة عيد ميلاد',
      'كيكة عيد ميلاد',
      'هدايا عيد ميلاد',
      'حفلة عيد ميلاد',
      'شموع عيد ميلاد',
      'بالونات',
      'احتفال',
      'تهنئة',
      'هدية',
    ],
    zodiac: [
      'برج الحمل',
      'برج الثور',
      'برج الجوزاء',
      'برج السرطان',
      'برج الأسد',
      'برج العذراء',
      'برج الميزان',
      'برج العقرب',
      'برج القوس',
      'برج الجدي',
      'برج الدلو',
      'برج الحوت',
      'توافق الأبراج',
      'صفات برج',
      'أبراج',
    ],
    health: [
      'صحة',
      'وزن',
      'طول',
      'سعرات حرارية',
      'مؤشر كتلة الجسم',
      'نظام غذائي',
      'تمارين',
      'لياقة',
      'صحة الجسم',
      'نصائح صحية',
    ],
    pregnancy: [
      'حمل',
      'حامل',
      'جنين',
      'أسبوع الحمل',
      'ولادة',
      'مولود',
      'رضيع',
      'تطور الجنين',
      'صحة الحامل',
      'نصائح للحامل',
    ],
    age: [
      'عمر',
      'حساب العمر',
      'كم عمري',
      'سنة',
      'شهر',
      'يوم',
      'عمر بالأيام',
      'عمر بالشهور',
      'عمر بالسنوات',
      'حاسبة العمر',
    ],
    general: [
      'معلومات',
      'نصائح',
      'دليل',
      'شرح',
      'تعلم',
      'فوائد',
      'أهمية',
      'طريقة',
      'كيفية',
      'أفضل',
    ],
  };

  return defaults[category].map((keyword, index) => ({
    id: index + 1,
    page_slug: keyword.replace(/\s+/g, '-'),
    keyword,
    keyword_en: translateKeyword(keyword),
    search_volume: 1000 - index * 50,
    category,
    created_at: new Date().toISOString(),
  }));
}

/**
 * الكلمات الإنجليزية الافتراضية لكل فئة
 */
function getDefaultEnglishKeywords(category: KeywordCategory): string {
  const defaults: Record<KeywordCategory, string> = {
    birthday: 'birthday celebration party cake',
    zodiac: 'zodiac astrology horoscope stars',
    health: 'health wellness fitness nutrition',
    pregnancy: 'pregnancy baby newborn mother',
    age: 'birthday age celebration milestone',
    general: 'information guide tips advice',
  };

  return defaults[category];
}

/**
 * استخراج الكلمات المفتاحية من نص
 */
export function extractKeywordsFromText(
  text: string,
  maxKeywords: number = 15
): string[] {
  const keywords: string[] = [];
  const seenKeywords = new Set<string>();

  // البحث عن الكلمات المعروفة في النص
  const sortedKeys = Object.keys(TRANSLATION_DICTIONARY).sort(
    (a, b) => b.length - a.length
  );

  for (const key of sortedKeys) {
    if (text.includes(key) && !seenKeywords.has(key)) {
      keywords.push(key);
      seenKeywords.add(key);

      if (keywords.length >= maxKeywords) break;
    }
  }

  return keywords;
}

/**
 * الحصول على كلمات مفتاحية للبحث عن الصور
 */
export async function getImageSearchKeywords(
  topic: string,
  category?: KeywordCategory
): Promise<string[]> {
  const detectedCategory = category || detectCategoryFromTopic(topic);

  // استخراج الكلمات من الموضوع
  const topicKeywords = extractKeywordsFromText(topic);

  // جلب كلمات إضافية من قاعدة البيانات
  const dbKeywords = await getKeywordsByCategory(detectedCategory, 10);

  // ترجمة الكلمات للإنجليزية
  const allArabicKeywords = [
    ...topicKeywords,
    ...dbKeywords.map((k) => k.keyword),
  ];

  const englishKeywords = await getEnglishKeywords(allArabicKeywords);

  // إضافة ترجمة الموضوع مباشرة
  const topicTranslation = translateTopic(topic);
  if (topicTranslation) {
    englishKeywords.unshift(topicTranslation);
  }

  // إزالة التكرارات
  const uniqueKeywords = [...new Set(englishKeywords)];

  return uniqueKeywords.slice(0, 10);
}

export default {
  getKeywordsByCategory,
  getKeywordsByTopic,
  getEnglishKeywords,
  getRandomKeywords,
  translateKeyword,
  translateTopic,
  detectCategoryFromTopic,
  extractKeywordsFromText,
  getImageSearchKeywords,
};
