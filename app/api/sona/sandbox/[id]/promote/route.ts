/**
 * SONA v4 Sandbox Promote API
 * POST /api/sona/sandbox/:id/promote
 *
 * Requirements: 17.5
 */

import { NextRequest, NextResponse } from 'next/server';
import { sandboxManager, PromotionResult } from '@/lib/sona/sandboxManager';

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
    version: string;
  };
}

/**
 * POST /api/sona/sandbox/:id/promote
 * ترقية إعدادات sandbox للإنتاج
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Promote to production
    const result = await sandboxManager.promoteToProduction(id);

    if (!result.success) {
      return NextResponse.json<APIResponse<PromotionResult>>(
        {
          success: false,
          data: result,
          error: {
            code: 'PROMOTION_FAILED',
            message: 'فشل الترقية للإنتاج',
            details: result.errors,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json<APIResponse<PromotionResult>>({
      success: true,
      data: result,
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
          code: 'SANDBOX_PROMOTE_ERROR',
          message: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}
