/**
 * SONA v4 Content Tracker
 * متتبع المحتوى - يتتبع المحتوى المولد ويمنع التكرار
 *
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5
 */

import * as crypto from 'crypto';
import {
  saveContentHash,
  contentHashExists,
  getRecentContentHashes,
  recordGenerationStats,
  logGeneration,
  getTotalGenerations,
  getGenerationStats,
  ContentHash,
  GenerationStat,
} from './db';
import { TopicCategory } from './types';

// Types
export interface ContentMetadata {
  topic: string;
  category: TopicCategory;
  generatedAt: Date;
  usedTemplates: string[];
  wordCount: number;
  qualityScore: number;
}

export interface SimilarityResult {
  isSimilar: boolean;
  similarityScore: number;
  matchingHash?: string;
}

export interface GenerationStats {
  totalGenerations: number;
  todayGenerations: number;
  averageQualityScore: number;
  categoryBreakdown: Record<string, number>;
  mostUsedTemplates: { template: string; count: number }[];
}

export interface TrackingResult {
  tracked: boolean;
  hash: string;
  isDuplicate: boolean;
}

/**
 * Content Tracker Class
 * يتتبع المحتوى المولد ويمنع التكرار
 */
export class ContentTracker {
  private recentHashes: Map<string, number> = new Map();
  private maxCacheSize: number = 1000;

  /**
   * Generate content hash
   */
  generateHash(content: string): string {
    // Normalize content before hashing
    const normalized = this.normalizeContent(content);
    return crypto.createHash('sha256').update(normalized).digest('hex');
  }

  /**
   * Normalize content for comparison
   */
  private normalizeContent(content: string): string {
    return content
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, '')
      .trim();
  }

  /**
   * Calculate similarity between two texts using Jaccard similarity
   */
  calculateSimilarity(text1: string, text2: string): number {
    const words1 = new Set(this.normalizeContent(text1).split(' '));
    const words2 = new Set(this.normalizeContent(text2).split(' '));

    const intersection = new Set([...words1].filter((x) => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    if (union.size === 0) return 0;
    return intersection.size / union.size;
  }

  /**
   * Check if content is similar to existing content
   * Requirements: 12.2
   */
  async checkSimilarity(content: string): Promise<SimilarityResult> {
    const hash = this.generateHash(content);

    // Check exact match first
    const exists = await contentHashExists(hash);
    if (exists) {
      return {
        isSimilar: true,
        similarityScore: 1.0,
        matchingHash: hash,
      };
    }

    // Check in-memory cache for recent hashes
    if (this.recentHashes.has(hash)) {
      return {
        isSimilar: true,
        similarityScore: 1.0,
        matchingHash: hash,
      };
    }

    // For more thorough check, compare with recent content
    // This is a simplified version - in production, you might use
    // more sophisticated similarity algorithms
    const recentHashes = await getRecentContentHashes(50);

    for (const existing of recentHashes) {
      // We can't compare content directly without storing it
      // So we rely on hash comparison for exact matches
      if (existing.content_hash === hash) {
        return {
          isSimilar: true,
          similarityScore: 1.0,
          matchingHash: existing.content_hash,
        };
      }
    }

    return {
      isSimilar: false,
      similarityScore: 0,
    };
  }

  /**
   * Save content hash and metadata
   * Requirements: 12.1
   */
  async saveContentHash(
    content: string,
    metadata: ContentMetadata
  ): Promise<TrackingResult> {
    const hash = this.generateHash(content);

    // Check if already exists
    const exists = await contentHashExists(hash);
    if (exists) {
      return {
        tracked: false,
        hash,
        isDuplicate: true,
      };
    }

    // Save to database
    await saveContentHash(
      hash,
      metadata.topic,
      metadata.category,
      metadata.wordCount,
      metadata.qualityScore,
      metadata.usedTemplates
    );

    // Add to in-memory cache
    this.addToCache(hash);

    return {
      tracked: true,
      hash,
      isDuplicate: false,
    };
  }

  /**
   * Add hash to in-memory cache
   */
  private addToCache(hash: string): void {
    // Remove oldest entries if cache is full
    if (this.recentHashes.size >= this.maxCacheSize) {
      const oldest = [...this.recentHashes.entries()].sort(
        (a, b) => a[1] - b[1]
      )[0];
      if (oldest) {
        this.recentHashes.delete(oldest[0]);
      }
    }

    this.recentHashes.set(hash, Date.now());
  }

  /**
   * Record generation event
   * Requirements: 12.4
   */
  async recordGeneration(
    metadata: ContentMetadata,
    duration: number,
    success: boolean,
    retries: number = 0,
    errorMessage?: string
  ): Promise<void> {
    // Log the generation
    await logGeneration(
      metadata.topic,
      metadata.category,
      duration,
      metadata.qualityScore,
      metadata.usedTemplates,
      metadata.wordCount,
      success,
      retries,
      errorMessage
    );

    // Update daily stats
    await recordGenerationStats(
      success,
      metadata.qualityScore,
      duration,
      metadata.category,
      metadata.usedTemplates
    );
  }

  /**
   * Get generation statistics
   * Requirements: 12.5
   */
  async getStats(): Promise<GenerationStats> {
    const total = await getTotalGenerations();

    // Get today's stats
    const today = new Date().toISOString().split('T')[0];
    const todayStats = await getGenerationStats(today, today);

    // Get last 30 days stats
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentStats = await getGenerationStats(
      thirtyDaysAgo.toISOString().split('T')[0],
      today
    );

    // Calculate averages and breakdowns
    let totalQuality = 0;
    let qualityCount = 0;
    const categoryBreakdown: Record<string, number> = {};
    const templateUsage: Record<string, number> = {};

    for (const stat of recentStats) {
      if (stat.avg_quality_score) {
        totalQuality += stat.avg_quality_score * stat.total_generations;
        qualityCount += stat.total_generations;
      }

      // Merge category breakdowns
      if (stat.category_breakdown) {
        for (const [cat, count] of Object.entries(stat.category_breakdown)) {
          categoryBreakdown[cat] =
            (categoryBreakdown[cat] || 0) + (count as number);
        }
      }

      // Merge template usage
      if (stat.template_usage) {
        for (const [template, count] of Object.entries(stat.template_usage)) {
          templateUsage[template] =
            (templateUsage[template] || 0) + (count as number);
        }
      }
    }

    // Sort templates by usage
    const mostUsedTemplates = Object.entries(templateUsage)
      .map(([template, count]) => ({ template, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalGenerations: total,
      todayGenerations: todayStats[0]?.total_generations || 0,
      averageQualityScore: qualityCount > 0 ? totalQuality / qualityCount : 0,
      categoryBreakdown,
      mostUsedTemplates,
    };
  }

  /**
   * Check if content is unique enough (less than 50% similar)
   * Requirements: 12.2
   */
  async isUniqueEnough(
    content: string,
    threshold: number = 0.5
  ): Promise<boolean> {
    const result = await this.checkSimilarity(content);
    return !result.isSimilar || result.similarityScore < threshold;
  }

  /**
   * Clear in-memory cache
   */
  clearCache(): void {
    this.recentHashes.clear();
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.recentHashes.size;
  }
}

// Export singleton instance
export const contentTracker = new ContentTracker();
