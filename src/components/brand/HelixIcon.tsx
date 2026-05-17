interface HelixIconProps {
  size?: number;
  variant?: 'dark' | 'navy' | 'gold';
  className?: string;
}

export default function HelixIcon({ size = 40, variant = 'dark', className = '' }: HelixIconProps) {
  const innerBg = variant === 'navy' ? '#0D1B2A' : variant === 'gold' ? '#C9A84C' : '#0A0A0F';
  const spokeColor = variant === 'gold' ? '#0A0A0F' : '#FFFFFF';

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* OUTER HEX */}
      <polygon 
        points="0,-52 45,-26 45,26 0,52 -45,26 -45,-26" 
        fill={variant === 'gold' ? '#0A0A0F' : '#C9A84C'} 
        transform="translate(60,60)"
      />

      {/* INNER CUTOUT */}
      <polygon 
        points="0,-36 31,-18 31,18 0,36 -31,18 -31,-18" 
        fill={innerBg} 
        transform="translate(60,60)"
      />

      {/* INNER RING BORDER */}
      <polygon 
        points="0,-36 31,-18 31,18 0,36 -31,18 -31,-18" 
        fill="none" 
        stroke={variant === 'gold' ? '#0A0A0F' : '#E8C96A'} 
        strokeWidth="0.7" 
        transform="translate(60,60)"
      />

      {/* SPOKES */}
      <line x1="60" y1="8" x2="60" y2="24" stroke={spokeColor} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="105" y1="34" x2="91" y2="42" stroke={spokeColor} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="105" y1="86" x2="91" y2="78" stroke={spokeColor} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="60" y1="112" x2="60" y2="96" stroke={spokeColor} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="15" y1="86" x2="29" y2="78" stroke={spokeColor} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="15" y1="34" x2="29" y2="42" stroke={spokeColor} strokeWidth="1.8" strokeLinecap="round"/>

      {/* HIDDEN ARROW */}
      <rect x="53" y="68" width="14" height="10" rx="1.5" fill={spokeColor}/>
      <polygon points="60,44 69,68 51,68" fill={spokeColor}/>
    </svg>
  );
}
