'use client';

import { LoadingSpinner } from '@/components/loading';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">
          جاري التحميل...
        </p>
      </div>
    </div>
  );
}
