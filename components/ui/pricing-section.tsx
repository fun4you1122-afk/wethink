"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles } from "@/components/ui/sparkles";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "Perfect for small and mid-sized UAE businesses ready to modernise their IT infrastructure.",
    price: 2999,
    yearlyPrice: 29999,
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    popular: false,
    includes: [
      "What's included:",
      "IT Helpdesk Support (8×5)",
      "Network & Server Monitoring",
      "Basic Cybersecurity Audit",
      "Cloud Migration Assessment",
      "Monthly Health Reports",
      "Up to 25 Users",
    ],
  },
  {
    name: "Growth",
    description: "Comprehensive managed IT + cloud for scaling organisations that need strategic partnership.",
    price: 7999,
    yearlyPrice: 79999,
    buttonText: "Get Started",
    buttonVariant: "default" as const,
    popular: true,
    includes: [
      "Everything in Starter, plus:",
      "24×7 NOC & SOC Monitoring",
      "Cloud Architecture & Management",
      "ISO 27001 Compliance Support",
      "Custom Software Development",
      "Dedicated Project Manager",
      "Up to 100 Users",
    ],
  },
  {
    name: "Enterprise",
    description: "Full-scale digital transformation and security for large enterprises and government entities.",
    price: 18999,
    yearlyPrice: 189999,
    buttonText: "Contact Us",
    buttonVariant: "outline" as const,
    popular: false,
    includes: [
      "Everything in Growth, plus:",
      "End-to-End Digital Transformation",
      "AI & Data Analytics Platform",
      "Multi-Site Infrastructure",
      "NESA & UAE Gov Compliance",
      "Dedicated Engineering Team",
      "Unlimited Users",
    ],
  },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");
  const handleSwitch = (value: string) => { setSelected(value); onSwitch(value); };

  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-white/10 border border-violet-500/30 p-1 backdrop-blur-sm">
        {["Monthly", "Yearly"].map((label, i) => {
          const val = String(i);
          const active = selected === val;
          return (
            <button
              key={label}
              onClick={() => handleSwitch(val)}
              className={cn(
                "relative z-10 h-10 rounded-full px-6 py-2 text-sm font-semibold transition-colors",
                active ? "text-white" : "text-violet-300"
              )}
            >
              {active && (
                <motion.span
                  layoutId="pricing-switch"
                  className="absolute inset-0 rounded-full bg-gradient-to-t from-violet-600 to-violet-500 border border-violet-400 shadow-lg shadow-violet-900/50"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                {label}
                {i === 1 && <span className="text-[10px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">-17%</span>}
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

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const togglePricing = (v: string) => setIsYearly(Number(v) === 1);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0D0616] py-24">
      {/* Sparkle layer */}
      <Sparkles
        density={60}
        color="#9333EA"
        className="absolute inset-0 h-full w-full [mask-image:radial-gradient(60%_60%,white,transparent_85%)]"
      />

      {/* Violet glow blob */}
      <div
        className="pointer-events-none absolute left-[10%] right-[10%] top-[-10%] w-[80%] h-[80%]"
        style={{
          background: "radial-gradient(circle at center, #7C3AED 0%, transparent 65%)",
          opacity: 0.25,
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold uppercase tracking-widest"
          >
            Transparent Pricing · AED
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white">
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
            className="text-violet-200/70 max-w-xl mx-auto"
          >
            No hidden fees. All prices in AED. Cancel anytime.
            Enterprise contracts available with custom SLAs.
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
                  "relative h-full border text-white overflow-hidden",
                  plan.popular
                    ? "border-violet-500/60 bg-gradient-to-b from-violet-950/80 to-[#0D0616] shadow-[0px_-8px_200px_0px_rgba(124,58,237,0.35)]"
                    : "border-white/10 bg-gradient-to-b from-white/5 to-transparent"
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                )}
                {plan.popular && (
                  <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest bg-violet-500 text-white px-2.5 py-1 rounded-full">
                    Most Popular
                  </div>
                )}

                <CardHeader className="text-left pb-4">
                  <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-sm font-semibold text-violet-300">AED</span>
                    <NumberFlow
                      value={isYearly ? plan.yearlyPrice : plan.price}
                      className="text-4xl font-black text-white"
                      format={{ useGrouping: true }}
                    />
                    <span className="text-violet-300/70 text-sm ml-1">
                      /{isYearly ? "year" : "month"}
                    </span>
                  </div>
                  {isYearly && (
                    <p className="text-xs text-emerald-400 mt-1">
                      Save AED {(plan.price * 12 - plan.yearlyPrice).toLocaleString()} vs monthly
                    </p>
                  )}
                  <p className="text-sm text-violet-200/60 mt-3 leading-relaxed">{plan.description}</p>
                </CardHeader>

                <CardContent className="pt-0">
                  <button
                    className={cn(
                      "w-full mb-6 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200",
                      plan.popular
                        ? "bg-gradient-to-b from-violet-500 to-violet-700 text-white border border-violet-400 shadow-lg shadow-violet-900/50 hover:from-violet-400 hover:to-violet-600"
                        : "bg-white/5 border border-white/15 text-white hover:bg-white/10"
                    )}
                  >
                    {plan.buttonText}
                  </button>

                  <div className="border-t border-white/10 pt-5 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-300/70">
                      {plan.includes[0]}
                    </p>
                    <ul className="space-y-2.5">
                      {plan.includes.slice(1).map((feature, fi) => (
                        <li key={fi} className="flex items-start gap-2.5 text-sm text-violet-100/80">
                          <Check size={14} className="mt-0.5 shrink-0 text-violet-400" />
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
          className="text-center text-xs text-violet-300/40 mt-10"
        >
          All prices exclusive of VAT (5%). Custom enterprise contracts available — contact us for a tailored quote.
        </motion.p>
      </div>
    </section>
  );
}
