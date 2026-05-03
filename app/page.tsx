import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import About from '@/components/About'
import Stats from '@/components/Stats'
import Projects from '@/components/Projects'
import VideoSection from '@/components/VideoSection'
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
      <About />
      <Projects />
      <VideoSection />
      <Blog />
      <Contact />
      <Footer />
    </main>
  )
}
