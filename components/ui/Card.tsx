import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
  glass?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', padding = true, hover = false, glass = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        ${glass ? 'glass-card' : 'bg-white'}
        rounded-2xl border transition-all duration-300
        ${glass ? 'border-white/60' : 'border-slate-200'}
        ${padding ? 'p-8' : ''}
        ${hover ? 'hover-lift cursor-pointer hover:border-slate-300' : ''}
        ${!glass ? 'shadow-sm hover:shadow-md' : ''}
        ${className}
      `}
      style={{
        boxShadow: glass ? 'var(--shadow-soft-lg)' : 'var(--shadow-soft)',
      }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-6 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-2xl font-bold text-slate-900 tracking-tight ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-base text-slate-600 leading-relaxed mt-2 ${className}`}>{children}</p>;
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mt-6 pt-6 border-t border-slate-200 ${className}`}>{children}</div>;
}
