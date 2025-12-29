/**
 * SONA v4 Plugins API
 * GET /api/sona/plugins
 *
 * Requirements: 19.1
 */

import { NextResponse } from 'next/server';
import { pluginManager } from '@/lib/sona/pluginManager';

interface PluginInfoResponse {
  name: string;
  displayName: string;
  version: string;
  description: string;
  category: string;
  enabled: boolean;
  hooks: string[];
}

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
 * Get hooks supported by a plugin
 */
function getPluginHooks(
  plugin: ReturnType<typeof pluginManager.getAllPlugins>[0]
): string[] {
  const hooks: string[] = [];
  if (plugin.beforeAnalyze) hooks.push('beforeAnalyze');
  if (plugin.afterAnalyze) hooks.push('afterAnalyze');
  if (plugin.beforeGenerate) hooks.push('beforeGenerate');
  if (plugin.afterGenerate) hooks.push('afterGenerate');
  if (plugin.getKnowledge) hooks.push('getKnowledge');
  if (plugin.getTemplates) hooks.push('getTemplates');
  if (plugin.getSynonyms) hooks.push('getSynonyms');
  return hooks;
}

/**
 * GET /api/sona/plugins
 * الحصول على قائمة الـ Plugins
 */
export async function GET() {
  try {
    const plugins = pluginManager.getAllPlugins();

    const pluginInfoList: PluginInfoResponse[] = plugins.map((plugin) => ({
      name: plugin.name,
      displayName: plugin.name,
      version: plugin.version,
      description: plugin.description || '',
      category: plugin.category,
      enabled: plugin.enabled,
      hooks: getPluginHooks(plugin),
    }));

    return NextResponse.json<APIResponse<PluginInfoResponse[]>>({
      success: true,
      data: pluginInfoList,
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
          code: 'PLUGINS_ERROR',
          message: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}
