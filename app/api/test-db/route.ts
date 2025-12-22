import { NextResponse } from 'next/server';
import { query } from '@/lib/db/database';

export async function GET() {
  try {
    // فحص هيكل جدول tools
    const toolsColumns = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'tools'
      ORDER BY ordinal_position
    `);

    // فحص هيكل جدول tool_categories
    const categoriesColumns = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'tool_categories'
      ORDER BY ordinal_position
    `);

    // فحص هيكل جدول articles
    const articlesColumns = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'articles'
      ORDER BY ordinal_position
    `);

    // فحص هيكل جدول article_categories
    const articleCategoriesColumns = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'article_categories'
      ORDER BY ordinal_position
    `);

    // اختبار استعلام التصنيفات
    let categoriesTest = null;
    let categoriesError = null;
    let categoriesCount = 0;
    try {
      const countResult = await query<{ count: number }>(
        `SELECT COUNT(*) as count FROM article_categories`
      );
      categoriesCount = countResult[0]?.count || 0;

      categoriesTest = await query(`
        SELECT 
          c.id,
          c.name,
          c.name as title,
          COALESCE(c.slug, LOWER(REPLACE(c.name, ' ', '-'))) as slug,
          COALESCE(c.description, '') as description,
          COALESCE(c.color, '#6366f1') as color
        FROM article_categories c
        LIMIT 5
      `);
    } catch (e: any) {
      categoriesError = e.message;
    }

    // اختبار استعلام المقالات
    let articlesTest = null;
    let articlesError = null;
    let articlesCount = 0;
    let sampleCategoryId = null;
    try {
      const countResult = await query<{ count: number }>(
        `SELECT COUNT(*) as count FROM articles`
      );
      articlesCount = countResult[0]?.count || 0;

      // جلب category_id من أول مقال
      const sampleArticle = await query<{ category_id: string }>(
        `SELECT category_id FROM articles LIMIT 1`
      );
      sampleCategoryId = sampleArticle[0]?.category_id;

      articlesTest = await query(`
        SELECT 
          a.id,
          a.title,
          a.slug,
          a.category_id,
          c.name as category_name
        FROM articles a
        LEFT JOIN article_categories c ON a.category_id = CAST(c.id AS TEXT)
        LIMIT 5
      `);
    } catch (e: any) {
      articlesError = e.message;
    }

    return NextResponse.json({
      success: true,
      toolsColumns,
      categoriesColumns,
      articlesColumns,
      articleCategoriesColumns,
      categoriesCount,
      categoriesTest,
      categoriesError,
      articlesCount,
      sampleCategoryId,
      articlesTest,
      articlesError,
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
