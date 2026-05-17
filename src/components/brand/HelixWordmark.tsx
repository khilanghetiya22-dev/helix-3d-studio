interface HelixWordmarkProps {
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function HelixWordmark({ theme = 'dark', size = 'md', className = '' }: HelixWordmarkProps) {
  const nameColor = theme === 'light' ? '#0A0A0F' : '#F5F0E8';
  const subColor = theme === 'light' ? '#6B6B6B' : 'rgba(245,244,240,0.55)';

  const sizeMap = {
    sm: { name: '16px', sub: '6px', spacing: '0.22em' },
    md: { name: '22px', sub: '8px', spacing: '0.22em' },
    lg: { name: '32px', sub: '11px', spacing: '0.22em' },
  };

  const { name, sub, spacing } = sizeMap[size];

  return (
    <div style={{ textAlign: 'left' }} className={className}>
      <div style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontWeight: 200, 
        fontSize: name, 
        letterSpacing: spacing,
        textTransform: 'uppercase', 
        color: nameColor, 
        lineHeight: 1
      }}>HELIX</div>
      <div style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontWeight: 400, 
        fontSize: sub, 
        letterSpacing: '0.35em',
        textTransform: 'uppercase', 
        color: subColor, 
        marginTop: size === 'sm' ? '2px' : '4px'
      }}>3D Studio</div>
    </div>
  );
}
