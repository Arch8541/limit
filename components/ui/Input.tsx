import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  helpText?: string;
  icon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  helpText,
  icon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-slate-700 mb-2.5 tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 transition-colors group-focus-within:text-cyan-500">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            block w-full rounded-xl border-2 transition-all duration-200
            ${error ? 'border-red-300 bg-red-50/30' : 'border-slate-200 bg-white'}
            ${icon ? 'pl-12' : 'pl-4'}
            pr-4 py-3.5
            text-slate-900 placeholder-slate-400
            focus:outline-none focus:ring-4
            ${error ? 'focus:ring-red-100 focus:border-red-400' : 'focus:ring-cyan-100 focus:border-cyan-400'}
            disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-500
            hover:border-slate-300
            shadow-sm focus:shadow-md
            ${className}
          `}
          {...props}
        />
        {/* Floating focus indicator */}
        <div className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full transition-all duration-200 ${error ? 'bg-red-400' : 'bg-cyan-400'} scale-x-0 group-focus-within:scale-x-100`} />
      </div>
      {error && (
        <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium">
          <span className="text-base">⚠</span> {error}
        </p>
      )}
      {(helperText || helpText) && !error && (
        <p className="mt-2.5 text-sm text-slate-500 leading-relaxed">{helperText || helpText}</p>
      )}
    </div>
  );
}
