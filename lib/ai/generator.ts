/**
 * AI Generator الرئيسي مع Fallback
 * يدير جميع مزودي الذكاء الاصطناعي مع سلسلة احتياطية
 * Version: 3.0 - Updated to use SONA v4
 */

import * as gemini from './providers/gemini';
import * as groq from './providers/groq';
import * as cohere from './providers/cohere';
import * as huggingface from './providers/huggingface';
import * as local from './providers/local';
// SONA v4 - النظام الجديد المحسّن
import { contentGenerator as sonaV4 } from '../sona';
// SONA 4.01 - النظام المحسّن المتقدم
import { generateEnhancedArticle } from '../sona';
// SONA v5 - النظام المتقدم الجديد
import { generateWithSonaV5 } from '../sona/v5';
import type { SonaV5Request } from '../sona/v5';
// SONA v6 - Smart Orchestrator
import sonaV6 from '../sona/v6';
import type {
  GenerationRequest as SonaRequest,
  ArticleLength,
  ContentTone,
} from '../sona/types';
import type { EnhancedGenerationRequest } from '../sona/enhancedGenerator';
import {
  injectImagesIntoContent,
  getArticleCoverImage,
} from '../images/pexels';

export type AIProvider =
  | 'gemini'
  | 'groq'
  | 'openai'
  | 'claude'
  | 'cohere'
  | 'huggingface'
  | 'local'
  | 'sona'
  | 'sona-enhanced'
  | 'sona-v5'
  | 'sona-v6';
export type ContentLength = 'short' | 'medium' | 'long' | 'comprehensive';
export type ContentStyle =
  | 'formal'
  | 'casual'
  | 'seo'
  | 'simplified'
  | 'academic';

export interface GenerationRequest {
  topic: string;
  length: ContentLength;
  provider: AIProvider;
  style?: ContentStyle;
  includeKeywords?: string[];
  category?: string;
  variables?: Record<string, any>;
  includeImages?: boolean;
  imageCount?: number;
  forceSingleProvider?: boolean; // إجبار استخدام المزود المختار فقط بدون fallback
}

export interface GenerationResponse {
  content: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  wordCount: number;
  provider: string;
  generationTime: number;
  coverImage?: string;
}

export interface RewriteRequest {
  content: string;
  provider: AIProvider;
  style: ContentStyle;
}

export interface RewriteResponse {
  original: string;
  rewritten: string;
  wordCount: number;
  provider: string;
}

// سلسلة الـ Fallback
const FALLBACK_CHAIN: AIProvider[] = [
  'groq', // Groq أولاً لأنه الأسرع
  'gemini',
  'cohere',
  'huggingface',
  'local',
];

// معلومات المزودين
export const PROVIDERS_INFO: Record<
  AIProvider,
  {
    name: string;
    nameAr: string;
    isFree: boolean;
    maxTokens: number;
    supportsArabic: boolean;
    available: boolean;
  }
> = {
  gemini: {
    name: 'Gemini',
    nameAr: 'جيميني',
    isFree: true,
    maxTokens: 8192,
    supportsArabic: true,
    available: true,
  },
  groq: {
    name: 'Groq',
    nameAr: 'جروك',
    isFree: true,
    maxTokens: 8000,
    supportsArabic: true,
    available: true,
  },
  openai: {
    name: 'OpenAI GPT',
    nameAr: 'أوبن إيه آي',
    isFree: false,
    maxTokens: 4096,
    supportsArabic: true,
    available: false,
  },
  claude: {
    name: 'Claude',
    nameAr: 'كلود',
    isFree: false,
    maxTokens: 4096,
    supportsArabic: true,
    available: false,
  },
  cohere: {
    name: 'Cohere',
    nameAr: 'كوهير',
    isFree: true,
    maxTokens: 4096,
    supportsArabic: true,
    available: true,
  },
  huggingface: {
    name: 'HuggingFace',
    nameAr: 'هاجينج فيس',
    isFree: true,
    maxTokens: 2048,
    supportsArabic: true,
    available: true,
  },
  local: {
    name: 'Local AI',
    nameAr: 'المولد المحلي',
    isFree: true,
    maxTokens: 10000,
    supportsArabic: true,
    available: true,
  },
  sona: {
    name: 'SONA',
    nameAr: 'سونا - الذكاء المحلي المتقدم',
    isFree: true,
    maxTokens: 15000,
    supportsArabic: true,
    available: true,
  },
  'sona-enhanced': {
    name: 'SONA 4.01',
    nameAr: 'سونا 4.01 - المحسّن',
    isFree: true,
    maxTokens: 20000,
    supportsArabic: true,
    available: true,
  },
  'sona-v5': {
    name: 'SONA 5.0',
    nameAr: 'سونا 5.0 - المتقدم',
    isFree: true,
    maxTokens: 25000,
    supportsArabic: true,
    available: true,
  },
  'sona-v6': {
    name: 'SONA 6.0',
    nameAr: 'سونا 6.0 - المنسق الذكي',
    isFree: true,
    maxTokens: 30000,
    supportsArabic: true,
    available: true,
  },
};

// توليد مقال مع Fallback
export async function generateArticle(
  request: GenerationRequest
): Promise<GenerationResponse> {
  console.log('🚀 [AI Generator] بدء عملية التوليد...');
  console.log('📝 [AI Generator] الموضوع:', request.topic);
  console.log('🎯 [AI Generator] المزود المطلوب:', request.provider);

  // بناء قائمة المزودين: المزود المطلوب أولاً، ثم الباقي
  let providers: AIProvider[];

  // المزودين المحليين لا يحتاجون fallback
  const localProviders: AIProvider[] = [
    'local',
    'sona',
    'sona-enhanced',
    'sona-v5',
    'sona-v6',
  ];

  // إذا تم طلب إجبار استخدام المزود المختار فقط
  if (request.forceSingleProvider) {
    providers = [request.provider];
    console.log(
      `🔧 [DEBUG] إجبار استخدام ${request.provider} فقط - بدون fallback`
    );
  } else if (localProviders.includes(request.provider)) {
    providers = [request.provider];
    console.log(`🔧 [DEBUG] مزود محلي - بدون fallback`);
  } else if (request.provider === 'gemini') {
    // Gemini: جرب Gemini فقط بدون fallback (تم تعديله)
    providers = ['gemini'];
    console.log('🔧 [DEBUG] Gemini فقط - بدون fallback');
  } else if (request.provider === 'groq') {
    // Groq: جرب Groq فقط بدون fallback
    providers = ['groq'];
    console.log('🔧 [DEBUG] إجبار استخدام Groq فقط');
  } else {
    // باقي المزودين: المزود المطلوب فقط (تم تعديله - بدون fallback)
    providers = [request.provider];
    console.log(`🔧 [DEBUG] استخدام ${request.provider} فقط`);
  }

  console.log(`📋 [DEBUG] قائمة المزودين النهائية: [${providers.join(' → ')}]`);

  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      console.log(
        `\n🤖 محاولة ${providers.indexOf(provider) + 1}/${
          providers.length
        }: استخدام ${provider}`
      );

      switch (provider) {
        case 'gemini':
          console.log('📞 استدعاء Gemini...');
          return await gemini.generateArticle({
            topic: request.topic,
            length: request.length,
            style: request.style as
              | 'formal'
              | 'casual'
              | 'seo'
              | 'academic'
              | undefined,
            includeKeywords: request.includeKeywords,
            category: request.category,
          });

        case 'groq':
          console.log('📞 استدعاء Groq...');
          const groqResult = await groq.generateArticle({
            topic: request.topic,
            length: request.length,
            style: request.style as
              | 'formal'
              | 'casual'
              | 'seo'
              | 'academic'
              | undefined,
            includeKeywords: request.includeKeywords,
            category: request.category,
          });
          console.log('✅ Groq أرجع نتيجة:', groqResult.provider);
          return groqResult;

        case 'cohere':
          return await cohere.generateArticle({
            topic: request.topic,
            length: request.length,
            style: request.style as
              | 'formal'
              | 'casual'
              | 'seo'
              | 'academic'
              | undefined,
            includeKeywords: request.includeKeywords,
            category: request.category,
          });

        case 'huggingface':
          return await huggingface.generateArticle({
            topic: request.topic,
            length: request.length,
            style: request.style as
              | 'formal'
              | 'casual'
              | 'seo'
              | 'academic'
              | undefined,
            includeKeywords: request.includeKeywords,
            category: request.category,
          });

        case 'local':
          return await local.generateArticle({
            topic: request.topic,
            length: request.length,
            variables: request.variables,
            category: request.category,
          });

        case 'sona':
          console.log('🌟 استدعاء SONA v4 المحسّن...');
          // تحويل الطلب لصيغة SONA v4
          const sonaRequest: SonaRequest = {
            topic: request.topic,
            length: request.length as ArticleLength,
            style: (request.style || 'formal') as ContentTone,
            includeKeywords: request.includeKeywords,
            category: request.category as any,
          };

          const sonaV4Result = await sonaV4.generate(sonaRequest);
          console.log(
            '✅ SONA v4 أرجع نتيجة - جودة:',
            sonaV4Result.qualityReport.overallScore + '%'
          );

          // تحويل النتيجة لصيغة GenerationResponse
          return {
            content: sonaV4Result.content,
            title: sonaV4Result.title,
            metaTitle: sonaV4Result.metaTitle,
            metaDescription: sonaV4Result.metaDescription,
            keywords: sonaV4Result.keywords,
            wordCount: sonaV4Result.wordCount,
            provider: 'sona-v4',
            generationTime: sonaV4Result.generationTime,
          };

        case 'sona-enhanced':
          console.log('🚀 استدعاء SONA 4.01 المحسّن المتقدم...');
          // تحويل الطلب لصيغة SONA Enhanced
          const enhancedRequest: EnhancedGenerationRequest = {
            topic: request.topic,
            length: request.length as ArticleLength,
            style: (request.style || 'formal') as
              | 'formal'
              | 'casual'
              | 'seo'
              | 'academic',
            includeKeywords: request.includeKeywords,
            category: request.category as any,
            maxRetries: 3,
            minQualityScore: 70,
          };

          const enhancedResult = await generateEnhancedArticle(enhancedRequest);
          console.log(
            '✅ SONA 4.01 أرجع نتيجة - جودة:',
            enhancedResult.qualityReport.score + '%'
          );

          // تحويل النتيجة لصيغة GenerationResponse
          return {
            content: enhancedResult.content,
            title: enhancedResult.title,
            metaTitle: enhancedResult.metaTitle,
            metaDescription: enhancedResult.metaDescription,
            keywords: enhancedResult.keywords,
            wordCount: enhancedResult.wordCount,
            provider: 'sona-4.01',
            generationTime: enhancedResult.generationTime,
          };

        case 'sona-v5':
          console.log('🚀 استدعاء SONA 5.0 المتقدم...');
          // تحويل الطلب لصيغة SONA v5
          const v5Request: SonaV5Request = {
            topic: request.topic,
            length: request.length as
              | 'short'
              | 'medium'
              | 'long'
              | 'comprehensive',
            style: (request.style || 'formal') as
              | 'formal'
              | 'casual'
              | 'seo'
              | 'academic',
            includeKeywords: request.includeKeywords,
            category: request.category as any,
            maxRetries: 3,
            minQualityScore: 75,
          };

          const v5Result = await generateWithSonaV5(v5Request);
          console.log(
            '✅ SONA 5.0 أرجع نتيجة - جودة:',
            v5Result.qualityScore + '%'
          );

          // تحويل النتيجة لصيغة GenerationResponse
          return {
            content: v5Result.content,
            title: v5Result.title,
            metaTitle: v5Result.metaTitle,
            metaDescription: v5Result.metaDescription,
            keywords: v5Result.keywords,
            wordCount: v5Result.wordCount,
            provider: 'sona-v5',
            generationTime: v5Result.generationTime,
          };

        case 'sona-v6':
          console.log('🚀 استدعاء SONA 6.0 المنسق الذكي...');
          // تحويل الطلب لصيغة SONA v6
          const v6Result = await sonaV6.generate({
            topic: request.topic,
            length: request.length as
              | 'short'
              | 'medium'
              | 'long'
              | 'comprehensive',
            category: request.category as any,
            includeKeywords: request.includeKeywords,
          });
          console.log(
            '✅ SONA 6.0 أرجع نتيجة - جودة:',
            v6Result.qualityScore + '%'
          );

          // حساب عدد الكلمات
          const v6WordCount = v6Result.content
            .split(/\s+/)
            .filter((w) => w.length > 0).length;

          // تحويل النتيجة لصيغة GenerationResponse
          return {
            content: v6Result.content,
            title: v6Result.title,
            metaTitle: v6Result.title.substring(0, 60),
            metaDescription: v6Result.metaDescription,
            keywords: v6Result.keywords,
            wordCount: v6WordCount,
            provider: `sona-v6 (${v6Result.provider})`,
            generationTime: v6Result.latency,
          };

        default:
          // المزودين غير المتاحين حالياً
          throw new Error(`المزود ${provider} غير متاح حالياً`);
      }
    } catch (error) {
      console.error(`❌ فشل التوليد باستخدام ${provider}:`, error);
      lastError = error as Error;
      continue;
    }
  }

  throw lastError || new Error('فشل التوليد مع جميع المزودين');
}

// توليد مقال مع صور
export async function generateArticleWithImages(
  request: GenerationRequest
): Promise<GenerationResponse> {
  // توليد المقال أولاً
  const article = await generateArticle(request);

  // إضافة الصور إذا طُلب ذلك
  if (request.includeImages !== false) {
    try {
      const imageCount = request.imageCount || 3;

      // حقن الصور في المحتوى
      article.content = await injectImagesIntoContent(
        article.content,
        request.topic,
        imageCount
      );

      // الحصول على صورة الغلاف
      article.coverImage =
        (await getArticleCoverImage(request.topic)) || undefined;
    } catch (error) {
      console.error('فشل في إضافة الصور:', error);
      // نستمر بدون صور
    }
  }

  return article;
}

// إعادة صياغة مع Fallback
export async function rewriteContent(
  request: RewriteRequest
): Promise<RewriteResponse> {
  const providers =
    request.provider === 'local'
      ? ['local']
      : [
          request.provider,
          ...FALLBACK_CHAIN.filter((p) => p !== request.provider),
        ];

  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      console.log(`🔄 محاولة إعادة الصياغة باستخدام: ${provider}`);

      switch (provider) {
        case 'gemini':
          return await gemini.rewriteContent({
            content: request.content,
            style: request.style,
          });

        case 'groq':
          return await groq.rewriteContent(request.content, request.style);

        case 'cohere':
          return await cohere.rewriteContent(request.content, request.style);

        case 'huggingface':
          return await huggingface.rewriteContent(
            request.content,
            request.style
          );

        case 'local':
          return await local.rewriteContent(request.content, request.style);

        case 'sona':
        case 'sona-enhanced':
          console.log('🚀 إعادة الصياغة باستخدام SONA 4.01...');
          // استخدام المولد المحسّن لإعادة الصياغة
          const sonaEnhancedRequest: EnhancedGenerationRequest = {
            topic: `إعادة صياغة: ${request.content.substring(0, 100)}...`,
            length: 'medium',
            style: request.style as 'formal' | 'casual' | 'seo' | 'academic',
            maxRetries: 2,
            minQualityScore: 60,
          };

          try {
            const sonaResult = await generateEnhancedArticle(
              sonaEnhancedRequest
            );
            return {
              original: request.content,
              rewritten: sonaResult.content,
              wordCount: sonaResult.wordCount,
              provider: 'sona-4.01',
            };
          } catch (sonaError) {
            console.error(
              'SONA 4.01 rewrite failed, falling back to local:',
              sonaError
            );
            return await local.rewriteContent(request.content, request.style);
          }

        default:
          throw new Error(`المزود ${provider} غير متاح حالياً`);
      }
    } catch (error) {
      console.error(`❌ فشل إعادة الصياغة باستخدام ${provider}:`, error);
      lastError = error as Error;
      continue;
    }
  }

  throw lastError || new Error('فشل إعادة الصياغة مع جميع المزودين');
}

// توليد عناوين
export async function generateTitles(
  topic: string,
  count: number = 10,
  provider: AIProvider = 'gemini'
): Promise<string[]> {
  try {
    switch (provider) {
      case 'gemini':
        return await gemini.generateTitles(topic, count);
      case 'local':
        return await local.generateTitles(topic, count);
      default:
        return await local.generateTitles(topic, count);
    }
  } catch (error) {
    console.error('فشل توليد العناوين:', error);
    // Fallback للمولد المحلي
    return await local.generateTitles(topic, count);
  }
}

// توليد ميتا وكلمات مفتاحية
export async function generateMeta(
  content: string,
  provider: AIProvider = 'gemini'
): Promise<{
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}> {
  try {
    if (provider === 'gemini') {
      return await gemini.generateMeta(content);
    }
  } catch (error) {
    console.error('فشل توليد الميتا:', error);
  }

  // Fallback: استخراج بسيط
  const title =
    content.match(/<h1>(.*?)<\/h1>/)?.[1] || content.substring(0, 60);
  const firstParagraph =
    content.match(/<p>(.*?)<\/p>/)?.[1] || content.substring(0, 160);

  return {
    metaTitle: title.substring(0, 60),
    metaDescription: firstParagraph.replace(/<[^>]*>/g, '').substring(0, 160),
    keywords: content
      .split(/\s+/)
      .filter((w) => w.length > 4)
      .slice(0, 10),
  };
}

// التحقق من توفر المزود
export function isProviderAvailable(provider: AIProvider): boolean {
  return PROVIDERS_INFO[provider]?.available || false;
}

// الحصول على المزودين المتاحين
export function getAvailableProviders(): AIProvider[] {
  return (Object.keys(PROVIDERS_INFO) as AIProvider[]).filter(
    (p) => PROVIDERS_INFO[p].available
  );
}

export default {
  generateArticle,
  generateArticleWithImages,
  rewriteContent,
  generateTitles,
  generateMeta,
  isProviderAvailable,
  getAvailableProviders,
  PROVIDERS_INFO,
};
