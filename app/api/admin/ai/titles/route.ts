/**
 * API توليد العناوين
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateTitles, type AIProvider } from '@/lib/ai/generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // التحقق من الحقول المطلوبة
    if (!body.topic) {
      return NextResponse.json(
        { success: false, error: 'الموضوع مطلوب' },
        { status: 400 }
      );
    }

    const provider = (body.provider || 'gemini') as AIProvider;
    const count = body.count || 10;

    const titles = await generateTitles(body.topic, count, provider);

    return NextResponse.json({
      success: true,
      data: { titles },
    });
  } catch (error) {
    console.error('Titles generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في توليد العناوين',
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
