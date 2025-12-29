/**
 * API للتحقق من حالة مفاتيح API
 */

import { NextResponse } from 'next/server';
import geminiProvider, { getGeminiKeysStatus } from '@/lib/ai/providers/gemini';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// اختبار مفتاح Gemini
async function testGeminiKey(
  apiKey: string
): Promise<{ working: boolean; error?: string }> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );
    if (response.ok) {
      return { working: true };
    }
    const data = await response.json();
    return { working: false, error: data.error?.message || 'فشل الاتصال' };
  } catch {
    return { working: false, error: 'خطأ في الشبكة' };
  }
}

export async function GET() {
  // الحصول على حالة مفاتيح Gemini المتعددة
  const geminiStatus = getGeminiKeysStatus();
  const allGeminiKeys = geminiProvider.getAllGeminiApiKeys();

  // اختبار كل مفتاح Gemini
  const geminiKeysTests = await Promise.all(
    allGeminiKeys.map(async (key: string, index: number) => {
      const result = await testGeminiKey(key);
      return {
        index: index + 1,
        working: result.working,
        error: result.error,
      };
    })
  );

  const keys = {
    gemini: {
      name: 'Gemini',
      configured: geminiStatus.total > 0,
      working: geminiKeysTests.some((k: { working: boolean }) => k.working),
      keysCount: geminiStatus.total,
      totalKeys: geminiStatus.total,
      availableKeys: geminiStatus.available,
      exhaustedKeys: geminiStatus.exhausted,
      keys: geminiKeysTests,
      envVars: [
        'GEMINI_API_KEY',
        'GOOGLE_AI_API_KEY',
        'GEMINI_API_KEY_2',
        'GEMINI_API_KEY_3',
        '...',
      ],
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
    missing: Object.entries(keys)
      .filter(([_, v]) => !v.configured)
      .map(([k, v]) => v.name),
    geminiKeysTotal: geminiStatus.total,
    geminiKeysAvailable: geminiStatus.available,
  };

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    keys,
    summary,
    instructions: {
      gemini:
        'احصل على مفاتيح من: https://aistudio.google.com/app/apikey - يمكنك إضافة عدة مفاتيح (GEMINI_API_KEY, GEMINI_API_KEY_2, GEMINI_API_KEY_3, ...)',
      groq: 'احصل على مفتاح من: https://console.groq.com/keys',
      cohere: 'احصل على مفتاح من: https://dashboard.cohere.ai/api-keys',
      huggingface: 'احصل على مفتاح من: https://huggingface.co/settings/tokens',
      pexels: 'احصل على مفتاح من: https://www.pexels.com/api/',
    },
    multipleKeysSupport: {
      gemini: {
        supported: true,
        description:
          'يدعم Gemini مفاتيح API متعددة مع التبديل التلقائي عند انتهاء الحصة',
        envVars: [
          'GEMINI_API_KEY (أو GOOGLE_AI_API_KEY)',
          'GEMINI_API_KEY_2',
          'GEMINI_API_KEY_3',
          'GEMINI_API_KEY_4',
          '... حتى GEMINI_API_KEY_10',
        ],
        howItWorks:
          'عند انتهاء حصة مفتاح، يتم الانتقال تلقائياً للمفتاح التالي. المفاتيح المستنفدة تُعاد تفعيلها بعد ساعة.',
      },
    },
  });
}
