'use client';

import React from 'react';
import {
  DecorationType,
  DECORATION_CONFIGS,
  DecorationConfig,
} from '@/lib/cards/decorations';
import {
  Balloons,
  Stars,
  Confetti,
  Sparkles,
  Hearts,
  Flowers,
} from './decorations';

interface DecorationLayerProps {
  decorations: DecorationType[];
  className?: string;
}

/**
 * Renders decoration components based on decoration types
 * Ensures decorations don't block content with proper z-index
 */
export function DecorationLayer({
  decorations = [],
  className = '',
}: DecorationLayerProps) {
  // Safety check - return null if no decorations
  if (!decorations || decorations.length === 0) {
    return null;
  }

  const renderDecoration = (type: DecorationType, config: DecorationConfig) => {
    const commonProps = {
      positions: config.positions,
      colors: config.colors,
      animated: config.animated,
      opacity: config.opacity,
    };

    switch (type) {
      case 'balloons':
        return <Balloons key={type} {...commonProps} />;
      case 'stars':
        return <Stars key={type} {...commonProps} />;
      case 'confetti':
        return <Confetti key={type} {...commonProps} />;
      case 'sparkles':
        return <Sparkles key={type} {...commonProps} />;
      case 'hearts':
        return <Hearts key={type} {...commonProps} />;
      case 'flowers':
        return <Flowers key={type} {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    >
      {decorations.map((type) => {
        const config = DECORATION_CONFIGS[type];
        if (!config) return null;
        return renderDecoration(type, config);
      })}
    </div>
  );
}

export default DecorationLayer;
