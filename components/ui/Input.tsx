'use client';

import React, { forwardRef, useId } from 'react';

/* ============================================================================
   INPUT COMPONENT SYSTEM - Architectural Precision Design
   ============================================================================ */

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  helpText?: string; // Legacy alias
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      helpText,
      icon,
      rightIcon,
      inputSize = 'md',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const displayHelperText = helperText || helpText;

    const sizes = {
      sm: 'py-2 text-sm',
      md: 'py-3 text-base',
      lg: 'py-4 text-lg',
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
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
          {icon && (
            <div
              className="
                absolute left-4 top-1/2 -translate-y-1/2
                text-[var(--text-muted)]
                transition-colors duration-200
                group-focus-within:text-[var(--accent-primary)]
                pointer-events-none
              "
            >
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full
              bg-[var(--bg-tertiary)]
              border rounded-[var(--radius-lg)]
              text-[var(--text-primary)]
              placeholder:text-[var(--text-muted)]
              transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]
              focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              ${sizes[inputSize]}
              ${icon ? 'pl-12' : 'pl-4'}
              ${rightIcon ? 'pr-12' : 'pr-4'}
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
                ? `${inputId}-error`
                : displayHelperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />
          {rightIcon && (
            <div
              className="
                absolute right-4 top-1/2 -translate-y-1/2
                text-[var(--text-muted)]
              "
            >
              {rightIcon}
            </div>
          )}
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
            id={`${inputId}-error`}
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
        {displayHelperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed"
          >
            {displayHelperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/* Textarea Component */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
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
          <textarea
            ref={ref}
            id={textareaId}
            className={`
              w-full min-h-[120px] p-4
              bg-[var(--bg-tertiary)]
              border rounded-[var(--radius-lg)]
              text-[var(--text-primary)]
              placeholder:text-[var(--text-muted)]
              transition-all duration-200
              focus:outline-none
              resize-y
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
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-[var(--error)] font-medium">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-[var(--text-muted)]">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

/* Search Input - Specialized variant */
export interface SearchInputProps extends Omit<InputProps, 'icon'> {
  onSearch?: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onSearch?.(e.target.value);
    };

    return (
      <Input
        ref={ref}
        type="search"
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
        onChange={handleChange}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';
