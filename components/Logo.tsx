'use client'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  // Heights were fixed pixels, so the navbar mark was 96px tall on a phone and
  // hung across the hero's lighting rail. Each size is now a pair: phone, then
  // from sm upwards.
  const heights = {
    sm: 'h-9 sm:h-12',
    md: 'h-11 sm:h-[120px]',
    lg: 'h-14 sm:h-[148px]',
  }

  return (
    <img
      src="/logo.png"
      alt="WeThink — Think. Plan. Grow."
      className={`w-auto object-contain ${heights[size]} ${className}`}
    />
  )
}
