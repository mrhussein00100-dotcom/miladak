import { NextRequest, NextResponse } from 'next/server';
import {
  calculateAge,
  validateBirthDate,
  calculateLifeStats,
} from '@/lib/calculations/ageCalculations';

export async function POST(request: NextRequest) {
  try {
    const { birthDate } = await request.json();

    if (!birthDate) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Birth date is required',
            messageAr: 'تاريخ الميلاد مطلوب',
          },
        },
        { status: 400 }
      );
    }

    const date = new Date(birthDate);
    const validation = validateBirthDate(date);

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_DATE',
            message: 'Invalid birth date',
            messageAr: validation.error || 'تاريخ الميلاد غير صحيح',
          },
        },
        { status: 400 }
      );
    }

    const ageData = calculateAge(date);
    const lifeStats = calculateLifeStats(ageData.totalDays);

    return NextResponse.json({
      success: true,
      data: {
        age: ageData,
        lifeStats,
      },
    });
  } catch (error) {
    console.error('Birthday info calculation error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Internal server error',
          messageAr: 'حدث خطأ في الخادم',
        },
      },
      { status: 500 }
    );
  }
}
