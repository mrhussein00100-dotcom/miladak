import { NextResponse } from 'next/server';
import { query } from '@/lib/db/database';

export async function GET() {
  try {
    // اختبار بسيط جداً
    const result = await query('SELECT 1 as test');

    // فحص الجداول الموجودة
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    // فحص جدول tools
    let toolsCount = null;
    let toolsError = null;
    try {
      const toolsResult = await query('SELECT COUNT(*) as count FROM tools');
      toolsCount = toolsResult[0];
    } catch (e: any) {
      toolsError = e.message;
    }

    // فحص جدول tool_categories
    let categoriesCount = null;
    let categoriesError = null;
    try {
      const categoriesResult = await query(
        'SELECT COUNT(*) as count FROM tool_categories'
      );
      categoriesCount = categoriesResult[0];
    } catch (e: any) {
      categoriesError = e.message;
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      result,
      tables: tables.map((t: any) => t.table_name),
      tools: { count: toolsCount, error: toolsError },
      categories: { count: categoriesCount, error: categoriesError },
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
        POSTGRES_URL: process.env.POSTGRES_URL ? 'Set' : 'Not set',
        DATABASE_TYPE: process.env.DATABASE_TYPE || 'not set',
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL ? 'Yes' : 'No',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
        env: {
          DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
          POSTGRES_URL: process.env.POSTGRES_URL ? 'Set' : 'Not set',
          DATABASE_TYPE: process.env.DATABASE_TYPE || 'not set',
          NODE_ENV: process.env.NODE_ENV,
          VERCEL: process.env.VERCEL ? 'Yes' : 'No',
        },
      },
      { status: 500 }
    );
  }
}
