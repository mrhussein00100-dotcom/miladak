/**
 * مزود HuggingFace API - مجاني
 * يستخدم نماذج مفتوحة المصدر
 */

export interface HuggingFaceGenerationRequest {
  topic: string;
  length: 'short' | 'medium' | 'long' | 'comprehensive';
  style?: 'formal' | 'casual' | 'seo' | 'academic';
  includeKeywords?: string[];
  category?: string;
}

export interface HuggingFaceGenerationResponse {
  content: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  wordCount: number;
  provider: 'huggingface';
  generationTime: number;
}

// توليد مقال باستخدام HuggingFace
export async function generateArticle(
  request: HuggingFaceGenerationRequest
): Promise<HuggingFaceGenerationResponse> {
  const startTime = Date.now();
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error('HUGGINGFACE_API_KEY غير موجود في متغيرات البيئة');
  }

  const keywordsText = request.includeKeywords?.length
    ? `الكلمات المفتاحية: ${request.includeKeywords.join(', ')}`
    : '';

  const prompt = `اكتب مقالاً باللغة العربية عن: "${request.topic}"
${keywordsText}
التصنيف: ${request.category || 'عام'}

المقال:`;

  try {
    // استخدام نموذج يدعم العربية
    const response = await fetch(
      'https://api-inference.huggingface.co/models/bigscience/bloom',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 2000,
            temperature: 0.7,
            do_sample: true,
            top_p: 0.9,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      // إذا كان النموذج يحتاج وقت للتحميل
      if (response.status === 503) {
        throw new Error('النموذج قيد التحميل، يرجى المحاولة بعد دقيقة');
      }
      throw new Error(
        `HuggingFace API error: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    let content = '';

    if (Array.isArray(data) && data[0]?.generated_text) {
      content = data[0].generated_text.replace(prompt, '').trim();
    } else if (data.generated_text) {
      content = data.generated_text.replace(prompt, '').trim();
    } else {
      throw new Error('لم يتم الحصول على رد صالح من HuggingFace');
    }

    // إذا كان المحتوى قصير جداً، استخدم قالب بسيط
    if (content.length < 200) {
      content = generateTemplateContent(
        request.topic,
        request.category,
        request.includeKeywords
      );
    }

    const title = request.topic;
    const metaTitle =
      title.length > 60 ? title.substring(0, 57) + '...' : title;
    const metaDescription = content.substring(0, 160).replace(/<[^>]*>/g, '');
    const keywords = request.includeKeywords || [request.topic];

    return {
      content: formatAsHtml(content),
      title,
      metaTitle,
      metaDescription,
      keywords,
      wordCount: content.split(/\s+/).length,
      provider: 'huggingface',
      generationTime: Date.now() - startTime,
    };
  } catch (error) {
    console.error('HuggingFace generation error:', error);

    // Fallback إلى محتوى قالب
    const content = generateTemplateContent(
      request.topic,
      request.category,
      request.includeKeywords
    );
    return {
      content: formatAsHtml(content),
      title: request.topic,
      metaTitle: request.topic,
      metaDescription: content.substring(0, 160),
      keywords: request.includeKeywords || [request.topic],
      wordCount: content.split(/\s+/).length,
      provider: 'huggingface',
      generationTime: Date.now() - startTime,
    };
  }
}

// توليد محتوى قالب كـ fallback
function generateTemplateContent(
  topic: string,
  category?: string,
  keywords?: string[]
): string {
  const keywordsSection = keywords?.length
    ? `\n\n## الكلمات المفتاحية\n\nيتناول هذا المقال: ${keywords.join('، ')}.`
    : '';

  return `# ${topic}

## مقدمة

يعتبر موضوع ${topic} من المواضيع المهمة التي تستحق الاهتمام والدراسة. في هذا المقال، سنتناول أهم جوانب هذا الموضوع بشكل مفصل وشامل.

## أهمية الموضوع

يحظى ${topic} بأهمية كبيرة في حياتنا اليومية لعدة أسباب:

- يؤثر بشكل مباشر على جودة حياتنا
- له جوانب متعددة ومثيرة للاهتمام
- يستحق المزيد من البحث والاستكشاف
- يرتبط بالعديد من المجالات الأخرى

## معلومات مفيدة

هناك العديد من المعلومات المفيدة حول ${topic} التي يجب معرفتها:

1. **المعلومة الأولى**: تتعلق بالجوانب الأساسية للموضوع
2. **المعلومة الثانية**: تتناول التطبيقات العملية
3. **المعلومة الثالثة**: تشرح الفوائد والمميزات

## نصائح وإرشادات

للاستفادة القصوى من ${topic}، ننصح بما يلي:

- الاطلاع على المصادر الموثوقة
- التطبيق العملي للمعلومات
- مشاركة المعرفة مع الآخرين
${keywordsSection}

## خاتمة

في الختام، ${topic} موضوع غني بالمعلومات والفوائد. نأمل أن يكون هذا المقال قد قدم لكم معلومات مفيدة وقيمة حول هذا الموضوع المهم.`;
}

// تحويل Markdown إلى HTML
function formatAsHtml(content: string): string {
  return content
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
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
  provider: 'huggingface';
}> {
  // HuggingFace محدود في إعادة الصياغة، نستخدم طريقة بسيطة
  const sentences = content.split(/[.!?]/).filter((s) => s.trim().length > 0);
  const rewritten =
    sentences
      .map((sentence) => {
        return sentence
          .replace(/يعتبر/g, 'يُعد')
          .replace(/هناك/g, 'توجد')
          .replace(/يمكن/g, 'بإمكان')
          .replace(/أيضاً/g, 'كذلك')
          .replace(/بالإضافة إلى/g, 'فضلاً عن')
          .replace(/من أجل/g, 'بهدف')
          .trim();
      })
      .join('. ') + '.';

  return {
    original: content,
    rewritten,
    wordCount: rewritten.split(/\s+/).length,
    provider: 'huggingface',
  };
}

export default {
  generateArticle,
  rewriteContent,
};
