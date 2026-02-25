import { NextResponse } from 'next/server';
import { query } from '@/lib/db/database';

export async function GET() {
  try {
    const fixes = [
      { name: 'holidays', newHref: '/tools/holidays-calculator' },
      { name: 'generation', newHref: '/tools/generation-calculator' },
      { name: 'timezone', newHref: '/tools/timezone-calculator' },
    ];

    const results = [];

    for (const fix of fixes) {
      try {
        await query('UPDATE tools SET href = $1 WHERE name = $2', [
          fix.newHref,
          fix.name,
        ]);
        results.push({
          name: fix.name,
          newHref: fix.newHref,
          status: 'updated',
        });
      } catch (error) {
        results.push({ name: fix.name, status: 'error', error: String(error) });
      }
    }

    const updated = await query<{ id: number; title: string; href: string }>(
      "SELECT id, title, href FROM tools WHERE name IN ('holidays', 'generation', 'timezone')"
    );

    return NextResponse.json({
      success: true,
      message: 'Tools href fixed successfully',
      results,
      verifiedTools: updated,
    });
  } catch (error) {
    console.error('Error fixing tools href:', error);
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}
