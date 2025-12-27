/**
 * SONA v4 Sandbox Generate API
 * POST /api/sona/sandbox/:id/generate
 *
 * Requirements: 17.2
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  sandboxManager,
  SandboxGenerationRequest,
  SandboxGeneratedContent,
} from '@/lib/sona/sandboxManager';

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    timestamp: string;
    version: string;
  };
}

/**
 * POST /api/sona/sandbox/:id/generate
 * توليد محتوى في sandbox
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: SandboxGenerationRequest = await request.json();

    // Validate request
    if (!body.topic) {
      return NextResponse.json<APIResponse<null>>(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'الموضوع مطلوب',
          },
        },
        { status: 400 }
      );
    }

    // Check if session exists
    const session = await sandboxManager.getSandbox(id);
    if (!session) {
      return NextResponse.json<APIResponse<null>>(
        {
          success: false,
          error: {
            code: 'SESSION_NOT_FOUND',
            message: 'جلسة Sandbox غير موجودة',
          },
        },
        { status: 404 }
      );
    }

    // Generate content in sandbox
    const content = await sandboxManager.generateInSandbox(id, body);

    if (!content) {
      return NextResponse.json<APIResponse<null>>(
        {
          success: false,
          error: {
            code: 'GENERATION_FAILED',
            message: 'فشل توليد المحتوى',
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json<APIResponse<SandboxGeneratedContent>>({
      success: true,
      data: content,
      meta: {
        timestamp: new Date().toISOString(),
        version: '4.0.0',
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'خطأ غير معروف';

    return NextResponse.json<APIResponse<null>>(
      {
        success: false,
        error: {
          code: 'SANDBOX_GENERATE_ERROR',
          message: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}
