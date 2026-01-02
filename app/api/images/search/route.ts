import { NextRequest, NextResponse } from 'next/server';
import { topicToEnglishKeywords } from '@/lib/images/pexels';
import {
  CORE_KEYWORDS_AR,
  CORE_KEYWORDS_EN,
  PAGE_KEYWORDS,
  LONG_TAIL_KEYWORDS,
} from '@/lib/seo/keywords';
import { query } from '@/lib/db/database';

// ===== قاموس شامل للترجمة من العربية للإنجليزية =====
// يجمع بين الكلمات المفتاحية من SEO + قاعدة البيانات + القاموس الثابت
const comprehensiveDictionary: Record<string, string[]> = {
  // ===== عيد الميلاد والاحتفالات =====
  'عيد ميلاد': ['birthday celebration', 'birthday party', 'happy birthday'],
  'عيد ميلاد سعيد': [
    'happy birthday celebration',
    'birthday wishes',
    'birthday joy',
  ],
  كيكة: ['birthday cake', 'celebration cake', 'party cake'],
  'كيكة عيد ميلاد': ['birthday cake candles', 'celebration cake', 'party cake'],
  شموع: ['birthday candles', 'cake candles', 'celebration candles'],
  بالونات: ['balloons party', 'colorful balloons', 'party balloons'],
  هدايا: ['gifts presents', 'gift boxes', 'birthday gifts'],
  حفلة: ['party celebration', 'festive gathering', 'birthday party'],
  احتفال: ['celebration festivity', 'party event', 'joyful celebration'],
  زينة: ['decorations party', 'festive decorations', 'party decor'],
  تهنئة: ['congratulations wishes', 'birthday greeting', 'celebration wishes'],
  أمنيات: ['wishes birthday', 'best wishes', 'birthday wishes'],
  مفاجأة: ['surprise party', 'surprise celebration', 'unexpected joy'],

  // ===== حساب العمر =====
  'حاسبة العمر': ['age calculator', 'birthday calculator', 'age counter'],
  'حساب العمر': ['calculate age', 'age calculation', 'birthday age'],
  'كم عمري': ['how old am i', 'age finder', 'age calculator'],
  عمر: ['age birthday', 'years old', 'age milestone'],
  سنة: ['year birthday', 'yearly celebration', 'anniversary'],
  شهر: ['month milestone', 'monthly celebration', 'month old'],
  يوم: ['day celebration', 'daily milestone', 'special day'],
  'العمر بالأيام': ['age in days', 'days lived', 'daily age'],
  'العمر بالساعات': ['age in hours', 'hours lived', 'time lived'],
  'إحصائيات الحياة': ['life statistics', 'life journey', 'life milestones'],
  'رحلة الحياة': ['life journey', 'life path', 'life celebration'],

  // ===== الأبراج الفلكية =====
  'برج الحمل': ['aries zodiac', 'aries constellation', 'ram zodiac sign'],
  'برج الثور': ['taurus zodiac', 'taurus constellation', 'bull zodiac sign'],
  'برج الجوزاء': ['gemini zodiac', 'gemini constellation', 'twins zodiac sign'],
  'برج السرطان': ['cancer zodiac', 'cancer constellation', 'crab zodiac sign'],
  'برج الأسد': ['leo zodiac', 'leo constellation', 'lion zodiac sign'],
  'برج العذراء': ['virgo zodiac', 'virgo constellation', 'maiden zodiac sign'],
  'برج الميزان': ['libra zodiac', 'libra constellation', 'scales zodiac sign'],
  'برج العقرب': [
    'scorpio zodiac',
    'scorpio constellation',
    'scorpion zodiac sign',
  ],
  'برج القوس': [
    'sagittarius zodiac',
    'sagittarius constellation',
    'archer zodiac sign',
  ],
  'برج الجدي': [
    'capricorn zodiac',
    'capricorn constellation',
    'goat zodiac sign',
  ],
  'برج الدلو': [
    'aquarius zodiac',
    'aquarius constellation',
    'water bearer zodiac sign',
  ],
  'برج الحوت': ['pisces zodiac', 'pisces constellation', 'fish zodiac sign'],
  الحمل: ['aries zodiac fire', 'ram astrology', 'aries horoscope'],
  الثور: ['taurus zodiac earth', 'bull astrology', 'taurus horoscope'],
  الجوزاء: ['gemini zodiac air', 'twins astrology', 'gemini horoscope'],
  السرطان: ['cancer zodiac water', 'crab astrology', 'cancer horoscope'],
  الأسد: ['leo zodiac fire', 'lion astrology', 'leo horoscope'],
  العذراء: ['virgo zodiac earth', 'maiden astrology', 'virgo horoscope'],
  الميزان: ['libra zodiac air', 'scales astrology', 'libra horoscope'],
  العقرب: ['scorpio zodiac water', 'scorpion astrology', 'scorpio horoscope'],
  القوس: [
    'sagittarius zodiac fire',
    'archer astrology',
    'sagittarius horoscope',
  ],
  الجدي: ['capricorn zodiac earth', 'goat astrology', 'capricorn horoscope'],
  الدلو: [
    'aquarius zodiac air',
    'water bearer astrology',
    'aquarius horoscope',
  ],
  الحوت: ['pisces zodiac water', 'fish astrology', 'pisces horoscope'],
  برج: ['zodiac sign', 'horoscope', 'astrology symbol'],
  أبراج: ['zodiac signs', 'horoscope wheel', 'astrology'],
  فلك: ['astrology stars', 'astronomy cosmos', 'celestial'],
  نجوم: ['stars night sky', 'starry sky', 'twinkling stars'],
  'توافق الأبراج': ['zodiac compatibility', 'horoscope match', 'zodiac love'],
  'صفات البرج': [
    'zodiac traits',
    'horoscope personality',
    'zodiac characteristics',
  ],

  // ===== البرج الصيني =====
  'البرج الصيني': ['chinese zodiac', 'chinese horoscope', 'chinese astrology'],
  'برج الفأر': ['rat zodiac chinese', 'mouse zodiac', 'rat chinese astrology'],
  'برج الثور الصيني': [
    'ox zodiac chinese',
    'ox chinese astrology',
    'bull chinese zodiac',
  ],
  'برج النمر': [
    'tiger zodiac chinese',
    'tiger chinese astrology',
    'tiger zodiac',
  ],
  'برج الأرنب': [
    'rabbit zodiac chinese',
    'rabbit chinese astrology',
    'bunny zodiac',
  ],
  'برج التنين': [
    'dragon zodiac chinese',
    'dragon chinese astrology',
    'dragon zodiac',
  ],
  'برج الأفعى': [
    'snake zodiac chinese',
    'snake chinese astrology',
    'serpent zodiac',
  ],
  'برج الحصان': [
    'horse zodiac chinese',
    'horse chinese astrology',
    'horse zodiac',
  ],
  'برج الماعز': [
    'goat zodiac chinese',
    'sheep chinese astrology',
    'goat zodiac',
  ],
  'برج القرد': [
    'monkey zodiac chinese',
    'monkey chinese astrology',
    'monkey zodiac',
  ],
  'برج الديك': [
    'rooster zodiac chinese',
    'rooster chinese astrology',
    'rooster zodiac',
  ],
  'برج الكلب': ['dog zodiac chinese', 'dog chinese astrology', 'dog zodiac'],
  'برج الخنزير': ['pig zodiac chinese', 'pig chinese astrology', 'boar zodiac'],

  // ===== أحجار الميلاد =====
  'حجر الميلاد': ['birthstone gemstone', 'birth gem', 'birthstone jewelry'],
  العقيق: ['garnet gemstone', 'garnet birthstone', 'red garnet'],
  الجمشت: ['amethyst gemstone', 'amethyst birthstone', 'purple amethyst'],
  الزبرجد: ['aquamarine gemstone', 'aquamarine birthstone', 'blue aquamarine'],
  الماس: ['diamond gemstone', 'diamond birthstone', 'brilliant diamond'],
  الزمرد: ['emerald gemstone', 'emerald birthstone', 'green emerald'],
  اللؤلؤ: ['pearl gemstone', 'pearl birthstone', 'white pearl'],
  الياقوت: ['ruby gemstone', 'ruby birthstone', 'red ruby'],
  'الياقوت الأزرق': [
    'sapphire gemstone',
    'sapphire birthstone',
    'blue sapphire',
  ],
  الأوبال: ['opal gemstone', 'opal birthstone', 'rainbow opal'],
  التوباز: ['topaz gemstone', 'topaz birthstone', 'golden topaz'],
  الفيروز: ['turquoise gemstone', 'turquoise birthstone', 'blue turquoise'],
  حجر: ['gemstone beautiful', 'precious stone', 'birthstone'],
  مجوهرات: ['jewelry beautiful', 'jewelry elegant', 'precious jewelry'],
  'أحجار كريمة': ['precious stones', 'gemstones colorful', 'beautiful gems'],

  // ===== زهور الميلاد =====
  'زهرة الميلاد': ['birth flower', 'birthday flower', 'flower bouquet'],
  ورد: ['roses beautiful', 'red roses', 'rose flowers'],
  زهور: ['flowers beautiful', 'flower bouquet', 'blooming flowers'],
  القرنفل: ['carnation flower', 'pink carnation', 'red carnation'],
  البنفسج: ['violet flower', 'purple violet', 'sweet violet'],
  النرجس: ['daffodil flower', 'yellow daffodil', 'spring daffodil'],
  الزنبق: ['lily flower', 'white lily', 'beautiful lily'],
  'عباد الشمس': ['sunflower yellow', 'sunflower beautiful', 'sunny sunflower'],
  الأقحوان: ['chrysanthemum flower', 'mum flower', 'autumn chrysanthemum'],
  التوليب: ['tulip flower', 'colorful tulips', 'spring tulips'],
  الأوركيد: ['orchid flower', 'exotic orchid', 'beautiful orchid'],
  الياسمين: ['jasmine flower', 'white jasmine', 'fragrant jasmine'],
  باقة: ['bouquet flowers', 'flower arrangement', 'floral bouquet'],

  // ===== الأدوات والحاسبات =====
  'حاسبة الأيام': ['days calculator', 'date calculator', 'day counter'],
  'حاسبة الفرق بين تاريخين': [
    'date difference calculator',
    'days between dates',
    'date calculator',
  ],
  'حاسبة يوم الميلاد': [
    'birthday calculator',
    'birth day finder',
    'day of week calculator',
  ],
  'حاسبة العد التنازلي': [
    'countdown calculator',
    'countdown timer',
    'days countdown',
  ],
  'حاسبة السعرات': [
    'calorie calculator',
    'nutrition calculator',
    'food calories',
  ],
  'حاسبة BMI': ['BMI calculator', 'body mass index', 'weight calculator'],
  'حاسبة الحمل': [
    'pregnancy calculator',
    'due date calculator',
    'pregnancy weeks',
  ],
  'تحويل التاريخ': ['date converter', 'calendar converter', 'date conversion'],
  'تاريخ هجري': ['hijri date', 'islamic calendar', 'hijri calendar'],
  'تاريخ ميلادي': ['gregorian date', 'gregorian calendar', 'western calendar'],
  أدوات: ['tools utilities', 'calculators tools', 'online tools'],
  حاسبة: ['calculator tool', 'online calculator', 'digital calculator'],

  // ===== العائلة والأشخاص =====
  'طفل رضيع': ['baby infant', 'newborn baby', 'cute baby'],
  'طفل صغير': ['toddler child', 'small child', 'little kid'],
  'أطفال يلعبون': ['children playing', 'kids fun', 'playful children'],
  'عائلة سعيدة': ['happy family', 'family together', 'family celebration'],
  أطفال: ['children happy', 'kids joyful', 'young children'],
  طفل: ['child happy', 'kid smiling', 'young child'],
  رضيع: ['baby cute', 'infant newborn', 'baby sleeping'],
  عائلة: ['family together', 'family gathering', 'family portrait'],
  أصدقاء: ['friends together', 'friendship celebration', 'friends party'],
  مراهق: ['teenager young', 'teen celebration', 'adolescent'],
  شاب: ['young adult', 'youth celebration', 'young person'],
  فتاة: ['girl happy', 'young girl', 'girl birthday'],
  ولد: ['boy happy', 'young boy', 'boy birthday'],
  أم: ['mother love', 'mom celebration', 'mother child'],
  أب: ['father love', 'dad celebration', 'father child'],
  جد: ['grandfather wise', 'grandpa celebration', 'elderly man'],
  جدة: ['grandmother loving', 'grandma celebration', 'elderly woman'],

  // ===== الألوان =====
  'لون محظوظ': ['lucky color', 'fortune color', 'auspicious color'],
  'أرقام الحظ': ['lucky numbers', 'fortune numbers', 'lucky digits'],
  أحمر: ['red color', 'red background', 'red aesthetic'],
  أزرق: ['blue color', 'blue background', 'blue aesthetic'],
  أخضر: ['green color', 'green background', 'green aesthetic'],
  أصفر: ['yellow color', 'yellow background', 'yellow aesthetic'],
  وردي: ['pink color', 'pink background', 'pink aesthetic'],
  بنفسجي: ['purple color', 'purple background', 'purple aesthetic'],
  برتقالي: ['orange color', 'orange background', 'orange aesthetic'],
  ذهبي: ['gold color', 'golden background', 'gold aesthetic'],
  فضي: ['silver color', 'silver background', 'silver aesthetic'],
  أبيض: ['white color', 'white background', 'white aesthetic'],
  أسود: ['black color', 'black background', 'black aesthetic'],
  ملون: ['colorful vibrant', 'multicolor rainbow', 'colorful celebration'],

  // ===== الفصول والشهور =====
  الربيع: ['spring flowers', 'spring nature', 'springtime beautiful'],
  الصيف: ['summer sun', 'summer vacation', 'summertime fun'],
  الخريف: ['autumn leaves', 'fall colors', 'autumn season'],
  الشتاء: ['winter snow', 'winter holiday', 'wintertime cozy'],
  يناير: ['january winter', 'new year january', 'january cold'],
  فبراير: ['february valentine', 'february love', 'valentine february'],
  مارس: ['march spring', 'march flowers', 'early spring'],
  أبريل: ['april spring', 'april flowers', 'spring april'],
  مايو: ['may spring', 'may flowers', 'late spring'],
  يونيو: ['june summer', 'june sunny', 'early summer'],
  يوليو: ['july summer', 'july vacation', 'midsummer'],
  أغسطس: ['august summer', 'august vacation', 'late summer'],
  سبتمبر: ['september autumn', 'september fall', 'early fall'],
  أكتوبر: ['october autumn', 'october fall', 'autumn colors'],
  نوفمبر: ['november autumn', 'november fall', 'late fall'],
  ديسمبر: ['december winter', 'december holiday', 'christmas december'],

  // ===== الأحداث التاريخية والمشاهير =====
  'أحداث تاريخية': ['historical events', 'history moments', 'important events'],
  'هذا اليوم في التاريخ': [
    'this day in history',
    'today in history',
    'historical day',
  ],
  'مشاهير يوم الميلاد': [
    'celebrity birthdays',
    'famous birthdays',
    'born today',
  ],
  مشاهير: ['celebrities famous', 'famous people', 'celebrity'],
  تاريخ: ['history historical', 'historical moment', 'history event'],

  // ===== المقالات والمحتوى =====
  مقالات: ['articles content', 'blog posts', 'written content'],
  'نصائح صحية': ['health tips', 'wellness advice', 'healthy lifestyle'],
  'معلومات عن الأبراج': [
    'zodiac information',
    'horoscope facts',
    'astrology info',
  ],
  نصائح: ['tips advice', 'helpful tips', 'useful advice'],
  معلومات: ['information facts', 'useful info', 'knowledge'],

  // ===== المشاعر والمناسبات =====
  سعادة: ['happiness joy', 'happy moment', 'pure happiness'],
  فرح: ['joy celebration', 'joyful moment', 'pure joy'],
  حب: ['love heart', 'romantic love', 'loving moment'],
  ذكرى: ['anniversary memory', 'memorable moment', 'anniversary celebration'],
  ابتسامة: ['smile happy', 'smiling joyful', 'bright smile'],
  ضحك: ['laughter happy', 'laughing together', 'joyful laughter'],
  نجاح: ['success achievement', 'successful moment', 'achievement'],
  تخرج: ['graduation celebration', 'graduation party', 'graduation ceremony'],
  زواج: ['wedding marriage', 'wedding party', 'marriage celebration'],
  خطوبة: ['engagement celebration', 'engagement party', 'engagement ring'],
  مولود: ['newborn baby', 'baby birth', 'newborn celebration'],

  // ===== كلمات عامة =====
  جميل: ['beautiful lovely', 'beautiful moment', 'lovely scene'],
  رائع: ['wonderful amazing', 'amazing moment', 'wonderful celebration'],
  مميز: ['special unique', 'special moment', 'unique celebration'],
  أفضل: ['best greatest', 'best wishes', 'best moment'],
  جديد: ['new fresh', 'new start', 'fresh beginning'],
  معاً: ['together united', 'together celebration', 'united moment'],
  حياة: ['life living', 'life celebration', 'life journey'],
  وقت: ['time moment', 'precious time', 'special time'],
  لحظة: ['moment special', 'precious moment', 'special instant'],
  ذكريات: ['memories precious', 'sweet memories', 'cherished memories'],
  أحلام: ['dreams hope', 'dreams come true', 'dreaming'],
  أمل: ['hope future', 'hopeful moment', 'bright hope'],
};

// ===== دوال مساعدة =====

// جلب الكلمات المفتاحية من قاعدة البيانات
async function getKeywordsFromDatabase(): Promise<string[]> {
  try {
    const results = (await query(
      'SELECT keywords FROM page_keywords WHERE keywords IS NOT NULL AND keywords != ""'
    )) as Array<{ keywords: string }>;

    const allKeywords: string[] = [];
    for (const row of results) {
      if (row.keywords) {
        const keywords = row.keywords
          .split(',')
          .map((k: string) => k.trim())
          .filter((k: string) => k.length > 0);
        allKeywords.push(...keywords);
      }
    }

    return [...new Set(allKeywords)]; // إزالة التكرارات
  } catch (error) {
    console.log('⚠️ Could not fetch keywords from database:', error);
    return [];
  }
}

// جمع جميع الكلمات المفتاحية من SEO
function getAllSEOKeywords(): string[] {
  const allKeywords: string[] = [
    ...CORE_KEYWORDS_AR,
    ...CORE_KEYWORDS_EN,
    ...LONG_TAIL_KEYWORDS,
  ];

  // إضافة كلمات الصفحات
  for (const pageKeywords of Object.values(PAGE_KEYWORDS)) {
    allKeywords.push(...pageKeywords);
  }

  return [...new Set(allKeywords)];
}

// ترجمة مصطلح عربي باستخدام القاموس الشامل
function translateFromDictionary(term: string): string[] {
  const results: string[] = [];

  // ترتيب المفاتيح حسب الطول (الأطول أولاً)
  const sortedKeys = Object.keys(comprehensiveDictionary).sort(
    (a, b) => b.length - a.length
  );

  for (const arabic of sortedKeys) {
    if (term.includes(arabic)) {
      results.push(...comprehensiveDictionary[arabic]);
    }
  }

  return results;
}

// توليد استعلامات بحث متنوعة
async function generateDiverseSearchQueries(query: string): Promise<string[]> {
  const variations: string[] = [];

  // 1. استخدام القاموس الشامل
  const dictTranslations = translateFromDictionary(query);
  variations.push(...dictTranslations);

  // 2. استخدام دالة الترجمة من pexels.ts
  const pexelsTranslation = topicToEnglishKeywords(query);
  if (pexelsTranslation && !variations.includes(pexelsTranslation)) {
    variations.push(pexelsTranslation);
  }

  // 3. إضافة كلمات مفتاحية سياقية
  const contextKeywords = getContextualKeywords(query);
  variations.push(...contextKeywords);

  // 4. جلب كلمات من قاعدة البيانات وإضافة ترجماتها
  const dbKeywords = await getKeywordsFromDatabase();
  for (const keyword of dbKeywords.slice(0, 20)) {
    const translations = translateFromDictionary(keyword);
    if (translations.length > 0) {
      variations.push(translations[0]);
    }
  }

  // 5. إضافة كلمات SEO المترجمة
  const seoKeywords = getAllSEOKeywords();
  for (const keyword of seoKeywords.slice(0, 30)) {
    if (query.includes(keyword) || keyword.includes(query.split(' ')[0])) {
      const translations = translateFromDictionary(keyword);
      if (translations.length > 0) {
        variations.push(translations[0]);
      }
    }
  }

  // إزالة التكرارات وخلط النتائج
  const unique = [...new Set(variations)].filter((v) => v.length > 0);
  return shuffleArray(unique);
}

// الحصول على كلمات مفتاحية حسب السياق
function getContextualKeywords(query: string): string[] {
  const keywords: string[] = [];

  // عيد الميلاد والاحتفالات
  if (
    query.includes('عيد') ||
    query.includes('ميلاد') ||
    query.includes('حفل') ||
    query.includes('احتفال')
  ) {
    keywords.push(
      'birthday celebration party',
      'birthday cake candles',
      'party balloons colorful',
      'celebration decorations',
      'happy birthday wishes',
      'festive party decorations'
    );
  }

  // الأبراج
  if (
    query.includes('برج') ||
    query.includes('أبراج') ||
    query.includes('فلك') ||
    query.includes('نجوم')
  ) {
    keywords.push(
      'zodiac astrology stars',
      'horoscope constellation',
      'starry night sky',
      'zodiac wheel symbols',
      'astrology signs beautiful',
      'cosmic universe stars'
    );
  }

  // حساب العمر
  if (
    query.includes('عمر') ||
    query.includes('سنة') ||
    query.includes('حساب') ||
    query.includes('كم عمري')
  ) {
    keywords.push(
      'birthday milestone celebration',
      'age celebration happy',
      'birthday party family',
      'life journey celebration',
      'milestone birthday cake'
    );
  }

  // العائلة والأطفال
  if (
    query.includes('طفل') ||
    query.includes('أطفال') ||
    query.includes('عائلة') ||
    query.includes('رضيع')
  ) {
    keywords.push(
      'happy family together',
      'children playing happy',
      'family celebration love',
      'kids birthday party',
      'baby celebration cute'
    );
  }

  // الزهور والأحجار
  if (
    query.includes('ورد') ||
    query.includes('زهور') ||
    query.includes('زهرة') ||
    query.includes('حجر') ||
    query.includes('مجوهرات')
  ) {
    keywords.push(
      'beautiful flowers bouquet',
      'colorful flowers garden',
      'gemstone jewelry beautiful',
      'precious stones colorful',
      'flower arrangement elegant'
    );
  }

  // الأدوات والحاسبات
  if (
    query.includes('حاسبة') ||
    query.includes('أدوات') ||
    query.includes('تحويل')
  ) {
    keywords.push(
      'calculator digital modern',
      'technology tools',
      'digital interface clean',
      'modern app design',
      'productivity tools'
    );
  }

  // الصحة
  if (
    query.includes('صحة') ||
    query.includes('سعرات') ||
    query.includes('BMI') ||
    query.includes('حمل')
  ) {
    keywords.push(
      'health wellness lifestyle',
      'healthy living fitness',
      'nutrition food healthy',
      'wellness meditation',
      'healthy lifestyle nature'
    );
  }

  // المشاهير والتاريخ
  if (
    query.includes('مشاهير') ||
    query.includes('تاريخ') ||
    query.includes('أحداث')
  ) {
    keywords.push(
      'celebrity famous people',
      'historical moments',
      'famous personalities',
      'history events important',
      'notable people celebration'
    );
  }

  return keywords;
}

// خلط المصفوفة عشوائياً
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// البحث في Pexels مع صفحة عشوائية
async function searchPexels(
  apiKey: string,
  query: string,
  count: number,
  page?: number
): Promise<{ photos: any[]; total: number }> {
  // صفحة عشوائية بين 1-20 للتنوع الأقصى
  const randomPage = page || Math.floor(Math.random() * 20) + 1;

  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      query
    )}&per_page=${count}&page=${randomPage}&orientation=landscape`,
    { headers: { Authorization: apiKey } }
  );

  if (!response.ok) {
    throw new Error(`Pexels API error: ${response.status}`);
  }

  const data = await response.json();
  return { photos: data.photos || [], total: data.total_results || 0 };
}

// الحصول على صور منسقة (curated)
async function getCuratedPhotos(apiKey: string, count: number): Promise<any[]> {
  const randomPage = Math.floor(Math.random() * 30) + 1;

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/curated?per_page=${count}&page=${randomPage}`,
      { headers: { Authorization: apiKey } }
    );

    if (response.ok) {
      const data = await response.json();
      return data.photos || [];
    }
  } catch (e) {
    console.log('Curated photos fallback failed');
  }

  return [];
}

// البحث بكلمات مفتاحية متعددة من مصادر مختلفة
async function searchWithMultipleKeywords(
  apiKey: string,
  baseQuery: string,
  count: number
): Promise<string[]> {
  const allImages: string[] = [];
  const seenUrls = new Set<string>();

  // توليد استعلامات متنوعة
  const searchQueries = await generateDiverseSearchQueries(baseQuery);
  console.log(`🔍 Generated ${searchQueries.length} diverse search queries`);

  // البحث باستخدام أول 6 استعلامات مختلفة
  for (const query of searchQueries.slice(0, 6)) {
    if (allImages.length >= count * 1.5) break;

    try {
      const result = await searchPexels(apiKey, query, Math.ceil(count / 3));

      for (const photo of result.photos) {
        const url = photo.src?.medium || photo.src?.large;
        if (url && !seenUrls.has(url)) {
          seenUrls.add(url);
          allImages.push(url);
        }
      }

      console.log(
        `✅ "${query.substring(0, 30)}..." -> ${result.photos.length} photos`
      );
    } catch (e) {
      console.log(`⚠️ Search failed for: ${query.substring(0, 30)}...`);
    }
  }

  return allImages;
}

// ===== API Route Handler =====
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const count = parseInt(searchParams.get('count') || '30');

  if (!query) {
    return NextResponse.json({
      success: false,
      error: 'يرجى إدخال كلمة البحث',
    });
  }

  const pexelsApiKey = process.env.PEXELS_API_KEY;

  if (!pexelsApiKey) {
    return NextResponse.json({
      success: false,
      error: 'PEXELS_API_KEY غير موجود',
    });
  }

  try {
    console.log(`\n🔍 ===== Image Search Request =====`);
    console.log(`📝 Query: "${query}"`);
    console.log(`📊 Requested count: ${count}`);

    // توليد استعلامات بحث متنوعة
    const searchVariations = await generateDiverseSearchQueries(query);
    console.log(
      `🎯 Search variations (${searchVariations.length}):`,
      searchVariations.slice(0, 5)
    );

    const allImages: string[] = [];
    const seenUrls = new Set<string>();

    // 1. البحث باستخدام الاستعلامات المتنوعة (6 استعلامات مختلفة)
    for (const variation of searchVariations.slice(0, 6)) {
      if (allImages.length >= count * 1.5) break;

      try {
        const result = await searchPexels(
          pexelsApiKey,
          variation,
          Math.ceil(count / 2)
        );

        for (const photo of result.photos) {
          const url = photo.src?.medium || photo.src?.large;
          if (url && !seenUrls.has(url)) {
            seenUrls.add(url);
            allImages.push(url);
          }
        }

        console.log(
          `✅ "${variation.substring(0, 35)}..." -> ${
            result.photos.length
          } photos`
        );
      } catch (e) {
        console.log(`⚠️ Search failed for: ${variation.substring(0, 35)}...`);
      }
    }

    // 2. إذا لم نجد صور كافية، جرب بحث بكلمات مفتاحية عامة متنوعة
    if (allImages.length < count / 2) {
      console.log('🔄 Trying diverse general searches...');

      const generalQueries = shuffleArray([
        'birthday celebration happy colorful',
        'party decorations festive',
        'celebration balloons cake',
        'happy family together love',
        'beautiful flowers nature',
        'zodiac astrology stars',
        'gemstone jewelry beautiful',
        'children playing happy',
        'success achievement celebration',
        'wedding celebration love',
        'graduation party celebration',
        'healthy lifestyle wellness',
        'technology modern digital',
        'nature beautiful landscape',
        'colorful abstract art',
      ]);

      for (const generalQuery of generalQueries.slice(0, 4)) {
        if (allImages.length >= count) break;

        try {
          const result = await searchPexels(pexelsApiKey, generalQuery, count);

          for (const photo of result.photos) {
            const url = photo.src?.medium || photo.src?.large;
            if (url && !seenUrls.has(url)) {
              seenUrls.add(url);
              allImages.push(url);
            }
          }
        } catch (e) {
          // تجاهل الأخطاء
        }
      }
    }

    // 3. إذا مازلنا بحاجة لصور، استخدم الصور المنسقة
    if (allImages.length < count / 3) {
      console.log('🔄 Fetching curated photos...');

      const curatedPhotos = await getCuratedPhotos(pexelsApiKey, count);

      for (const photo of curatedPhotos) {
        const url = photo.src?.medium || photo.src?.large;
        if (url && !seenUrls.has(url)) {
          seenUrls.add(url);
          allImages.push(url);
        }
      }
    }

    // خلط الصور للتنوع
    const shuffledImages = shuffleArray(allImages);

    console.log(`📸 Total unique images found: ${shuffledImages.length}`);
    console.log(`🎉 ===== Search Complete =====\n`);

    return NextResponse.json({
      success: true,
      images: shuffledImages.slice(0, count),
      total: shuffledImages.length,
      translated: searchVariations[0] || query,
      variations: searchVariations.slice(0, 5),
      sources: {
        dictionary: 'comprehensive (200+ terms)',
        seo: 'keywords.ts (100+ keywords)',
        database: 'page_keywords table',
        pexels: 'pexels.ts (500+ terms)',
      },
    });
  } catch (error) {
    console.error('Image search error:', error);
    return NextResponse.json({
      success: false,
      error: 'فشل في البحث عن الصور',
    });
  }
}
