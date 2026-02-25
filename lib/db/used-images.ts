/**
 * عمليات تتبع الصور المستخدمة
 * يمنع تكرار الصور من مقال لآخر
 */

import { execute, query, queryOne } from './database';

export interface UsedImage {
  id: number;
  image_id: string;
  image_url: string;
  image_hash: string | null;
  photographer: string | null;
  provider: 'pexels' | 'unsplash';
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

let usedImagesTableInitialized = false;

/**
 * إنشاء جدول الصور المستخدمة
 */
export async function initUsedImagesTable(): Promise<void> {
  if (usedImagesTableInitialized) return;

  const isPostgres = isPostgresDatabase();

  if (isPostgres) {
    await execute(`
      CREATE TABLE IF NOT EXISTS used_images (
        id SERIAL PRIMARY KEY,
        image_id TEXT NOT NULL,
        image_url TEXT NOT NULL,
        image_hash TEXT,
        photographer TEXT,
        provider TEXT DEFAULT 'pexels',
        article_id INTEGER,
        topic TEXT,
        used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // إنشاء الفهارس
    await execute(
      `CREATE INDEX IF NOT EXISTS idx_used_images_image_id ON used_images(image_id)`
    );
    await execute(
      `CREATE INDEX IF NOT EXISTS idx_used_images_image_hash ON used_images(image_hash)`
    );
    await execute(
      `CREATE INDEX IF NOT EXISTS idx_used_images_photographer ON used_images(photographer)`
    );
    await execute(
      `CREATE INDEX IF NOT EXISTS idx_used_images_provider ON used_images(provider)`
    );
  } else {
    await execute(`
      CREATE TABLE IF NOT EXISTS used_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_id TEXT NOT NULL,
        image_url TEXT NOT NULL,
        image_hash TEXT,
        photographer TEXT,
        provider TEXT DEFAULT 'pexels',
        article_id INTEGER,
        topic TEXT,
        used_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // إنشاء الفهارس
    await execute(
      `CREATE INDEX IF NOT EXISTS idx_used_images_image_id ON used_images(image_id)`
    );
    await execute(
      `CREATE INDEX IF NOT EXISTS idx_used_images_image_hash ON used_images(image_hash)`
    );
    await execute(
      `CREATE INDEX IF NOT EXISTS idx_used_images_photographer ON used_images(photographer)`
    );
    await execute(
      `CREATE INDEX IF NOT EXISTS idx_used_images_provider ON used_images(provider)`
    );
  }

  usedImagesTableInitialized = true;
  console.log('✅ [UsedImages] تم إنشاء جدول الصور المستخدمة');
}

/**
 * التحقق مما إذا كانت الصورة مستخدمة
 */
export async function isImageUsed(imageId: string): Promise<boolean> {
  await initUsedImagesTable();

  const result = await queryOne<{ count: number | string }>(
    'SELECT COUNT(*) as count FROM used_images WHERE image_id = ?',
    [imageId]
  );

  return Number(result?.count || 0) > 0;
}

/**
 * التحقق من استخدام الصورة بعدة طرق (ID, URL, hash, photographer)
 */
export async function isImageUsedStrict(params: {
  imageId?: string;
  imageUrl?: string;
  imageHash?: string;
  photographer?: string;
}): Promise<boolean> {
  await initUsedImagesTable();

  const conditions: string[] = [];
  const values: any[] = [];

  if (params.imageId) {
    conditions.push('image_id = ?');
    values.push(params.imageId);
  }

  if (params.imageUrl) {
    conditions.push('image_url = ?');
    values.push(params.imageUrl);
  }

  if (params.imageHash) {
    conditions.push('image_hash = ?');
    values.push(params.imageHash);
  }

  if (params.photographer) {
    conditions.push('LOWER(photographer) = LOWER(?)');
    values.push(params.photographer);
  }

  if (conditions.length === 0) return false;

  const result = await queryOne<{ count: number | string }>(
    `SELECT COUNT(*) as count FROM used_images WHERE ${conditions.join(
      ' OR '
    )}`,
    values
  );

  return Number(result?.count || 0) > 0;
}

/**
 * تسجيل صورة كمستخدمة
 */
export async function markImageAsUsed(params: {
  imageId: string;
  imageUrl: string;
  imageHash?: string;
  photographer?: string;
  provider?: 'pexels' | 'unsplash';
  articleId?: number;
  topic?: string;
}): Promise<number> {
  await initUsedImagesTable();

  const isPostgres = isPostgresDatabase();

  const values = [
    params.imageId,
    params.imageUrl,
    params.imageHash || null,
    params.photographer || null,
    params.provider || 'pexels',
    params.articleId || null,
    params.topic || null,
  ];

  if (isPostgres) {
    const row = await queryOne<{ id: number | string }>(
      `INSERT INTO used_images (image_id, image_url, image_hash, photographer, provider, article_id, topic)
       VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id`,
      values
    );
    return Number(row?.id || 0);
  }

  const result = await execute(
    `INSERT INTO used_images (image_id, image_url, image_hash, photographer, provider, article_id, topic)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    values
  );

  return result.lastInsertRowid as number;
}

/**
 * تسجيل عدة صور كمستخدمة
 */
export async function markImagesAsUsed(
  images: Array<{
    imageId: string;
    imageUrl: string;
    imageHash?: string;
    photographer?: string;
    provider?: 'pexels' | 'unsplash';
    articleId?: number;
    topic?: string;
  }>
): Promise<number[]> {
  const ids: number[] = [];

  for (const image of images) {
    const id = await markImageAsUsed(image);
    ids.push(id);
  }

  return ids;
}

/**
 * جلب الصور المستخدمة
 */
export async function getUsedImages(
  options: {
    limit?: number;
    provider?: 'pexels' | 'unsplash';
    articleId?: number;
    days?: number;
  } = {}
): Promise<UsedImage[]> {
  await initUsedImagesTable();

  const { limit = 100, provider, articleId, days } = options;

  let sql = 'SELECT * FROM used_images WHERE 1=1';
  const params: any[] = [];

  if (provider) {
    sql += ' AND provider = ?';
    params.push(provider);
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

  return await query<UsedImage>(sql, params);
}

/**
 * جلب جميع معرفات الصور المستخدمة
 */
export async function getAllUsedImageIds(): Promise<Set<string>> {
  await initUsedImagesTable();

  const results = await query<{ image_id: string }>(
    'SELECT DISTINCT image_id FROM used_images'
  );

  return new Set(results.map((r) => r.image_id));
}

/**
 * جلب جميع URLs الصور المستخدمة
 */
export async function getAllUsedImageUrls(): Promise<Set<string>> {
  await initUsedImagesTable();

  const results = await query<{ image_url: string }>(
    'SELECT DISTINCT image_url FROM used_images'
  );

  return new Set(results.map((r) => r.image_url));
}

/**
 * جلب جميع المصورين المستخدمين
 */
export async function getAllUsedPhotographers(): Promise<Set<string>> {
  await initUsedImagesTable();

  const results = await query<{ photographer: string }>(
    'SELECT DISTINCT LOWER(photographer) as photographer FROM used_images WHERE photographer IS NOT NULL'
  );

  return new Set(results.map((r) => r.photographer));
}

/**
 * حذف صورة من المستخدمة
 */
export async function removeUsedImage(imageId: string): Promise<boolean> {
  await initUsedImagesTable();

  const result = await execute('DELETE FROM used_images WHERE image_id = ?', [
    imageId,
  ]);

  return result.changes > 0;
}

/**
 * حذف الصور القديمة
 */
export async function cleanOldUsedImages(
  daysToKeep: number = 90
): Promise<number> {
  await initUsedImagesTable();

  const isPostgres = isPostgresDatabase();
  const cutoffExpr = isPostgres
    ? `NOW() - (? * INTERVAL '1 day')`
    : `datetime('now', '-' || ? || ' days')`;

  const result = await execute(
    `DELETE FROM used_images WHERE used_at < ${cutoffExpr}`,
    [daysToKeep]
  );

  return result.changes;
}

/**
 * إحصائيات الصور المستخدمة
 */
export async function getUsedImagesStats(): Promise<{
  total: number;
  pexels: number;
  unsplash: number;
  uniquePhotographers: number;
  last7Days: number;
  last30Days: number;
}> {
  await initUsedImagesTable();

  const isPostgres = isPostgresDatabase();
  const days7Expr = isPostgres
    ? `NOW() - (7 * INTERVAL '1 day')`
    : `datetime('now', '-7 days')`;
  const days30Expr = isPostgres
    ? `NOW() - (30 * INTERVAL '1 day')`
    : `datetime('now', '-30 days')`;

  const stats = await queryOne<{
    total: number | string;
    pexels: number | string;
    unsplash: number | string;
    uniquePhotographers: number | string;
  }>(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN provider = 'pexels' THEN 1 ELSE 0 END) as pexels,
      SUM(CASE WHEN provider = 'unsplash' THEN 1 ELSE 0 END) as unsplash,
      COUNT(DISTINCT photographer) as uniquePhotographers
    FROM used_images
  `);

  const last7 = await queryOne<{ count: number | string }>(
    `SELECT COUNT(*) as count FROM used_images WHERE used_at >= ${days7Expr}`
  );

  const last30 = await queryOne<{ count: number | string }>(
    `SELECT COUNT(*) as count FROM used_images WHERE used_at >= ${days30Expr}`
  );

  return {
    total: Number(stats?.total || 0),
    pexels: Number(stats?.pexels || 0),
    unsplash: Number(stats?.unsplash || 0),
    uniquePhotographers: Number(stats?.uniquePhotographers || 0),
    last7Days: Number(last7?.count || 0),
    last30Days: Number(last30?.count || 0),
  };
}

/**
 * حساب hash للصورة من URL
 */
export function calculateImageHash(url: string, photographer?: string): string {
  // استخراج اسم الملف من URL
  const filename = url.split('/').pop()?.split('?')[0] || '';
  const photographerKey = (photographer || '').toLowerCase().trim();

  // إنشاء hash بسيط
  return `${photographerKey}_${filename}`;
}

export default {
  initUsedImagesTable,
  isImageUsed,
  isImageUsedStrict,
  markImageAsUsed,
  markImagesAsUsed,
  getUsedImages,
  getAllUsedImageIds,
  getAllUsedImageUrls,
  getAllUsedPhotographers,
  removeUsedImage,
  cleanOldUsedImages,
  getUsedImagesStats,
  calculateImageHash,
};
