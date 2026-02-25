import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || 'birth-date-personality-secrets';

  try {
    // Test 1: Simple query
    const simpleResult = await queryOne<any>(
      `SELECT id, title, slug, published FROM articles WHERE slug = ?`,
      [slug]
    );

    // Test 2: Query with join
    const joinResult = await queryOne<any>(
      `SELECT a.id, a.title, a.slug, a.published, c.name as category_name
       FROM articles a
       LEFT JOIN article_categories c ON CAST(a.category_id AS INTEGER) = c.id
       WHERE a.slug = ?`,
      [slug]
    );

    // Test 3: Get all slugs
    const allSlugs = await query<any>(`SELECT slug FROM articles LIMIT 10`);

    return NextResponse.json({
      success: true,
      slug,
      simpleResult,
      joinResult,
      allSlugs: allSlugs.map((a) => a.slug),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
