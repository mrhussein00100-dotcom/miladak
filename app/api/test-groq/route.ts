import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      return NextResponse.json({
        success: false,
        error: 'GROQ_API_KEY غير موجود',
      });
    }

    console.log('🧪 اختبار Groq API...');

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
              role: 'user',
              content: 'اكتب فقرة قصيرة عن الذكاء الاصطناعي باللغة العربية',
            },
          ],
          temperature: 0.7,
          max_tokens: 200,
        }),
      }
    );

    console.log('📡 Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ خطأ:', errorText);
      return NextResponse.json({
        success: false,
        error: `Groq API error: ${response.status} - ${errorText}`,
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log('✅ نجح الاختبار!');
    console.log('📝 النتيجة:', content);

    return NextResponse.json({
      success: true,
      content: content,
      message: 'Groq يعمل بشكل صحيح!',
    });
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error);
    return NextResponse.json({
      success: false,
      error: `خطأ في الاختبار: ${
        error instanceof Error ? error.message : 'خطأ غير معروف'
      }`,
    });
  }
}
