"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { DottedSurface } from "@/components/ui/dotted-surface";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-violet-700 text-white hover:bg-violet-800 border border-violet-800",
        secondary:
          "bg-black/70 text-violet-300 border border-violet-600 hover:bg-violet-900/80 hover:text-white",
        outline:
          "border border-violet-600 bg-transparent text-violet-300 hover:bg-violet-900/60 hover:text-white",
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
    <div className="relative w-full min-h-screen font-sans overflow-hidden" style={{ background: '#050310' }}>
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
              onClick={() => scrollTo("#services")}
            >
              Abu Dhabi, UAE — Est. 2019 <MoveRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Headline */}
          <div className="flex gap-4 flex-col w-full">
            <h1 className="text-5xl md:text-7xl tracking-tight font-extrabold text-white drop-shadow-[0_2px_16px_rgba(124,58,237,0.5)]">
              <span className="text-violet-300 font-extrabold">WeThink is</span>
              <span className="relative flex w-full justify-center overflow-hidden md:pb-4 md:pt-1" style={{ minHeight: "1.2em" }}>
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-extrabold"
                    style={{
                      background: "linear-gradient(90deg,#A78BFA,#C026D3)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      filter: "drop-shadow(0 2px 16px rgba(167,139,250,0.5))",
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
            <p className="text-lg md:text-xl leading-relaxed text-violet-200/80 max-w-2xl mx-auto">
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
                className="px-4 py-1.5 rounded-full text-xs font-semibold border border-violet-500/30 bg-violet-950/50 backdrop-blur-sm text-violet-300"
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
        <span className="text-xs text-neutral-500 uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 border border-violet-400/40 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-violet-400" />
        </motion.div>
      </motion.div>
    </div>
  );
}

export { WeThinkHero };
