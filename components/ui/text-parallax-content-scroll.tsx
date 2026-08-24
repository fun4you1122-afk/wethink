"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/**
 * A full-bleed image that sticks while the copy scrolls over it, then releases.
 *
 * Adapted from the supplied component. Two changes it needed here: the props
 * were untyped, which fails this project's strict TypeScript, and the icon came
 * from react-icons, which would have been a whole icon library for a single
 * arrow when lucide-react is already a dependency and draws the same glyph.
 */

const IMG_PADDING = 12;

type ParallaxProps = {
  imgUrl: string;
  subheading: string;
  heading: string;
  /** described for screen readers, since the image carries meaning here */
  alt?: string;
  children?: React.ReactNode;
};

export const TextParallaxContent = ({
  imgUrl,
  subheading,
  heading,
  alt,
  children,
}: ParallaxProps) => {
  return (
    <div style={{ paddingLeft: IMG_PADDING, paddingRight: IMG_PADDING }}>
      <div className="relative h-[150vh]">
        <StickyImage imgUrl={imgUrl} alt={alt} />
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
      {children}
    </div>
  );
};

const StickyImage = ({ imgUrl, alt }: { imgUrl: string; alt?: string }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      role={alt ? "img" : undefined}
      aria-label={alt}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <motion.div className="absolute inset-0 bg-neutral-950/70" style={{ opacity }} />
    </motion.div>
  );
};

const OverlayCopy = ({ subheading, heading }: { subheading: string; heading: string }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      style={{ y, opacity }}
      ref={targetRef}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center px-6 text-white"
    >
      <p className="mb-2 text-center text-lg md:mb-4 md:text-2xl">{subheading}</p>
      <p className="text-center text-[clamp(2rem,6vw,4.5rem)] font-bold leading-[1.05]">
        {heading}
      </p>
    </motion.div>
  );
};

export const ParallaxBody = ({
  title,
  body,
  href,
  cta = "Learn more",
}: {
  title: string;
  body: React.ReactNode;
  href?: string;
  cta?: string;
}) => (
  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
    <h2 className="col-span-1 text-3xl font-bold md:col-span-4"
      style={{ color: 'var(--text)' }}>{title}</h2>
    <div className="col-span-1 md:col-span-8">
      <div className="mb-8 space-y-4 text-lg leading-relaxed md:text-xl"
      style={{ color: 'var(--text-muted)' }}>
        {body}
      </div>
      {href && (
        <a
          href={href}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full px-9 py-4 text-lg text-white no-underline transition-opacity hover:opacity-90 md:w-fit"
          style={{ background: 'var(--primary)' }}
        >
          {cta} <ArrowUpRight className="inline h-5 w-5" />
        </a>
      )}
    </div>
  </div>
);
