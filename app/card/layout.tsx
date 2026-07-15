import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rasha Aljalam — CEO & Founder | WeThink',
  description:
    'Digital business card of Rasha Aljalam, CEO & Founder of WeThink — IT consulting and digital transformation in Abu Dhabi, UAE. Save the contact, connect on WhatsApp, LinkedIn, or Instagram.',
  alternates: { canonical: '/card' },
  openGraph: {
    title: 'Rasha Aljalam — CEO & Founder | WeThink',
    description:
      'Digital business card — IT consulting and digital transformation in Abu Dhabi, UAE.',
    url: '/card',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rasha Aljalam — CEO & Founder | WeThink',
  },
}

export default function CardLayout({ children }: { children: React.ReactNode }) {
  return children
}
