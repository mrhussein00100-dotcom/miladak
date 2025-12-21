import { NextResponse } from 'next/server';
import { query } from '@/lib/db/database';

export async function GET() {
  try {
    // فحص هيكل جدول tools
    const toolsColumns = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'tools'
      ORDER BY ordinal_position
    `);

    // فحص هيكل جدول tool_categories
    const categoriesColumns = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'tool_categories'
      ORDER BY ordinal_position
    `);

    // فحص هيكل جدول articles
    const articlesColumns = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'articles'
      ORDER BY ordinal_position
    `);

    return NextResponse.json({
      success: true,
      toolsColumns,
      categoriesColumns,
      articlesColumns,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
