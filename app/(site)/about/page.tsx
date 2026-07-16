import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import About from '@/components/About'
import OurStory from '@/components/OurStory'
import Presence from '@/components/Presence'

const CinematicScene = dynamic(() => import('@/components/CinematicScene'))
const AppComingSoon = dynamic(() => import('@/components/AppComingSoon'))
const LogoAssembly = dynamic(() => import('@/components/LogoAssembly'))

export const metadata: Metadata = {
  title: 'About | WeThink',
  description:
    'The story of WeThink — an Abu Dhabi IT consultancy founded in 2019, our community presence, and what we are building next.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About | WeThink',
    description: 'The story of WeThink — Abu Dhabi IT consultancy founded in 2019.',
    url: '/about',
  },
}

export default function AboutPage() {
  return (
    <div className="pt-24">
      <About />
      <OurStory />
      <Presence />
      <CinematicScene />
      <AppComingSoon />
      <LogoAssembly />
    </div>
  )
}
