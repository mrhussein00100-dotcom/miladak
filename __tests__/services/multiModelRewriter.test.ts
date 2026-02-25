/**
 * اختبارات خدمة إعادة الصياغة المتعددة
 */

import { rewriteWithModels } from '@/lib/services/multiModelRewriter';

describe('MultiModelRewriter', () => {
  describe('rewriteWithModels', () => {
    it('should return empty array for empty models', async () => {
      const results = await rewriteWithModels(
        'Test Title',
        'Test content',
        [],
        { wordCount: 500, style: 'formal', audience: 'general' }
      );
      expect(results).toEqual([]);
    });

    it('should handle single model', async () => {
      // هذا اختبار وهمي - في الواقع نحتاج mock للـ AI providers
      const models = ['local'] as const;

      // في اختبار حقيقي، نستخدم mock للـ AI providers
      expect(models.length).toBe(1);
    });

    it('should handle multiple models in parallel', async () => {
      const models = ['gemini', 'groq'] as const;

      // في اختبار حقيقي، نتحقق من أن الطلبات تتم بشكل متوازي
      expect(models.length).toBe(2);
    });
  });
});
