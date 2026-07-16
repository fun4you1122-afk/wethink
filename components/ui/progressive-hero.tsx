"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import dynamic from "next/dynamic";

// three.js is heavy — load the animated background after hydration so it
// stays out of the critical bundle. The hero renders fine without it.
const DottedSurface = dynamic(
  () => import("@/components/ui/dotted-surface").then((m) => m.DottedSurface),
  { ssr: false }
);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-violet-600 text-white hover:bg-violet-700 border border-violet-700",
        secondary:
          "bg-white/80 text-teal-700 border border-teal-500/40 hover:bg-teal-50 hover:text-teal-800",
        outline:
          "border border-violet-500/50 bg-transparent text-violet-700 hover:bg-violet-50 hover:text-violet-800",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-md px-4 text-sm",
        lg: "h-12 rounded-md px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

function WeThinkHero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Innovative", "Strategic", "Impactful"],
    []
  );

  useEffect(() => {
    const id = setTimeout(() => {
      setTitleNumber((n) => (n === titles.length - 1 ? 0 : n + 1));
    }, 2200);
    return () => clearTimeout(id);
  }, [titleNumber, titles]);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const openEmail = () => {
    window.location.href = "mailto:info@wethink.ae";
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/971503125078", "_blank");
  };

  return (
    <div id="home" className="relative w-full min-h-screen font-sans overflow-hidden" style={{ background: 'linear-gradient(180deg, #F0FAF8 0%, #F6FAF9 60%, #F1F0FB 100%)' }}>
      {/* Dotted surface background */}
      <DottedSurface className="z-0" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full min-h-screen px-6">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col w-full max-w-3xl mx-auto text-center">

          {/* Top badge */}
          <div>
            <Button
              variant="secondary"
              size="sm"
              className="gap-3 shadow-md shadow-violet-900/40"
              onClick={() => window.location.assign("/services")}
            >
              Abu Dhabi, UAE — Est. 2019 <MoveRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Headline */}
          <div className="flex gap-4 flex-col w-full">
            <h1 className="text-5xl md:text-7xl tracking-tight font-extrabold drop-shadow-[0_2px_16px_rgba(20,184,166,0.15)]" style={{ color: "var(--text)" }}>
              <span className="font-extrabold" style={{ color: "var(--text)" }}>WeThink is</span>
              <span className="relative flex w-full justify-center overflow-hidden md:pb-4 md:pt-1" style={{ minHeight: "1.2em" }}>
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-extrabold"
                    style={{
                      background: "linear-gradient(90deg,#14B8A6,#7C3AED)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      filter: "drop-shadow(0 2px 16px rgba(20,184,166,0.25))",
                    }}
                    initial={{ opacity: 0, y: 150 }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
              End-to-end IT consulting, cloud strategy, cybersecurity, and custom software —
              helping UAE enterprises compete and thrive in the digital age.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-row flex-wrap gap-3 justify-center">
            <Button
              size="lg"
              variant="default"
              className="gap-3 shadow-md shadow-violet-900/50"
              onClick={openEmail}
            >
              Start a Project <MoveRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-3 shadow-md shadow-violet-900/40"
              onClick={openWhatsApp}
            >
              Book a Call <PhoneCall className="w-4 h-4" />
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {["ISO 27001 Ready", "AWS Partner", "Microsoft Azure", "UAE Gov Compliant"].map((badge) => (
              <span
                key={badge}
                className="px-4 py-1.5 rounded-full text-xs font-semibold border border-teal-500/30 bg-white/70 backdrop-blur-sm text-teal-800"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-2 z-20"
      >
        <span className="text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 border border-teal-600/40 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-teal-500" />
        </motion.div>
      </motion.div>
    </div>
  );
}

export { WeThinkHero };
