import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group';

  const variantStyles = {
    primary: 'bg-gradient-to-br from-cyan-600 via-cyan-500 to-cyan-600 text-white hover:shadow-lg hover:shadow-cyan-500/30 focus:ring-cyan-500 hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 focus:ring-indigo-500 hover:-translate-y-0.5 active:translate-y-0',
    danger: 'bg-gradient-to-br from-red-600 via-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/30 focus:ring-red-500 hover:-translate-y-0.5 active:translate-y-0',
    ghost: 'bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:text-cyan-600 focus:ring-cyan-400 border border-slate-200 hover:border-cyan-300 hover:shadow-md',
    gradient: 'bg-gradient-to-br from-cyan-600 via-indigo-500 to-violet-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 focus:ring-indigo-500 hover:-translate-y-0.5 active:translate-y-0',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Hover shimmer effect */}
      {!disabled && variant !== 'ghost' && (
        <span className="absolute inset-0 flex h-full w-full">
          <span className="relative h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </span>
      )}

      <span className="relative z-10 flex items-center justify-center">
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5"
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
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </>
        ) : (
          children
        )}
      </span>
    </button>
  );
}
