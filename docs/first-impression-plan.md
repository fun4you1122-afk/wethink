# WeThink — First-Impression Plan ("the first 3–5 seconds")

Goal: the moment wethink.ae opens should itself prove the pitch — *"if they can build this, they can build mine."* This plan is the synthesis of a five-lens ideation pass (brand theater, interaction craft, intelligent personalization, UAE signature, conversion/trust), grounded in the current codebase (Next.js 14, Tailwind, framer-motion, GSAP, three.js, Lenis; 156 kB first-load budget; reduced-motion already respected).

---

## The Signature Move: "The Thinking Field"

**Pitch.** The dotted sine-wave field is already the site's most ownable visual — but today it's wallpaper. Turn it into the brand's living signature: a field of dots that *thinks*. The entrance becomes a 1.5-second choreography — the page paints instantly as a calm, flat, static field (fast first paint, nothing blocking); then a single pulse blooms outward from behind the wordmark — a thought forming — and as the ripple passes, dots lift into the familiar sine wave and their color travels along the brand gradient, teal at the crest fading toward violet. In sync with the ripple front, the headline reveals with a vertical cut ("WeThink is" → rotating word). From that moment on, the field is *aware*: the cursor (or touch) displaces nearby dots with springy ripple physics, so within the visitor's first mouse movement the site responds to them personally.

One asset, three payoffs: cinematic entrance, interactive craft, and a metaphor that literally is the company name.

**Why it wins.** It's original (no template ships this), it's on-brand (uses the existing field and gradient, no new visual language), it's nearly free in weight (three.js is already loaded and already updates every dot per frame — the ripple and pointer influence are a few extra terms in the existing loop, zero new dependencies), and it degrades perfectly (reduced-motion → the current static frame; touch devices → tap ripples; slow networks → the hero is server-rendered text over a CSS gradient until the field hydrates, exactly as today).

**Implementation plan.**
1. `components/ui/dotted-surface.tsx`
   - Add an *intro envelope*: a `startTime`-based radial wave — `amplitude(ix,iy) = smoothstep(rippleFront - dist(ix,iy))` multiplying the existing sine terms, so dots near center rise first. ~15 lines in the existing `animate()` loop.
   - Add per-dot color update as the ripple passes: lerp the `color` buffer attribute from flat teal `(0.12, 0.55, 0.52)` toward a distance-based teal→violet ramp (`#14B8A6 → #7C3AED`). The color attribute already exists.
   - Add pointer influence: track pointer in NDC on `pointermove`/`pointerdown` (attach to `window`, container is `pointer-events-none`), unproject to field plane, add a damped radial displacement + spring-back term per frame. Skip entirely under reduced motion.
   - Expose an `onIntroProgress?` callback (or emit a CustomEvent) so the hero can sync text reveal to the ripple front.
2. `components/ui/progressive-hero.tsx`
   - Replace the plain mount of the headline with a staggered reveal using the existing `components/ui/vertical-cut-reveal.tsx`, triggered at ~40% of intro progress; badge, description, CTAs, and trust badges cascade in the following ~600 ms.
   - Under `prefers-reduced-motion`, everything renders immediately (current behavior).
3. `app/globals.css` — nothing structural; optional `--hero-glow` keyframe for a soft radial glow that accompanies the pulse (pure CSS, GPU-cheap).
4. Repeat visits: set `sessionStorage.wt_intro_seen`; when present, skip the pulse and start in the awake state so returning visitors never wait.

**Effort:** M–L (one focused day for field physics + half a day for choreography/QA). No bundle growth beyond ~2 kB of code.

---

## Ranked runner-ups (worth doing, in order)

1. **Bilingual mark: «نفكر» → WeThink** — lens: uae-signature — effort M
   One-time (per session) morph in the hero: the wordmark first appears as Arabic calligraphic «نفكر» ("we think"), holds a beat, then cross-dissolves/cut-reveals into "WeThink is …". Also add Arabic ghost-glyphs as occasional dots in the field's crest highlights. *Score reason:* the single highest ownability-per-effort idea — no Western template site has it, it's culturally fluent rather than decorative, and it stacks cleanly on the signature move. Needs a good Arabic display font subset (~15 kB WOFF2, `font-display: swap`).

2. **Gulf-light clock** — lens: smart-personal — effort S
   Tint the hero (CSS custom properties feeding the existing background gradient + dot base color) by Abu Dhabi time of day: pearl dawn, bright mint noon, warm violet dusk, deep calm night — plus a one-line greeting under the badge: "مساء الخير — Good evening from Abu Dhabi." Pure client-side `Intl` math, zero requests, instantly makes the visitor feel the site is *live* and *local*. Degrades to the current palette.

3. **Magnetic CTAs + field parting** — lens: interaction-craft — effort S
   The two hero buttons get magnetic hover (framer-motion springs, ~20 lines) and the field dots subtly part around the pointer (falls out of the signature move's pointer influence for free). First mouse movement = first delight. Skip on touch/reduced motion.

4. **Proof strip with live numbers** — lens: conversion-trust — effort S
   Replace the static trust badges with one quiet line that reads as *fact, not marketing*: "40+ UAE projects · Est. 2019, Abu Dhabi · replies within one business hour · this site: 156 kB, built by us." The last clause weaponizes the site-as-portfolio goal. Content-only change in `progressive-hero.tsx`.

5. **Returning-visitor warm start** — lens: smart-personal — effort S
   `localStorage` flag: returning visitors get "Welcome back" in place of the badge, no intro pulse, and the rotating headline starts on a different word than last visit. Feels attentive, costs nothing, no privacy concerns (no network, no fingerprinting).

6. **First-scroll handoff** — lens: brand-theater — effort M
   The first Lenis scroll doesn't just push the hero away: the three.js camera eases down ~10° so the field tilts toward the horizon while the headline's gradient visually "hands off" to the `Welcome` section title (shared layout gradient element via framer-motion `layoutId`). Makes scroll #1 feel authored, not default. Guard with reduced-motion.

7. **Console signature** — lens: conversion-trust / craft — effort S
   A styled `console.log` easter egg (ASCII wordmark in the brand gradient + "You read consoles. We like you already — jobs@wethink.ae") plus a `<!-- built in Abu Dhabi by WeThink -->` comment. Tiny, memorable to exactly the technical evaluators who influence vendor choice.

8. **Logo particle convergence (deluxe intro)** — lens: brand-theater — effort L
   Extend the intro: before the pulse, ~200 field dots briefly converge to trace the logo shape, then release into the wave (the repo's `LogoAssembly.tsx` is prior art). *Ranked last deliberately:* highest wow but also highest risk of feeling like a preloader and delaying content; only do it after the signature move ships, capped at ~1 s, session-gated, and always skippable by scroll.

**Rejected on principle:** full-screen preloaders, autoplaying video heroes, WebGL shader backgrounds that replace the field (fights the brand), sound, geolocation prompts, and anything that pushes first-load JS meaningfully past the current 156 kB.

---

### Suggested build order

Week 1: Signature Move + ideas 3, 4, 7 (the S-sized wins ride along). Week 2: ideas 1 and 2 (the bilingual + Gulf-light pair — together they *are* the UAE identity). Later: 5, 6, then evaluate 8.
