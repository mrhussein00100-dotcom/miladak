/**
 * عمليات التصنيفات - يستخدم قاعدة البيانات الموحدة الموجودة
 * لا ينشئ جداول جديدة - يعمل مع الجداول الموجودة
 */

import { execute, query, queryOne } from './database';

const ARTICLE_CATEGORIES_TABLE = 'article_categories';

// أنواع البيانات
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  image?: string;
  parent_id: number | null;
  sort_order: number;
  article_count: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryInput {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  icon?: string;
  parent_id?: number | null;
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
  await ensureCategoryColumns();

  const { includeCount = true, parentId } = options;

  let sql = `
    SELECT 
      c.id,
      c.name,
      c.slug,
      COALESCE(c.description, '') as description,
      COALESCE(c.color, '#6366f1') as color,
      COALESCE(c.icon, '') as icon,
      COALESCE(c.image, '') as image,
      c.parent_id,
      COALESCE(c.sort_order, 0) as sort_order,
      c.created_at,
      COALESCE(c.updated_at, c.created_at) as updated_at,
      COALESCE(c.article_count, 0) as article_count
  `;

  sql += ` FROM ${ARTICLE_CATEGORIES_TABLE} c`;

  const params: any[] = [];
  if (parentId !== undefined) {
    if (parentId === null) {
      sql += ` WHERE c.parent_id IS NULL`;
    } else {
      sql += ` WHERE c.parent_id = ?`;
      params.push(parentId);
    }
  }

  sql += ` ORDER BY COALESCE(c.sort_order, 0) ASC, c.name ASC`;

  return await query<Category>(sql, params);
}

// جلب التصنيفات كشجرة
export async function getCategoriesTree(): Promise<CategoryTree[]> {
  const categories = await getCategories();

  const buildTree = (parentId: number | null): CategoryTree[] => {
    return categories
      .filter((c) => c.parent_id === parentId)
      .map((c) => ({
        ...c,
        children: buildTree(c.id),
      }));
  };

  return buildTree(null);
}

// جلب تصنيف واحد
export async function getCategoryById(
  id: number
): Promise<Category | undefined> {
  await ensureCategoryColumns();

  return await queryOne<Category>(
    `SELECT 
      c.*,
      COALESCE(c.article_count, 0) as article_count
    FROM ${ARTICLE_CATEGORIES_TABLE} c
    WHERE c.id = ?`,
    [id]
  );
}

// جلب تصنيف بالـ slug
export async function getCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  await ensureCategoryColumns();

  return await queryOne<Category>(
    `SELECT 
      c.*,
      COALESCE(c.article_count, 0) as article_count
    FROM ${ARTICLE_CATEGORIES_TABLE} c
    WHERE c.slug = ?`,
    [slug]
  );
}

// إنشاء تصنيف جديد
export async function createCategory(input: CategoryInput): Promise<number> {
  await ensureCategoryColumns();

  const slug = input.slug || generateSlug(input.name);
  const now = new Date().toISOString();

  // الحصول على أعلى sort_order
  const maxOrder = await queryOne<{ max_order: number }>(
    `SELECT MAX(sort_order) as max_order FROM ${ARTICLE_CATEGORIES_TABLE}`
  );
  const sortOrder = input.sort_order ?? (maxOrder?.max_order || 0) + 1;

  try {
    const row = await queryOne<{ id: number }>(
      `INSERT INTO ${ARTICLE_CATEGORIES_TABLE} (
        name, slug, description, color, icon, parent_id, sort_order, article_count, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?) RETURNING id`,
      [
        input.name,
        slug,
        input.description || '',
        input.color || '#6366f1',
        input.icon || '',
        input.parent_id || null,
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
      name, slug, description, color, icon, parent_id, sort_order, article_count, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
    [
      input.name,
      slug,
      input.description || '',
      input.color || '#6366f1',
      input.icon || '',
      input.parent_id || null,
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
  await ensureCategoryColumns();

  const category = await getCategoryById(id);
  if (!category) return false;

  const updates: string[] = [];
  const params: any[] = [];

  if (input.name !== undefined) {
    updates.push('name = ?');
    params.push(input.name);
  }
  if (input.slug !== undefined) {
    updates.push('slug = ?');
    params.push(input.slug);
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
  if (input.parent_id !== undefined) {
    updates.push('parent_id = ?');
    params.push(input.parent_id);
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
      reassignTo,
      id,
    ]);
    // تحديث عدد المقالات
    await execute(
      `UPDATE ${ARTICLE_CATEGORIES_TABLE} SET article_count = (
        SELECT COUNT(*) FROM articles WHERE category_id = ?
      ) WHERE id = ?`,
      [reassignTo, reassignTo]
    );
  }

  // نقل التصنيفات الفرعية للمستوى الأعلى
  await execute(
    `UPDATE ${ARTICLE_CATEGORIES_TABLE} SET parent_id = ? WHERE parent_id = ?`,
    [category.parent_id, id]
  );

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

// تحديث عدد المقالات لجميع التصنيفات
export async function updateAllArticleCounts(): Promise<void> {
  await execute(`
    UPDATE ${ARTICLE_CATEGORIES_TABLE} SET article_count = (
      SELECT COUNT(*) FROM articles WHERE articles.category_id = ${ARTICLE_CATEGORIES_TABLE}.id
    )
  `);
}

// إحصائيات التصنيفات
export async function getCategoryStats(): Promise<{
  total: number;
  withArticles: number;
  empty: number;
}> {
  await ensureCategoryColumns();

  const stats = await queryOne<{
    total: number;
    withArticles: number;
    empty: number;
  }>(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN article_count > 0 THEN 1 ELSE 0 END) as withArticles,
      SUM(CASE WHEN article_count = 0 THEN 1 ELSE 0 END) as empty
    FROM ${ARTICLE_CATEGORIES_TABLE}
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
