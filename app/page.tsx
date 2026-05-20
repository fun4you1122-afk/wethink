import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import About from '@/components/About'
import Stats from '@/components/Stats'
import TechMarquee from '@/components/TechMarquee'
import BeforeAfter from '@/components/BeforeAfter'
import IdeaToImpact from '@/components/IdeaToImpact'
import Projects from '@/components/Projects'
import Testimonials from '@/components/Testimonials'
import CinematicScene from '@/components/CinematicScene'
import VideoSection from '@/components/VideoSection'
import AnalyticsDemo from '@/components/AnalyticsDemo'
import Blog from '@/components/Blog'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Stats />
      <TechMarquee />
      <Services />
      <BeforeAfter />
      <IdeaToImpact />
      <About />
      <CinematicScene />
      <Projects />
      <Testimonials />
      <VideoSection />
      <AnalyticsDemo />
      <Blog />
      <Contact />
      <Footer />
    </main>
  )
}
