/**
 * API إدارة المقالات - GET للقائمة، POST للإنشاء
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getArticles,
  createArticle,
  getArticleStats,
  type ArticleInput,
} from '@/lib/db/articles';

// GET - جلب قائمة المقالات مع الفلترة والبحث
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const status =
      (searchParams.get('status') as
        | 'all'
        | 'published'
        | 'draft'
        | 'scheduled') || 'all';
    const categoryId = searchParams.get('categoryId')
      ? parseInt(searchParams.get('categoryId')!)
      : undefined;
    const search = searchParams.get('search') || undefined;
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder =
      (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';
    const includeStats = searchParams.get('includeStats') === 'true';

    const { articles, total } = getArticles({
      page,
      pageSize,
      status,
      categoryId,
      search,
      sortBy,
      sortOrder,
    });

    const totalPages = Math.ceil(total / pageSize);

    const response: any = {
      success: true,
      data: {
        items: articles,
        total,
        page,
        pageSize,
        totalPages,
      },
      meta: {
        sortBy,
        sortOrder,
        hasMore: page < totalPages,
      },
    };

    // إضافة الإحصائيات إذا طُلبت
    if (includeStats) {
      response.stats = getArticleStats();
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في جلب المقالات',
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

// POST - إنشاء مقال جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // التحقق من الحقول المطلوبة
    if (!body.title || !body.content || !body.category_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'الحقول المطلوبة: title, content, category_id',
        },
        { status: 400 }
      );
    }

    const input: ArticleInput = {
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt,
      image: body.image,
      category_id: body.category_id,
      published: body.published ?? 0,
      featured: body.featured ?? 0,
      author: body.author || 'admin',
      read_time: body.read_time,
      meta_description: body.meta_description,
      meta_keywords: body.meta_keywords,
      ai_provider: body.ai_provider,
      publish_date: body.publish_date,
    };

    const articleId = createArticle(input);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: articleId,
          message: 'تم إنشاء المقال بنجاح',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating article:', error);

    // التحقق من خطأ التكرار
    if (String(error).includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        {
          success: false,
          error: 'يوجد مقال بنفس الـ slug',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'فشل في إنشاء المقال',
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
