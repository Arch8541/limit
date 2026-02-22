'use client';

import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'blueprint' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      relative inline-flex items-center justify-center gap-2
      font-medium tracking-tight
      transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      select-none overflow-hidden
    `;

    const variants = {
      primary: `
        bg-gradient-to-b from-[var(--accent-primary)] to-[var(--accent-secondary)]
        text-[var(--bg-primary)] font-semibold
        shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,var(--shadow-sm)]
        hover:shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,var(--shadow-md),var(--shadow-glow)]
        hover:-translate-y-0.5
        active:translate-y-0 active:shadow-[var(--shadow-xs)]
        focus-visible:ring-[var(--accent-primary)]
      `,
      secondary: `
        bg-transparent text-[var(--text-primary)]
        border border-[var(--border-strong)]
        hover:bg-[var(--bg-hover)] hover:border-[var(--text-tertiary)]
        active:bg-[var(--bg-tertiary)]
        focus-visible:ring-[var(--text-tertiary)]
      `,
      ghost: `
        bg-transparent text-[var(--text-secondary)]
        hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]
        active:bg-[var(--bg-tertiary)]
        focus-visible:ring-[var(--text-tertiary)]
      `,
      blueprint: `
        bg-[var(--blueprint-subtle)] text-[var(--blueprint)]
        border border-[rgba(6,182,212,0.2)]
        hover:bg-[rgba(6,182,212,0.15)] hover:border-[var(--blueprint-muted)]
        hover:shadow-[var(--shadow-blueprint)]
        focus-visible:ring-[var(--blueprint)]
      `,
      danger: `
        bg-gradient-to-b from-[var(--error)] to-[var(--error-muted)]
        text-white font-semibold
        shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,var(--shadow-sm)]
        hover:shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,var(--shadow-md),0_0_20px_rgba(239,68,68,0.3)]
        hover:-translate-y-0.5
        active:translate-y-0
        focus-visible:ring-[var(--error)]
      `,
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-[var(--radius-md)]',
      md: 'px-5 py-2.5 text-base rounded-[var(--radius-lg)]',
      lg: 'px-7 py-3.5 text-lg rounded-[var(--radius-xl)]',
    };

    return (
      <button
        ref={ref}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Shimmer effect on hover */}
        {variant === 'primary' && !disabled && (
          <span
            className="absolute inset-0 opacity-0 hover:opacity-100"
            aria-hidden="true"
          >
            <span className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </span>
        )}

        {/* Content */}
        <span className="relative z-10 inline-flex items-center gap-2">
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <>
              {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
              {children}
              {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
            </>
          )}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';
