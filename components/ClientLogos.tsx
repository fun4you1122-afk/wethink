'use client'

type Logo = {
  name: string
  image?: string
  accent: string
}

// Fill `image` with the generated logo URL once available — falls back to a
// styled wordmark until then.
const LOGOS: Logo[] = [
  { name: 'Nexa Pay', image: '/logos/nexa-pay.png', accent: '#A78BFA' },
  { name: 'Lumora', image: '/logos/lumora.png', accent: '#E4C589' },
  { name: 'CargoFlow', image: '/logos/cargoflow.png', accent: '#FB923C' },
  { name: 'Pulse Loop', image: '/logos/pulse-loop.png', accent: '#34D399' },
  { name: 'قهوة الأصالة', image: '/logos/qahwat-al-asala.png', accent: '#C58B4A' },
  { name: 'أنماط', image: '/logos/anmat.png', accent: '#D4AF37' },
  { name: 'عبير الديار', image: '/logos/abeer-al-diyar.png', accent: '#9B7EBD' },
  { name: 'مساكن', image: '/logos/masaken.png', accent: '#2DD4BF' },
]

function LogoCard({ logo }: { logo: Logo }) {
  return (
    <div
      className="flex h-28 w-48 shrink-0 items-center justify-center overflow-hidden rounded-2xl border grayscale opacity-60 transition-[filter,opacity] duration-300 hover:grayscale-0 hover:opacity-100"
      style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(124,58,237,0.18)', willChange: 'filter' }}
    >
      {logo.image ? (
        <img
          src={logo.image}
          alt={logo.name}
          width={400}
          height={240}
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className="text-xl font-extrabold tracking-tight"
          style={{ color: logo.accent }}
        >
          {logo.name}
        </span>
      )}
    </div>
  )
}

function Row({ reverse = false }: { reverse?: boolean }) {
  const doubled = [...LOGOS, ...LOGOS]
  return (
    <div style={{ overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent, black 6%, black 94%, transparent)' }}>
      <div
        className="flex gap-5"
        style={{
          width: 'max-content',
          animation: `${reverse ? 'logo-marquee-reverse' : 'logo-marquee'} 36s linear infinite`,
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      >
        {doubled.map((logo, i) => (
          <LogoCard key={`${logo.name}-${i}`} logo={logo} />
        ))}
      </div>
    </div>
  )
}

export default function ClientLogos() {
  return (
    <section className="section-padding relative overflow-hidden">
      <style>{`
        @keyframes logo-marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes logo-marquee-reverse {
          from { transform: translate3d(-50%, 0, 0); }
          to { transform: translate3d(0, 0, 0); }
        }
      `}</style>

      <div className="relative max-w-7xl mx-auto px-6 text-center mb-12">
        <span className="section-label mx-auto">Pre-Launch Partners</span>
        <h2 className="text-3xl md:text-5xl font-black mt-3" style={{ color: 'var(--text)' }}>
          Brands We Helped <span className="gradient-text">Launch</span>
        </h2>
        <p className="mt-4 text-text-muted text-lg max-w-2xl mx-auto">
          A few of the entrepreneurs and ventures across the UAE, the Gulf, and beyond we built and launched
          with from day one — before they ever went to market.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <Row />
        <Row reverse />
      </div>
    </section>
  )
}
