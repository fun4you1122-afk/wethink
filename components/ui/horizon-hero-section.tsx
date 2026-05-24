"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { gsap } from "gsap"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"

// ── WeThink content per scroll section ───────────────────────────────────────
const SECTIONS = [
  {
    title: "WETHINK",
    line1: "Abu Dhabi's Premier IT Consulting Partner",
    line2: "Think. Plan. Grow.",
  },
  {
    title: "ENGINEER",
    line1: "End-to-end IT solutions & cloud strategy",
    line2: "built for UAE enterprises",
  },
  {
    title: "DELIVER",
    line1: "5,000+ projects. 1,000+ clients.",
    line2: "Your digital future starts here.",
  },
]

const TOTAL_SECTIONS = 2 // scroll sections after the initial view

// ── TypeScript interfaces ─────────────────────────────────────────────────────
interface ThreeState {
  scene: THREE.Scene | null
  camera: THREE.PerspectiveCamera | null
  renderer: THREE.WebGLRenderer | null
  composer: EffectComposer | null
  stars: THREE.Points[]
  nebula: THREE.Mesh | null
  mountains: THREE.Mesh[]
  animationId: number | null
  targetX: number
  targetY: number
  targetZ: number
  locations: number[]
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function HorizonHero() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const titleRef      = useRef<HTMLHeadingElement>(null)
  const subtitleRef   = useRef<HTMLDivElement>(null)
  const progressRef   = useRef<HTMLDivElement>(null)
  const smoothPos     = useRef({ x: 0, y: 30, z: 100 })

  const [progress,       setProgress]       = useState(0)
  const [currentSection, setCurrentSection] = useState(0)
  const [isReady,        setIsReady]        = useState(false)

  const three = useRef<ThreeState>({
    scene: null, camera: null, renderer: null, composer: null,
    stars: [], nebula: null, mountains: [], animationId: null,
    targetX: 0, targetY: 30, targetZ: 100, locations: [],
  })

  // ── Three.js init ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current) return
    const r = three.current

    // Scene & fog
    r.scene = new THREE.Scene()
    const scene = r.scene
    scene.fog = new THREE.FogExp2(0x000000, 0.00025)

    // Camera
    r.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
    r.camera.position.set(0, 20, 100)

    // Renderer
    r.renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true })
    r.renderer.setSize(window.innerWidth, window.innerHeight)
    r.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    r.renderer.toneMapping = THREE.ACESFilmicToneMapping
    r.renderer.toneMappingExposure = 0.5

    // Bloom post-processing
    r.composer = new EffectComposer(r.renderer)
    r.composer.addPass(new RenderPass(r.scene, r.camera))
    r.composer.addPass(new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight), 0.8, 0.4, 0.85
    ))

    // ── Star field (3 layers) ─────────────────────────────────────────────────
    for (let layer = 0; layer < 3; layer++) {
      const count = 5000
      const positions = new Float32Array(count * 3)
      const colors    = new Float32Array(count * 3)
      const sizes     = new Float32Array(count)

      for (let j = 0; j < count; j++) {
        const radius = 200 + Math.random() * 800
        const theta  = Math.random() * Math.PI * 2
        const phi    = Math.acos(Math.random() * 2 - 1)
        positions[j*3]   = radius * Math.sin(phi) * Math.cos(theta)
        positions[j*3+1] = radius * Math.sin(phi) * Math.sin(theta)
        positions[j*3+2] = radius * Math.cos(phi)

        const c = new THREE.Color()
        const rnd = Math.random()
        if (rnd < 0.7)      c.setHSL(0,   0,   0.8 + Math.random() * 0.2)
        else if (rnd < 0.9) c.setHSL(0.08, 0.5, 0.8)
        else                c.setHSL(0.6,  0.5, 0.8)
        colors[j*3] = c.r; colors[j*3+1] = c.g; colors[j*3+2] = c.b

        sizes[j] = Math.random() * 2 + 0.5
      }

      const geo = new THREE.BufferGeometry()
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      geo.setAttribute("color",    new THREE.BufferAttribute(colors,    3))
      geo.setAttribute("size",     new THREE.BufferAttribute(sizes,     1))

      const mat = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 }, depth: { value: layer } },
        vertexShader: `
          attribute float size; attribute vec3 color; varying vec3 vColor;
          uniform float time; uniform float depth;
          void main() {
            vColor = color;
            vec3 pos = position;
            float angle = time * 0.05 * (1.0 - depth * 0.3);
            mat2 rot = mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
            pos.xy = rot * pos.xy;
            vec4 mv = modelViewMatrix * vec4(pos,1.0);
            gl_PointSize = size * (300.0 / -mv.z);
            gl_Position  = projectionMatrix * mv;
          }`,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            gl_FragColor = vec4(vColor, 1.0 - smoothstep(0.0,0.5,d));
          }`,
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
      })

      const stars = new THREE.Points(geo, mat)
      scene.add(stars)
      r.stars.push(stars)
    }

    // ── Nebula ────────────────────────────────────────────────────────────────
    const nebGeo = new THREE.PlaneGeometry(8000, 4000, 100, 100)
    const nebMat = new THREE.ShaderMaterial({
      uniforms: {
        time:    { value: 0 },
        color1:  { value: new THREE.Color(0x0033ff) },
        color2:  { value: new THREE.Color(0xff0066) },
        opacity: { value: 0.3 },
      },
      vertexShader: `
        varying vec2 vUv; varying float vElev; uniform float time;
        void main() {
          vUv = uv;
          vec3 pos = position;
          float elev = sin(pos.x*0.01+time)*cos(pos.y*0.01+time)*20.0;
          pos.z += elev; vElev = elev;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
        }`,
      fragmentShader: `
        uniform vec3 color1; uniform vec3 color2; uniform float opacity; uniform float time;
        varying vec2 vUv; varying float vElev;
        void main() {
          float m = sin(vUv.x*10.0+time)*cos(vUv.y*10.0+time);
          vec3 col = mix(color1,color2,m*0.5+0.5);
          float a = opacity*(1.0-length(vUv-0.5)*2.0)*(1.0+vElev*0.01);
          gl_FragColor = vec4(col,a);
        }`,
      transparent: true, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false,
    })
    r.nebula = new THREE.Mesh(nebGeo, nebMat)
    r.nebula.position.z = -1050
    scene.add(r.nebula)

    // ── Mountains (4 layers) ─────────────────────────────────────────────────
    const mLayers = [
      { distance: -50,  height: 60,  color: 0x1a1a2e, opacity: 1.0 },
      { distance: -100, height: 80,  color: 0x16213e, opacity: 0.8 },
      { distance: -150, height: 100, color: 0x0f3460, opacity: 0.6 },
      { distance: -200, height: 120, color: 0x0a4668, opacity: 0.4 },
    ]
    mLayers.forEach((layer, idx) => {
      const pts: THREE.Vector2[] = []
      for (let i = 0; i <= 50; i++) {
        const x = (i / 50 - 0.5) * 1000
        const y = Math.sin(i*0.1)*layer.height + Math.sin(i*0.05)*layer.height*0.5
               + Math.random()*layer.height*0.2 - 100
        pts.push(new THREE.Vector2(x, y))
      }
      pts.push(new THREE.Vector2(5000, -300))
      pts.push(new THREE.Vector2(-5000, -300))

      const shape = new THREE.Shape(pts)
      const geo   = new THREE.ShapeGeometry(shape)
      const mat   = new THREE.MeshBasicMaterial({
        color: layer.color, transparent: true, opacity: layer.opacity, side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.z = layer.distance
      mesh.position.y = layer.distance
      mesh.userData = { baseZ: layer.distance, index: idx }
      scene.add(mesh)
      r.mountains.push(mesh)
    })
    r.locations = r.mountains.map(m => m.position.z)

    // ── Atmosphere ────────────────────────────────────────────────────────────
    const atmGeo = new THREE.SphereGeometry(600, 32, 32)
    const atmMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `
        varying vec3 vN; varying vec3 vP;
        void main() { vN = normalize(normalMatrix*normal); vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `
        varying vec3 vN; uniform float time;
        void main() {
          float i = pow(0.7-dot(vN,vec3(0,0,1)),2.0);
          vec3 a = vec3(0.3,0.6,1.0)*i*(sin(time*2.0)*0.1+0.9);
          gl_FragColor = vec4(a,i*0.25);
        }`,
      side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true,
    })
    scene.add(new THREE.Mesh(atmGeo, atmMat))

    // ── Animation loop ────────────────────────────────────────────────────────
    const animate = () => {
      r.animationId = requestAnimationFrame(animate)
      const t = Date.now() * 0.001

      r.stars.forEach(s => {
        const m = s.material as THREE.ShaderMaterial
        if (m.uniforms) m.uniforms.time.value = t
      })
      if (r.nebula) {
        const m = r.nebula.material as THREE.ShaderMaterial
        if (m.uniforms) m.uniforms.time.value = t * 0.5
      }

      if (r.camera) {
        const k = 0.05
        smoothPos.current.x += (r.targetX - smoothPos.current.x) * k
        smoothPos.current.y += (r.targetY - smoothPos.current.y) * k
        smoothPos.current.z += (r.targetZ - smoothPos.current.z) * k

        r.camera.position.set(
          smoothPos.current.x + Math.sin(t*0.1)*2,
          smoothPos.current.y + Math.cos(t*0.15)*1,
          smoothPos.current.z,
        )
        r.camera.lookAt(0, 10, -600)
      }

      r.mountains.forEach((m, i) => {
        const f = 1 + i * 0.5
        m.position.x = Math.sin(t*0.1)*2*f
        m.position.y = 50 + Math.cos(t*0.15)*1*f
      })

      r.composer?.render()
    }
    animate()

    setIsReady(true)

    const onResize = () => {
      if (!r.camera || !r.renderer || !r.composer) return
      r.camera.aspect = window.innerWidth / window.innerHeight
      r.camera.updateProjectionMatrix()
      r.renderer.setSize(window.innerWidth, window.innerHeight)
      r.composer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", onResize)

    return () => {
      if (r.animationId) cancelAnimationFrame(r.animationId)
      window.removeEventListener("resize", onResize)
      r.stars.forEach(s => { s.geometry.dispose(); (s.material as THREE.Material).dispose() })
      r.mountains.forEach(m => { m.geometry.dispose(); (m.material as THREE.Material).dispose() })
      if (r.nebula) { r.nebula.geometry.dispose(); (r.nebula.material as THREE.Material).dispose() }
      r.renderer?.dispose()
    }
  }, [])

  // ── GSAP entrance animation ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return
    gsap.set([titleRef.current, subtitleRef.current, progressRef.current], { visibility: "visible" })

    const tl = gsap.timeline()
    if (titleRef.current) {
      tl.from(titleRef.current.querySelectorAll(".title-char"), {
        y: 200, opacity: 0, duration: 1.5, stagger: 0.05, ease: "power4.out",
      })
    }
    if (subtitleRef.current) {
      tl.from(subtitleRef.current.querySelectorAll(".subtitle-line"), {
        y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out",
      }, "-=0.8")
    }
    tl.from(progressRef.current, { opacity: 0, y: 50, duration: 1, ease: "power2.out" }, "-=0.5")

    return () => { tl.kill() }
  }, [isReady])

  // ── Scroll handler ──────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      // Hero scroll range = TOTAL_SECTIONS × 100vh
      const heroScrollRange = TOTAL_SECTIONS * window.innerHeight
      const prog = Math.min(Math.max(scrollY / heroScrollRange, 0), 1)
      setProgress(prog)

      const sec = Math.min(Math.floor(prog * (TOTAL_SECTIONS + 1)), TOTAL_SECTIONS)
      setCurrentSection(sec)

      const r = three.current
      const totalProg = prog * TOTAL_SECTIONS
      const secProg   = totalProg % 1
      const camIdx    = Math.floor(totalProg)

      const CAM = [
        { x: 0, y: 30, z:  300 },
        { x: 0, y: 40, z:  -50 },
        { x: 0, y: 50, z: -700 },
      ]
      const cur  = CAM[camIdx]   ?? CAM[0]
      const next = CAM[camIdx+1] ?? cur

      r.targetX = cur.x + (next.x - cur.x) * secProg
      r.targetY = cur.y + (next.y - cur.y) * secProg
      r.targetZ = cur.z + (next.z - cur.z) * secProg

      r.mountains.forEach((m, i) => {
        m.position.z = prog > 0.7 ? 600000 : r.locations[i]
      })
      if (r.nebula) {
        r.nebula.position.z = prog > 0.7 ? -1050 : r.locations[3] - 100
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const section = SECTIONS[Math.min(currentSection, SECTIONS.length - 1)]

  return (
    /* Outer: sets total scroll height */
    <div ref={containerRef} style={{ position: "relative", height: `${(TOTAL_SECTIONS + 1) * 100}vh` }}>

      {/* Sticky shell — stays at top while scrolling through the hero, then scrolls away naturally */}
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        {/* Three.js canvas */}
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />

        {/* Centred title + subtitle */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}>
          <h1
            ref={titleRef}
            style={{
              visibility: "hidden",
              fontSize: "clamp(2.5rem, 10vw, 9rem)",
              fontWeight: 900, color: "white",
              letterSpacing: "0.2em", textAlign: "center",
              lineHeight: 1, margin: 0,
            }}
          >
            {section.title.split("").map((char, i) => (
              <span key={`${currentSection}-${i}`} className="title-char" style={{ display: "inline-block" }}>
                {char}
              </span>
            ))}
          </h1>

          <div ref={subtitleRef} style={{ visibility: "hidden", marginTop: "1.5rem", textAlign: "center" }}>
            {[section.line1, section.line2].map((line, i) => (
              <p key={i} className="subtitle-line" style={{
                fontSize: "clamp(0.8rem, 2vw, 1.1rem)",
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.06em", margin: 0, lineHeight: 1.7,
              }}>
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Scroll progress — bottom-centre inside sticky shell */}
        <div
          ref={progressRef}
          style={{
            visibility: "hidden",
            position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase" }}>
            Scroll
          </span>
          <div style={{ width: 100, height: 1, background: "rgba(255,255,255,0.2)", borderRadius: 1, overflow: "hidden" }}>
            <div style={{
              height: "100%", background: "rgba(255,255,255,0.75)",
              width: `${progress * 100}%`, transition: "width 0.1s",
            }} />
          </div>
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em" }}>
            {String(currentSection + 1).padStart(2, "0")} / {String(TOTAL_SECTIONS + 1).padStart(2, "0")}
          </span>
        </div>

      </div>{/* end sticky */}
    </div>
  )
}
