import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db/database';

interface Birthstone {
  id: number;
  month: number;
  stone_name: string;
  stone_name_ar: string;
  description: string | null;
}

interface BirthFlower {
  id: number;
  month: number;
  flower_name: string;
  flower_name_ar: string;
  description: string | null;
}

// Lucky colors data (static since not in DB)
const LUCKY_COLORS: Record<
  number,
  { color: string; colorEn: string; meaning: string }
> = {
  1: { color: 'الأبيض', colorEn: 'White', meaning: 'النقاء والبدايات الجديدة' },
  2: { color: 'الأرجواني', colorEn: 'Purple', meaning: 'الحكمة والروحانية' },
  3: { color: 'الأخضر', colorEn: 'Green', meaning: 'النمو والتجدد' },
  4: { color: 'الوردي', colorEn: 'Pink', meaning: 'الحب والرومانسية' },
  5: { color: 'الأصفر', colorEn: 'Yellow', meaning: 'السعادة والتفاؤل' },
  6: { color: 'الأزرق', colorEn: 'Blue', meaning: 'الهدوء والسلام' },
  7: { color: 'الأحمر', colorEn: 'Red', meaning: 'الشغف والطاقة' },
  8: { color: 'البرتقالي', colorEn: 'Orange', meaning: 'الإبداع والحماس' },
  9: { color: 'الذهبي', colorEn: 'Gold', meaning: 'النجاح والثروة' },
  10: { color: 'البني', colorEn: 'Brown', meaning: 'الاستقرار والأمان' },
  11: { color: 'الفضي', colorEn: 'Silver', meaning: 'الأناقة والحداثة' },
  12: {
    color: 'الأزرق الداكن',
    colorEn: 'Navy Blue',
    meaning: 'العمق والحكمة',
  },
};

// Arabic month names
const MONTH_NAMES_AR = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

/**
 * Monthly Info API
 * Feature: frontend-database-integration
 * Requirements: 2.3, 10.4
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ month: string }> }
) {
  try {
    const { month: monthParam } = await params;
    const month = parseInt(monthParam, 10);

    // Validate month
    if (isNaN(month) || month < 1 || month > 12) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_MONTH',
            message: 'الشهر يجب أن يكون بين 1 و 12',
            details: `Received month: ${monthParam}`,
          },
        },
        { status: 400 }
      );
    }

    // Get lucky color (static data - no DB needed)
    const luckyColor = LUCKY_COLORS[month];

    // Try to query database, but don't fail if it doesn't work
    let birthstone = null;
    let birthFlower = null;

    try {
      birthstone = queryOne<Birthstone>(
        'SELECT * FROM birthstones WHERE month = ?',
        [month]
      );

      birthFlower = queryOne<BirthFlower>(
        'SELECT * FROM birth_flowers WHERE month = ?',
        [month]
      );
    } catch (dbError) {
      console.warn('Database query failed, using static data only:', dbError);
    }

    return NextResponse.json({
      success: true,
      data: {
        month,
        monthName: MONTH_NAMES_AR[month - 1],
        birthstone: birthstone
          ? {
              name: birthstone.stone_name_ar || birthstone.stone_name,
              nameEn: birthstone.stone_name,
              properties: birthstone.description || '',
            }
          : null,
        birthFlower: birthFlower
          ? {
              name: birthFlower.flower_name_ar || birthFlower.flower_name,
              nameEn: birthFlower.flower_name,
              meaning: birthFlower.description || '',
            }
          : null,
        luckyColor: luckyColor
          ? {
              color: luckyColor.color,
              colorEn: luckyColor.colorEn,
              meaning: luckyColor.meaning,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Monthly Info API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'حدث خطأ في جلب معلومات الشهر',
        },
      },
      { status: 500 }
    );
  }
}
