import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import About from '@/components/About'
import StackingCards from '@/components/StackingCards'
import Stats from '@/components/Stats'
import Projects from '@/components/Projects'
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
      <Services />
      <StackingCards />
      <About />
      <CinematicScene />
      <Projects />
      <VideoSection />
      <AnalyticsDemo />
      <Blog />
      <Contact />
      <Footer />
    </main>
  )
}
