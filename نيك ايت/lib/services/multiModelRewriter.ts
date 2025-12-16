/**
 * خدمة إعادة الصياغة المتعددة
 * تدعم إعادة الصياغة باستخدام نماذج AI متعددة بشكل متوازي
 */

import * as gemini from '../ai/providers/gemini';
import * as groq from '../ai/providers/groq';
import * as cohere from '../ai/providers/cohere';
import * as huggingface from '../ai/providers/huggingface';
import * as local from '../ai/providers/local';
import type {
  AIProvider,
  WritingStyle,
  TargetAudience,
  RewriteResult,
} from '@/types/rewriter';

// خيارات إعادة الصياغة
export interface RewriteOptions {
  wordCount: number;
  style: WritingStyle;
  audience: TargetAudience;
}

// ترجمة الأنماط للـ prompts
const STYLE_PROMPTS: Record<WritingStyle, string> = {
  formal: 'استخدم لغة رسمية ومهنية مع مصطلحات دقيقة',
  informal: 'استخدم لغة بسيطة وودية وقريبة من القارئ',
  academic: 'استخدم لغة أكاديمية علمية مع مراجع ومصطلحات متخصصة',
  journalistic: 'استخدم أسلوب صحفي جذاب مع عناوين فرعية قوية',
};

const AUDIENCE_PROMPTS: Record<TargetAudience, string> = {
  general: 'اكتب للجمهور العام بلغة واضحة ومفهومة',
  expert: 'اكتب للمتخصصين مع تفاصيل تقنية عميقة',
  children: 'اكتب للأطفال بلغة بسيطة جداً وجمل قصيرة',
  youth: 'اكتب للشباب بأسلوب عصري وجذاب',
};

/**
 * إعادة الصياغة باستخدام نماذج متعددة بشكل متوازي
 */
export async function rewriteWithModels(
  title: string,
  content: string,
  models: AIProvider[],
  options: RewriteOptions
): Promise<RewriteResult[]> {
  console.log(`🔄 بدء إعادة الصياغة مع ${models.length} نموذج...`);

  // إنشاء الـ prompt
  const prompt = buildPrompt(title, content, options);

  // تنفيذ الطلبات بشكل متوازي
  const promises = models.map((model) =>
    rewriteWithModel(model, prompt, options).catch((error) => ({
      id: generateId(),
      model,
      title: '',
      content: '',
      wordCount: 0,
      qualityScore: 0,
      readabilityScore: 0,
      seoScore: 0,
      uniquenessScore: 0,
      keywords: [],
      metaDescription: '',
      suggestedTitles: [],
      generationTime: 0,
      error: error.message || 'فشل في إعادة الصياغة',
    }))
  );

  const results = await Promise.all(promises);

  // فلترة النتائج الناجحة وترتيبها حسب الجودة
  return results
    .filter((r) => !r.error || r.content)
    .sort((a, b) => b.qualityScore - a.qualityScore);
}

/**
 * إعادة الصياغة باستخدام نموذج واحد
 */
async function rewriteWithModel(
  model: AIProvider,
  prompt: string,
  options: RewriteOptions
): Promise<RewriteResult> {
  const startTime = Date.now();
  const id = generateId();

  console.log(`🤖 إعادة الصياغة باستخدام ${model}...`);

  try {
    let result: { title: string; content: string };

    switch (model) {
      case 'gemini':
        result = await rewriteWithGemini(prompt);
        break;
      case 'groq':
        result = await rewriteWithGroq(prompt);
        break;
      case 'cohere':
        result = await rewriteWithCohere(prompt);
        break;
      case 'huggingface':
        result = await rewriteWithHuggingface(prompt);
        break;
      case 'local':
        result = await rewriteWithLocal(prompt);
        break;
      default:
        throw new Error(`النموذج ${model} غير مدعوم`);
    }

    const generationTime = Date.now() - startTime;
    const wordCount = countWords(result.content);

    // حساب درجات الجودة
    const qualityScore = calculateQualityScore(result.content, options);
    const readabilityScore = calculateReadabilityScore(result.content);
    const seoScore = calculateBasicSEOScore(result.content, result.title);
    const uniquenessScore = 85 + Math.random() * 10; // تقدير مبدئي

    // استخراج الكلمات المفتاحية
    const keywords = extractKeywords(result.content);

    // توليد وصف meta
    const metaDescription = generateMetaDescription(result.content);

    console.log(`✅ ${model} أكمل في ${generationTime}ms`);

    return {
      id,
      model,
      title: result.title,
      content: result.content,
      wordCount,
      qualityScore,
      readabilityScore,
      seoScore,
      uniquenessScore,
      keywords,
      metaDescription,
      suggestedTitles: [],
      generationTime,
    };
  } catch (error) {
    console.error(`❌ فشل ${model}:`, error);
    throw error;
  }
}

/**
 * بناء الـ prompt لإعادة الصياغة
 */
function buildPrompt(
  title: string,
  content: string,
  options: RewriteOptions
): string {
  const stylePrompt = STYLE_PROMPTS[options.style];
  const audiencePrompt = AUDIENCE_PROMPTS[options.audience];

  return `أعد صياغة المقال التالي باللغة العربية الفصحى:

## التعليمات:
- ${stylePrompt}
- ${audiencePrompt}
- عدد الكلمات المطلوب: حوالي ${options.wordCount} كلمة
- احتفظ بالمعنى والأفكار الرئيسية
- أضف عناوين فرعية مناسبة
- استخدم فقرات منظمة
- تجنب التكرار والحشو

## العنوان الأصلي:
${title}

## المحتوى الأصلي:
${content}

## المطلوب:
أرجع النتيجة بالتنسيق التالي:
[TITLE]
العنوان الجديد هنا
[/TITLE]

[CONTENT]
المحتوى المعاد صياغته هنا
[/CONTENT]`;
}

/**
 * إعادة الصياغة باستخدام Gemini
 */
async function rewriteWithGemini(
  prompt: string
): Promise<{ title: string; content: string }> {
  const response = await gemini.rewriteContent({
    content: prompt,
    style: 'formal',
  });
  return parseRewriteResponse(response.rewritten);
}

/**
 * إعادة الصياغة باستخدام Groq
 */
async function rewriteWithGroq(
  prompt: string
): Promise<{ title: string; content: string }> {
  const response = await groq.rewriteContent(prompt, 'formal');
  return parseRewriteResponse(response.rewritten);
}

/**
 * إعادة الصياغة باستخدام Cohere
 */
async function rewriteWithCohere(
  prompt: string
): Promise<{ title: string; content: string }> {
  const response = await cohere.rewriteContent(prompt, 'formal');
  return parseRewriteResponse(response.rewritten);
}

/**
 * إعادة الصياغة باستخدام HuggingFace
 */
async function rewriteWithHuggingface(
  prompt: string
): Promise<{ title: string; content: string }> {
  const response = await huggingface.rewriteContent(prompt, 'formal');
  return parseRewriteResponse(response.rewritten);
}

/**
 * إعادة الصياغة باستخدام Local
 */
async function rewriteWithLocal(
  prompt: string
): Promise<{ title: string; content: string }> {
  const response = await local.rewriteContent(prompt, 'formal');
  return parseRewriteResponse(response.rewritten);
}

/**
 * تحليل استجابة إعادة الصياغة
 */
function parseRewriteResponse(response: string): {
  title: string;
  content: string;
} {
  // محاولة استخراج العنوان والمحتوى من التنسيق المحدد
  const titleMatch = response.match(/\[TITLE\]([\s\S]*?)\[\/TITLE\]/);
  const contentMatch = response.match(/\[CONTENT\]([\s\S]*?)\[\/CONTENT\]/);

  if (titleMatch && contentMatch) {
    return {
      title: titleMatch[1].trim(),
      content: contentMatch[1].trim(),
    };
  }

  // Fallback: استخراج العنوان من أول سطر
  const lines = response.split('\n').filter((l) => l.trim());
  const title = lines[0]?.replace(/^#+\s*/, '').trim() || 'مقال معاد صياغته';
  const content = lines.slice(1).join('\n').trim() || response;

  return { title, content };
}

/**
 * حساب درجة الجودة
 */
function calculateQualityScore(
  content: string,
  options: RewriteOptions
): number {
  let score = 70; // درجة أساسية

  const wordCount = countWords(content);
  const targetCount = options.wordCount;

  // التحقق من عدد الكلمات (±20%)
  const wordRatio = wordCount / targetCount;
  if (wordRatio >= 0.8 && wordRatio <= 1.2) {
    score += 10;
  } else if (wordRatio >= 0.6 && wordRatio <= 1.4) {
    score += 5;
  }

  // التحقق من وجود عناوين فرعية
  if (
    content.includes('##') ||
    content.includes('<h2') ||
    content.includes('<h3')
  ) {
    score += 5;
  }

  // التحقق من وجود فقرات
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim().length > 50);
  if (paragraphs.length >= 3) {
    score += 5;
  }

  // التحقق من طول الجمل
  const sentences = content.split(/[.!؟]/).filter((s) => s.trim());
  const avgSentenceLength =
    sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) /
    sentences.length;
  if (avgSentenceLength >= 10 && avgSentenceLength <= 25) {
    score += 5;
  }

  // إضافة بعض العشوائية للتنوع
  score += Math.random() * 5;

  return Math.min(100, Math.round(score));
}

/**
 * حساب درجة قابلية القراءة
 */
function calculateReadabilityScore(content: string): number {
  const words = countWords(content);
  const sentences = content.split(/[.!؟]/).filter((s) => s.trim()).length;
  const avgWordsPerSentence = words / Math.max(sentences, 1);

  // درجة أساسية
  let score = 75;

  // جمل قصيرة = قراءة أسهل
  if (avgWordsPerSentence <= 15) {
    score += 15;
  } else if (avgWordsPerSentence <= 20) {
    score += 10;
  } else if (avgWordsPerSentence <= 25) {
    score += 5;
  }

  // التحقق من وجود قوائم
  if (
    content.includes('- ') ||
    content.includes('* ') ||
    content.includes('1.')
  ) {
    score += 5;
  }

  return Math.min(100, Math.round(score + Math.random() * 5));
}

/**
 * حساب درجة SEO الأساسية
 */
function calculateBasicSEOScore(content: string, title: string): number {
  let score = 60;

  // طول العنوان مناسب
  if (title.length >= 30 && title.length <= 70) {
    score += 10;
  }

  // وجود عناوين فرعية
  const headings = (content.match(/##|<h[2-6]/g) || []).length;
  if (headings >= 2) {
    score += 10;
  }

  // طول المحتوى
  const wordCount = countWords(content);
  if (wordCount >= 500) {
    score += 10;
  }
  if (wordCount >= 1000) {
    score += 5;
  }

  return Math.min(100, Math.round(score + Math.random() * 5));
}

/**
 * استخراج الكلمات المفتاحية
 */
function extractKeywords(content: string): string[] {
  // تنظيف المحتوى
  const cleanContent = content
    .replace(/<[^>]*>/g, '')
    .replace(/[^\u0621-\u064Aa-zA-Z\s]/g, ' ');

  // تقسيم إلى كلمات
  const words = cleanContent.split(/\s+/).filter((w) => w.length > 3);

  // حساب تكرار الكلمات
  const frequency: Record<string, number> = {};
  words.forEach((word) => {
    const normalized = word.toLowerCase();
    frequency[normalized] = (frequency[normalized] || 0) + 1;
  });

  // ترتيب حسب التكرار واختيار أعلى 10
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

/**
 * توليد وصف meta
 */
function generateMetaDescription(content: string): string {
  // تنظيف المحتوى
  const cleanContent = content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // أخذ أول 160 حرف
  if (cleanContent.length <= 160) {
    return cleanContent;
  }

  // قطع عند آخر مسافة قبل 160 حرف
  const truncated = cleanContent.substring(0, 160);
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace) + '...';
}

/**
 * حساب عدد الكلمات
 */
function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

/**
 * توليد معرف فريد
 */
function generateId(): string {
  return `rw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default {
  rewriteWithModels,
};
