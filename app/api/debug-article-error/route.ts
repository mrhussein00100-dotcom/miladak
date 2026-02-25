import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db/database';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL ? 'true' : 'false',
      VERCEL_URL: process.env.VERCEL_URL || 'not set',
      DATABASE_URL: process.env.DATABASE_URL ? 'set (hidden)' : 'not set',
      POSTGRES_URL: process.env.POSTGRES_URL ? 'set (hidden)' : 'not set',
    },
    database: {
      connected: false,
      type: 'unknown',
      error: null,
    },
    articles: {
      total: 0,
      published: 0,
      sample: [],
    },
    specificArticle: null,
  };

  try {
    // Test database connection
    const testResult = await queryOne<{ now: Date }>('SELECT NOW() as now');
    diagnostics.database.connected = !!testResult;
    diagnostics.database.type =
      process.env.POSTGRES_URL ||
      process.env.DATABASE_URL?.startsWith('postgres')
        ? 'PostgreSQL'
        : 'SQLite';

    // Count articles
    const countResult = await queryOne<{ total: number }>(
      'SELECT COUNT(*) as total FROM articles'
    );
    diagnostics.articles.total = countResult?.total || 0;

    // Count published articles
    const publishedResult = await queryOne<{ count: number }>(
      "SELECT COUNT(*) as count FROM articles WHERE CAST(published AS TEXT) IN ('1', 'true')"
    );
    diagnostics.articles.published = publishedResult?.count || 0;

    // Get sample articles
    const sampleArticles = await query<{
      id: number;
      slug: string;
      title: string;
      published: any;
    }>('SELECT id, slug, title, published FROM articles LIMIT 5');
    diagnostics.articles.sample = sampleArticles.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title?.substring(0, 50) + '...',
      published: a.published,
      publishedType: typeof a.published,
    }));

    // If slug provided, check specific article
    if (slug) {
      const decodedSlug = decodeURIComponent(slug);

      // Try exact match
      let article = await queryOne<any>(
        'SELECT id, slug, title, published, category_id FROM articles WHERE slug = ?',
        [decodedSlug]
      );

      if (!article) {
        // Try LIKE match
        const likeResults = await query<any>(
          'SELECT id, slug, title, published FROM articles WHERE slug LIKE ?',
          [`%${decodedSlug.substring(0, 20)}%`]
        );

        diagnostics.specificArticle = {
          searchedSlug: decodedSlug,
          exactMatch: false,
          likeMatches: likeResults.length,
          likeResults: likeResults.slice(0, 3).map((a) => ({
            id: a.id,
            slug: a.slug,
            title: a.title?.substring(0, 50),
          })),
        };
      } else {
        const pubValue = String(article.published);
        const isPublished = pubValue === '1' || pubValue === 'true';

        diagnostics.specificArticle = {
          searchedSlug: decodedSlug,
          exactMatch: true,
          found: true,
          id: article.id,
          slug: article.slug,
          title: article.title?.substring(0, 50),
          published: article.published,
          publishedType: typeof article.published,
          isPublished: isPublished,
          wouldShow: isPublished,
        };
      }
    }
  } catch (error: any) {
    diagnostics.database.error = error.message;
    diagnostics.database.stack = error.stack?.split('\n').slice(0, 5);
  }

  return NextResponse.json(diagnostics, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
