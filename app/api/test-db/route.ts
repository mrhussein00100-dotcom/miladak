import { NextResponse } from 'next/server';
import { query } from '@/lib/db/database';

export async function GET() {
  try {
    // اختبار بسيط جداً
    const result = await query('SELECT 1 as test');

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      result,
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
