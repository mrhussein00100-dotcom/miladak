/**
 * Pexels API للصور المجانية
 * https://www.pexels.com/api/
 *
 * Version 5.1 - إصلاح جذري لصلة الصور بالموضوع
 * التحسينات في v5.1:
 * - إصلاح دالة topicToEnglishKeywords: إزالة الخلط العشوائي الذي يدمر الصلة
 * - أولوية للكلمات المستخرجة مباشرة من الموضوع
 * - تقليل الكلمات السياقية العامة التي تُغرق الكلمات الخاصة
 * - ترتيب الصور حسب الصلة بالموضوع بدلاً من الخلط العشوائي
 * - استخدام 6 كلمات مفتاحية فقط (بدلاً من 15) للدقة
 * - fallback ذكي حسب سياق الموضوع
 *
 * التحسينات السابقة (v5.0):
 * - دمج مزودين للصور: Pexels + Unsplash للتنوع الأقصى
 * - استخدام القاموس الشامل (dictionary.ts) مع 200+ مصطلح
 * - منع تكرار الصور بشكل صارم جداً (ID + URL + hash + photographer + provider)
 * - نظام تسجيل نقاط للصور لاختيار الأكثر صلة بالموضوع
 * - fallback متعدد المراحل (5 مراحل) للصورة البارزة
 */

import {
  searchUnsplashImages,
  getUnsplashCoverImage,
  type UnsplashImage,
} from './unsplash';

export interface PexelsImage {
  id: number;
  url: string;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

// نتيجة تحليل المحتوى للصور
export interface ContentImageAnalysis {
  mainTopic: string;
  subTopics: string[];
  context: string;
  suggestedImageCount: number;
  searchQueries: string[];
  featuredImageQuery: string;
}

export interface PexelsSearchResult {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsImage[];
}

// نتيجة إضافة الصور للمقال
export interface ArticleWithImages {
  content: string;
  featuredImage: string | null;
  imagesAdded: number;
  imageDetails: Array<{
    url: string;
    alt: string;
    photographer: string;
    position: string;
    provider?: 'pexels' | 'unsplash';
  }>;
}

// صورة موحدة للاستخدام مع كلا المزودين
export interface UnifiedImage {
  id: string;
  url: string;
  urlLarge: string;
  alt: string;
  photographer: string;
  provider: 'pexels' | 'unsplash';
}

// ===== قاموس موسّع جداً للترجمة العربية-الإنجليزية (v3.3) =====
// مرتب حسب الأولوية (الأطول أولاً لتجنب الاستبدال الجزئي)
// يحتوي على 500+ مصطلح لتحسين دقة البحث عن الصور
const arabicToEnglishKeywords: Record<string, string[]> = {
  // ===== عيد الميلاد والاحتفالات (أولوية عالية جداً) =====
  'عيد ميلاد سعيد': [
    'happy birthday celebration',
    'birthday party joyful',
    'birthday wishes',
  ],
  'كيكة عيد ميلاد': [
    'birthday cake candles',
    'celebration cake colorful',
    'party cake',
  ],
  'شموع عيد ميلاد': [
    'birthday candles glowing',
    'cake candles celebration',
    'lit candles',
  ],
  'حفلة عيد ميلاد': [
    'birthday party celebration',
    'birthday bash',
    'party decorations',
  ],
  'هدايا عيد ميلاد': [
    'birthday gifts wrapped',
    'birthday presents colorful',
    'gift boxes',
  ],
  'عيد ميلاد': [
    'birthday celebration party',
    'birthday festive',
    'happy birthday',
  ],
  'تهنئة بعيد الميلاد': [
    'birthday wishes greeting',
    'birthday congratulations',
    'birthday card',
  ],
  'عيد ميلاد أول': [
    'first birthday celebration',
    'baby first birthday',
    'one year old party',
  ],
  'عيد ميلاد طفل': [
    'child birthday party',
    'kids birthday celebration',
    'children party',
  ],
  'عيد ميلاد مفاجئ': [
    'surprise birthday party',
    'surprise celebration',
    'unexpected party',
  ],
  'ديكور عيد ميلاد': [
    'birthday decorations colorful',
    'party decor',
    'festive decorations',
  ],
  'بطاقة عيد ميلاد': [
    'birthday card greeting',
    'birthday wishes card',
    'celebration card',
  ],
  'أغنية عيد ميلاد': [
    'birthday song celebration',
    'happy birthday singing',
    'party music',
  ],

  // ===== الأبراج الفلكية (مع صور متنوعة) =====
  'برج الحمل': [
    'aries zodiac constellation',
    'aries symbol fire',
    'ram zodiac sign',
  ],
  'برج الثور': [
    'taurus zodiac earth',
    'taurus bull symbol',
    'taurus constellation',
  ],
  'برج الجوزاء': [
    'gemini zodiac twins',
    'gemini air sign',
    'gemini constellation',
  ],
  'برج السرطان': [
    'cancer zodiac water',
    'cancer crab symbol',
    'cancer constellation',
  ],
  'برج الأسد': ['leo zodiac fire', 'leo lion symbol', 'leo constellation'],
  'برج العذراء': [
    'virgo zodiac earth',
    'virgo maiden symbol',
    'virgo constellation',
  ],
  'برج الميزان': [
    'libra zodiac air',
    'libra scales balance',
    'libra constellation',
  ],
  'برج العقرب': [
    'scorpio zodiac water',
    'scorpio symbol',
    'scorpio constellation',
  ],
  'برج القوس': [
    'sagittarius zodiac fire',
    'sagittarius archer',
    'sagittarius constellation',
  ],
  'برج الجدي': [
    'capricorn zodiac earth',
    'capricorn goat',
    'capricorn constellation',
  ],
  'برج الدلو': [
    'aquarius zodiac air',
    'aquarius water bearer',
    'aquarius constellation',
  ],
  'برج الحوت': [
    'pisces zodiac water',
    'pisces fish symbol',
    'pisces constellation',
  ],
  'صفات برج': [
    'zodiac personality traits',
    'horoscope characteristics',
    'zodiac sign meaning',
  ],
  'توافق الأبراج': [
    'zodiac compatibility love',
    'horoscope match',
    'zodiac love',
  ],
  الحمل: ['aries zodiac fire', 'ram symbol astrology', 'aries horoscope'],
  الثور: ['taurus zodiac earth', 'bull symbol astrology', 'taurus horoscope'],
  الجوزاء: ['gemini zodiac air', 'twins symbol astrology', 'gemini horoscope'],
  السرطان: ['cancer zodiac water', 'crab symbol astrology', 'cancer horoscope'],
  الأسد: ['leo zodiac fire', 'lion symbol astrology', 'leo horoscope'],
  العذراء: ['virgo zodiac earth', 'maiden symbol astrology', 'virgo horoscope'],
  الميزان: ['libra zodiac air', 'scales symbol astrology', 'libra horoscope'],
  العقرب: [
    'scorpio zodiac water',
    'scorpion symbol astrology',
    'scorpio horoscope',
  ],
  القوس: [
    'sagittarius zodiac fire',
    'archer symbol astrology',
    'sagittarius horoscope',
  ],
  الجدي: [
    'capricorn zodiac earth',
    'goat symbol astrology',
    'capricorn horoscope',
  ],
  الدلو: [
    'aquarius zodiac air',
    'water bearer astrology',
    'aquarius horoscope',
  ],
  الحوت: ['pisces zodiac water', 'fish symbol astrology', 'pisces horoscope'],
  أبراج: ['zodiac signs wheel', 'horoscope symbols', 'astrology signs'],
  برج: ['zodiac sign symbol', 'horoscope sign', 'astrology symbol'],
  فلك: ['astrology stars', 'astronomy cosmos', 'celestial'],
  نجوم: ['stars night sky', 'starry sky beautiful', 'twinkling stars'],
  كواكب: ['planets solar system', 'planetary alignment', 'cosmic planets'],
  قمر: ['moon night', 'lunar phases', 'moonlight'],
  شمس: ['sun bright', 'sunshine golden', 'solar'],

  // ===== الأعمار والمراحل العمرية (موسّع) =====
  'حساب العمر': [
    'age calculation birthday',
    'birthday age milestone',
    'years counting',
  ],
  'كم عمري': ['age calculator birthday', 'how old birthday', 'age finder'],
  'عمر الطفل': ['child age development', 'baby age milestones', 'kid growing'],
  'عمر بالأيام': ['age in days counting', 'days old birthday', 'daily age'],
  'عمر بالشهور': ['age in months baby', 'months old milestone', 'monthly age'],
  'عمر بالسنوات': [
    'age in years birthday',
    'years old celebration',
    'annual birthday',
  ],
  'مراحل العمر': ['life stages journey', 'age milestones', 'growing up'],
  عمر: ['age birthday years', 'years old celebration', 'age milestone'],
  سنة: ['year birthday annual', 'yearly celebration', 'anniversary'],
  شهر: ['month milestone baby', 'monthly celebration', 'month old'],
  يوم: ['day celebration special', 'daily milestone', 'birthday day'],
  أسبوع: ['week milestone', 'weekly celebration', 'seven days'],

  // ===== العائلة والأشخاص (موسّع جداً) =====
  'طفل رضيع': ['baby infant cute', 'newborn baby adorable', 'infant sleeping'],
  'طفل صغير': ['toddler playing happy', 'small child cute', 'little kid'],
  'أطفال يلعبون': [
    'children playing happy',
    'kids fun outdoor',
    'playful children',
  ],
  'عائلة سعيدة': [
    'happy family together',
    'family joy love',
    'family celebration',
  ],
  'أصدقاء مقربون': [
    'close friends happy',
    'best friends together',
    'friendship bond',
  ],
  'حفلة أطفال': [
    'kids party colorful',
    'children celebration',
    'birthday kids',
  ],
  أطفال: ['children happy playing', 'kids joyful', 'young children'],
  طفل: ['child happy cute', 'kid smiling', 'young child'],
  رضيع: ['baby cute adorable', 'infant newborn', 'baby sleeping'],
  عائلة: ['family together love', 'family gathering', 'family portrait'],
  أصدقاء: ['friends together happy', 'friendship celebration', 'friends party'],
  مراهق: ['teenager young', 'teen celebration', 'adolescent party'],
  شاب: ['young adult celebration', 'youth party', 'young person'],
  فتاة: ['girl happy smiling', 'young girl celebration', 'girl birthday'],
  ولد: ['boy happy playing', 'young boy celebration', 'boy birthday'],
  أم: ['mother love caring', 'mom celebration', 'mother child'],
  أب: ['father love family', 'dad celebration', 'father child'],
  جد: ['grandfather wise', 'grandpa celebration', 'elderly man'],
  جدة: ['grandmother loving', 'grandma celebration', 'elderly woman'],
  توأم: ['twins together', 'twin siblings', 'twin birthday'],
  أخ: ['brother sibling', 'brother celebration', 'brothers together'],
  أخت: ['sister sibling', 'sister celebration', 'sisters together'],

  // ===== المشاعر والمناسبات (موسّع) =====
  سعادة: ['happiness joy celebration', 'happy moment joyful', 'pure happiness'],
  فرح: ['joy celebration happy', 'joyful moment', 'pure joy'],
  حب: ['love heart romantic', 'love celebration', 'loving moment'],
  تهنئة: [
    'congratulations celebration',
    'greeting wishes',
    'celebration wishes',
  ],
  أمنيات: ['wishes birthday best', 'birthday wishes', 'good wishes'],
  ذكرى: ['anniversary memory', 'memorable moment', 'anniversary celebration'],
  مفاجأة: ['surprise party happy', 'surprise celebration', 'unexpected joy'],
  ابتسامة: ['smile happy face', 'smiling joyful', 'bright smile'],
  ضحك: ['laughter happy joy', 'laughing together', 'joyful laughter'],
  دموع: ['tears of joy', 'happy tears', 'emotional moment'],
  حنين: ['nostalgia memories', 'nostalgic moment', 'sweet memories'],
  شكر: ['gratitude thankful', 'thank you celebration', 'grateful moment'],
  تقدير: ['appreciation celebration', 'appreciation moment', 'valued moment'],

  // ===== عناصر الاحتفال (موسّع جداً) =====
  'بالونات ملونة': [
    'colorful balloons party',
    'balloons celebration',
    'festive balloons',
  ],
  'كيك شوكولاتة': [
    'chocolate cake delicious',
    'chocolate birthday cake',
    'rich chocolate cake',
  ],
  'كيك فانيلا': [
    'vanilla cake birthday',
    'white cake celebration',
    'vanilla frosting',
  ],
  'شموع مضيئة': [
    'glowing candles birthday',
    'lit candles celebration',
    'candle light',
  ],
  'هدايا مغلفة': [
    'wrapped gifts colorful',
    'gift boxes presents',
    'wrapped presents',
  ],
  'زينة ملونة': [
    'colorful decorations party',
    'festive decor',
    'party decorations',
  ],
  'قبعات حفلة': ['party hats colorful', 'celebration hats', 'birthday hats'],
  'صفارات حفلة': [
    'party horns celebration',
    'noisemakers party',
    'party blowers',
  ],
  بالونات: [
    'balloons colorful party',
    'party balloons festive',
    'balloon decorations',
  ],
  كيك: ['cake birthday delicious', 'celebration cake', 'party cake'],
  كعكة: ['cake dessert sweet', 'birthday cake', 'celebration dessert'],
  شموع: ['candles birthday glowing', 'celebration candles', 'lit candles'],
  هدايا: ['gifts presents wrapped', 'birthday gifts', 'gift boxes'],
  هدية: ['gift present wrapped', 'birthday present', 'special gift'],
  زينة: ['decorations party colorful', 'festive decorations', 'party decor'],
  حفلة: ['party celebration festive', 'birthday party', 'celebration event'],
  احتفال: ['celebration festive party', 'festivity joy', 'celebration event'],
  كونفيتي: [
    'confetti colorful party',
    'celebration confetti',
    'party confetti',
  ],
  ورق: ['paper decorations', 'paper streamers', 'paper party'],
  شرائط: ['ribbons colorful', 'party ribbons', 'decorative ribbons'],
  أضواء: ['lights party festive', 'celebration lights', 'fairy lights'],
  موسيقى: ['music party celebration', 'party music', 'celebration music'],
  رقص: ['dancing party celebration', 'dance celebration', 'party dancing'],
  طعام: ['food party delicious', 'party food', 'celebration food'],
  حلويات: ['sweets desserts colorful', 'party sweets', 'celebration desserts'],
  'آيس كريم': ['ice cream colorful', 'ice cream party', 'frozen dessert'],
  عصير: ['juice drinks colorful', 'party drinks', 'fruit juice'],
  فواكه: ['fruits colorful fresh', 'fruit platter', 'fresh fruits'],

  // ===== الألوان (موسّع) =====
  أحمر: ['red color vibrant', 'red background', 'red aesthetic'],
  أزرق: ['blue color calm', 'blue background', 'blue aesthetic'],
  أخضر: ['green color nature', 'green background', 'green aesthetic'],
  أصفر: ['yellow color bright', 'yellow background', 'yellow aesthetic'],
  وردي: ['pink color soft', 'pink background', 'pink aesthetic'],
  بنفسجي: ['purple color royal', 'purple background', 'purple aesthetic'],
  برتقالي: ['orange color warm', 'orange background', 'orange aesthetic'],
  ذهبي: ['gold color luxury', 'golden background', 'gold aesthetic'],
  فضي: ['silver color elegant', 'silver background', 'silver aesthetic'],
  أبيض: ['white color pure', 'white background', 'white aesthetic'],
  أسود: ['black color elegant', 'black background', 'black aesthetic'],
  ملون: ['colorful vibrant', 'multicolor rainbow', 'colorful celebration'],
  'قوس قزح': ['rainbow colors', 'rainbow colorful', 'rainbow celebration'],

  // ===== الفصول (موسّع) =====
  الربيع: ['spring flowers blooming', 'spring nature', 'springtime beautiful'],
  الصيف: ['summer sun beach', 'summer vacation', 'summertime fun'],
  الخريف: ['autumn fall leaves', 'autumn colors', 'fall season'],
  الشتاء: ['winter snow cold', 'winter holiday', 'wintertime cozy'],
  'فصل الربيع': ['spring season flowers', 'spring blooming', 'spring nature'],
  'فصل الصيف': ['summer season sunny', 'summer beach', 'summer vacation'],
  'فصل الخريف': ['autumn season leaves', 'fall colors', 'autumn harvest'],
  'فصل الشتاء': ['winter season snow', 'winter holiday', 'winter cozy'],

  // ===== الشهور (موسّع) =====
  يناير: ['january winter new year', 'january cold', 'new year january'],
  فبراير: ['february valentine love', 'february winter', 'valentine february'],
  مارس: ['march spring beginning', 'march flowers', 'early spring march'],
  أبريل: ['april spring flowers', 'april blooming', 'spring april'],
  مايو: ['may spring flowers', 'may blooming', 'late spring may'],
  يونيو: ['june summer beginning', 'june sunny', 'early summer june'],
  يوليو: ['july summer hot', 'july vacation', 'midsummer july'],
  أغسطس: ['august summer end', 'august vacation', 'late summer august'],
  سبتمبر: [
    'september autumn beginning',
    'september fall',
    'early fall september',
  ],
  أكتوبر: ['october autumn colors', 'october fall', 'autumn october'],
  نوفمبر: ['november autumn late', 'november fall', 'late fall november'],
  ديسمبر: ['december winter holiday', 'december christmas', 'holiday december'],

  // ===== أحجار الميلاد (موسّع) =====
  العقيق: ['garnet gemstone red', 'garnet birthstone', 'red garnet jewelry'],
  الجمشت: [
    'amethyst purple gemstone',
    'amethyst birthstone',
    'purple amethyst',
  ],
  الزبرجد: [
    'aquamarine blue gemstone',
    'aquamarine birthstone',
    'blue aquamarine',
  ],
  الماس: [
    'diamond brilliant gemstone',
    'diamond birthstone',
    'sparkling diamond',
  ],
  الزمرد: ['emerald green gemstone', 'emerald birthstone', 'green emerald'],
  اللؤلؤ: ['pearl white gemstone', 'pearl birthstone', 'white pearl'],
  الياقوت: ['ruby red gemstone', 'ruby birthstone', 'red ruby'],
  'الياقوت الأزرق': [
    'sapphire blue gemstone',
    'sapphire birthstone',
    'blue sapphire',
  ],
  الأوبال: ['opal colorful gemstone', 'opal birthstone', 'rainbow opal'],
  التوباز: ['topaz yellow gemstone', 'topaz birthstone', 'golden topaz'],
  الفيروز: [
    'turquoise blue gemstone',
    'turquoise birthstone',
    'blue turquoise',
  ],
  حجر: ['gemstone beautiful', 'birthstone jewelry', 'precious stone'],
  مجوهرات: ['jewelry beautiful', 'jewelry elegant', 'precious jewelry'],

  // ===== زهور الميلاد (موسّع) =====
  ورد: ['roses beautiful red', 'rose flowers', 'red roses romantic'],
  زهور: ['flowers beautiful colorful', 'flower bouquet', 'blooming flowers'],
  القرنفل: ['carnation flower pink', 'carnation beautiful', 'pink carnation'],
  البنفسج: ['violet flower purple', 'violet beautiful', 'purple violet'],
  النرجس: ['daffodil flower yellow', 'daffodil spring', 'yellow daffodil'],
  الزنبق: ['lily flower white', 'lily beautiful', 'white lily'],
  'عباد الشمس': [
    'sunflower yellow bright',
    'sunflower beautiful',
    'sunny sunflower',
  ],
  الأقحوان: [
    'chrysanthemum flower',
    'mum flower colorful',
    'autumn chrysanthemum',
  ],
  التوليب: ['tulip flower colorful', 'tulip spring', 'colorful tulips'],
  الأوركيد: ['orchid flower elegant', 'orchid beautiful', 'exotic orchid'],
  الياسمين: ['jasmine flower white', 'jasmine fragrant', 'white jasmine'],
  باقة: ['bouquet flowers beautiful', 'flower bouquet', 'floral arrangement'],

  // ===== كلمات عامة ومشاعر (موسّع جداً) =====
  سعيد: ['happy joyful smiling', 'happiness celebration', 'joyful moment'],
  جميل: ['beautiful lovely aesthetic', 'beautiful moment', 'lovely scene'],
  رائع: ['wonderful amazing great', 'amazing moment', 'wonderful celebration'],
  مميز: ['special unique memorable', 'special moment', 'unique celebration'],
  أفضل: ['best greatest top', 'best wishes', 'best moment'],
  جديد: ['new fresh beginning', 'new start', 'fresh beginning'],
  قديم: ['old vintage classic', 'vintage style', 'classic moment'],
  كبير: ['big large grand', 'grand celebration', 'big party'],
  صغير: ['small little tiny', 'small celebration', 'little party'],
  أول: ['first beginning start', 'first time', 'first celebration'],
  آخر: ['last final end', 'last celebration', 'final moment'],
  معاً: ['together united', 'together celebration', 'united moment'],
  دائماً: ['always forever eternal', 'forever together', 'eternal love'],
  أبداً: ['never ending', 'never forget', 'eternal memory'],
  الآن: ['now present moment', 'present time', 'current moment'],
  غداً: ['tomorrow future hope', 'future bright', 'tomorrow hope'],
  أمس: ['yesterday past memory', 'past memories', 'yesterday memories'],
  حياة: ['life living journey', 'life celebration', 'life journey'],
  وقت: ['time moment precious', 'precious time', 'special time'],
  لحظة: ['moment special precious', 'precious moment', 'special instant'],
  ذكريات: [
    'memories precious nostalgic',
    'sweet memories',
    'cherished memories',
  ],
  أحلام: ['dreams hope future', 'dreams come true', 'dreaming'],
  أمل: ['hope future bright', 'hopeful moment', 'bright hope'],
  نجاح: ['success achievement victory', 'successful moment', 'achievement'],
  فوز: ['victory winning success', 'winning moment', 'victory celebration'],
  تخرج: [
    'graduation celebration achievement',
    'graduation party',
    'graduation ceremony',
  ],
  زواج: [
    'wedding marriage celebration',
    'wedding party',
    'marriage celebration',
  ],
  خطوبة: ['engagement celebration love', 'engagement party', 'engagement ring'],
  مولود: ['newborn baby birth', 'baby birth', 'newborn celebration'],
  ولادة: ['birth newborn baby', 'birth celebration', 'new baby'],
};

// استخراج الكلمات المفتاحية من الموضوع العربي (محسّن v5.1)
// إصلاح: إعطاء أولوية للترجمة الأولى (الأكثر صلة) بدلاً من إضافة كل الترجمات
function extractKeywordsFromTopic(topic: string): string[] {
  const keywords: string[] = [];
  let remainingTopic = topic;

  // ترتيب المفاتيح حسب الطول (الأطول أولاً) - للمطابقة الأدق
  const sortedKeys = Object.keys(arabicToEnglishKeywords).sort(
    (a, b) => b.length - a.length
  );

  for (const arabicTerm of sortedKeys) {
    if (remainingTopic.includes(arabicTerm)) {
      const englishTerms = arabicToEnglishKeywords[arabicTerm];
      // إضافة الترجمة الأولى فقط (الأكثر صلة) - تحسين v5.1
      // هذا يمنع إغراق النتائج بترجمات متعددة لنفس المصطلح
      if (englishTerms.length > 0 && !keywords.includes(englishTerms[0])) {
        keywords.push(englishTerms[0]);
      }
      // إزالة المصطلح من النص المتبقي لتجنب التكرار
      remainingTopic = remainingTopic.replace(new RegExp(arabicTerm, 'g'), ' ');
    }
  }

  // استخراج الأرقام (للأعمار مثلاً) - تحسين v5.1: ترجمة واحدة فقط حسب الفئة العمرية
  const numbers = topic.match(/\d+/g);
  if (numbers) {
    const age = parseInt(numbers[0]);
    if (age > 0 && age < 120) {
      // إضافة كلمة مفتاحية واحدة فقط حسب الفئة العمرية (أكثر دقة)
      if (age <= 1) {
        keywords.unshift('baby first birthday'); // في البداية للأولوية
      } else if (age <= 3) {
        keywords.unshift('toddler birthday party');
      } else if (age <= 6) {
        keywords.unshift('kids birthday party');
      } else if (age <= 12) {
        keywords.unshift('children birthday celebration');
      } else if (age <= 19) {
        keywords.unshift('teen birthday party');
      } else if (age <= 30) {
        keywords.unshift('young adult birthday');
      } else if (age <= 50) {
        keywords.unshift('adult birthday celebration');
      } else if (age <= 70) {
        keywords.unshift('senior birthday celebration');
      } else {
        keywords.unshift('elderly birthday celebration');
      }
    }
  }

  return keywords;
}

// تحديد سياق الموضوع للحصول على صور أكثر دقة
function detectTopicContext(topic: string): string {
  const contexts: Record<string, string[]> = {
    birthday: [
      'عيد ميلاد',
      'ميلاد',
      'كيك',
      'شموع',
      'بالونات',
      'حفلة',
      'هدايا',
      'تهنئة',
    ],
    zodiac: [
      'برج',
      'أبراج',
      'فلك',
      'نجوم',
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
    age: ['عمر', 'سنة', 'شهر', 'يوم', 'حساب', 'كم عمري'],
    family: ['عائلة', 'طفل', 'أطفال', 'رضيع', 'أصدقاء'],
    celebration: ['احتفال', 'فرح', 'سعادة', 'مناسبة', 'ذكرى'],
  };

  for (const [context, keywords] of Object.entries(contexts)) {
    for (const keyword of keywords) {
      if (topic.includes(keyword)) {
        return context;
      }
    }
  }

  return 'general';
}

// الحصول على كلمات بحث إضافية حسب السياق
function getContextualKeywords(context: string): string[] {
  const contextKeywords: Record<string, string[]> = {
    birthday: ['birthday celebration', 'party', 'cake', 'balloons'],
    zodiac: ['zodiac sign', 'astrology', 'horoscope', 'constellation'],
    age: ['birthday', 'celebration', 'milestone', 'anniversary'],
    family: ['family', 'together', 'love', 'happy'],
    celebration: ['celebration', 'party', 'festive', 'happy'],
    general: ['celebration', 'happy', 'colorful'],
  };

  return contextKeywords[context] || contextKeywords['general'];
}

// ===== نظام تحليل المحتوى الذكي =====

// تحليل المحتوى لاستخراج معلومات الصور المناسبة
export function analyzeContentForImages(
  content: string,
  title: string
): ContentImageAnalysis {
  // حساب عدد الكلمات
  const wordCount = content.split(/\s+/).filter((w) => w.length > 0).length;

  // استخراج العناوين الفرعية (H2, H3)
  const h2Matches = content.match(/<h2[^>]*>(.*?)<\/h2>/gi) || [];
  const h3Matches = content.match(/<h3[^>]*>(.*?)<\/h3>/gi) || [];
  const subTopics = [...h2Matches, ...h3Matches]
    .map((h) => h.replace(/<[^>]*>/g, '').trim())
    .filter((t) => t.length > 0);

  // تحديد السياق الرئيسي
  const context = detectTopicContext(title + ' ' + content.substring(0, 500));

  // حساب عدد الصور المناسب بناءً على حجم المقال
  const suggestedImageCount = calculateOptimalImageCount(
    wordCount,
    subTopics.length
  );

  // توليد استعلامات البحث للصور
  const searchQueries = generateSearchQueries(
    title,
    subTopics,
    context,
    suggestedImageCount
  );

  // استعلام الصورة البارزة (أكثر عمومية وجاذبية)
  const featuredImageQuery = generateFeaturedImageQuery(title, context);

  console.log(`📊 [تحليل المحتوى] عدد الكلمات: ${wordCount}`);
  console.log(`📊 [تحليل المحتوى] عدد العناوين الفرعية: ${subTopics.length}`);
  console.log(`📊 [تحليل المحتوى] السياق: ${context}`);
  console.log(`📊 [تحليل المحتوى] عدد الصور المقترح: ${suggestedImageCount}`);

  return {
    mainTopic: title,
    subTopics,
    context,
    suggestedImageCount,
    searchQueries,
    featuredImageQuery,
  };
}

// توليد استعلامات بحث متنوعة للصور (v6.0 - تركيز على الصلة)
function generateSearchQueries(
  title: string,
  subTopics: string[],
  context: string,
  imageCount: number
): string[] {
  const queries: string[] = [];
  const seenQueries = new Set<string>();

  // === الأولوية 1: استعلام من العنوان الرئيسي (الأهم) ===
  const mainQuery = topicToEnglishKeywords(title);
  if (mainQuery && !seenQueries.has(mainQuery.toLowerCase())) {
    queries.push(mainQuery);
    seenQueries.add(mainQuery.toLowerCase());
  }

  // === الأولوية 2: استعلامات من العناوين الفرعية ===
  for (let i = 0; i < Math.min(subTopics.length, 3); i++) {
    const subQuery = topicToEnglishKeywords(subTopics[i]);
    if (subQuery && !seenQueries.has(subQuery.toLowerCase())) {
      queries.push(subQuery);
      seenQueries.add(subQuery.toLowerCase());
    }
  }

  // === الأولوية 3: استعلامات سياقية محددة (فقط إذا لم نجد كفاية) ===
  if (queries.length < imageCount) {
    const contextQueries: Record<string, string[]> = {
      birthday: ['birthday cake', 'birthday party', 'birthday celebration'],
      zodiac: ['zodiac constellation', 'astrology stars', 'horoscope'],
      age: ['birthday milestone', 'celebration cake'],
      family: ['happy family', 'family celebration'],
      celebration: ['celebration party', 'festive decorations'],
      general: ['celebration', 'colorful party'],
    };

    const contextSpecific =
      contextQueries[context] || contextQueries['general'];
    for (const cq of contextSpecific) {
      if (queries.length >= imageCount) break;
      if (!seenQueries.has(cq.toLowerCase())) {
        queries.push(cq);
        seenQueries.add(cq.toLowerCase());
      }
    }
  }

  console.log(
    `📋 [v6.0] استعلامات البحث (${queries.length}):`,
    queries.slice(0, 5)
  );

  return queries.slice(0, imageCount + 2);
}

// استعلامات بحث حسب السياق
function getContextualSearchQueries(context: string): string[] {
  const contextQueries: Record<string, string[]> = {
    birthday: [
      'birthday celebration happy',
      'birthday cake candles',
      'birthday party decorations',
      'birthday balloons colorful',
      'birthday gifts presents',
      'happy birthday celebration',
    ],
    zodiac: [
      'zodiac signs astrology',
      'horoscope stars constellation',
      'astrology symbols',
      'zodiac wheel',
      'starry night sky',
      'cosmic universe',
    ],
    age: [
      'birthday milestone celebration',
      'age celebration happy',
      'birthday party family',
      'celebration cake',
      'happy moments family',
    ],
    family: [
      'happy family together',
      'family celebration',
      'family gathering',
      'parents children happy',
      'family love',
    ],
    celebration: [
      'celebration party',
      'festive decorations',
      'happy celebration',
      'party confetti',
      'joyful moment',
    ],
    general: [
      'celebration happy',
      'colorful festive',
      'happy moment',
      'beautiful celebration',
    ],
  };

  return contextQueries[context] || contextQueries['general'];
}

// توليد استعلام الصورة البارزة
function generateFeaturedImageQuery(title: string, context: string): string {
  // الصورة البارزة يجب أن تكون جذابة وعامة أكثر
  const featuredQueries: Record<string, string> = {
    birthday: 'birthday celebration cake balloons happy',
    zodiac: 'zodiac astrology stars beautiful',
    age: 'birthday celebration milestone happy',
    family: 'happy family celebration together',
    celebration: 'celebration party festive colorful',
    general: 'celebration happy colorful beautiful',
  };

  // دمج استعلام العنوان مع الاستعلام السياقي
  const titleKeywords = topicToEnglishKeywords(title);
  const contextQuery = featuredQueries[context] || featuredQueries['general'];

  // أخذ أول كلمتين من العنوان ودمجها مع السياق
  const titleWords = titleKeywords.split(' ').slice(0, 2).join(' ');

  return `${titleWords} ${contextQuery.split(' ').slice(0, 2).join(' ')}`;
}

// ===== قاموس ترجمة ذكي للكلمات الفردية (v6.0) =====
// يترجم الكلمات العربية الفردية للإنجليزية بدقة عالية
const smartWordTranslations: Record<string, string> = {
  // الأبراج
  الحمل: 'aries',
  'برج الحمل': 'aries zodiac',
  الثور: 'taurus',
  ثور: 'taurus',
  الجوزاء: 'gemini',
  جوزاء: 'gemini',
  السرطان: 'cancer',
  سرطان: 'cancer zodiac',
  الأسد: 'leo',
  أسد: 'leo',
  العذراء: 'virgo',
  عذراء: 'virgo',
  الميزان: 'libra',
  ميزان: 'libra',
  العقرب: 'scorpio',
  عقرب: 'scorpio',
  القوس: 'sagittarius',
  قوس: 'sagittarius',
  الجدي: 'capricorn',
  جدي: 'capricorn',
  الدلو: 'aquarius',
  دلو: 'aquarius',
  الحوت: 'pisces',
  حوت: 'pisces',
  برج: 'zodiac sign',
  أبراج: 'zodiac signs',
  فلك: 'astrology',
  فلكي: 'astrological',
  نجوم: 'stars',
  نجم: 'star',
  كواكب: 'planets',
  كوكب: 'planet',
  صفات: 'traits personality',
  توافق: 'compatibility',

  // عيد الميلاد
  عيد: 'birthday celebration',
  ميلاد: 'birthday',
  كيك: 'cake',
  كيكة: 'birthday cake',
  كعكة: 'cake',
  شموع: 'candles',
  شمعة: 'candle',
  بالونات: 'balloons',
  بالون: 'balloon',
  هدايا: 'gifts presents',
  هدية: 'gift',
  حفلة: 'party celebration',
  احتفال: 'celebration',
  تهنئة: 'congratulations wishes',
  مبارك: 'blessed happy',
  سعيد: 'happy joyful',
  سعادة: 'happiness joy',

  // العمر والوقت
  عمر: 'age birthday',
  سنة: 'year',
  سنوات: 'years',
  شهر: 'month',
  شهور: 'months',
  أشهر: 'months',
  يوم: 'day',
  أيام: 'days',
  ساعة: 'hour',
  ساعات: 'hours',
  دقيقة: 'minute',
  دقائق: 'minutes',
  حساب: 'calculator calculation',
  حاسبة: 'calculator',

  // العائلة
  طفل: 'child kid',
  أطفال: 'children kids',
  رضيع: 'baby infant',
  مولود: 'newborn baby',
  عائلة: 'family',
  أسرة: 'family',
  أم: 'mother mom',
  أب: 'father dad',
  جد: 'grandfather',
  جدة: 'grandmother',
  أخ: 'brother',
  أخت: 'sister',
  ابن: 'son',
  ابنة: 'daughter',
  زوج: 'husband',
  زوجة: 'wife',

  // الأحجار والزهور
  حجر: 'gemstone birthstone',
  أحجار: 'gemstones',
  ماس: 'diamond',
  الماس: 'diamond',
  ياقوت: 'ruby sapphire',
  زمرد: 'emerald',
  لؤلؤ: 'pearl',
  اللؤلؤ: 'pearl',
  زهرة: 'flower',
  زهور: 'flowers',
  ورد: 'roses flowers',
  وردة: 'rose',
  باقة: 'bouquet flowers',

  // الشهور
  يناير: 'january',
  فبراير: 'february',
  مارس: 'march',
  أبريل: 'april',
  مايو: 'may',
  يونيو: 'june',
  يوليو: 'july',
  أغسطس: 'august',
  سبتمبر: 'september',
  أكتوبر: 'october',
  نوفمبر: 'november',
  ديسمبر: 'december',

  // الفصول
  ربيع: 'spring',
  الربيع: 'spring',
  صيف: 'summer',
  الصيف: 'summer',
  خريف: 'autumn fall',
  الخريف: 'autumn',
  شتاء: 'winter',
  الشتاء: 'winter',

  // الألوان
  أحمر: 'red',
  أزرق: 'blue',
  أخضر: 'green',
  أصفر: 'yellow',
  برتقالي: 'orange',
  بنفسجي: 'purple',
  وردي: 'pink',
  أبيض: 'white',
  أسود: 'black',
  ذهبي: 'gold golden',
  فضي: 'silver',
  لون: 'color',
  ألوان: 'colors colorful',

  // الصحة
  صحة: 'health wellness',
  صحي: 'healthy',
  وزن: 'weight',
  طول: 'height',
  سعرات: 'calories',
  حمل: 'pregnancy',
  نمو: 'growth development',

  // كلمات عامة
  جميل: 'beautiful',
  رائع: 'wonderful amazing',
  مميز: 'special unique',
  أفضل: 'best',
  حب: 'love heart',
  فرح: 'joy happiness',
  ذكرى: 'anniversary memory',
  مناسبة: 'occasion event',
  تخرج: 'graduation',
  زواج: 'wedding marriage',
  خطوبة: 'engagement',
};

// تحويل الموضوع العربي لكلمات إنجليزية للبحث (v6.0 - إصلاح جذري للصلة)
// الهدف: الحصول على صور مرتبطة مباشرة بالموضوع
export function topicToEnglishKeywords(topic: string): string {
  console.log(`🔍 [v6.0] بدء ترجمة الموضوع: "${topic}"`);

  const translatedWords: string[] = [];
  const seenWords = new Set<string>();

  // === المرحلة 1: ترجمة الكلمات الفردية من الموضوع ===
  // هذا يضمن أن الكلمات المترجمة مرتبطة مباشرة بالموضوع
  const arabicWords = topic.split(/[\s،,.-]+/).filter((w) => w.length > 1);

  for (const word of arabicWords) {
    // البحث عن ترجمة مباشرة
    const translation = smartWordTranslations[word];
    if (translation) {
      const words = translation.split(' ');
      for (const w of words) {
        if (!seenWords.has(w.toLowerCase())) {
          translatedWords.push(w);
          seenWords.add(w.toLowerCase());
        }
      }
    }
  }

  // === المرحلة 2: البحث عن عبارات كاملة في القاموس الموسع ===
  const sortedKeys = Object.keys(arabicToEnglishKeywords).sort(
    (a, b) => b.length - a.length
  );

  for (const arabicTerm of sortedKeys) {
    if (topic.includes(arabicTerm) && translatedWords.length < 8) {
      const englishTerms = arabicToEnglishKeywords[arabicTerm];
      // أخذ أول ترجمة فقط (الأكثر صلة)
      if (englishTerms && englishTerms.length > 0) {
        const firstTranslation = englishTerms[0].split(' ');
        for (const w of firstTranslation.slice(0, 3)) {
          if (!seenWords.has(w.toLowerCase())) {
            translatedWords.push(w);
            seenWords.add(w.toLowerCase());
          }
        }
      }
    }
  }

  // === المرحلة 3: تحديد السياق وإضافة كلمة سياقية واحدة فقط ===
  const context = detectTopicContext(topic);

  // إضافة كلمة سياقية واحدة فقط إذا لم نجد كلمات كافية
  if (translatedWords.length < 2) {
    const contextWord: Record<string, string> = {
      birthday: 'birthday',
      zodiac: 'zodiac',
      age: 'birthday',
      family: 'family',
      celebration: 'celebration',
      general: 'celebration',
    };
    const word = contextWord[context] || 'celebration';
    if (!seenWords.has(word)) {
      translatedWords.push(word);
    }
  }

  // === المرحلة 4: بناء النتيجة النهائية ===
  // أخذ أول 4 كلمات فقط للحصول على نتائج أكثر دقة
  const result = translatedWords.slice(0, 4).join(' ');

  console.log(`✅ [v6.0] الترجمة: "${topic}" → "${result}" (سياق: ${context})`);

  // === Fallback ذكي حسب السياق ===
  if (!result || result.trim().length < 3) {
    const contextFallbacks: Record<string, string> = {
      birthday: 'birthday cake celebration',
      zodiac: 'zodiac constellation stars',
      age: 'birthday celebration',
      family: 'happy family',
      celebration: 'celebration party',
      general: 'celebration colorful',
    };
    const fallback = contextFallbacks[context] || contextFallbacks['general'];
    console.log(`🔄 [v6.0] استخدام fallback: "${fallback}"`);
    return fallback;
  }

  return result;
}

// البحث عن صور من Pexels (محسّن v3.6 - تنوع جذري)
export async function searchImages(
  query: string,
  count: number = 5,
  page: number = 1
): Promise<PexelsImage[]> {
  let apiKey: string;

  try {
    apiKey = await import('@/lib/config/api-keys').then((module) =>
      module.getApiKey('pexels')
    );
  } catch (error: any) {
    console.warn('❌ Pexels: مفتاح API غير موجود أو غير صحيح:', error.message);
    return [];
  }

  if (!apiKey) {
    console.warn('❌ Pexels: مفتاح API فارغ');
    return [];
  }

  try {
    // تحويل الاستعلام للإنجليزية إذا كان عربياً
    const englishQuery = topicToEnglishKeywords(query);

    // إضافة عشوائية كبيرة للصفحة (v3.6 - زيادة من 1-5 إلى 1-30)
    // استخدام timestamp لضمان عشوائية مختلفة في كل طلب
    const timestamp = Date.now();
    const randomSeed = (timestamp % 1000) + Math.floor(Math.random() * 100);
    const randomPage = page === 1 ? (randomSeed % 30) + 1 : page;

    console.log(
      `🔍 [Pexels v3.6] البحث عن: "${englishQuery}" (${count} صور، صفحة ${randomPage})`
    );

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        englishQuery
      )}&per_page=${count}&page=${randomPage}&orientation=landscape`,
      {
        headers: {
          Authorization: apiKey,
        },
        // إضافة cache: 'no-store' لمنع التخزين المؤقت
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Pexels API error: ${response.status} - ${errorText}`);
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data: PexelsSearchResult = await response.json();

    console.log(
      `✅ [Pexels v3.6] تم العثور على ${data.total_results} صورة، تم إرجاع ${
        data.photos?.length || 0
      }`
    );

    // إذا لم نجد صور كافية، جرب بحث أبسط مع صفحة عشوائية مختلفة
    if (
      (!data.photos || data.photos.length < count) &&
      englishQuery.includes(' ')
    ) {
      console.log('🔄 [Pexels v3.6] محاولة بحث بكلمات أقل...');
      const simpleQuery = englishQuery.split(' ').slice(0, 2).join(' ');
      const fallbackPage = Math.floor(Math.random() * 20) + 1;

      const fallbackResponse = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          simpleQuery
        )}&per_page=${count}&page=${fallbackPage}&orientation=landscape`,
        {
          headers: {
            Authorization: apiKey,
          },
          cache: 'no-store',
        }
      );

      if (fallbackResponse.ok) {
        const fallbackData: PexelsSearchResult = await fallbackResponse.json();
        if (
          fallbackData.photos &&
          fallbackData.photos.length > (data.photos?.length || 0)
        ) {
          console.log(
            `✅ [Pexels v3.6] البحث البسيط أرجع ${fallbackData.photos.length} صورة`
          );
          return fallbackData.photos;
        }
      }
    }

    return data.photos || [];
  } catch (error) {
    console.error('❌ Pexels search error:', error);
    return [];
  }
}

// الحصول على صورة عشوائية
export async function getRandomImage(
  topic: string
): Promise<PexelsImage | null> {
  const images = await searchImages(topic, 15);
  if (images.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

// ===== دالة البحث المدمج من Pexels + Unsplash (v6.0) =====
// تجمع الصور من كلا المزودين مع ترتيب حسب الصلة بالموضوع
async function searchCombinedImages(
  query: string,
  count: number = 10,
  originalTopic?: string
): Promise<UnifiedImage[]> {
  const results: UnifiedImage[] = [];
  const seenIds = new Set<string>();

  // تقسيم العدد المطلوب بين المزودين (50% لكل مزود)
  const pexelsCount = Math.ceil(count / 2);
  const unsplashCount = Math.ceil(count / 2);

  console.log(
    `🔍 [Combined v6.0] البحث عن ${count} صور للاستعلام: "${query.substring(
      0,
      50
    )}..."`
  );

  // البحث من كلا المزودين بالتوازي
  const [pexelsImages, unsplashImages] = await Promise.all([
    searchImages(query, pexelsCount * 2),
    searchUnsplashImages(query, unsplashCount * 2),
  ]);

  console.log(
    `📊 [Combined v5.1] Pexels: ${pexelsImages.length}, Unsplash: ${unsplashImages.length}`
  );

  // دالة لحساب نقاط الصلة بالموضوع (v5.1)
  const calculateRelevance = (alt: string, searchQuery: string): number => {
    if (!alt) return 0;
    let score = 0;
    const altLower = alt.toLowerCase();
    const queryWords = searchQuery.toLowerCase().split(/\s+/);

    for (const word of queryWords) {
      if (word.length > 2 && altLower.includes(word)) {
        score += 15; // نقاط أعلى للمطابقة
      }
    }

    // نقاط إضافية للوصف الطويل (أكثر تفصيلاً)
    if (alt.length > 30) score += 5;

    return score;
  };

  // تحويل صور Pexels للصيغة الموحدة مع حساب الصلة
  const pexelsWithScore = pexelsImages.map((img) => ({
    image: {
      id: `pexels_${img.id}`,
      url: img.src.large,
      urlLarge: img.src.large2x,
      alt: img.alt || '',
      photographer: img.photographer,
      provider: 'pexels' as const,
    },
    score: calculateRelevance(img.alt || '', query),
  }));

  // تحويل صور Unsplash للصيغة الموحدة مع حساب الصلة
  const unsplashWithScore = unsplashImages.map((img) => ({
    image: {
      id: `unsplash_${img.id}`,
      url: img.urls.regular,
      urlLarge: img.urls.full,
      alt: img.alt_description || img.description || '',
      photographer: img.user.name,
      provider: 'unsplash' as const,
    },
    score: calculateRelevance(
      img.alt_description || img.description || '',
      query
    ),
  }));

  // دمج وترتيب حسب الصلة (الأعلى أولاً)
  const allWithScore = [...pexelsWithScore, ...unsplashWithScore].sort(
    (a, b) => b.score - a.score
  );

  // إضافة الصور الفريدة
  for (const { image } of allWithScore) {
    if (!seenIds.has(image.id)) {
      seenIds.add(image.id);
      results.push(image);
    }
  }

  console.log(
    `✅ [Combined v6.0] إجمالي الصور الموحدة: ${results.length} (مرتبة حسب الصلة)`
  );

  return results;
}

// حقن الصور في محتوى HTML (v6.0 - تركيز على الصلة بالموضوع)
// - استخدام استعلامات بحث مركزة على الموضوع
// - ترتيب الصور حسب الصلة بالموضوع
// - تقليل الاستعلامات العامة التي تجلب صور غير مرتبطة
export async function injectImagesIntoContent(
  html: string,
  topic: string,
  imageCount?: number
): Promise<string> {
  // تحليل المحتوى لتحديد الصور المناسبة
  const analysis = analyzeContentForImages(html, topic);

  // استخدام العدد المحسوب إذا لم يُحدد
  const targetImageCount = imageCount || analysis.suggestedImageCount;

  console.log(
    `🖼️ [Images v6.0] بدء حقن ${targetImageCount} صور للموضوع: "${topic}"`
  );
  console.log(`📋 [Images v6.0] استعلامات البحث:`, analysis.searchQueries);

  // جلب صور متنوعة من كلا المزودين
  const allImages: UnifiedImage[] = [];
  const usedImageIds = new Set<string>();
  const usedImageUrls = new Set<string>();
  const usedImageHashes = new Set<string>();
  const usedPhotographers = new Set<string>();

  // دالة لحساب hash بسيط للصورة
  const getImageHash = (img: UnifiedImage): string => {
    return `${img.provider}_${img.photographer}_${img.url.split('/').pop()}`;
  };

  // دالة لحساب نقاط الصلة بالموضوع (v6.0 - محسّنة)
  const calculateRelevanceScore = (
    img: UnifiedImage,
    searchQuery: string,
    originalTopic: string
  ): number => {
    let score = 0;
    const altLower = (img.alt || '').toLowerCase();
    const queryWords = searchQuery.toLowerCase().split(/\s+/);
    const topicWords = topicToEnglishKeywords(originalTopic)
      .toLowerCase()
      .split(/\s+/);

    // نقاط عالية لمطابقة كلمات الموضوع الأصلي
    for (const word of topicWords) {
      if (word.length > 2 && altLower.includes(word)) {
        score += 20; // نقاط أعلى للموضوع الأصلي
      }
    }

    // نقاط لكل كلمة مطابقة في استعلام البحث
    for (const word of queryWords) {
      if (word.length > 2 && altLower.includes(word)) {
        score += 10;
      }
    }

    // نقاط إضافية للصور ذات alt text طويل (أكثر وصفية)
    if (img.alt && img.alt.length > 20) score += 3;
    if (img.alt && img.alt.length > 50) score += 2;

    return score;
  };

  // v6.0: استخدام الاستعلامات المركزة فقط (بدون توليد استعلامات عشوائية)
  const searchQueries = analysis.searchQueries;
  console.log(`📋 [Images v6.0] استعلامات البحث المركزة:`, searchQueries);

  // جلب صور من كل استعلام باستخدام البحث المدمج (Pexels + Unsplash)
  for (const query of searchQueries) {
    if (allImages.length >= targetImageCount * 2) break;

    // البحث المدمج من كلا المزودين
    const combinedImages = await searchCombinedImages(query, 15, topic);

    // ترتيب الصور حسب الصلة بالموضوع الأصلي
    const scoredImages = combinedImages
      .map((img) => ({
        image: img,
        score: calculateRelevanceScore(img, query, topic),
      }))
      .sort((a, b) => b.score - a.score);

    for (const { image: img } of scoredImages) {
      const hash = getImageHash(img);
      const photographerKey = img.photographer.toLowerCase().trim();

      // التحقق الصارم من عدم التكرار
      if (
        !usedImageIds.has(img.id) &&
        !usedImageUrls.has(img.url) &&
        !usedImageHashes.has(hash) &&
        !usedPhotographers.has(photographerKey)
      ) {
        allImages.push(img);
        usedImageIds.add(img.id);
        usedImageUrls.add(img.url);
        usedImageHashes.add(hash);
        usedPhotographers.add(photographerKey);
      }
    }
  }

  // إذا لم نحصل على صور كافية، جرب استعلامات سياقية محددة (v6.0)
  if (allImages.length < targetImageCount) {
    console.log(`🔄 [Images v6.0] جلب صور إضافية من استعلامات سياقية...`);
    const extraQueries = getContextualSearchQueries(analysis.context);

    for (const query of extraQueries.slice(0, 3)) {
      if (allImages.length >= targetImageCount * 2) break;
      const combinedImages = await searchCombinedImages(query, 10, topic);
      for (const img of combinedImages) {
        const hash = getImageHash(img);
        const photographerKey = img.photographer.toLowerCase().trim();
        if (
          !usedImageIds.has(img.id) &&
          !usedImageUrls.has(img.url) &&
          !usedImageHashes.has(hash) &&
          !usedPhotographers.has(photographerKey)
        ) {
          allImages.push(img);
          usedImageIds.add(img.id);
          usedImageUrls.add(img.url);
          usedImageHashes.add(hash);
          usedPhotographers.add(photographerKey);
        }
      }
    }
  }

  if (allImages.length === 0) {
    console.warn('⚠️ [Images v6.0] لم يتم العثور على صور');
    return html;
  }

  console.log(
    `✅ [Images v6.0] تم جمع ${allImages.length} صورة فريدة من Pexels + Unsplash`
  );

  let result = html;

  // استخراج عناوين H2 و H3 من المحتوى
  const h2Matches = html.match(/<h2[^>]*>(.*?)<\/h2>/g) || [];
  const h3Matches = html.match(/<h3[^>]*>(.*?)<\/h3>/g) || [];
  const allHeadings = [...h2Matches, ...h3Matches];
  const headingTexts = allHeadings.map((h) => h.replace(/<[^>]*>/g, '').trim());

  console.log(`📝 [Images v6.0] تم العثور على ${allHeadings.length} عنوان`);

  // توزيع الصور بشكل متساوي على المحتوى
  let imageIndex = 0;
  const insertedImageIds = new Set<string>(); // تتبع الصور المدرجة فعلياً

  // إضافة صورة بعد كل H2 أولاً
  for (
    let i = 0;
    i < h2Matches.length &&
    imageIndex < allImages.length &&
    insertedImageIds.size < targetImageCount;
    i++
  ) {
    const h2 = h2Matches[i];

    // البحث عن صورة غير مستخدمة
    while (
      imageIndex < allImages.length &&
      insertedImageIds.has(allImages[imageIndex].id)
    ) {
      imageIndex++;
    }

    if (imageIndex >= allImages.length) break;

    const image = allImages[imageIndex];
    const caption = headingTexts[i] || topic;
    const altText = image.alt || caption;

    const figureHtml = `
      <figure class="my-6 rounded-xl overflow-hidden shadow-lg" data-image-id="${image.id}" data-provider="${image.provider}">
        <img 
          src="${image.url}" 
          alt="${altText}"
          class="w-full h-auto rounded-xl"
          loading="lazy"
          width="1200"
          height="800"
        />
        <figcaption class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 px-4 pb-2">
          ${caption}
        </figcaption>
      </figure>
    `;

    // إضافة الصورة بعد H2
    result = result.replace(h2, h2 + figureHtml);
    insertedImageIds.add(image.id);
    imageIndex++;
    console.log(
      `✅ [Images v5.0] تم إضافة صورة ${insertedImageIds.size} (${
        image.provider
      }) بعد H2: "${caption.substring(0, 30)}..."`
    );
  }

  // إضافة صور بعد H3 إذا بقيت صور
  for (
    let i = 0;
    i < h3Matches.length &&
    imageIndex < allImages.length &&
    insertedImageIds.size < targetImageCount;
    i++
  ) {
    const h3 = h3Matches[i];

    while (
      imageIndex < allImages.length &&
      insertedImageIds.has(allImages[imageIndex].id)
    ) {
      imageIndex++;
    }

    if (imageIndex >= allImages.length) break;

    const image = allImages[imageIndex];
    const caption = h3.replace(/<[^>]*>/g, '').trim() || topic;
    const altText = image.alt || caption;

    const figureHtml = `
      <figure class="my-6 rounded-xl overflow-hidden shadow-lg" data-image-id="${image.id}" data-provider="${image.provider}">
        <img 
          src="${image.url}" 
          alt="${altText}"
          class="w-full h-auto rounded-xl"
          loading="lazy"
          width="1200"
          height="800"
        />
        <figcaption class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 px-4 pb-2">
          ${caption}
        </figcaption>
      </figure>
    `;

    result = result.replace(h3, h3 + figureHtml);
    insertedImageIds.add(image.id);
    imageIndex++;
    console.log(
      `✅ [Images v5.0] تم إضافة صورة ${insertedImageIds.size} (${image.provider}) بعد H3`
    );
  }

  // إذا بقيت صور مطلوبة، أضف صور بين الفقرات
  if (
    insertedImageIds.size < targetImageCount &&
    imageIndex < allImages.length
  ) {
    const paragraphs = result.match(/<\/p>/g) || [];
    const remainingImages = targetImageCount - insertedImageIds.size;
    const paragraphInterval = Math.max(
      2,
      Math.floor(paragraphs.length / (remainingImages + 1))
    );

    let paragraphCount = 0;
    let insertedAfterParagraph = 0;

    // إضافة صور بعد كل N فقرات
    result = result.replace(/<\/p>/g, (match) => {
      paragraphCount++;
      if (
        paragraphCount % paragraphInterval === 0 &&
        imageIndex < allImages.length &&
        insertedAfterParagraph < remainingImages
      ) {
        // البحث عن صورة غير مستخدمة
        while (
          imageIndex < allImages.length &&
          insertedImageIds.has(allImages[imageIndex].id)
        ) {
          imageIndex++;
        }

        if (imageIndex >= allImages.length) return match;

        const image = allImages[imageIndex];
        const altText = image.alt || topic;

        const figureHtml = `
          <figure class="my-6 rounded-xl overflow-hidden shadow-lg" data-image-id="${image.id}" data-provider="${image.provider}">
            <img 
              src="${image.url}" 
              alt="${altText}"
              class="w-full h-auto rounded-xl"
              loading="lazy"
              width="1200"
              height="800"
            />
            <figcaption class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 px-4 pb-2">
              ${topic}
            </figcaption>
          </figure>
        `;

        insertedImageIds.add(image.id);
        imageIndex++;
        insertedAfterParagraph++;
        console.log(
          `✅ [Images v5.0] تم إضافة صورة ${insertedImageIds.size} (${image.provider}) بعد فقرة ${paragraphCount}`
        );
        return match + figureHtml;
      }
      return match;
    });
  }

  console.log(
    `🎉 [Images v5.0] اكتمل حقن الصور - تم إضافة ${insertedImageIds.size} صور فريدة من Pexels + Unsplash`
  );
  return result;
}

// الحصول على صورة غلاف للمقال (محسّن - الإصدار 5.0)
// نظام fallback متعدد المراحل (5 مراحل) مع بحث من Pexels + Unsplash
export async function getArticleCoverImage(
  topic: string,
  content?: string
): Promise<string | null> {
  console.log(`🖼️ [Cover v5.0] البحث عن صورة غلاف للموضوع: "${topic}"`);

  // تحليل المحتوى إذا كان متاحاً
  let searchQuery: string;
  if (content) {
    const analysis = analyzeContentForImages(content, topic);
    searchQuery = analysis.featuredImageQuery;
  } else {
    const context = detectTopicContext(topic);
    searchQuery = generateFeaturedImageQuery(topic, context);
  }

  console.log(`🔍 [Cover v5.0] استعلام الصورة البارزة: "${searchQuery}"`);

  // محاولة 1: البحث من Unsplash أولاً (صور عالية الجودة)
  const unsplashCover = await getUnsplashCoverImage(topic);
  if (unsplashCover) {
    console.log(`✅ [Cover v5.0] تم العثور على صورة غلاف من Unsplash`);
    return unsplashCover;
  }

  // محاولة 2: البحث من Pexels
  let images = await searchImages(searchQuery, 25);

  if (images.length > 0) {
    const bestImage = selectBestFeaturedImage(images, topic);
    console.log(
      `✅ [Cover v5.0] تم العثور على صورة غلاف من Pexels: ${bestImage.src.large2x.substring(
        0,
        50
      )}...`
    );
    return bestImage.src.large2x;
  }

  // محاولة 2: بحث بكلمات أقل
  console.log('🔄 [Pexels v3.4] محاولة بحث بكلمات أقل...');
  const simpleQuery = topicToEnglishKeywords(topic)
    .split(' ')
    .slice(0, 3)
    .join(' ');
  images = await searchImages(simpleQuery, 25);

  if (images.length > 0) {
    const bestImage = selectBestFeaturedImage(images, topic);
    console.log(
      `✅ [Pexels v3.4] تم العثور على صورة غلاف (بحث بسيط): ${bestImage.src.large2x.substring(
        0,
        50
      )}...`
    );
    return bestImage.src.large2x;
  }

  // محاولة 3: بحث بالسياق فقط
  console.log('🔄 [Pexels v3.4] محاولة بحث بالسياق...');
  const context = detectTopicContext(topic);
  const contextQueries = getContextualSearchQueries(context);

  for (const query of contextQueries) {
    images = await searchImages(query, 20);
    if (images.length > 0) {
      const bestImage = selectBestFeaturedImage(images, topic);
      console.log(
        `✅ [Pexels v3.4] تم العثور على صورة غلاف (سياق): ${bestImage.src.large2x.substring(
          0,
          50
        )}...`
      );
      return bestImage.src.large2x;
    }
  }

  // محاولة 4: بحث عام (fallback)
  console.log('🔄 [Pexels v3.4] محاولة بحث عام...');
  const fallbackQueries = [
    'birthday celebration cake balloons colorful',
    'happy celebration party festive',
    'festive colorful decorations beautiful',
    'celebration balloons cake party',
    'joyful celebration happy moment',
  ];

  for (const query of fallbackQueries) {
    images = await searchImages(query, 20);
    if (images.length > 0) {
      const bestImage = selectBestFeaturedImage(images, topic);
      console.log(
        `✅ [Pexels v3.4] تم العثور على صورة غلاف (fallback): ${bestImage.src.large2x.substring(
          0,
          50
        )}...`
      );
      return bestImage.src.large2x;
    }
  }

  // محاولة 5: بحث نهائي بكلمات بسيطة جداً (جديد v3.4)
  console.log('🔄 [Pexels v3.4] محاولة بحث نهائي...');
  const ultimateFallbackQueries = [
    'colorful celebration',
    'happy party',
    'festive decorations',
    'birthday cake',
    'balloons party',
    'celebration',
    'party',
    'happy',
  ];

  for (const query of ultimateFallbackQueries) {
    images = await searchImages(query, 15);
    if (images.length > 0) {
      const bestImage = selectBestFeaturedImage(images, topic);
      console.log(
        `✅ [Pexels v3.4] تم العثور على صورة غلاف (نهائي): ${bestImage.src.large2x.substring(
          0,
          50
        )}...`
      );
      return bestImage.src.large2x;
    }
  }

  console.warn('⚠️ [Pexels v3.4] لم يتم العثور على صورة غلاف بعد كل المحاولات');
  return null;
}

// اختيار أفضل صورة للغلاف (محسّن v3.4)
function selectBestFeaturedImage(
  images: PexelsImage[],
  topic?: string
): PexelsImage {
  // حساب نقاط لكل صورة
  const scoredImages = images.map((img) => {
    let score = 0;

    // الأولوية للصور ذات alt text جيد
    if (img.alt && img.alt.length > 10) score += 10;
    if (img.alt && img.alt.length > 30) score += 5;
    if (img.alt && img.alt.length > 50) score += 5;

    // نقاط إضافية إذا كان alt يحتوي على كلمات من الموضوع
    if (topic && img.alt) {
      const topicWords = topic.toLowerCase().split(/\s+/);
      const altLower = img.alt.toLowerCase();
      for (const word of topicWords) {
        if (word.length > 2 && altLower.includes(word)) {
          score += 8;
        }
      }
    }

    // نقاط للصور ذات الكلمات المفتاحية الإيجابية
    const positiveKeywords = [
      'celebration',
      'happy',
      'birthday',
      'party',
      'colorful',
      'festive',
      'joy',
    ];
    if (img.alt) {
      const altLower = img.alt.toLowerCase();
      for (const keyword of positiveKeywords) {
        if (altLower.includes(keyword)) {
          score += 3;
        }
      }
    }

    return { image: img, score };
  });

  // ترتيب حسب النقاط
  scoredImages.sort((a, b) => b.score - a.score);

  // إرجاع الصورة الأعلى نقاطاً
  return scoredImages[0].image;
}

// ===== الدالة الرئيسية الشاملة =====

// حساب عدد الصور المثالي (دالة مُصدّرة للاستخدام الخارجي) - v4.0
// زيادة كبيرة جداً في عدد الصور: 8-30 صورة حسب حجم المقال
export function calculateOptimalImageCount(
  wordCount: number,
  headingsCount: number = 0
): number {
  // قاعدة محسّنة v4.0: صورة واحدة لكل 120-150 كلمة تقريباً
  // مع حد أدنى 8 وحد أقصى 30

  let baseCount = Math.floor(wordCount / 140);

  // تعديل بناءً على عدد العناوين (صورة لكل عنوان تقريباً + 20%)
  const headingBasedCount = Math.ceil(headingsCount * 1.3);

  // اختيار الأكبر بين الطريقتين
  let optimalCount = Math.max(baseCount, headingBasedCount);

  // تطبيق الحدود الجديدة (حد أدنى 8، حد أقصى 30)
  optimalCount = Math.max(8, Math.min(30, optimalCount));

  // جدول مرجعي محسّن v4.0 لأحجام المقالات (زيادة كبيرة جداً في عدد الصور)
  if (wordCount < 300) {
    return 8; // مقال قصير جداً - 8 صور على الأقل
  } else if (wordCount < 500) {
    return 10; // مقال قصير
  } else if (wordCount < 700) {
    return 12; // مقال قصير متوسط
  } else if (wordCount < 900) {
    return 14; // مقال متوسط قصير
  } else if (wordCount < 1200) {
    return 16; // مقال متوسط
  } else if (wordCount < 1500) {
    return 18; // مقال متوسط طويل
  } else if (wordCount < 1800) {
    return 20; // مقال طويل قصير
  } else if (wordCount < 2200) {
    return 22; // مقال طويل
  } else if (wordCount < 2700) {
    return 24; // مقال طويل جداً
  } else if (wordCount < 3500) {
    return 26; // مقال شامل
  } else if (wordCount < 5000) {
    return 28; // مقال ضخم
  } else {
    return 30; // مقال ضخم جداً
  }
}

// ===== صورة موحدة للاستخدام مع كلا المزودين =====
interface UnifiedImageInternal {
  id: string;
  url: string;
  urlLarge: string;
  alt: string;
  photographer: string;
  provider: 'pexels' | 'unsplash';
}

// تحويل صورة Pexels لصيغة موحدة
function convertPexelsToUnified(image: PexelsImage): UnifiedImageInternal {
  return {
    id: `pexels_${image.id}`,
    url: image.src.large,
    urlLarge: image.src.large2x,
    alt: image.alt || '',
    photographer: image.photographer,
    provider: 'pexels',
  };
}

// البحث المدمج من Pexels و Unsplash - v4.0
async function searchUnifiedImages(
  query: string,
  count: number = 10
): Promise<UnifiedImageInternal[]> {
  const results: UnifiedImageInternal[] = [];
  const seenIds = new Set<string>();
  const seenUrls = new Set<string>();
  const seenPhotographers = new Set<string>();

  // تحويل الاستعلام للإنجليزية
  const englishQuery = topicToEnglishKeywords(query);

  // البحث من Pexels
  try {
    const pexelsImages = await searchImages(
      englishQuery,
      Math.ceil(count * 0.6)
    );
    for (const img of pexelsImages) {
      const unified = convertPexelsToUnified(img);
      const photographerKey = unified.photographer.toLowerCase().trim();
      if (
        !seenIds.has(unified.id) &&
        !seenUrls.has(unified.url) &&
        !seenPhotographers.has(photographerKey)
      ) {
        results.push(unified);
        seenIds.add(unified.id);
        seenUrls.add(unified.url);
        seenPhotographers.add(photographerKey);
      }
    }
    console.log(`✅ [Unified v4.0] Pexels: ${pexelsImages.length} صور`);
  } catch (error) {
    console.error('❌ [Unified v4.0] Pexels error:', error);
  }

  // البحث من Unsplash
  try {
    const { searchUnsplashImages, convertUnsplashToUnified } = await import(
      './unsplash'
    );
    const unsplashImages = await searchUnsplashImages(
      englishQuery,
      Math.ceil(count * 0.6)
    );
    for (const img of unsplashImages) {
      const unified = convertUnsplashToUnified(img);
      const photographerKey = unified.photographer.toLowerCase().trim();
      if (
        !seenIds.has(unified.id) &&
        !seenUrls.has(unified.url) &&
        !seenPhotographers.has(photographerKey)
      ) {
        results.push({
          id: unified.id,
          url: unified.url,
          urlLarge: unified.urlLarge,
          alt: unified.alt,
          photographer: unified.photographer,
          provider: 'unsplash',
        });
        seenIds.add(unified.id);
        seenUrls.add(unified.url);
        seenPhotographers.add(photographerKey);
      }
    }
    console.log(`✅ [Unified v4.0] Unsplash: ${unsplashImages.length} صور`);
  } catch (error) {
    console.warn('⚠️ [Unified v4.0] Unsplash غير متاح:', error);
  }

  // خلط النتائج للتنوع
  const shuffled = results.sort(() => Math.random() - 0.5);
  console.log(`✅ [Unified v4.0] إجمالي الصور الفريدة: ${shuffled.length}`);

  return shuffled.slice(0, count);
}

// الحصول على صورة غلاف موحدة من كلا المزودين - v4.0
async function getUnifiedCoverImage(
  topic: string,
  content?: string
): Promise<string | null> {
  console.log(`🖼️ [Unified v4.0] البحث عن صورة غلاف للموضوع: "${topic}"`);

  // محاولة 1: Pexels
  try {
    const pexelsCover = await getArticleCoverImage(topic, content);
    if (pexelsCover) {
      console.log(`✅ [Unified v4.0] صورة غلاف من Pexels`);
      return pexelsCover;
    }
  } catch (error) {
    console.warn('⚠️ [Unified v4.0] Pexels cover error:', error);
  }

  // محاولة 2: Unsplash
  try {
    const { getUnsplashCoverImage } = await import('./unsplash');
    const unsplashCover = await getUnsplashCoverImage(topic);
    if (unsplashCover) {
      console.log(`✅ [Unified v4.0] صورة غلاف من Unsplash`);
      return unsplashCover;
    }
  } catch (error) {
    console.warn('⚠️ [Unified v4.0] Unsplash cover error:', error);
  }

  console.warn('⚠️ [Unified v4.0] لم يتم العثور على صورة غلاف');
  return null;
}

// إضافة الصور للمقال بشكل ذكي (الصورة البارزة + صور المحتوى) - v4.0
// يستخدم كلا المزودين (Pexels + Unsplash) للتنوع الأقصى
// زيادة كبيرة جداً في عدد الصور مع منع تكرار صارم (4 طرق)
export async function addSmartImagesToArticle(
  content: string,
  title: string,
  options?: {
    maxImages?: number;
    includeFeaturedImage?: boolean;
  }
): Promise<ArticleWithImages> {
  const maxImages = options?.maxImages;
  const includeFeaturedImage = options?.includeFeaturedImage !== false;

  console.log(
    `🚀 [Pexels+Unsplash v4.0] بدء إضافة الصور الذكية للمقال: "${title}"`
  );

  // تحليل المحتوى
  const analysis = analyzeContentForImages(content, title);

  // حساب عدد الكلمات
  const wordCount = content.split(/\s+/).filter((w) => w.length > 0).length;

  // استخدام العدد المحدد أو الحساب التلقائي
  const targetImageCount = maxImages || analysis.suggestedImageCount;

  console.log(`📊 [v4.0] تحليل المحتوى:`);
  console.log(`   - عدد الكلمات: ${wordCount}`);
  console.log(`   - السياق: ${analysis.context}`);
  console.log(`   - عدد الصور المقترح: ${targetImageCount}`);
  console.log(`   - عدد العناوين الفرعية: ${analysis.subTopics.length}`);

  // الحصول على الصورة البارزة أولاً (من كلا المزودين)
  let featuredImage: string | null = null;
  if (includeFeaturedImage) {
    try {
      featuredImage = await getUnifiedCoverImage(title, content);
      console.log(
        `✅ [v4.0] تم الحصول على الصورة البارزة: ${
          featuredImage ? 'نعم' : 'لا'
        }`
      );
    } catch (error) {
      console.error(`❌ [v4.0] فشل في الحصول على الصورة البارزة:`, error);
    }
  }

  // جمع الصور من كلا المزودين
  const allImages: UnifiedImageInternal[] = [];
  const usedImageIds = new Set<string>();
  const usedImageUrls = new Set<string>();
  const usedPhotographers = new Set<string>();

  // توليد استعلامات متنوعة
  const variedQueries = generateSearchQueries(
    title,
    analysis.subTopics,
    analysis.context,
    targetImageCount
  );

  console.log(
    `📋 [v4.0] استعلامات البحث: ${variedQueries.slice(0, 5).join(', ')}...`
  );

  // جلب صور من كل استعلام باستخدام كلا المزودين
  for (const query of variedQueries.slice(0, 8)) {
    if (allImages.length >= targetImageCount * 3) break;

    const images = await searchUnifiedImages(query, 15);

    for (const img of images) {
      const photographerKey = img.photographer.toLowerCase().trim();
      if (
        !usedImageIds.has(img.id) &&
        !usedImageUrls.has(img.url) &&
        !usedPhotographers.has(photographerKey)
      ) {
        allImages.push(img);
        usedImageIds.add(img.id);
        usedImageUrls.add(img.url);
        usedPhotographers.add(photographerKey);
      }
    }
  }

  // إذا لم نحصل على صور كافية، جرب استعلامات إضافية
  if (allImages.length < targetImageCount) {
    console.log(`🔄 [v4.0] جلب صور إضافية...`);
    const extraQueries = [
      'birthday celebration happy colorful',
      'party decorations festive',
      'celebration balloons cake',
      'happy family together',
      'zodiac astrology stars',
      'colorful celebration party',
    ];

    for (const query of extraQueries) {
      if (allImages.length >= targetImageCount * 2) break;
      const images = await searchUnifiedImages(query, 10);
      for (const img of images) {
        const photographerKey = img.photographer.toLowerCase().trim();
        if (
          !usedImageIds.has(img.id) &&
          !usedImageUrls.has(img.url) &&
          !usedPhotographers.has(photographerKey)
        ) {
          allImages.push(img);
          usedImageIds.add(img.id);
          usedImageUrls.add(img.url);
          usedPhotographers.add(photographerKey);
        }
      }
    }
  }

  if (allImages.length === 0) {
    console.warn('⚠️ [v4.0] لم يتم العثور على صور');
    return {
      content,
      featuredImage,
      imagesAdded: 0,
      imageDetails: [],
    };
  }

  // إحصائيات المزودين
  const pexelsCount = allImages.filter(
    (img) => img.provider === 'pexels'
  ).length;
  const unsplashCount = allImages.filter(
    (img) => img.provider === 'unsplash'
  ).length;
  console.log(
    `✅ [v4.0] تم جمع ${allImages.length} صورة فريدة (Pexels: ${pexelsCount}, Unsplash: ${unsplashCount})`
  );

  let result = content;

  // استخراج عناوين H2 و H3 من المحتوى
  const h2Matches = content.match(/<h2[^>]*>(.*?)<\/h2>/g) || [];
  const h3Matches = content.match(/<h3[^>]*>(.*?)<\/h3>/g) || [];
  const allHeadings = [...h2Matches, ...h3Matches];
  const headingTexts = allHeadings.map((h) => h.replace(/<[^>]*>/g, '').trim());

  console.log(`📝 [v4.0] تم العثور على ${allHeadings.length} عنوان`);

  // توزيع الصور بشكل متساوي على المحتوى
  let imageIndex = 0;
  const insertedImageIds = new Set<string>();

  // إضافة صورة بعد كل H2 أولاً
  for (
    let i = 0;
    i < h2Matches.length &&
    imageIndex < allImages.length &&
    insertedImageIds.size < targetImageCount;
    i++
  ) {
    const h2 = h2Matches[i];

    while (
      imageIndex < allImages.length &&
      insertedImageIds.has(allImages[imageIndex].id)
    ) {
      imageIndex++;
    }

    if (imageIndex >= allImages.length) break;

    const image = allImages[imageIndex];
    const caption = headingTexts[i] || title;
    const altText = image.alt || caption;

    const figureHtml = `
      <figure class="my-6 rounded-xl overflow-hidden shadow-lg" data-image-id="${image.id}" data-provider="${image.provider}">
        <img 
          src="${image.url}" 
          alt="${altText}"
          class="w-full h-auto rounded-xl"
          loading="lazy"
          width="1200"
          height="800"
        />
        <figcaption class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 px-4 pb-2">
          ${caption}
        </figcaption>
      </figure>
    `;

    result = result.replace(h2, h2 + figureHtml);
    insertedImageIds.add(image.id);
    imageIndex++;
    console.log(
      `✅ [v4.0] تم إضافة صورة ${insertedImageIds.size} (${image.provider}) بعد H2`
    );
  }

  // إضافة صور بعد H3 إذا بقيت صور
  for (
    let i = 0;
    i < h3Matches.length &&
    imageIndex < allImages.length &&
    insertedImageIds.size < targetImageCount;
    i++
  ) {
    const h3 = h3Matches[i];

    while (
      imageIndex < allImages.length &&
      insertedImageIds.has(allImages[imageIndex].id)
    ) {
      imageIndex++;
    }

    if (imageIndex >= allImages.length) break;

    const image = allImages[imageIndex];
    const caption = h3.replace(/<[^>]*>/g, '').trim() || title;
    const altText = image.alt || caption;

    const figureHtml = `
      <figure class="my-6 rounded-xl overflow-hidden shadow-lg" data-image-id="${image.id}" data-provider="${image.provider}">
        <img 
          src="${image.url}" 
          alt="${altText}"
          class="w-full h-auto rounded-xl"
          loading="lazy"
          width="1200"
          height="800"
        />
        <figcaption class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 px-4 pb-2">
          ${caption}
        </figcaption>
      </figure>
    `;

    result = result.replace(h3, h3 + figureHtml);
    insertedImageIds.add(image.id);
    imageIndex++;
    console.log(
      `✅ [v4.0] تم إضافة صورة ${insertedImageIds.size} (${image.provider}) بعد H3`
    );
  }

  // إذا بقيت صور مطلوبة، أضف صور بين الفقرات
  if (
    insertedImageIds.size < targetImageCount &&
    imageIndex < allImages.length
  ) {
    const paragraphs = result.match(/<\/p>/g) || [];
    const remainingImages = targetImageCount - insertedImageIds.size;
    const paragraphInterval = Math.max(
      2,
      Math.floor(paragraphs.length / (remainingImages + 1))
    );

    let paragraphCount = 0;
    let insertedAfterParagraph = 0;

    result = result.replace(/<\/p>/g, (match) => {
      paragraphCount++;
      if (
        paragraphCount % paragraphInterval === 0 &&
        imageIndex < allImages.length &&
        insertedAfterParagraph < remainingImages
      ) {
        while (
          imageIndex < allImages.length &&
          insertedImageIds.has(allImages[imageIndex].id)
        ) {
          imageIndex++;
        }

        if (imageIndex >= allImages.length) return match;

        const image = allImages[imageIndex];
        const altText = image.alt || title;

        const figureHtml = `
          <figure class="my-6 rounded-xl overflow-hidden shadow-lg" data-image-id="${image.id}" data-provider="${image.provider}">
            <img 
              src="${image.url}" 
              alt="${altText}"
              class="w-full h-auto rounded-xl"
              loading="lazy"
              width="1200"
              height="800"
            />
            <figcaption class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 px-4 pb-2">
              ${title}
            </figcaption>
          </figure>
        `;

        insertedImageIds.add(image.id);
        imageIndex++;
        insertedAfterParagraph++;
        console.log(
          `✅ [v4.0] تم إضافة صورة ${insertedImageIds.size} (${image.provider}) بعد فقرة ${paragraphCount}`
        );
        return match + figureHtml;
      }
      return match;
    });
  }

  // حساب عدد الصور المضافة
  const figureCount = (result.match(/<figure/g) || []).length;

  // استخراج تفاصيل الصور المضافة
  const imageDetails: ArticleWithImages['imageDetails'] = [];
  const figureMatches = result.match(/<figure[^>]*>[\s\S]*?<\/figure>/g) || [];

  for (const figure of figureMatches) {
    const srcMatch = figure.match(/src="([^"]+)"/);
    const altMatch = figure.match(/alt="([^"]+)"/);
    const providerMatch = figure.match(/data-provider="([^"]+)"/);

    if (srcMatch) {
      imageDetails.push({
        url: srcMatch[1],
        alt: altMatch?.[1] || title,
        photographer: providerMatch?.[1] || 'Unknown',
        position: 'content',
      });
    }
  }

  // ضمان وجود صورة بارزة دائماً
  if (!featuredImage) {
    if (imageDetails.length > 0) {
      featuredImage = imageDetails[0].url;
      console.log(`🔄 [v4.0] استخدام أول صورة من المحتوى كصورة بارزة`);
    } else {
      console.log(`🔄 [v4.0] محاولة أخيرة للحصول على صورة بارزة...`);
      const fallbackImages = await searchUnifiedImages(
        'birthday celebration happy colorful',
        10
      );
      if (fallbackImages.length > 0) {
        featuredImage = fallbackImages[0].urlLarge || fallbackImages[0].url;
        console.log(`✅ [v4.0] تم الحصول على صورة بارزة من البحث العام`);
      }
    }
  }

  // إضافة الصورة البارزة للتفاصيل
  if (featuredImage && !imageDetails.find((img) => img.url === featuredImage)) {
    imageDetails.unshift({
      url: featuredImage,
      alt: title,
      photographer: 'Mixed (Pexels/Unsplash)',
      position: 'featured',
    });
  }

  // إحصائيات نهائية
  const finalPexelsCount = imageDetails.filter((img) =>
    img.url.includes('pexels')
  ).length;
  const finalUnsplashCount = imageDetails.filter((img) =>
    img.url.includes('unsplash')
  ).length;

  console.log(`🎉 [v4.0] اكتمل إضافة الصور:`);
  console.log(`   - الصورة البارزة: ${featuredImage ? '✅' : '❌'}`);
  console.log(`   - صور المحتوى: ${figureCount}`);
  console.log(`   - إجمالي الصور: ${imageDetails.length}`);
  console.log(
    `   - من Pexels: ~${finalPexelsCount}, من Unsplash: ~${finalUnsplashCount}`
  );

  return {
    content: result,
    featuredImage,
    imagesAdded: figureCount,
    imageDetails,
  };
}

export default {
  searchImages,
  getRandomImage,
  injectImagesIntoContent,
  getArticleCoverImage,
  topicToEnglishKeywords,
  analyzeContentForImages,
  addSmartImagesToArticle,
  calculateOptimalImageCount,
};
