/**
 * Template Grid Component - Displays card templates in a grid
 */
'use client';

import React from 'react';
import { type CardTemplate } from '@/lib/cards/templates';

interface TemplateGridProps {
  templates: CardTemplate[];
  selectedTemplateId: string | null;
  onTemplateSelect: (template: CardTemplate) => void;
}

export function TemplateGrid({
  templates,
  selectedTemplateId,
  onTemplateSelect,
}: TemplateGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onTemplateSelect(template)}
          className={`
            relative group rounded-xl overflow-hidden transition-all duration-300
            ${
              selectedTemplateId === template.id
                ? 'ring-4 ring-pink-500 scale-105 shadow-xl'
                : 'hover:scale-102 hover:shadow-lg'
            }
          `}
        >
          {/* Template Preview */}
          <div
            className="aspect-[3/4] p-3 flex flex-col items-center justify-center text-center"
            style={{
              background: template.style.background,
              border: template.style.border,
              borderRadius: template.style.borderRadius,
              color: template.style.color,
              fontFamily: template.style.fontFamily,
            }}
          >
            <span className="text-lg mb-1">
              {template.defaultContent.emojis[0]}
            </span>
            <span className="text-xs font-medium line-clamp-2">
              {template.nameAr}
            </span>
          </div>

          {/* Selection indicator */}
          {selectedTemplateId === template.id && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
        </button>
      ))}
    </div>
  );
}

export default TemplateGrid;
