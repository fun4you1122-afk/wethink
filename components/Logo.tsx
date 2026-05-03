'use client'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'full' | 'icon'
}

export default function Logo({ className = '', size = 'md', variant = 'full' }: LogoProps) {
  const sizes = {
    sm: { width: 120, height: 36 },
    md: { width: 160, height: 48 },
    lg: { width: 220, height: 66 },
  }

  const { width, height } = sizes[size]

  if (variant === 'icon') {
    return (
      <svg
        width={height}
        height={height}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="30" cy="10" r="4" fill="#5B21B6" />
        <path
          d="M18 30 Q24 40 30 30"
          stroke="#5B21B6"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    )
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 220 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* "We Think" text */}
      <text
        x="0"
        y="46"
        fontFamily="Inter, sans-serif"
        fontWeight="800"
        fontSize="46"
        fill="white"
        letterSpacing="-1"
      >
        We Think
      </text>

      {/* Dot above arc */}
      <circle cx="196" cy="10" r="5" fill="#5B21B6" />

      {/* Arc / smile */}
      <path
        d="M178 38 Q196 58 214 38"
        stroke="#5B21B6"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Tagline */}
      <text
        x="2"
        y="62"
        fontFamily="Inter, sans-serif"
        fontWeight="400"
        fontSize="9"
        fill="rgba(255,255,255,0.65)"
        letterSpacing="3"
      >
        DIGITAL SMART SOLUTIONS
      </text>
    </svg>
  )
}
