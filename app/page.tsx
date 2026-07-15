import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Welcome from '@/components/Welcome'
import BigOnPurpose from '@/components/BigOnPurpose'
import OrbitalServices from '@/components/OrbitalServices'
import Services from '@/components/Services'
import About from '@/components/About'
import Stats from '@/components/Stats'
import TechMarquee from '@/components/TechMarquee'
import BeforeAfter from '@/components/BeforeAfter'
import IdeaToImpact from '@/components/IdeaToImpact'
import OurStory from '@/components/OurStory'
import Projects from '@/components/Projects'
import CaseStudies from '@/components/CaseStudies'
import ClientLogos from '@/components/ClientLogos'
import Testimonials from '@/components/Testimonials'
import Presence from '@/components/Presence'
import VideoSection from '@/components/VideoSection'
import Blog from '@/components/Blog'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

// Heavy animation-driven sections load as separate chunks so the initial
// bundle stays lean; they render server-side as usual.
const TransformationSplit = dynamic(() => import('@/components/TransformationSplit'))
const CinematicScene = dynamic(() => import('@/components/CinematicScene'))
const AnalyticsDemo = dynamic(() => import('@/components/AnalyticsDemo'))
const PricingSection = dynamic(() => import('@/components/ui/pricing-section'))
const LogoAssembly = dynamic(() => import('@/components/LogoAssembly'))
const AppComingSoon = dynamic(() => import('@/components/AppComingSoon'))

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Welcome />
      <BigOnPurpose />
      <OrbitalServices />
      <Stats />
      <TechMarquee />
      <Services />
      <BeforeAfter />
      <IdeaToImpact />
      <OurStory />
      <About />
      <CinematicScene />
      <Projects />
      <CaseStudies />
      <ClientLogos />
      <TransformationSplit />
      <Testimonials />
      <Presence />
      <VideoSection />
      <AnalyticsDemo />
      <Blog />
      <PricingSection />
      <AppComingSoon />
      <LogoAssembly />
      <Contact />
      <Footer />
    </main>
  )
}
