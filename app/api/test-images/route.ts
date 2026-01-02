import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const pexelsApiKey = process.env.PEXELS_API_KEY;
  const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY;

  return NextResponse.json({
    success: true,
    message: 'Test API working',
    timestamp: new Date().toISOString(),
    env: {
      pexels: pexelsApiKey ? 'configured' : 'missing',
      unsplash: unsplashApiKey ? 'configured' : 'missing',
    },
  });
}
