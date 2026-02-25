'use client';

import { Card } from '@/components/ui/Card';

/**
 * Birthstone Card Component
 * Feature: frontend-database-integration
 * Requirements: 1.2, 6.4
 */

interface BirthstoneCardProps {
  birthstone: {
    name: string;
    properties: string;
    color: string;
    meaning: string;
  };
}

export default function BirthstoneCard({ birthstone }: BirthstoneCardProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-4xl">💎</div>
        <div>
          <h4 className="text-lg font-bold text-gray-800 dark:text-white">
            حجر ميلادك
          </h4>
          <p className="text-xl font-semibold text-purple-600 dark:text-purple-400">
            {birthstone.name}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            اللون:
          </span>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {birthstone.color}
          </span>
        </div>

        <div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
            الخصائص:
          </span>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {birthstone.properties}
          </p>
        </div>

        <div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
            المعنى:
          </span>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {birthstone.meaning}
          </p>
        </div>
      </div>
    </Card>
  );
}
