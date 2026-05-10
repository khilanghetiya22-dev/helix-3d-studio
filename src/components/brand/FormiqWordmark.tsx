import React from 'react';

interface FormiqWordmarkProps {
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function FormiqWordmark({ theme = 'dark', size = 'md', className = '' }: FormiqWordmarkProps) {
  const nameColor = theme === 'light' ? '#1A1A1A' : '#F5F4F0';
  const subColor = theme === 'light' ? '#6B6B6B' : 'rgba(245,244,240,0.55)';

  const sizes = {
    sm: { name: '16px', sub: '6px', gap: '2px' },
    md: { name: '22px', sub: '8px', gap: '4px' },
    lg: { name: '36px', sub: '11px', gap: '6px' },
  };

  const s = sizes[size];

  return (
    <div className={className} style={{ textAlign: 'left' }}>
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: 200,
          fontSize: s.name,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: nameColor,
          lineHeight: 1,
        }}
      >
        FORMIQ
      </div>
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: 400,
          fontSize: s.sub,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: subColor,
          marginTop: s.gap,
        }}
      >
        3D Print Studio
      </div>
    </div>
  );
}
