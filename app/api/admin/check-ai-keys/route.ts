/**
 * API للتحقق من حالة مفاتيح AI
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const keys = {
    groq: {
      configured: !!process.env.GROQ_API_KEY,
      length: process.env.GROQ_API_KEY?.length || 0,
      prefix: process.env.GROQ_API_KEY?.substring(0, 8) || 'not set',
    },
    gemini: {
      configured: !!process.env.GEMINI_API_KEY,
      length: process.env.GEMINI_API_KEY?.length || 0,
      prefix: process.env.GEMINI_API_KEY?.substring(0, 8) || 'not set',
    },
    cohere: {
      configured: !!process.env.COHERE_API_KEY,
      length: process.env.COHERE_API_KEY?.length || 0,
    },
    huggingface: {
      configured: !!process.env.HUGGINGFACE_API_KEY,
      length: process.env.HUGGINGFACE_API_KEY?.length || 0,
    },
    pexels: {
      configured: !!process.env.PEXELS_API_KEY,
      length: process.env.PEXELS_API_KEY?.length || 0,
    },
  };

  // اختبار سريع لـ Groq
  let groqTest = { success: false, error: '' };
  if (process.env.GROQ_API_KEY) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      });
      groqTest = {
        success: response.ok,
        error: response.ok ? '' : `HTTP ${response.status}`,
      };
    } catch (e: any) {
      groqTest = { success: false, error: e.message };
    }
  }

  // اختبار سريع لـ Gemini
  let geminiTest = { success: false, error: '' };
  if (process.env.GEMINI_API_KEY) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
      );
      geminiTest = {
        success: response.ok,
        error: response.ok ? '' : `HTTP ${response.status}`,
      };
    } catch (e: any) {
      geminiTest = { success: false, error: e.message };
    }
  }

  return NextResponse.json({
    keys,
    tests: {
      groq: groqTest,
      gemini: geminiTest,
    },
    timestamp: new Date().toISOString(),
  });
}
