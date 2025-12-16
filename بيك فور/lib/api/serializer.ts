/**
 * API Response Serializer
 * Feature: frontend-database-integration
 * Requirements: 10.7
 */

import { NextResponse } from 'next/server';

interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    timestamp?: string;
  };
}

interface PaginatedResponse<T> extends SuccessResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Create a success response
 */
export function createSuccessResponse<T>(
  data: T,
  meta?: SuccessResponse<T>['meta']
): NextResponse<SuccessResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    meta: {
      ...meta,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Create a paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): NextResponse<PaginatedResponse<T>> {
  const totalPages = Math.ceil(total / limit);
  return NextResponse.json({
    success: true,
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  });
}

/**
 * Serialize date to ISO string
 */
export function serializeDate(date: Date | string | null): string | null {
  if (!date) return null;
  if (typeof date === 'string') return date;
  return date.toISOString();
}

/**
 * Serialize database row to API response format
 */
export function serializeRow<T extends Record<string, unknown>>(
  row: T,
  dateFields: (keyof T)[] = []
): T {
  const serialized = { ...row };
  dateFields.forEach((field) => {
    if (serialized[field]) {
      (serialized as Record<string, unknown>)[field as string] = serializeDate(
        serialized[field] as Date | string
      );
    }
  });
  return serialized;
}

/**
 * Serialize multiple rows
 */
export function serializeRows<T extends Record<string, unknown>>(
  rows: T[],
  dateFields: (keyof T)[] = []
): T[] {
  return rows.map((row) => serializeRow(row, dateFields));
}

/**
 * Parse JSON safely
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Stringify JSON safely
 */
export function safeJsonStringify(data: unknown): string {
  try {
    return JSON.stringify(data);
  } catch {
    return '{}';
  }
}
