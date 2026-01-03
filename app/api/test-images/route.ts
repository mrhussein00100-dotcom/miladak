import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const pexelsApiKey = process.env.PEXELS_API_KEY;
  const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY;

  const results: any = {
    success: true,
    message: 'Image API Test',
    timestamp: new Date().toISOString(),
    env: {
      pexels: pexelsApiKey
        ? `configured (${pexelsApiKey.substring(0, 8)}...)`
        : 'missing',
      unsplash: unsplashApiKey
        ? `configured (${unsplashApiKey.substring(0, 8)}...)`
        : 'missing',
    },
    tests: {},
  };

  // اختبار Pexels
  if (pexelsApiKey) {
    try {
      const response = await fetch(
        'https://api.pexels.com/v1/search?query=birthday&per_page=1',
        { headers: { Authorization: pexelsApiKey } }
      );
      if (response.ok) {
        const data = await response.json();
        results.tests.pexels = {
          status: 'working',
          totalResults: data.total_results,
          sampleImage: data.photos?.[0]?.src?.medium || null,
        };
      } else {
        results.tests.pexels = {
          status: 'error',
          httpStatus: response.status,
          error: await response.text(),
        };
      }
    } catch (error: any) {
      results.tests.pexels = {
        status: 'error',
        error: error.message,
      };
    }
  } else {
    results.tests.pexels = { status: 'not_configured' };
  }

  // اختبار Unsplash
  if (unsplashApiKey) {
    try {
      const response = await fetch(
        'https://api.unsplash.com/search/photos?query=birthday&per_page=1',
        { headers: { Authorization: `Client-ID ${unsplashApiKey}` } }
      );
      if (response.ok) {
        const data = await response.json();
        results.tests.unsplash = {
          status: 'working',
          totalResults: data.total,
          sampleImage: data.results?.[0]?.urls?.regular || null,
        };
      } else {
        results.tests.unsplash = {
          status: 'error',
          httpStatus: response.status,
          error: await response.text(),
        };
      }
    } catch (error: any) {
      results.tests.unsplash = {
        status: 'error',
        error: error.message,
      };
    }
  } else {
    results.tests.unsplash = { status: 'not_configured' };
  }

  return NextResponse.json(results);
}
