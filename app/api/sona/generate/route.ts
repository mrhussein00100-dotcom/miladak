/**
 * SONA v4 Generate API
 * POST /api/sona/generate
 *
 * Requirements: 19.1, 19.2
 */

import { NextRequest, NextResponse } from 'next/server';
import { contentGenerator } from '@/lib/sona/contentGenerator';
import { sonaLogger } from '@/lib/sona/analytics';
import { TopicCategory, ArticleLength, ContentTone } from '@/lib/sona/types';

interface GenerateRequest {
  topic: string;
  length?: ArticleLength;
  style?: ContentTone;
  category?: TopicCategory;
  includeKeywords?: string[];
}

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
    duration: number;
    version: string;
  };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: GenerateRequest = await request.json();

    // Validate required fields
    if (!body.topic || typeof body.topic !== 'string') {
      return NextResponse.json<APIResponse<null>>(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'الموضوع مطلوب ويجب أن يكون نصاً',
          },
        },
        { status: 400 }
      );
    }

    // Validate length
    const validLengths: ArticleLength[] = [
      'short',
      'medium',
      'long',
      'comprehensive',
    ];
    if (body.length && !validLengths.includes(body.length)) {
      return NextResponse.json<APIResponse<null>>(
        {
          success: false,
          error: {
            code: 'INVALID_LENGTH',
            message:
              'طول المقال غير صالح. القيم المقبولة: short, medium, long, comprehensive',
          },
        },
        { status: 400 }
      );
    }

    // Generate content
    const result = await contentGenerator.generate({
      topic: body.topic,
      length: body.length || 'medium',
      style: body.style,
      category: body.category,
      includeKeywords: body.includeKeywords,
    });

    const duration = Date.now() - startTime;

    // Log the generation (non-blocking, graceful degradation)
    try {
      await sonaLogger.logGeneration({
        topic: body.topic,
        category: result.qualityReport ? 'general' : 'general',
        duration,
        qualityScore: result.qualityReport.overallScore,
        templatesUsed: result.usedTemplates,
        wordCount: result.wordCount,
        success: true,
      });
    } catch (logError) {
      // Logging failed, but generation succeeded - continue
      console.warn('Failed to log generation:', logError);
    }

    return NextResponse.json<APIResponse<typeof result>>({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        duration,
        version: '4.0.0',
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage =
      error instanceof Error ? error.message : 'خطأ غير معروف';

    // Log the error (non-blocking)
    try {
      await sonaLogger.logError(
        error instanceof Error ? error : new Error(errorMessage),
        { topic: 'unknown' }
      );
    } catch (logError) {
      console.warn('Failed to log error:', logError);
    }

    return NextResponse.json<APIResponse<null>>(
      {
        success: false,
        error: {
          code: 'GENERATION_ERROR',
          message: errorMessage,
        },
        meta: {
          timestamp: new Date().toISOString(),
          duration,
          version: '4.0.0',
        },
      },
      { status: 500 }
    );
  }
}
