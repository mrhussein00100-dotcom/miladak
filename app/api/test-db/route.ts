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
    try {
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
    try {
      articlesTest = await query(`
        SELECT 
          a.id,
          a.title,
          a.slug,
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
      categoriesTest,
      categoriesError,
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
