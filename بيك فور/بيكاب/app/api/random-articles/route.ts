import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/database';

interface Article {
  id: number;
  title: string;
  excerpt: string | null;
  slug: string;
  image: string | null;
  author: string;
  read_time: number;
  created_at: string;
  category_name?: string;
}

/**
 * Random Articles API
 * Feature: comprehensive-tools-enhancement
 * Requirements: 4.1, 4.2, 4.5
 *
 * يدعم جلب مقالات عشوائية مع إمكانية الفلترة حسب:
 * - toolSlug: slug الأداة للبحث في الكلمات المفتاحية
 * - category: تصنيف المقالات
 * - limit: عدد المقالات (افتراضي 6، أقصى 20)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const toolSlug = searchParams.get('toolSlug');
    const category = searchParams.get('category');
    const limit = limitParam ? Math.min(parseInt(limitParam, 10), 20) : 6;

    let articles: Article[] = [];

    // إذا تم تحديد أداة، نبحث عن مقالات مرتبطة
    if (toolSlug || category) {
      // محاولة جلب مقالات مرتبطة بالأداة أو التصنيف
      const searchTerms = toolSlug
        ? toolSlug.replace(/-/g, ' ').split(' ')
        : [];

      if (searchTerms.length > 0 || category) {
        let sql = `
          SELECT a.id, a.title, a.excerpt, a.slug, a.image, a.author, a.read_time, a.created_at,
                 c.name as category_name
          FROM articles a
          LEFT JOIN categories c ON a.category_id = c.id
          WHERE a.published = 1
        `;
        const params: (string | number)[] = [];

        if (category) {
          sql += ` AND c.slug = ?`;
          params.push(category);
        }

        if (searchTerms.length > 0) {
          const searchConditions = searchTerms
            .map(
              () =>
                `(a.title LIKE ? OR a.meta_keywords LIKE ? OR a.excerpt LIKE ?)`
            )
            .join(' OR ');
          sql += ` AND (${searchConditions})`;
          searchTerms.forEach((term) => {
            params.push(`%${term}%`, `%${term}%`, `%${term}%`);
          });
        }

        sql += ` ORDER BY RANDOM() LIMIT ?`;
        params.push(limit);

        articles = query<Article>(sql, params);
      }

      // إذا لم نجد مقالات كافية، نجلب مقالات عامة
      if (articles.length < limit) {
        const remainingCount = limit - articles.length;
        const existingIds = articles.map((a) => a.id);
        const excludeClause =
          existingIds.length > 0
            ? `AND id NOT IN (${existingIds.join(',')})`
            : '';

        const fallbackArticles = query<Article>(
          `SELECT a.id, a.title, a.excerpt, a.slug, a.image, a.author, a.read_time, a.created_at,
                  c.name as category_name
           FROM articles a
           LEFT JOIN categories c ON a.category_id = c.id
           WHERE a.published = 1 ${excludeClause}
           ORDER BY RANDOM() 
           LIMIT ?`,
          [remainingCount]
        );

        articles = [...articles, ...fallbackArticles];
      }
    } else {
      // جلب مقالات عشوائية بدون فلترة
      articles = query<Article>(
        `SELECT a.id, a.title, a.excerpt, a.slug, a.image, a.author, a.read_time, a.created_at,
                c.name as category_name
         FROM articles a
         LEFT JOIN categories c ON a.category_id = c.id
         WHERE a.published = 1 
         ORDER BY RANDOM() 
         LIMIT ?`,
        [limit]
      );
    }

    return NextResponse.json({
      success: true,
      data: articles.map((article) => ({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt || '',
        slug: article.slug,
        image: article.image || '/images/default-article.jpg',
        author: article.author,
        readTime: article.read_time,
        createdAt: article.created_at,
        categoryName: article.category_name || '',
      })),
      total: articles.length,
    });
  } catch (error) {
    console.error('Random Articles API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'حدث خطأ في جلب المقالات',
        },
      },
      { status: 500 }
    );
  }
}
