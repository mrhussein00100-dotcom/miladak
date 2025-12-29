/**
 * SONA v4 Sandbox API
 * POST /api/sona/sandbox/create
 *
 * Requirements: 17.1
 */

import { NextRequest, NextResponse } from 'next/server';
import { sandboxManager, SandboxSession } from '@/lib/sona/sandboxManager';
import { SONASettings } from '@/lib/sona/settingsManager';

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

interface CreateSandboxRequest {
  settings?: Partial<SONASettings>;
}

/**
 * POST /api/sona/sandbox
 * إنشاء جلسة sandbox جديدة
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateSandboxRequest = await request.json().catch(() => ({}));

    const session = await sandboxManager.createSandbox(body.settings);

    return NextResponse.json<APIResponse<SandboxSession>>({
      success: true,
      data: session,
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
          code: 'SANDBOX_CREATE_ERROR',
          message: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sona/sandbox
 * الحصول على جميع الجلسات النشطة
 */
export async function GET() {
  try {
    const sessions = sandboxManager.getActiveSessions();

    return NextResponse.json<APIResponse<SandboxSession[]>>({
      success: true,
      data: sessions,
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
          code: 'SANDBOX_LIST_ERROR',
          message: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}
