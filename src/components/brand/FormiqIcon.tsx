import React from 'react';

interface FormiqIconProps {
  size?: number;
  variant?: 'dark' | 'navy' | 'gold';
  className?: string;
}

export default function FormiqIcon({ size = 40, variant = 'dark', className = '' }: FormiqIconProps) {
  const bg = variant === 'navy' ? '#1B2A4A' : variant === 'gold' ? '#C9920A' : '#1A1A1A';
  const stroke = variant === 'gold' ? '#1A1A1A' : '#C9920A';
  const fill = variant === 'gold' ? '#1A1A1A' : '#F5F4F0';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="100" height="100" fill={bg} />
      <polygon
        points="50,8 86,29 86,71 50,92 14,71 14,29"
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
      />
      <text
        x="50"
        y="60"
        textAnchor="middle"
        fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif"
        fontWeight="200"
        fontSize="34"
        fill={fill}
      >
        F
      </text>
    </svg>
  );
}
