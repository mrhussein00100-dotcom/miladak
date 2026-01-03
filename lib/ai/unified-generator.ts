/**
 * المولد الموحد للمحتوى
 * يدمج المحرك المحلي المتطور مع Gemini و Groq كخيارات إضافية
 * Version 1.0
 */

import {
  generateFullArticle,
  generateIntro,
  generateSection,
  generateFAQ,
  generateConclusion,
  replaceVariables,
  TemplateContext,
  TemplateCategory,
} from './dynamic-templates';
import {
  validateQuality,
  expandContent,
  ensureCompleteness,
  trimContent,
  countWords,
  WORD_COUNT_LIMITS,
  SECTION_DISTRIBUTION,
  ArticleLength,
} from './quality-gate';
import {
  detectCategoryFromTopic,
  getImageSearchKeywords,
  translateTopic,
} from '../db/keywords-service';
import {
  markImageAsUsed,
  isImageUsedStrict,
  calculateImageHash,
  getAllUsedImageIds,
} from '../db/used-images';
import {
  markTemplateAsUsed,
  calculateTemplateHash,
} from '../db/used-templates';

// استيراد مزودي AI الخارجيين
import * as gemini from './providers/gemini';
import * as groq from './providers/groq';

export type AIProvider = 'local' | 'gemini' | 'groq' | 'auto';
export type ContentLength = 'short' | 'medium' | 'long' | 'comprehensive';
export type ContentStyle = 'formal' | 'casual' | 'seo';

export interface UnifiedGenerationRequest {
  topic: string;
  length: ContentLength;
  provider?: AIProvider;
  category?: TemplateCategory;
  style?: ContentStyle;
  includeKeywords?: string[];
  includeImages?: boolean;
  imageCount?: number;
  forceSingleProvider?: boolean;
}

export interface UnifiedGenerationResponse {
  content: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  wordCount: number;
  featuredImage?: string;
  inlineImages?: string[];
  provider: string;
  generationTime: number;
  qualityScore: number;
  qualityReport: {
    passed: boolean;
    score: number;
    wordCountStatus: string;
    suggestions: string[];
  };
}

/**
 * استخراج الكيانات من الموضوع
 */
function extractEntities(topic: string): {
  names: string[];
  ages: number[];
  zodiacSigns: string[];
} {
  const names: string[] = [];
  const ages: number[] = [];
  const zodiacSigns: string[] = [];

  // استخراج الأسماء (كلمات تبدأ بحرف كبير أو بعد "عيد ميلاد")
  const nameMatch = topic.match(/عيد ميلاد\s+(\S+)/);
  if (nameMatch) {
    names.push(nameMatch[1]);
  }

  // استخراج الأعمار
  const ageMatches = topic.match(/(\d+)\s*(سنة|عام|عاماً)/g);
  if (ageMatches) {
    for (const match of ageMatches) {
      const num = parseInt(match.match(/\d+/)?.[0] || '0');
      if (num > 0 && num < 150) {
        ages.push(num);
      }
    }
  }

  // استخراج الأبراج
  const zodiacList = [
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
  ];
  for (const sign of zodiacList) {
    if (topic.includes(sign)) {
      zodiacSigns.push(sign);
    }
  }

  return { names, ages, zodiacSigns };
}

/**
 * توليد عنوان SEO
 */
function generateSEOTitle(
  topic: string,
  category: TemplateCategory,
  entities: ReturnType<typeof extractEntities>
): string {
  const { names, ages, zodiacSigns } = entities;

  if (category === 'birthday') {
    if (names[0] && ages[0]) {
      return `عيد ميلاد سعيد ${names[0]} - ${ages[0]} عاماً من التميز والنجاح`;
    }
    if (names[0]) {
      return `عيد ميلاد سعيد ${names[0]} - أجمل التهاني والأمنيات`;
    }
    return `عيد ميلاد سعيد - أفكار وتهاني مميزة للاحتفال`;
  }

  if (category === 'zodiac' && zodiacSigns[0]) {
    return `برج ${zodiacSigns[0]}: صفاته وتوافقه ونصائح مهمة`;
  }

  if (category === 'health') {
    return `${topic} - دليل صحي شامل ونصائح مهمة`;
  }

  if (category === 'pregnancy') {
    return `${topic} - دليل الحمل الشامل`;
  }

  if (category === 'age') {
    return `${topic} - حاسبة العمر ومعلومات مفيدة`;
  }

  return `${topic} - دليل شامل ومفصل`;
}

/**
 * توليد وصف ميتا
 */
function generateMetaDescription(
  topic: string,
  category: TemplateCategory,
  entities: ReturnType<typeof extractEntities>
): string {
  const { names, ages, zodiacSigns } = entities;

  if (category === 'birthday') {
    if (names[0] && ages[0]) {
      return `عيد ميلاد سعيد ${names[0]}! اكتشف أجمل التهاني وأفكار الهدايا المناسبة لعمر ${ages[0]} سنة. نصائح للاحتفال وعبارات تهنئة مميزة.`;
    }
    return `أفكار رائعة للاحتفال بعيد الميلاد. تهاني مميزة، أفكار هدايا، ونصائح لحفلة لا تُنسى.`;
  }

  if (category === 'zodiac' && zodiacSigns[0]) {
    return `اكتشف كل ما تريد معرفته عن برج ${zodiacSigns[0]}. صفاته، توافقه مع الأبراج الأخرى، ونصائح مهمة لمواليد هذا البرج.`;
  }

  return `دليل شامل عن ${topic}. معلومات مفيدة ونصائح عملية على موقع ميلادك.`;
}

/**
 * استخراج الكلمات المفتاحية
 */
function extractKeywords(
  topic: string,
  category: TemplateCategory,
  entities: ReturnType<typeof extractEntities>
): string[] {
  const keywords = new Set<string>([topic]);

  // إضافة الكيانات
  entities.names.forEach((n) => keywords.add(n));
  entities.zodiacSigns.forEach((z) => keywords.add(z));

  // كلمات حسب الفئة
  const categoryKeywords: Record<TemplateCategory, string[]> = {
    birthday: ['عيد ميلاد', 'تهنئة', 'احتفال', 'هدايا', 'كيك', 'حفلة'],
    zodiac: ['أبراج', 'برج', 'فلك', 'توافق', 'صفات'],
    health: ['صحة', 'نصائح صحية', 'عافية', 'تغذية'],
    pregnancy: ['حمل', 'حامل', 'جنين', 'ولادة'],
    age: ['عمر', 'حساب العمر', 'سنة', 'ميلاد'],
    general: ['معلومات', 'دليل', 'نصائح'],
  };

  categoryKeywords[category].forEach((k) => keywords.add(k));

  return Array.from(keywords).slice(0, 15);
}

/**
 * التوليد باستخدام المحرك المحلي المتطور
 */
async function generateWithLocalEngine(
  request: UnifiedGenerationRequest
): Promise<UnifiedGenerationResponse> {
  const startTime = Date.now();

  // تحديد الفئة
  const category = request.category || detectCategoryFromTopic(request.topic);

  // استخراج الكيانات
  const entities = extractEntities(request.topic);

  // إعداد السياق
  const context: TemplateContext = {
    topic: request.topic,
    name: entities.names[0],
    age: entities.ages[0],
    zodiacSign: entities.zodiacSigns[0],
    category,
    date: new Date().toLocaleDateString('ar-SA'),
  };

  // تحديد توزيع الأقسام
  const distribution = SECTION_DISTRIBUTION[request.length];
  const limits = WORD_COUNT_LIMITS[request.length];

  // توليد المحتوى
  let content = await generateFullArticle(context, {
    introWords: distribution.intro.words,
    sectionsCount: distribution.sections.count,
    sectionWords: distribution.sections.wordsEach,
    faqCount: distribution.faq.count,
    conclusionWords: distribution.conclusion.words,
  });

  // التحقق من الجودة
  let qualityResult = validateQuality(content, {
    targetLength: request.length,
    requiredKeywords: request.includeKeywords,
  });

  // توسيع المحتوى إذا كان ناقصاً
  if (qualityResult.wordCountStatus === 'below') {
    content = expandContent(content, limits.min, request.topic, category);
    qualityResult = validateQuality(content, {
      targetLength: request.length,
      requiredKeywords: request.includeKeywords,
    });
  }

  // تقليص المحتوى إذا كان طويلاً جداً
  if (qualityResult.wordCountStatus === 'above') {
    content = trimContent(content, limits.max);
    qualityResult = validateQuality(content, {
      targetLength: request.length,
      requiredKeywords: request.includeKeywords,
    });
  }

  // التأكد من الاكتمال
  content = ensureCompleteness(content, request.length);

  // توليد العنوان والميتا
  const title = generateSEOTitle(request.topic, category, entities);
  const metaTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
  const metaDescription = generateMetaDescription(
    request.topic,
    category,
    entities
  );
  const keywords = extractKeywords(request.topic, category, entities);

  // حساب عدد الكلمات النهائي
  const wordCount = countWords(content);

  return {
    content,
    title,
    metaTitle,
    metaDescription,
    keywords,
    wordCount,
    provider: 'local-enhanced',
    generationTime: Date.now() - startTime,
    qualityScore: qualityResult.score,
    qualityReport: {
      passed: qualityResult.passed,
      score: qualityResult.score,
      wordCountStatus: qualityResult.wordCountStatus,
      suggestions: qualityResult.suggestions,
    },
  };
}

/**
 * التوليد باستخدام Gemini
 */
async function generateWithGemini(
  request: UnifiedGenerationRequest
): Promise<UnifiedGenerationResponse> {
  const startTime = Date.now();

  try {
    const result = await gemini.generateArticle({
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

    // التحقق من الجودة
    const qualityResult = validateQuality(result.content, {
      targetLength: request.length,
      requiredKeywords: request.includeKeywords,
    });

    return {
      ...result,
      provider: 'gemini',
      generationTime: Date.now() - startTime,
      qualityScore: qualityResult.score,
      qualityReport: {
        passed: qualityResult.passed,
        score: qualityResult.score,
        wordCountStatus: qualityResult.wordCountStatus,
        suggestions: qualityResult.suggestions,
      },
    };
  } catch (error) {
    console.error('❌ [Gemini] فشل التوليد:', error);
    throw error;
  }
}

/**
 * التوليد باستخدام Groq
 */
async function generateWithGroq(
  request: UnifiedGenerationRequest
): Promise<UnifiedGenerationResponse> {
  const startTime = Date.now();

  try {
    const result = await groq.generateArticle({
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

    // التحقق من الجودة
    const qualityResult = validateQuality(result.content, {
      targetLength: request.length,
      requiredKeywords: request.includeKeywords,
    });

    return {
      ...result,
      provider: 'groq',
      generationTime: Date.now() - startTime,
      qualityScore: qualityResult.score,
      qualityReport: {
        passed: qualityResult.passed,
        score: qualityResult.score,
        wordCountStatus: qualityResult.wordCountStatus,
        suggestions: qualityResult.suggestions,
      },
    };
  } catch (error) {
    console.error('❌ [Groq] فشل التوليد:', error);
    throw error;
  }
}

/**
 * المولد الموحد الرئيسي
 */
export async function generateArticle(
  request: UnifiedGenerationRequest
): Promise<UnifiedGenerationResponse> {
  console.log('🚀 [Unified Generator] بدء التوليد...');
  console.log(`📝 الموضوع: ${request.topic}`);
  console.log(`📏 الطول: ${request.length}`);
  console.log(`🎯 المزود: ${request.provider || 'auto'}`);

  const provider = request.provider || 'auto';

  // إذا كان المزود محدداً
  if (provider !== 'auto') {
    try {
      switch (provider) {
        case 'local':
          return await generateWithLocalEngine(request);
        case 'gemini':
          return await generateWithGemini(request);
        case 'groq':
          return await generateWithGroq(request);
        default:
          return await generateWithLocalEngine(request);
      }
    } catch (error) {
      console.error(`❌ فشل المزود ${provider}:`, error);

      // Fallback للمحرك المحلي إذا لم يكن مطلوباً إجبار المزود
      if (!request.forceSingleProvider && provider !== 'local') {
        console.log('🔄 التحويل للمحرك المحلي...');
        return await generateWithLocalEngine(request);
      }

      throw error;
    }
  }

  // الوضع التلقائي: المحرك المحلي أولاً (الأسرع والأكثر موثوقية)
  try {
    console.log('🤖 استخدام المحرك المحلي المتطور...');
    return await generateWithLocalEngine(request);
  } catch (error) {
    console.error('❌ فشل المحرك المحلي:', error);
    throw error;
  }
}

/**
 * توليد مقال مع صور
 */
export async function generateArticleWithImages(
  request: UnifiedGenerationRequest
): Promise<UnifiedGenerationResponse> {
  // توليد المقال أولاً
  const article = await generateArticle(request);

  // إضافة الصور إذا طُلب ذلك
  if (request.includeImages !== false) {
    try {
      console.log('🖼️ [Unified Generator] إضافة الصور...');

      // استيراد نظام الصور الذكي
      const { addSmartImagesToArticle } = await import('../images/pexels');

      const articleWithImages = await addSmartImagesToArticle(
        article.content,
        article.title,
        {
          maxImages: request.imageCount,
          includeFeaturedImage: true,
        }
      );

      // تحديث المحتوى بالصور
      article.content = articleWithImages.content;
      article.featuredImage = articleWithImages.featuredImage || undefined;
      article.inlineImages = articleWithImages.imageDetails
        .filter((img) => img.position === 'content')
        .map((img) => img.url);

      // تسجيل الصور المستخدمة
      for (const img of articleWithImages.imageDetails) {
        try {
          await markImageAsUsed({
            imageId: img.url.split('/').pop() || img.url,
            imageUrl: img.url,
            imageHash: calculateImageHash(img.url, img.photographer),
            photographer: img.photographer,
            provider: img.url.includes('unsplash') ? 'unsplash' : 'pexels',
            topic: request.topic,
          });
        } catch (e) {
          // تجاهل أخطاء التسجيل
        }
      }

      console.log(`✅ تم إضافة ${articleWithImages.imagesAdded} صور`);
    } catch (error) {
      console.error('❌ فشل في إضافة الصور:', error);
      // نستمر بدون صور
    }
  }

  return article;
}

/**
 * إعادة صياغة المحتوى
 */
export async function rewriteContent(
  content: string,
  style: ContentStyle = 'formal',
  provider: AIProvider = 'local'
): Promise<{
  original: string;
  rewritten: string;
  wordCount: number;
  provider: string;
}> {
  if (provider === 'gemini') {
    try {
      return await gemini.rewriteContent({ content, style });
    } catch (error) {
      console.error('❌ فشل Gemini في إعادة الصياغة:', error);
    }
  }

  if (provider === 'groq') {
    try {
      return await groq.rewriteContent(content, style);
    } catch (error) {
      console.error('❌ فشل Groq في إعادة الصياغة:', error);
    }
  }

  // إعادة صياغة محلية بسيطة
  const synonyms: Record<string, string[]> = {
    جميل: ['رائع', 'بديع', 'ساحر'],
    كبير: ['ضخم', 'هائل', 'عظيم'],
    صغير: ['ضئيل', 'قليل', 'محدود'],
    سعيد: ['مبتهج', 'فرح', 'مسرور'],
    مهم: ['ضروري', 'أساسي', 'جوهري'],
  };

  let rewritten = content;
  for (const [word, alternatives] of Object.entries(synonyms)) {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const replacement =
      alternatives[Math.floor(Math.random() * alternatives.length)];
    rewritten = rewritten.replace(regex, replacement);
  }

  return {
    original: content,
    rewritten,
    wordCount: countWords(rewritten),
    provider: 'local',
  };
}

/**
 * توليد عناوين
 */
export async function generateTitles(
  topic: string,
  count: number = 10,
  provider: AIProvider = 'local'
): Promise<string[]> {
  if (provider === 'gemini') {
    try {
      return await gemini.generateTitles(topic, count);
    } catch (error) {
      console.error('❌ فشل Gemini في توليد العناوين:', error);
    }
  }

  // عناوين محلية
  const templates = [
    `${topic} - دليلك الشامل`,
    `كل ما تريد معرفته عن ${topic}`,
    `${topic}: معلومات مهمة ونصائح قيمة`,
    `اكتشف أسرار ${topic}`,
    `${topic} - حقائق ومعلومات مذهلة`,
    `دليل ${topic} الكامل`,
    `${topic}: ما لا تعرفه`,
    `أهم المعلومات عن ${topic}`,
    `${topic} - نظرة شاملة`,
    `تعرف على ${topic} بالتفصيل`,
  ];

  return templates.slice(0, count);
}

/**
 * توليد ميتا
 */
export async function generateMeta(
  content: string,
  provider: AIProvider = 'local'
): Promise<{ metaTitle: string; metaDescription: string; keywords: string[] }> {
  if (provider === 'gemini') {
    try {
      return await gemini.generateMeta(content);
    } catch (error) {
      console.error('❌ فشل Gemini في توليد الميتا:', error);
    }
  }

  // استخراج بسيط
  const title =
    content.match(/<h1>(.*?)<\/h1>/)?.[1] ||
    content.match(/<h2>(.*?)<\/h2>/)?.[1] ||
    content.substring(0, 60);
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

export default {
  generateArticle,
  generateArticleWithImages,
  rewriteContent,
  generateTitles,
  generateMeta,
};
