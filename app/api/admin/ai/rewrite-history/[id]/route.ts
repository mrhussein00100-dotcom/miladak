/**
 * API حذف سجل إعادة الصياغة
 * DELETE /api/admin/ai/rewrite-history/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteRewriteHistory, getRewriteHistoryById } from '@/lib/db/rewriter';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'معرف غير صالح' },
        { status: 400 }
      );
    }

    const record = getRewriteHistoryById(id);

    if (!record) {
      return NextResponse.json(
        { success: false, error: 'السجل غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      record,
    });
  } catch (error) {
    console.error('❌ خطأ في جلب السجل:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ في الخادم',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'معرف غير صالح' },
        { status: 400 }
      );
    }

    const deleted = deleteRewriteHistory(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'السجل غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف السجل بنجاح',
    });
  } catch (error) {
    console.error('❌ خطأ في حذف السجل:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ في الخادم',
      },
      { status: 500 }
    );
  }
}
