import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({
      success: false,
      error: 'يرجى إدخال كلمة البحث',
    });
  }

  const pexelsApiKey = process.env.PEXELS_API_KEY;

  if (!pexelsApiKey) {
    return NextResponse.json({
      success: false,
      error: 'PEXELS_API_KEY غير موجود',
    });
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=12&locale=ar`,
      {
        headers: {
          Authorization: pexelsApiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data = await response.json();
    const images = data.photos?.map((photo: any) => photo.src.medium) || [];

    return NextResponse.json({
      success: true,
      images,
      total: data.total_results,
    });
  } catch (error) {
    console.error('Image search error:', error);
    return NextResponse.json({
      success: false,
      error: 'فشل في البحث عن الصور',
    });
  }
}
