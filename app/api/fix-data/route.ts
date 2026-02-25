import { NextResponse } from 'next/server';
import { execute, query } from '@/lib/db/database';

export async function GET() {
  try {
    const results: string[] = [];

    // 1. إضافة التصنيفات الافتراضية إذا كان الجدول فارغاً
    const categoriesCount = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM article_categories`
    );

    if (Number(categoriesCount[0]?.count) === 0) {
      results.push('Adding default categories...');

      const defaultCategories = [
        {
          name: 'صحة ولياقة',
          slug: 'health-fitness',
          color: '#10B981',
          description: 'مقالات عن الصحة واللياقة البدنية',
        },
        {
          name: 'تقنية',
          slug: 'technology',
          color: '#3B82F6',
          description: 'مقالات تقنية وتكنولوجيا',
        },
        {
          name: 'أسلوب حياة',
          slug: 'lifestyle',
          color: '#8B5CF6',
          description: 'مقالات عن أسلوب الحياة',
        },
        {
          name: 'تعليم',
          slug: 'education',
          color: '#F59E0B',
          description: 'مقالات تعليمية',
        },
        {
          name: 'ترفيه',
          slug: 'entertainment',
          color: '#EC4899',
          description: 'مقالات ترفيهية',
        },
        {
          name: 'عام',
          slug: 'general',
          color: '#6B7280',
          description: 'مقالات عامة',
        },
      ];

      for (const cat of defaultCategories) {
        try {
          await execute(
            `INSERT INTO article_categories (name, slug, description, color, sort_order, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              cat.name,
              cat.slug,
              cat.description,
              cat.color,
              defaultCategories.indexOf(cat),
            ]
          );
          results.push(`Added category: ${cat.name}`);
        } catch (e: any) {
          results.push(`Error adding ${cat.name}: ${e.message}`);
        }
      }
    } else {
      results.push(`Categories already exist: ${categoriesCount[0]?.count}`);
    }

    // 2. تحديث المقالات التي ليس لديها category_id
    const articlesWithoutCategory = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM articles WHERE category_id IS NULL OR category_id = ''`
    );

    if (Number(articlesWithoutCategory[0]?.count) > 0) {
      results.push(
        `Found ${articlesWithoutCategory[0]?.count} articles without category`
      );

      // جلب أول تصنيف
      const firstCategory = await query<{ id: number }>(
        `SELECT id FROM article_categories ORDER BY id LIMIT 1`
      );

      if (firstCategory[0]?.id) {
        await execute(
          `UPDATE articles SET category_id = ? WHERE category_id IS NULL OR category_id = ''`,
          [String(firstCategory[0].id)]
        );
        results.push(
          `Updated articles with category_id: ${firstCategory[0].id}`
        );
      }
    } else {
      results.push('All articles have category_id');
    }

    // 3. التحقق من النتائج
    const finalCategoriesCount = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM article_categories`
    );
    const finalArticlesWithCategory = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM articles WHERE category_id IS NOT NULL AND category_id != ''`
    );

    return NextResponse.json({
      success: true,
      results,
      finalStats: {
        categoriesCount: finalCategoriesCount[0]?.count,
        articlesWithCategory: finalArticlesWithCategory[0]?.count,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
