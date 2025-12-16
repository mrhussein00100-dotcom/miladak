/**
 * API التصنيف الفردي - GET, PUT, DELETE
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
  type CategoryInput,
} from '@/lib/db/categories';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - جلب تصنيف واحد
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { success: false, error: 'معرف التصنيف غير صالح' },
        { status: 400 }
      );
    }

    const category = getCategoryById(categoryId);

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'التصنيف غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في جلب التصنيف',
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

// PUT - تحديث تصنيف
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { success: false, error: 'معرف التصنيف غير صالح' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const input: Partial<CategoryInput> = {};

    if (body.name !== undefined) input.name = body.name;
    if (body.slug !== undefined) input.slug = body.slug;
    if (body.description !== undefined) input.description = body.description;
    if (body.color !== undefined) input.color = body.color;
    if (body.icon !== undefined) input.icon = body.icon;
    if (body.parent_id !== undefined) input.parent_id = body.parent_id;
    if (body.sort_order !== undefined) input.sort_order = body.sort_order;

    const success = updateCategory(categoryId, input);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'التصنيف غير موجود' },
        { status: 404 }
      );
    }

    const updatedCategory = getCategoryById(categoryId);

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'تم تحديث التصنيف بنجاح',
    });
  } catch (error) {
    console.error('Error updating category:', error);

    if (String(error).includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { success: false, error: 'يوجد تصنيف بنفس الـ slug' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'فشل في تحديث التصنيف',
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

// DELETE - حذف تصنيف
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { success: false, error: 'معرف التصنيف غير صالح' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const reassignTo = searchParams.get('reassignTo');

    const success = deleteCategory(
      categoryId,
      reassignTo ? parseInt(reassignTo) : undefined
    );

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'التصنيف غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف التصنيف بنجاح',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في حذف التصنيف',
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
