'use client'

import { Typewriter } from '@/components/ui/typewriter-text'

export default function BigOnPurpose() {
  return (
    <section className="relative overflow-hidden" style={{ padding: '4.5rem 0' }}>
      <div className="orb w-[420px] h-[420px] bg-violet-900/15 opacity-25 top-[-120px] left-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <p
          className="text-sm md:text-base font-semibold uppercase tracking-widest mb-4"
          style={{ color: 'var(--text-muted)' }}
        >
          A quick note before you keep scrolling
        </p>

        <h2 className="min-h-[3.5em] md:min-h-[2.4em] text-2xl md:text-4xl lg:text-5xl font-black leading-tight" style={{ color: 'var(--text)' }}>
          <Typewriter
            text={[
              "Yes, our website is long — on purpose.",
              "Every section is a skill we've shipped for a client.",
              "Scroll far enough and you've seen our whole team at work.",
            ]}
            speed={45}
            deleteSpeed={20}
            delay={2200}
            loop
            className="gradient-text"
          />
        </h2>

        <p className="mt-6 text-base md:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Every animation, layout, and interaction on this page is a capability we can build for your
          brand too. We didn&apos;t make it long by accident — we made it long to show you what&apos;s possible.
        </p>
      </div>
    </section>
  )
}
