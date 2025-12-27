/**
 * SONA v4 Sandbox Manager
 * مدير بيئة الاختبار - يدير جلسات الاختبار المعزولة
 *
 * Requirements: 17.1, 17.2, 17.3, 17.4, 17.5
 */

import * as crypto from 'crypto';
import {
  createSandboxSession as dbCreateSession,
  getSandboxSession as dbGetSession,
  updateSandboxContent as dbUpdateContent,
  closeSandboxSession as dbCloseSession,
  cleanupExpiredSandboxSessions,
  SandboxSession as DbSandboxSession,
} from './db';
import { SONASettings, DEFAULT_SETTINGS } from './settingsManager';
import { GeneratedContent, TopicCategory } from './types';

// ===========================================
// Types
// ===========================================

export interface SandboxSession {
  id: string;
  sessionId: string;
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  settings: Partial<SONASettings>;
  templatesOverride?: Record<string, unknown>;
  generatedContent: SandboxGeneratedContent[];
}

export interface SandboxGeneratedContent {
  id: string;
  topic: string;
  category: TopicCategory;
  content: string;
  title: string;
  wordCount: number;
  qualityScore: number;
  generatedAt: Date;
}

export interface SandboxGenerationRequest {
  topic: string;
  length?: 'short' | 'medium' | 'long' | 'comprehensive';
  style?: 'formal' | 'casual' | 'seo';
  category?: TopicCategory;
  includeKeywords?: string[];
}

export interface ComparisonResult {
  sandbox: SandboxGeneratedContent;
  production: SandboxGeneratedContent;
  differences: {
    qualityScoreDiff: number;
    wordCountDiff: number;
    keywordDensityDiff: number;
    structureDiff: string[];
  };
  recommendation: 'promote' | 'keep_production' | 'needs_review';
}

export interface PromotionResult {
  success: boolean;
  promotedSettings?: Partial<SONASettings>;
  promotedTemplates?: string[];
  errors: string[];
}

// ===========================================
// Sandbox Manager Class
// ===========================================

/**
 * Sandbox Manager Class
 * يدير جلسات الاختبار المعزولة
 */
export class SandboxManager {
  private activeSessions: Map<string, SandboxSession> = new Map();
  private maxSessionAge: number = 24 * 60 * 60 * 1000; // 24 hours
  private maxContentPerSession: number = 50;

  /**
   * Create a new sandbox session
   * Requirements: 17.1
   */
  async createSandbox(
    settings?: Partial<SONASettings>
  ): Promise<SandboxSession> {
    const sessionId = this.generateSessionId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.maxSessionAge);

    const session: SandboxSession = {
      id: sessionId,
      sessionId,
      createdAt: now,
      expiresAt,
      isActive: true,
      settings: settings || {},
      generatedContent: [],
    };

    // Store in memory
    this.activeSessions.set(sessionId, session);

    // Try to persist to database
    try {
      await dbCreateSession(settings);
    } catch (error) {
      console.warn('Failed to persist sandbox session to database:', error);
    }

    return session;
  }

  /**
   * Get an existing sandbox session
   */
  async getSandbox(sessionId: string): Promise<SandboxSession | undefined> {
    // Check memory first
    const memorySession = this.activeSessions.get(sessionId);
    if (memorySession) {
      // Check if expired
      if (memorySession.expiresAt && new Date() > memorySession.expiresAt) {
        await this.destroySandbox(sessionId);
        return undefined;
      }
      return memorySession;
    }

    // Try database
    try {
      const dbSession = await dbGetSession(sessionId);
      if (dbSession) {
        const session = this.convertDbSession(dbSession);
        this.activeSessions.set(sessionId, session);
        return session;
      }
    } catch (error) {
      console.warn('Failed to get sandbox session from database:', error);
    }

    return undefined;
  }

  /**
   * Destroy a sandbox session
   */
  async destroySandbox(sessionId: string): Promise<void> {
    this.activeSessions.delete(sessionId);

    try {
      await dbCloseSession(sessionId);
    } catch (error) {
      console.warn('Failed to close sandbox session in database:', error);
    }
  }

  /**
   * Generate content in sandbox (isolated from production)
   * Requirements: 17.2
   */
  async generateInSandbox(
    sessionId: string,
    request: SandboxGenerationRequest
  ): Promise<SandboxGeneratedContent | undefined> {
    const session = await this.getSandbox(sessionId);
    if (!session) {
      return undefined;
    }

    // Check content limit
    if (session.generatedContent.length >= this.maxContentPerSession) {
      throw new Error(
        `Maximum content limit (${this.maxContentPerSession}) reached for this session`
      );
    }

    // Generate content using sandbox settings
    const mergedSettings = { ...DEFAULT_SETTINGS, ...session.settings };
    const content = await this.simulateGeneration(request, mergedSettings);

    // Add to session
    session.generatedContent.push(content);

    // Update in database
    try {
      await dbUpdateContent(sessionId, content);
    } catch (error) {
      console.warn('Failed to update sandbox content in database:', error);
    }

    return content;
  }

  /**
   * Simulate content generation (for sandbox testing)
   */
  private async simulateGeneration(
    request: SandboxGenerationRequest,
    settings: SONASettings
  ): Promise<SandboxGeneratedContent> {
    const wordCount = settings.wordCountTargets[request.length || 'medium'];
    const qualityScore = 70 + Math.random() * 25; // 70-95

    return {
      id: this.generateContentId(),
      topic: request.topic,
      category: request.category || 'general',
      content: this.generatePlaceholderContent(request.topic, wordCount),
      title: `مقال عن ${request.topic}`,
      wordCount,
      qualityScore: Math.round(qualityScore * 100) / 100,
      generatedAt: new Date(),
    };
  }

  /**
   * Generate placeholder content for testing
   */
  private generatePlaceholderContent(topic: string, wordCount: number): string {
    const paragraphs: string[] = [];
    const wordsPerParagraph = 100;
    const numParagraphs = Math.ceil(wordCount / wordsPerParagraph);

    paragraphs.push(`<h1>مقال شامل عن ${topic}</h1>`);
    paragraphs.push(
      `<p>مرحباً بكم في هذا المقال الذي يتناول موضوع ${topic} بالتفصيل.</p>`
    );

    for (let i = 0; i < numParagraphs - 2; i++) {
      paragraphs.push(
        `<p>هذا محتوى تجريبي للفقرة ${i + 1} في مقال ${topic}. ` +
          `يحتوي على معلومات مفيدة ومتنوعة حول الموضوع.</p>`
      );
    }

    paragraphs.push(
      `<p>في الختام، نأمل أن يكون هذا المقال قد أفادكم في فهم ${topic}.</p>`
    );

    return paragraphs.join('\n');
  }

  /**
   * Compare sandbox content with production
   * Requirements: 17.3, 17.4
   */
  async compareWithProduction(
    sessionId: string,
    sandboxContentId: string,
    productionContent: SandboxGeneratedContent
  ): Promise<ComparisonResult | undefined> {
    const session = await this.getSandbox(sessionId);
    if (!session) {
      return undefined;
    }

    const sandboxContent = session.generatedContent.find(
      (c) => c.id === sandboxContentId
    );
    if (!sandboxContent) {
      return undefined;
    }

    const qualityScoreDiff =
      sandboxContent.qualityScore - productionContent.qualityScore;
    const wordCountDiff =
      sandboxContent.wordCount - productionContent.wordCount;

    // Calculate structure differences
    const structureDiff = this.compareStructure(
      sandboxContent.content,
      productionContent.content
    );

    // Determine recommendation
    let recommendation: 'promote' | 'keep_production' | 'needs_review';
    if (qualityScoreDiff > 5) {
      recommendation = 'promote';
    } else if (qualityScoreDiff < -5) {
      recommendation = 'keep_production';
    } else {
      recommendation = 'needs_review';
    }

    return {
      sandbox: sandboxContent,
      production: productionContent,
      differences: {
        qualityScoreDiff,
        wordCountDiff,
        keywordDensityDiff: 0, // Would need actual keyword analysis
        structureDiff,
      },
      recommendation,
    };
  }

  /**
   * Compare content structure
   */
  private compareStructure(content1: string, content2: string): string[] {
    const diffs: string[] = [];

    // Count headings
    const h1Count1 = (content1.match(/<h1>/g) || []).length;
    const h1Count2 = (content2.match(/<h1>/g) || []).length;
    if (h1Count1 !== h1Count2) {
      diffs.push(`عدد العناوين الرئيسية: ${h1Count1} vs ${h1Count2}`);
    }

    const h2Count1 = (content1.match(/<h2>/g) || []).length;
    const h2Count2 = (content2.match(/<h2>/g) || []).length;
    if (h2Count1 !== h2Count2) {
      diffs.push(`عدد العناوين الفرعية: ${h2Count1} vs ${h2Count2}`);
    }

    // Count paragraphs
    const pCount1 = (content1.match(/<p>/g) || []).length;
    const pCount2 = (content2.match(/<p>/g) || []).length;
    if (pCount1 !== pCount2) {
      diffs.push(`عدد الفقرات: ${pCount1} vs ${pCount2}`);
    }

    // Count lists
    const ulCount1 = (content1.match(/<ul>/g) || []).length;
    const ulCount2 = (content2.match(/<ul>/g) || []).length;
    if (ulCount1 !== ulCount2) {
      diffs.push(`عدد القوائم: ${ulCount1} vs ${ulCount2}`);
    }

    return diffs;
  }

  /**
   * Promote sandbox settings to production
   * Requirements: 17.5
   */
  async promoteToProduction(sessionId: string): Promise<PromotionResult> {
    const session = await this.getSandbox(sessionId);
    if (!session) {
      return {
        success: false,
        errors: ['Session not found'],
      };
    }

    const result: PromotionResult = {
      success: true,
      promotedSettings: session.settings,
      promotedTemplates: [],
      errors: [],
    };

    // In a real implementation, this would:
    // 1. Update production settings
    // 2. Copy any custom templates
    // 3. Log the promotion

    // Close the sandbox session after promotion
    await this.destroySandbox(sessionId);

    return result;
  }

  /**
   * Update sandbox settings
   */
  async updateSandboxSettings(
    sessionId: string,
    settings: Partial<SONASettings>
  ): Promise<boolean> {
    const session = await this.getSandbox(sessionId);
    if (!session) {
      return false;
    }

    session.settings = { ...session.settings, ...settings };
    return true;
  }

  /**
   * Get all content from a sandbox session
   */
  async getSandboxContent(
    sessionId: string
  ): Promise<SandboxGeneratedContent[]> {
    const session = await this.getSandbox(sessionId);
    return session?.generatedContent || [];
  }

  /**
   * Clear content from a sandbox session
   */
  async clearSandboxContent(sessionId: string): Promise<boolean> {
    const session = await this.getSandbox(sessionId);
    if (!session) {
      return false;
    }

    session.generatedContent = [];
    return true;
  }

  /**
   * Get all active sessions
   */
  getActiveSessions(): SandboxSession[] {
    return Array.from(this.activeSessions.values()).filter((s) => s.isActive);
  }

  /**
   * Get session count
   */
  getSessionCount(): number {
    return this.activeSessions.size;
  }

  /**
   * Cleanup expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    let cleaned = 0;
    const now = new Date();

    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (session.expiresAt && now > session.expiresAt) {
        this.activeSessions.delete(sessionId);
        cleaned++;
      }
    }

    // Also cleanup in database
    try {
      const dbCleaned = await cleanupExpiredSandboxSessions();
      cleaned += dbCleaned;
    } catch (error) {
      console.warn('Failed to cleanup expired sessions in database:', error);
    }

    return cleaned;
  }

  // ===========================================
  // Helper Methods
  // ===========================================

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generate unique content ID
   */
  private generateContentId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Convert database session to local format
   */
  private convertDbSession(dbSession: DbSandboxSession): SandboxSession {
    return {
      id: dbSession.session_id,
      sessionId: dbSession.session_id,
      createdAt: dbSession.created_at,
      expiresAt: dbSession.expires_at,
      isActive: dbSession.is_active,
      settings: (dbSession.settings as Partial<SONASettings>) || {},
      templatesOverride: dbSession.templates_override as
        | Record<string, unknown>
        | undefined,
      generatedContent: (dbSession.generated_content ||
        []) as SandboxGeneratedContent[],
    };
  }

  /**
   * Check if session is valid
   */
  isSessionValid(sessionId: string): boolean {
    const session = this.activeSessions.get(sessionId);
    if (!session) return false;
    if (!session.isActive) return false;
    if (session.expiresAt && new Date() > session.expiresAt) return false;
    return true;
  }

  /**
   * Get session statistics
   */
  getSessionStats(sessionId: string): {
    contentCount: number;
    avgQualityScore: number;
    totalWordCount: number;
  } | null {
    const session = this.activeSessions.get(sessionId);
    if (!session) return null;

    const content = session.generatedContent;
    const contentCount = content.length;

    if (contentCount === 0) {
      return { contentCount: 0, avgQualityScore: 0, totalWordCount: 0 };
    }

    const avgQualityScore =
      content.reduce((sum, c) => sum + c.qualityScore, 0) / contentCount;
    const totalWordCount = content.reduce((sum, c) => sum + c.wordCount, 0);

    return {
      contentCount,
      avgQualityScore: Math.round(avgQualityScore * 100) / 100,
      totalWordCount,
    };
  }

  /**
   * Clear all sessions (for testing)
   */
  clearAllSessions(): void {
    this.activeSessions.clear();
  }
}

// Export singleton instance
export const sandboxManager = new SandboxManager();
