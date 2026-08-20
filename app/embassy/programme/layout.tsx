import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daily Programme — Marhaba Thailand | Reem Mall, Abu Dhabi · by WeThink',
  description:
    'What is happening each day at Marhaba Thailand — 11 and 12 September 2026, 10:00 AM to 10:00 PM at Reem Mall, Abu Dhabi. Three stages of Thai dance, live music, Muay Thai, and hands-on craft workshops.',
  alternates: { canonical: '/embassy/programme' },
  openGraph: {
    title: 'Marhaba Thailand — Daily Programme',
    siteName: 'WeThink',
    description: '11 – 12 September 2026 · 10:00 AM – 10:00 PM · Reem Mall, Abu Dhabi',
    url: '/embassy/programme',
    type: 'website',
  },
}

export default function ProgrammeLayout({ children }: { children: React.ReactNode }) {
  return children
}
