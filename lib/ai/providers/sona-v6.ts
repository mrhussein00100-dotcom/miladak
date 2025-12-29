/**
 * SONA v6 Provider Adapter
 * محول لاستخدام SONA v6 مع نظام AI الحالي
 */

import sona from '@/lib/sona/v6';
import { TopicCategory, ArticleLength } from '@/lib/sona/v6/types';

export interface SonaV6GenerationRequest {
  topic: string;
  length: 'short' | 'medium' | 'long' | 'comprehensive';
  style?: 'formal' | 'casual' | 'seo' | 'academic';
  includeKeywords?: string[];
  category?: string;
}

export interface SonaV6GenerationResponse {
  content: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  wordCount: number;
  provider: 'sona-v6';
  generationTime: number;
  qualityScore: number;
  usedProvider: string;
  cached: boolean;
}

/**
 * تحويل الفئة من النظام القديم للجديد
 */
function mapCategory(category?: string): TopicCategory | undefined {
  if (!category) return undefined;

  const mapping: Record<string, TopicCategory> = {
    birthday: 'birthday',
    zodiac: 'zodiac',
    age_calculator: 'dates',
    date_converter: 'dates',
    health: 'health',
    pregnancy: 'pregnancy',
    names: 'general',
    celebrations: 'birthday',
    colors_numbers: 'general',
    historical: 'general',
    celebrities: 'general',
    general: 'general',
  };

  return mapping[category] || 'general';
}

/**
 * توليد مقال باستخدام SONA v6
 */
export async function generateArticle(
  request: SonaV6GenerationRequest
): Promise<SonaV6GenerationResponse> {
  const startTime = Date.now();

  console.log('🚀 SONA v6 Provider: بدء التوليد...');
  console.log('📝 الموضوع:', request.topic);
  console.log('📏 الطول:', request.length);

  try {
    const result = await sona.generate({
      topic: request.topic,
      length: request.length as ArticleLength,
      category: mapCategory(request.category),
      includeKeywords: request.includeKeywords,
    });

    const wordCount = result.content
      .replace(/<[^>]*>/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    console.log('✅ SONA v6 Provider: نجح التوليد!');
    console.log('📊 الجودة:', result.qualityScore, '%');
    console.log('🔧 المزود:', result.provider);
    console.log('💾 من Cache:', result.cached);

    return {
      content: result.content,
      title: result.title,
      metaTitle: result.title,
      metaDescription: result.metaDescription,
      keywords: result.keywords,
      wordCount,
      provider: 'sona-v6',
      generationTime: Date.now() - startTime,
      qualityScore: result.qualityScore,
      usedProvider: result.provider,
      cached: result.cached,
    };
  } catch (error: any) {
    console.error('❌ SONA v6 Provider: فشل التوليد:', error.message);
    throw error;
  }
}

/**
 * توليد محتوى عيد ميلاد
 */
export async function generateBirthdayContent(
  name: string,
  age: number,
  length: 'short' | 'medium' | 'long' = 'medium'
): Promise<SonaV6GenerationResponse> {
  return generateArticle({
    topic: `عيد ميلاد ${name} ${age} سنة`,
    length,
    category: 'birthday',
  });
}

/**
 * توليد محتوى برج
 */
export async function generateZodiacContent(
  sign: string,
  length: 'short' | 'medium' | 'long' = 'medium'
): Promise<SonaV6GenerationResponse> {
  return generateArticle({
    topic: `برج ${sign}`,
    length,
    category: 'zodiac',
  });
}

/**
 * توليد محتوى حمل
 */
export async function generatePregnancyContent(
  week: number,
  length: 'short' | 'medium' | 'long' = 'long'
): Promise<SonaV6GenerationResponse> {
  return generateArticle({
    topic: `الأسبوع ${week} من الحمل`,
    length,
    category: 'pregnancy',
  });
}

/**
 * توليد محتوى عمر
 */
export async function generateAgeContent(
  age: number,
  length: 'short' | 'medium' | 'long' = 'medium'
): Promise<SonaV6GenerationResponse> {
  return generateArticle({
    topic: `عمر ${age} سنة`,
    length,
    category: 'age_calculator',
  });
}

/**
 * الحصول على إحصائيات SONA v6
 */
export function getStats() {
  return sona.getStats();
}

export default {
  generateArticle,
  generateBirthdayContent,
  generateZodiacContent,
  generatePregnancyContent,
  generateAgeContent,
  getStats,
};
