import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ahmad Saeed — Founder | WeThink',
  description:
    'Digital business card of Ahmad Saeed, Founder of WeThink — IT consulting and digital transformation in Abu Dhabi, UAE. Save the contact, connect on WhatsApp, LinkedIn, or Instagram.',
  alternates: { canonical: '/card/ahmad' },
  openGraph: {
    title: 'Ahmad Saeed — Founder | WeThink',
    description:
      'Digital business card — IT consulting and digital transformation in Abu Dhabi, UAE.',
    url: '/card/ahmad',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ahmad Saeed — Founder | WeThink',
  },
}

export default function AhmadCardLayout({ children }: { children: React.ReactNode }) {
  return children
}
