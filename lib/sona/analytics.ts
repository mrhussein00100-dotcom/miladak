/**
 * SONA v4 Analytics & Logging System
 * نظام التحليلات والتسجيل
 *
 * Requirements: 18.1, 18.2, 18.3, 18.4, 18.5
 */

import {
  getTotalGenerations,
  getGenerationStats,
  getGenerationLogs,
  getErrorLogs,
  logGeneration,
  getContentStats,
  GenerationLog,
  GenerationStat,
} from './db';
import { TopicCategory } from './types';

// ===========================================
// Types
// ===========================================

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface TemplateUsage {
  templateId: string;
  usageCount: number;
  avgQualityScore: number;
  lastUsed: Date;
}

export interface CategoryStats {
  category: string;
  count: number;
  percentage: number;
  avgQualityScore: number;
}

export interface QualityTrend {
  date: string;
  avgQualityScore: number;
  totalGenerations: number;
}

export interface TemplateQuality {
  templateId: string;
  avgQualityScore: number;
  usageCount: number;
  recommendation: 'keep' | 'improve' | 'remove';
}

export interface AnalyticsSummary {
  totalGenerations: number;
  successfulGenerations: number;
  failedGenerations: number;
  avgQualityScore: number;
  avgGenerationTime: number;
  topCategories: CategoryStats[];
  topTemplates: TemplateUsage[];
  recentTrend: 'improving' | 'stable' | 'declining';
}

export interface LogEntry {
  id: number;
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
  context?: Record<string, unknown>;
}

export interface ErrorContext {
  topic?: string;
  category?: string;
  templateId?: string;
  settings?: Record<string, unknown>;
}

// ===========================================
// Analytics Class
// ===========================================

/**
 * SONA Analytics Class
 * يوفر تحليلات شاملة لأداء نظام SONA
 */
export class SONAAnalytics {
  private cache: Map<string, { data: unknown; expiry: number }> = new Map();
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes

  // ===========================================
  // Generation Statistics
  // ===========================================

  /**
   * Get total number of generations
   * Requirements: 18.3
   */
  async getTotalGenerations(period?: DateRange): Promise<number> {
    const cacheKey = `total_${period?.startDate}_${period?.endDate}`;
    const cached = this.getFromCache<number>(cacheKey);
    if (cached !== undefined) return cached;

    try {
      if (period) {
        const stats = await getGenerationStats(
          period.startDate,
          period.endDate
        );
        const total = stats.reduce((sum, s) => sum + s.total_generations, 0);
        this.setCache(cacheKey, total);
        return total;
      }

      const total = await getTotalGenerations();
      this.setCache(cacheKey, total);
      return total;
    } catch (error) {
      console.error('Failed to get total generations:', error);
      return 0;
    }
  }

  /**
   * Get average quality score
   * Requirements: 18.3
   */
  async getAverageQualityScore(period?: DateRange): Promise<number> {
    const cacheKey = `avg_quality_${period?.startDate}_${period?.endDate}`;
    const cached = this.getFromCache<number>(cacheKey);
    if (cached !== undefined) return cached;

    try {
      const stats = await this.getStats(period);
      if (stats.length === 0) return 0;

      const totalQuality = stats.reduce(
        (sum, s) => sum + (s.avg_quality_score || 0) * s.total_generations,
        0
      );
      const totalCount = stats.reduce((sum, s) => sum + s.total_generations, 0);

      const avg = totalCount > 0 ? totalQuality / totalCount : 0;
      this.setCache(cacheKey, avg);
      return Math.round(avg * 100) / 100;
    } catch (error) {
      console.error('Failed to get average quality score:', error);
      return 0;
    }
  }

  /**
   * Get most used templates
   * Requirements: 18.3
   */
  async getMostUsedTemplates(limit: number = 10): Promise<TemplateUsage[]> {
    const cacheKey = `most_used_templates_${limit}`;
    const cached = this.getFromCache<TemplateUsage[]>(cacheKey);
    if (cached !== undefined) return cached;

    try {
      const stats = await this.getStats();
      const templateUsage: Map<string, { count: number; quality: number[] }> =
        new Map();

      for (const stat of stats) {
        const usage = stat.template_usage as Record<string, number> | undefined;
        if (usage) {
          for (const [templateId, count] of Object.entries(usage)) {
            const existing = templateUsage.get(templateId) || {
              count: 0,
              quality: [],
            };
            existing.count += count;
            if (stat.avg_quality_score) {
              existing.quality.push(stat.avg_quality_score);
            }
            templateUsage.set(templateId, existing);
          }
        }
      }

      const result: TemplateUsage[] = Array.from(templateUsage.entries())
        .map(([templateId, data]) => ({
          templateId,
          usageCount: data.count,
          avgQualityScore:
            data.quality.length > 0
              ? data.quality.reduce((a, b) => a + b, 0) / data.quality.length
              : 0,
          lastUsed: new Date(),
        }))
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, limit);

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Failed to get most used templates:', error);
      return [];
    }
  }

  /**
   * Get least used templates
   * Requirements: 18.4
   */
  async getLeastUsedTemplates(limit: number = 10): Promise<TemplateUsage[]> {
    const allTemplates = await this.getMostUsedTemplates(1000);
    return allTemplates.slice(-limit).reverse();
  }

  /**
   * Get category distribution
   * Requirements: 18.3
   */
  async getCategoryDistribution(): Promise<CategoryStats[]> {
    const cacheKey = 'category_distribution';
    const cached = this.getFromCache<CategoryStats[]>(cacheKey);
    if (cached !== undefined) return cached;

    try {
      const stats = await this.getStats();
      const categoryData: Map<string, { count: number; quality: number[] }> =
        new Map();
      let totalCount = 0;

      for (const stat of stats) {
        const breakdown = stat.category_breakdown as
          | Record<string, number>
          | undefined;
        if (breakdown) {
          for (const [category, count] of Object.entries(breakdown)) {
            const existing = categoryData.get(category) || {
              count: 0,
              quality: [],
            };
            existing.count += count;
            if (stat.avg_quality_score) {
              existing.quality.push(stat.avg_quality_score);
            }
            categoryData.set(category, existing);
            totalCount += count;
          }
        }
      }

      const result: CategoryStats[] = Array.from(categoryData.entries())
        .map(([category, data]) => ({
          category,
          count: data.count,
          percentage: totalCount > 0 ? (data.count / totalCount) * 100 : 0,
          avgQualityScore:
            data.quality.length > 0
              ? data.quality.reduce((a, b) => a + b, 0) / data.quality.length
              : 0,
        }))
        .sort((a, b) => b.count - a.count);

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Failed to get category distribution:', error);
      return [];
    }
  }

  // ===========================================
  // Performance Statistics
  // ===========================================

  /**
   * Get average generation time
   * Requirements: 18.3
   */
  async getAverageGenerationTime(): Promise<number> {
    const cacheKey = 'avg_generation_time';
    const cached = this.getFromCache<number>(cacheKey);
    if (cached !== undefined) return cached;

    try {
      const stats = await this.getStats();
      if (stats.length === 0) return 0;

      const totalTime = stats.reduce(
        (sum, s) => sum + (s.avg_generation_time || 0) * s.total_generations,
        0
      );
      const totalCount = stats.reduce((sum, s) => sum + s.total_generations, 0);

      const avg = totalCount > 0 ? totalTime / totalCount : 0;
      this.setCache(cacheKey, avg);
      return Math.round(avg);
    } catch (error) {
      console.error('Failed to get average generation time:', error);
      return 0;
    }
  }

  /**
   * Get error rate
   * Requirements: 18.3
   */
  async getErrorRate(): Promise<number> {
    const cacheKey = 'error_rate';
    const cached = this.getFromCache<number>(cacheKey);
    if (cached !== undefined) return cached;

    try {
      const stats = await this.getStats();
      if (stats.length === 0) return 0;

      const totalFailed = stats.reduce(
        (sum, s) => sum + s.failed_generations,
        0
      );
      const totalCount = stats.reduce((sum, s) => sum + s.total_generations, 0);

      const rate = totalCount > 0 ? (totalFailed / totalCount) * 100 : 0;
      this.setCache(cacheKey, rate);
      return Math.round(rate * 100) / 100;
    } catch (error) {
      console.error('Failed to get error rate:', error);
      return 0;
    }
  }

  /**
   * Get retry rate
   */
  async getRetryRate(): Promise<number> {
    try {
      const logs = await getGenerationLogs(1000);
      if (logs.length === 0) return 0;

      const withRetries = logs.filter((l) => (l.retries || 0) > 0).length;
      return Math.round((withRetries / logs.length) * 100 * 100) / 100;
    } catch (error) {
      console.error('Failed to get retry rate:', error);
      return 0;
    }
  }

  // ===========================================
  // Quality Analysis
  // ===========================================

  /**
   * Get quality trend over time
   * Requirements: 18.3
   */
  async getQualityTrend(period: DateRange): Promise<QualityTrend[]> {
    try {
      const stats = await getGenerationStats(period.startDate, period.endDate);

      return stats.map((s) => ({
        date:
          s.date instanceof Date
            ? s.date.toISOString().split('T')[0]
            : String(s.date),
        avgQualityScore: s.avg_quality_score || 0,
        totalGenerations: s.total_generations,
      }));
    } catch (error) {
      console.error('Failed to get quality trend:', error);
      return [];
    }
  }

  /**
   * Get low quality templates for improvement
   * Requirements: 18.4
   */
  async getLowQualityTemplates(): Promise<TemplateQuality[]> {
    const templates = await this.getMostUsedTemplates(100);

    return templates
      .filter((t) => t.avgQualityScore < 70)
      .map((t) => ({
        templateId: t.templateId,
        avgQualityScore: t.avgQualityScore,
        usageCount: t.usageCount,
        recommendation:
          t.avgQualityScore < 50
            ? 'remove'
            : t.avgQualityScore < 60
            ? 'improve'
            : 'keep',
      })) as TemplateQuality[];
  }

  /**
   * Get diversity score
   */
  async getDiversityScore(): Promise<number> {
    try {
      const templates = await this.getMostUsedTemplates(100);
      if (templates.length === 0) return 0;

      const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0);
      if (totalUsage === 0) return 0;

      // Calculate entropy-based diversity
      let entropy = 0;
      for (const template of templates) {
        const p = template.usageCount / totalUsage;
        if (p > 0) {
          entropy -= p * Math.log2(p);
        }
      }

      // Normalize to 0-100
      const maxEntropy = Math.log2(templates.length);
      const diversity = maxEntropy > 0 ? (entropy / maxEntropy) * 100 : 0;

      return Math.round(diversity * 100) / 100;
    } catch (error) {
      console.error('Failed to get diversity score:', error);
      return 0;
    }
  }

  // ===========================================
  // Summary & Reports
  // ===========================================

  /**
   * Get analytics summary
   * Requirements: 18.3
   */
  async getSummary(period?: DateRange): Promise<AnalyticsSummary> {
    const [
      totalGenerations,
      avgQualityScore,
      avgGenerationTime,
      categoryDistribution,
      topTemplates,
      qualityTrend,
    ] = await Promise.all([
      this.getTotalGenerations(period),
      this.getAverageQualityScore(period),
      this.getAverageGenerationTime(),
      this.getCategoryDistribution(),
      this.getMostUsedTemplates(5),
      period ? this.getQualityTrend(period) : Promise.resolve([]),
    ]);

    // Calculate success/failure
    const stats = await this.getStats(period);
    const successfulGenerations = stats.reduce(
      (sum, s) => sum + s.successful_generations,
      0
    );
    const failedGenerations = stats.reduce(
      (sum, s) => sum + s.failed_generations,
      0
    );

    // Determine trend
    let recentTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (qualityTrend.length >= 3) {
      const recent = qualityTrend.slice(-3);
      const avgRecent =
        recent.reduce((sum, t) => sum + t.avgQualityScore, 0) / recent.length;
      const older = qualityTrend.slice(0, -3);
      if (older.length > 0) {
        const avgOlder =
          older.reduce((sum, t) => sum + t.avgQualityScore, 0) / older.length;
        if (avgRecent > avgOlder + 2) recentTrend = 'improving';
        else if (avgRecent < avgOlder - 2) recentTrend = 'declining';
      }
    }

    return {
      totalGenerations,
      successfulGenerations,
      failedGenerations,
      avgQualityScore,
      avgGenerationTime,
      topCategories: categoryDistribution.slice(0, 5),
      topTemplates,
      recentTrend,
    };
  }

  // ===========================================
  // Helper Methods
  // ===========================================

  /**
   * Get stats from database
   */
  private async getStats(period?: DateRange): Promise<GenerationStat[]> {
    try {
      const endDate = period?.endDate || new Date().toISOString().split('T')[0];
      const startDate =
        period?.startDate ||
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];

      return await getGenerationStats(startDate, endDate);
    } catch (error) {
      console.error('Failed to get stats:', error);
      return [];
    }
  }

  /**
   * Get from cache
   */
  private getFromCache<T>(key: string): T | undefined {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data as T;
    }
    this.cache.delete(key);
    return undefined;
  }

  /**
   * Set cache
   */
  private setCache(key: string, data: unknown): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.cacheTimeout,
    });
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// ===========================================
// Logger Class
// ===========================================

/**
 * SONA Logger Class
 * يوفر تسجيل شامل لعمليات SONA
 */
export class SONALogger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  /**
   * Log a generation operation
   * Requirements: 18.1
   */
  async logGeneration(metadata: {
    topic: string;
    category: TopicCategory | string;
    duration: number;
    qualityScore: number;
    templatesUsed: string[];
    wordCount: number;
    success: boolean;
    retries?: number;
    errorMessage?: string;
  }): Promise<void> {
    try {
      await logGeneration(
        metadata.topic,
        metadata.category,
        metadata.duration,
        metadata.qualityScore,
        metadata.templatesUsed,
        metadata.wordCount,
        metadata.success,
        metadata.retries || 0,
        metadata.errorMessage
      );

      this.addLog({
        level: metadata.success ? 'info' : 'error',
        message: metadata.success
          ? `Generated content for "${metadata.topic}"`
          : `Failed to generate content for "${metadata.topic}"`,
        context: metadata,
      });
    } catch (error) {
      console.error('Failed to log generation:', error);
    }
  }

  /**
   * Log an error
   * Requirements: 18.2
   */
  async logError(error: Error, context: ErrorContext): Promise<void> {
    this.addLog({
      level: 'error',
      message: error.message,
      context: {
        ...context,
        stack: error.stack,
      },
    });

    // Also log to database if it's a generation error
    if (context.topic) {
      try {
        await logGeneration(
          context.topic,
          context.category || 'general',
          0,
          0,
          [],
          0,
          false,
          0,
          error.message
        );
      } catch (dbError) {
        console.error('Failed to log error to database:', dbError);
      }
    }
  }

  /**
   * Log template usage
   */
  async logTemplateUsage(templateId: string): Promise<void> {
    this.addLog({
      level: 'info',
      message: `Template used: ${templateId}`,
      context: { templateId },
    });
  }

  /**
   * Get recent logs
   */
  async getRecentLogs(limit: number = 100): Promise<LogEntry[]> {
    return this.logs.slice(-limit);
  }

  /**
   * Get logs from database
   */
  async getDatabaseLogs(limit: number = 100): Promise<GenerationLog[]> {
    try {
      return await getGenerationLogs(limit);
    } catch (error) {
      console.error('Failed to get database logs:', error);
      return [];
    }
  }

  /**
   * Get error logs
   */
  async getErrorLogs(limit: number = 50): Promise<GenerationLog[]> {
    try {
      return await getErrorLogs(limit);
    } catch (error) {
      console.error('Failed to get error logs:', error);
      return [];
    }
  }

  /**
   * Export logs as JSON
   * Requirements: 18.5
   */
  async exportLogs(
    period: DateRange,
    format: 'json' | 'csv' = 'json'
  ): Promise<string> {
    try {
      const logs = await getGenerationLogs(10000);

      // Filter by period
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
      const filteredLogs = logs.filter((log) => {
        const logDate = log.timestamp ? new Date(log.timestamp) : new Date();
        return logDate >= startDate && logDate <= endDate;
      });

      if (format === 'csv') {
        return this.logsToCSV(filteredLogs);
      }

      return JSON.stringify(filteredLogs, null, 2);
    } catch (error) {
      console.error('Failed to export logs:', error);
      return format === 'csv' ? '' : '[]';
    }
  }

  /**
   * Convert logs to CSV
   */
  private logsToCSV(logs: GenerationLog[]): string {
    const headers = [
      'التاريخ',
      'الموضوع',
      'الفئة',
      'المدة (مللي ثانية)',
      'درجة الجودة',
      'عدد الكلمات',
      'النجاح',
      'المحاولات',
      'رسالة الخطأ',
    ];

    const rows = logs.map((log) => [
      log.timestamp?.toISOString() || '',
      log.topic,
      log.category,
      log.duration,
      log.quality_score || 0,
      log.word_count,
      log.success ? 'نعم' : 'لا',
      log.retries || 0,
      log.error_message || '',
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }

  /**
   * Add log entry
   */
  private addLog(entry: Omit<LogEntry, 'id' | 'timestamp'>): void {
    const logEntry: LogEntry = {
      id: this.logs.length + 1,
      timestamp: new Date(),
      ...entry,
    };

    this.logs.push(logEntry);

    // Trim if exceeds max
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
  }
}

// ===========================================
// Singleton Instances
// ===========================================

export const sonaAnalytics = new SONAAnalytics();
export const sonaLogger = new SONALogger();
