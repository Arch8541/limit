'use client';

import React, { forwardRef } from 'react';

/* ============================================================================
   CARD COMPONENT SYSTEM - Architectural Precision Design
   ============================================================================ */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'gradient-border' | 'blueprint';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  glass?: boolean; // Legacy support
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      hover = false,
      glass = false,
      className = '',
      ...props
    },
    ref
  ) => {
    // Handle legacy glass prop
    const effectiveVariant = glass ? 'glass' : variant;

    const baseStyles = `
      rounded-[var(--radius-xl)]
      transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]
    `;

    const variants = {
      default: `
        bg-[var(--bg-secondary)]
        border border-[var(--border-default)]
      `,
      elevated: `
        bg-[var(--bg-elevated)]
        border border-[var(--border-strong)]
        shadow-[var(--shadow-md)]
      `,
      glass: `
        bg-[rgba(18,18,20,0.7)]
        backdrop-blur-[20px] backdrop-saturate-[180%]
        border border-[var(--border-default)]
      `,
      'gradient-border': `
        relative bg-[var(--bg-secondary)]
        before:content-[''] before:absolute before:inset-0
        before:rounded-[inherit] before:p-[1px]
        before:bg-gradient-to-br before:from-[var(--accent-primary)] before:to-[var(--blueprint)]
        before:-z-10
        before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
        before:[mask-composite:exclude]
      `,
      blueprint: `
        relative bg-[var(--bg-secondary)]
        border border-[var(--blueprint-subtle)]
        before:content-[''] before:absolute before:top-[-1px] before:left-[-1px]
        before:w-5 before:h-5 before:border-t-2 before:border-l-2 before:border-[var(--blueprint)]
        after:content-[''] after:absolute after:bottom-[-1px] after:right-[-1px]
        after:w-5 after:h-5 after:border-b-2 after:border-r-2 after:border-[var(--blueprint)]
        before:opacity-50 after:opacity-50
      `,
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const hoverStyles = hover
      ? `
        cursor-pointer
        hover:border-[var(--border-accent)]
        hover:shadow-[var(--shadow-glow)]
        hover:-translate-y-1
      `
      : '';

    return (
      <div
        ref={ref}
        className={`
          ${baseStyles}
          ${variants[effectiveVariant]}
          ${paddings[padding]}
          ${hoverStyles}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/* Card Header */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'sm' | 'md' | 'lg';
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, spacing = 'md', className = '', ...props }, ref) => {
    const spacings = {
      sm: 'mb-3',
      md: 'mb-5',
      lg: 'mb-8',
    };

    return (
      <div ref={ref} className={`${spacings[spacing]} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/* Card Title */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'sm' | 'md' | 'lg';
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, as: Component = 'h3', size = 'md', className = '', ...props }, ref) => {
    const sizes = {
      sm: 'text-lg font-semibold tracking-tight',
      md: 'text-xl font-semibold tracking-tight',
      lg: 'text-2xl font-bold tracking-tight',
    };

    return (
      <Component
        ref={ref}
        className={`
          text-[var(--text-primary)]
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = 'CardTitle';

/* Card Description */
export const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ children, className = '', ...props }, ref) => (
  <p
    ref={ref}
    className={`
      mt-1.5 text-[var(--text-secondary)]
      text-sm leading-relaxed
      ${className}
    `}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = 'CardDescription';

/* Card Content */
export const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className = '', ...props }, ref) => (
  <div ref={ref} className={className} {...props}>
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

/* Card Footer */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  border?: boolean;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, border = true, className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`
        mt-6 pt-5
        ${border ? 'border-t border-[var(--border-subtle)]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

/* Stat Card - For dashboard metrics */
export interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, change, icon, className = '' }: StatCardProps) {
  const trendColors = {
    up: 'text-[var(--success)]',
    down: 'text-[var(--error)]',
    neutral: 'text-[var(--text-tertiary)]',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  return (
    <Card variant="elevated" padding="md" className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="label mb-2">{label}</p>
          <p className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            {value}
          </p>
          {change && (
            <p className={`mt-2 text-sm font-medium ${trendColors[change.trend]}`}>
              {trendIcons[change.trend]} {Math.abs(change.value)}%
              <span className="text-[var(--text-muted)] ml-1">vs last month</span>
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-[var(--radius-lg)] bg-[var(--accent-subtle)]">
            <div className="w-6 h-6 text-[var(--accent-primary)]">{icon}</div>
          </div>
        )}
      </div>
    </Card>
  );
}

/* Feature Card - For landing pages */
export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className = '' }: FeatureCardProps) {
  return (
    <Card
      variant="default"
      padding="lg"
      hover
      className={`group ${className}`}
    >
      <div className="mb-5 w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--accent-subtle)] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-[var(--accent-primary)]">
        <div className="w-6 h-6 text-[var(--accent-primary)] transition-colors group-hover:text-[var(--bg-primary)]">
          {icon}
        </div>
      </div>
      <CardTitle size="md" className="mb-3 group-hover:text-[var(--accent-primary)] transition-colors">
        {title}
      </CardTitle>
      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
        {description}
      </p>
    </Card>
  );
}
