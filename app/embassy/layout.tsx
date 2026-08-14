import type { Metadata } from 'next'
import { Fraunces, Jost } from 'next/font/google'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Marhaba Thailand — An Invitation | Royal Thai Embassy, Abu Dhabi',
  description:
    'Marhaba Thailand — a two-day celebration of Thai culture, craft, and hospitality at Reem Mall, Abu Dhabi, 11–12 September 2026. Programme, schedule, and RSVP.',
  alternates: { canonical: '/embassy' },
  // Client presentation, not an official Embassy page — keep it out of search
  // results until the Embassy signs off. Remove this block to publish.
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Marhaba Thailand — An Invitation',
    description:
      'Two days of Thai culture, craft, and hospitality at Reem Mall, Abu Dhabi · 11–12 September 2026',
    url: '/embassy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marhaba Thailand — An Invitation',
  },
}

export default function EmbassyLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${fraunces.variable} ${jost.variable}`}>{children}</div>
}
