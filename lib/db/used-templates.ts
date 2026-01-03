/**
 * عمليات تتبع القوالب المستخدمة
 * يمنع تكرار القوالب من مقال لآخر
 */

import { execute, query, queryOne } from './database';

export interface UsedTemplate {
  id: number;
  template_hash: string;
  template_type: 'intro' | 'section' | 'faq' | 'conclusion';
  category: string | null;
  article_id: number | null;
  topic: string | null;
  used_at: string;
}

function isPostgresDatabase(): boolean {
  return (
    (process.env.VERCEL_URL && process.env.NODE_ENV === 'production') ||
    !!process.env.POSTGRES_URL ||
    process.env.DATABASE_URL?.startsWith('postgres') ||
    process.env.DATABASE_TYPE === 'postgres'
  );
}

let usedTemplatesTableInitialized = false;

/**
 * إنشاء جدول القوالب المستخدمة
 */
export async function initUsedTemplatesTable(): Promise<void> {
  if (usedTemplatesTableInitialized) return;

  const isPostgres = isPostgresDatabase();

  if (isPostgres) {
    await execute(`
      CREATE TABLE IF NOT EXISTS used_templates (
        id SERIAL PRIMARY KEY,
        template_hash TEXT NOT NULL,
        template_type TEXT NOT NULL,
        category TEXT,
        article_id INTEGER,
        topic TEXT,
        used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await execute(
      `CREATE INDEX IF NOT EXISTS idx_used_templates_hash ON used_templates(template_hash)`
    );
    await execute(
      `CREATE INDEX IF NOT EXISTS idx_used_templates_type ON used_templates(template_type)`
    );
    await execute(
      `CREATE INDEX IF NOT EXISTS idx_used_templates_category ON used_templates(category)`
    );
  } else {
    await execute(`
      CREATE TABLE IF NOT EXISTS used_templates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        template_hash TEXT NOT NULL,
        template_type TEXT NOT NULL,
        category TEXT,
        article_id INTEGER,
        topic TEXT,
        used_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await execute(
      `CREATE INDEX IF NOT EXISTS idx_used_templates_hash ON used_templates(template_hash)`
    );
    await execute(
      `CREATE INDEX IF NOT EXISTS idx_used_templates_type ON used_templates(template_type)`
    );
    await execute(
      `CREATE INDEX IF NOT EXISTS idx_used_templates_category ON used_templates(category)`
    );
  }

  usedTemplatesTableInitialized = true;
  console.log('✅ [UsedTemplates] تم إنشاء جدول القوالب المستخدمة');
}

/**
 * التحقق مما إذا كان القالب مستخدماً
 */
export async function isTemplateUsed(templateHash: string): Promise<boolean> {
  await initUsedTemplatesTable();

  const result = await queryOne<{ count: number | string }>(
    'SELECT COUNT(*) as count FROM used_templates WHERE template_hash = ?',
    [templateHash]
  );

  return Number(result?.count || 0) > 0;
}

/**
 * التحقق من استخدام القالب في فترة معينة
 */
export async function isTemplateUsedRecently(
  templateHash: string,
  days: number = 30
): Promise<boolean> {
  await initUsedTemplatesTable();

  const isPostgres = isPostgresDatabase();
  const cutoffExpr = isPostgres
    ? `NOW() - (? * INTERVAL '1 day')`
    : `datetime('now', '-' || ? || ' days')`;

  const result = await queryOne<{ count: number | string }>(
    `SELECT COUNT(*) as count FROM used_templates 
     WHERE template_hash = ? AND used_at >= ${cutoffExpr}`,
    [templateHash, days]
  );

  return Number(result?.count || 0) > 0;
}

/**
 * تسجيل قالب كمستخدم
 */
export async function markTemplateAsUsed(params: {
  templateHash: string;
  templateType: 'intro' | 'section' | 'faq' | 'conclusion';
  category?: string;
  articleId?: number;
  topic?: string;
}): Promise<number> {
  await initUsedTemplatesTable();

  const isPostgres = isPostgresDatabase();

  const values = [
    params.templateHash,
    params.templateType,
    params.category || null,
    params.articleId || null,
    params.topic || null,
  ];

  if (isPostgres) {
    const row = await queryOne<{ id: number | string }>(
      `INSERT INTO used_templates (template_hash, template_type, category, article_id, topic)
       VALUES (?, ?, ?, ?, ?) RETURNING id`,
      values
    );
    return Number(row?.id || 0);
  }

  const result = await execute(
    `INSERT INTO used_templates (template_hash, template_type, category, article_id, topic)
     VALUES (?, ?, ?, ?, ?)`,
    values
  );

  return result.lastInsertRowid as number;
}

/**
 * تسجيل عدة قوالب كمستخدمة
 */
export async function markTemplatesAsUsed(
  templates: Array<{
    templateHash: string;
    templateType: 'intro' | 'section' | 'faq' | 'conclusion';
    category?: string;
    articleId?: number;
    topic?: string;
  }>
): Promise<number[]> {
  const ids: number[] = [];

  for (const template of templates) {
    const id = await markTemplateAsUsed(template);
    ids.push(id);
  }

  return ids;
}

/**
 * جلب القوالب المستخدمة
 */
export async function getUsedTemplates(
  options: {
    limit?: number;
    templateType?: 'intro' | 'section' | 'faq' | 'conclusion';
    category?: string;
    articleId?: number;
    days?: number;
  } = {}
): Promise<UsedTemplate[]> {
  await initUsedTemplatesTable();

  const { limit = 100, templateType, category, articleId, days } = options;

  let sql = 'SELECT * FROM used_templates WHERE 1=1';
  const params: any[] = [];

  if (templateType) {
    sql += ' AND template_type = ?';
    params.push(templateType);
  }

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }

  if (articleId) {
    sql += ' AND article_id = ?';
    params.push(articleId);
  }

  if (days) {
    const isPostgres = isPostgresDatabase();
    if (isPostgres) {
      sql += ` AND used_at >= NOW() - (? * INTERVAL '1 day')`;
    } else {
      sql += ` AND used_at >= datetime('now', '-' || ? || ' days')`;
    }
    params.push(days);
  }

  sql += ' ORDER BY used_at DESC LIMIT ?';
  params.push(limit);

  return await query<UsedTemplate>(sql, params);
}

/**
 * جلب جميع hashes القوالب المستخدمة
 */
export async function getAllUsedTemplateHashes(
  options: {
    templateType?: 'intro' | 'section' | 'faq' | 'conclusion';
    category?: string;
    days?: number;
  } = {}
): Promise<Set<string>> {
  await initUsedTemplatesTable();

  let sql = 'SELECT DISTINCT template_hash FROM used_templates WHERE 1=1';
  const params: any[] = [];

  if (options.templateType) {
    sql += ' AND template_type = ?';
    params.push(options.templateType);
  }

  if (options.category) {
    sql += ' AND category = ?';
    params.push(options.category);
  }

  if (options.days) {
    const isPostgres = isPostgresDatabase();
    if (isPostgres) {
      sql += ` AND used_at >= NOW() - (? * INTERVAL '1 day')`;
    } else {
      sql += ` AND used_at >= datetime('now', '-' || ? || ' days')`;
    }
    params.push(options.days);
  }

  const results = await query<{ template_hash: string }>(sql, params);

  return new Set(results.map((r) => r.template_hash));
}

/**
 * حذف قالب من المستخدمة
 */
export async function removeUsedTemplate(
  templateHash: string
): Promise<boolean> {
  await initUsedTemplatesTable();

  const result = await execute(
    'DELETE FROM used_templates WHERE template_hash = ?',
    [templateHash]
  );

  return result.changes > 0;
}

/**
 * حذف القوالب القديمة
 */
export async function cleanOldUsedTemplates(
  daysToKeep: number = 60
): Promise<number> {
  await initUsedTemplatesTable();

  const isPostgres = isPostgresDatabase();
  const cutoffExpr = isPostgres
    ? `NOW() - (? * INTERVAL '1 day')`
    : `datetime('now', '-' || ? || ' days')`;

  const result = await execute(
    `DELETE FROM used_templates WHERE used_at < ${cutoffExpr}`,
    [daysToKeep]
  );

  return result.changes;
}

/**
 * إحصائيات القوالب المستخدمة
 */
export async function getUsedTemplatesStats(): Promise<{
  total: number;
  intros: number;
  sections: number;
  faqs: number;
  conclusions: number;
  byCategory: Record<string, number>;
  last7Days: number;
  last30Days: number;
}> {
  await initUsedTemplatesTable();

  const isPostgres = isPostgresDatabase();
  const days7Expr = isPostgres
    ? `NOW() - (7 * INTERVAL '1 day')`
    : `datetime('now', '-7 days')`;
  const days30Expr = isPostgres
    ? `NOW() - (30 * INTERVAL '1 day')`
    : `datetime('now', '-30 days')`;

  const stats = await queryOne<{
    total: number | string;
    intros: number | string;
    sections: number | string;
    faqs: number | string;
    conclusions: number | string;
  }>(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN template_type = 'intro' THEN 1 ELSE 0 END) as intros,
      SUM(CASE WHEN template_type = 'section' THEN 1 ELSE 0 END) as sections,
      SUM(CASE WHEN template_type = 'faq' THEN 1 ELSE 0 END) as faqs,
      SUM(CASE WHEN template_type = 'conclusion' THEN 1 ELSE 0 END) as conclusions
    FROM used_templates
  `);

  const categoryStats = await query<{
    category: string;
    count: number | string;
  }>(
    `SELECT category, COUNT(*) as count FROM used_templates 
     WHERE category IS NOT NULL GROUP BY category`
  );

  const byCategory: Record<string, number> = {};
  for (const row of categoryStats) {
    byCategory[row.category] = Number(row.count);
  }

  const last7 = await queryOne<{ count: number | string }>(
    `SELECT COUNT(*) as count FROM used_templates WHERE used_at >= ${days7Expr}`
  );

  const last30 = await queryOne<{ count: number | string }>(
    `SELECT COUNT(*) as count FROM used_templates WHERE used_at >= ${days30Expr}`
  );

  return {
    total: Number(stats?.total || 0),
    intros: Number(stats?.intros || 0),
    sections: Number(stats?.sections || 0),
    faqs: Number(stats?.faqs || 0),
    conclusions: Number(stats?.conclusions || 0),
    byCategory,
    last7Days: Number(last7?.count || 0),
    last30Days: Number(last30?.count || 0),
  };
}

/**
 * حساب hash للقالب
 */
export function calculateTemplateHash(template: string): string {
  // إنشاء hash بسيط من أول 100 حرف + طول القالب
  const prefix = template.substring(0, 100).replace(/\s+/g, '');
  const length = template.length;

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < prefix.length; i++) {
    const char = prefix.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return `${Math.abs(hash)}_${length}`;
}

export default {
  initUsedTemplatesTable,
  isTemplateUsed,
  isTemplateUsedRecently,
  markTemplateAsUsed,
  markTemplatesAsUsed,
  getUsedTemplates,
  getAllUsedTemplateHashes,
  removeUsedTemplate,
  cleanOldUsedTemplates,
  getUsedTemplatesStats,
  calculateTemplateHash,
};
