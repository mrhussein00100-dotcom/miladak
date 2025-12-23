import { NextResponse } from 'next/server';
import { executePostgresCommand } from '@/lib/db/postgres';

async function updateSchema() {
  const results: string[] = [];
  const errors: string[] = [];

  // تحديث عمود icon في article_categories
  try {
    await executePostgresCommand(
      'ALTER TABLE article_categories ALTER COLUMN icon TYPE TEXT'
    );
    results.push('✅ article_categories.icon → TEXT');
  } catch (e: any) {
    if (
      e.message?.includes('already') ||
      e.message?.includes('text') ||
      e.code === '42804'
    ) {
      results.push('ℹ️ article_categories.icon already TEXT');
    } else {
      errors.push(`article_categories: ${e.message}`);
    }
  }

  // تحديث عمود icon في tool_categories
  try {
    await executePostgresCommand(
      'ALTER TABLE tool_categories ALTER COLUMN icon TYPE TEXT'
    );
    results.push('✅ tool_categories.icon → TEXT');
  } catch (e: any) {
    if (
      e.message?.includes('already') ||
      e.message?.includes('text') ||
      e.code === '42804'
    ) {
      results.push('ℹ️ tool_categories.icon already TEXT');
    } else {
      errors.push(`tool_categories: ${e.message}`);
    }
  }

  // تحديث عمود icon في tools
  try {
    await executePostgresCommand(
      'ALTER TABLE tools ALTER COLUMN icon TYPE TEXT'
    );
    results.push('✅ tools.icon → TEXT');
  } catch (e: any) {
    if (
      e.message?.includes('already') ||
      e.message?.includes('text') ||
      e.code === '42804'
    ) {
      results.push('ℹ️ tools.icon already TEXT');
    } else {
      errors.push(`tools: ${e.message}`);
    }
  }

  return { results, errors };
}

export async function POST() {
  try {
    const { results, errors } = await updateSchema();

    return NextResponse.json({
      success: errors.length === 0,
      message: 'تم تحديث أعمدة icon',
      results,
      errors: errors.length > 0 ? errors : undefined,
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

export async function GET() {
  try {
    const { results, errors } = await updateSchema();

    return NextResponse.json({
      success: errors.length === 0,
      message: 'تم تحديث أعمدة icon',
      results,
      errors: errors.length > 0 ? errors : undefined,
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
