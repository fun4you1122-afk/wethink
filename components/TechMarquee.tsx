'use client'

const ROW1 = [
  'AWS', 'Microsoft Azure', 'Google Cloud Platform', 'React & Next.js',
  'Node.js', 'ISO 27001 Ready', 'DevOps & CI/CD', 'Kubernetes',
]

const ROW2 = [
  'Zero Trust Security', 'Power BI', 'Terraform', 'NESA Compliant',
  'SAP Integration', 'Azure DevOps', 'Microservices', 'PostgreSQL & MongoDB',
]

function Row({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div style={{ overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)' }}>
      <div
        className="marquee-track"
        style={{
          display: 'flex',
          gap: '0.875rem',
          width: 'max-content',
          animation: `${reverse ? 'marquee-reverse' : 'marquee'} 30s linear infinite`,
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 1.1rem',
              borderRadius: 999,
              background: 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.25)',
              color: '#8B8BAA',
              fontSize: '0.78rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              letterSpacing: '0.01em',
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
                flexShrink: 0,
              }}
            />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function TechMarquee() {
  return (
    <section style={{ padding: '2.5rem 0', overflow: 'hidden' }}>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Row items={ROW1} />
        <Row items={ROW2} reverse />
      </div>
    </section>
  )
}
