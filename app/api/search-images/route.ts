// Alternative Image Search API - v1.0
import { NextRequest, NextResponse } from 'next/server';
import { topicToEnglishKeywords } from '@/lib/images/pexels';
import {
  searchUnsplashImages,
  convertUnsplashToUnified,
  UnifiedImage,
} from '@/lib/images/unsplash';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface PexelsImage {
  id: number;
  url: string;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

interface PexelsSearchResult {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsImage[];
}

async function searchPexels(
  query: string,
  perPage: number = 15,
  page: number = 1
): Promise<PexelsImage[]> {
  const apiKey = process.env.PEXELS_API_KEY;

  if (!apiKey) {
    console.warn('[Pexels] API key not configured');
    return [];
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=${perPage}&page=${page}&orientation=landscape`,
      {
        headers: { Authorization: apiKey },
        cache: 'no-store',
      }
    );
    if (!response.ok) {
      console.error(`[Pexels] API error: ${response.status}`);
      return [];
    }
    const data: PexelsSearchResult = await response.json();
    return data.photos || [];
  } catch (error) {
    console.error('[Pexels] Search error:', error);
    return [];
  }
}

function convertPexelsToUnified(photo: PexelsImage): UnifiedImage {
  return {
    id: `pexels_${photo.id}`,
    url: photo.src.large,
    urlLarge: photo.src.large2x || photo.src.original,
    urlMedium: photo.src.medium,
    alt: photo.alt || 'Image from Pexels',
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
    provider: 'pexels',
    width: 1200,
    height: 800,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query') || '';
    const count = parseInt(searchParams.get('count') || '15', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required', images: [] },
        { status: 400 }
      );
    }

    console.log(`[Search Images API] Query: "${query}", Count: ${count}`);

    const englishQuery = topicToEnglishKeywords(query) || 'celebration';
    console.log(`[Search Images API] English query: "${englishQuery}"`);

    const allImages: UnifiedImage[] = [];
    const seenIds = new Set<string>();

    // Search Pexels
    const pexelsImages = await searchPexels(
      englishQuery,
      Math.ceil(count * 0.7),
      page
    );
    for (const photo of pexelsImages) {
      const unified = convertPexelsToUnified(photo);
      if (!seenIds.has(unified.id)) {
        seenIds.add(unified.id);
        allImages.push(unified);
      }
    }

    // Search Unsplash
    const unsplashImages = await searchUnsplashImages(
      englishQuery,
      Math.ceil(count * 0.5),
      page
    );
    for (const photo of unsplashImages) {
      const unified = convertUnsplashToUnified(photo);
      if (!seenIds.has(unified.id)) {
        seenIds.add(unified.id);
        allImages.push(unified);
      }
    }

    // تحويل الكائنات إلى روابط مباشرة للتوافق مع المكونات
    const imageUrls = allImages.slice(0, count).map((img) => img.url);

    return NextResponse.json({
      success: true,
      query: query,
      englishQuery: englishQuery,
      total: allImages.length,
      images: imageUrls,
      // إضافة البيانات الكاملة للاستخدام المتقدم
      imagesData: allImages.slice(0, count),
    });
  } catch (error) {
    console.error('[Search Images API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to search images', images: [] },
      { status: 500 }
    );
  }
}
