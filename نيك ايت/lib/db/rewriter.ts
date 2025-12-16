/**
 * عمليات سجل إعادة الصياغة
 * يستخدم قاعدة البيانات الموحدة
 */

import {
  queryAll,
  queryOne,
  execute,
  getUnifiedDatabase,
} from './unified-database';
import type {
  RewriteHistoryRecord,
  RewriteSettings,
  RewriteResult,
  GeneratedImage,
  SourceType,
} from '@/types/rewriter';

// إنشاء جدول سجل إعادة الصياغة
export function ensureRewriteHistoryTable(): void {
  const db = getUnifiedDatabase();

  db.exec(`
    CREATE TABLE IF NOT EXISTS rewrite_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_type TEXT NOT NULL CHECK(source_type IN ('text', 'url')),
      source_url TEXT,
      original_title TEXT NOT NULL,
      original_content TEXT NOT NULL,
      settings TEXT NOT NULL,
      results TEXT NOT NULL,
      images TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // إنشاء الفهارس
  try {
    db.exec(`CREATE INDEX IF NOT EXISTS idx_rewrite_history_created 
             ON rewrite_history(created_at DESC)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_rewrite_history_source 
             ON rewrite_history(source_type)`);
  } catch (e) {
    // الفهارس موجودة
  }
}

// واجهة السجل الخام من قاعدة البيانات
interface RawHistoryRecord {
  id: number;
  source_type: string;
  source_url: string | null;
  original_title: string;
  original_content: string;
  settings: string;
  results: string;
  images: string | null;
  created_at: string;
  updated_at: string;
}

// تحويل السجل الخام إلى النوع المطلوب
function parseHistoryRecord(raw: RawHistoryRecord): RewriteHistoryRecord {
  return {
    id: raw.id,
    sourceType: raw.source_type as SourceType,
    sourceUrl: raw.source_url || undefined,
    originalTitle: raw.original_title,
    originalContent: raw.original_content,
    settings: JSON.parse(raw.settings) as RewriteSettings,
    results: JSON.parse(raw.results) as RewriteResult[],
    images: raw.images
      ? (JSON.parse(raw.images) as GeneratedImage[])
      : undefined,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

// إنشاء سجل جديد
export function createRewriteHistory(data: {
  sourceType: SourceType;
  sourceUrl?: string;
  originalTitle: string;
  originalContent: string;
  settings: RewriteSettings;
  results: RewriteResult[];
  images?: GeneratedImage[];
}): number {
  ensureRewriteHistoryTable();

  const now = new Date().toISOString();

  const result = execute(
    `INSERT INTO rewrite_history (
      source_type, source_url, original_title, original_content,
      settings, results, images, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.sourceType,
      data.sourceUrl || null,
      data.originalTitle,
      data.originalContent,
      JSON.stringify(data.settings),
      JSON.stringify(data.results),
      data.images ? JSON.stringify(data.images) : null,
      now,
      now,
    ]
  );

  return result.lastInsertRowid as number;
}

// جلب جميع السجلات مع الفلترة
export function getRewriteHistory(
  options: {
    page?: number;
    pageSize?: number;
    sourceType?: SourceType;
    search?: string;
  } = {}
): { records: RewriteHistoryRecord[]; total: number } {
  ensureRewriteHistoryTable();

  const { page = 1, pageSize = 20, sourceType, search } = options;

  let whereClause = '1=1';
  const params: any[] = [];

  if (sourceType) {
    whereClause += ' AND source_type = ?';
    params.push(sourceType);
  }

  if (search) {
    whereClause += ' AND (original_title LIKE ? OR original_content LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  // عدد السجلات الكلي
  const countResult = queryOne<{ total: number }>(
    `SELECT COUNT(*) as total FROM rewrite_history WHERE ${whereClause}`,
    params
  );
  const total = countResult?.total || 0;

  // جلب السجلات
  const offset = (page - 1) * pageSize;
  const rawRecords = queryAll<RawHistoryRecord>(
    `SELECT * FROM rewrite_history 
     WHERE ${whereClause}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );

  const records = rawRecords.map(parseHistoryRecord);

  return { records, total };
}

// جلب سجل واحد بالـ ID
export function getRewriteHistoryById(
  id: number
): RewriteHistoryRecord | undefined {
  ensureRewriteHistoryTable();

  const raw = queryOne<RawHistoryRecord>(
    'SELECT * FROM rewrite_history WHERE id = ?',
    [id]
  );

  return raw ? parseHistoryRecord(raw) : undefined;
}

// تحديث سجل
export function updateRewriteHistory(
  id: number,
  data: Partial<{
    results: RewriteResult[];
    images: GeneratedImage[];
  }>
): boolean {
  const record = getRewriteHistoryById(id);
  if (!record) return false;

  const updates: string[] = [];
  const params: any[] = [];

  if (data.results !== undefined) {
    updates.push('results = ?');
    params.push(JSON.stringify(data.results));
  }

  if (data.images !== undefined) {
    updates.push('images = ?');
    params.push(JSON.stringify(data.images));
  }

  if (updates.length === 0) return true;

  updates.push('updated_at = ?');
  params.push(new Date().toISOString());
  params.push(id);

  execute(
    `UPDATE rewrite_history SET ${updates.join(', ')} WHERE id = ?`,
    params
  );

  return true;
}

// حذف سجل
export function deleteRewriteHistory(id: number): boolean {
  const record = getRewriteHistoryById(id);
  if (!record) return false;

  execute('DELETE FROM rewrite_history WHERE id = ?', [id]);
  return true;
}

// حذف السجلات القديمة (أكثر من 30 يوم)
export function cleanOldHistory(daysOld: number = 30): number {
  ensureRewriteHistoryTable();

  const result = execute(
    `DELETE FROM rewrite_history 
     WHERE created_at < datetime('now', '-' || ? || ' days')`,
    [daysOld]
  );

  return result.changes;
}

// إحصائيات السجل
export function getRewriteStats(): {
  total: number;
  textCount: number;
  urlCount: number;
  todayCount: number;
} {
  ensureRewriteHistoryTable();

  const stats = queryOne<{
    total: number;
    textCount: number;
    urlCount: number;
    todayCount: number;
  }>(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN source_type = 'text' THEN 1 ELSE 0 END) as textCount,
      SUM(CASE WHEN source_type = 'url' THEN 1 ELSE 0 END) as urlCount,
      SUM(CASE WHEN date(created_at) = date('now') THEN 1 ELSE 0 END) as todayCount
    FROM rewrite_history
  `);

  return stats || { total: 0, textCount: 0, urlCount: 0, todayCount: 0 };
}

export default {
  ensureRewriteHistoryTable,
  createRewriteHistory,
  getRewriteHistory,
  getRewriteHistoryById,
  updateRewriteHistory,
  deleteRewriteHistory,
  cleanOldHistory,
  getRewriteStats,
};
