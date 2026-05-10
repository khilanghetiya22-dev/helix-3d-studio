'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  hint,
  icon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium" style={{ color: '#9CA3AF' }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B6B6B' }}>
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full rounded-lg border 
            placeholder:text-[#6B6B6B]
            focus:outline-none focus:ring-1
            transition-all duration-200
            ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 text-sm
            ${className}
          `}
          style={{
            backgroundColor: '#111',
            borderColor: error ? '#C9920A' : 'rgba(201,146,10,0.2)',
            color: '#F5F4F0',
            ...(error ? {} : {}),
          }}
          onFocus={(e) => { e.target.style.borderColor = '#C9920A'; e.target.style.boxShadow = '0 0 0 1px #C9920A'; }}
          onBlur={(e) => { e.target.style.borderColor = error ? '#C9920A' : 'rgba(201,146,10,0.2)'; e.target.style.boxShadow = 'none'; }}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs flex items-center gap-1" style={{ color: '#C9920A' }}>
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs" style={{ color: '#6B6B6B' }}>{hint}</p>
      )}
    </div>
  );
}
