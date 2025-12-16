/**
 * عمليات النشر التلقائي
 * إنشاء جداول جديدة للنشر التلقائي في قاعدة البيانات الموحدة
 */

import {
  queryAll,
  queryOne,
  execute,
  getUnifiedDatabase,
} from './unified-database';

// أنواع البيانات
export interface AutoPublishSettings {
  id: number;
  is_enabled: number;
  publish_time: string;
  frequency: 'daily' | 'weekly';
  topics: string; // JSON array
  default_category_id: number | null;
  ai_provider: string;
  content_length: 'short' | 'medium' | 'long' | 'comprehensive';
  last_run: string | null;
  created_at: string;
}

export interface AutoPublishLog {
  id: number;
  article_id: number | null;
  status: 'success' | 'failed' | 'retry';
  error_message: string | null;
  retry_count: number;
  created_at: string;
}

export interface AutoPublishSettingsInput {
  is_enabled?: boolean;
  publish_time?: string;
  frequency?: 'daily' | 'weekly';
  topics?: string[];
  default_category_id?: number | null;
  ai_provider?: string;
  content_length?: 'short' | 'medium' | 'long' | 'comprehensive';
}

// إنشاء جداول النشر التلقائي إذا لم تكن موجودة
export function initAutoPublishTables(): void {
  const db = getUnifiedDatabase();

  // جدول الإعدادات
  db.exec(`
    CREATE TABLE IF NOT EXISTS auto_publish_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      is_enabled INTEGER DEFAULT 0,
      publish_time TEXT DEFAULT '09:00',
      frequency TEXT DEFAULT 'daily' CHECK(frequency IN ('daily', 'weekly')),
      topics TEXT DEFAULT '[]',
      default_category_id INTEGER,
      ai_provider TEXT DEFAULT 'gemini',
      content_length TEXT DEFAULT 'medium' CHECK(content_length IN ('short', 'medium', 'long', 'comprehensive')),
      last_run DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // جدول السجل
  db.exec(`
    CREATE TABLE IF NOT EXISTS auto_publish_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id INTEGER,
      status TEXT CHECK(status IN ('success', 'failed', 'retry')),
      error_message TEXT,
      retry_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // إضافة إعدادات افتراضية إذا لم تكن موجودة
  const settings = queryOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM auto_publish_settings'
  );
  if (settings?.count === 0) {
    execute(`
      INSERT INTO auto_publish_settings (
        is_enabled, publish_time, frequency, topics, ai_provider, content_length
      ) VALUES (0, '09:00', 'daily', '[]', 'gemini', 'medium')
    `);
  }
}

// جلب إعدادات النشر التلقائي
export function getAutoPublishSettings(): AutoPublishSettings | undefined {
  initAutoPublishTables();
  return queryOne<AutoPublishSettings>(
    'SELECT * FROM auto_publish_settings LIMIT 1'
  );
}

// تحديث إعدادات النشر التلقائي
export function updateAutoPublishSettings(
  input: AutoPublishSettingsInput
): boolean {
  initAutoPublishTables();

  const updates: string[] = [];
  const params: any[] = [];

  if (input.is_enabled !== undefined) {
    updates.push('is_enabled = ?');
    params.push(input.is_enabled ? 1 : 0);
  }
  if (input.publish_time !== undefined) {
    updates.push('publish_time = ?');
    params.push(input.publish_time);
  }
  if (input.frequency !== undefined) {
    updates.push('frequency = ?');
    params.push(input.frequency);
  }
  if (input.topics !== undefined) {
    updates.push('topics = ?');
    params.push(JSON.stringify(input.topics));
  }
  if (input.default_category_id !== undefined) {
    updates.push('default_category_id = ?');
    params.push(input.default_category_id);
  }
  if (input.ai_provider !== undefined) {
    updates.push('ai_provider = ?');
    params.push(input.ai_provider);
  }
  if (input.content_length !== undefined) {
    updates.push('content_length = ?');
    params.push(input.content_length);
  }

  if (updates.length === 0) return true;

  execute(
    `UPDATE auto_publish_settings SET ${updates.join(', ')} WHERE id = 1`,
    params
  );

  return true;
}

// تحديث وقت آخر تشغيل
export function updateLastRun(): void {
  initAutoPublishTables();
  execute(
    'UPDATE auto_publish_settings SET last_run = datetime("now") WHERE id = 1'
  );
}

// إضافة سجل نشر
export function addPublishLog(log: {
  article_id?: number;
  status: 'success' | 'failed' | 'retry';
  error_message?: string;
  retry_count?: number;
}): number {
  initAutoPublishTables();

  const result = execute(
    `INSERT INTO auto_publish_log (article_id, status, error_message, retry_count)
     VALUES (?, ?, ?, ?)`,
    [
      log.article_id || null,
      log.status,
      log.error_message || null,
      log.retry_count || 0,
    ]
  );

  return result.lastInsertRowid as number;
}

// جلب سجلات النشر
export function getPublishLogs(
  options: {
    limit?: number;
    status?: 'success' | 'failed' | 'retry';
    days?: number;
  } = {}
): AutoPublishLog[] {
  initAutoPublishTables();

  const { limit = 30, status, days = 30 } = options;

  let query = `
    SELECT * FROM auto_publish_log 
    WHERE created_at >= datetime('now', '-${days} days')
  `;
  const params: any[] = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(limit);

  return queryAll<AutoPublishLog>(query, params);
}

// جلب آخر سجل
export function getLastPublishLog(): AutoPublishLog | undefined {
  initAutoPublishTables();
  return queryOne<AutoPublishLog>(
    'SELECT * FROM auto_publish_log ORDER BY created_at DESC LIMIT 1'
  );
}

// تحديث سجل (لإعادة المحاولة)
export function updatePublishLog(
  id: number,
  updates: {
    status?: 'success' | 'failed' | 'retry';
    article_id?: number;
    error_message?: string;
    retry_count?: number;
  }
): boolean {
  const updateParts: string[] = [];
  const params: any[] = [];

  if (updates.status !== undefined) {
    updateParts.push('status = ?');
    params.push(updates.status);
  }
  if (updates.article_id !== undefined) {
    updateParts.push('article_id = ?');
    params.push(updates.article_id);
  }
  if (updates.error_message !== undefined) {
    updateParts.push('error_message = ?');
    params.push(updates.error_message);
  }
  if (updates.retry_count !== undefined) {
    updateParts.push('retry_count = ?');
    params.push(updates.retry_count);
  }

  if (updateParts.length === 0) return true;

  params.push(id);
  const result = execute(
    `UPDATE auto_publish_log SET ${updateParts.join(', ')} WHERE id = ?`,
    params
  );

  return result.changes > 0;
}

// حذف السجلات القديمة
export function cleanOldLogs(daysToKeep: number = 30): number {
  initAutoPublishTables();

  const result = execute(
    `DELETE FROM auto_publish_log WHERE created_at < datetime('now', '-${daysToKeep} days')`
  );

  return result.changes;
}

// إحصائيات النشر التلقائي
export function getAutoPublishStats(): {
  totalPublished: number;
  successCount: number;
  failedCount: number;
  lastSuccess: string | null;
  lastFailed: string | null;
} {
  initAutoPublishTables();

  const stats = queryOne<{
    totalPublished: number;
    successCount: number;
    failedCount: number;
  }>(`
    SELECT 
      COUNT(*) as totalPublished,
      SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successCount,
      SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failedCount
    FROM auto_publish_log
    WHERE created_at >= datetime('now', '-30 days')
  `);

  const lastSuccess = queryOne<{ created_at: string }>(
    `SELECT created_at FROM auto_publish_log WHERE status = 'success' ORDER BY created_at DESC LIMIT 1`
  );

  const lastFailed = queryOne<{ created_at: string }>(
    `SELECT created_at FROM auto_publish_log WHERE status = 'failed' ORDER BY created_at DESC LIMIT 1`
  );

  return {
    totalPublished: stats?.totalPublished || 0,
    successCount: stats?.successCount || 0,
    failedCount: stats?.failedCount || 0,
    lastSuccess: lastSuccess?.created_at || null,
    lastFailed: lastFailed?.created_at || null,
  };
}

export default {
  initAutoPublishTables,
  getAutoPublishSettings,
  updateAutoPublishSettings,
  updateLastRun,
  addPublishLog,
  getPublishLogs,
  getLastPublishLog,
  updatePublishLog,
  cleanOldLogs,
  getAutoPublishStats,
};
