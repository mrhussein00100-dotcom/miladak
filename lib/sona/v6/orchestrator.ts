/**
 * SONA v6 - AI Orchestrator
 * المنسق الرئيسي - يجمع بين AI Providers + Prompts + Enhancer + Analyzer
 */

import {
  GenerationRequest,
  OrchestratorResult,
  TopicCategory,
  AIProviderName,
  SONAError,
  DEFAULT_WORD_COUNT_TARGETS,
} from './types';
import providers from './providers';
import prompts from './prompts';
import analyzer from './analyzer';
import enhancer from './enhancer';
import cache from './cache';
import usage from './usage';

// إعدادات Orchestrator
const CONFIG = {
  minQualityScore: 70,
  maxEnhanceIterations: 3,
  enableCache: true,
  enableEnhancement: true,
};

/**
 * توليد محتوى كامل
 */
export async function generateContent(
  request: GenerationRequest
): Promise<OrchestratorResult> {
  const startTime = Date.now();
  console.log('🚀 SONA v6 Orchestrator: بدء التوليد...');
  console.log('📝 الموضوع:', request.topic);
  console.log('📏 الطول:', request.length);

  // 1. التحقق من Cache
  if (CONFIG.enableCache) {
    const cacheKey = cache.generateCacheKey(
      request.topic,
      request.category || 'general',
      request.length
    );
    const cached = cache.get(cacheKey);

    if (cached) {
      console.log('✅ SONA v6: تم العثور في Cache');
      cache.recordHit();
      usage.trackUsage(
        'gemini',
        0,
        0,
        request.topic,
        cached.metadata.category,
        true
      );

      return {
        content: cached.content,
        title: extractTitle(cached.content),
        metaDescription: cached.metadata.topic,
        keywords: [],
        provider: cached.metadata.provider,
        qualityScore: cached.metadata.qualityScore,
        cached: true,
        cost: 0,
        latency: Date.now() - startTime,
        enhancementIterations: 0,
      };
    }
    cache.recordMiss();
  }

  // 2. الحصول على Prompt المتخصص
  const promptResult = prompts.getPromptForTopic(
    request.topic,
    request.category,
    extractParams(request)
  );

  console.log('📋 SONA v6: الفئة المكتشفة:', promptResult.category);

  // 3. توليد المحتوى باستخدام AI
  let content: string;
  let provider: AIProviderName;
  let tokens = 0;
  let cost = 0;

  try {
    const response = await providers.generate(
      promptResult.userPrompt,
      promptResult.systemPrompt
    );

    content = response.content;
    provider = response.provider;
    tokens = response.tokens;
    cost = response.cost;

    console.log(`✅ SONA v6: تم التوليد بواسطة ${provider}`);
  } catch (error: any) {
    console.error('❌ SONA v6: فشل التوليد:', error.message);
    throw new SONAError(
      `فشل توليد المحتوى: ${error.message}`,
      'ALL_PROVIDERS_FAILED',
      undefined,
      false
    );
  }

  // 4. استخراج البيانات من JSON
  let parsedContent = parseAIResponse(content);
  let articleContent = parsedContent.content;
  let title = parsedContent.title || request.topic;
  let metaDescription = parsedContent.metaDescription || '';
  let keywords = parsedContent.keywords || [];

  // 5. تحليل الجودة
  let qualityReport = analyzer.analyze(articleContent, request.topic);
  console.log(`📊 SONA v6: الجودة الأولية: ${qualityReport.score}%`);

  // 6. تحسين المحتوى إذا لزم الأمر
  let enhancementIterations = 0;

  if (
    CONFIG.enableEnhancement &&
    qualityReport.score < CONFIG.minQualityScore
  ) {
    console.log('🔧 SONA v6: بدء التحسين...');

    const enhanceResult = await enhancer.enhance(
      articleContent,
      request.topic,
      {
        targetQuality: CONFIG.minQualityScore,
        maxIterations: CONFIG.maxEnhanceIterations,
        useAI: true,
        useLexicon: true,
      }
    );

    articleContent = enhanceResult.enhanced;
    enhancementIterations = enhanceResult.iterations;

    // إعادة التحليل
    qualityReport = analyzer.analyze(articleContent, request.topic);
    console.log(`📊 SONA v6: الجودة بعد التحسين: ${qualityReport.score}%`);
  }

  // 7. تتبع الاستخدام
  usage.trackUsage(
    provider,
    tokens,
    cost,
    request.topic,
    promptResult.category,
    false
  );

  // 8. حفظ في Cache
  if (CONFIG.enableCache && qualityReport.score >= CONFIG.minQualityScore) {
    const cacheKey = cache.generateCacheKey(
      request.topic,
      promptResult.category,
      request.length
    );
    cache.set(cacheKey, articleContent, {
      topic: request.topic,
      category: promptResult.category,
      provider,
      qualityScore: qualityReport.score,
      wordCount: countWords(articleContent),
    });
  }

  const latency = Date.now() - startTime;
  console.log(`✅ SONA v6: اكتمل التوليد في ${latency}ms`);

  return {
    content: articleContent,
    title,
    metaDescription,
    keywords,
    provider,
    qualityScore: qualityReport.score,
    cached: false,
    cost,
    latency,
    enhancementIterations,
  };
}

/**
 * تحليل استجابة AI واستخراج JSON
 */
function parseAIResponse(response: string): {
  content: string;
  title?: string;
  metaDescription?: string;
  keywords?: string[];
} {
  // تنظيف الاستجابة
  let cleaned = response
    .replace(/^```json\s*/gi, '')
    .replace(/^```\s*/gi, '')
    .replace(/```\s*$/gi, '')
    .trim();

  // محاولة استخراج JSON
  try {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      // تنظيف المحتوى من الكلمات الكودية
      let cleanedContent = cleanCodeWords(parsed.content || cleaned);
      // تطبيق تنسيق RTL
      cleanedContent = applyRTLFormatting(cleanedContent);
      return {
        content: cleanedContent,
        title: parsed.title,
        metaDescription: parsed.metaDescription || parsed.meta_description,
        keywords: parsed.keywords || [],
      };
    }
  } catch {
    // ليس JSON، استخدم كمحتوى مباشر
  }

  let content = cleanCodeWords(cleaned);
  content = applyRTLFormatting(content);
  return { content };
}

/**
 * تطبيق تنسيق RTL على المحتوى مع ضبط المحاذاة (justify)
 */
function applyRTLFormatting(content: string): string {
  if (!content) return content;

  let result = content;

  // تنسيق الفقرات - إضافة RTL classes مع text-justify لضبط المحاذاة
  result = result.replace(
    /<p(?![^>]*class=)>/gi,
    '<p class="text-justify leading-relaxed mb-4" dir="rtl" style="text-align-last: right;">'
  );
  result = result.replace(
    /<p class="([^"]*)"(?![^>]*dir=)>/gi,
    '<p class="$1 text-justify" dir="rtl" style="text-align-last: right;">'
  );

  // تنسيق العناوين h2 - تبقى text-right
  result = result.replace(
    /<h2(?![^>]*class=)>/gi,
    '<h2 class="text-2xl font-bold mt-8 mb-4 text-right" dir="rtl">'
  );
  result = result.replace(
    /<h2 class="([^"]*)"(?![^>]*dir=)>/gi,
    '<h2 class="$1 text-right" dir="rtl">'
  );

  // تنسيق العناوين h3 - تبقى text-right
  result = result.replace(
    /<h3(?![^>]*class=)>/gi,
    '<h3 class="text-xl font-semibold mt-6 mb-3 text-right" dir="rtl">'
  );
  result = result.replace(
    /<h3 class="([^"]*)"(?![^>]*dir=)>/gi,
    '<h3 class="$1 text-right" dir="rtl">'
  );

  // تنسيق القوائم ul - text-justify للنص
  result = result.replace(
    /<ul(?![^>]*class=)>/gi,
    '<ul class="list-disc list-inside space-y-2 my-4 text-right" dir="rtl">'
  );
  result = result.replace(
    /<ul class="([^"]*)"(?![^>]*dir=)>/gi,
    '<ul class="$1 text-right" dir="rtl">'
  );

  // تنسيق القوائم ol
  result = result.replace(
    /<ol(?![^>]*class=)>/gi,
    '<ol class="list-decimal list-inside space-y-2 my-4 text-right" dir="rtl">'
  );
  result = result.replace(
    /<ol class="([^"]*)"(?![^>]*dir=)>/gi,
    '<ol class="$1 text-right" dir="rtl">'
  );

  // تنسيق عناصر القوائم li - text-justify
  result = result.replace(
    /<li(?![^>]*class=)>/gi,
    '<li class="text-justify leading-relaxed" style="text-align-last: right;">'
  );

  // تنسيق blockquote - text-justify
  result = result.replace(
    /<blockquote(?![^>]*class=)>/gi,
    '<blockquote class="text-justify border-r-4 border-primary pr-4 my-4" dir="rtl" style="text-align-last: right;">'
  );

  // إضافة dir="rtl" للعناصر التي لا تحتويه
  result = result.replace(
    /<(p|h1|h2|h3|h4|ul|ol|blockquote)([^>]*)(?<!dir="rtl")>/gi,
    (match, tag, attrs) => {
      if (attrs.includes('dir=')) return match;
      return `<${tag}${attrs} dir="rtl">`;
    }
  );

  return result;
}

/**
 * تنظيف المحتوى من الكلمات الكودية والبرمجية
 */
function cleanCodeWords(content: string): string {
  if (!content) return content;

  // قائمة الكلمات الكودية التي يجب إزالتها أو استبدالها
  const codeWordsToRemove = [
    // كلمات JSON/HTML
    /\bJSON\b/gi,
    /\bHTML\b/gi,
    /\bCSS\b/gi,
    /\bJavaScript\b/gi,
    /\bcode\b/gi,
    /\bscript\b/gi,
    /\bfunction\b/gi,
    /\bvariable\b/gi,
    /\barray\b/gi,
    /\bobject\b/gi,
    /\bstring\b/gi,
    /\bboolean\b/gi,
    /\binteger\b/gi,
    /\bnull\b/gi,
    /\bundefined\b/gi,
    // تاغات HTML كنص
    /&lt;[^&]*&gt;/gi,
    // أقواس JSON
    /\{\s*"\w+":/gi,
    // كلمات تقنية أخرى
    /\bAPI\b/gi,
    /\bURL\b/gi,
    /\bHTTP\b/gi,
    /\bformat\b/gi,
    /\bparse\b/gi,
    /\breturn\b/gi,
  ];

  let cleanedContent = content;

  // إزالة الجمل التي تحتوي على كلمات كودية
  const sentencesToRemove = [
    /[^.]*\bJSON\b[^.]*\./gi,
    /[^.]*أرجع\s+JSON[^.]*\./gi,
    /[^.]*بصيغة\s+JSON[^.]*\./gi,
    /[^.]*تنسيق\s+HTML[^.]*\./gi,
    /[^.]*استخدم\s+<[^>]+>[^.]*\./gi,
  ];

  for (const pattern of sentencesToRemove) {
    cleanedContent = cleanedContent.replace(pattern, '');
  }

  // إزالة الكلمات الكودية المتبقية
  for (const pattern of codeWordsToRemove) {
    cleanedContent = cleanedContent.replace(pattern, '');
  }

  // تنظيف المسافات الزائدة
  cleanedContent = cleanedContent
    .replace(/\s{3,}/g, ' ')
    .replace(/<p>\s*<\/p>/gi, '')
    .replace(/<li>\s*<\/li>/gi, '')
    .trim();

  return cleanedContent;
}

/**
 * استخراج العنوان من المحتوى
 */
function extractTitle(content: string): string {
  // البحث عن h1 أو h2
  const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) return h1Match[1].trim();

  const h2Match = content.match(/<h2[^>]*>([^<]+)<\/h2>/i);
  if (h2Match) return h2Match[1].trim();

  // أول 50 حرف
  const text = content.replace(/<[^>]*>/g, '').trim();
  return text.substring(0, 50) + '...';
}

/**
 * استخراج المعاملات من الطلب
 */
function extractParams(request: GenerationRequest): Record<string, any> {
  const params: Record<string, any> = {};

  // استخراج العمر
  const ageMatch = request.topic.match(/(\d+)\s*(سنة|عام|year)/i);
  if (ageMatch) params.age = parseInt(ageMatch[1]);

  // استخراج الاسم
  const nameMatch = request.topic.match(/عيد ميلاد\s+(\S+)/);
  if (nameMatch) params.name = nameMatch[1];

  // استخراج أسبوع الحمل
  const weekMatch = request.topic.match(/(?:الأسبوع|أسبوع)\s*(\d+)/);
  if (weekMatch) params.week = parseInt(weekMatch[1]);

  return params;
}

/**
 * حساب عدد الكلمات
 */
function countWords(content: string): number {
  const text = content.replace(/<[^>]*>/g, ' ').trim();
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * الحصول على إحصائيات
 */
export function getStats() {
  return {
    usage: usage.getStats(),
    cache: cache.getStats(),
    config: CONFIG,
  };
}

/**
 * تحديث الإعدادات
 */
export function updateConfig(newConfig: Partial<typeof CONFIG>): void {
  Object.assign(CONFIG, newConfig);
}

export default {
  generateContent,
  getStats,
  updateConfig,
};
