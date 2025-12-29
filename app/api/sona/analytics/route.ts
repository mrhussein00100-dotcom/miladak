/**
 * SONA v4 Analytics API
 * GET /api/sona/analytics
 *
 * Requirements: 19.4
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  sonaAnalytics,
  DateRange,
  QualityTrend,
  CategoryStats,
  TemplateUsage,
} from '@/lib/sona/analytics';

interface AnalyticsData {
  totalGenerations: number;
  avgQualityScore: number;
  avgGenerationTime: number;
  errorRate: number;
  retryRate: number;
  diversityScore: number;
  qualityTrend: QualityTrend[];
  categoryDistribution: CategoryStats[];
  topTemplates: TemplateUsage[];
  lowQualityTemplates: Array<{
    templateId: string;
    avgQualityScore: number;
    usageCount: number;
    recommendation: string;
  }>;
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
    period?: DateRange;
  };
}

/**
 * GET /api/sona/analytics
 * الحصول على تحليلات SONA المفصلة
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodParam = searchParams.get('period');

    // Calculate date range based on period
    let period: DateRange;
    const endDate = new Date().toISOString().split('T')[0];
    let startDate: string;

    switch (periodParam) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];
    }

    period = { startDate, endDate };

    // Fetch all analytics data in parallel
    const [
      totalGenerations,
      avgQualityScore,
      avgGenerationTime,
      errorRate,
      retryRate,
      diversityScore,
      qualityTrend,
      categoryDistribution,
      topTemplates,
      lowQualityTemplates,
    ] = await Promise.all([
      sonaAnalytics.getTotalGenerations(period),
      sonaAnalytics.getAverageQualityScore(period),
      sonaAnalytics.getAverageGenerationTime(),
      sonaAnalytics.getErrorRate(),
      sonaAnalytics.getRetryRate(),
      sonaAnalytics.getDiversityScore(),
      sonaAnalytics.getQualityTrend(period),
      sonaAnalytics.getCategoryDistribution(),
      sonaAnalytics.getMostUsedTemplates(10),
      sonaAnalytics.getLowQualityTemplates(),
    ]);

    const analyticsData: AnalyticsData = {
      totalGenerations,
      avgQualityScore,
      avgGenerationTime,
      errorRate,
      retryRate,
      diversityScore,
      qualityTrend,
      categoryDistribution,
      topTemplates,
      lowQualityTemplates,
    };

    return NextResponse.json<APIResponse<AnalyticsData>>({
      success: true,
      data: analyticsData,
      meta: {
        timestamp: new Date().toISOString(),
        version: '4.0.0',
        period,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'خطأ غير معروف';

    return NextResponse.json<APIResponse<null>>(
      {
        success: false,
        error: {
          code: 'ANALYTICS_ERROR',
          message: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}
