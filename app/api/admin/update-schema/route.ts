import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST() {
  try {
    // تحديث عمود icon في article_categories
    await sql`
      ALTER TABLE article_categories 
      ALTER COLUMN icon TYPE TEXT
    `;

    // تحديث عمود icon في tool_categories
    await sql`
      ALTER TABLE tool_categories 
      ALTER COLUMN icon TYPE TEXT
    `;

    // تحديث عمود icon في tools
    await sql`
      ALTER TABLE tools 
      ALTER COLUMN icon TYPE TEXT
    `;

    return NextResponse.json({
      success: true,
      message: 'تم تحديث أعمدة icon إلى TEXT بنجاح',
    });
  } catch (error: any) {
    // إذا كان العمود بالفعل TEXT، تجاهل الخطأ
    if (error.message?.includes('already')) {
      return NextResponse.json({
        success: true,
        message: 'الأعمدة محدثة بالفعل',
      });
    }

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
  return NextResponse.json({
    message: 'استخدم POST لتحديث schema',
  });
}
