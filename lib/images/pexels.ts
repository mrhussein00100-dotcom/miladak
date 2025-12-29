/**
 * Pexels API للصور المجانية
 * https://www.pexels.com/api/
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

// قاموس ترجمة الكلمات العربية للإنجليزية للبحث
const arabicToEnglishKeywords: Record<string, string> = {
  'عيد ميلاد': 'birthday celebration',
  ميلاد: 'birthday',
  احتفال: 'celebration party',
  تهنئة: 'congratulations',
  هدية: 'gift present',
  هدايا: 'gifts presents',
  كيك: 'birthday cake',
  كعكة: 'cake',
  شموع: 'candles',
  بالونات: 'balloons',
  حفلة: 'party',
  سعيد: 'happy',
  برج: 'zodiac',
  الحمل: 'aries zodiac',
  الثور: 'taurus zodiac',
  الجوزاء: 'gemini zodiac',
  السرطان: 'cancer zodiac',
  الأسد: 'leo zodiac',
  العذراء: 'virgo zodiac',
  الميزان: 'libra zodiac',
  العقرب: 'scorpio zodiac',
  القوس: 'sagittarius zodiac',
  الجدي: 'capricorn zodiac',
  الدلو: 'aquarius zodiac',
  الحوت: 'pisces zodiac',
  أبراج: 'zodiac signs',
  فلك: 'astrology',
  نجوم: 'stars',
  عمر: 'age',
  سنة: 'year',
  شهر: 'month',
  يوم: 'day',
  طفل: 'child baby',
  أطفال: 'children kids',
  عائلة: 'family',
  أصدقاء: 'friends',
  حب: 'love heart',
  سعادة: 'happiness joy',
  ذكرى: 'memory anniversary',
  مفاجأة: 'surprise',
  زينة: 'decoration',
  ورد: 'flowers roses',
  زهور: 'flowers',
};

// تحويل الموضوع العربي لكلمات إنجليزية للبحث
export function topicToEnglishKeywords(topic: string): string {
  let result = topic;

  for (const [ar, en] of Object.entries(arabicToEnglishKeywords)) {
    if (topic.includes(ar)) {
      result = result.replace(ar, en);
    }
  }

  // إذا لم يتم العثور على ترجمة، استخدم كلمات عامة
  if (result === topic) {
    return 'birthday celebration party happy';
  }

  return result.trim();
}

// البحث عن صور من Pexels
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

  try {
    // تحويل الاستعلام للإنجليزية إذا كان عربياً
    const englishQuery = topicToEnglishKeywords(query);

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        englishQuery
      )}&per_page=${count}&page=${page}`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data: PexelsSearchResult = await response.json();
    return data.photos || [];
  } catch (error) {
    console.error('Pexels search error:', error);
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

// حقن الصور في محتوى HTML
export async function injectImagesIntoContent(
  html: string,
  topic: string,
  imageCount: number = 3
): Promise<string> {
  const images = await searchImages(topic, imageCount + 2);

  if (images.length === 0) {
    return html;
  }

  let result = html;

  // استخراج عناوين H2 من المحتوى
  const h2Matches = html.match(/<h2[^>]*>(.*?)<\/h2>/g) || [];
  const h2Texts = h2Matches.map((h) => h.replace(/<[^>]*>/g, '').trim());

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

    const figureHtml = `
      <figure class="my-6 rounded-xl overflow-hidden">
        <img 
          src="${image.src.large}" 
          alt="${caption}"
          class="w-full h-auto rounded-xl"
          loading="lazy"
        />
        <figcaption class="text-center text-sm text-gray-500 mt-2">
          ${caption} - تصوير: <a href="${image.photographer_url}" target="_blank" rel="noopener">${image.photographer}</a>
        </figcaption>
      </figure>
    `;

    // إضافة الصورة بعد H2
    result = result.replace(h2, h2 + figureHtml);
    imageIndex++;
  }

  // إضافة صورة رئيسية في البداية إذا لم تكن موجودة
  if (images.length > imageIndex && !result.includes('<figure')) {
    const mainImage = images[imageIndex];
    const mainFigure = `
      <figure class="my-6 rounded-xl overflow-hidden">
        <img 
          src="${mainImage.src.large2x}" 
          alt="${topic}"
          class="w-full h-auto rounded-xl"
          loading="eager"
        />
        <figcaption class="text-center text-sm text-gray-500 mt-2">
          ${topic} - تصوير: <a href="${mainImage.photographer_url}" target="_blank" rel="noopener">${mainImage.photographer}</a>
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
    }
  }

  return result;
}

// الحصول على صورة غلاف للمقال
export async function getArticleCoverImage(
  topic: string
): Promise<string | null> {
  const image = await getRandomImage(topic);
  return image?.src.large2x || null;
}

export default {
  searchImages,
  getRandomImage,
  injectImagesIntoContent,
  getArticleCoverImage,
  topicToEnglishKeywords,
};
