/**
 * Pexels API للصور المجانية
 * https://www.pexels.com/api/
 *
 * Version 3.0 - نظام ذكي لاختيار الصور المناسبة للمقالات
 * - تحليل المحتوى لاختيار صور أكثر دقة
 * - حساب عدد الصور المناسب لحجم المقال
 * - إضافة الصورة البارزة تلقائياً
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
  }>;
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

// حساب عدد الصور المثالي بناءً على حجم المقال
function calculateOptimalImageCount(
  wordCount: number,
  headingsCount: number
): number {
  // قاعدة: صورة واحدة لكل 300-400 كلمة تقريباً
  // مع حد أدنى 2 وحد أقصى 8

  let baseCount = Math.floor(wordCount / 350);

  // تعديل بناءً على عدد العناوين (صورة لكل 2-3 عناوين)
  const headingBasedCount = Math.ceil(headingsCount / 2);

  // اختيار الأكبر بين الطريقتين
  let optimalCount = Math.max(baseCount, headingBasedCount);

  // تطبيق الحدود
  optimalCount = Math.max(2, Math.min(8, optimalCount));

  // جدول مرجعي لأحجام المقالات
  if (wordCount < 500) {
    return 2; // مقال قصير
  } else if (wordCount < 1000) {
    return 3; // مقال متوسط قصير
  } else if (wordCount < 1500) {
    return 4; // مقال متوسط
  } else if (wordCount < 2500) {
    return 5; // مقال طويل
  } else if (wordCount < 4000) {
    return 6; // مقال شامل
  } else {
    return 8; // مقال طويل جداً
  }
}

// توليد استعلامات بحث متنوعة للصور
function generateSearchQueries(
  title: string,
  subTopics: string[],
  context: string,
  imageCount: number
): string[] {
  const queries: string[] = [];

  // استعلام من العنوان الرئيسي
  const mainQuery = topicToEnglishKeywords(title);
  queries.push(mainQuery);

  // استعلامات من العناوين الفرعية
  for (let i = 0; i < Math.min(subTopics.length, imageCount - 1); i++) {
    const subQuery = topicToEnglishKeywords(subTopics[i]);
    if (subQuery !== mainQuery && !queries.includes(subQuery)) {
      queries.push(subQuery);
    }
  }

  // إضافة استعلامات سياقية إذا لم نصل للعدد المطلوب
  const contextualQueries = getContextualSearchQueries(context);
  for (const cq of contextualQueries) {
    if (queries.length >= imageCount) break;
    if (!queries.includes(cq)) {
      queries.push(cq);
    }
  }

  return queries.slice(0, imageCount);
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

// حقن الصور في محتوى HTML (محسّن - الإصدار 3.0)
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
    `🖼️ [Pexels v3] بدء حقن ${targetImageCount} صور للموضوع: "${topic}"`
  );
  console.log(`📋 [Pexels v3] استعلامات البحث:`, analysis.searchQueries);

  // جلب صور متنوعة باستخدام استعلامات مختلفة
  const allImages: PexelsImage[] = [];
  const usedImageIds = new Set<number>();

  for (const query of analysis.searchQueries) {
    if (allImages.length >= targetImageCount + 2) break;

    const images = await searchImages(query, 5);
    for (const img of images) {
      if (!usedImageIds.has(img.id)) {
        allImages.push(img);
        usedImageIds.add(img.id);
      }
    }
  }

  if (allImages.length === 0) {
    console.warn('⚠️ [Pexels v3] لم يتم العثور على صور');
    return html;
  }

  console.log(`✅ [Pexels v3] تم جمع ${allImages.length} صورة فريدة`);

  let result = html;

  // استخراج عناوين H2 من المحتوى
  const h2Matches = html.match(/<h2[^>]*>(.*?)<\/h2>/g) || [];
  const h2Texts = h2Matches.map((h) => h.replace(/<[^>]*>/g, '').trim());

  console.log(`📝 [Pexels v3] تم العثور على ${h2Matches.length} عنوان H2`);

  // توزيع الصور بشكل متساوي على المحتوى
  let imageIndex = 0;

  // إضافة صورة بعد كل H2 (حتى عدد الصور المطلوب)
  for (
    let i = 0;
    i < h2Matches.length &&
    imageIndex < allImages.length &&
    imageIndex < targetImageCount;
    i++
  ) {
    const h2 = h2Matches[i];
    const image = allImages[imageIndex];
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
      `✅ [Pexels v3] تم إضافة صورة ${imageIndex} بعد: "${caption.substring(
        0,
        30
      )}..."`
    );
  }

  // إذا بقيت صور وعناوين H2 أقل، أضف صور بين الفقرات
  if (imageIndex < targetImageCount && imageIndex < allImages.length) {
    const paragraphs = result.match(/<\/p>/g) || [];
    const paragraphInterval = Math.floor(
      paragraphs.length / (targetImageCount - imageIndex + 1)
    );

    let paragraphCount = 0;
    let insertedAfterParagraph = 0;

    // إضافة صور بعد كل N فقرات
    result = result.replace(/<\/p>/g, (match) => {
      paragraphCount++;
      if (
        paragraphCount % paragraphInterval === 0 &&
        imageIndex < allImages.length &&
        imageIndex < targetImageCount &&
        insertedAfterParagraph < targetImageCount - imageIndex
      ) {
        const image = allImages[imageIndex];
        const altText = image.alt || topic;

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
              ${topic} - تصوير: <a href="${image.photographer_url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">${image.photographer}</a> (Pexels)
            </figcaption>
          </figure>
        `;

        imageIndex++;
        insertedAfterParagraph++;
        console.log(
          `✅ [Pexels v3] تم إضافة صورة ${imageIndex} بعد فقرة ${paragraphCount}`
        );
        return match + figureHtml;
      }
      return match;
    });
  }

  console.log(`🎉 [Pexels v3] اكتمل حقن الصور - تم إضافة ${imageIndex} صور`);
  return result;
}

// الحصول على صورة غلاف للمقال (محسّن - الإصدار 3.0)
export async function getArticleCoverImage(
  topic: string,
  content?: string
): Promise<string | null> {
  console.log(`🖼️ [Pexels v3] البحث عن صورة غلاف للموضوع: "${topic}"`);

  // تحليل المحتوى إذا كان متاحاً
  let searchQuery: string;
  if (content) {
    const analysis = analyzeContentForImages(content, topic);
    searchQuery = analysis.featuredImageQuery;
  } else {
    const context = detectTopicContext(topic);
    searchQuery = generateFeaturedImageQuery(topic, context);
  }

  console.log(`🔍 [Pexels v3] استعلام الصورة البارزة: "${searchQuery}"`);

  // البحث عن صور عالية الجودة
  const images = await searchImages(searchQuery, 10);

  if (images.length === 0) {
    // محاولة بحث أبسط
    const simpleQuery = topicToEnglishKeywords(topic);
    const fallbackImages = await searchImages(simpleQuery, 10);

    if (fallbackImages.length > 0) {
      // اختيار أفضل صورة (الأولى عادة الأكثر صلة)
      const bestImage = fallbackImages[0];
      console.log(
        `✅ [Pexels v3] تم العثور على صورة غلاف (fallback): ${bestImage.src.large2x.substring(
          0,
          50
        )}...`
      );
      return bestImage.src.large2x;
    }

    console.warn('⚠️ [Pexels v3] لم يتم العثور على صورة غلاف');
    return null;
  }

  // اختيار أفضل صورة للغلاف
  const bestImage = selectBestFeaturedImage(images);
  console.log(
    `✅ [Pexels v3] تم اختيار صورة غلاف: ${bestImage.src.large2x.substring(
      0,
      50
    )}...`
  );

  return bestImage.src.large2x;
}

// اختيار أفضل صورة للغلاف
function selectBestFeaturedImage(images: PexelsImage[]): PexelsImage {
  // الأولوية للصور ذات alt text جيد
  const withAlt = images.filter((img) => img.alt && img.alt.length > 10);
  if (withAlt.length > 0) {
    return withAlt[0];
  }

  // إرجاع الصورة الأولى (الأكثر صلة حسب Pexels)
  return images[0];
}

// ===== الدالة الرئيسية الشاملة =====

// إضافة الصور للمقال بشكل ذكي (الصورة البارزة + صور المحتوى)
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

  console.log(`🚀 [Pexels v3] بدء إضافة الصور الذكية للمقال: "${title}"`);

  // تحليل المحتوى
  const analysis = analyzeContentForImages(content, title);
  const targetImageCount = maxImages || analysis.suggestedImageCount;

  console.log(`📊 [Pexels v3] تحليل المحتوى:`);
  console.log(`   - السياق: ${analysis.context}`);
  console.log(`   - عدد الصور المقترح: ${targetImageCount}`);
  console.log(`   - عدد العناوين الفرعية: ${analysis.subTopics.length}`);

  // الحصول على الصورة البارزة
  let featuredImage: string | null = null;
  if (includeFeaturedImage) {
    featuredImage = await getArticleCoverImage(title, content);
  }

  // حقن الصور في المحتوى
  const contentWithImages = await injectImagesIntoContent(
    content,
    title,
    targetImageCount
  );

  // حساب عدد الصور المضافة
  const figureCount = (contentWithImages.match(/<figure/g) || []).length;

  // استخراج تفاصيل الصور المضافة
  const imageDetails: ArticleWithImages['imageDetails'] = [];
  const figureMatches =
    contentWithImages.match(/<figure[^>]*>[\s\S]*?<\/figure>/g) || [];

  for (const figure of figureMatches) {
    const srcMatch = figure.match(/src="([^"]+)"/);
    const altMatch = figure.match(/alt="([^"]+)"/);
    const photographerMatch = figure.match(/تصوير:.*?<a[^>]*>([^<]+)<\/a>/);

    if (srcMatch) {
      imageDetails.push({
        url: srcMatch[1],
        alt: altMatch?.[1] || title,
        photographer: photographerMatch?.[1] || 'Unknown',
        position: 'content',
      });
    }
  }

  // إضافة الصورة البارزة للتفاصيل
  if (featuredImage) {
    imageDetails.unshift({
      url: featuredImage,
      alt: title,
      photographer: 'Pexels',
      position: 'featured',
    });
  }

  console.log(`🎉 [Pexels v3] اكتمل إضافة الصور:`);
  console.log(`   - الصورة البارزة: ${featuredImage ? '✅' : '❌'}`);
  console.log(`   - صور المحتوى: ${figureCount}`);

  return {
    content: contentWithImages,
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
};
