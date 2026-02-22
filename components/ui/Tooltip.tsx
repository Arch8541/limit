'use client';

import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

/* ============================================================================
   TOOLTIP COMPONENT - Architectural Precision Design
   ============================================================================ */

export interface TooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: string;
  delay?: number;
}

export function Tooltip({
  children,
  content,
  position = 'top',
  maxWidth = 'max-w-xs',
  delay = 200,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowStyles = {
    top: 'bottom-[-4px] left-1/2 -translate-x-1/2',
    bottom: 'top-[-4px] left-1/2 -translate-x-1/2',
    left: 'right-[-4px] top-1/2 -translate-y-1/2',
    right: 'left-[-4px] top-1/2 -translate-y-1/2',
  };

  return (
    <div className="relative inline-flex">
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      {isVisible && (
        <div
          role="tooltip"
          className={`
            absolute z-50 px-3 py-2
            text-sm text-[var(--text-primary)]
            bg-[var(--bg-elevated)] backdrop-blur-xl
            border border-[var(--border-strong)]
            rounded-[var(--radius-lg)]
            shadow-[var(--shadow-lg)]
            ${maxWidth} ${positionStyles[position]}
            animate-scale-in
          `}
        >
          <div className="whitespace-normal leading-relaxed">{content}</div>
          <div
            className={`
              absolute w-2 h-2
              bg-[var(--bg-elevated)]
              border-r border-b border-[var(--border-strong)]
              transform rotate-45
              ${arrowStyles[position]}
            `}
          />
        </div>
      )}
    </div>
  );
}

/* Info Tooltip - Help icon variant */
export interface InfoTooltipProps {
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function InfoTooltip({ content, position = 'top' }: InfoTooltipProps) {
  return (
    <Tooltip content={content} position={position}>
      <button
        type="button"
        className="
          inline-flex items-center justify-center
          w-5 h-5 rounded-full
          text-[var(--text-muted)]
          hover:text-[var(--accent-primary)]
          hover:bg-[var(--accent-subtle)]
          transition-colors cursor-help
          focus:outline-none focus-visible:ring-2
          focus-visible:ring-[var(--accent-primary)]
        "
        aria-label="More information"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
    </Tooltip>
  );
}
