'use client'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const heights = { sm: 44, md: 56, lg: 72 }
  const h = heights[size]

  return (
    <img
      src="/logo.png"
      alt="WeThink — Think. Plan. Grow."
      height={h}
      style={{
        height: h,
        width: 'auto',
        objectFit: 'contain',
        filter: 'none',
      }}
      className={className}
    />
  )
}
