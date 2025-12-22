/**
 * عمليات المقالات - يستخدم قاعدة البيانات الموحدة الموجودة
 * لا ينشئ جداول جديدة - يعمل مع الجداول الموجودة
 */

import { execute, query, queryOne } from './database';

// أنواع البيانات
export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  featured_image?: string;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  category_color?: string;
  published: number;
  featured: number;
  author: string;
  read_time: number;
  views: number;
  meta_description: string;
  meta_keywords: string;
  ai_provider?: string;
  publish_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleInput {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  image?: string;
  featured_image?: string;
  category_id: number;
  published?: number;
  featured?: number;
  author?: string;
  read_time?: number;
  meta_description?: string;
  meta_keywords?: string;
  ai_provider?: string;
  publish_date?: string;
}

// توليد slug من العنوان
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\u0621-\u064Aa-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// التأكد من وجود الأعمدة الجديدة
export async function ensureArticleColumns(): Promise<void> {
  // تجاهل أثناء البناء
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return;
  }

  const isPostgres =
    !!process.env.POSTGRES_URL ||
    process.env.DATABASE_URL?.startsWith('postgres') ||
    (process.env.VERCEL_URL && process.env.NODE_ENV === 'production');

  if (!isPostgres) {
    // SQLite: إضافة الأعمدة إن لم تكن موجودة
    const sqliteAlterStatements = [
      `ALTER TABLE articles ADD COLUMN ai_provider TEXT`,
      `ALTER TABLE articles ADD COLUMN publish_date DATETIME`,
      `ALTER TABLE articles ADD COLUMN featured_image TEXT`,
    ];

    for (const stmt of sqliteAlterStatements) {
      try {
        await execute(stmt);
      } catch {
        // العمود موجود بالفعل
      }
    }

    return;
  }

  // PostgreSQL
  const postgresAlterStatements = [
    `ALTER TABLE articles ADD COLUMN IF NOT EXISTS ai_provider TEXT`,
    `ALTER TABLE articles ADD COLUMN IF NOT EXISTS publish_date TIMESTAMP`,
    `ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_image TEXT`,
  ];

  for (const stmt of postgresAlterStatements) {
    try {
      await execute(stmt);
    } catch {
      // تجاهل
    }
  }
}

// جلب جميع المقالات مع الفلترة
export async function getArticles(
  options: {
    page?: number;
    pageSize?: number;
    status?: 'all' | 'published' | 'draft' | 'scheduled';
    categoryId?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{ articles: Article[]; total: number }> {
  await ensureArticleColumns();

  const {
    page = 1,
    pageSize = 20,
    status = 'all',
    categoryId,
    search,
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = options;

  let whereClause = '1=1';
  const params: any[] = [];

  const isPostgres =
    !!process.env.POSTGRES_URL ||
    process.env.DATABASE_URL?.startsWith('postgres') ||
    (process.env.VERCEL_URL && process.env.NODE_ENV === 'production');

  // فلترة حسب الحالة
  if (status === 'published') {
    whereClause += " AND CAST(a.published AS TEXT) IN ('1', 'true', 't')";
  } else if (status === 'draft') {
    whereClause += " AND CAST(a.published AS TEXT) NOT IN ('1', 'true', 't')";
  } else if (status === 'scheduled') {
    whereClause += isPostgres
      ? ' AND a.publish_date > NOW()'
      : " AND datetime(a.publish_date) > datetime('now')";
  }

  // فلترة حسب التصنيف
  if (categoryId) {
    whereClause += ' AND a.category_id = ?';
    params.push(String(categoryId));
  }

  // البحث
  if (search) {
    whereClause +=
      ' AND (a.title LIKE ? OR a.content LIKE ? OR a.excerpt LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  // عدد المقالات الكلي
  const countResult = await queryOne<{ total: number }>(
    `SELECT COUNT(*) as total FROM articles a WHERE ${whereClause}`,
    params
  );
  const total = countResult?.total || 0;

  // جلب المقالات
  const validSortColumns = [
    'created_at',
    'updated_at',
    'views',
    'title',
    'published',
  ];
  const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
  const order = sortOrder === 'asc' ? 'ASC' : 'DESC';
  const offset = (page - 1) * pageSize;

  const articles = await query<Article>(
    `SELECT 
      a.*,
      c.name as category_name,
      COALESCE(c.slug, LOWER(REPLACE(c.name, ' ', '-'))) as category_slug,
      c.color as category_color
    FROM articles a
    LEFT JOIN article_categories c ON a.category_id = CAST(c.id AS TEXT)
    WHERE ${whereClause}
    ORDER BY a.${sortColumn} ${order}
    LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );

  return { articles, total };
}

// جلب مقال واحد
export async function getArticleById(id: number): Promise<Article | undefined> {
  await ensureArticleColumns();

  return await queryOne<Article>(
    `SELECT 
      a.*,
      c.name as category_name,
      COALESCE(c.slug, LOWER(REPLACE(c.name, ' ', '-'))) as category_slug,
      c.color as category_color
    FROM articles a
    LEFT JOIN article_categories c ON a.category_id = CAST(c.id AS TEXT)
    WHERE a.id = ?`,
    [id]
  );
}

// جلب مقال بالـ slug
export async function getArticleBySlug(
  slug: string
): Promise<Article | undefined> {
  await ensureArticleColumns();

  return await queryOne<Article>(
    `SELECT 
      a.*,
      c.name as category_name,
      COALESCE(c.slug, LOWER(REPLACE(c.name, ' ', '-'))) as category_slug,
      c.color as category_color
    FROM articles a
    LEFT JOIN article_categories c ON a.category_id = CAST(c.id AS TEXT)
    WHERE a.slug = ?`,
    [slug]
  );
}

// إنشاء مقال جديد
export async function createArticle(input: ArticleInput): Promise<number> {
  await ensureArticleColumns();

  const slug = input.slug || generateSlug(input.title);
  const now = new Date().toISOString();

  const result = await execute(
    `INSERT INTO articles (
      title, slug, content, excerpt, image, featured_image, category_id,
      published, featured, author, read_time, views,
      meta_description, meta_keywords, ai_provider, publish_date,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?)`,
    [
      input.title,
      slug,
      input.content,
      input.excerpt || '',
      input.image || '',
      input.featured_image || '',
      input.category_id,
      input.published ?? 0,
      input.featured ?? 0,
      input.author || 'admin',
      input.read_time || Math.ceil(input.content.split(/\s+/).length / 200),
      input.meta_description || '',
      input.meta_keywords || '',
      input.ai_provider || null,
      input.publish_date || null,
      now,
      now,
    ]
  );

  return result.lastInsertRowid as number;
}

// تحديث مقال
export async function updateArticle(
  id: number,
  input: Partial<ArticleInput>
): Promise<boolean> {
  await ensureArticleColumns();

  const article = await getArticleById(id);
  if (!article) return false;

  const updates: string[] = [];
  const params: any[] = [];

  if (input.title !== undefined) {
    updates.push('title = ?');
    params.push(input.title);
  }
  if (input.slug !== undefined) {
    updates.push('slug = ?');
    params.push(input.slug);
  }
  if (input.content !== undefined) {
    updates.push('content = ?');
    params.push(input.content);
    // تحديث وقت القراءة
    updates.push('read_time = ?');
    params.push(Math.ceil(input.content.split(/\s+/).length / 200));
  }
  if (input.excerpt !== undefined) {
    updates.push('excerpt = ?');
    params.push(input.excerpt);
  }
  if (input.image !== undefined) {
    updates.push('image = ?');
    params.push(input.image);
  }
  if (input.featured_image !== undefined) {
    updates.push('featured_image = ?');
    params.push(input.featured_image);
  }
  if (input.category_id !== undefined) {
    updates.push('category_id = ?');
    params.push(input.category_id);
  }
  if (input.published !== undefined) {
    updates.push('published = ?');
    params.push(input.published);
  }
  if (input.featured !== undefined) {
    updates.push('featured = ?');
    params.push(input.featured);
  }
  if (input.meta_description !== undefined) {
    updates.push('meta_description = ?');
    params.push(input.meta_description);
  }
  if (input.meta_keywords !== undefined) {
    updates.push('meta_keywords = ?');
    params.push(input.meta_keywords);
  }
  if (input.ai_provider !== undefined) {
    updates.push('ai_provider = ?');
    params.push(input.ai_provider);
  }
  if (input.publish_date !== undefined) {
    updates.push('publish_date = ?');
    params.push(input.publish_date);
  }
  if (input.author !== undefined) {
    updates.push('author = ?');
    params.push(input.author);
  }

  if (updates.length === 0) return true;

  updates.push('updated_at = ?');
  params.push(new Date().toISOString());
  params.push(id);

  await execute(
    `UPDATE articles SET ${updates.join(', ')} WHERE id = ?`,
    params
  );

  return true;
}

// حذف مقال (soft delete - تغيير الحالة)
export async function deleteArticle(id: number): Promise<boolean> {
  const article = await getArticleById(id);
  if (!article) return false;

  await execute('DELETE FROM articles WHERE id = ?', [id]);

  return true;
}

// زيادة عدد المشاهدات
export async function incrementViews(id: number): Promise<void> {
  await execute('UPDATE articles SET views = views + 1 WHERE id = ?', [id]);
}

// إحصائيات المقالات
export async function getArticleStats(): Promise<{
  total: number;
  published: number;
  draft: number;
  totalViews: number;
}> {
  const stats = await queryOne<{
    total: number;
    published: number;
    draft: number;
    totalViews: number;
  }>(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN CAST(published AS TEXT) IN ('1', 'true', 't') THEN 1 ELSE 0 END) as published,
      SUM(CASE WHEN CAST(published AS TEXT) NOT IN ('1', 'true', 't') THEN 1 ELSE 0 END) as draft,
      SUM(views) as totalViews
    FROM articles
  `);

  return stats || { total: 0, published: 0, draft: 0, totalViews: 0 };
}

export default {
  getArticles,
  getArticleById,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  incrementViews,
  getArticleStats,
  generateSlug,
  ensureArticleColumns,
};
