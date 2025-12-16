/**
 * API إدارة التصنيفات - GET للقائمة، POST للإنشاء
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getCategories,
  getCategoriesTree,
  createCategory,
  getCategoryStats,
  reorderCategories,
  updateAllArticleCounts,
  ensureCategoryColumns,
  type CategoryInput,
} from '@/lib/db/categories';

// التأكد من وجود التصنيفات الافتراضية عند بدء التشغيل
ensureCategoryColumns();

// GET - جلب قائمة التصنيفات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const tree = searchParams.get('tree') === 'true';
    const includeCount = searchParams.get('includeCount') !== 'false';
    const parentId = searchParams.get('parentId');
    const includeStats = searchParams.get('includeStats') === 'true';

    let categories;

    if (tree) {
      categories = getCategoriesTree();
    } else {
      categories = getCategories({
        includeCount,
        parentId:
          parentId === 'null'
            ? null
            : parentId
            ? parseInt(parentId)
            : undefined,
      });
    }

    const response: any = {
      success: true,
      data: categories,
      meta: {
        total: Array.isArray(categories) ? categories.length : 0,
        timestamp: new Date().toISOString(),
      },
    };

    if (includeStats) {
      response.stats = getCategoryStats();
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في جلب التصنيفات',
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

// POST - إنشاء تصنيف جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // التحقق من الحقول المطلوبة
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'اسم التصنيف مطلوب' },
        { status: 400 }
      );
    }

    const input: CategoryInput = {
      name: body.name,
      slug: body.slug,
      description: body.description,
      color: body.color,
      icon: body.icon,
      parent_id: body.parent_id,
      sort_order: body.sort_order,
    };

    const categoryId = createCategory(input);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: categoryId,
          message: 'تم إنشاء التصنيف بنجاح',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);

    if (String(error).includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { success: false, error: 'يوجد تصنيف بنفس الـ slug' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'فشل في إنشاء التصنيف',
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

// PUT - إعادة ترتيب التصنيفات أو تحديث عدد المقالات
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // إعادة ترتيب التصنيفات
    if (body.reorder && Array.isArray(body.orderedIds)) {
      reorderCategories(body.orderedIds);
      return NextResponse.json({
        success: true,
        message: 'تم إعادة ترتيب التصنيفات بنجاح',
      });
    }

    // تحديث عدد المقالات
    if (body.updateCounts) {
      updateAllArticleCounts();
      return NextResponse.json({
        success: true,
        message: 'تم تحديث عدد المقالات بنجاح',
      });
    }

    return NextResponse.json(
      { success: false, error: 'عملية غير معروفة' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في تحديث التصنيفات',
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
