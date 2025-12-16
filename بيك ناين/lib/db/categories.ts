/**
 * عمليات التصنيفات - يستخدم قاعدة البيانات الموحدة الموجودة
 * لا ينشئ جداول جديدة - يعمل مع الجداول الموجودة
 */

import {
  queryAll,
  queryOne,
  execute,
  getUnifiedDatabase,
} from './unified-database';

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
export function ensureCategoryColumns(): void {
  const db = getUnifiedDatabase();

  // إضافة عمود icon إذا لم يكن موجوداً
  try {
    db.exec(`ALTER TABLE categories ADD COLUMN icon TEXT DEFAULT ''`);
  } catch (e) {
    // العمود موجود بالفعل
  }

  // إضافة عمود parent_id إذا لم يكن موجوداً
  try {
    db.exec(
      `ALTER TABLE categories ADD COLUMN parent_id INTEGER REFERENCES categories(id)`
    );
  } catch (e) {
    // العمود موجود بالفعل
  }

  // إضافة عمود sort_order إذا لم يكن موجوداً
  try {
    db.exec(`ALTER TABLE categories ADD COLUMN sort_order INTEGER DEFAULT 0`);
  } catch (e) {
    // العمود موجود بالفعل
  }

  // إضافة عمود article_count إذا لم يكن موجوداً
  try {
    db.exec(
      `ALTER TABLE categories ADD COLUMN article_count INTEGER DEFAULT 0`
    );
  } catch (e) {
    // العمود موجود بالفعل
  }
}

// جلب جميع التصنيفات
export function getCategories(
  options: {
    includeCount?: boolean;
    parentId?: number | null;
  } = {}
): Category[] {
  ensureCategoryColumns();

  const { includeCount = true, parentId } = options;

  let query = `
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

  query += ` FROM categories c`;

  const params: any[] = [];
  if (parentId !== undefined) {
    if (parentId === null) {
      query += ` WHERE c.parent_id IS NULL`;
    } else {
      query += ` WHERE c.parent_id = ?`;
      params.push(parentId);
    }
  }

  query += ` ORDER BY COALESCE(c.sort_order, 0) ASC, c.name ASC`;

  return queryAll<Category>(query, params);
}

// جلب التصنيفات كشجرة
export function getCategoriesTree(): CategoryTree[] {
  const categories = getCategories();

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
export function getCategoryById(id: number): Category | undefined {
  ensureCategoryColumns();

  return queryOne<Category>(
    `SELECT 
      c.*,
      COALESCE(c.article_count, 0) as article_count
    FROM categories c
    WHERE c.id = ?`,
    [id]
  );
}

// جلب تصنيف بالـ slug
export function getCategoryBySlug(slug: string): Category | undefined {
  ensureCategoryColumns();

  return queryOne<Category>(
    `SELECT 
      c.*,
      COALESCE(c.article_count, 0) as article_count
    FROM categories c
    WHERE c.slug = ?`,
    [slug]
  );
}

// إنشاء تصنيف جديد
export function createCategory(input: CategoryInput): number {
  ensureCategoryColumns();

  const slug = input.slug || generateSlug(input.name);
  const now = new Date().toISOString();

  // الحصول على أعلى sort_order
  const maxOrder = queryOne<{ max_order: number }>(
    'SELECT MAX(sort_order) as max_order FROM categories'
  );
  const sortOrder = input.sort_order ?? (maxOrder?.max_order || 0) + 1;

  const result = execute(
    `INSERT INTO categories (
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
export function updateCategory(
  id: number,
  input: Partial<CategoryInput>
): boolean {
  ensureCategoryColumns();

  const category = getCategoryById(id);
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

  execute(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`, params);

  return true;
}

// حذف تصنيف
export function deleteCategory(id: number, reassignTo?: number): boolean {
  const category = getCategoryById(id);
  if (!category) return false;

  // نقل المقالات إلى تصنيف آخر إذا تم تحديده
  if (reassignTo) {
    execute('UPDATE articles SET category_id = ? WHERE category_id = ?', [
      reassignTo,
      id,
    ]);
    // تحديث عدد المقالات
    execute(
      `UPDATE categories SET article_count = (
        SELECT COUNT(*) FROM articles WHERE category_id = ?
      ) WHERE id = ?`,
      [reassignTo, reassignTo]
    );
  }

  // نقل التصنيفات الفرعية للمستوى الأعلى
  execute('UPDATE categories SET parent_id = ? WHERE parent_id = ?', [
    category.parent_id,
    id,
  ]);

  // حذف التصنيف
  execute('DELETE FROM categories WHERE id = ?', [id]);

  return true;
}

// إعادة ترتيب التصنيفات
export function reorderCategories(orderedIds: number[]): boolean {
  orderedIds.forEach((id, index) => {
    execute('UPDATE categories SET sort_order = ? WHERE id = ?', [index, id]);
  });
  return true;
}

// تحديث عدد المقالات لجميع التصنيفات
export function updateAllArticleCounts(): void {
  execute(`
    UPDATE categories SET article_count = (
      SELECT COUNT(*) FROM articles WHERE articles.category_id = categories.id
    )
  `);
}

// إحصائيات التصنيفات
export function getCategoryStats(): {
  total: number;
  withArticles: number;
  empty: number;
} {
  ensureCategoryColumns();

  const stats = queryOne<{
    total: number;
    withArticles: number;
    empty: number;
  }>(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN article_count > 0 THEN 1 ELSE 0 END) as withArticles,
      SUM(CASE WHEN article_count = 0 THEN 1 ELSE 0 END) as empty
    FROM categories
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
