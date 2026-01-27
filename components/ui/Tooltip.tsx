'use client';

import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: string;
}

export function Tooltip({ children, content, position = 'top', maxWidth = 'max-w-xs' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute z-50 px-4 py-3 text-sm text-white bg-gradient-to-br from-teal-700 to-teal-600 rounded-xl shadow-xl backdrop-blur-sm ${maxWidth} ${positionStyles[position]} transition-all duration-200 animate-in fade-in slide-in-from-bottom-2`}
        >
          <div className="whitespace-normal">{content}</div>
          <div
            className={`absolute w-2 h-2 bg-teal-700 transform rotate-45 ${
              position === 'top'
                ? 'bottom-[-4px] left-1/2 -translate-x-1/2'
                : position === 'bottom'
                ? 'top-[-4px] left-1/2 -translate-x-1/2'
                : position === 'left'
                ? 'right-[-4px] top-1/2 -translate-y-1/2'
                : 'left-[-4px] top-1/2 -translate-y-1/2'
            }`}
          />
        </div>
      )}
    </div>
  );
}

export function InfoTooltip({ content, position = 'top' }: { content: string | React.ReactNode; position?: 'top' | 'bottom' | 'left' | 'right' }) {
  return (
    <Tooltip content={content} position={position}>
      <HelpCircle className="w-4 h-4 text-teal-600 hover:text-teal-700 cursor-help inline-block" />
    </Tooltip>
  );
}
