'use client';

import { Card } from '@/components/ui/Card';

/**
 * Historical Event Card Component
 * Feature: frontend-database-integration
 * Requirements: 4.4
 */

interface HistoricalEventCardProps {
  event: {
    id: number;
    title: string;
    description: string;
    year: number;
  };
}

export default function HistoricalEventCard({
  event,
}: HistoricalEventCardProps) {
  return (
    <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
      <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-lg">
        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
          {event.year}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h5 className="font-semibold text-gray-800 dark:text-white mb-1 truncate">
          {event.title}
        </h5>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {event.description}
        </p>
      </div>
    </div>
  );
}
