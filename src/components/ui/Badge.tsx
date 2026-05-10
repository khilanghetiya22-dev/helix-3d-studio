import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'received' | 'printing' | 'quality_check' | 'shipped' | 'delivered' | 'info' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export default function Badge({
  variant = 'default',
  size = 'sm',
  children,
  className = '',
  dot = false,
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full border';

  const variants: Record<string, string> = {
    default: 'text-text-secondary bg-bg-elevated/50 border-border-primary',
    received: 'status-received',
    printing: 'status-printing',
    quality_check: 'status-quality_check',
    shipped: 'status-shipped',
    delivered: 'status-delivered',
    info: 'text-primary-light bg-primary/10 border-primary/30',
    success: 'text-accent-light bg-accent/10 border-accent/30',
    warning: 'text-warning bg-warning/10 border-warning/30',
    danger: 'text-danger bg-danger/10 border-danger/30',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs gap-1.5',
    md: 'px-3 py-1 text-sm gap-2',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${
          variant === 'default' ? 'bg-text-muted' : 'bg-current'
        }`} />
      )}
      {children}
    </span>
  );
}
