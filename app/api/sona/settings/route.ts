/**
 * SONA v4 Settings API
 * GET/PUT /api/sona/settings
 *
 * Requirements: 19.1, 19.2
 */

import { NextRequest, NextResponse } from 'next/server';
import { settingsManager, SONASettings } from '@/lib/sona/settingsManager';

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
 * GET /api/sona/settings
 * الحصول على الإعدادات الحالية
 */
export async function GET() {
  try {
    const settings = await settingsManager.getSettings();

    return NextResponse.json<APIResponse<SONASettings>>({
      success: true,
      data: settings,
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
          code: 'SETTINGS_ERROR',
          message: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/sona/settings
 * تحديث الإعدادات
 */
export async function PUT(request: NextRequest) {
  try {
    const body: Partial<SONASettings> = await request.json();

    // Validate settings
    const validation = settingsManager.validateSettings(body);
    if (!validation.valid) {
      return NextResponse.json<APIResponse<null>>(
        {
          success: false,
          error: {
            code: 'INVALID_SETTINGS',
            message: 'الإعدادات غير صالحة',
            details: validation.errors,
          },
        },
        { status: 400 }
      );
    }

    // Update settings
    await settingsManager.updateSettings(body);

    // Get updated settings
    const updatedSettings = await settingsManager.getSettings();

    return NextResponse.json<APIResponse<SONASettings>>({
      success: true,
      data: updatedSettings,
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
          code: 'SETTINGS_UPDATE_ERROR',
          message: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}
