'use client'

import { useEffect, useRef } from 'react'

/* ─── Lerp helper ─────────────────────────────────────────── */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/* ─── Easing curves ───────────────────────────────────────── */
const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
const easeIn    = (t: number) => t * t * t

/* ─── Scroll progress for a section ──────────────────────── */
function getProgress(section: HTMLElement) {
  const rect   = section.getBoundingClientRect()
  const total  = section.offsetHeight - window.innerHeight
  const scrolled = -rect.top
  return Math.max(0, Math.min(1, scrolled / total))
}

export default function CinematicScene() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !sectionRef.current) return

    let animId: number
    let disposed = false
    let cancelled = false

    async function setup() {
      const THREE = await import('three')
      // Component unmounted while three.js was loading — skip scene creation
      if (cancelled) return undefined

      const canvas  = canvasRef.current!
      const section = sectionRef.current!

      /* ── Renderer ───────────────────────────────────────── */
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.1

      /* ── Scene ──────────────────────────────────────────── */
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x05000f)
      scene.fog = new (THREE.FogExp2 as any)(0x05000f, 0.024)

      /* ── Camera ─────────────────────────────────────────── */
      const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 300)
      camera.position.set(0, 0, 30)

      /* ── Lights ─────────────────────────────────────────── */
      const ambient = new THREE.AmbientLight(0x2e0057, 2)
      scene.add(ambient)

      const coreLight = new THREE.PointLight(0xb36bff, 20, 50)
      coreLight.position.set(0, 0, 0)
      scene.add(coreLight)

      const rimLight = new THREE.PointLight(0x7c3aed, 8, 35)
      rimLight.position.set(8, 4, 6)
      scene.add(rimLight)

      const fillLight = new THREE.PointLight(0xc026d3, 4, 20)
      fillLight.position.set(-6, -3, 4)
      scene.add(fillLight)

      /* ── Particle layer — far field ──────────────────────── */
      const mobile = window.innerWidth < 768
      const farCount = mobile ? 900 : 2500
      const farPos = new Float32Array(farCount * 3)
      for (let i = 0; i < farCount; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi   = Math.acos(2 * Math.random() - 1)
        const r     = 14 + Math.random() * 28
        farPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
        farPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55
        farPos[i * 3 + 2] = r * Math.cos(phi)
      }
      const farGeo = new THREE.BufferGeometry()
      farGeo.setAttribute('position', new THREE.BufferAttribute(farPos, 3))
      const farMat = new THREE.PointsMaterial({
        color: 0x7c3aed, size: 0.07, transparent: true,
        opacity: 0.45, sizeAttenuation: true,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
      const farParticles = new THREE.Points(farGeo, farMat)
      scene.add(farParticles)

      /* ── Particle layer — mid field ─────────────────────── */
      const midCount = mobile ? 450 : 1200
      const midPos = new Float32Array(midCount * 3)
      for (let i = 0; i < midCount; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi   = Math.acos(2 * Math.random() - 1)
        const r     = 3 + Math.random() * 11
        midPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
        midPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
        midPos[i * 3 + 2] = r * Math.cos(phi)
      }
      const midGeo = new THREE.BufferGeometry()
      midGeo.setAttribute('position', new THREE.BufferAttribute(midPos, 3))
      const midMat = new THREE.PointsMaterial({
        color: 0xd8b4fe, size: 0.045, transparent: true,
        opacity: 0.7, sizeAttenuation: true,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
      const midParticles = new THREE.Points(midGeo, midMat)
      scene.add(midParticles)

      /* ── Near sparkle layer ─────────────────────────────── */
      const nearCount = mobile ? 150 : 400
      const nearPos = new Float32Array(nearCount * 3)
      for (let i = 0; i < nearCount; i++) {
        nearPos[i * 3]     = (Math.random() - 0.5) * 8
        nearPos[i * 3 + 1] = (Math.random() - 0.5) * 8
        nearPos[i * 3 + 2] = (Math.random() - 0.5) * 8
      }
      const nearGeo = new THREE.BufferGeometry()
      nearGeo.setAttribute('position', new THREE.BufferAttribute(nearPos, 3))
      const nearMat = new THREE.PointsMaterial({
        color: 0xfde68a, size: 0.035, transparent: true,
        opacity: 0.5, sizeAttenuation: true,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
      const nearParticles = new THREE.Points(nearGeo, nearMat)
      scene.add(nearParticles)

      /* ── Core sphere ────────────────────────────────────── */
      const coreGeo = new THREE.SphereGeometry(0.9, 64, 64)
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x7c3aed,
        emissive: 0x4c1d95,
        emissiveIntensity: 3,
        roughness: 0.1,
        metalness: 0.95,
      })
      const core = new THREE.Mesh(coreGeo, coreMat)
      scene.add(core)

      /* ── Inner core glow ────────────────────────────────── */
      const glowGeo = new THREE.SphereGeometry(1.2, 32, 32)
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0xa855f7, transparent: true, opacity: 0.12,
        side: THREE.BackSide,
      })
      const glow = new THREE.Mesh(glowGeo, glowMat)
      scene.add(glow)

      /* ── Orbit rings ────────────────────────────────────── */
      const makeRing = (r: number, tube: number, tiltX: number, tiltZ: number) => {
        const geo = new THREE.TorusGeometry(r, tube, 16, 140)
        const mat = new THREE.MeshStandardMaterial({
          color: 0xa78bfa, emissive: 0x7c3aed,
          emissiveIntensity: 2, roughness: 0.08, metalness: 1,
        })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.rotation.x = tiltX
        mesh.rotation.z = tiltZ
        scene.add(mesh)
        return mesh
      }
      const ring1 = makeRing(1.9, 0.04, Math.PI / 2.4, 0)
      const ring2 = makeRing(2.7, 0.025, Math.PI / 3.5, Math.PI / 5)
      const ring3 = makeRing(3.5, 0.015, Math.PI / 6, -Math.PI / 7)

      /* ── Live state (lerped each frame) ─────────────────── */
      const live = {
        camZ: 30, camX: 0, camY: 0,
        camRotY: 0, camRotX: 0,
        coreScale: 0.35,
        glowOpacity: 0.12,
        fogDensity: 0.024,
        coreLightI: 20,
        rimLightX: 8,
        rimLightZ: 6,
      }

      /* ── Clock ──────────────────────────────────────────── */
      let elapsed = 0
      let last = performance.now()

      /* ── Render loop ────────────────────────────────────── */
      const tick = () => {
        if (disposed) return
        animId = requestAnimationFrame(tick)

        const now = performance.now()
        const dt  = Math.min((now - last) / 1000, 0.05)
        last = now
        elapsed += dt

        const p = getProgress(section)     // 0 → 1 over 300vh

        /* Phase targets — camera zoom / composition */
        // p 0.00→0.33: wide approach
        // p 0.33→0.66: accelerate, tilt
        // p 0.66→1.00: final push through core

        const speed = 0.055
        const camZTarget =
          p < 0.33 ? mapRange(p, 0, 0.33, 30, 13) :
          p < 0.66 ? mapRange(p, 0.33, 0.66, 13, 5.5) :
                     mapRange(p, 0.66, 1, 5.5, 1.2)

        const camXTarget = p < 0.5
          ? mapRange(easeInOut(p / 0.5), 0, 1, 0, 1.8)
          : mapRange(easeInOut((p - 0.5) / 0.5), 0, 1, 1.8, 0)

        const camYTarget = p < 0.5
          ? mapRange(easeInOut(p / 0.5), 0, 1, 0, 0.6)
          : mapRange(easeInOut((p - 0.5) / 0.5), 0, 1, 0.6, 0)

        const camRotYTarget = mapRange(p, 0, 1, 0, 0.85)
        const camRotXTarget = p < 0.5
          ? mapRange(p, 0.2, 0.5, 0, -0.07)
          : mapRange(p, 0.5, 0.8, -0.07, 0)

        const coreScaleTarget = mapRange(easeIn(p), 0, 1, 0.35, 4.5)
        const fogTarget       = mapRange(p, 0, 0.85, 0.024, 0.003)
        const coreLightTarget = mapRange(p, 0, 1, 20, 80)

        /* Lerp live state */
        live.camZ        = lerp(live.camZ, camZTarget, speed)
        live.camX        = lerp(live.camX, camXTarget, speed)
        live.camY        = lerp(live.camY, camYTarget, speed)
        live.camRotY     = lerp(live.camRotY, camRotYTarget, speed)
        live.camRotX     = lerp(live.camRotX, camRotXTarget, speed)
        live.coreScale   = lerp(live.coreScale, coreScaleTarget, speed * 0.8)
        live.fogDensity  = lerp(live.fogDensity, fogTarget, speed)
        live.coreLightI  = lerp(live.coreLightI, coreLightTarget, speed)

        /* Apply to Three.js */
        camera.position.set(live.camX, live.camY, live.camZ)
        camera.rotation.y = live.camRotY
        camera.rotation.x = live.camRotX

        core.scale.setScalar(live.coreScale)
        glow.scale.setScalar(live.coreScale)
        coreMat.emissiveIntensity = 3 + p * 10 + Math.sin(elapsed * 2.5) * 0.7
        glowMat.opacity = Math.min(0.35, 0.12 + p * 0.3)

        coreLight.intensity = live.coreLightI + Math.sin(elapsed * 3) * 3
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (scene.fog) (scene.fog as any).density = live.fogDensity

        /* Continuous rotation */
        farParticles.rotation.y  =  elapsed * 0.013
        farParticles.rotation.x  =  elapsed * 0.004
        midParticles.rotation.y  = -elapsed * 0.019
        midParticles.rotation.x  =  elapsed * 0.007
        nearParticles.rotation.y =  elapsed * 0.028

        ring1.rotation.x = Math.PI / 2.4 + elapsed * 0.14
        ring1.rotation.z = elapsed * 0.06
        ring2.rotation.x = Math.PI / 3.5 + elapsed * 0.09
        ring2.rotation.y = elapsed * 0.07
        ring3.rotation.z = -Math.PI / 7 + elapsed * 0.05
        ring3.rotation.x = Math.PI / 6 - elapsed * 0.04

        /* Moving rim lights */
        rimLight.position.set(
          Math.sin(elapsed * 0.4) * 9,
          Math.cos(elapsed * 0.3) * 4,
          Math.cos(elapsed * 0.4) * 7,
        )
        fillLight.position.set(
          Math.cos(elapsed * 0.35) * -7,
          Math.sin(elapsed * 0.25) * -3,
          Math.sin(elapsed * 0.35) * 5,
        )

        /* Text opacity — driven by scroll progress */
        updateText(p)

        renderer.render(scene, camera)
      }
      tick()

      /* ── Resize ─────────────────────────────────────────── */
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener('resize', onResize)

      /* ── Cleanup ────────────────────────────────────────── */
      return () => {
        disposed = true
        cancelAnimationFrame(animId)
        window.removeEventListener('resize', onResize)
        renderer.dispose()
        ;[farGeo, midGeo, nearGeo, coreGeo, glowGeo].forEach(g => g.dispose())
      }
    }

    let cleanupFn: (() => void) | undefined
    setup().then(fn => {
      cleanupFn = fn
      // Effect already tore down while setup was in flight — dispose immediately
      if (cancelled) cleanupFn?.()
    })
    return () => {
      cancelled = true
      cleanupFn?.()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ height: '300vh' }}
      className="relative"
      aria-label="Think. Plan. Grow."
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* ── Word overlays ──────────────────────────────── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">

          {/* THINK */}
          <div id="ct-think" className="absolute text-center" style={{ opacity: 0, transform: 'translateY(40px)' }}>
            <p className="text-violet-400/70 text-[10px] md:text-xs uppercase tracking-[0.4em] mb-5">
              The WeThink Philosophy
            </p>
            <h2 className="font-black text-white leading-none tracking-tighter"
              style={{ fontSize: 'clamp(72px, 14vw, 160px)' }}>
              Think.
            </h2>
            <p className="text-white/40 text-sm md:text-base mt-5 max-w-xs mx-auto">
              Every project starts with the right questions.
            </p>
          </div>

          {/* PLAN */}
          <div id="ct-plan" className="absolute text-center" style={{ opacity: 0, transform: 'translateY(40px)' }}>
            <p className="text-violet-400/70 text-[10px] md:text-xs uppercase tracking-[0.4em] mb-5">
              Strategy before execution
            </p>
            <h2 className="font-black text-white leading-none tracking-tighter"
              style={{ fontSize: 'clamp(72px, 14vw, 160px)' }}>
              Plan.
            </h2>
            <p className="text-white/40 text-sm md:text-base mt-5 max-w-xs mx-auto">
              Precision-engineered roadmaps. No guesswork.
            </p>
          </div>

          {/* GROW */}
          <div id="ct-grow" className="absolute text-center" style={{ opacity: 0, transform: 'translateY(40px)' }}>
            <p className="text-violet-400/70 text-[10px] md:text-xs uppercase tracking-[0.4em] mb-5">
              Measurable, lasting impact
            </p>
            <h2
              className="font-black leading-none tracking-tighter"
              style={{
                fontSize: 'clamp(72px, 14vw, 160px)',
                background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 40%, #C026D3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Grow.
            </h2>
            <p className="text-white/40 text-sm md:text-base mt-5 max-w-xs mx-auto">
              Outcomes that outlast the engagement.
            </p>
          </div>
        </div>

        {/* Scroll hint — fades out as user scrolls */}
        <div id="ct-scroll-hint"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none">
          <span className="text-white/30 text-[9px] uppercase tracking-[0.35em]">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
        </div>

        {/* Vignette for depth */}
        <div className="absolute inset-0 pointer-events-none z-[5]"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,0,15,0.6) 100%)' }} />
      </div>
    </section>
  )
}

/* ─── Text animation driven by scroll progress ─────────────── */
function updateText(p: number) {
  const set = (id: string, opacity: number, y: number) => {
    const el = document.getElementById(id)
    if (!el) return
    el.style.opacity    = String(Math.max(0, Math.min(1, opacity)))
    el.style.transform  = `translateY(${y}px)`
    el.style.transition = 'opacity 0.05s linear, transform 0.05s linear'
  }

  // THINK:  visible 0.00 → 0.28
  const thinkIn  = mapRange(p, 0.01, 0.10, 0, 1)
  const thinkOut = mapRange(p, 0.22, 0.30, 1, 0)
  const thinkO   = p < 0.22 ? thinkIn : thinkOut
  const thinkY   = p < 0.10 ? mapRange(p, 0.01, 0.10, 40, 0) : p > 0.22 ? mapRange(p, 0.22, 0.30, 0, -30) : 0
  set('ct-think', thinkO, thinkY)

  // PLAN:   visible 0.33 → 0.60
  const planIn  = mapRange(p, 0.34, 0.42, 0, 1)
  const planOut = mapRange(p, 0.54, 0.62, 1, 0)
  const planO   = p < 0.54 ? planIn : planOut
  const planY   = p < 0.42 ? mapRange(p, 0.34, 0.42, 40, 0) : p > 0.54 ? mapRange(p, 0.54, 0.62, 0, -30) : 0
  set('ct-plan', planO, planY)

  // GROW:   visible 0.68 → 1.00
  const growIn = mapRange(p, 0.69, 0.78, 0, 1)
  const growO  = Math.min(growIn, 1)
  const growY  = p < 0.78 ? mapRange(p, 0.69, 0.78, 40, 0) : 0
  set('ct-grow', growO, growY)

  // Scroll hint fades out after first 10%
  const hint = document.getElementById('ct-scroll-hint')
  if (hint) hint.style.opacity = String(mapRange(p, 0.05, 0.15, 1, 0))
}

function mapRange(v: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const t = Math.max(0, Math.min(1, (v - inMin) / (inMax - inMin)))
  return outMin + t * (outMax - outMin)
}
