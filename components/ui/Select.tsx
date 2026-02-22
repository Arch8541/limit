'use client';

import React, { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

/* ============================================================================
   SELECT COMPONENT - Architectural Precision Design
   ============================================================================ */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  selectSize?: 'sm' | 'md' | 'lg';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      selectSize = 'md',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    const sizes = {
      sm: 'py-2 text-sm',
      md: 'py-3 text-base',
      lg: 'py-4 text-lg',
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="
              block mb-2
              font-mono text-xs font-medium tracking-[0.05em] uppercase
              text-[var(--text-tertiary)]
            "
          >
            {label}
          </label>
        )}
        <div className="relative group">
          <select
            ref={ref}
            id={selectId}
            className={`
              w-full appearance-none
              bg-[var(--bg-tertiary)]
              border rounded-[var(--radius-lg)]
              text-[var(--text-primary)]
              transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]
              focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              cursor-pointer
              ${sizes[selectSize]}
              pl-4 pr-10
              ${
                error
                  ? `
                    border-[var(--error)] bg-[var(--error-bg)]
                    focus:ring-2 focus:ring-[var(--error-bg)]
                  `
                  : `
                    border-[var(--border-default)]
                    hover:border-[var(--border-strong)]
                    focus:border-[var(--accent-primary)]
                    focus:ring-2 focus:ring-[var(--accent-subtle)]
                  `
              }
              ${className}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${selectId}-error`
                : helperText
                ? `${selectId}-helper`
                : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="bg-[var(--bg-secondary)] text-[var(--text-primary)]"
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown arrow */}
          <div
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              pointer-events-none
              text-[var(--text-muted)]
              transition-colors duration-200
              group-focus-within:text-[var(--accent-primary)]
            "
          >
            <ChevronDown className="w-5 h-5" />
          </div>

          {/* Focus indicator line */}
          <div
            className={`
              absolute inset-x-0 -bottom-px h-0.5
              rounded-full scale-x-0
              transition-transform duration-200
              group-focus-within:scale-x-100
              ${error ? 'bg-[var(--error)]' : 'bg-[var(--accent-primary)]'}
            `}
          />
        </div>

        {error && (
          <p
            id={`${selectId}-error`}
            className="mt-2 text-sm text-[var(--error)] font-medium flex items-center gap-1.5"
            role="alert"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${selectId}-helper`}
            className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
