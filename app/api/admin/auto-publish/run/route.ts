/**
 * API تشغيل النشر التلقائي يدوياً
 */

import { NextResponse } from 'next/server';
import {
  getAutoPublishSettings,
  addPublishLog,
  updateLastRun,
} from '@/lib/db/auto-publish';
import { generateArticle } from '@/lib/ai/generator';
import { createArticle } from '@/lib/db/articles';

// POST - تشغيل النشر
export async function POST() {
  try {
    const settings = await getAutoPublishSettings();

    if (!settings) {
      return NextResponse.json(
        { success: false, error: 'لم يتم العثور على الإعدادات' },
        { status: 400 }
      );
    }

    // اختيار موضوع عشوائي
    let topics: string[] = [];
    try {
      topics = JSON.parse(settings.topics || '[]');
    } catch {
      topics = [];
    }

    if (topics.length === 0) {
      topics = ['عيد ميلاد سعيد', 'حساب العمر', 'الأبراج'];
    }

    const topic = topics[Math.floor(Math.random() * topics.length)];

    try {
      // توليد المقال
      const result = await generateArticle({
        topic,
        length: (settings.content_length as any) || 'medium',
        provider: (settings.ai_provider as any) || 'gemini',
        style: 'seo',
      });

      // إنشاء المقال
      const articleId = await createArticle({
        title: result.title,
        content: result.content,
        excerpt: result.metaDescription,
        category_id: settings.default_category_id || 1,
        published: 1,
        meta_description: result.metaDescription,
        meta_keywords: result.keywords.join(', '),
        ai_provider: result.provider,
      });

      // تسجيل النجاح
      await addPublishLog({
        article_id: articleId,
        status: 'success',
      });

      // تحديث وقت آخر تشغيل
      await updateLastRun();

      return NextResponse.json({
        success: true,
        data: {
          articleId,
          title: result.title,
          wordCount: result.wordCount,
        },
      });
    } catch (error) {
      // تسجيل الفشل
      await addPublishLog({
        status: 'failed',
        error_message: String(error),
      });

      throw error;
    }
  } catch (error) {
    console.error('Auto-publish run error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في النشر التلقائي',
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
