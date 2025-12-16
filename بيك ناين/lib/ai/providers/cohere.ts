/**
 * مزود Cohere API - مجاني مع حدود
 * https://cohere.ai/
 */

export interface CohereGenerationRequest {
  topic: string;
  length: 'short' | 'medium' | 'long' | 'comprehensive';
  style?: 'formal' | 'casual' | 'seo' | 'academic';
  includeKeywords?: string[];
  category?: string;
}

export interface CohereGenerationResponse {
  content: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  wordCount: number;
  provider: 'cohere';
  generationTime: number;
}

// الحصول على عدد الكلمات المطلوب
function getWordCount(length: string): { min: number; max: number } {
  switch (length) {
    case 'short':
      return { min: 400, max: 600 };
    case 'medium':
      return { min: 1200, max: 1800 };
    case 'long':
      return { min: 2500, max: 3500 };
    case 'comprehensive':
      return { min: 4500, max: 6000 };
    default:
      return { min: 1200, max: 1800 };
  }
}

// توليد مقال باستخدام Cohere
export async function generateArticle(
  request: CohereGenerationRequest
): Promise<CohereGenerationResponse> {
  const startTime = Date.now();
  const apiKey = process.env.COHERE_API_KEY;

  if (!apiKey) {
    throw new Error('COHERE_API_KEY غير موجود في متغيرات البيئة');
  }

  const wordCount = getWordCount(request.length);
  const styleDesc =
    request.style === 'formal'
      ? 'رسمي واحترافي'
      : request.style === 'casual'
      ? 'عامي وودود'
      : request.style === 'seo'
      ? 'محسن لمحركات البحث'
      : 'متوازن';

  const keywordsText = request.includeKeywords?.length
    ? `استخدم الكلمات المفتاحية: ${request.includeKeywords.join(', ')}`
    : '';

  const prompt = `أنت كاتب محتوى عربي محترف. اكتب مقالاً شاملاً باللغة العربية عن: "${
    request.topic
  }"

المتطلبات:
- عدد الكلمات: ${wordCount.min} إلى ${wordCount.max} كلمة
- النمط: ${styleDesc}
- التصنيف: ${request.category || 'عام'}
${keywordsText}

الهيكل:
1. عنوان جذاب
2. مقدمة تشد القارئ
3. عدة أقسام مع عناوين فرعية (استخدم ## للعناوين)
4. معلومات مفيدة
5. خاتمة

اكتب المقال مباشرة بدون أي تعليقات:`;

  try {
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command',
        prompt: prompt,
        max_tokens: 4000,
        temperature: 0.7,
        k: 0,
        stop_sequences: [],
        return_likelihoods: 'NONE',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cohere API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.generations?.[0]?.text;

    if (!content) {
      throw new Error('لم يتم الحصول على رد من Cohere');
    }

    // استخراج العنوان من المحتوى
    const titleMatch = content.match(/^#\s*(.+)$/m) || content.match(/^(.+)\n/);
    const title = titleMatch
      ? titleMatch[1].replace(/^#+\s*/, '').trim()
      : request.topic;

    const metaTitle =
      title.length > 60 ? title.substring(0, 57) + '...' : title;

    // استخراج أول فقرة كوصف
    const paragraphs = content
      .split('\n')
      .filter((p: string) => p.trim().length > 50 && !p.startsWith('#'));
    const metaDescription =
      paragraphs[0]?.substring(0, 160) || content.substring(0, 160);

    // استخراج كلمات مفتاحية
    const keywords =
      request.includeKeywords ||
      content
        .split(/\s+/)
        .filter((w: string) => w.length > 4 && !w.startsWith('#'))
        .slice(0, 10);

    return {
      content: formatAsHtml(content.trim()),
      title,
      metaTitle,
      metaDescription: metaDescription.replace(/[#*]/g, '').trim(),
      keywords: Array.isArray(keywords) ? keywords : [keywords],
      wordCount: content.split(/\s+/).length,
      provider: 'cohere',
      generationTime: Date.now() - startTime,
    };
  } catch (error) {
    console.error('Cohere generation error:', error);
    throw error;
  }
}

// تحويل Markdown إلى HTML بسيط
function formatAsHtml(content: string): string {
  return content
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hpul])(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '');
}

// إعادة صياغة محتوى
export async function rewriteContent(
  content: string,
  style: string
): Promise<{
  original: string;
  rewritten: string;
  wordCount: number;
  provider: 'cohere';
}> {
  const apiKey = process.env.COHERE_API_KEY;

  if (!apiKey) {
    throw new Error('COHERE_API_KEY غير موجود');
  }

  const prompt = `أعد صياغة النص التالي باللغة العربية بأسلوب ${style}:

${content}

النص المعاد صياغته:`;

  try {
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command',
        prompt: prompt,
        max_tokens: 2000,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.status}`);
    }

    const data = await response.json();
    const rewritten = data.generations?.[0]?.text;

    if (!rewritten) {
      throw new Error('لم يتم الحصول على رد من Cohere');
    }

    return {
      original: content,
      rewritten: rewritten.trim(),
      wordCount: rewritten.split(/\s+/).length,
      provider: 'cohere',
    };
  } catch (error) {
    console.error('Cohere rewrite error:', error);
    throw error;
  }
}

export default {
  generateArticle,
  rewriteContent,
};
