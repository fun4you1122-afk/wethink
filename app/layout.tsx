import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import GlobalOverlays from '@/components/GlobalOverlays'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.wethink.ae'),
  title: 'WeThink | Digital Smart Solutions',
  description:
    'WeThink Information Technology Consulting — Transforming Ideas into Impactful Realities. Digital transformation, cloud, cybersecurity, and strategic IT consulting in Abu Dhabi, UAE.',
  keywords: [
    'IT consulting',
    'digital transformation',
    'cloud services',
    'cybersecurity',
    'Abu Dhabi',
    'UAE',
    'WeThink',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'WeThink | Digital Smart Solutions',
    description: 'Transforming Ideas into Impactful Realities — Abu Dhabi, UAE',
    type: 'website',
    url: '/',
    siteName: 'WeThink',
    locale: 'en_AE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WeThink | Digital Smart Solutions',
    description: 'Transforming Ideas into Impactful Realities — Abu Dhabi, UAE',
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'WeThink Information Technology Consulting',
  alternateName: 'WeThink',
  url: 'https://www.wethink.ae',
  logo: 'https://www.wethink.ae/logo.png',
  description:
    'IT consulting, digital transformation, cloud, cybersecurity, and custom software in Abu Dhabi, UAE.',
  foundingDate: '2019',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Abu Dhabi',
    addressCountry: 'AE',
  },
  telephone: '+971503125078',
  email: 'info@wethink.ae',
  sameAs: [
    'https://www.instagram.com/wethink.ae/',
    'https://www.linkedin.com/in/rasha-aljalam-74a6b4188/',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <GlobalOverlays />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
