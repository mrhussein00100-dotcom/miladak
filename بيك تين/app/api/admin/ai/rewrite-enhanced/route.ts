import { NextRequest, NextResponse } from 'next/server';
import { rewriteContent, rewriteTitle } from '@/lib/ai/providers/gemini';

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      content,
      style = 'professional',
      targetLength = 'longer',
      provider = 'gemini',
      enhanceQuality = true,
      wordCount = 800,
    } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'المحتوى مطلوب',
      });
    }

    // تحويل الأسلوب للتنسيق المطلوب
    const geminiStyle = convertStyleToGemini(style);

    // إنشاء prompt محسن
    const enhancedContent = createEnhancedContent(
      title,
      content,
      style,
      targetLength,
      enhanceQuality,
      wordCount
    );

    // إعادة الصياغة باستخدام المزود المحدد مع fallback
    let result;
    let usedProvider = provider;

    // محاولة Gemini أولاً (له حصة منفصلة ويعمل!)
    if (provider !== 'groq') {
      try {
        console.log('🔄 محاولة Gemini أولاً...');
        result = await rewriteContent({
          content: enhancedContent,
          style: geminiStyle,
        });
        usedProvider = 'gemini';
        console.log('✅ نجح Gemini!');
      } catch (geminiError) {
        console.warn('⚠️ Gemini فشل، التبديل إلى Groq...', geminiError);
        // Fallback to Groq
        try {
          result = await rewriteWithGroq(enhancedContent, geminiStyle);
          usedProvider = 'groq';
        } catch (groqError) {
          console.error('❌ Groq أيضاً فشل:', groqError);
          return NextResponse.json({
            success: false,
            error: `فشل في إعادة الصياغة باستخدام جميع النماذج. Gemini: ${
              geminiError instanceof Error ? geminiError.message : 'خطأ'
            }, Groq: ${groqError instanceof Error ? groqError.message : 'خطأ'}`,
          });
        }
      }
    } else {
      // استخدام Groq مباشرة إذا طلب المستخدم
      try {
        console.log('🔄 استخدام Groq مباشرة...');
        result = await rewriteWithGroq(enhancedContent, geminiStyle);
        usedProvider = 'groq';
      } catch (groqError) {
        console.error('Groq فشل:', groqError);
        return NextResponse.json({
          success: false,
          error: `فشل في إعادة الصياغة باستخدام Groq: ${
            groqError instanceof Error ? groqError.message : 'خطأ غير معروف'
          }`,
        });
      }
    }

    if (!result.rewritten) {
      return NextResponse.json({
        success: false,
        error: 'فشل في إعادة الصياغة',
      });
    }

    // إعادة صياغة العنوان مع fallback
    let rewrittenTitle = title;
    if (title?.trim()) {
      try {
        // محاولة Gemini أولاً
        console.log('🔄 إعادة صياغة العنوان باستخدام Gemini...');
        rewrittenTitle = await rewriteTitle(title);
        console.log('✅ تم إعادة صياغة العنوان بـ Gemini');
      } catch (geminiTitleError) {
        console.warn('⚠️ Gemini فشل للعنوان، محاولة Groq...');
        try {
          const groqTitleResult = await rewriteWithGroq(
            title,
            geminiStyle,
            true
          );
          rewrittenTitle = groqTitleResult.rewritten
            .replace(/["""]/g, '')
            .replace(
              /^(العنوان|عنوان|النص|المقترح|الجديد|المُعاد|صياغته)[:\-\s*]*/gi,
              ''
            )
            .split('\n')[0]
            .trim();
          console.log('✅ تم إعادة صياغة العنوان بـ Groq');
        } catch (groqTitleError) {
          console.warn(
            '⚠️ فشل في إعادة صياغة العنوان، سيتم استخدام العنوان الأصلي'
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      results: [
        {
          content: result.rewritten,
          title: rewrittenTitle,
          model: usedProvider,
          wordCount: result.wordCount,
        },
      ],
      metadata: {
        originalWordCount: content.split(/\s+/).length,
        rewrittenWordCount: result.wordCount,
        processingTime: Date.now(),
        modelUsed: usedProvider,
      },
    });
  } catch (error) {
    console.error('Enhanced rewrite error:', error);
    return NextResponse.json({
      success: false,
      error: `حدث خطأ في الخادم: ${
        error instanceof Error ? error.message : 'خطأ غير معروف'
      }`,
    });
  }
}

function convertStyleToGemini(
  style: string
): 'formal' | 'casual' | 'seo' | 'simplified' | 'academic' {
  switch (style) {
    case 'professional':
      return 'formal';
    case 'simple':
      return 'simplified';
    case 'creative':
      return 'casual';
    case 'academic':
      return 'academic';
    default:
      return 'formal';
  }
}

// Fallback function using Groq
async function rewriteWithGroq(
  content: string,
  style: string,
  isTitle: boolean = false
) {
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    throw new Error('GROQ_API_KEY غير موجود');
  }

  console.log(
    `🔄 محاولة إعادة الصياغة باستخدام Groq... ${
      isTitle ? '(عنوان)' : '(محتوى)'
    }`
  );

  const originalWordCount = content.split(/\s+/).length;
  const targetWordCount = Math.max(originalWordCount * 5, 500); // 5 أضعاف أو 500 كلمة على الأقل

  const systemPrompt = isTitle
    ? `أنت خبير في كتابة العناوين الجذابة. عند إعطائك عنوان، اكتب عنوان بديل مختلف تماماً (8-12 كلمة). اكتب العنوان فقط بدون أي شرح.`
    : `أنت كاتب محتوى عربي محترف متخصص في التوسع والإثراء.

مهمتك: تحويل النص القصير إلى مقال طويل ومفصل.

القواعد الإلزامية:
1. اكتب ${targetWordCount} كلمة على الأقل (هذا إلزامي)
2. ابدأ بمقدمة من 4-5 جمل تمهد للموضوع
3. قسم المحتوى إلى عدة فقرات (كل فقرة 4-5 جمل)
4. أضف أمثلة وتفاصيل وشروحات كثيرة
5. أضف معلومات إضافية مفيدة تتعلق بالموضوع
6. اختم بخاتمة من 3-4 جمل
7. لا تنسخ أي جملة من النص الأصلي
8. ابدأ مباشرة بالمحتوى (لا تكتب "إعادة صياغة")

تذكر: ${targetWordCount} كلمة على الأقل!`;

  const response = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: isTitle
              ? `العنوان الأصلي: "${content}"

اكتب عنوان بديل مختلف (8-12 كلمة فقط):`
              : `النص الأصلي (${originalWordCount} كلمة فقط):
"""
${content}
"""

المطلوب: أعد كتابة هذا النص وتوسيعه إلى ${targetWordCount} كلمة على الأقل.

اكتب مقال طويل ومفصل يغطي الموضوع بشكل شامل. أضف مقدمة، تفاصيل كثيرة، أمثلة، وخاتمة.

ابدأ الكتابة الآن:`,
          },
        ],
        temperature: isTitle ? 0.8 : 0.95,
        max_tokens: isTitle ? 100 : 16000,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Groq API خطأ:', response.status, errorText);
    throw new Error(`Groq API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const rewritten = data.choices?.[0]?.message?.content;

  if (!rewritten) {
    throw new Error('لم يتم الحصول على رد من Groq');
  }

  console.log('✅ نجحت إعادة الصياغة باستخدام Groq');

  return {
    original: content,
    rewritten: rewritten.trim(),
    wordCount: rewritten.split(/\s+/).length,
    provider: 'groq',
  };
}

function createEnhancedContent(
  title: string,
  content: string,
  style: string,
  targetLength: string,
  enhanceQuality: boolean,
  minWordCount: number
): string {
  const lengthMultiplier = {
    shorter: 0.7,
    same: 1.0,
    longer: 2.0,
    much_longer: 3.0,
  };

  const originalWordCount = content.split(/\s+/).length;
  const targetWords = Math.max(
    originalWordCount *
      (lengthMultiplier[targetLength as keyof typeof lengthMultiplier] || 2.0),
    minWordCount
  );

  const styleInstructions = {
    professional: 'استخدم أسلوباً احترافياً ومهنياً مع مصطلحات دقيقة',
    simple: 'استخدم لغة بسيطة وواضحة يفهمها الجمهور العام',
    creative: 'استخدم أسلوباً إبداعياً وجذاباً مع تشبيهات ومجازات',
    academic: 'استخدم أسلوباً أكاديمياً علمياً مع مراجع ومصطلحات متخصصة',
  };

  const qualityInstructions = enhanceQuality
    ? `
- أضف مقدمة شاملة للموضوع
- وسع كل نقطة بتفاصيل أكثر وأمثلة
- أضف شروحات إضافية وتوضيحات
- اربط الأفكار بسياق أوسع
- أضف معلومات ذات قيمة للقارئ
- استخدم عناوين فرعية لتنظيم المحتوى
- أضف قوائم نقطية عند الحاجة
- أضف خاتمة تلخص الأفكار الرئيسية
    `
    : '';

  return `أنت كاتب محتوى عربي محترف متخصص في إعادة الصياغة والتوسع الكبير.

مهمتك: إعادة كتابة النص التالي بشكل كامل مع التوسع الكبير والتحسين.

النص الأصلي (${originalWordCount} كلمة):
"${content}"

تعليمات صارمة:
1. أعد كتابة النص بالكامل - لا تنسخ أي جملة كما هي
2. غير جميع التراكيب والعبارات مع الحفاظ على المعنى
3. استخدم مرادفات ومصطلحات مختلفة تماماً
4. ${
    styleInstructions[style as keyof typeof styleInstructions] ||
    styleInstructions.professional
  }
5. اجعل النص ${targetWords} كلمة على الأقل - هذا مهم جداً جداً
6. يجب أن يكون النص الجديد أطول بكثير من الأصل (ضاعف الطول على الأقل)
7. أضف فقرات وتفاصيل وشروحات إضافية كثيرة
8. احتفظ بجميع الحقائق والمعلومات المهمة
${qualityInstructions}

متطلبات التوسع الإلزامية:
- أضف مقدمة شاملة للموضوع (فقرة كاملة)
- وسع كل فكرة بتفاصيل أكثر بكثير
- أضف أمثلة وتوضيحات متعددة
- أضف فقرات جديدة تدعم الموضوع
- أضف خاتمة شاملة (فقرة كاملة)

مهم جداً:
- لا تبدأ بعبارات مثل "إعادة صياغة" أو "النص المعاد كتابته"
- ابدأ مباشرة بالمحتوى المُعاد صياغته
- تأكد من أن كل جملة مختلفة عن الأصل
- اجعل النص أطول بكثير من الأصل
- اجعل النص يتدفق بطريقة طبيعية ومنطقية

ابدأ إعادة الصياغة والتوسع الآن:`;
}
