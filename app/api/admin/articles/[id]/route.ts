/**
 * API المقال الفردي - GET, PUT, DELETE
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getArticleById,
  updateArticle,
  deleteArticle,
  type ArticleInput,
} from '@/lib/db/articles';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - جلب مقال واحد
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const articleId = parseInt(id);

    if (isNaN(articleId)) {
      return NextResponse.json(
        { success: false, error: 'معرف المقال غير صالح' },
        { status: 400 }
      );
    }

    const article = await getArticleById(articleId);

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'المقال غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في جلب المقال',
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

// PUT - تحديث مقال
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const articleId = parseInt(id);

    if (isNaN(articleId)) {
      return NextResponse.json(
        { success: false, error: 'معرف المقال غير صالح' },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { success: false, error: 'خطأ في تنسيق البيانات المرسلة' },
        { status: 400 }
      );
    }

    // التحقق من حجم المحتوى
    const contentSize = body.content ? body.content.length : 0;
    console.log(
      `[Article Update] ID: ${articleId}, Content size: ${contentSize} chars`
    );

    // تحذير إذا كان المحتوى كبير جداً
    if (contentSize > 5000000) {
      // 5MB
      console.warn(`[Article Update] Content too large: ${contentSize} chars`);
      return NextResponse.json(
        {
          success: false,
          error: 'حجم المحتوى كبير جداً. يرجى تقليل عدد الصور أو حجم المحتوى.',
        },
        { status: 413 }
      );
    }

    const input: Partial<ArticleInput> = {};

    if (body.title !== undefined) input.title = body.title;
    if (body.slug !== undefined) input.slug = body.slug;
    if (body.content !== undefined) input.content = body.content;
    if (body.excerpt !== undefined) input.excerpt = body.excerpt;
    if (body.image !== undefined) input.image = body.image;
    if (body.featured_image !== undefined)
      input.featured_image = body.featured_image;
    if (body.category_id !== undefined) input.category_id = body.category_id;
    if (body.published !== undefined) input.published = body.published;
    if (body.featured !== undefined) input.featured = body.featured;
    if (body.meta_description !== undefined)
      input.meta_description = body.meta_description;
    if (body.meta_keywords !== undefined)
      input.meta_keywords = body.meta_keywords;
    if (body.ai_provider !== undefined) input.ai_provider = body.ai_provider;
    if (body.publish_date !== undefined) input.publish_date = body.publish_date;
    if (body.author !== undefined) input.author = body.author;

    const success = await updateArticle(articleId, input);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'المقال غير موجود' },
        { status: 404 }
      );
    }

    const updatedArticle = await getArticleById(articleId);

    console.log(`[Article Update] Success for ID: ${articleId}`);
    return NextResponse.json({
      success: true,
      data: updatedArticle,
      message: 'تم تحديث المقال بنجاح',
    });
  } catch (error) {
    console.error('Error updating article:', error);

    const errorMessage = String(error);

    if (errorMessage.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { success: false, error: 'يوجد مقال بنفس الـ slug' },
        { status: 409 }
      );
    }

    // معالجة أخطاء قاعدة البيانات
    if (
      errorMessage.includes('too long') ||
      errorMessage.includes('value too long')
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'المحتوى أو أحد الحقول طويل جداً. يرجى تقليل حجم المحتوى.',
        },
        { status: 400 }
      );
    }

    if (
      errorMessage.includes('invalid byte sequence') ||
      errorMessage.includes('encoding')
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'يوجد أحرف غير صالحة في المحتوى. يرجى إزالة الأحرف الخاصة.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'فشل في تحديث المقال',
        details:
          process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

// DELETE - حذف مقال
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const articleId = parseInt(id);

    if (isNaN(articleId)) {
      return NextResponse.json(
        { success: false, error: 'معرف المقال غير صالح' },
        { status: 400 }
      );
    }

    const success = await deleteArticle(articleId);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'المقال غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف المقال بنجاح',
    });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في حذف المقال',
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
