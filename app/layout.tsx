import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import CustomCursor from '@/components/CustomCursor'
import WhatsAppButton from '@/components/WhatsAppButton'
import ScrollProgress from '@/components/ScrollProgress'
import AiChat from '@/components/AiChat'
import CursorSpotlight from '@/components/CursorSpotlight'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
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
  openGraph: {
    title: 'WeThink | Digital Smart Solutions',
    description: 'Transforming Ideas into Impactful Realities — Abu Dhabi, UAE',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <ScrollProgress />
        <CustomCursor />
        <CursorSpotlight />
        <WhatsAppButton />
        <AiChat />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
