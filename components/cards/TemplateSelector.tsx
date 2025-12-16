/**
 * Template Selector Component - Main component for selecting card templates
 */
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { CategoryFilter } from './CategoryFilter';
import { TemplateGrid } from './TemplateGrid';
import {
  getTemplatesByCategory,
  type CardTemplate,
  type TemplateCategory,
} from '@/lib/cards/templates';

interface TemplateSelectorProps {
  selectedTemplate: CardTemplate | null;
  onTemplateSelect: (template: CardTemplate) => void;
}

export function TemplateSelector({
  selectedTemplate,
  onTemplateSelect,
}: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    TemplateCategory | 'all'
  >('all');

  // Memoized filtered templates for performance (< 200ms requirement)
  const filteredTemplates = useMemo(() => {
    return getTemplatesByCategory(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = useCallback(
    (category: TemplateCategory | 'all') => {
      setSelectedCategory(category);
    },
    []
  );

  const handleTemplateSelect = useCallback(
    (template: CardTemplate) => {
      onTemplateSelect(template);
    },
    [onTemplateSelect]
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          اختر تصميم البطاقة
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {filteredTemplates.length} تصميم متاح
        </p>
      </div>

      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <TemplateGrid
        templates={filteredTemplates}
        selectedTemplateId={selectedTemplate?.id || null}
        onTemplateSelect={handleTemplateSelect}
      />
    </div>
  );
}

export default TemplateSelector;
