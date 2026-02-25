/**
 * API لاختبار Gemini مباشرة
 */

import { NextResponse } from 'next/server';
import { validateGeminiApiKey } from '@/lib/ai/providers/gemini';

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: [],
    solution: null,
  };

  // 1. التحقق من متغيرات البيئة
  const geminiKey = process.env.GEMINI_API_KEY;
  const googleKey = process.env.GOOGLE_AI_API_KEY;

  results.envVars = {
    GEMINI_API_KEY: geminiKey ? `موجود (${geminiKey.length} حرف)` : 'غير موجود',
    GOOGLE_AI_API_KEY: googleKey
      ? `موجود (${googleKey.length} حرف)`
      : 'غير موجود',
  };

  const apiKey = geminiKey || googleKey;

  if (!apiKey) {
    return NextResponse.json({
      ...results,
      error: 'لا يوجد مفتاح API لـ Gemini',
      solution:
        'أضف GEMINI_API_KEY أو GOOGLE_AI_API_KEY في متغيرات البيئة. احصل على مفتاح من: https://aistudio.google.com/app/apikey',
    });
  }

  // 2. التحقق من صحة المفتاح أولاً
  console.log('🔍 التحقق من صحة مفتاح Gemini API...');
  const validation = await validateGeminiApiKey(apiKey);
  results.apiKeyValidation = validation;

  if (!validation.valid) {
    results.error = validation.error;
    results.solution =
      validation.errorCode === 'API_NOT_ENABLED'
        ? 'الحل: إنشاء مفتاح API جديد من Google AI Studio (يفعّل API تلقائياً): https://aistudio.google.com/app/apikey'
        : 'الحل: تحقق من صحة مفتاح API';
    return NextResponse.json(results);
  }

  // 3. اختبار النماذج المختلفة
  const modelsToTest = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro',
    'gemini-pro',
    'gemini-1.0-pro',
  ];

  for (const model of modelsToTest) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'قل مرحبا' }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100,
          },
        }),
      });

      const status = response.status;
      let data: any = null;
      let errorText = '';

      try {
        data = await response.json();
      } catch (e) {
        errorText = await response.text();
      }

      const testResult: any = {
        model,
        status,
        success: response.ok,
      };

      if (response.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        testResult.response =
          data.candidates[0].content.parts[0].text.substring(0, 100);
        testResult.finishReason = data.candidates[0].finishReason;
      } else {
        testResult.error = data?.error?.message || errorText || 'Unknown error';
        if (data?.error?.details) {
          testResult.errorDetails = data.error.details;
        }
      }

      results.tests.push(testResult);

      // إذا نجح نموذج واحد، نتوقف
      if (response.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        results.workingModel = model;
        results.status = 'SUCCESS';
        results.message = `✅ Gemini يعمل بشكل صحيح باستخدام النموذج: ${model}`;
        break;
      }
    } catch (error: any) {
      results.tests.push({
        model,
        status: 'error',
        success: false,
        error: error.message,
      });
    }
  }

  if (!results.workingModel) {
    results.status = 'FAILED';
    results.message = '❌ فشلت جميع نماذج Gemini';
    results.solution =
      'جرب إنشاء مفتاح API جديد من: https://aistudio.google.com/app/apikey';
  }

  return NextResponse.json(results);
}
