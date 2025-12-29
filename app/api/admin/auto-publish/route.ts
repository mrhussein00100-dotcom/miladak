/**
 * API إعدادات النشر التلقائي
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getAutoPublishSettings,
  updateAutoPublishSettings,
} from '@/lib/db/auto-publish';

// GET - جلب الإعدادات
export async function GET() {
  try {
    const settings = await getAutoPublishSettings();

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching auto-publish settings:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الإعدادات' },
      { status: 500 }
    );
  }
}

// PUT - تحديث الإعدادات
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    await updateAutoPublishSettings({
      is_enabled: body.is_enabled,
      publish_time: body.publish_time,
      frequency: body.frequency,
      topics: body.topics,
      default_category_id: body.default_category_id,
      ai_provider: body.ai_provider,
      content_length: body.content_length,
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الإعدادات بنجاح',
    });
  } catch (error) {
    console.error('Error updating auto-publish settings:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث الإعدادات' },
      { status: 500 }
    );
  }
}
