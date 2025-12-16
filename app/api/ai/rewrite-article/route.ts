import { NextRequest, NextResponse } from 'next/server';

// إعادة صياغة باستخدام Groq
async function rewriteWithGroq(
  content: string,
  style: string,
  targetLength: string
) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY غير موجود');
  }

  const stylePrompts: Record<string, string> = {
    professional: 'بأسلوب احترافي ورسمي',
    simple: 'بأسلوب بسيط وسهل الفهم',
    creative: 'بأسلوب إبداعي وجذاب',
    academic: 'بأسلوب أكاديمي وعلمي',
    conversational: 'بأسلوب محادثة ودي',
  };

  const lengthPrompts: Record<string, string> = {
    shorter: 'اجعل المحتوى أقصر بنسبة 30% مع الحفاظ على الأفكار الرئيسية',
    same: 'احتفظ بنفس الطول تقريباً',
    longer: 'اجعل المحتوى أطول بنسبة 30% مع إضافة تفاصيل وأمثلة',
  };

  const prompt = `أعد صياغة المحتوى التالي ${
    stylePrompts[style] || 'بأسلوب احترافي'
  }.
${lengthPrompts[targetLength] || ''}.

المحتوى الأصلي:
${content}

متطلبات إعادة الصياغة:
1. احتفظ بالمعنى والأفكار الأساسية
2. استخدم كلمات وتعبيرات مختلفة
3. أعد ترتيب الجمل والفقرات بطريقة منطقية
4. احتفظ بالعناوين إن وُجدت (H2, H3)
5. احتفظ بأي قوائم أو نقاط مهمة
6. لا تضف معلومات جديدة لم تكن في النص الأصلي
7. أرجع المحتوى بتنسيق HTML نظيف

أرجع فقط المحتوى المُعاد صياغته بدون أي مقدمات أو شروحات.`;

  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content:
                'أنت خبير في إعادة صياغة المحتوى العربي بطرق مختلفة مع الحفاظ على المعنى الأصلي.',
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
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('خطأ في Groq:', error);
    throw error;
  }
}

// إعادة صياغة باستخدام Gemini
async function rewriteWithGemini(
  content: string,
  style: string,
  targetLength: string
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY غير موجود');
  }

  const stylePrompts: Record<string, string> = {
    professional: 'بأسلوب احترافي ورسمي',
    simple: 'بأسلوب بسيط وسهل الفهم',
    creative: 'بأسلوب إبداعي وجذاب',
    academic: 'بأسلوب أكاديمي وعلمي',
    conversational: 'بأسلوب محادثة ودي',
  };

  const lengthPrompts: Record<string, string> = {
    shorter: 'اجعل المحتوى أقصر بنسبة 30%',
    same: 'احتفظ بنفس الطول',
    longer: 'اجعل المحتوى أطول بنسبة 30%',
  };

  const prompt = `أعد صياغة المحتوى التالي ${
    stylePrompts[style] || 'بأسلوب احترافي'
  }. ${lengthPrompts[targetLength] || ''}.

المحتوى:
${content}

متطلبات:
- احتفظ بالمعنى الأصلي
- استخدم تعبيرات مختلفة
- أرجع HTML نظيف فقط
- لا تضف معلومات جديدة`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8000,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    console.error('خطأ في Gemini:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      content,
      style = 'professional',
      targetLength = 'same',
      provider = 'groq',
    } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'المحتوى مطلوب' },
        { status: 400 }
      );
    }

    let rewrittenContent = '';

    // محاولة إعادة الصياغة بالمزود المحدد
    if (provider === 'groq') {
      try {
        rewrittenContent = await rewriteWithGroq(content, style, targetLength);
      } catch (error) {
        console.error('فشل Groq، محاولة Gemini...');
        rewrittenContent = await rewriteWithGemini(
          content,
          style,
          targetLength
        );
      }
    } else {
      try {
        rewrittenContent = await rewriteWithGemini(
          content,
          style,
          targetLength
        );
      } catch (error) {
        console.error('فشل Gemini، محاولة Groq...');
        rewrittenContent = await rewriteWithGroq(content, style, targetLength);
      }
    }

    // تنظيف المحتوى
    let cleaned = rewrittenContent
      .replace(/^```html\s*/gi, '')
      .replace(/^```\s*/g, '')
      .replace(/```\s*$/g, '')
      .trim();

    // إحصائيات
    const originalWords = content
      .replace(/<[^>]*>/g, '')
      .split(/\s+/)
      .filter(Boolean).length;
    const rewrittenWords = cleaned
      .replace(/<[^>]*>/g, '')
      .split(/\s+/)
      .filter(Boolean).length;

    return NextResponse.json({
      success: true,
      rewritten_content: cleaned,
      statistics: {
        original_words: originalWords,
        rewritten_words: rewrittenWords,
        change_percentage: Math.round(
          ((rewrittenWords - originalWords) / originalWords) * 100
        ),
      },
      provider: provider,
      style: style,
    });
  } catch (error: any) {
    console.error('خطأ في إعادة الصياغة:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'حدث خطأ أثناء إعادة الصياغة',
      },
      { status: 500 }
    );
  }
}
