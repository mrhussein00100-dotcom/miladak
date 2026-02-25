/**
 * API Error Handler
 * Feature: frontend-database-integration
 * Requirements: 10.6
 */

import { NextResponse } from 'next/server';

// Error codes and messages
export const ERROR_CODES = {
  // Validation errors (400)
  INVALID_YEAR: {
    code: 'INVALID_YEAR',
    message: 'السنة غير صالحة',
    status: 400,
  },
  INVALID_MONTH: {
    code: 'INVALID_MONTH',
    message: 'الشهر يجب أن يكون بين 1 و 12',
    status: 400,
  },
  INVALID_DAY: {
    code: 'INVALID_DAY',
    message: 'اليوم يجب أن يكون بين 1 و 31',
    status: 400,
  },
  INVALID_DATE: {
    code: 'INVALID_DATE',
    message: 'التاريخ غير صالح',
    status: 400,
  },
  INVALID_DATE_FORMAT: {
    code: 'INVALID_DATE_FORMAT',
    message: 'تنسيق التاريخ غير صحيح',
    status: 400,
  },
  MISSING_PARAMETER: {
    code: 'MISSING_PARAMETER',
    message: 'معامل مطلوب مفقود',
    status: 400,
  },
  EMPTY_QUERY: {
    code: 'EMPTY_QUERY',
    message: 'يجب إدخال كلمة للبحث',
    status: 400,
  },
  INVALID_LIMIT: {
    code: 'INVALID_LIMIT',
    message: 'العدد غير صالح',
    status: 400,
  },

  // Not found errors (404)
  NOT_FOUND: {
    code: 'NOT_FOUND',
    message: 'لم يتم العثور على البيانات',
    status: 404,
  },
  ZODIAC_NOT_FOUND: {
    code: 'ZODIAC_NOT_FOUND',
    message: 'لم يتم العثور على بيانات البرج',
    status: 404,
  },
  EVENT_NOT_FOUND: {
    code: 'EVENT_NOT_FOUND',
    message: 'لم يتم العثور على الحدث',
    status: 404,
  },
  CELEBRITY_NOT_FOUND: {
    code: 'CELEBRITY_NOT_FOUND',
    message: 'لم يتم العثور على المشهور',
    status: 404,
  },
  ARTICLE_NOT_FOUND: {
    code: 'ARTICLE_NOT_FOUND',
    message: 'لم يتم العثور على المقال',
    status: 404,
  },

  // Server errors (500)
  DATABASE_ERROR: {
    code: 'DATABASE_ERROR',
    message: 'حدث خطأ في قاعدة البيانات',
    status: 500,
  },
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    message: 'حدث خطأ داخلي',
    status: 500,
  },
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

/**
 * Create an error response
 */
export function createErrorResponse(
  errorCode: ErrorCode,
  customMessage?: string
): NextResponse<ApiError> {
  const error = ERROR_CODES[errorCode];
  return NextResponse.json(
    {
      success: false,
      error: {
        code: error.code,
        message: customMessage || error.message,
      },
    },
    { status: error.status }
  );
}

/**
 * Handle API errors
 */
export function handleApiError(error: unknown): NextResponse<ApiError> {
  console.error('API Error:', error);

  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes('SQLITE')) {
      return createErrorResponse('DATABASE_ERROR');
    }
  }

  return createErrorResponse('INTERNAL_ERROR');
}

/**
 * Validate month parameter
 */
export function validateMonth(month: string | null): number | null {
  if (!month) return null;
  const monthNum = parseInt(month);
  if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) return null;
  return monthNum;
}

/**
 * Validate day parameter
 */
export function validateDay(day: string | null): number | null {
  if (!day) return null;
  const dayNum = parseInt(day);
  if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) return null;
  return dayNum;
}

/**
 * Validate year parameter
 */
export function validateYear(
  year: string | null,
  min = 1900,
  max = 2100
): number | null {
  if (!year) return null;
  const yearNum = parseInt(year);
  if (isNaN(yearNum) || yearNum < min || yearNum > max) return null;
  return yearNum;
}

/**
 * Validate date string
 */
export function validateDateString(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return date;
}
