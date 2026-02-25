'use client';

import { Skeleton, SkeletonToolCard } from '@/components/loading';

export default function ToolsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-6 w-96" />
      </div>

      {/* Search Skeleton */}
      <Skeleton className="h-12 w-full max-w-md mb-8 rounded-xl" />

      {/* Categories Skeleton */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full flex-shrink-0" />
        ))}
      </div>

      {/* Tools Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonToolCard key={i} />
        ))}
      </div>
    </div>
  );
}
