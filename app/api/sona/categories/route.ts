/**
 * SONA v4 Categories API
 * GET /api/sona/categories
 *
 * Requirements: 19.3
 */

import { NextResponse } from 'next/server';
import { templateEngine } from '@/lib/sona/templateEngine';

interface CategoryInfo {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  templateCount: {
    intros: number;
    paragraphs: number;
    conclusions: number;
  };
}

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    timestamp: string;
    version: string;
  };
}

const CATEGORIES: CategoryInfo[] = [
  {
    id: 'birthday',
    name: 'Birthday',
    nameAr: 'أعياد الميلاد',
    description: 'مقالات عن أعياد الميلاد والاحتفالات',
    templateCount: { intros: 0, paragraphs: 0, conclusions: 0 },
  },
  {
    id: 'zodiac',
    name: 'Zodiac',
    nameAr: 'الأبراج',
    description: 'مقالات عن الأبراج الفلكية والتنجيم',
    templateCount: { intros: 0, paragraphs: 0, conclusions: 0 },
  },
  {
    id: 'health',
    name: 'Health',
    nameAr: 'الصحة',
    description: 'مقالات صحية ونصائح طبية',
    templateCount: { intros: 0, paragraphs: 0, conclusions: 0 },
  },
  {
    id: 'dates',
    name: 'Dates',
    nameAr: 'التواريخ',
    description: 'مقالات عن التواريخ والأحداث التاريخية',
    templateCount: { intros: 0, paragraphs: 0, conclusions: 0 },
  },
  {
    id: 'general',
    name: 'General',
    nameAr: 'عام',
    description: 'مقالات عامة متنوعة',
    templateCount: { intros: 0, paragraphs: 0, conclusions: 0 },
  },
];

export async function GET() {
  try {
    // Get template statistics
    const stats = await templateEngine.getTemplateStats();

    // Update template counts for each category
    const categoriesWithCounts = CATEGORIES.map((category) => ({
      ...category,
      templateCount: {
        intros:
          stats.introsByCategory[category.id] ||
          stats.introsByCategory['general'] ||
          0,
        paragraphs: stats.paragraphsByType['general'] || 0,
        conclusions:
          stats.conclusionsByCategory[category.id] ||
          stats.conclusionsByCategory['general'] ||
          0,
      },
    }));

    return NextResponse.json<APIResponse<CategoryInfo[]>>({
      success: true,
      data: categoriesWithCounts,
      meta: {
        timestamp: new Date().toISOString(),
        version: '4.0.0',
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'خطأ غير معروف';

    return NextResponse.json<APIResponse<null>>(
      {
        success: false,
        error: {
          code: 'CATEGORIES_ERROR',
          message: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}
