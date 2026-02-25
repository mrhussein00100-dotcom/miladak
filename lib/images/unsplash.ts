/**
 * Unsplash API للصور المجانية
 * https://unsplash.com/developers
 *
 * Version 1.0 - مزود صور إضافي بجانب Pexels لتنويع الصور
 */

import { topicToEnglishKeywords } from './pexels';
import { translateFromDictionary, shuffleArray } from './dictionary';

export interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    name: string;
    username: string;
    links: {
      html: string;
    };
  };
  links: {
    html: string;
    download: string;
  };
  width: number;
  height: number;
}

export interface UnsplashSearchResult {
  total: number;
  total_pages: number;
  results: UnsplashImage[];
}

// صورة موحدة للاستخدام مع كلا المزودين
export interface UnifiedImage {
  id: string;
  url: string;
  urlLarge: string;
  urlMedium: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
  provider: 'pexels' | 'unsplash';
  width: number;
  height: number;
}

// البحث عن صور من Unsplash
export async function searchUnsplashImages(
  query: string,
  count: number = 10,
  page: number = 1
): Promise<UnsplashImage[]> {
  const apiKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!apiKey) {
    console.warn('❌ Unsplash: مفتاح API غير موجود (UNSPLASH_ACCESS_KEY)');
    return [];
  }

  try {
    // تحويل الاستعلام للإنجليزية إذا كان عربياً
    const englishQuery = topicToEnglishKeywords(query);

    // إضافة عشوائية للصفحة للتنوع
    const timestamp = Date.now();
    const randomSeed = (timestamp % 1000) + Math.floor(Math.random() * 100);
    const randomPage = page === 1 ? (randomSeed % 20) + 1 : page;

    console.log(
      `🔍 [Unsplash] البحث عن: "${englishQuery.substring(
        0,
        50
      )}..." (${count} صور، صفحة ${randomPage})`
    );

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        englishQuery
      )}&per_page=${count}&page=${randomPage}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${apiKey}`,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Unsplash API error: ${response.status} - ${errorText}`);
      return [];
    }

    const data: UnsplashSearchResult = await response.json();

    console.log(
      `✅ [Unsplash] تم العثور على ${data.total} صورة، تم إرجاع ${
        data.results?.length || 0
      }`
    );

    return data.results || [];
  } catch (error) {
    console.error('❌ Unsplash search error:', error);
    return [];
  }
}

// الحصول على صورة عشوائية من Unsplash
export async function getRandomUnsplashImage(
  topic: string
): Promise<UnsplashImage | null> {
  const images = await searchUnsplashImages(topic, 15);
  if (images.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

// تحويل صورة Unsplash لصيغة موحدة
export function convertUnsplashToUnified(image: UnsplashImage): UnifiedImage {
  return {
    id: `unsplash_${image.id}`,
    url: image.urls.regular,
    urlLarge: image.urls.full,
    urlMedium: image.urls.regular,
    alt: image.alt_description || image.description || '',
    photographer: image.user.name,
    photographerUrl: image.user.links.html,
    provider: 'unsplash',
    width: image.width,
    height: image.height,
  };
}

// البحث المدمج من Unsplash مع ترجمة عربية
export async function searchUnsplashWithArabic(
  arabicQuery: string,
  count: number = 10
): Promise<UnifiedImage[]> {
  const results: UnifiedImage[] = [];
  const seenIds = new Set<string>();

  // توليد استعلامات متنوعة
  const translations = translateFromDictionary(arabicQuery);
  const mainQuery = topicToEnglishKeywords(arabicQuery);

  const queries = [mainQuery, ...translations.slice(0, 3)];
  const uniqueQueries = [...new Set(queries)].filter((q) => q.length > 0);

  // البحث باستخدام استعلامات متعددة
  for (const query of uniqueQueries.slice(0, 3)) {
    if (results.length >= count) break;

    const images = await searchUnsplashImages(query, Math.ceil(count / 2));

    for (const img of images) {
      if (!seenIds.has(img.id) && results.length < count) {
        seenIds.add(img.id);
        results.push(convertUnsplashToUnified(img));
      }
    }
  }

  return shuffleArray(results);
}

// الحصول على صورة غلاف من Unsplash
export async function getUnsplashCoverImage(
  topic: string
): Promise<string | null> {
  console.log(`🖼️ [Unsplash] البحث عن صورة غلاف للموضوع: "${topic}"`);

  // محاولة 1: البحث الأساسي
  let images = await searchUnsplashImages(topic, 20);
  if (images.length > 0) {
    const bestImage = selectBestUnsplashImage(images, topic);
    console.log(`✅ [Unsplash] تم العثور على صورة غلاف`);
    return bestImage.urls.regular;
  }

  // محاولة 2: بحث بكلمات أقل
  const simpleQuery = topicToEnglishKeywords(topic)
    .split(' ')
    .slice(0, 3)
    .join(' ');
  images = await searchUnsplashImages(simpleQuery, 20);
  if (images.length > 0) {
    const bestImage = selectBestUnsplashImage(images, topic);
    console.log(`✅ [Unsplash] تم العثور على صورة غلاف (بحث بسيط)`);
    return bestImage.urls.regular;
  }

  // محاولة 3: بحث عام
  const fallbackQueries = [
    'birthday celebration',
    'happy party',
    'celebration colorful',
    'festive decorations',
  ];

  for (const query of fallbackQueries) {
    images = await searchUnsplashImages(query, 15);
    if (images.length > 0) {
      const bestImage = selectBestUnsplashImage(images, topic);
      console.log(`✅ [Unsplash] تم العثور على صورة غلاف (fallback)`);
      return bestImage.urls.regular;
    }
  }

  console.warn('⚠️ [Unsplash] لم يتم العثور على صورة غلاف');
  return null;
}

// اختيار أفضل صورة من Unsplash
function selectBestUnsplashImage(
  images: UnsplashImage[],
  topic?: string
): UnsplashImage {
  const scoredImages = images.map((img) => {
    let score = 0;

    // نقاط للصور ذات وصف جيد
    if (img.alt_description && img.alt_description.length > 10) score += 10;
    if (img.description && img.description.length > 20) score += 5;

    // نقاط إضافية إذا كان الوصف يحتوي على كلمات من الموضوع
    if (topic && img.alt_description) {
      const topicWords = topic.toLowerCase().split(/\s+/);
      const altLower = img.alt_description.toLowerCase();
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
    ];
    if (img.alt_description) {
      const altLower = img.alt_description.toLowerCase();
      for (const keyword of positiveKeywords) {
        if (altLower.includes(keyword)) {
          score += 3;
        }
      }
    }

    // نقاط للصور بأبعاد جيدة (landscape)
    if (img.width > img.height) score += 5;

    return { image: img, score };
  });

  scoredImages.sort((a, b) => b.score - a.score);
  return scoredImages[0].image;
}

export default {
  searchUnsplashImages,
  getRandomUnsplashImage,
  convertUnsplashToUnified,
  searchUnsplashWithArabic,
  getUnsplashCoverImage,
};
