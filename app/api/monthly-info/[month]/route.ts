import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db/database';
import datesData from '@/data/sona/knowledge/dates.json';

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

// Lucky colors data with hex codes
const LUCKY_COLORS: Record<
  number,
  { color: string; colorEn: string; meaning: string; hex: string }
> = {
  1: { color: 'الأبيض', colorEn: 'White', meaning: 'النقاء والبدايات الجديدة', hex: '#FFFFFF' },
  2: { color: 'الأرجواني', colorEn: 'Purple', meaning: 'الحكمة والروحانية', hex: '#800080' },
  3: { color: 'الأخضر', colorEn: 'Green', meaning: 'النمو والتجدد', hex: '#008000' },
  4: { color: 'الوردي', colorEn: 'Pink', meaning: 'الحب والرومانسية', hex: '#FFC0CB' },
  5: { color: 'الأصفر', colorEn: 'Yellow', meaning: 'السعادة والتفاؤل', hex: '#FFFF00' },
  6: { color: 'الأزرق', colorEn: 'Blue', meaning: 'الهدوء والسلام', hex: '#0000FF' },
  7: { color: 'الأحمر', colorEn: 'Red', meaning: 'الشغف والطاقة', hex: '#FF0000' },
  8: { color: 'البرتقالي', colorEn: 'Orange', meaning: 'الإبداع والحماس', hex: '#FFA500' },
  9: { color: 'الذهبي', colorEn: 'Gold', meaning: 'النجاح والثروة', hex: '#FFD700' },
  10: { color: 'البني', colorEn: 'Brown', meaning: 'الاستقرار والأمان', hex: '#A52A2A' },
  11: { color: 'الفضي', colorEn: 'Silver', meaning: 'الأناقة والحداثة', hex: '#C0C0C0' },
  12: {
    color: 'الأزرق الداكن',
    colorEn: 'Navy Blue',
    meaning: 'العمق والحكمة',
    hex: '#000080',
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

const MONTH_KEYS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
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

    // Get lucky color
    const luckyColor = LUCKY_COLORS[month];

    // Try to query database, but don't fail if it doesn't work
    let birthstone = null;
    let birthFlower = null;

    try {
      // Try to fetch from DB first
      birthstone = await queryOne<Birthstone>(
        'SELECT * FROM birthstones WHERE month = $1',
        [month]
      );

      birthFlower = await queryOne<BirthFlower>(
        'SELECT * FROM birth_flowers WHERE month = $1',
        [month]
      );
    } catch (dbError) {
      console.warn('Database query failed, falling back to JSON data', dbError);
    }

    // Fallback to JSON data if DB query failed or returned null
    if (!birthstone || !birthFlower) {
      const monthKey = MONTH_KEYS[month - 1];
      // @ts-expect-error: monthKey is a dynamic index from JSON
      const monthData = datesData.months[monthKey];

      if (monthData) {
        if (!birthstone) {
          birthstone = {
            id: month,
            month: month,
            stone_name: monthData.birthstone,
            stone_name_ar: monthData.birthstone,
            description: `حجر ${monthData.birthstone} هو الحجر الكريم المميز لمواليد شهر ${MONTH_NAMES_AR[month - 1]}.`,
          };
        }

        if (!birthFlower) {
          birthFlower = {
            id: month,
            month: month,
            flower_name: monthData.birthFlower,
            flower_name_ar: monthData.birthFlower,
            description: `زهرة ${monthData.birthFlower} هي الزهرة المميزة لمواليد شهر ${MONTH_NAMES_AR[month - 1]}.`,
          };
        }
      }
    }

    // Transform data to match frontend expectations
    const transformedData = {
      month,
      monthName: MONTH_NAMES_AR[month - 1],
      
      birthstone: birthstone ? {
        name: birthstone.stone_name_ar || birthstone.stone_name,
        properties: birthstone.description || `حجر كريم مميز لشهر ${MONTH_NAMES_AR[month - 1]}`,
        color: luckyColor?.color || 'غير محدد',
        meaning: luckyColor?.meaning || 'رمز للحظ والقوة',
      } : null,

      birthFlower: birthFlower ? {
        name: birthFlower.flower_name_ar || birthFlower.flower_name,
        meaning: birthFlower.description || `زهرة مميزة لشهر ${MONTH_NAMES_AR[month - 1]}`,
        symbolism: 'الجمال والنقاء', // Default symbolism
      } : null,

      luckyColor: luckyColor ? {
        color: luckyColor.color,
        meaning: luckyColor.meaning,
        hex: luckyColor.hex,
      } : null,

      // Extra data
      facts: (datesData.months as any)[MONTH_KEYS[month - 1]]?.facts || [],
      zodiacSigns: (datesData.months as any)[MONTH_KEYS[month - 1]]?.zodiacSigns || [],
      events: (datesData.months as any)[MONTH_KEYS[month - 1]]?.events || [],
    };

    return NextResponse.json({
      success: true,
      data: transformedData,
    });
  } catch (error) {
    console.error('Monthly Info API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'حدث خطأ في الخادم',
        },
      },
      { status: 500 }
    );
  }
}
