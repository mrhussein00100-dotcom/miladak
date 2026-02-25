/**
 * API توليد الميتا والكلمات المفتاحية
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateMeta, type AIProvider } from '@/lib/ai/generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // التحقق من الحقول المطلوبة
    if (!body.content) {
      return NextResponse.json(
        { success: false, error: 'المحتوى مطلوب' },
        { status: 400 }
      );
    }

    const provider = (body.provider || 'gemini') as AIProvider;

    const result = await generateMeta(body.content, provider);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Meta generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في توليد الميتا',
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
