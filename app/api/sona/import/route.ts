/**
 * SONA v4 Import API
 * POST /api/sona/import
 *
 * Requirements: 16.2
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  exportImportManager,
  ImportOptions,
  ImportResult,
  ExportData,
} from '@/lib/sona/exportImportManager';

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

interface ImportRequest {
  data: ExportData;
  options?: Partial<ImportOptions>;
}

/**
 * POST /api/sona/import
 * استيراد بيانات SONA
 */
export async function POST(request: NextRequest) {
  try {
    const body: ImportRequest = await request.json();

    if (!body.data) {
      return NextResponse.json<APIResponse<null>>(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'البيانات مطلوبة للاستيراد',
          },
        },
        { status: 400 }
      );
    }

    // Validate the data first
    const validation = exportImportManager.validateImportData(body.data);
    if (!validation.valid) {
      return NextResponse.json<APIResponse<null>>(
        {
          success: false,
          error: {
            code: 'INVALID_DATA',
            message: 'البيانات غير صالحة للاستيراد',
            details: validation.errors,
          },
        },
        { status: 400 }
      );
    }

    // Import the data
    const result = await exportImportManager.import(body.data, body.options);

    if (!result.success) {
      return NextResponse.json<APIResponse<ImportResult>>(
        {
          success: false,
          data: result,
          error: {
            code: 'IMPORT_FAILED',
            message: 'فشل الاستيراد',
            details: result.errors,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json<APIResponse<ImportResult>>({
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
          code: 'IMPORT_ERROR',
          message: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}
