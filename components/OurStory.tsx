'use client';

import FlowArt, { FlowSection } from '@/components/ui/story-scroll';

export default function OurStory() {
  return (
    <FlowArt aria-label="WeThink Story">

      {/* 01 — Who We Are */}
      <FlowSection
        aria-label="Who We Are"
        style={{ backgroundColor: '#7C3AED', color: '#fff' }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">01 — Who We Are</p>
        <hr className="my-[2vw] border-t border-white/30" />
        <div>
          <h2 className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight">
            Think
            <br />
            Plan
            <br />
            Grow
          </h2>
        </div>
        <hr className="my-[2vw] border-t border-white/30" />
        <p className="mt-auto max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed opacity-90">
          Founded in Abu Dhabi in 2019, WeThink is a full-spectrum IT consulting firm built for
          enterprises that refuse to stand still. We don't just advise — we execute, deliver, and stay
          accountable until you win.
        </p>
      </FlowSection>

      {/* 02 — What We Do */}
      <FlowSection
        aria-label="What We Do"
        style={{ backgroundColor: '#1A0A2E', color: '#fff' }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">02 — What We Do</p>
        <hr className="my-[2vw] border-t border-white/20" />
        <div>
          <h2 className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight">
            End
            <br />
            To
            <br />
            End
          </h2>
        </div>
        <hr className="my-[2vw] border-t border-white/20" />
        <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed opacity-90">
          From cloud architecture to custom software — we cover every dimension of your digital stack
          so you never have to stitch together a dozen vendors.
        </p>
        <hr className="my-[2vw] border-t border-white/20" />
        <div className="flex flex-wrap gap-[3vw]">
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-violet-300">Cloud & Infrastructure</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-70">
              Multi-cloud architecture, migration, and 24/7 managed operations on AWS, Azure, and GCP.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-violet-300">Cybersecurity</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-70">
              Zero-trust frameworks, SOC monitoring, penetration testing, and ISO 27001 compliance.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-violet-300">Custom Software</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-70">
              Bespoke web, mobile, and AI-powered platforms engineered for UAE market realities.
            </p>
          </div>
        </div>
        <hr className="my-[2vw] border-t border-white/20" />
        <div className="flex flex-wrap gap-[3vw]">
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-violet-300">Digital Transformation</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-70">
              End-to-end overhaul of operations, culture, and technology — aligned with UAE Vision 2031.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-violet-300">Strategic Consulting</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-70">
              C-suite advisory and technology roadmaps that align IT investment with business goals.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-violet-300">Data & Analytics</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-70">
              BI dashboards, data warehouses, and ML models that turn raw data into revenue.
            </p>
          </div>
        </div>
        <hr className="my-[2vw] border-t border-white/20" />
        <p className="mt-auto ml-auto max-w-[50ch] text-right text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed opacity-90">
          One partner. Every layer of your digital business covered.
        </p>
      </FlowSection>

      {/* 03 — How We Work */}
      <FlowSection
        aria-label="How We Work"
        style={{ backgroundColor: '#0D0620', color: '#F0EFFF' }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">03 — How We Work</p>
        <hr className="my-[2vw] border-t border-white/20" />
        <div>
          <h2 className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight">
            Your
            <br />
            Way.
            <br />
            Done
            <br />
            Right.
          </h2>
        </div>
        <hr className="my-[2vw] border-t border-black/20" />
        <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed opacity-80">
          We don't push templates. We start with your challenges, build a tailored roadmap, and deliver
          against it — with radical transparency at every step.
        </p>
        <hr className="my-[2vw] border-t border-black/20" />
        <div className="flex flex-wrap gap-[3vw]">
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-violet-700">01 — Discover</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-70">
              Deep-dive workshops with your team to map challenges, goals, and current-state technology.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-violet-700">02 — Design</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-70">
              Architecture blueprints, solution designs, and a phased delivery plan built for your budget.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-violet-700">03 — Deliver</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-70">
              Agile sprints, dedicated PMs, and weekly progress reports — on time, every time.
            </p>
          </div>
        </div>
        <hr className="my-[2vw] border-t border-black/20" />
        <div className="flex flex-wrap gap-[3vw]">
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-violet-700">04 — Deploy</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-70">
              Zero-downtime rollouts with full testing, security sign-off, and team training included.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-violet-700">05 — Optimise</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-70">
              Post-launch monitoring, performance tuning, and continuous improvement sprints.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-violet-700">06 — Scale</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-70">
              Your business grows. We grow with it. Flexible retainers and on-demand expert support.
            </p>
          </div>
        </div>
      </FlowSection>

      {/* 04 — Our Impact */}
      <FlowSection
        aria-label="Our Impact"
        style={{ backgroundColor: '#4F46E5', color: '#fff' }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">04 — Our Impact</p>
        <hr className="my-[2vw] border-t border-white/30" />
        <div>
          <h2 className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight">
            Real
            <br />
            Results
          </h2>
        </div>
        <hr className="my-[2vw] border-t border-white/30" />
        <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed opacity-90">
          Since 2019 — thousands of projects. One consistent outcome — businesses that outperform their
          competition because their technology finally works for them.
        </p>
        <hr className="my-[2vw] border-t border-white/30" />
        <div className="flex flex-wrap gap-[3vw]">
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">5,000+ Projects</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Delivered across government, finance, healthcare, education, and enterprise in the UAE and Gulf.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">99.98% Uptime</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Average infrastructure availability delivered to managed services clients over the past 3 years.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">70% Faster</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Average reduction in operational onboarding time after digital transformation engagement.
            </p>
          </div>
        </div>
        <hr className="my-[2vw] border-t border-white/30" />
        <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed opacity-90">
          The UAE's most ambitious organisations chose WeThink because mediocre IT is not an option when
          you're building for Vision 2031.
        </p>
        <hr className="my-[2vw] border-t border-white/30" />
        <div className="flex flex-wrap gap-[3vw]">
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">1,000+ Clients</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              From lean startups to multi-billion-dirham government entities — we scale to match you.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">100% On-Time</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Project delivery rate across our managed engagements. Deadlines are a commitment, not a target.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">45% Cost Reduction</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Average IT operational cost saving achieved through cloud optimisation and managed services.
            </p>
          </div>
        </div>
      </FlowSection>

      {/* 05 — Let's Build */}
      <FlowSection
        aria-label="Let's Build Together"
        style={{ backgroundColor: '#111827', color: '#fff' }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">05 — Let's Build</p>
        <hr className="my-[2vw] border-t border-white/20" />
        <div>
          <h2 className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight">
            Your
            <br />
            Move.
          </h2>
        </div>
        <hr className="my-[2vw] border-t border-white/20" />
        <p className="mt-auto max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed opacity-80">
          The gap between where your business is and where it could be is a technology decision away.
          Let's close it — starting with a free strategy session, no commitment required.
        </p>
        <hr className="my-[2vw] border-t border-white/20" />
        <div>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90"
            style={{ backgroundColor: '#7C3AED', color: '#fff' }}
          >
            Book a Free Strategy Session
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3.75 9h10.5M10.5 5.25L14.25 9l-3.75 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </FlowSection>

    </FlowArt>
  );
}
