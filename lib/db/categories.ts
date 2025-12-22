/**
 * عمليات التصنيفات - يستخدم قاعدة البيانات الموحدة الموجودة
 * متوافق مع PostgreSQL
 */

import { execute, query, queryOne } from './database';

const ARTICLE_CATEGORIES_TABLE = 'article_categories';

// أنواع البيانات
export interface Category {
  id: number;
  name: string;
  title: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  sort_order: number;
  is_active: number;
  article_count: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryInput {
  name: string;
  title?: string;
  slug?: string;
  description?: string;
  color?: string;
  icon?: string;
  sort_order?: number;
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
}

// توليد slug من الاسم
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\u0621-\u064Aa-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// التأكد من وجود الأعمدة الجديدة
export async function ensureCategoryColumns(): Promise<void> {
  // تجاهل أثناء البناء
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return;
  }
  return;
}

// جلب جميع التصنيفات
export async function getCategories(
  options: {
    includeCount?: boolean;
    parentId?: number | null;
  } = {}
): Promise<Category[]> {
  // تحديد نوع قاعدة البيانات
  const isPostgres =
    !!process.env.POSTGRES_URL ||
    process.env.DATABASE_URL?.startsWith('postgres') ||
    (process.env.VERCEL_URL && process.env.NODE_ENV === 'production');

  // استعلام مختلف حسب نوع قاعدة البيانات
  const articleCountSubquery = isPostgres
    ? `(SELECT COUNT(*) FROM articles a WHERE CAST(NULLIF(a.category_id, '') AS INTEGER) = c.id AND (a.published = true OR a.published = 1 OR CAST(a.published AS TEXT) = '1'))`
    : `(SELECT COUNT(*) FROM articles a WHERE CAST(a.category_id AS INTEGER) = c.id AND a.published = 1)`;

  const sql = `
    SELECT 
      c.id,
      c.name,
      c.name as title,
      COALESCE(c.slug, LOWER(REPLACE(c.name, ' ', '-'))) as slug,
      COALESCE(c.description, '') as description,
      COALESCE(c.color, '#6366f1') as color,
      COALESCE(c.icon, '') as icon,
      COALESCE(c.sort_order, 0) as sort_order,
      1 as is_active,
      c.created_at,
      COALESCE(c.updated_at, c.created_at) as updated_at,
      COALESCE(${articleCountSubquery}, 0) as article_count
    FROM ${ARTICLE_CATEGORIES_TABLE} c
    ORDER BY COALESCE(c.sort_order, 0) ASC, c.name ASC
  `;

  return await query<Category>(sql);
}

// جلب التصنيفات كشجرة (بدون parent_id، نرجع قائمة مسطحة)
export async function getCategoriesTree(): Promise<CategoryTree[]> {
  const categories = await getCategories();
  return categories.map((c) => ({
    ...c,
    children: [],
  }));
}

// جلب تصنيف واحد
export async function getCategoryById(
  id: number
): Promise<Category | undefined> {
  // تحديد نوع قاعدة البيانات
  const isPostgres =
    !!process.env.POSTGRES_URL ||
    process.env.DATABASE_URL?.startsWith('postgres') ||
    (process.env.VERCEL_URL && process.env.NODE_ENV === 'production');

  const articleCountSubquery = isPostgres
    ? `(SELECT COUNT(*) FROM articles a WHERE CAST(NULLIF(a.category_id, '') AS INTEGER) = c.id AND (a.published = true OR a.published = 1 OR CAST(a.published AS TEXT) = '1'))`
    : `(SELECT COUNT(*) FROM articles a WHERE CAST(a.category_id AS INTEGER) = c.id AND a.published = 1)`;

  return await queryOne<Category>(
    `SELECT 
      c.id,
      c.name,
      c.name as title,
      COALESCE(c.slug, LOWER(REPLACE(c.name, ' ', '-'))) as slug,
      COALESCE(c.description, '') as description,
      COALESCE(c.color, '#6366f1') as color,
      COALESCE(c.icon, '') as icon,
      COALESCE(c.sort_order, 0) as sort_order,
      1 as is_active,
      c.created_at,
      COALESCE(c.updated_at, c.created_at) as updated_at,
      COALESCE(${articleCountSubquery}, 0) as article_count
    FROM ${ARTICLE_CATEGORIES_TABLE} c
    WHERE c.id = ?`,
    [id]
  );
}

// جلب تصنيف بالـ slug (نستخدم name)
export async function getCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  // تحديد نوع قاعدة البيانات
  const isPostgres =
    !!process.env.POSTGRES_URL ||
    process.env.DATABASE_URL?.startsWith('postgres') ||
    (process.env.VERCEL_URL && process.env.NODE_ENV === 'production');

  const articleCountSubquery = isPostgres
    ? `(SELECT COUNT(*) FROM articles a WHERE CAST(NULLIF(a.category_id, '') AS INTEGER) = c.id AND (a.published = true OR a.published = 1 OR CAST(a.published AS TEXT) = '1'))`
    : `(SELECT COUNT(*) FROM articles a WHERE CAST(a.category_id AS INTEGER) = c.id AND a.published = 1)`;

  return await queryOne<Category>(
    `SELECT 
      c.id,
      c.name,
      c.name as title,
      COALESCE(c.slug, LOWER(REPLACE(c.name, ' ', '-'))) as slug,
      COALESCE(c.description, '') as description,
      COALESCE(c.color, '#6366f1') as color,
      COALESCE(c.icon, '') as icon,
      COALESCE(c.sort_order, 0) as sort_order,
      1 as is_active,
      c.created_at,
      COALESCE(c.updated_at, c.created_at) as updated_at,
      COALESCE(${articleCountSubquery}, 0) as article_count
    FROM ${ARTICLE_CATEGORIES_TABLE} c
    WHERE LOWER(c.slug) = LOWER(?) OR LOWER(c.name) = LOWER(?)`,
    [slug, slug.replace(/-/g, ' ')]
  );
}

// إنشاء تصنيف جديد
export async function createCategory(input: CategoryInput): Promise<number> {
  const now = new Date().toISOString();

  // الحصول على أعلى sort_order
  const maxOrder = await queryOne<{ max_order: number }>(
    `SELECT MAX(sort_order) as max_order FROM ${ARTICLE_CATEGORIES_TABLE}`
  );
  const sortOrder = input.sort_order ?? (maxOrder?.max_order || 0) + 1;

  try {
    const row = await queryOne<{ id: number }>(
      `INSERT INTO ${ARTICLE_CATEGORIES_TABLE} (
        name, title, description, color, icon, sort_order, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?) RETURNING id`,
      [
        input.name,
        input.title || input.name,
        input.description || '',
        input.color || '#6366f1',
        input.icon || '',
        sortOrder,
        now,
        now,
      ]
    );

    if (row?.id !== undefined) return Number(row.id);
  } catch {
    // تجاهل
  }

  const result = await execute(
    `INSERT INTO ${ARTICLE_CATEGORIES_TABLE} (
      name, title, description, color, icon, sort_order, is_active, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)`,
    [
      input.name,
      input.title || input.name,
      input.description || '',
      input.color || '#6366f1',
      input.icon || '',
      sortOrder,
      now,
      now,
    ]
  );

  return result.lastInsertRowid as number;
}

// تحديث تصنيف
export async function updateCategory(
  id: number,
  input: Partial<CategoryInput>
): Promise<boolean> {
  const category = await getCategoryById(id);
  if (!category) return false;

  const updates: string[] = [];
  const params: any[] = [];

  if (input.name !== undefined) {
    updates.push('name = ?');
    params.push(input.name);
  }
  if (input.title !== undefined) {
    updates.push('title = ?');
    params.push(input.title);
  }
  if (input.description !== undefined) {
    updates.push('description = ?');
    params.push(input.description);
  }
  if (input.color !== undefined) {
    updates.push('color = ?');
    params.push(input.color);
  }
  if (input.icon !== undefined) {
    updates.push('icon = ?');
    params.push(input.icon);
  }
  if (input.sort_order !== undefined) {
    updates.push('sort_order = ?');
    params.push(input.sort_order);
  }

  if (updates.length === 0) return true;

  updates.push('updated_at = ?');
  params.push(new Date().toISOString());
  params.push(id);

  await execute(
    `UPDATE ${ARTICLE_CATEGORIES_TABLE} SET ${updates.join(', ')} WHERE id = ?`,
    params
  );

  return true;
}

// حذف تصنيف
export async function deleteCategory(
  id: number,
  reassignTo?: number
): Promise<boolean> {
  const category = await getCategoryById(id);
  if (!category) return false;

  // نقل المقالات إلى تصنيف آخر إذا تم تحديده
  if (reassignTo) {
    await execute('UPDATE articles SET category_id = ? WHERE category_id = ?', [
      String(reassignTo),
      String(id),
    ]);
  }

  // حذف التصنيف
  await execute(`DELETE FROM ${ARTICLE_CATEGORIES_TABLE} WHERE id = ?`, [id]);

  return true;
}

// إعادة ترتيب التصنيفات
export async function reorderCategories(
  orderedIds: number[]
): Promise<boolean> {
  for (let index = 0; index < orderedIds.length; index++) {
    const id = orderedIds[index];
    await execute(
      `UPDATE ${ARTICLE_CATEGORIES_TABLE} SET sort_order = ? WHERE id = ?`,
      [index, id]
    );
  }
  return true;
}

// تحديث عدد المقالات لجميع التصنيفات (لا حاجة لها - نحسب ديناميكياً)
export async function updateAllArticleCounts(): Promise<void> {
  // لا حاجة - نحسب article_count ديناميكياً في الاستعلامات
  return;
}

// إحصائيات التصنيفات
export async function getCategoryStats(): Promise<{
  total: number;
  withArticles: number;
  empty: number;
}> {
  const stats = await queryOne<{
    total: number;
    withArticles: number;
    empty: number;
  }>(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN (SELECT COUNT(*) FROM articles a WHERE CAST(a.category_id AS INTEGER) = c.id) > 0 THEN 1 ELSE 0 END) as "withArticles",
      SUM(CASE WHEN (SELECT COUNT(*) FROM articles a WHERE CAST(a.category_id AS INTEGER) = c.id) = 0 THEN 1 ELSE 0 END) as empty
    FROM ${ARTICLE_CATEGORIES_TABLE} c
  `);

  return stats || { total: 0, withArticles: 0, empty: 0 };
}

export default {
  getCategories,
  getCategoriesTree,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  updateAllArticleCounts,
  getCategoryStats,
  generateSlug,
  ensureCategoryColumns,
};
