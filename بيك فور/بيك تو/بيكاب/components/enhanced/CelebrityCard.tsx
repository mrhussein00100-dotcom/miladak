'use client';

/**
 * Celebrity Card Component
 * Feature: frontend-database-integration
 * Requirements: 5.4
 */

interface CelebrityCardProps {
  celebrity: {
    id: number;
    name: string;
    profession: string;
    birth_year: number;
  };
}

export default function CelebrityCard({ celebrity }: CelebrityCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-amber-200 dark:bg-amber-800/50 rounded-full">
        <span className="text-2xl">⭐</span>
      </div>
      <div className="flex-1 min-w-0">
        <h5 className="font-semibold text-gray-800 dark:text-white truncate">
          {celebrity.name}
        </h5>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {celebrity.profession} • {celebrity.birth_year}
        </p>
      </div>
    </div>
  );
}
