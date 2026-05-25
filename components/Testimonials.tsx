'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import ScrambleText from '@/components/ScrambleText'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'

const TESTIMONIALS = [
  {
    id: 'ahmed',
    quote: "WeThink transformed our entire IT infrastructure in under 6 months. The team's depth of knowledge and project discipline is unlike anything we've experienced before.",
    name: 'Ahmed Al Mansoori',
    role: 'CTO',
    company: 'Abu Dhabi National Energy',
    initials: 'AM',
    color: '#7C3AED',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1080&q=80',
  },
  {
    id: 'sarah',
    quote: "From zero to ISO 27001 certified in 9 months. Their cybersecurity team didn't just implement frameworks — they built a genuine security culture across our organisation.",
    name: 'Sarah Mitchell',
    role: 'Head of Information Security',
    company: 'Financial Services — Abu Dhabi',
    initials: 'SM',
    color: '#059669',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1080&q=80',
  },
  {
    id: 'khalid',
    quote: "Our smart campus platform went live on time, under budget, and our 18,000 daily users love it. WeThink treated our project like it was their own.",
    name: 'Dr. Khalid Al Rashidi',
    role: 'VP Operations',
    company: 'UAE University',
    initials: 'KR',
    color: '#0EA5E9',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1080&q=80',
  },
  {
    id: 'fatima',
    quote: "The cloud migration was seamless — zero downtime, 45% cost reduction, and a team that communicated clearly at every single step.",
    name: 'Fatima Al Zaabi',
    role: 'Director of Technology',
    company: 'Emirates Finance Group',
    initials: 'FZ',
    color: '#F59E0B',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1080&q=80',
  },
]

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!carouselApi) return
    const update = () => {
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
      setCurrentSlide(carouselApi.selectedScrollSnap())
    }
    update()
    carouselApi.on('select', update)
    return () => { carouselApi.off('select', update) }
  }, [carouselApi])

  return (
    <section className="py-24 overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <div className="mb-10 flex items-end justify-between md:mb-14">
          <div className="flex flex-col gap-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="section-label">Client Stories</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-black"
              style={{ color: 'var(--text)' }}
            >
              <ScrambleText>Trusted by </ScrambleText>
              <ScrambleText className="gradient-text">Leaders</ScrambleText>
            </motion.h2>
          </div>

          {/* Desktop arrows */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden shrink-0 gap-2 md:flex"
          >
            <Button
              size="icon"
              variant="ghost"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="h-11 w-11 rounded-full border border-violet-500/20 hover:bg-violet-500/10 disabled:opacity-30 text-violet-300 disabled:pointer-events-auto"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              className="h-11 w-11 rounded-full border border-violet-500/20 hover:bg-violet-500/10 disabled:opacity-30 text-violet-300 disabled:pointer-events-auto"
            >
              <ArrowRight className="size-5" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Full-bleed carousel */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              '(max-width: 768px)': { dragFree: true },
            },
          }}
        >
          <CarouselContent className="ml-0 2xl:ml-[max(8rem,calc(50vw-700px))] 2xl:mr-[max(0rem,calc(50vw-700px))] pl-6 md:pl-[max(1.5rem,calc(50vw-672px))]">
            {TESTIMONIALS.map((t) => (
              <CarouselItem
                key={t.id}
                className="max-w-[320px] pl-[20px] lg:max-w-[400px]"
              >
                <div className="group relative h-full min-h-[28rem] max-w-full overflow-hidden rounded-2xl md:aspect-[5/4] lg:aspect-[4/3]">
                  {/* Background image */}
                  <img
                    src={t.image}
                    alt={t.company}
                    className="absolute h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Dark gradient overlay — heavier than Gallery4 so text is legible */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 flex flex-col p-6 md:p-8">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 18 18">
                          <path
                            d="M9 1.5l2.08 4.22 4.66.68-3.37 3.28.8 4.64L9 12.02l-4.17 2.3.8-4.64L2.26 6.4l4.66-.68L9 1.5z"
                            fill={t.color}
                          />
                        </svg>
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-base font-medium leading-relaxed text-white/90 mb-5 line-clamp-4">
                      "{t.quote}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}99)` }}
                      >
                        {t.initials}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{t.name}</div>
                        <div className="text-xs text-white/60">{t.role} · {t.company}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dot indicators */}
        <div className="mt-8 flex justify-center gap-2">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => carouselApi?.scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? 'w-8 bg-violet-500'
                  : 'w-2 bg-violet-500/25'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
