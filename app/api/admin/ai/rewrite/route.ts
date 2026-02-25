/**
 * API إعادة صياغة المحتوى بالذكاء الاصطناعي
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  rewriteContent,
  type AIProvider,
  type ContentStyle,
} from '@/lib/ai/generator';

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
    const style = (body.style || 'formal') as ContentStyle;

    const result = await rewriteContent({
      content: body.content,
      provider,
      style,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('AI rewrite error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في إعادة الصياغة',
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
