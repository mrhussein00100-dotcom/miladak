/**
 * API لاختبار توليد AI مباشرة مع تفاصيل الخطأ الكاملة
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: {},
  };

  // اختبار Gemini مباشرة
  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = 'اكتب جملة واحدة عن الطقس';
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 100,
            },
          }),
        }
      );

      const data = await response.json();
      results.tests.gemini = {
        status: response.status,
        ok: response.ok,
        response: data,
        text: data?.candidates?.[0]?.content?.parts?.[0]?.text || null,
      };
    } catch (e: any) {
      results.tests.gemini = {
        error: e.message,
        stack: e.stack,
      };
    }
  } else {
    results.tests.gemini = { error: 'API key not configured' };
  }

  // اختبار Groq مباشرة
  if (process.env.GROQ_API_KEY) {
    try {
      const response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: 'اكتب جملة واحدة عن الطقس' }],
            temperature: 0.7,
            max_tokens: 100,
          }),
        }
      );

      const data = await response.json();
      results.tests.groq = {
        status: response.status,
        ok: response.ok,
        response: data,
        text: data?.choices?.[0]?.message?.content || null,
      };
    } catch (e: any) {
      results.tests.groq = {
        error: e.message,
        stack: e.stack,
      };
    }
  } else {
    results.tests.groq = { error: 'API key not configured' };
  }

  return NextResponse.json(results);
}
