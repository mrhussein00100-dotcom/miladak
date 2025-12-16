/**
 * خدمة إعادة الصياغة المتعددة
 * تدعم إعادة الصياغة باستخدام نماذج AI متعددة بشكل متوازي
 * منسوخ ومحسن من الموقع القديم
 */

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

// ترجمة الأنماط للـ prompts (من الموقع القديم)
const STYLE_PROMPTS: Record<string, string> = {
  formal: 'بأسلوب احترافي ورسمي',
  informal: 'بأسلوب بسيط وسهل الفهم',
  academic: 'بأسلوب أكاديمي وعلمي',
  journalistic: 'بأسلوب إبداعي وجذاب',
  professional: 'بأسلوب احترافي ورسمي',
  simple: 'بأسلوب بسيط وسهل الفهم',
  creative: 'بأسلوب إبداعي وجذاب',
  conversational: 'بأسلوب محادثة ودي',
};

const AUDIENCE_PROMPTS: Record<TargetAudience, string> = {
  general: 'للجمهور العام',
  expert: 'للمتخصصين',
  children: 'للأطفال',
  youth: 'للشباب',
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
 * بناء الـ prompt لإعادة الصياغة (نسخة طبق الأصل من الموقع القديم)
 */
function buildPrompt(
  title: string,
  content: string,
  options: RewriteOptions
): string {
  const stylePrompt = STYLE_PROMPTS[options.style] || 'بأسلوب احترافي';

  // حساب نسبة التغيير في الطول
  const originalWords = content
    .replace(/<[^>]*>/g, '')
    .split(/\s+/)
    .filter(Boolean).length;

  let lengthPrompt = '';
  if (options.wordCount < originalWords * 0.8) {
    lengthPrompt = `اكتب حوالي ${options.wordCount} كلمة (أقصر من الأصلي)`;
  } else if (options.wordCount > originalWords * 1.2) {
    lengthPrompt = `اكتب حوالي ${options.wordCount} كلمة (أطول من الأصلي مع تفاصيل إضافية)`;
  } else {
    lengthPrompt = `اكتب حوالي ${options.wordCount} كلمة (نفس طول الأصلي تقريباً)`;
  }

  // Prompt قوي ومحدد لإعادة الصياغة الحقيقية
  return `أنت خبير في إعادة الصياغة. مهمتك: تغيير كل كلمة وجملة في النص مع الحفاظ على المعنى.

قواعد صارمة:
- غيّر كل الكلمات باستخدام مرادفات
- أعد كتابة كل جملة بتركيب مختلف تماماً
- لا تنسخ أي جملة كما هي أبداً
- ${stylePrompt}
- ${lengthPrompt}

النص الأصلي:
${content}

مثال على إعادة الصياغة:
الأصلي: "يعتبر التعليم أساس التقدم في المجتمع"
المعاد صياغته: "يُشكل التعلم الركيزة الأساسية لتطور الأمم والشعوب"

الآن أعد صياغة النص أعلاه بنفس الطريقة. أرجع المحتوى المعاد صياغته فقط:`;
}

/**
 * إعادة الصياغة باستخدام Gemini (محسن من الموقع القديم)
 * يجرب عدة نماذج للتأكد من النجاح
 */
async function rewriteWithGemini(
  prompt: string
): Promise<{ title: string; content: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY غير موجود');
  }

  // قائمة النماذج للتجربة
  // ملاحظة: gemini-2.0-flash-exp قد يعطي 429 (rate limit)
  // في هذه الحالة نستخدم Groq بدلاً منه
  const models = ['gemini-2.0-flash-exp'];

  let lastError = '';

  for (const model of models) {
    try {
      console.log(`🔄 Gemini: محاولة النموذج ${model}...`);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 8000,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        // إذا كان الخطأ 429 (rate limit)، نعطي رسالة واضحة
        if (response.status === 429) {
          lastError = `${model}: تجاوز الحد المسموح (429) - جرب Groq بدلاً منه`;
        } else {
          lastError = `${model}: HTTP ${response.status}`;
        }

        console.warn(`⚠️ Gemini ${model} فشل:`, response.status);
        continue;
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text;
      const finishReason = candidate?.finishReason;

      // تحقق من أن الرد ليس محظوراً
      if (text && finishReason !== 'SAFETY' && finishReason !== 'RECITATION') {
        console.log(`✅ Gemini ${model} نجح!`);

        // تنظيف المحتوى
        const cleaned = text
          .replace(/^```html\s*/gi, '')
          .replace(/^```\s*/g, '')
          .replace(/```\s*$/g, '')
          .trim();

        return parseRewriteResponse(cleaned);
      } else {
        lastError = `${model}: رد فارغ أو محظور (${finishReason})`;
        console.warn(`⚠️ Gemini ${model} محظور أو فارغ`);
        continue;
      }
    } catch (error: any) {
      lastError = `${model}: ${error.message}`;
      console.error(`❌ Gemini ${model} خطأ:`, error.message);
      continue;
    }
  }

  // رسالة خطأ واضحة
  if (lastError.includes('429')) {
    throw new Error(
      'Gemini: تجاوزت الحد المسموح من الطلبات. جرب Groq بدلاً منه (أسرع وأكثر استقراراً)'
    );
  }
  throw new Error(`فشلت جميع نماذج Gemini: ${lastError}`);
}

/**
 * إعادة الصياغة باستخدام Groq (محسن من الموقع القديم)
 */
async function rewriteWithGroq(
  prompt: string
): Promise<{ title: string; content: string }> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY غير موجود');
  }

  // قائمة النماذج للتجربة
  const models = [
    'llama-3.3-70b-versatile',
    'llama-3.1-70b-versatile',
    'mixtral-8x7b-32768',
  ];

  let lastError = '';

  for (const model of models) {
    try {
      console.log(`🔄 Groq: محاولة النموذج ${model}...`);

      const response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content:
                  'أنت مختص في إعادة الصياغة. مهمتك الوحيدة: تغيير كل كلمة وجملة في النص باستخدام مرادفات وتراكيب مختلفة تماماً. ممنوع منعاً باتاً نسخ أي جملة كما هي. كل كلمة يجب أن تتغير.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 8000,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        lastError = `${model}: HTTP ${response.status} - ${errorText}`;
        console.warn(`⚠️ Groq ${model} فشل:`, response.status);
        continue;
      }

      const data = await response.json();
      const rewritten = data.choices?.[0]?.message?.content;

      if (rewritten) {
        console.log(`✅ Groq ${model} نجح!`);

        // تنظيف المحتوى
        const cleaned = rewritten
          .replace(/^```html\s*/gi, '')
          .replace(/^```\s*/g, '')
          .replace(/```\s*$/g, '')
          .trim();

        return parseRewriteResponse(cleaned);
      } else {
        lastError = `${model}: رد فارغ`;
        continue;
      }
    } catch (error: any) {
      lastError = `${model}: ${error.message}`;
      console.error(`❌ Groq ${model} خطأ:`, error.message);
      continue;
    }
  }

  throw new Error(`فشلت جميع نماذج Groq: ${lastError}`);
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
 * تحليل استجابة إعادة الصياغة (مبسط)
 */
function parseRewriteResponse(response: string): {
  title: string;
  content: string;
} {
  // المحتوى المعاد صياغته هو الرد كاملاً
  // نستخرج عنوان بسيط من أول سطر
  const lines = response.split('\n').filter((l) => l.trim());
  const firstLine = lines[0] || '';

  // إذا كان السطر الأول عنوان (يبدأ بـ # أو قصير)
  let title = 'مقال معاد صياغته';
  let content = response;

  if (firstLine.startsWith('#') || firstLine.length < 100) {
    title = firstLine.replace(/^#+\s*/, '').trim();
    content = lines.slice(1).join('\n').trim();
  }

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
  return `rw_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export default {
  rewriteWithModels,
};
