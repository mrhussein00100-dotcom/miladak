import { NextRequest, NextResponse } from 'next/server';
import {
  calculateZodiac,
  calculateZodiacEn,
  calculateElement,
  calculateElementEn,
  getZodiacInfo,
  getAllZodiacAnimals,
  getZodiacYears,
  isValidYear,
} from '@/lib/calculations/zodiacCalculations';

/**
 * Chinese Zodiac API
 * Feature: frontend-database-integration
 * Requirements: 3.4, 10.1
 *
 * GET /api/chinese-zodiac - Get all zodiac animals
 * GET /api/chinese-zodiac?year=1990 - Get zodiac for specific year
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get('year');

    // If year is provided, return zodiac for that year
    if (yearParam) {
      const year = parseInt(yearParam, 10);

      if (isNaN(year) || !isValidYear(year)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_YEAR',
              message: 'السنة يجب أن تكون بين 1900 و 2100',
              details: `Received: ${yearParam}`,
            },
          },
          { status: 400 }
        );
      }

      const zodiacInfo = getZodiacInfo(year);
      const years = getZodiacYears(zodiacInfo.animal, 1900, 2100);

      return NextResponse.json({
        success: true,
        data: {
          year,
          ...zodiacInfo,
          years: years.slice(0, 20), // Return recent 20 years
        },
      });
    }

    // Return all zodiac animals
    const allAnimals = getAllZodiacAnimals();
    const currentYear = new Date().getFullYear();

    const zodiacList = allAnimals.map((animal, index) => {
      // Find the most recent year for this animal
      const years = getZodiacYears(
        animal.ar,
        currentYear - 12,
        currentYear + 12
      );

      return {
        id: index + 1,
        animal: animal.ar,
        animalEn: animal.en,
        traits: animal.traits,
        description: animal.description,
        recentYears: years,
      };
    });

    return NextResponse.json({
      success: true,
      data: zodiacList,
      total: zodiacList.length,
    });
  } catch (error) {
    console.error('Chinese Zodiac API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'حدث خطأ في جلب بيانات الأبراج الصينية',
        },
      },
      { status: 500 }
    );
  }
}
