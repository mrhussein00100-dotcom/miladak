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

// توليد محتوى قالب كـ fallback مع دعم RTL للعربية
function generateTemplateContent(
  topic: string,
  category?: string,
  keywords?: string[]
): string {
  const keywordsSection = keywords?.length
    ? `\n\n<h2 class="text-2xl font-bold mt-8 mb-4 text-right" dir="rtl">الكلمات المفتاحية</h2>\n\n<p class="text-right leading-relaxed mb-4" dir="rtl">يتناول هذا المقال: ${keywords.join(
        '، '
      )}.</p>`
    : '';

  return `<h1 class="text-3xl font-bold mb-6 text-right" dir="rtl">${topic}</h1>

<h2 class="text-2xl font-bold mt-8 mb-4 text-right" dir="rtl">مقدمة</h2>

<p class="text-right leading-relaxed mb-4" dir="rtl">يعتبر موضوع ${topic} من المواضيع المهمة التي تستحق الاهتمام والدراسة. في هذا المقال، سنتناول أهم جوانب هذا الموضوع بشكل مفصل وشامل.</p>

<h2 class="text-2xl font-bold mt-8 mb-4 text-right" dir="rtl">أهمية الموضوع</h2>

<p class="text-right leading-relaxed mb-4" dir="rtl">يحظى ${topic} بأهمية كبيرة في حياتنا اليومية لعدة أسباب:</p>

<ul class="list-disc list-inside space-y-2 my-4 text-right" dir="rtl">
<li class="text-right leading-relaxed">يؤثر بشكل مباشر على جودة حياتنا</li>
<li class="text-right leading-relaxed">له جوانب متعددة ومثيرة للاهتمام</li>
<li class="text-right leading-relaxed">يستحق المزيد من البحث والاستكشاف</li>
<li class="text-right leading-relaxed">يرتبط بالعديد من المجالات الأخرى</li>
</ul>

<h2 class="text-2xl font-bold mt-8 mb-4 text-right" dir="rtl">معلومات مفيدة</h2>

<p class="text-right leading-relaxed mb-4" dir="rtl">هناك العديد من المعلومات المفيدة حول ${topic} التي يجب معرفتها:</p>

<ol class="list-decimal list-inside space-y-2 my-4 text-right" dir="rtl">
<li class="text-right leading-relaxed"><strong>المعلومة الأولى</strong>: تتعلق بالجوانب الأساسية للموضوع</li>
<li class="text-right leading-relaxed"><strong>المعلومة الثانية</strong>: تتناول التطبيقات العملية</li>
<li class="text-right leading-relaxed"><strong>المعلومة الثالثة</strong>: تشرح الفوائد والمميزات</li>
</ol>

<h2 class="text-2xl font-bold mt-8 mb-4 text-right" dir="rtl">نصائح وإرشادات</h2>

<p class="text-right leading-relaxed mb-4" dir="rtl">للاستفادة القصوى من ${topic}، ننصح بما يلي:</p>

<ul class="list-disc list-inside space-y-2 my-4 text-right" dir="rtl">
<li class="text-right leading-relaxed">الاطلاع على المصادر الموثوقة</li>
<li class="text-right leading-relaxed">التطبيق العملي للمعلومات</li>
<li class="text-right leading-relaxed">مشاركة المعرفة مع الآخرين</li>
</ul>
${keywordsSection}

<h2 class="text-2xl font-bold mt-8 mb-4 text-right" dir="rtl">خاتمة</h2>

<p class="text-right leading-relaxed mb-4" dir="rtl">في الختام، ${topic} موضوع غني بالمعلومات والفوائد. نأمل أن يكون هذا المقال قد قدم لكم معلومات مفيدة وقيمة حول هذا الموضوع المهم.</p>`;
}

// تحويل Markdown إلى HTML مع دعم RTL للعربية
function formatAsHtml(content: string): string {
  return content
    .replace(
      /^### (.+)$/gm,
      '<h3 class="text-xl font-semibold mt-6 mb-3 text-right" dir="rtl">$1</h3>'
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 class="text-2xl font-bold mt-8 mb-4 text-right" dir="rtl">$1</h2>'
    )
    .replace(
      /^# (.+)$/gm,
      '<h1 class="text-3xl font-bold mb-6 text-right" dir="rtl">$1</h1>'
    )
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(
      /^\d+\.\s+(.+)$/gm,
      '<li class="text-right leading-relaxed">$1</li>'
    )
    .replace(/^- (.+)$/gm, '<li class="text-right leading-relaxed">$1</li>')
    .replace(
      /(<li[^>]*>.*<\/li>\n?)+/g,
      (match) =>
        `<ul class="list-disc list-inside space-y-2 my-4 text-right" dir="rtl">${match}</ul>`
    )
    .replace(
      /\n\n/g,
      '</p><p class="text-right leading-relaxed mb-4" dir="rtl">'
    )
    .replace(
      /^(?!<[hpul])(.+)$/gm,
      '<p class="text-right leading-relaxed mb-4" dir="rtl">$1</p>'
    )
    .replace(/<p[^>]*><\/p>/g, '');
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
