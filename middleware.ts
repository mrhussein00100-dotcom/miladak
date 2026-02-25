import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // تعطيل middleware مؤقتاً لحل مشكلة النشر
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
