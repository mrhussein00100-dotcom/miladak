/**
 * Pexels API للصور المجانية
 * https://www.pexels.com/api/
 *
 * Version 2.0 - تحسين دقة البحث عن الصور
 */

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

export interface PexelsSearchResult {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsImage[];
}

// قاموس شامل ومحسّن للترجمة العربية-الإنجليزية
// مرتب حسب الأولوية (الأطول أولاً لتجنب الاستبدال الجزئي)
const arabicToEnglishKeywords: Record<string, string[]> = {
  // عيد الميلاد والاحتفالات (أولوية عالية)
  'عيد ميلاد سعيد': ['happy birthday celebration', 'birthday party'],
  'كيكة عيد ميلاد': ['birthday cake', 'celebration cake'],
  'شموع عيد ميلاد': ['birthday candles', 'cake candles'],
  'حفلة عيد ميلاد': ['birthday party', 'birthday celebration'],
  'هدايا عيد ميلاد': ['birthday gifts', 'birthday presents'],
  'عيد ميلاد': ['birthday celebration', 'birthday party'],
  'تهنئة بعيد الميلاد': ['birthday wishes', 'birthday greeting'],

  // الأبراج الفلكية
  'برج الحمل': ['aries zodiac sign', 'aries constellation'],
  'برج الثور': ['taurus zodiac sign', 'taurus constellation'],
  'برج الجوزاء': ['gemini zodiac sign', 'gemini twins'],
  'برج السرطان': ['cancer zodiac sign', 'cancer constellation'],
  'برج الأسد': ['leo zodiac sign', 'lion zodiac'],
  'برج العذراء': ['virgo zodiac sign', 'virgo constellation'],
  'برج الميزان': ['libra zodiac sign', 'libra scales'],
  'برج العقرب': ['scorpio zodiac sign', 'scorpion zodiac'],
  'برج القوس': ['sagittarius zodiac sign', 'archer zodiac'],
  'برج الجدي': ['capricorn zodiac sign', 'goat zodiac'],
  'برج الدلو': ['aquarius zodiac sign', 'water bearer zodiac'],
  'برج الحوت': ['pisces zodiac sign', 'fish zodiac'],
  الحمل: ['aries zodiac', 'ram symbol'],
  الثور: ['taurus zodiac', 'bull symbol'],
  الجوزاء: ['gemini zodiac', 'twins symbol'],
  السرطان: ['cancer zodiac', 'crab symbol'],
  الأسد: ['leo zodiac', 'lion symbol'],
  العذراء: ['virgo zodiac', 'maiden symbol'],
  الميزان: ['libra zodiac', 'scales symbol'],
  العقرب: ['scorpio zodiac', 'scorpion symbol'],
  القوس: ['sagittarius zodiac', 'archer symbol'],
  الجدي: ['capricorn zodiac', 'goat symbol'],
  الدلو: ['aquarius zodiac', 'water bearer'],
  الحوت: ['pisces zodiac', 'fish symbol'],
  أبراج: ['zodiac signs', 'horoscope'],
  برج: ['zodiac sign', 'horoscope'],
  فلك: ['astrology', 'astronomy'],
  نجوم: ['stars', 'starry sky'],

  // الأعمار والمراحل العمرية
  'حساب العمر': ['age calculation', 'birthday age'],
  'كم عمري': ['age calculator', 'how old'],
  'عمر الطفل': ['child age', 'baby age'],
  عمر: ['age', 'years old'],
  سنة: ['year', 'annual'],
  شهر: ['month', 'monthly'],
  يوم: ['day', 'daily'],

  // العائلة والأشخاص
  'طفل رضيع': ['baby', 'infant'],
  أطفال: ['children', 'kids playing'],
  طفل: ['child', 'kid'],
  عائلة: ['family', 'family together'],
  أصدقاء: ['friends', 'friendship'],
  مراهق: ['teenager', 'teen'],
  شاب: ['young adult', 'youth'],

  // المشاعر والمناسبات
  سعادة: ['happiness', 'joy'],
  فرح: ['joy', 'happy'],
  حب: ['love', 'heart'],
  تهنئة: ['congratulations', 'celebration'],
  أمنيات: ['wishes', 'best wishes'],
  ذكرى: ['anniversary', 'memory'],
  مفاجأة: ['surprise', 'surprise party'],

  // عناصر الاحتفال
  بالونات: ['balloons', 'party balloons'],
  كيك: ['cake', 'birthday cake'],
  كعكة: ['cake', 'dessert'],
  شموع: ['candles', 'birthday candles'],
  هدايا: ['gifts', 'presents'],
  هدية: ['gift', 'present'],
  زينة: ['decorations', 'party decorations'],
  حفلة: ['party', 'celebration'],
  احتفال: ['celebration', 'festivity'],
  كونفيتي: ['confetti', 'party confetti'],

  // الألوان
  أحمر: ['red', 'red color'],
  أزرق: ['blue', 'blue color'],
  أخضر: ['green', 'green color'],
  أصفر: ['yellow', 'yellow color'],
  وردي: ['pink', 'pink color'],
  بنفسجي: ['purple', 'purple color'],
  ذهبي: ['gold', 'golden'],
  فضي: ['silver', 'silver color'],

  // الفصول
  الربيع: ['spring', 'spring flowers'],
  الصيف: ['summer', 'summer sun'],
  الخريف: ['autumn', 'fall leaves'],
  الشتاء: ['winter', 'winter snow'],

  // الشهور
  يناير: ['january', 'winter'],
  فبراير: ['february', 'valentine'],
  مارس: ['march', 'spring'],
  أبريل: ['april', 'spring flowers'],
  مايو: ['may', 'spring'],
  يونيو: ['june', 'summer'],
  يوليو: ['july', 'summer'],
  أغسطس: ['august', 'summer'],
  سبتمبر: ['september', 'autumn'],
  أكتوبر: ['october', 'autumn'],
  نوفمبر: ['november', 'autumn'],
  ديسمبر: ['december', 'winter holiday'],

  // أحجار الميلاد
  العقيق: ['garnet gemstone', 'red garnet'],
  الجمشت: ['amethyst', 'purple amethyst'],
  الزبرجد: ['aquamarine', 'blue aquamarine'],
  الماس: ['diamond', 'brilliant diamond'],
  الزمرد: ['emerald', 'green emerald'],
  اللؤلؤ: ['pearl', 'white pearl'],
  الياقوت: ['ruby', 'red ruby'],

  // زهور
  ورد: ['roses', 'red roses'],
  زهور: ['flowers', 'beautiful flowers'],
  القرنفل: ['carnation', 'pink carnation'],
  البنفسج: ['violet', 'purple violet'],
  النرجس: ['daffodil', 'yellow daffodil'],

  // كلمات عامة
  سعيد: ['happy', 'joyful'],
  جميل: ['beautiful', 'lovely'],
  رائع: ['wonderful', 'amazing'],
  مميز: ['special', 'unique'],
};

// استخراج الكلمات المفتاحية من الموضوع العربي
function extractKeywordsFromTopic(topic: string): string[] {
  const keywords: string[] = [];
  let remainingTopic = topic;

  // ترتيب المفاتيح حسب الطول (الأطول أولاً)
  const sortedKeys = Object.keys(arabicToEnglishKeywords).sort(
    (a, b) => b.length - a.length
  );

  for (const arabicTerm of sortedKeys) {
    if (remainingTopic.includes(arabicTerm)) {
      const englishTerms = arabicToEnglishKeywords[arabicTerm];
      // إضافة أول ترجمة (الأكثر دقة)
      keywords.push(englishTerms[0]);
      // إزالة المصطلح من النص المتبقي لتجنب التكرار
      remainingTopic = remainingTopic.replace(arabicTerm, ' ');
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

// تحويل الموضوع العربي لكلمات إنجليزية للبحث (محسّن)
export function topicToEnglishKeywords(topic: string): string {
  // استخراج الكلمات المفتاحية من الموضوع
  const extractedKeywords = extractKeywordsFromTopic(topic);

  // تحديد سياق الموضوع
  const context = detectTopicContext(topic);

  // الحصول على كلمات سياقية إضافية
  const contextualKeywords = getContextualKeywords(context);

  // دمج الكلمات المستخرجة مع الكلمات السياقية
  let allKeywords = [...extractedKeywords];

  // إذا لم نجد كلمات كافية، أضف الكلمات السياقية
  if (allKeywords.length < 2) {
    allKeywords = [...allKeywords, ...contextualKeywords.slice(0, 2)];
  }

  // إزالة التكرارات
  const uniqueKeywords = [...new Set(allKeywords)];

  // إرجاع أول 3-4 كلمات للحصول على نتائج دقيقة
  const result = uniqueKeywords.slice(0, 4).join(' ');

  console.log(
    `🔍 [Pexels] تحويل الموضوع: "${topic}" → "${result}" (سياق: ${context})`
  );

  return result || 'birthday celebration happy';
}

// البحث عن صور من Pexels (محسّن)
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

    console.log(`🔍 [Pexels] البحث عن: "${englishQuery}" (${count} صور)`);

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        englishQuery
      )}&per_page=${count}&page=${page}&orientation=landscape`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Pexels API error: ${response.status} - ${errorText}`);
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data: PexelsSearchResult = await response.json();

    console.log(
      `✅ [Pexels] تم العثور على ${data.total_results} صورة، تم إرجاع ${
        data.photos?.length || 0
      }`
    );

    // إذا لم نجد صور كافية، جرب بحث أبسط
    if (
      (!data.photos || data.photos.length < count) &&
      englishQuery.includes(' ')
    ) {
      console.log('🔄 [Pexels] محاولة بحث بكلمات أقل...');
      const simpleQuery = englishQuery.split(' ').slice(0, 2).join(' ');

      const fallbackResponse = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          simpleQuery
        )}&per_page=${count}&page=${page}&orientation=landscape`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );

      if (fallbackResponse.ok) {
        const fallbackData: PexelsSearchResult = await fallbackResponse.json();
        if (
          fallbackData.photos &&
          fallbackData.photos.length > (data.photos?.length || 0)
        ) {
          console.log(
            `✅ [Pexels] البحث البسيط أرجع ${fallbackData.photos.length} صورة`
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

// حقن الصور في محتوى HTML (محسّن)
export async function injectImagesIntoContent(
  html: string,
  topic: string,
  imageCount: number = 3
): Promise<string> {
  console.log(`🖼️ [Pexels] بدء حقن ${imageCount} صور للموضوع: "${topic}"`);

  const images = await searchImages(topic, imageCount + 2);

  if (images.length === 0) {
    console.warn('⚠️ [Pexels] لم يتم العثور على صور');
    return html;
  }

  console.log(`✅ [Pexels] تم العثور على ${images.length} صور`);

  let result = html;

  // استخراج عناوين H2 من المحتوى
  const h2Matches = html.match(/<h2[^>]*>(.*?)<\/h2>/g) || [];
  const h2Texts = h2Matches.map((h) => h.replace(/<[^>]*>/g, '').trim());

  console.log(`📝 [Pexels] تم العثور على ${h2Matches.length} عنوان H2`);

  // إضافة صورة بعد كل H2 (حتى عدد الصور المطلوب)
  let imageIndex = 0;

  for (
    let i = 0;
    i < h2Matches.length &&
    imageIndex < images.length &&
    imageIndex < imageCount;
    i++
  ) {
    const h2 = h2Matches[i];
    const image = images[imageIndex];
    const caption = h2Texts[i] || topic;

    // استخدام alt text أفضل من Pexels أو العنوان
    const altText = image.alt || caption;

    const figureHtml = `
      <figure class="my-6 rounded-xl overflow-hidden shadow-lg">
        <img 
          src="${image.src.large}" 
          alt="${altText}"
          class="w-full h-auto rounded-xl"
          loading="lazy"
          width="1200"
          height="800"
        />
        <figcaption class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 px-4 pb-2">
          ${caption} - تصوير: <a href="${image.photographer_url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">${image.photographer}</a> (Pexels)
        </figcaption>
      </figure>
    `;

    // إضافة الصورة بعد H2
    result = result.replace(h2, h2 + figureHtml);
    imageIndex++;
    console.log(
      `✅ [Pexels] تم إضافة صورة ${imageIndex} بعد: "${caption.substring(
        0,
        30
      )}..."`
    );
  }

  // إضافة صورة رئيسية في البداية إذا لم تكن موجودة
  if (images.length > imageIndex && !result.includes('<figure')) {
    const mainImage = images[imageIndex];
    const mainAltText = mainImage.alt || topic;

    const mainFigure = `
      <figure class="my-6 rounded-xl overflow-hidden shadow-lg">
        <img 
          src="${mainImage.src.large2x}" 
          alt="${mainAltText}"
          class="w-full h-auto rounded-xl"
          loading="eager"
          width="1600"
          height="1067"
        />
        <figcaption class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 px-4 pb-2">
          ${topic} - تصوير: <a href="${mainImage.photographer_url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">${mainImage.photographer}</a> (Pexels)
        </figcaption>
      </figure>
    `;

    // إضافة بعد أول فقرة
    const firstParagraphEnd = result.indexOf('</p>');
    if (firstParagraphEnd > -1) {
      result =
        result.slice(0, firstParagraphEnd + 4) +
        mainFigure +
        result.slice(firstParagraphEnd + 4);
      console.log('✅ [Pexels] تم إضافة صورة رئيسية في البداية');
    }
  }

  console.log(`🎉 [Pexels] اكتمل حقن الصور - تم إضافة ${imageIndex} صور`);
  return result;
}

// الحصول على صورة غلاف للمقال (محسّن)
export async function getArticleCoverImage(
  topic: string
): Promise<string | null> {
  console.log(`🖼️ [Pexels] البحث عن صورة غلاف للموضوع: "${topic}"`);

  const image = await getRandomImage(topic);

  if (image) {
    console.log(
      `✅ [Pexels] تم العثور على صورة غلاف: ${image.src.large2x.substring(
        0,
        50
      )}...`
    );
    return image.src.large2x;
  }

  console.warn('⚠️ [Pexels] لم يتم العثور على صورة غلاف');
  return null;
}

export default {
  searchImages,
  getRandomImage,
  injectImagesIntoContent,
  getArticleCoverImage,
  topicToEnglishKeywords,
};
