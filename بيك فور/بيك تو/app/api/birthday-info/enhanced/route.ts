import { NextRequest, NextResponse } from 'next/server';
import { getRawDatabase } from '@/lib/db/database';
import {
  calculateAge,
  validateBirthDate,
  calculateLifeStats,
} from '@/lib/calculations/ageCalculations';
import { getZodiacInfo } from '@/lib/calculations/zodiacCalculations';

/**
 * Enhanced Birthday Info API
 * Feature: frontend-database-integration
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6
 */

interface BirthstoneData {
  stone_name: string;
  stone_name_ar: string;
  description: string;
}

interface BirthFlowerData {
  flower_name: string;
  flower_name_ar: string;
  description: string;
}

interface SeasonData {
  season_name: string;
  season_name_ar: string;
  description: string;
}

interface LuckyColorData {
  color_name: string;
  color_name_ar: string;
  hex_code: string;
}

interface ChineseZodiacData {
  name: string;
  name_ar: string;
  description: string;
}

interface YearData {
  facts: string;
  world_stats: string;
}

interface DailyEventData {
  title: string;
  description: string;
  category: string;
}

interface DailyBirthdayData {
  name: string;
  profession: string;
  birth_year: number;
}

export async function POST(request: NextRequest) {
  try {
    const { birthDate } = await request.json();

    if (!birthDate) {
      return NextResponse.json(
        { success: false, error: 'تاريخ الميلاد مطلوب' },
        { status: 400 }
      );
    }

    const date = new Date(birthDate);
    const validation = validateBirthDate(date);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const db = getRawDatabase();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    // حساب العمر الأساسي
    const ageData = calculateAge(date);
    const lifeStats = calculateLifeStats(ageData.totalDays);

    // جلب حجر الميلاد
    const birthstone = db
      .prepare(
        'SELECT stone_name, stone_name_ar, description FROM birthstones WHERE month = ?'
      )
      .get(month) as BirthstoneData | undefined;

    // جلب زهرة الميلاد
    const birthFlower = db
      .prepare(
        'SELECT flower_name, flower_name_ar, description FROM birth_flowers WHERE month = ?'
      )
      .get(month) as BirthFlowerData | undefined;

    // جلب الفصل
    const season = db
      .prepare(
        'SELECT season_name, season_name_ar, description FROM seasons WHERE month = ?'
      )
      .get(month) as SeasonData | undefined;

    // جلب اللون المحظوظ
    const luckyColor = db
      .prepare(
        'SELECT color_name, color_name_ar, hex_code FROM lucky_colors WHERE month = ?'
      )
      .get(month) as LuckyColorData | undefined;

    // جلب البرج الصيني من الحسابات
    const zodiacInfo = getZodiacInfo(year);

    // جلب البرج الصيني من قاعدة البيانات (للمعلومات الإضافية)
    const chineseZodiac = db
      .prepare(
        'SELECT name, name_ar, description FROM chinese_zodiac WHERE year = ?'
      )
      .get(year) as ChineseZodiacData | undefined;

    // جلب معلومات السنة
    const yearInfo = db
      .prepare('SELECT facts, world_stats FROM years WHERE year = ?')
      .get(year) as YearData | undefined;

    // جلب أحداث اليوم
    const dailyEvents = db
      .prepare(
        'SELECT title, description, category FROM daily_events WHERE day = ? AND month = ? LIMIT 5'
      )
      .all(day, month) as DailyEventData[];

    // جلب مشاهير اليوم
    const famousBirthdays = db
      .prepare(
        'SELECT name, profession, birth_year FROM daily_birthdays WHERE day = ? AND month = ? LIMIT 5'
      )
      .all(day, month) as DailyBirthdayData[];

    return NextResponse.json({
      success: true,
      data: {
        age: ageData,
        lifeStats,
        birthstone: birthstone
          ? {
              name: birthstone.stone_name_ar || birthstone.stone_name,
              description: birthstone.description,
            }
          : null,
        birthFlower: birthFlower
          ? {
              name: birthFlower.flower_name_ar || birthFlower.flower_name,
              description: birthFlower.description,
            }
          : null,
        season: season
          ? {
              name: season.season_name_ar || season.season_name,
              description: season.description,
            }
          : null,
        luckyColor: luckyColor
          ? {
              name: luckyColor.color_name_ar || luckyColor.color_name,
              hex: luckyColor.hex_code,
            }
          : null,
        chineseZodiac: {
          animal: zodiacInfo.animal,
          animalEn: zodiacInfo.animalEn,
          element: zodiacInfo.element,
          elementEn: zodiacInfo.elementEn,
          traits: zodiacInfo.traits,
          description: chineseZodiac?.description || zodiacInfo.description,
          compatibility: zodiacInfo.compatibility,
          luckyNumbers: zodiacInfo.luckyNumbers,
          luckyColors: zodiacInfo.luckyColors,
        },
        yearInfo: yearInfo
          ? {
              facts: yearInfo.facts,
              worldStats: yearInfo.world_stats,
            }
          : null,
        dailyEvents,
        famousBirthdays,
      },
    });
  } catch (error) {
    console.error('Enhanced birthday info error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
