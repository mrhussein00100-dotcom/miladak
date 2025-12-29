/**
 * SONA v4 Sandbox Manager Property Tests
 *
 * **Feature: sona-v4-enhancement, Property 17: Sandbox Isolation**
 * **Validates: Requirements 17.2**
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import {
  SandboxManager,
  SandboxSession,
  SandboxGeneratedContent,
} from '../../lib/sona/sandboxManager';

describe('Sandbox Manager Tests', () => {
  let manager: SandboxManager;

  beforeEach(() => {
    manager = new SandboxManager();
  });

  afterEach(() => {
    manager.clearAllSessions();
  });

  describe('Basic Functionality - Requirements 17.1', () => {
    it('should create sandbox manager instance', () => {
      expect(manager).toBeDefined();
      expect(typeof manager.createSandbox).toBe('function');
      expect(typeof manager.getSandbox).toBe('function');
      expect(typeof manager.destroySandbox).toBe('function');
      expect(typeof manager.generateInSandbox).toBe('function');
    });

    it('should create a new sandbox session', async () => {
      const session = await manager.createSandbox();

      expect(session).toBeDefined();
      expect(session.sessionId).toBeDefined();
      expect(session.isActive).toBe(true);
      expect(session.generatedContent).toHaveLength(0);
    });

    it('should create sandbox with custom settings', async () => {
      const customSettings = {
        articleLength: 'long' as const,
        keywordDensity: 4,
      };

      const session = await manager.createSandbox(customSettings);

      expect(session.settings.articleLength).toBe('long');
      expect(session.settings.keywordDensity).toBe(4);
    });

    it('should retrieve an existing sandbox session', async () => {
      const created = await manager.createSandbox();
      const retrieved = await manager.getSandbox(created.sessionId);

      expect(retrieved).toBeDefined();
      expect(retrieved?.sessionId).toBe(created.sessionId);
    });

    it('should return undefined for non-existent session', async () => {
      const session = await manager.getSandbox('non-existent-id');

      expect(session).toBeUndefined();
    });

    it('should destroy a sandbox session', async () => {
      const session = await manager.createSandbox();
      await manager.destroySandbox(session.sessionId);

      const retrieved = await manager.getSandbox(session.sessionId);
      expect(retrieved).toBeUndefined();
    });
  });

  describe('Property 17: Sandbox Isolation - Requirements 17.2', () => {
    /**
     * **Feature: sona-v4-enhancement, Property 17: Sandbox Isolation**
     * **Validates: Requirements 17.2**
     *
     * For any content generated in sandbox mode, it should not
     * affect production data or statistics
     */

    it('should isolate sandbox content from other sessions', async () => {
      const session1 = await manager.createSandbox();
      const session2 = await manager.createSandbox();

      // Generate content in session 1
      await manager.generateInSandbox(session1.sessionId, {
        topic: 'موضوع الجلسة الأولى',
      });

      // Session 2 should not have this content
      const session2Content = await manager.getSandboxContent(
        session2.sessionId
      );
      expect(session2Content).toHaveLength(0);

      // Session 1 should have the content
      const session1Content = await manager.getSandboxContent(
        session1.sessionId
      );
      expect(session1Content).toHaveLength(1);
    });

    it('should maintain separate settings per session', async () => {
      const session1 = await manager.createSandbox({ keywordDensity: 2 });
      const session2 = await manager.createSandbox({ keywordDensity: 5 });

      const retrieved1 = await manager.getSandbox(session1.sessionId);
      const retrieved2 = await manager.getSandbox(session2.sessionId);

      expect(retrieved1?.settings.keywordDensity).toBe(2);
      expect(retrieved2?.settings.keywordDensity).toBe(5);
    });

    it('should not affect session count when generating content', async () => {
      const session = await manager.createSandbox();
      const initialCount = manager.getSessionCount();

      await manager.generateInSandbox(session.sessionId, {
        topic: 'موضوع اختباري',
      });

      expect(manager.getSessionCount()).toBe(initialCount);
    });
  });

  describe('Content Generation - Requirements 17.2, 17.3', () => {
    it('should generate content in sandbox', async () => {
      const session = await manager.createSandbox();
      const content = await manager.generateInSandbox(session.sessionId, {
        topic: 'برج الحمل',
        category: 'zodiac',
      });

      expect(content).toBeDefined();
      expect(content?.topic).toBe('برج الحمل');
      expect(content?.category).toBe('zodiac');
      expect(content?.content).toBeDefined();
      expect(content?.wordCount).toBeGreaterThan(0);
    });

    it('should return undefined for invalid session', async () => {
      const content = await manager.generateInSandbox('invalid-session', {
        topic: 'موضوع',
      });

      expect(content).toBeUndefined();
    });

    it('should accumulate content in session', async () => {
      const session = await manager.createSandbox();

      await manager.generateInSandbox(session.sessionId, { topic: 'موضوع 1' });
      await manager.generateInSandbox(session.sessionId, { topic: 'موضوع 2' });
      await manager.generateInSandbox(session.sessionId, { topic: 'موضوع 3' });

      const content = await manager.getSandboxContent(session.sessionId);
      expect(content).toHaveLength(3);
    });

    it('should clear sandbox content', async () => {
      const session = await manager.createSandbox();
      await manager.generateInSandbox(session.sessionId, { topic: 'موضوع' });

      const cleared = await manager.clearSandboxContent(session.sessionId);
      expect(cleared).toBe(true);

      const content = await manager.getSandboxContent(session.sessionId);
      expect(content).toHaveLength(0);
    });
  });

  describe('Comparison - Requirements 17.3, 17.4', () => {
    it('should compare sandbox with production content', async () => {
      const session = await manager.createSandbox();
      const sandboxContent = await manager.generateInSandbox(
        session.sessionId,
        { topic: 'موضوع مقارنة' }
      );

      const productionContent: SandboxGeneratedContent = {
        id: 'prod-1',
        topic: 'موضوع مقارنة',
        category: 'general',
        content: '<h1>عنوان</h1><p>محتوى</p>',
        title: 'عنوان المقال',
        wordCount: 500,
        qualityScore: 75,
        generatedAt: new Date(),
      };

      const comparison = await manager.compareWithProduction(
        session.sessionId,
        sandboxContent!.id,
        productionContent
      );

      expect(comparison).toBeDefined();
      expect(comparison?.sandbox).toBeDefined();
      expect(comparison?.production).toBeDefined();
      expect(comparison?.differences).toBeDefined();
      expect(comparison?.recommendation).toBeDefined();
    });

    it('should return undefined for invalid comparison', async () => {
      const session = await manager.createSandbox();

      const productionContent: SandboxGeneratedContent = {
        id: 'prod-1',
        topic: 'موضوع',
        category: 'general',
        content: '',
        title: '',
        wordCount: 0,
        qualityScore: 0,
        generatedAt: new Date(),
      };

      const comparison = await manager.compareWithProduction(
        session.sessionId,
        'non-existent-content',
        productionContent
      );

      expect(comparison).toBeUndefined();
    });
  });

  describe('Promotion - Requirements 17.5', () => {
    it('should promote sandbox to production', async () => {
      const session = await manager.createSandbox({
        keywordDensity: 4,
        articleLength: 'long',
      });

      const result = await manager.promoteToProduction(session.sessionId);

      expect(result.success).toBe(true);
      expect(result.promotedSettings?.keywordDensity).toBe(4);
      expect(result.promotedSettings?.articleLength).toBe('long');
    });

    it('should close session after promotion', async () => {
      const session = await manager.createSandbox();
      await manager.promoteToProduction(session.sessionId);

      const retrieved = await manager.getSandbox(session.sessionId);
      expect(retrieved).toBeUndefined();
    });

    it('should return error for non-existent session', async () => {
      const result = await manager.promoteToProduction('non-existent');

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Session not found');
    });
  });

  describe('Session Management', () => {
    it('should update sandbox settings', async () => {
      const session = await manager.createSandbox({ keywordDensity: 2 });

      const updated = await manager.updateSandboxSettings(session.sessionId, {
        keywordDensity: 5,
      });

      expect(updated).toBe(true);

      const retrieved = await manager.getSandbox(session.sessionId);
      expect(retrieved?.settings.keywordDensity).toBe(5);
    });

    it('should return false for updating non-existent session', async () => {
      const updated = await manager.updateSandboxSettings('non-existent', {
        keywordDensity: 5,
      });

      expect(updated).toBe(false);
    });

    it('should get active sessions', async () => {
      await manager.createSandbox();
      await manager.createSandbox();

      const activeSessions = manager.getActiveSessions();

      expect(activeSessions).toHaveLength(2);
    });

    it('should get session count', async () => {
      expect(manager.getSessionCount()).toBe(0);

      await manager.createSandbox();
      expect(manager.getSessionCount()).toBe(1);

      await manager.createSandbox();
      expect(manager.getSessionCount()).toBe(2);
    });

    it('should validate session', async () => {
      const session = await manager.createSandbox();

      expect(manager.isSessionValid(session.sessionId)).toBe(true);
      expect(manager.isSessionValid('non-existent')).toBe(false);
    });
  });

  describe('Session Statistics', () => {
    it('should get session statistics', async () => {
      const session = await manager.createSandbox();
      await manager.generateInSandbox(session.sessionId, { topic: 'موضوع 1' });
      await manager.generateInSandbox(session.sessionId, { topic: 'موضوع 2' });

      const stats = manager.getSessionStats(session.sessionId);

      expect(stats).toBeDefined();
      expect(stats?.contentCount).toBe(2);
      expect(stats?.avgQualityScore).toBeGreaterThan(0);
      expect(stats?.totalWordCount).toBeGreaterThan(0);
    });

    it('should return null for non-existent session stats', () => {
      const stats = manager.getSessionStats('non-existent');

      expect(stats).toBeNull();
    });

    it('should handle empty session stats', async () => {
      const session = await manager.createSandbox();
      const stats = manager.getSessionStats(session.sessionId);

      expect(stats?.contentCount).toBe(0);
      expect(stats?.avgQualityScore).toBe(0);
      expect(stats?.totalWordCount).toBe(0);
    });
  });

  describe('Property Tests', () => {
    it('should maintain session isolation across multiple operations', async () => {
      // Clear sessions first
      manager.clearAllSessions();

      const session1 = await manager.createSandbox();
      const session2 = await manager.createSandbox();

      // Generate content in session 1
      await manager.generateInSandbox(session1.sessionId, { topic: 'موضوع 1' });
      await manager.generateInSandbox(session1.sessionId, { topic: 'موضوع 2' });

      // Session 2 should remain empty
      const session2Content = await manager.getSandboxContent(
        session2.sessionId
      );
      expect(session2Content).toHaveLength(0);

      // Session 1 should have all content
      const session1Content = await manager.getSandboxContent(
        session1.sessionId
      );
      expect(session1Content).toHaveLength(2);

      // Cleanup
      manager.clearAllSessions();
    });

    it('should generate unique session IDs', async () => {
      manager.clearAllSessions();

      const sessions: SandboxSession[] = [];
      const count = 5;

      for (let i = 0; i < count; i++) {
        sessions.push(await manager.createSandbox());
      }

      const ids = sessions.map((s) => s.sessionId);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(count);

      // Cleanup
      manager.clearAllSessions();
    });
  });

  describe('Edge Cases', () => {
    it('should handle Arabic topics', async () => {
      const session = await manager.createSandbox();
      const content = await manager.generateInSandbox(session.sessionId, {
        topic: 'برج الحمل وصفاته الشخصية',
        category: 'zodiac',
      });

      expect(content?.topic).toBe('برج الحمل وصفاته الشخصية');
      expect(content?.content).toContain('برج الحمل');
    });

    it('should handle mixed Arabic and English', async () => {
      const session = await manager.createSandbox();
      const content = await manager.generateInSandbox(session.sessionId, {
        topic: 'Birthday عيد ميلاد 2024',
      });

      expect(content?.topic).toBe('Birthday عيد ميلاد 2024');
    });

    it('should clear all sessions', async () => {
      // Clear first to ensure clean state
      manager.clearAllSessions();

      await manager.createSandbox();
      await manager.createSandbox();
      await manager.createSandbox();

      expect(manager.getSessionCount()).toBe(3);

      manager.clearAllSessions();

      expect(manager.getSessionCount()).toBe(0);
    });
  });
});
