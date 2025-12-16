/**
 * Property-Based Tests for Ads.txt
 * اختبارات الخصائص لملف ads.txt
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';

// Store original env
const originalEnv = process.env;

describe('Ads.txt Properties', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  /**
   * **Feature: seo-sitemap-robots-ads, Property 4: Ads.txt Format Compliance**
   * *For any* ads.txt entry, the format SHALL follow the IAB specification:
   * `domain, publisher-id, relationship[, certification-id]`
   * where relationship is either DIRECT or RESELLER.
   * **Validates: Requirements 3.2**
   */
  it('Property 4: Ads.txt follows IAB specification format', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid publisher IDs (pub-XXXXXXXXXXXXXXXX format)
        fc
          .string({ minLength: 16, maxLength: 16 })
          .filter((s) => /^[0-9]+$/.test(s))
          .map((s) => `pub-${s}`),
        async (publisherId) => {
          // Set environment variable
          process.env.ADSENSE_PUBLISHER_ID = publisherId;

          // Re-import to get fresh config
          vi.resetModules();
          const { GET } = await import('@/app/ads.txt/route');

          const response = await GET();
          const content = await response.text();

          // Parse non-comment lines
          const lines = content
            .split('\n')
            .filter((line) => line.trim() && !line.startsWith('#'));

          // Each line should follow IAB format
          for (const line of lines) {
            const parts = line.split(',').map((p) => p.trim());

            // Should have at least 3 parts: domain, publisher-id, relationship
            expect(parts.length).toBeGreaterThanOrEqual(3);

            // Domain should be valid
            expect(parts[0]).toMatch(/^[a-z0-9.-]+\.[a-z]+$/);

            // Publisher ID should be present
            expect(parts[1]).toBeTruthy();

            // Relationship should be DIRECT or RESELLER
            expect(['DIRECT', 'RESELLER']).toContain(parts[2]);

            // If certification ID exists, it should be alphanumeric
            if (parts[3]) {
              expect(parts[3]).toMatch(/^[a-f0-9]+$/);
            }
          }

          return true;
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * **Feature: seo-sitemap-robots-ads, Property 5: Environment Variable Configuration**
   * *For any* configuration value in ads.txt, if an environment variable is set,
   * the generated file SHALL use that value instead of the default.
   * **Validates: Requirements 3.5**
   */
  it('Property 5: Ads.txt uses environment variable when set', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc
          .string({ minLength: 16, maxLength: 16 })
          .filter((s) => /^[0-9]+$/.test(s))
          .map((s) => `pub-${s}`),
        async (publisherId) => {
          // Set environment variable
          process.env.ADSENSE_PUBLISHER_ID = publisherId;

          vi.resetModules();
          const { GET } = await import('@/app/ads.txt/route');

          const response = await GET();
          const content = await response.text();

          // The publisher ID should appear in the content
          expect(content).toContain(publisherId);

          return true;
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Ads.txt should return correct content type
   */
  it('Ads.txt returns text/plain content type', async () => {
    process.env.ADSENSE_PUBLISHER_ID = 'pub-1234567890123456';

    vi.resetModules();
    const { GET } = await import('@/app/ads.txt/route');

    const response = await GET();

    expect(response.headers.get('Content-Type')).toContain('text/plain');
  });

  /**
   * Ads.txt should include warning when no publisher ID is set
   */
  it('Ads.txt includes warning when publisher ID is not set', async () => {
    delete process.env.ADSENSE_PUBLISHER_ID;
    delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

    vi.resetModules();
    const { GET } = await import('@/app/ads.txt/route');

    const response = await GET();
    const content = await response.text();

    expect(content).toContain('WARNING');
    expect(content).toContain('ADSENSE_PUBLISHER_ID');
  });

  /**
   * Ads.txt should include Google AdSense domain
   */
  it('Ads.txt includes google.com domain', async () => {
    process.env.ADSENSE_PUBLISHER_ID = 'pub-1234567890123456';

    vi.resetModules();
    const { GET } = await import('@/app/ads.txt/route');

    const response = await GET();
    const content = await response.text();

    expect(content).toContain('google.com');
  });

  /**
   * Ads.txt should include DIRECT relationship for AdSense
   */
  it('Ads.txt includes DIRECT relationship', async () => {
    process.env.ADSENSE_PUBLISHER_ID = 'pub-1234567890123456';

    vi.resetModules();
    const { GET } = await import('@/app/ads.txt/route');

    const response = await GET();
    const content = await response.text();

    expect(content).toContain('DIRECT');
  });
});
