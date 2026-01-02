// Image Search API v2.3 - Pexels + Unsplash Integration
// Last updated: 2026-01-02 - Fixed 405 error
import { NextRequest, NextResponse } from 'next/server';
import { topicToEnglishKeywords } from '@/lib/images/pexels';
import { searchUnsplashImages, convertUnsplashToUnified, UnifiedImage } from '@/lib/images/unsplash';
import { query } from '@/lib/db/database';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
