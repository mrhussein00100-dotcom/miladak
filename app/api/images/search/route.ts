import { NextRequest, NextResponse } from 'next/server';
import { topicToEnglishKeywords } from '@/lib/images/pexels';
import { searchUnsplashImages, convertUnsplashToUnified, UnifiedImage } from '@/lib/images/unsplash';
import { query } from '@/lib/db/database';

const comprehensiveDictionary: Record<string, string[]> = {
  'عيد ميلاد': ['birthday celebration', 'birthday party', 'happy birthday'],
  'عيد ميلاد سعيد': ['happy birthday celebration', 'birthday wishes'],
  كيكة: ['birthday cake', 'celebration cake', 'party cake'],
  شموع: ['birthday candles', 'cake candles'],
  بالونات: ['balloons party', 'colorful balloons'],
  هدايا: ['gifts presents', 'gift boxes', 'birthday gifts'],
  حفلة: ['party celebration', 'festive gathering'],
  احتفال: ['celebration festivity', 'party event'],
  'حاسبة العمر': ['age calculator', 'birthday calculator'],
  عمر: ['age birthday', 'years old', 'age milestone'],
  'برج الحمل': ['aries zodiac', 'aries constellation'],
  'برج الثور': ['taurus zodiac', 'taurus constellation'],
  'برج الجوزاء': ['gemini zodiac', 'gemini constellation'],
  'برج السرطان': ['cancer zodiac', 'cancer constellation'],
  'برج الأسد': ['leo zodiac', 'leo constellation'],
  'برج العذراء': ['virgo zodiac', 'virgo constellation'],
  'برج الميزان': ['libra zodiac', 'libra constellation'],
  'برج العقرب': ['scorpio zodiac', 'scorpio constellation'],
  'برج القوس': ['sagittarius zodiac', 'sagittarius constellation'],
  'برج الجدي': ['capricorn zodiac', 'capricorn constellation'],
  'برج الدلو': ['aquarius zodiac', 'aquarius constellation'],
  'برج الحوت': ['pisces zodiac', 'pisces constellation'],
  برج: ['zodiac sign', 'horoscope', 'astrology symbol'],
  أبراج: ['zodiac signs', 'horoscope wheel', 'astrology'],
  نجوم: ['stars night sky', 'starry sky'],
  'حجر الميلاد': ['birthstone gemstone', 'birth gem'],
  ورد: ['roses beautiful', 'red roses', 'rose flowers'],
  زهور: ['flowers beautiful', 'flower bouquet'],
  'عائلة سعيدة': ['happy family', 'family together'],
  أطفال: ['children happy', 'kids joyful'],
  طفل: ['child happy', 'kid smiling'],
  عائلة: ['family together', 'family gathering'],
  سعادة: ['happiness joy', 'happy moment'],
  فرح: ['joy celebration', 'joyful moment'],
  حب: ['love heart', 'romantic love'],
  نجاح: ['success achievement', 'successful moment'],
  تخرج: ['graduation celebration', 'graduation party'],
  زواج: ['wedding marriage', 'wedding party'],
  جميل: ['beautiful lovely', 'beautiful moment'],
  رائع: ['wonderful amazing', 'amazing moment'],
  ملون: ['colorful vibrant', 'multicolor rainbow'],
};

async function getKeywordsFromDatabase(): Promise<string[]> {
  try {
    const results = (await query(
      'SELECT keywords FROM page_keywords WHERE keywords IS NOT NULL AND keywords != ""'
    )) as Array<{ keywords: string }>;
    const allKeywords: string[] = [];
    for (const row of results) {
      if (row.keywords) {
        const keywords = row.keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0);
        allKeywords.push(...keywords);
      }
    }
    return [...new Set(allKeywords)];
  } catch (error) {
    return [];
  }
}

function translateFromDictionary(term: string): string[] {
  const results: string[] = [];
  const sortedKeys = Object.keys(comprehensiveDictionary).sort((a, b) => b.length - a.length);
  for (const arabic of sortedKeys) {
    if (term.includes(arabic)) {
      results.push(...comprehensiveDictionary[arabic]);
    }
  }
  return results;
}

async function generateDiverseSearchQueries(q: string): Promise<string[]> {
  const variations: string[] = [];
  const dictTranslations = translateFromDictionary(q);
  variations.push(...dictTranslations);
  const pexelsTranslation = topicToEnglishKeywords(q);
  if (pexelsTranslation && !variations.includes(pexelsTranslation)) {
    variations.push(pexelsTranslation);
  }
  const contextKeywords = getContextualKeywords(q);
  variations.push(...contextKeywords);
  const dbKeywords = await getKeywordsFromDatabase();
  for (const keyword of dbKeywords.slice(0, 20)) {
    const translations = translateFromDictionary(keyword);
    if (translations.length > 0) variations.push(translations[0]);
  }
  const unique = [...new Set(variations)].filter((v) => v.length > 0);
  return shuffleArray(unique);
}

function getContextualKeywords(q: string): string[] {
  const keywords: string[] = [];
  if (q.includes('عيد') || q.includes('ميلاد') || q.includes('حفل')) {
    keywords.push('birthday celebration party', 'birthday cake candles', 'party balloons colorful');
  }
  if (q.includes('برج') || q.includes('أبراج') || q.includes('فلك')) {
    keywords.push('zodiac astrology stars', 'horoscope constellation', 'starry night sky');
  }
  if (q.includes('عمر') || q.includes('سنة') || q.includes('حساب')) {
    keywords.push('birthday milestone celebration', 'age celebration happy');
  }
  if (q.includes('طفل') || q.includes('أطفال') || q.includes('عائلة')) {
    keywords.push('happy family together', 'children playing happy');
  }
  if (q.includes('ورد') || q.includes('زهور') || q.includes('حجر')) {
    keywords.push('beautiful flowers bouquet', 'gemstone jewelry beautiful');
  }
  return keywords;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function searchPexels(apiKey: string, q: string, count: number, page?: number): Promise<{ photos: any[]; total: number }> {
  const randomPage = page || Math.floor(Math.random() * 20) + 1;
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=${count}&page=${randomPage}&orientation=landscape`,
    { headers: { Authorization: apiKey } }
  );
  if (!response.ok) throw new Error(`Pexels API error: ${response.status}`);
  const data = await response.json();
  return { photos: data.photos || [], total: data.total_results || 0 };
}

async function getCuratedPhotos(apiKey: string, count: number): Promise<any[]> {
  const randomPage = Math.floor(Math.random() * 30) + 1;
  try {
    const response = await fetch(`https://api.pexels.com/v1/curated?per_page=${count}&page=${randomPage}`, { headers: { Authorization: apiKey } });
    if (response.ok) {
      const data = await response.json();
      return data.photos || [];
    }
  } catch (e) {}
  return [];
}
