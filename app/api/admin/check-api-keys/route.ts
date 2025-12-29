/**
 * API للتحقق من حالة مفاتيح API
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const keys = {
    gemini: {
      name: 'Gemini',
      configured: !!(
        process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY
      ),
      keyLength: (
        process.env.GEMINI_API_KEY ||
        process.env.GOOGLE_AI_API_KEY ||
        ''
      ).length,
      envVar: process.env.GEMINI_API_KEY
        ? 'GEMINI_API_KEY'
        : process.env.GOOGLE_AI_API_KEY
        ? 'GOOGLE_AI_API_KEY'
        : 'none',
    },
    groq: {
      name: 'Groq',
      configured: !!process.env.GROQ_API_KEY,
      keyLength: (process.env.GROQ_API_KEY || '').length,
      envVar: 'GROQ_API_KEY',
    },
    cohere: {
      name: 'Cohere',
      configured: !!process.env.COHERE_API_KEY,
      keyLength: (process.env.COHERE_API_KEY || '').length,
      envVar: 'COHERE_API_KEY',
    },
    huggingface: {
      name: 'HuggingFace',
      configured: !!process.env.HUGGINGFACE_API_KEY,
      keyLength: (process.env.HUGGINGFACE_API_KEY || '').length,
      envVar: 'HUGGINGFACE_API_KEY',
    },
    pexels: {
      name: 'Pexels',
      configured: !!process.env.PEXELS_API_KEY,
      keyLength: (process.env.PEXELS_API_KEY || '').length,
      envVar: 'PEXELS_API_KEY',
    },
  };

  const summary = {
    total: Object.keys(keys).length,
    configured: Object.values(keys).filter((k) => k.configured).length,
    missing: Object.values(keys)
      .filter((k) => !k.configured)
      .map((k) => k.name),
  };

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    keys,
    summary,
    instructions: {
      gemini: 'احصل على مفتاح من: https://aistudio.google.com/app/apikey',
      groq: 'احصل على مفتاح من: https://console.groq.com/keys',
      cohere: 'احصل على مفتاح من: https://dashboard.cohere.ai/api-keys',
      huggingface: 'احصل على مفتاح من: https://huggingface.co/settings/tokens',
      pexels: 'احصل على مفتاح من: https://www.pexels.com/api/',
    },
  });
}
