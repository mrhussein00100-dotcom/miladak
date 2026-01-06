/**
 * Smart Image Search - نظام بحث ذكي عن الصور
 * Version 1.0
 *
 * يحسن دقة الصور المختارة بناءً على:
 * - استخراج كلمات مفتاحية خاصة بالموضوع
 * - قاموس موسّع حسب الفئة
 * - أولوية للصور المطابقة للموضوع
 */

// ===== قاموس الترجمة المتخصص حسب الفئة =====

export const CATEGORY_SPECIFIC_KEYWORDS: Record<
  string,
  Record<string, string[]>
> = {
  // ===== الأبراج - صور فلكية ونجومية =====
  zodiac: {
    'برج الحمل': [
      'aries constellation stars',
      'ram zodiac symbol',
      'fire sign astrology',
    ],
    'برج الثور': [
      'taurus constellation stars',
      'bull zodiac symbol',
      'earth sign astrology',
    ],
    'برج الجوزاء': [
      'gemini constellation stars',
      'twins zodiac symbol',
      'air sign astrology',
    ],
    'برج السرطان': [
      'cancer constellation stars',
      'crab zodiac symbol',
      'water sign astrology',
    ],
    'برج الأسد': [
      'leo constellation stars',
      'lion zodiac symbol',
      'fire sign astrology',
    ],
    'برج العذراء': [
      'virgo constellation stars',
      'maiden zodiac symbol',
      'earth sign astrology',
    ],
    'برج الميزان': [
      'libra constellation stars',
      'scales zodiac symbol',
      'air sign astrology',
    ],
    'برج العقرب': [
      'scorpio constellation stars',
      'scorpion zodiac symbol',
      'water sign astrology',
    ],
    'برج القوس': [
      'sagittarius constellation stars',
      'archer zodiac symbol',
      'fire sign astrology',
    ],
    'برج الجدي': [
      'capricorn constellation stars',
      'goat zodiac symbol',
      'earth sign astrology',
    ],
    'برج الدلو': [
      'aquarius constellation stars',
      'water bearer zodiac symbol',
      'air sign astrology',
    ],
    'برج الحوت': [
      'pisces constellation stars',
      'fish zodiac symbol',
      'water sign astrology',
    ],
    الحمل: ['aries zodiac fire element', 'ram astrology symbol'],
    الثور: ['taurus zodiac earth element', 'bull astrology symbol'],
    الجوزاء: ['gemini zodiac air element', 'twins astrology symbol'],
    السرطان: ['cancer zodiac water element', 'crab astrology symbol'],
    الأسد: ['leo zodiac fire element', 'lion astrology symbol'],
    العذراء: ['virgo zodiac earth element', 'maiden astrology symbol'],
    الميزان: ['libra zodiac air element', 'scales astrology symbol'],
    العقرب: ['scorpio zodiac water element', 'scorpion astrology symbol'],
    القوس: ['sagittarius zodiac fire element', 'archer astrology symbol'],
    الجدي: ['capricorn zodiac earth element', 'goat astrology symbol'],
    الدلو: ['aquarius zodiac air element', 'water bearer astrology symbol'],
    الحوت: ['pisces zodiac water element', 'fish astrology symbol'],
    أبراج: ['zodiac wheel horoscope', 'astrology signs circle'],
    توافق: ['zodiac compatibility love', 'horoscope match hearts'],
    صفات: ['zodiac personality traits', 'astrology characteristics'],
    فلك: ['astrology cosmos universe', 'celestial stars night'],
    نجوم: ['starry night sky', 'constellation stars beautiful'],
  },

  // ===== حساب العمر - صور احتفالية ومراحل عمرية =====
  age: {
    'حساب العمر': ['birthday milestone celebration', 'age celebration happy'],
    'كم عمري': ['birthday age calculator', 'life journey celebration'],
    'عمر بالأيام': ['days counting calendar', 'time passing milestone'],
    'عمر بالشهور': ['months milestone baby', 'monthly celebration'],
    'عمر بالسنوات': ['years birthday celebration', 'annual milestone'],
    'إحصائيات الحياة': ['life statistics journey', 'life milestones timeline'],
    'رحلة الحياة': ['life journey path', 'life celebration moments'],
    'مراحل العمر': ['life stages growth', 'age milestones journey'],
    طفل: ['child happy playing', 'kid smiling joyful'],
    رضيع: ['baby cute adorable', 'infant newborn sweet'],
    مراهق: ['teenager young happy', 'teen celebration'],
    شاب: ['young adult celebration', 'youth happy moment'],
    كبير: ['senior celebration happy', 'elderly wisdom joy'],
  },

  // ===== الصحة - صور صحية وطبية =====
  health: {
    'حاسبة السعرات': ['healthy food nutrition', 'calorie counting diet'],
    'حاسبة BMI': ['body fitness health', 'weight scale healthy'],
    'مؤشر كتلة الجسم': ['body mass index health', 'fitness measurement'],
    'حاسبة الحمل': ['pregnancy expecting mother', 'pregnant woman happy'],
    'أسابيع الحمل': ['pregnancy weeks development', 'baby bump growth'],
    'نمو الطفل': ['child growth development', 'baby milestones'],
    صحة: ['health wellness lifestyle', 'healthy living nature'],
    وزن: ['weight scale fitness', 'healthy weight management'],
    طول: ['height measurement growth', 'tall healthy person'],
    تغذية: ['nutrition healthy food', 'balanced diet vegetables'],
    رياضة: ['exercise fitness workout', 'sports healthy lifestyle'],
  },

  // ===== عيد الميلاد - صور احتفالية متنوعة =====
  birthday: {
    'عيد ميلاد': ['birthday celebration party', 'birthday cake candles'],
    'عيد ميلاد سعيد': ['happy birthday celebration', 'birthday wishes joy'],
    'كيكة عيد ميلاد': ['birthday cake colorful', 'celebration cake candles'],
    شموع: ['birthday candles glowing', 'cake candles celebration'],
    بالونات: ['colorful balloons party', 'birthday balloons festive'],
    هدايا: ['birthday gifts wrapped', 'presents celebration'],
    حفلة: ['birthday party celebration', 'festive party decorations'],
    تهنئة: ['birthday wishes greeting', 'congratulations celebration'],
    زينة: ['party decorations colorful', 'festive decorations birthday'],
    احتفال: ['celebration party joyful', 'festive gathering happy'],
    مفاجأة: ['surprise party birthday', 'unexpected celebration'],
    عائلة: ['family celebration together', 'family birthday party'],
    أصدقاء: ['friends party celebration', 'friendship birthday'],
  },

  // ===== أحجار وزهور الميلاد =====
  birthstones: {
    'حجر الميلاد': ['birthstone gemstone jewelry', 'precious stone beautiful'],
    العقيق: ['garnet gemstone red', 'january birthstone'],
    الجمشت: ['amethyst purple gemstone', 'february birthstone'],
    الزبرجد: ['aquamarine blue gemstone', 'march birthstone'],
    الماس: ['diamond brilliant sparkle', 'april birthstone'],
    الزمرد: ['emerald green gemstone', 'may birthstone'],
    اللؤلؤ: ['pearl white elegant', 'june birthstone'],
    الياقوت: ['ruby red gemstone', 'july birthstone'],
    'زهرة الميلاد': ['birth flower beautiful', 'flower bouquet colorful'],
    ورد: ['roses beautiful red', 'rose flowers romantic'],
    زهور: ['flowers colorful bouquet', 'blooming flowers garden'],
  },

  // ===== عام =====
  general: {
    معلومات: ['information knowledge learning', 'facts data'],
    دليل: ['guide handbook tutorial', 'instruction manual'],
    نصائح: ['tips advice helpful', 'suggestions guidance'],
    أفكار: ['ideas creative inspiration', 'innovative concepts'],
    حقائق: ['facts truth knowledge', 'information data'],
  },
};

// ===== كلمات مفتاحية للصورة البارزة حسب الفئة =====
export const FEATURED_IMAGE_KEYWORDS: Record<string, string[]> = {
  zodiac: [
    'zodiac wheel astrology beautiful',
    'constellation stars night sky',
    'horoscope symbols elegant',
    'astrology cosmic universe',
    'starry night beautiful',
  ],
  age: [
    'birthday celebration happy',
    'life journey milestone',
    'celebration cake candles',
    'happy moments family',
    'milestone celebration joyful',
  ],
  health: [
    'health wellness lifestyle',
    'healthy living nature',
    'fitness wellness happy',
    'nutrition healthy food',
    'wellness meditation peaceful',
  ],
  birthday: [
    'birthday celebration colorful',
    'birthday cake beautiful',
    'party celebration festive',
    'birthday balloons decorations',
    'celebration happy joyful',
  ],
  birthstones: [
    'gemstones colorful beautiful',
    'precious stones jewelry',
    'flowers bouquet colorful',
    'gemstone jewelry elegant',
    'birthstone collection beautiful',
  ],
  general: [
    'celebration colorful happy',
    'beautiful moment joyful',
    'inspiration creative',
    'success achievement',
    'happy moment celebration',
  ],
};

/**
 * تحديد فئة الموضوع
 */
export function detectTopicCategory(topic: string): string {
  const categoryPatterns: Record<string, string[]> = {
    zodiac: [
      'برج',
      'أبراج',
      'فلك',
      'نجوم',
      'توافق',
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
    ],
    age: [
      'عمر',
      'سنة',
      'شهر',
      'يوم',
      'حساب',
      'كم عمري',
      'إحصائيات',
      'رحلة الحياة',
    ],
    health: ['صحة', 'سعرات', 'BMI', 'حمل', 'نمو', 'وزن', 'طول', 'تغذية'],
    birthday: [
      'عيد ميلاد',
      'ميلاد',
      'كيك',
      'شموع',
      'بالونات',
      'هدايا',
      'حفلة',
      'تهنئة',
      'احتفال',
    ],
    birthstones: [
      'حجر',
      'أحجار',
      'زهرة',
      'زهور',
      'ورد',
      'ماس',
      'ياقوت',
      'زمرد',
      'لؤلؤ',
    ],
  };

  for (const [category, patterns] of Object.entries(categoryPatterns)) {
    for (const pattern of patterns) {
      if (topic.includes(pattern)) {
        return category;
      }
    }
  }

  return 'general';
}

/**
 * استخراج كلمات مفتاحية خاصة بالموضوع
 */
export function extractTopicSpecificKeywords(topic: string): string[] {
  const category = detectTopicCategory(topic);
  const categoryKeywords =
    CATEGORY_SPECIFIC_KEYWORDS[category] || CATEGORY_SPECIFIC_KEYWORDS.general;

  const keywords: string[] = [];
  const seenKeywords = new Set<string>();

  // البحث عن مطابقات في القاموس المتخصص
  // ترتيب المفاتيح حسب الطول (الأطول أولاً)
  const sortedKeys = Object.keys(categoryKeywords).sort(
    (a, b) => b.length - a.length
  );

  for (const arabicTerm of sortedKeys) {
    if (topic.includes(arabicTerm)) {
      const englishTerms = categoryKeywords[arabicTerm];
      for (const term of englishTerms) {
        if (!seenKeywords.has(term.toLowerCase())) {
          keywords.push(term);
          seenKeywords.add(term.toLowerCase());
        }
      }
    }
  }

  // إذا لم نجد كلمات كافية، أضف كلمات سياقية
  if (keywords.length < 2) {
    const contextKeywords =
      FEATURED_IMAGE_KEYWORDS[category] || FEATURED_IMAGE_KEYWORDS.general;
    for (const kw of contextKeywords.slice(0, 2)) {
      if (!seenKeywords.has(kw.toLowerCase())) {
        keywords.push(kw);
        seenKeywords.add(kw.toLowerCase());
      }
    }
  }

  return keywords.slice(0, 5); // أقصى 5 كلمات مفتاحية
}

/**
 * الحصول على استعلام الصورة البارزة
 */
export function getFeaturedImageQuery(topic: string): string {
  const category = detectTopicCategory(topic);
  const featuredKeywords =
    FEATURED_IMAGE_KEYWORDS[category] || FEATURED_IMAGE_KEYWORDS.general;

  // استخراج كلمات من الموضوع
  const topicKeywords = extractTopicSpecificKeywords(topic);

  if (topicKeywords.length > 0) {
    // دمج أول كلمة من الموضوع مع كلمة من الفئة
    const topicPart = topicKeywords[0].split(' ').slice(0, 2).join(' ');
    const categoryPart = featuredKeywords[0].split(' ').slice(0, 2).join(' ');
    return `${topicPart} ${categoryPart}`;
  }

  // استخدام كلمات الفئة فقط
  return featuredKeywords[Math.floor(Math.random() * featuredKeywords.length)];
}

/**
 * حساب نقاط صلة الصورة بالموضوع
 */
export function calculateImageRelevanceScore(
  imageAlt: string,
  topic: string,
  searchQuery: string
): number {
  let score = 0;
  const altLower = (imageAlt || '').toLowerCase();

  // استخراج كلمات الموضوع
  const topicKeywords = extractTopicSpecificKeywords(topic);
  const queryWords = searchQuery.toLowerCase().split(/\s+/);

  // نقاط عالية لمطابقة كلمات الموضوع
  for (const keyword of topicKeywords) {
    const words = keyword.toLowerCase().split(/\s+/);
    for (const word of words) {
      if (word.length > 2 && altLower.includes(word)) {
        score += 25; // نقاط عالية للموضوع
      }
    }
  }

  // نقاط لكلمات استعلام البحث
  for (const word of queryWords) {
    if (word.length > 2 && altLower.includes(word)) {
      score += 10;
    }
  }

  // نقاط إضافية للوصف الطويل
  if (imageAlt && imageAlt.length > 30) score += 5;
  if (imageAlt && imageAlt.length > 60) score += 5;

  return score;
}

export default {
  CATEGORY_SPECIFIC_KEYWORDS,
  FEATURED_IMAGE_KEYWORDS,
  detectTopicCategory,
  extractTopicSpecificKeywords,
  getFeaturedImageQuery,
  calculateImageRelevanceScore,
};
