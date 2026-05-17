import React from 'react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  city: string;
  rating?: number;
  technology?: string;
}

export default function TestimonialCard({
  quote,
  name,
  city,
  rating = 5,
  technology,
}: TestimonialCardProps) {
  return (
    <div
      style={{
        backgroundColor: '#0D1B2A',
        border: '1px solid rgba(201,168,76,0.15)',
        borderRadius: '12px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Star rating */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={i < rating ? '#C9A84C' : 'none'}
            stroke={i < rating ? '#C9A84C' : '#6B6B6B'}
            strokeWidth="1.5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <p
        style={{
          fontFamily: 'Georgia, Times New Roman, serif',
          fontStyle: 'italic',
          fontSize: '15px',
          lineHeight: '1.7',
          color: '#F5F0E8',
          flexGrow: 1,
        }}
      >
        &ldquo;{quote}&rdquo;
      </p>

      {/* Gold rule */}
      <div
        style={{
          height: '0.5px',
          backgroundColor: '#C9A84C',
          opacity: 0.2,
        }}
      />

      {/* Author */}
      <div>
        <p
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 500,
            fontSize: '14px',
            color: '#F5F0E8',
            letterSpacing: '0.02em',
          }}
        >
          {name}
        </p>
        <p
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '12px',
            color: '#6B6B6B',
            marginTop: '2px',
          }}
        >
          {city}
          {technology && (
            <span
              style={{
                marginLeft: '8px',
                color: '#C9A84C',
                fontSize: '10px',
                backgroundColor: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.2)',
                padding: '1px 6px',
                borderRadius: '4px',
              }}
            >
              {technology}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
