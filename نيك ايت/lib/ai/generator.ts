/**
 * AI Generator الرئيسي مع Fallback
 * يدير جميع مزودي الذكاء الاصطناعي مع سلسلة احتياطية
 * Version: 2.0 - Updated with better logging
 */

import * as gemini from './providers/gemini';
import * as groq from './providers/groq';
import * as cohere from './providers/cohere';
import * as huggingface from './providers/huggingface';
import * as local from './providers/local';
import * as sona from './providers/sona';
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
  | 'sona';
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

  if (request.provider === 'local') {
    providers = ['local'];
  } else if (request.provider === 'groq') {
    // إجبار استخدام Groq فقط للاختبار
    providers = ['groq'];
    console.log('🔧 [DEBUG] إجبار استخدام Groq فقط');
  } else {
    providers = [request.provider];
    for (const p of FALLBACK_CHAIN) {
      if (p !== request.provider && !providers.includes(p)) {
        providers.push(p);
      }
    }
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
          console.log('🌟 استدعاء SONA...');
          const sonaResult = await sona.generateArticle({
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
            variables: request.variables,
          });
          console.log('✅ SONA أرجع نتيجة:', sonaResult.provider);
          return sonaResult;

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
