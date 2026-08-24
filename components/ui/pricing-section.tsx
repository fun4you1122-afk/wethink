"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Essentials",
    description: "For small UAE businesses that need reliable IT support and a clear technology roadmap.",
    price: 1499,
    yearlyPrice: 14990,
    buttonText: "Get Started",
    popular: false,
    includes: [
      "What's included:",
      "IT Helpdesk Support (8×5)",
      "Network & Device Monitoring",
      "Annual Cybersecurity Health Check",
      "Cloud Readiness Assessment",
      "Monthly Reports & Advisory Call",
      "Up to 15 Users",
    ],
  },
  {
    name: "Growth",
    description: "Managed IT + cloud for scaling teams that want a hands-on technology partner.",
    price: 4499,
    yearlyPrice: 44990,
    buttonText: "Get Started",
    popular: true,
    includes: [
      "Everything in Essentials, plus:",
      "24×7 Monitoring & Response",
      "Cloud Architecture & Cost Optimisation",
      "Security Hardening & Awareness Training",
      "Quarterly Strategy Workshops",
      "Dedicated Account Manager",
      "Up to 60 Users",
    ],
  },
  {
    name: "Enterprise",
    description: "Tailored transformation programmes for large organisations — scoped and priced per engagement.",
    price: null,
    yearlyPrice: null,
    buttonText: "Request a Quote",
    popular: false,
    includes: [
      "Everything in Growth, plus:",
      "End-to-End Digital Transformation",
      "Custom Software & AI Solutions",
      "ISO 27001 / NESA Compliance Programmes",
      "Multi-Site & Hybrid Infrastructure",
      "Dedicated Engineering Team",
      "Custom SLAs & User Count",
    ],
  },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");
  const handleSwitch = (value: string) => { setSelected(value); onSwitch(value); };

  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-white border border-violet-500/30 p-1 shadow-sm">
        {["Monthly", "Yearly"].map((label, i) => {
          const val = String(i);
          const active = selected === val;
          return (
            <button
              key={label}
              onClick={() => handleSwitch(val)}
              className={cn(
                "relative z-10 h-10 rounded-full px-6 py-2 text-sm font-semibold transition-colors",
                active ? "text-white" : "text-slate-500"
              )}
            >
              {active && (
                <motion.span
                  layoutId="pricing-switch"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 shadow-md shadow-violet-900/20"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                {label}
                {i === 1 && <span className="text-[10px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">2 months free</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const fadeUp = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.12, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const goToContact = () => {
  const el = document.querySelector('#contact')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.location.assign('/#contact')
  }
}

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const togglePricing = (v: string) => setIsYearly(Number(v) === 1);

  return (
    <section className="relative overflow-hidden py-24" style={{ background: 'var(--bg)' }}>
      {/* Soft brand glows */}
      <div
        className="pointer-events-none absolute left-[10%] right-[10%] top-[-10%] w-[80%] h-[80%]"
        style={{
          background: "radial-gradient(circle at center, rgba(20,184,166,0.14) 0%, transparent 65%)",
        }}
      />
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-700 text-xs font-semibold uppercase tracking-widest"
          >
            Transparent Pricing · AED
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--text)' }}>
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.12}
              staggerFrom="first"
              containerClassName="justify-center"
              transition={{ type: "spring", stiffness: 250, damping: 40 }}
            >
              Plans built for UAE businesses
            </VerticalCutReveal>
          </h2>

          <motion.p
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="max-w-xl mx-auto"
            style={{ color: 'var(--text-muted)' }}
          >
            Monthly retainers with no hidden fees — cancel anytime.
            Most engagements are also available as fixed-scope projects.
          </motion.p>

          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <PricingSwitch onSwitch={togglePricing} />
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              custom={i + 2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp}
            >
              <Card
                className={cn(
                  "relative h-full overflow-hidden bg-white",
                  plan.popular
                    ? "border-2 border-violet-500/50 shadow-[0px_16px_60px_rgba(20,184,166,0.18)]"
                    : "border border-slate-200 shadow-sm"
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-400 via-violet-500 to-violet-600" />
                )}
                {plan.popular && (
                  <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-violet-500 to-violet-600 text-white px-2.5 py-1 rounded-full">
                    Most Popular
                  </div>
                )}

                <CardHeader className="text-left pb-4">
                  <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    {plan.price === null ? (
                      <span className="text-4xl font-black" style={{ color: 'var(--text)' }}>Custom</span>
                    ) : (
                      <>
                        <span className="text-sm font-semibold text-violet-700">AED</span>
                        <NumberFlow
                          value={isYearly ? plan.yearlyPrice! : plan.price}
                          className="text-4xl font-black"
                          style={{ color: 'var(--text)' }}
                          format={{ useGrouping: true }}
                        />
                        <span className="text-sm ml-1" style={{ color: 'var(--text-muted)' }}>
                          /{isYearly ? "year" : "month"}
                        </span>
                      </>
                    )}
                  </div>
                  {isYearly && plan.price !== null && (
                    <p className="text-xs text-emerald-600 mt-1">
                      Save AED {(plan.price * 12 - plan.yearlyPrice!).toLocaleString()} vs monthly
                    </p>
                  )}
                  <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{plan.description}</p>
                </CardHeader>

                <CardContent className="pt-0">
                  <button
                    onClick={goToContact}
                    className={cn(
                      "w-full mb-6 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200",
                      plan.popular
                        ? "bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-md shadow-violet-900/20 hover:opacity-90"
                        : "bg-white border border-slate-300 hover:border-violet-500/60 hover:bg-violet-50/50"
                    )}
                    style={plan.popular ? undefined : { color: 'var(--text)' }}
                  >
                    {plan.buttonText}
                  </button>

                  <div className="border-t border-slate-200 pt-5 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
                      {plan.includes[0]}
                    </p>
                    <ul className="space-y-2.5">
                      {plan.includes.slice(1).map((feature, fi) => (
                        <li key={fi} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                          <Check size={14} className="mt-0.5 shrink-0 text-violet-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          custom={6}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center text-xs mt-10"
          style={{ color: 'var(--text-muted)' }}
        >
          All prices exclusive of VAT (5%). Custom enterprise contracts available — contact us for a tailored quote.
        </motion.p>
      </div>
    </section>
  );
}
