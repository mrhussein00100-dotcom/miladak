'use client';

import { Card } from '@/components/ui/Card';

/**
 * Birth Flower Card Component
 * Feature: frontend-database-integration
 * Requirements: 1.3, 6.4
 */

interface BirthFlowerCardProps {
  birthFlower: {
    name: string;
    meaning: string;
    symbolism: string;
  };
}

export default function BirthFlowerCard({ birthFlower }: BirthFlowerCardProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-4xl">🌸</div>
        <div>
          <h4 className="text-lg font-bold text-gray-800 dark:text-white">
            زهرة ميلادك
          </h4>
          <p className="text-xl font-semibold text-green-600 dark:text-green-400">
            {birthFlower.name}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
            المعنى:
          </span>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {birthFlower.meaning}
          </p>
        </div>

        <div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
            الرمزية:
          </span>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {birthFlower.symbolism}
          </p>
        </div>
      </div>
    </Card>
  );
}
