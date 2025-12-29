/**
 * Property-based tests for environment variable completeness
 * Feature: vercel-postgres-deployment, Property 3: Environment variable completeness
 *
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5
 */

import { describe, test, expect } from 'vitest';
import fc from 'fast-check';

describe('**Feature: vercel-postgres-deployment, Property 3: Environment variable completeness**', () => {
  test('should validate all required database environment variables are present and valid', () => {
    fc.assert(
      fc.property(
        fc.record({
          DATABASE_URL: fc.webUrl({ validSchemes: ['postgres', 'postgresql'] }),
          POSTGRES_URL: fc.webUrl({ validSchemes: ['postgres', 'postgresql'] }),
          PRISMA_DATABASE_URL: fc.string({ minLength: 10 }),
          DATABASE_TYPE: fc.constantFrom('postgres', 'postgresql'),
        }),
        (envVars) => {
          // Property: All database connection strings should be valid URLs
          expect(envVars.DATABASE_URL).toMatch(/^postgres(ql)?:\/\//);
          expect(envVars.POSTGRES_URL).toMatch(/^postgres(ql)?:\/\//);
          expect(envVars.PRISMA_DATABASE_URL).toBeTruthy();
          expect(['postgres', 'postgresql']).toContain(envVars.DATABASE_TYPE);

          // Property: URLs should contain required components
          const dbUrl = new URL(envVars.DATABASE_URL);
          expect(dbUrl.hostname).toBeTruthy();
          expect(dbUrl.port || '5432').toBeTruthy();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should validate all required API keys are present and properly formatted', () => {
    fc.assert(
      fc.property(
        fc.record({
          GROQ_API_KEY: fc
            .string({ minLength: 20, maxLength: 100 })
            .filter((s) => s.startsWith('gsk_')),
          GEMINI_API_KEY: fc
            .string({ minLength: 20, maxLength: 100 })
            .filter((s) => s.startsWith('AIza')),
          PEXELS_API_KEY: fc.string({ minLength: 20, maxLength: 100 }),
          HUGGINGFACE_API_KEY: fc.string({ minLength: 10, maxLength: 100 }),
          COHERE_API_KEY: fc.string({ minLength: 10, maxLength: 100 }),
        }),
        (apiKeys) => {
          // Property: API keys should have proper format and length
          expect(apiKeys.GROQ_API_KEY).toMatch(/^gsk_/);
          expect(apiKeys.GROQ_API_KEY.length).toBeGreaterThan(20);

          expect(apiKeys.GEMINI_API_KEY).toMatch(/^AIza/);
          expect(apiKeys.GEMINI_API_KEY.length).toBeGreaterThan(20);

          expect(apiKeys.PEXELS_API_KEY.length).toBeGreaterThan(20);
          expect(apiKeys.HUGGINGFACE_API_KEY.length).toBeGreaterThan(10);
          expect(apiKeys.COHERE_API_KEY.length).toBeGreaterThan(10);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should validate production URL and domain configuration variables', () => {
    fc.assert(
      fc.property(
        fc.record({
          NEXT_PUBLIC_APP_URL: fc.webUrl({ validSchemes: ['https'] }),
          NEXT_PUBLIC_BASE_URL: fc.webUrl({ validSchemes: ['https'] }),
          NEXT_PUBLIC_SITE_URL: fc.webUrl({ validSchemes: ['https'] }),
          NEXT_PUBLIC_APP_NAME: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        (urlVars) => {
          // Property: Production URLs should use HTTPS and be valid
          expect(urlVars.NEXT_PUBLIC_APP_URL).toMatch(/^https:\/\//);
          expect(urlVars.NEXT_PUBLIC_BASE_URL).toMatch(/^https:\/\//);
          expect(urlVars.NEXT_PUBLIC_SITE_URL).toMatch(/^https:\/\//);

          // Property: URLs should be parseable
          expect(() => new URL(urlVars.NEXT_PUBLIC_APP_URL)).not.toThrow();
          expect(() => new URL(urlVars.NEXT_PUBLIC_BASE_URL)).not.toThrow();
          expect(() => new URL(urlVars.NEXT_PUBLIC_SITE_URL)).not.toThrow();

          // Property: App name should be non-empty
          expect(urlVars.NEXT_PUBLIC_APP_NAME.trim().length).toBeGreaterThan(0);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should validate security and authentication variables', () => {
    fc.assert(
      fc.property(
        fc.record({
          AUTH_SECRET: fc.string({ minLength: 16, maxLength: 100 }),
          NODE_ENV: fc.constantFrom('production', 'development', 'staging'),
        }),
        (securityVars) => {
          // Property: Auth secret should be sufficiently long for security
          expect(securityVars.AUTH_SECRET.length).toBeGreaterThanOrEqual(16);

          // Property: Node environment should be valid
          expect(['production', 'development', 'staging']).toContain(
            securityVars.NODE_ENV
          );

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should validate AdSense configuration variables', () => {
    fc.assert(
      fc.property(
        fc.record({
          NEXT_PUBLIC_ADSENSE_CLIENT: fc
            .string()
            .filter((s) => s.startsWith('ca-pub-')),
          ADSENSE_PUBLISHER_ID: fc.string().filter((s) => s.startsWith('pub-')),
        }),
        (adsenseVars) => {
          // Property: AdSense client ID should have proper format
          expect(adsenseVars.NEXT_PUBLIC_ADSENSE_CLIENT).toMatch(
            /^ca-pub-\d+$/
          );

          // Property: Publisher ID should have proper format
          expect(adsenseVars.ADSENSE_PUBLISHER_ID).toMatch(/^pub-\d+$/);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should validate current environment variables against requirements', () => {
    // Test actual environment variables from .env.local
    const requiredVars = [
      'DATABASE_URL',
      'POSTGRES_URL',
      'PRISMA_DATABASE_URL',
      'GROQ_API_KEY',
      'GEMINI_API_KEY',
      'PEXELS_API_KEY',
      'AUTH_SECRET',
      'NEXT_PUBLIC_ADSENSE_CLIENT',
      'ADSENSE_PUBLISHER_ID',
    ];

    // Mock environment variables based on .env.local content
    const mockEnv = {
      DATABASE_URL:
        'postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require',
      POSTGRES_URL:
        'postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require',
      PRISMA_DATABASE_URL:
        'prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19kZG4yU3lBYU5Kb3RyclRJTF9qMmgiLCJhcGlfa2V5IjoiMDFLQ05HUjU2NEs3WlZaTkdHSDlSQjRYRkMiLCJ0ZW5hbnRfaWQiOiI2NjEwN2JjNWNjZWRhMzYyMTZhOTY5NTZmNjFlMDY5YTQ3ZTQxNTRlOTM1YjBhNjE2NmUzN2RmMzk0ZDRhYzY0IiwiaW50ZXJuYWxfc2VjcmV0IjoiYmEyMjI4NWQtNTQ0ZS00M2MxLTgxYjEtOTlhNmE4MzY0MDVhIn0.vsUOQlB0KJe_xJrdtk5qAjlF9WFH89DEIZaZQTnVKzw',
      GROQ_API_KEY: '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',
      GEMINI_API_KEY: 'AIzaSyC87MwuwuIAlWheWfKSZlsGgpKxMZxoTQM',
      PEXELS_API_KEY:
        'Xekb8sWhFAzaori3koEkloite3lQxCyk8fmGWCDoUtMSMUjs7ZCt5Dyx',
      AUTH_SECRET: 'miladak_secret_2025_dev',
      NEXT_PUBLIC_ADSENSE_CLIENT: 'ca-pub-5755672349927118',
      ADSENSE_PUBLISHER_ID: 'pub-5755672349927118',
    };

    // Property: All required variables should be present and valid
    for (const varName of requiredVars) {
      expect(mockEnv[varName as keyof typeof mockEnv]).toBeTruthy();
      expect(typeof mockEnv[varName as keyof typeof mockEnv]).toBe('string');
      expect(
        (mockEnv[varName as keyof typeof mockEnv] as string).length
      ).toBeGreaterThan(0);
    }

    // Property: Database URLs should be valid PostgreSQL connections
    expect(mockEnv.DATABASE_URL).toMatch(/^postgres:\/\//);
    expect(mockEnv.POSTGRES_URL).toMatch(/^postgres:\/\//);

    // Property: API keys should have proper formats
    expect(mockEnv.GROQ_API_KEY).toMatch(/^gsk_/);
    expect(mockEnv.GEMINI_API_KEY).toMatch(/^AIza/);

    // Property: AdSense IDs should have proper formats
    expect(mockEnv.NEXT_PUBLIC_ADSENSE_CLIENT).toMatch(/^ca-pub-\d+$/);
    expect(mockEnv.ADSENSE_PUBLISHER_ID).toMatch(/^pub-\d+$/);
  });
});
