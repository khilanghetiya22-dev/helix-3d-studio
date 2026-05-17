interface HelixIconProps {
  size?: number;
  variant?: 'dark' | 'navy' | 'gold';
  className?: string;
}

export default function HelixIcon({ size = 40, variant = 'dark', className = '' }: HelixIconProps) {
  const bg = variant === 'navy' ? '#0D1B2A' : variant === 'gold' ? '#C9A84C' : '#0A0A0F';
  const stroke = variant === 'gold' ? '#0A0A0F' : '#C9A84C';
  const fill = variant === 'gold' ? '#0A0A0F' : '#F5F0E8';

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="100" height="100" fill={bg}/>
      <polygon points="50,8 86,29 86,71 50,92 14,71 14,29" fill="none" stroke={stroke} strokeWidth="1.5"/>
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
