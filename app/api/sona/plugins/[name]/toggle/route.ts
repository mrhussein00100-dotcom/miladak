/**
 * SONA v4 Plugin Toggle API
 * PUT /api/sona/plugins/:name/toggle
 *
 * Requirements: 19.1
 */

import { NextRequest, NextResponse } from 'next/server';
import { pluginManager } from '@/lib/sona/pluginManager';

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

interface ToggleResponse {
  name: string;
  enabled: boolean;
}

/**
 * PUT /api/sona/plugins/:name/toggle
 * تفعيل/تعطيل plugin
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;

    // Check if plugin exists
    const plugin = pluginManager.getPlugin(name);
    if (!plugin) {
      return NextResponse.json<APIResponse<null>>(
        {
          success: false,
          error: {
            code: 'PLUGIN_NOT_FOUND',
            message: `Plugin "${name}" غير موجود`,
          },
        },
        { status: 404 }
      );
    }

    // Toggle the plugin
    if (plugin.enabled) {
      pluginManager.disable(name);
    } else {
      pluginManager.enable(name);
    }

    // Get updated state
    const updatedPlugin = pluginManager.getPlugin(name);

    return NextResponse.json<APIResponse<ToggleResponse>>({
      success: true,
      data: {
        name,
        enabled: updatedPlugin?.enabled || false,
      },
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
          code: 'TOGGLE_ERROR',
          message: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}
