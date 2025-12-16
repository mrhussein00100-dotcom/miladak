/**
 * عمليات المقالات - يستخدم قاعدة البيانات الموحدة الموجودة
 * لا ينشئ جداول جديدة - يعمل مع الجداول الموجودة
 */

import {
  queryAll,
  queryOne,
  execute,
  getUnifiedDatabase,
} from './unified-database';

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
export function ensureArticleColumns(): void {
  const db = getUnifiedDatabase();

  // إضافة عمود ai_provider إذا لم يكن موجوداً
  try {
    db.exec(`ALTER TABLE articles ADD COLUMN ai_provider TEXT`);
  } catch (e) {
    // العمود موجود بالفعل
  }

  // إضافة عمود publish_date إذا لم يكن موجوداً
  try {
    db.exec(`ALTER TABLE articles ADD COLUMN publish_date DATETIME`);
  } catch (e) {
    // العمود موجود بالفعل
  }

  // إضافة عمود featured_image إذا لم يكن موجوداً
  try {
    db.exec(`ALTER TABLE articles ADD COLUMN featured_image TEXT`);
  } catch (e) {
    // العمود موجود بالفعل
  }
}

// جلب جميع المقالات مع الفلترة
export function getArticles(
  options: {
    page?: number;
    pageSize?: number;
    status?: 'all' | 'published' | 'draft' | 'scheduled';
    categoryId?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): { articles: Article[]; total: number } {
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

  // فلترة حسب الحالة
  if (status === 'published') {
    whereClause += ' AND a.published = 1';
  } else if (status === 'draft') {
    whereClause += ' AND a.published = 0';
  } else if (status === 'scheduled') {
    whereClause += ' AND a.publish_date > datetime("now")';
  }

  // فلترة حسب التصنيف
  if (categoryId) {
    whereClause += ' AND a.category_id = ?';
    params.push(categoryId);
  }

  // البحث
  if (search) {
    whereClause +=
      ' AND (a.title LIKE ? OR a.content LIKE ? OR a.excerpt LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  // عدد المقالات الكلي
  const countResult = queryOne<{ total: number }>(
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

  const articles = queryAll<Article>(
    `SELECT 
      a.*,
      c.name as category_name,
      c.slug as category_slug,
      c.color as category_color
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE ${whereClause}
    ORDER BY a.${sortColumn} ${order}
    LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );

  return { articles, total };
}

// جلب مقال واحد
export function getArticleById(id: number): Article | undefined {
  return queryOne<Article>(
    `SELECT 
      a.*,
      c.name as category_name,
      c.slug as category_slug,
      c.color as category_color
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.id = ?`,
    [id]
  );
}

// جلب مقال بالـ slug
export function getArticleBySlug(slug: string): Article | undefined {
  return queryOne<Article>(
    `SELECT 
      a.*,
      c.name as category_name,
      c.slug as category_slug,
      c.color as category_color
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.slug = ?`,
    [slug]
  );
}

// إنشاء مقال جديد
export function createArticle(input: ArticleInput): number {
  ensureArticleColumns();

  const slug = input.slug || generateSlug(input.title);
  const now = new Date().toISOString();

  const result = execute(
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

  // تحديث عدد المقالات في التصنيف
  execute(
    `UPDATE categories SET article_count = (
      SELECT COUNT(*) FROM articles WHERE category_id = ?
    ) WHERE id = ?`,
    [input.category_id, input.category_id]
  );

  return result.lastInsertRowid as number;
}

// تحديث مقال
export function updateArticle(
  id: number,
  input: Partial<ArticleInput>
): boolean {
  ensureArticleColumns();

  const article = getArticleById(id);
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

  execute(`UPDATE articles SET ${updates.join(', ')} WHERE id = ?`, params);

  // تحديث عدد المقالات في التصنيفات
  if (
    input.category_id !== undefined &&
    input.category_id !== article.category_id
  ) {
    execute(
      `UPDATE categories SET article_count = (
        SELECT COUNT(*) FROM articles WHERE category_id = categories.id
      ) WHERE id IN (?, ?)`,
      [article.category_id, input.category_id]
    );
  }

  return true;
}

// حذف مقال (soft delete - تغيير الحالة)
export function deleteArticle(id: number): boolean {
  const article = getArticleById(id);
  if (!article) return false;

  execute('DELETE FROM articles WHERE id = ?', [id]);

  // تحديث عدد المقالات في التصنيف
  execute(
    `UPDATE categories SET article_count = (
      SELECT COUNT(*) FROM articles WHERE category_id = ?
    ) WHERE id = ?`,
    [article.category_id, article.category_id]
  );

  return true;
}

// زيادة عدد المشاهدات
export function incrementViews(id: number): void {
  execute('UPDATE articles SET views = views + 1 WHERE id = ?', [id]);
}

// إحصائيات المقالات
export function getArticleStats(): {
  total: number;
  published: number;
  draft: number;
  totalViews: number;
} {
  const stats = queryOne<{
    total: number;
    published: number;
    draft: number;
    totalViews: number;
  }>(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN published = 1 THEN 1 ELSE 0 END) as published,
      SUM(CASE WHEN published = 0 THEN 1 ELSE 0 END) as draft,
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
