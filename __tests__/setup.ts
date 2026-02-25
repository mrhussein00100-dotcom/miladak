/**
 * Vitest Setup File
 * ملف إعداد الاختبارات
 */

import { vi } from 'vitest';

// Mock environment variables
process.env.NEXT_PUBLIC_SITE_URL = 'https://miladak.com';
process.env.ADSENSE_PUBLISHER_ID = 'pub-1234567890123456';

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  // Filter out expected errors during tests
  const message = args[0]?.toString() || '';
  if (message.includes('Error fetching') || message.includes('Warning:')) {
    return;
  }
  originalConsoleError.apply(console, args);
};

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
