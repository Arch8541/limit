'use client';

import React, { forwardRef } from 'react';

/* ============================================================================
   BADGE COMPONENT - Architectural Status Indicators
   ============================================================================ */

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error' | 'blueprint' | 'info';
  size?: 'sm' | 'md';
  dot?: boolean;
  icon?: React.ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = 'default',
      size = 'sm',
      dot = false,
      icon,
      className = '',
      ...props
    },
    ref
  ) => {
    const variants = {
      default: 'bg-[var(--bg-hover)] text-[var(--text-secondary)]',
      accent: 'bg-[var(--accent-subtle)] text-[var(--accent-primary)]',
      success: 'bg-[var(--success-bg)] text-[var(--success)]',
      warning: 'bg-[var(--warning-bg)] text-[var(--warning)]',
      error: 'bg-[var(--error-bg)] text-[var(--error)]',
      blueprint: 'bg-[var(--blueprint-subtle)] text-[var(--blueprint)]',
      info: 'bg-[var(--blueprint-subtle)] text-[var(--blueprint)]',
    };

    const sizes = {
      sm: 'px-2.5 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
    };

    const dotColors = {
      default: 'bg-[var(--text-tertiary)]',
      accent: 'bg-[var(--accent-primary)]',
      success: 'bg-[var(--success)]',
      warning: 'bg-[var(--warning)]',
      error: 'bg-[var(--error)]',
      blueprint: 'bg-[var(--blueprint)]',
      info: 'bg-[var(--blueprint)]',
    };

    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center gap-1.5
          font-mono font-medium tracking-wide uppercase
          rounded-full
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {dot && (
          <span
            className={`
              w-1.5 h-1.5 rounded-full
              ${dotColors[variant]}
              ${variant !== 'default' ? 'shadow-[0_0_6px_currentColor]' : ''}
            `}
          />
        )}
        {icon && <span className="w-3.5 h-3.5">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

/* Status Badge - Specific for project statuses */
export interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();

  const statusConfig: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    draft: { variant: 'default', label: 'Draft' },
    processing: { variant: 'blueprint', label: 'Processing' },
    completed: { variant: 'success', label: 'Completed' },
    error: { variant: 'error', label: 'Error' },
  };

  const config = statusConfig[normalizedStatus] || { variant: 'default', label: status };

  return (
    <Badge variant={config.variant} dot className={className}>
      {config.label}
    </Badge>
  );
}
