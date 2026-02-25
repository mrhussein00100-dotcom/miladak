/**
 * Category Filter Component for Card Templates
 */
'use client';

import React from 'react';
import {
  TEMPLATE_CATEGORIES,
  type TemplateCategory,
} from '@/lib/cards/templates';

interface CategoryFilterProps {
  selectedCategory: TemplateCategory | 'all';
  onCategoryChange: (category: TemplateCategory | 'all') => void;
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      {TEMPLATE_CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }
          `}
        >
          {category.nameAr}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
