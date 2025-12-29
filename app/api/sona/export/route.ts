/**
 * SONA v4 Export API
 * POST /api/sona/export
 *
 * Requirements: 16.1
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  exportImportManager,
  ExportOptions,
} from '@/lib/sona/exportImportManager';

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
 * POST /api/sona/export
 * تصدير بيانات SONA
 */
export async function POST(request: NextRequest) {
  try {
    const body: Partial<ExportOptions> = await request.json();

    const exportData = await exportImportManager.export(body);

    return NextResponse.json<APIResponse<typeof exportData>>({
      success: true,
      data: exportData,
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
          code: 'EXPORT_ERROR',
          message: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}
