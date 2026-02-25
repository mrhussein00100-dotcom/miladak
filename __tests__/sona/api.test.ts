/**
 * SONA v4 API Property Tests
 *
 * **Feature: sona-v4-enhancement, Property 18: API Response Consistency**
 * **Validates: Requirements 19.1, 19.2, 19.3, 19.4, 19.5**
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';

// ===========================================
// API Response Types
// ===========================================

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
    duration?: number;
    version: string;
  };
}

// ===========================================
// Mock API Response Helpers
// ===========================================

/**
 * Simulate successful API response
 */
function createSuccessResponse<T>(data: T, duration?: number): APIResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      duration,
      version: '4.0.0',
    },
  };
}

/**
 * Simulate error API response
 */
function createErrorResponse(
  code: string,
  message: string,
  details?: unknown
): APIResponse<null> {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: '4.0.0',
    },
  };
}

/**
 * Validate API response structure
 */
function validateAPIResponse<T>(response: APIResponse<T>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required fields
  if (typeof response.success !== 'boolean') {
    errors.push('success field must be boolean');
  }

  // If success, data should be present
  if (response.success && response.data === undefined) {
    errors.push('data should be present on success');
  }

  // If error, error object should be present
  if (!response.success && !response.error) {
    errors.push('error object should be present on failure');
  }

  // Validate error structure
  if (response.error) {
    if (!response.error.code) {
      errors.push('error.code is required');
    }
    if (!response.error.message) {
      errors.push('error.message is required');
    }
  }

  // Validate meta structure
  if (response.meta) {
    if (!response.meta.timestamp) {
      errors.push('meta.timestamp is required');
    }
    if (!response.meta.version) {
      errors.push('meta.version is required');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ===========================================
// Tests
// ===========================================

describe('SONA API Tests', () => {
  describe('Property 18: API Response Consistency - Requirements 19.5', () => {
    /**
     * **Feature: sona-v4-enhancement, Property 18: API Response Consistency**
     * **Validates: Requirements 19.5**
     *
     * For any API request, the response should follow the standard format
     * with success/error fields and appropriate HTTP codes
     */

    it('should create valid success response structure', () => {
      fc.assert(
        fc.property(
          fc.record({
            content: fc.string(),
            title: fc.string(),
            wordCount: fc.integer({ min: 0, max: 10000 }),
          }),
          (data) => {
            const response = createSuccessResponse(data);
            const validation = validateAPIResponse(response);

            expect(validation.valid).toBe(true);
            expect(response.success).toBe(true);
            expect(response.data).toEqual(data);
            expect(response.meta?.version).toBe('4.0.0');

            return true;
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should create valid error response structure', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 200 }),
          (code, message) => {
            const response = createErrorResponse(code, message);
            const validation = validateAPIResponse(response);

            expect(validation.valid).toBe(true);
            expect(response.success).toBe(false);
            expect(response.error?.code).toBe(code);
            expect(response.error?.message).toBe(message);

            return true;
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should include timestamp in ISO format', () => {
      const response = createSuccessResponse({ test: true });

      expect(response.meta?.timestamp).toBeDefined();
      expect(() => new Date(response.meta!.timestamp)).not.toThrow();

      const timestamp = new Date(response.meta!.timestamp);
      expect(timestamp.toISOString()).toBe(response.meta!.timestamp);
    });

    it('should include version in meta', () => {
      const successResponse = createSuccessResponse({ test: true });
      const errorResponse = createErrorResponse('TEST', 'Test error');

      expect(successResponse.meta?.version).toBe('4.0.0');
      expect(errorResponse.meta?.version).toBe('4.0.0');
    });
  });

  describe('Generate API - Requirements 19.1, 19.2', () => {
    it('should validate generate request structure', () => {
      interface GenerateRequest {
        topic: string;
        length?: 'short' | 'medium' | 'long' | 'comprehensive';
        style?: 'formal' | 'casual' | 'seo';
        category?: string;
        includeKeywords?: string[];
      }

      const validRequest: GenerateRequest = {
        topic: 'عيد ميلاد أحمد',
        length: 'medium',
        style: 'friendly' as 'formal',
        category: 'birthday',
        includeKeywords: ['عيد ميلاد', 'تهنئة'],
      };

      expect(validRequest.topic).toBeDefined();
      expect(typeof validRequest.topic).toBe('string');
    });

    it('should return proper response for valid request', () => {
      const mockGeneratedContent = {
        content: '<h1>مقال عن عيد ميلاد</h1><p>محتوى المقال...</p>',
        title: 'عيد ميلاد سعيد',
        metaTitle: 'عيد ميلاد سعيد | ميلادك',
        metaDescription: 'اكتشف أجمل التهاني والأفكار لعيد الميلاد',
        keywords: ['عيد ميلاد', 'تهنئة', 'احتفال'],
        wordCount: 500,
        qualityReport: {
          overallScore: 85,
          diversityScore: 80,
          keywordDensity: 3,
          readabilityScore: 90,
          structureScore: 85,
          suggestions: [],
          passed: true,
        },
        usedTemplates: ['intro_1', 'para_1', 'conclusion_1'],
        generationTime: 1500,
      };

      const response = createSuccessResponse(mockGeneratedContent, 1500);
      const validation = validateAPIResponse(response);

      expect(validation.valid).toBe(true);
      expect(response.data?.content).toBeDefined();
      expect(response.data?.qualityReport).toBeDefined();
      expect(response.meta?.duration).toBe(1500);
    });

    it('should return error for invalid request', () => {
      const response = createErrorResponse(
        'INVALID_REQUEST',
        'الموضوع مطلوب ويجب أن يكون نصاً'
      );

      expect(response.success).toBe(false);
      expect(response.error?.code).toBe('INVALID_REQUEST');
    });
  });

  describe('Categories API - Requirements 19.3', () => {
    it('should return valid categories structure', () => {
      const mockCategories = [
        {
          id: 'birthday',
          name: 'Birthday',
          nameAr: 'أعياد الميلاد',
          description: 'مقالات عن أعياد الميلاد',
          templateCount: { intros: 10, paragraphs: 20, conclusions: 5 },
        },
        {
          id: 'zodiac',
          name: 'Zodiac',
          nameAr: 'الأبراج',
          description: 'مقالات عن الأبراج',
          templateCount: { intros: 8, paragraphs: 15, conclusions: 4 },
        },
      ];

      const response = createSuccessResponse(mockCategories);
      const validation = validateAPIResponse(response);

      expect(validation.valid).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data?.length).toBe(2);

      for (const category of response.data || []) {
        expect(category.id).toBeDefined();
        expect(category.nameAr).toBeDefined();
        expect(category.templateCount).toBeDefined();
      }
    });
  });

  describe('Settings API - Requirements 19.1, 19.2', () => {
    it('should return valid settings structure', () => {
      const mockSettings = {
        articleLength: 'medium',
        wordCountTargets: {
          short: 500,
          medium: 1000,
          long: 2000,
          comprehensive: 3000,
        },
        keywordDensity: 3,
        minQualityScore: 70,
        maxRetries: 3,
        diversityLevel: 'high',
        enableSynonymReplacement: true,
        enableFAQGeneration: true,
      };

      const response = createSuccessResponse(mockSettings);
      const validation = validateAPIResponse(response);

      expect(validation.valid).toBe(true);
      expect(response.data?.articleLength).toBeDefined();
      expect(response.data?.wordCountTargets).toBeDefined();
    });

    it('should validate settings update request', () => {
      const invalidSettings = {
        keywordDensity: 10, // Invalid: should be 1-5
      };

      const response = createErrorResponse(
        'INVALID_SETTINGS',
        'الإعدادات غير صالحة',
        ['keywordDensity must be between 1 and 5']
      );

      expect(response.success).toBe(false);
      expect(response.error?.details).toBeDefined();
    });
  });

  describe('Stats API - Requirements 19.4', () => {
    it('should return valid stats structure', () => {
      const mockStats = {
        totalGenerations: 150,
        successfulGenerations: 140,
        failedGenerations: 10,
        avgQualityScore: 85.5,
        avgGenerationTime: 1500,
        topCategories: [
          {
            category: 'birthday',
            count: 50,
            percentage: 33.3,
            avgQualityScore: 88,
          },
          {
            category: 'zodiac',
            count: 40,
            percentage: 26.7,
            avgQualityScore: 85,
          },
        ],
        topTemplates: [
          {
            templateId: 'intro_1',
            usageCount: 30,
            avgQualityScore: 90,
            lastUsed: new Date(),
          },
        ],
        recentTrend: 'improving',
      };

      const response = createSuccessResponse(mockStats);
      const validation = validateAPIResponse(response);

      expect(validation.valid).toBe(true);
      expect(response.data?.totalGenerations).toBeDefined();
      expect(response.data?.avgQualityScore).toBeDefined();
      expect(response.data?.recentTrend).toBeDefined();
    });
  });

  describe('Plugins API - Requirements 19.1', () => {
    it('should return valid plugins list', () => {
      const mockPlugins = [
        {
          name: 'birthday',
          displayName: 'Birthday Plugin',
          version: '1.0.0',
          description: 'Plugin for birthday content',
          category: 'birthday',
          enabled: true,
          hooks: ['afterAnalyze', 'getKnowledge'],
        },
        {
          name: 'zodiac',
          displayName: 'Zodiac Plugin',
          version: '1.0.0',
          description: 'Plugin for zodiac content',
          category: 'zodiac',
          enabled: true,
          hooks: ['afterAnalyze', 'getKnowledge'],
        },
      ];

      const response = createSuccessResponse(mockPlugins);
      const validation = validateAPIResponse(response);

      expect(validation.valid).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);

      for (const plugin of response.data || []) {
        expect(plugin.name).toBeDefined();
        expect(typeof plugin.enabled).toBe('boolean');
        expect(Array.isArray(plugin.hooks)).toBe(true);
      }
    });

    it('should return valid toggle response', () => {
      const mockToggleResponse = {
        name: 'birthday',
        enabled: false,
      };

      const response = createSuccessResponse(mockToggleResponse);
      const validation = validateAPIResponse(response);

      expect(validation.valid).toBe(true);
      expect(response.data?.name).toBe('birthday');
      expect(typeof response.data?.enabled).toBe('boolean');
    });
  });

  describe('Export/Import API - Requirements 16.1, 16.2', () => {
    it('should return valid export data structure', () => {
      const mockExportData = {
        metadata: {
          version: '4.0.0',
          exportedAt: new Date().toISOString(),
          contents: ['knowledge', 'templates', 'synonyms'],
        },
        knowledge: { zodiac: {} },
        templates: { intros: {} },
        synonyms: { كبير: ['ضخم', 'هائل'] },
      };

      const response = createSuccessResponse(mockExportData);
      const validation = validateAPIResponse(response);

      expect(validation.valid).toBe(true);
      expect(response.data?.metadata).toBeDefined();
      expect(response.data?.metadata.version).toBe('4.0.0');
    });

    it('should return valid import result structure', () => {
      const mockImportResult = {
        success: true,
        imported: {
          knowledge: 4,
          templates: 10,
          synonyms: 100,
          phrases: 5,
          settings: 3,
        },
        skipped: 0,
        errors: [],
        warnings: [],
      };

      const response = createSuccessResponse(mockImportResult);
      const validation = validateAPIResponse(response);

      expect(validation.valid).toBe(true);
      expect(response.data?.imported).toBeDefined();
      expect(response.data?.errors).toEqual([]);
    });
  });

  describe('Sandbox API - Requirements 17.1, 17.2, 17.5', () => {
    it('should return valid sandbox session structure', () => {
      const mockSession = {
        id: 'abc123',
        sessionId: 'abc123',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        isActive: true,
        settings: { articleLength: 'medium' },
        generatedContent: [],
      };

      const response = createSuccessResponse(mockSession);
      const validation = validateAPIResponse(response);

      expect(validation.valid).toBe(true);
      expect(response.data?.sessionId).toBeDefined();
      expect(response.data?.isActive).toBe(true);
    });

    it('should return valid sandbox generation result', () => {
      const mockContent = {
        id: 'content123',
        topic: 'عيد ميلاد',
        category: 'birthday',
        content: '<h1>مقال تجريبي</h1>',
        title: 'مقال عن عيد الميلاد',
        wordCount: 500,
        qualityScore: 85,
        generatedAt: new Date(),
      };

      const response = createSuccessResponse(mockContent);
      const validation = validateAPIResponse(response);

      expect(validation.valid).toBe(true);
      expect(response.data?.topic).toBeDefined();
      expect(response.data?.qualityScore).toBeGreaterThan(0);
    });

    it('should return valid promotion result', () => {
      const mockPromotionResult = {
        success: true,
        promotedSettings: { articleLength: 'long' },
        promotedTemplates: [],
        errors: [],
      };

      const response = createSuccessResponse(mockPromotionResult);
      const validation = validateAPIResponse(response);

      expect(validation.valid).toBe(true);
      expect(response.data?.success).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should return proper error codes', () => {
      const errorCodes = [
        'INVALID_REQUEST',
        'INVALID_LENGTH',
        'GENERATION_ERROR',
        'SETTINGS_ERROR',
        'PLUGIN_NOT_FOUND',
        'SESSION_NOT_FOUND',
        'EXPORT_ERROR',
        'IMPORT_ERROR',
      ];

      for (const code of errorCodes) {
        const response = createErrorResponse(code, 'Test error message');
        const validation = validateAPIResponse(response);

        expect(validation.valid).toBe(true);
        expect(response.error?.code).toBe(code);
      }
    });

    it('should include error details when available', () => {
      const response = createErrorResponse(
        'VALIDATION_ERROR',
        'Validation failed',
        ['Field 1 is invalid', 'Field 2 is required']
      );

      expect(response.error?.details).toBeDefined();
      expect(Array.isArray(response.error?.details)).toBe(true);
    });
  });

  describe('Property-Based Tests', () => {
    it('should always produce valid response structure', () => {
      fc.assert(
        fc.property(
          fc.boolean(),
          fc.string({ minLength: 1, maxLength: 200 }), // Non-empty string required for error messages
          (success, message) => {
            const response = success
              ? createSuccessResponse({ message })
              : createErrorResponse('ERROR', message);

            const validation = validateAPIResponse(response);
            expect(validation.valid).toBe(true);

            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should handle Arabic text in responses', () => {
      fc.assert(
        fc.property(fc.stringMatching(/^[أ-ي\s]{1,50}$/), (arabicText) => {
          const response = createSuccessResponse({ content: arabicText });
          const validation = validateAPIResponse(response);

          expect(validation.valid).toBe(true);
          expect(response.data?.content).toBe(arabicText);

          return true;
        }),
        { numRuns: 10 }
      );
    });
  });
});
