import React from 'react';

type BadgeVariant = 'positive' | 'negative' | 'warning' | 'info' | 'muted' | 'primary';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

const variantClasses: Record<BadgeVariant, string> = {
  positive: 'bg-[var(--positive-bg)] text-positive border-positive/20',
  negative: 'bg-[var(--negative-bg)] text-negative border-negative/20',
  warning: 'bg-[var(--warning-bg)] text-warning border-warning/20',
  info: 'bg-[var(--info-bg)] text-accent border-accent/20',
  muted: 'bg-secondary text-muted-foreground border-border',
  primary: 'bg-primary/10 text-primary border-primary/20',
};

export default function Badge({
  variant = 'muted',
  children,
  className = '',
  size = 'sm',
}: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${sizeClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
