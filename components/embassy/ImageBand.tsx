'use client'

import { motion } from 'framer-motion'

/**
 * Full-bleed photographic interlude — a slow Ken Burns drift across the temple
 * and river, breaking out of the invitation's 780px column.
 *
 * The source image carries its own baked-in title in the upper third, so the
 * frame is anchored low (objectPosition) to sit on the temple, water, and
 * jungle rather than the lettering.
 */

export default function ImageBand({
  src,
  alt,
  children,
}: {
  src: string
  alt: string
  children?: React.ReactNode
}) {
  return (
    <section className="relative left-1/2 my-14 w-screen -translate-x-1/2 overflow-hidden">
      <div className="relative h-[300px] sm:h-[380px]">
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: '50% 78%' }}
          initial={{ scale: 1.06 }}
          animate={{ scale: 1.16 }}
          transition={{ duration: 24, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
        />

        {/* soften the edges into the page, and lift the caption off the photo */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(242,250,251,0.92) 0%, rgba(12,58,66,0.18) 32%, rgba(12,58,66,0.42) 100%)',
          }}
        />

        {children && (
          <div className="absolute inset-0 flex flex-col items-center justify-end gap-1.5 px-6 pb-9 text-center">
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
