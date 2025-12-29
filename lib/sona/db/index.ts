/**
 * SONA v4 Database Layer
 * طبقة قاعدة البيانات لنظام SONA
 */

import {
  executePostgresQuery,
  executePostgresQueryOne,
  executePostgresCommand,
  executePostgresTransaction,
} from '../../db/postgres';
import { PoolClient } from 'pg';
import crypto from 'crypto';
import { TopicCategory } from '../types';

// ===========================================
// Types
// ===========================================

export interface SONASetting {
  id: number;
  key: string;
  value: unknown;
  description?: string;
  updated_at: Date;
  updated_by?: string;
}

export interface ContentHash {
  id: number;
  content_hash: string;
  topic: string;
  category: string;
  word_count: number;
  quality_score?: number;
  templates_used?: string[];
  keywords?: string[];
  created_at: Date;
}

export interface GenerationStat {
  id: number;
  date: Date;
  total_generations: number;
  successful_generations: number;
  failed_generations: number;
  avg_quality_score?: number;
  avg_generation_time?: number;
  category_breakdown?: Record<string, number>;
  template_usage?: Record<string, number>;
}

export interface TemplateVersion {
  id: number;
  template_id: string;
  template_type: string;
  category?: string;
  version: number;
  content: string;
  variables?: Record<string, unknown>;
  change_description?: string;
  created_at: Date;
  created_by?: string;
  is_archived: boolean;
}

export interface GenerationLog {
  id?: number;
  timestamp?: Date;
  topic: string;
  category: string;
  duration: number;
  quality_score?: number;
  diversity_score?: number;
  keyword_density?: number;
  readability_score?: number;
  templates_used?: string[];
  word_count: number;
  success: boolean;
  retries?: number;
  error_message?: string;
  settings_snapshot?: Record<string, unknown>;
}

export interface PluginInfo {
  id: number;
  name: string;
  display_name?: string;
  version?: string;
  description?: string;
  category?: string;
  enabled: boolean;
  config?: Record<string, unknown>;
  hooks?: string[];
  created_at: Date;
  updated_at: Date;
}

export interface SandboxSession {
  id: number;
  session_id: string;
  settings?: Record<string, unknown>;
  templates_override?: Record<string, unknown>;
  generated_content?: unknown[];
  created_at: Date;
  expires_at?: Date;
  is_active: boolean;
}

// ===========================================
// Settings Functions
// ===========================================

/**
 * الحصول على جميع الإعدادات
 */
export async function getAllSettings(): Promise<Record<string, unknown>> {
  const rows = await executePostgresQuery<SONASetting>(
    'SELECT key, value FROM sona_settings'
  );

  const settings: Record<string, unknown> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return settings;
}

/**
 * الحصول على إعداد محدد
 */
export async function getSetting<T>(key: string): Promise<T | undefined> {
  const row = await executePostgresQueryOne<SONASetting>(
    'SELECT value FROM sona_settings WHERE key = $1',
    [key]
  );
  return row?.value as T | undefined;
}

/**
 * تحديث إعداد
 */
export async function updateSetting(
  key: string,
  value: unknown,
  updatedBy?: string
): Promise<void> {
  await executePostgresCommand(
    `INSERT INTO sona_settings (key, value, updated_by)
     VALUES ($1, $2, $3)
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_by = $3`,
    [key, JSON.stringify(value), updatedBy]
  );
}

/**
 * تحديث عدة إعدادات
 */
export async function updateSettings(
  settings: Record<string, unknown>,
  updatedBy?: string
): Promise<void> {
  await executePostgresTransaction(async (client: PoolClient) => {
    for (const [key, value] of Object.entries(settings)) {
      await client.query(
        `INSERT INTO sona_settings (key, value, updated_by)
         VALUES ($1, $2, $3)
         ON CONFLICT (key) DO UPDATE SET value = $2, updated_by = $3`,
        [key, JSON.stringify(value), updatedBy]
      );
    }
  });
}

// ===========================================
// Content Hash Functions
// ===========================================

/**
 * إنشاء hash للمحتوى
 */
export function createContentHash(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * التحقق من وجود hash المحتوى
 */
export async function contentHashExists(hash: string): Promise<boolean> {
  const row = await executePostgresQueryOne<{ count: string }>(
    'SELECT COUNT(*) as count FROM sona_content_hashes WHERE content_hash = $1',
    [hash]
  );
  return parseInt(row?.count || '0') > 0;
}

/**
 * الحصول على آخر hashes المحتوى
 */
export async function getRecentContentHashes(
  limit: number = 50
): Promise<ContentHash[]> {
  return executePostgresQuery<ContentHash>(
    'SELECT * FROM sona_content_hashes ORDER BY created_at DESC LIMIT $1',
    [limit]
  );
}

/**
 * حفظ hash المحتوى
 */
export async function saveContentHash(
  hash: string,
  topic: string,
  category: TopicCategory | string,
  wordCount: number,
  qualityScore: number,
  templatesUsed: string[]
): Promise<void> {
  await executePostgresCommand(
    `INSERT INTO sona_content_hashes 
     (content_hash, topic, category, word_count, quality_score, templates_used)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (content_hash) DO NOTHING`,
    [
      hash,
      topic,
      category,
      wordCount,
      qualityScore,
      JSON.stringify(templatesUsed),
    ]
  );
}

/**
 * التحقق من وجود محتوى مشابه
 */
export async function checkContentExists(content: string): Promise<boolean> {
  const hash = createContentHash(content);
  return contentHashExists(hash);
}

/**
 * الحصول على إحصائيات المحتوى
 */
export async function getContentStats(): Promise<{
  totalContent: number;
  byCategory: Record<string, number>;
  avgQualityScore: number;
}> {
  const total = await executePostgresQueryOne<{ count: string }>(
    'SELECT COUNT(*) as count FROM sona_content_hashes'
  );

  const byCategory = await executePostgresQuery<{
    category: string;
    count: string;
  }>(
    'SELECT category, COUNT(*) as count FROM sona_content_hashes GROUP BY category'
  );

  const avgQuality = await executePostgresQueryOne<{ avg: string }>(
    'SELECT AVG(quality_score) as avg FROM sona_content_hashes WHERE quality_score IS NOT NULL'
  );

  const categoryMap: Record<string, number> = {};
  for (const row of byCategory) {
    categoryMap[row.category] = parseInt(row.count);
  }

  return {
    totalContent: parseInt(total?.count || '0'),
    byCategory: categoryMap,
    avgQualityScore: parseFloat(avgQuality?.avg || '0'),
  };
}

// ===========================================
// Generation Stats Functions
// ===========================================

/**
 * الحصول على إجمالي عمليات التوليد
 */
export async function getTotalGenerations(): Promise<number> {
  const row = await executePostgresQueryOne<{ total: string }>(
    'SELECT COALESCE(SUM(total_generations), 0) as total FROM sona_generation_stats'
  );
  return parseInt(row?.total || '0');
}

/**
 * تسجيل إحصائيات التوليد
 */
export async function recordGenerationStats(
  success: boolean,
  qualityScore: number,
  duration: number,
  category: TopicCategory | string,
  templatesUsed: string[]
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];

  // Get existing stats for today
  const existing = await executePostgresQueryOne<GenerationStat>(
    'SELECT * FROM sona_generation_stats WHERE date = $1',
    [today]
  );

  if (existing) {
    // Update existing stats
    const categoryBreakdown = (existing.category_breakdown || {}) as Record<
      string,
      number
    >;
    categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;

    const templateUsage = (existing.template_usage || {}) as Record<
      string,
      number
    >;
    for (const template of templatesUsed) {
      templateUsage[template] = (templateUsage[template] || 0) + 1;
    }

    const newTotal = existing.total_generations + 1;
    const newSuccessful = existing.successful_generations + (success ? 1 : 0);
    const newFailed = existing.failed_generations + (success ? 0 : 1);

    // Calculate new average quality score
    const oldTotalQuality =
      (existing.avg_quality_score || 0) * existing.total_generations;
    const newAvgQuality = (oldTotalQuality + qualityScore) / newTotal;

    // Calculate new average generation time
    const oldTotalTime =
      (existing.avg_generation_time || 0) * existing.total_generations;
    const newAvgTime = Math.round((oldTotalTime + duration) / newTotal);

    await executePostgresCommand(
      `UPDATE sona_generation_stats SET
        total_generations = $1,
        successful_generations = $2,
        failed_generations = $3,
        avg_quality_score = $4,
        avg_generation_time = $5,
        category_breakdown = $6,
        template_usage = $7
       WHERE date = $8`,
      [
        newTotal,
        newSuccessful,
        newFailed,
        newAvgQuality,
        newAvgTime,
        JSON.stringify(categoryBreakdown),
        JSON.stringify(templateUsage),
        today,
      ]
    );
  } else {
    // Create new stats for today
    const categoryBreakdown: Record<string, number> = { [category]: 1 };
    const templateUsage: Record<string, number> = {};
    for (const template of templatesUsed) {
      templateUsage[template] = 1;
    }

    await executePostgresCommand(
      `INSERT INTO sona_generation_stats 
       (date, total_generations, successful_generations, failed_generations, 
        avg_quality_score, avg_generation_time, category_breakdown, template_usage)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        today,
        1,
        success ? 1 : 0,
        success ? 0 : 1,
        qualityScore,
        duration,
        JSON.stringify(categoryBreakdown),
        JSON.stringify(templateUsage),
      ]
    );
  }
}

/**
 * الحصول على إحصائيات فترة زمنية
 */
export async function getGenerationStats(
  startDate: string,
  endDate: string
): Promise<GenerationStat[]> {
  return executePostgresQuery<GenerationStat>(
    'SELECT * FROM sona_generation_stats WHERE date BETWEEN $1 AND $2 ORDER BY date DESC',
    [startDate, endDate]
  );
}

// ===========================================
// Generation Log Functions
// ===========================================

/**
 * تسجيل عملية توليد
 */
export async function logGeneration(
  topic: string,
  category: TopicCategory | string,
  duration: number,
  qualityScore: number,
  templatesUsed: string[],
  wordCount: number,
  success: boolean,
  retries: number = 0,
  errorMessage?: string
): Promise<void> {
  await executePostgresCommand(
    `INSERT INTO sona_generation_logs 
     (topic, category, duration, quality_score, templates_used, word_count, success, retries, error_message)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      topic,
      category,
      duration,
      qualityScore,
      JSON.stringify(templatesUsed),
      wordCount,
      success,
      retries,
      errorMessage,
    ]
  );
}

/**
 * الحصول على سجلات التوليد
 */
export async function getGenerationLogs(
  limit: number = 100,
  offset: number = 0
): Promise<GenerationLog[]> {
  return executePostgresQuery<GenerationLog>(
    'SELECT * FROM sona_generation_logs ORDER BY timestamp DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
}

/**
 * الحصول على سجلات الأخطاء
 */
export async function getErrorLogs(
  limit: number = 50
): Promise<GenerationLog[]> {
  return executePostgresQuery<GenerationLog>(
    'SELECT * FROM sona_generation_logs WHERE success = false ORDER BY timestamp DESC LIMIT $1',
    [limit]
  );
}

// ===========================================
// Template Version Functions
// ===========================================

/**
 * حفظ إصدار قالب
 */
export async function saveTemplateVersion(
  templateId: string,
  templateType: string,
  content: string,
  options?: {
    category?: string;
    variables?: Record<string, unknown>;
    changeDescription?: string;
    createdBy?: string;
  }
): Promise<TemplateVersion> {
  // الحصول على آخر إصدار
  const lastVersion = await executePostgresQueryOne<{ version: number }>(
    'SELECT MAX(version) as version FROM sona_template_versions WHERE template_id = $1',
    [templateId]
  );

  const newVersion = (lastVersion?.version || 0) + 1;

  const result = await executePostgresQuery<TemplateVersion>(
    `INSERT INTO sona_template_versions 
     (template_id, template_type, category, version, content, variables, change_description, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      templateId,
      templateType,
      options?.category,
      newVersion,
      content,
      JSON.stringify(options?.variables || {}),
      options?.changeDescription,
      options?.createdBy,
    ]
  );

  return result[0];
}

/**
 * الحصول على إصدارات قالب
 */
export async function getTemplateVersions(
  templateId: string
): Promise<TemplateVersion[]> {
  return executePostgresQuery<TemplateVersion>(
    'SELECT * FROM sona_template_versions WHERE template_id = $1 AND is_archived = false ORDER BY version DESC',
    [templateId]
  );
}

/**
 * الحصول على إصدار محدد
 */
export async function getTemplateVersion(
  templateId: string,
  version: number
): Promise<TemplateVersion | undefined> {
  return executePostgresQueryOne<TemplateVersion>(
    'SELECT * FROM sona_template_versions WHERE template_id = $1 AND version = $2',
    [templateId, version]
  );
}

/**
 * التراجع إلى إصدار سابق
 */
export async function rollbackTemplate(
  templateId: string,
  version: number
): Promise<TemplateVersion | undefined> {
  const oldVersion = await getTemplateVersion(templateId, version);
  if (!oldVersion) return undefined;

  return saveTemplateVersion(
    templateId,
    oldVersion.template_type,
    oldVersion.content,
    {
      category: oldVersion.category || undefined,
      variables: oldVersion.variables || undefined,
      changeDescription: `Rollback to version ${version}`,
    }
  );
}

/**
 * أرشفة قالب
 */
export async function archiveTemplate(templateId: string): Promise<void> {
  await executePostgresCommand(
    'UPDATE sona_template_versions SET is_archived = true WHERE template_id = $1',
    [templateId]
  );
}

// ===========================================
// Plugin Functions
// ===========================================

/**
 * الحصول على جميع الـ Plugins
 */
export async function getAllPlugins(): Promise<PluginInfo[]> {
  return executePostgresQuery<PluginInfo>(
    'SELECT * FROM sona_plugins ORDER BY name'
  );
}

/**
 * الحصول على الـ Plugins المفعلة
 */
export async function getEnabledPlugins(): Promise<PluginInfo[]> {
  return executePostgresQuery<PluginInfo>(
    'SELECT * FROM sona_plugins WHERE enabled = true ORDER BY name'
  );
}

/**
 * تفعيل/تعطيل plugin
 */
export async function togglePlugin(
  name: string,
  enabled: boolean
): Promise<void> {
  await executePostgresCommand(
    'UPDATE sona_plugins SET enabled = $1 WHERE name = $2',
    [enabled, name]
  );
}

/**
 * تحديث إعدادات plugin
 */
export async function updatePluginConfig(
  name: string,
  config: Record<string, unknown>
): Promise<void> {
  await executePostgresCommand(
    'UPDATE sona_plugins SET config = $1 WHERE name = $2',
    [JSON.stringify(config), name]
  );
}

/**
 * تسجيل plugin جديد
 */
export async function registerPlugin(
  plugin: Partial<PluginInfo>
): Promise<void> {
  await executePostgresCommand(
    `INSERT INTO sona_plugins (name, display_name, version, description, category, enabled, config, hooks)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (name) DO UPDATE SET
       display_name = EXCLUDED.display_name,
       version = EXCLUDED.version,
       description = EXCLUDED.description`,
    [
      plugin.name,
      plugin.display_name,
      plugin.version,
      plugin.description,
      plugin.category,
      plugin.enabled ?? true,
      JSON.stringify(plugin.config || {}),
      JSON.stringify(plugin.hooks || []),
    ]
  );
}

// ===========================================
// Sandbox Functions
// ===========================================

/**
 * إنشاء جلسة sandbox
 */
export async function createSandboxSession(
  settings?: Record<string, unknown>
): Promise<SandboxSession> {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 ساعة

  const result = await executePostgresQuery<SandboxSession>(
    `INSERT INTO sona_sandbox_sessions (session_id, settings, expires_at)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [sessionId, JSON.stringify(settings || {}), expiresAt]
  );

  return result[0];
}

/**
 * الحصول على جلسة sandbox
 */
export async function getSandboxSession(
  sessionId: string
): Promise<SandboxSession | undefined> {
  return executePostgresQueryOne<SandboxSession>(
    'SELECT * FROM sona_sandbox_sessions WHERE session_id = $1 AND is_active = true',
    [sessionId]
  );
}

/**
 * تحديث محتوى sandbox
 */
export async function updateSandboxContent(
  sessionId: string,
  content: unknown
): Promise<void> {
  const session = await getSandboxSession(sessionId);
  if (!session) return;

  const existingContent = (session.generated_content || []) as unknown[];
  existingContent.push(content);

  await executePostgresCommand(
    'UPDATE sona_sandbox_sessions SET generated_content = $1 WHERE session_id = $2',
    [JSON.stringify(existingContent), sessionId]
  );
}

/**
 * إغلاق جلسة sandbox
 */
export async function closeSandboxSession(sessionId: string): Promise<void> {
  await executePostgresCommand(
    'UPDATE sona_sandbox_sessions SET is_active = false WHERE session_id = $1',
    [sessionId]
  );
}

/**
 * تنظيف جلسات sandbox المنتهية
 */
export async function cleanupExpiredSandboxSessions(): Promise<number> {
  const result = await executePostgresCommand(
    'DELETE FROM sona_sandbox_sessions WHERE expires_at < NOW() OR is_active = false'
  );
  return result.rowCount;
}

// ===========================================
// Database Initialization
// ===========================================

/**
 * تهيئة جداول SONA
 */
export async function initializeSONATables(): Promise<void> {
  const fs = await import('fs');
  const path = await import('path');

  try {
    const schemaPath = path.join(process.cwd(), 'lib/sona/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // تقسيم الـ SQL إلى أوامر منفصلة
    const commands = schema
      .split(';')
      .map((cmd) => cmd.trim())
      .filter((cmd) => cmd.length > 0 && !cmd.startsWith('--'));

    await executePostgresTransaction(async (client: PoolClient) => {
      for (const command of commands) {
        if (command.length > 0) {
          await client.query(command);
        }
      }
    });

    console.log('✅ SONA tables initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize SONA tables:', error);
    throw error;
  }
}

/**
 * التحقق من وجود جداول SONA
 */
export async function checkSONATablesExist(): Promise<boolean> {
  try {
    const result = await executePostgresQueryOne<{ exists: boolean }>(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'sona_settings'
      ) as exists`
    );
    return result?.exists || false;
  } catch {
    return false;
  }
}
