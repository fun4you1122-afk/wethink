'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import gsap from 'gsap'

const FilmGrainShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    time: { value: 0 },
    intensity: { value: 1.1 },
    grainScale: { value: 0.5 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time, intensity, grainScale;
    varying vec2 vUv;
    float sparkleNoise(vec2 p) {
      vec2 jPos = p + vec2(37.0,17.0)*fract(time*0.07);
      vec3 p3 = fract(vec3(jPos.xyx)*vec3(.1031,.1030,.0973)+time*0.1);
      p3 += dot(p3,p3.yxz+19.19);
      return fract((p3.x+p3.y)*p3.z);
    }
    void main(){
      vec4 color = texture2D(tDiffuse,vUv);
      vec2 pos = gl_FragCoord.xy*0.5*grainScale;
      float noise = sparkleNoise(pos)*2.0-1.0;
      gl_FragColor = vec4(color.rgb+noise*intensity*0.1, color.a);
    }
  `,
}

const EXTEND_LEFT_PX = 320
const MAX_BARS = 256
const FIXED_BAR_WIDTH = 14
const FIXED_BAR_GAP = 10

const wave1 = { gain: 10, frequency: 0, waveLength: 0.5, currentAngle: 0 }
const wave2 = { gain: 0, frequency: 0, waveLength: 0.5, currentAngle: 0 }

const waveKeyframes1 = [
  { time: 0, gain: 10, frequency: 0, waveLength: 0.5 },
  { time: 4, gain: 300, frequency: 1, waveLength: 0.5 },
  { time: 6, gain: 300, frequency: 4, waveLength: Math.PI * 1.5 },
  { time: 8, gain: 225, frequency: 4, waveLength: Math.PI * 1.5 },
  { time: 10, gain: 500, frequency: 1, waveLength: Math.PI * 1.5 },
  { time: 14, gain: 225, frequency: 3, waveLength: Math.PI * 1.5 },
  { time: 22, gain: 100, frequency: 6, waveLength: Math.PI * 1.5 },
  { time: 28, gain: 0, frequency: 0.9, waveLength: 0.5 },
  { time: 30, gain: 128, frequency: 0.9, waveLength: 0.5 },
  { time: 32, gain: 190, frequency: 1.42, waveLength: 0.5 },
  { time: 39, gain: 499, frequency: 4.0, waveLength: Math.PI * 1.5 },
  { time: 40, gain: 500, frequency: 4.0, waveLength: Math.PI * 1.5 },
  { time: 42, gain: 400, frequency: 2.82, waveLength: Math.PI * 1.5 },
  { time: 44, gain: 327, frequency: 2.56, waveLength: Math.PI * 1.5 },
  { time: 48, gain: 188, frequency: 5.4, waveLength: 0.5 },
  { time: 52, gain: 32, frequency: 0.1, waveLength: 0.5 },
  { time: 55, gain: 10, frequency: 0, waveLength: 0.5 },
]

const waveKeyframes2 = [
  { time: 0, gain: 0, frequency: 0, waveLength: 0.5 },
  { time: 9, gain: 0, frequency: 0, waveLength: 0.5 },
  { time: 10, gain: 400, frequency: 1, waveLength: 0.5 },
  { time: 13, gain: 300, frequency: 4, waveLength: Math.PI * 1.5 },
  { time: 24, gain: 96, frequency: 2, waveLength: 0.5 },
  { time: 28, gain: 0, frequency: 0.9, waveLength: 0.5 },
  { time: 30, gain: 142, frequency: 0.9, waveLength: 0.5 },
  { time: 36, gain: 374, frequency: 4.0, waveLength: Math.PI * 1.5 },
  { time: 38, gain: 375, frequency: 4.0, waveLength: Math.PI * 1.5 },
  { time: 40, gain: 300, frequency: 2.26, waveLength: Math.PI * 1.5 },
  { time: 44, gain: 245, frequency: 2.05, waveLength: Math.PI * 1.5 },
  { time: 48, gain: 141, frequency: 5.12, waveLength: 0.5 },
  { time: 52, gain: 24, frequency: 0.08, waveLength: 0.5 },
  { time: 55, gain: 8, frequency: 0, waveLength: 0.5 },
]

export default function HeroWaveBg() {
  const waveRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const waveContainer = waveRef.current
    if (!waveContainer) return

    // --- local wave state (not module-level, to avoid stale state between mounts) ---
    const w1 = { gain: 10, frequency: 0, waveLength: 0.5, currentAngle: 0 }
    const w2 = { gain: 0, frequency: 0, waveLength: 0.5, currentAngle: 0 }

    const mouse = { x: 0, y: 0, active: false }
    let proxyMouseX = 0, proxyMouseY = 0, proxyInitialized = false
    let smoothSpeed = 0

    const glowConfig = { maxGlowDistance: 690, speedScale: 0.52, fadeSpeed: 4.4, glowFalloff: 0.6, mouseSmoothing: 30.0 }
    const glowDynamics = { accumulation: 1.2, decay: 3.3, max: 40.0, accumEase: 1.5, speedEase: 8.5 }

    const DPR_CAP = 2
    const EFFECT_PR = Math.min(window.devicePixelRatio, DPR_CAP) * 0.5

    while (waveContainer.firstChild) waveContainer.removeChild(waveContainer.firstChild)

    const waveRenderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    waveRenderer.setPixelRatio(EFFECT_PR)
    waveRenderer.toneMapping = THREE.ACESFilmicToneMapping
    waveRenderer.toneMappingExposure = 1.0
    waveRenderer.autoClear = false
    waveContainer.appendChild(waveRenderer.domElement)

    const waveScene = new THREE.Scene()
    waveScene.add(new THREE.AmbientLight(0xffffff, 0.2))

    let waveCamera: THREE.OrthographicCamera
    let waveComposer: EffectComposer
    let waveBloomPass: UnrealBloomPass
    let grainPass: ShaderPass
    let cameraWidth = 0, cameraHeight = 0
    let instancedBars: THREE.InstancedMesh | null = null
    let currentBarCount = 0
    let barMaterial: THREE.ShaderMaterial
    let barCenters: Float32Array | null = null
    let waveCameraInitialized = false

    let setMouseNDC: (v: number) => void
    let setSmoothSpeed: (v: number) => void
    let setPhase1: (v: number) => void
    let setPhase2: (v: number) => void

    function updateGlowDistance() {
      if (!barMaterial) return
      const totalWidth = currentBarCount * (FIXED_BAR_WIDTH + FIXED_BAR_GAP) - FIXED_BAR_GAP
      const spanPx = totalWidth * 0.3
      glowConfig.maxGlowDistance = spanPx
      ;(barMaterial.uniforms as any).uMaxGlowDist.value = spanPx
    }

    function createBarMaterial() {
      return new THREE.ShaderMaterial({
        defines: { USE_INSTANCING: '' },
        uniforms: {
          uMouseClipX: { value: 0 }, uHalfW: { value: 0 },
          uMaxGlowDist: { value: glowConfig.maxGlowDistance }, uGlowFalloff: { value: glowConfig.glowFalloff },
          uSmoothSpeed: { value: 0 }, uGainMul: { value: 1 }, uBaseY: { value: 0 },
          w1Gain: { value: w1.gain }, w1Len: { value: w1.waveLength }, w1Phase: { value: 0 },
          w2Gain: { value: w2.gain }, w2Len: { value: w2.waveLength }, w2Phase: { value: 0 },
          uFixedTipPx: { value: 10 }, uMinBottomWidthPx: { value: 0 },
          uColor: { value: new THREE.Color('hsl(220,100%,50%)') },
          uEmissive: { value: new THREE.Color('#1f3dbc') },
          uBaseEmissive: { value: 0.05 },
          uRotationAngle: { value: THREE.MathUtils.degToRad(23.4) },
        },
        vertexShader: `
          attribute float aXPos, aPosNorm, aGroup, aGlow;
          uniform float uMouseClipX, uHalfW, uMaxGlowDist, uGlowFalloff;
          uniform float uGainMul, uBaseY;
          uniform float w1Gain, w1Len, w1Phase, w2Gain, w2Len, w2Phase;
          uniform float uRotationAngle;
          varying float vGlow, vPulse, vHeight;
          varying vec2 vUv;
          float sineH(float g, float len, float ph, float t){
            return max(20.0,(sin(ph+t*len)*0.5+0.6)*g*uGainMul);
          }
          void main(){
            vUv = uv;
            float h1 = sineH(w1Gain,w1Len,w1Phase,aPosNorm);
            float h2 = sineH(w2Gain,w2Len,w2Phase,aPosNorm);
            vHeight = mix(h1,h2,aGroup);
            vec3 pos = position;
            pos.x += aXPos; pos.y = 0.0;
            float height = vHeight*uv.y;
            pos.x += height*tan(uRotationAngle);
            pos.y += height;
            pos.y += uBaseY;
            vec4 clip = projectionMatrix*modelViewMatrix*vec4(pos,1.0);
            float dxPx = abs(uMouseClipX-clip.x/clip.w)*uHalfW;
            float prox = clamp(1.0-pow(dxPx/uMaxGlowDist,uGlowFalloff),0.0,1.0);
            vGlow = aGlow; vPulse = prox;
            gl_Position = clip;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor, uEmissive;
          uniform float uBaseEmissive, uFixedTipPx, uMinBottomWidthPx;
          varying float vGlow, vPulse, vHeight;
          varying vec2 vUv;
          void main(){
            float tipProp = clamp(uFixedTipPx/vHeight,0.0,0.95);
            float transitionY = 1.0-tipProp;
            float xFromCenter = abs(vUv.x-0.5)*2.0;
            float px = fwidth(vUv.x);
            float allowedWidth;
            if(vUv.y >= transitionY){
              float topPos = (vUv.y-transitionY)/tipProp;
              allowedWidth = 1.0-pow(topPos,0.9);
            } else {
              float bottomPos = vUv.y/transitionY;
              allowedWidth = max(uMinBottomWidthPx*px*10.0,pow(bottomPos,0.5));
            }
            float alpha = smoothstep(-px,px,allowedWidth-xFromCenter);
            if(alpha<0.01) discard;
            float emissiveStrength = uBaseEmissive+vGlow*0.9+vPulse*0.15;
            vec3 finalColor = uColor+uEmissive*emissiveStrength;
            gl_FragColor = vec4(finalColor,0.35*alpha);
          }
        `,
        side: THREE.FrontSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      })
    }

    function setupQuickSetters() {
      const u = (instancedBars!.material as THREE.ShaderMaterial).uniforms as any
      setMouseNDC = gsap.quickSetter(u.uMouseClipX, 'value') as any
      setSmoothSpeed = gsap.quickSetter(u.uSmoothSpeed, 'value') as any
      setPhase1 = gsap.quickSetter(u.w1Phase, 'value') as any
      setPhase2 = gsap.quickSetter(u.w2Phase, 'value') as any
    }

    const MAX_KEYFRAME_GAIN = 500, SCREEN_COVERAGE = 0.6
    function updateGainMul() {
      if (!barMaterial) return
      ;(barMaterial.uniforms as any).uGainMul.value = (cameraHeight * SCREEN_COVERAGE) / MAX_KEYFRAME_GAIN
    }

    function createBars() {
      if (instancedBars) { waveScene.remove(instancedBars); instancedBars.geometry.dispose(); (instancedBars.material as any).dispose(); instancedBars = null }
      const span = cameraWidth + EXTEND_LEFT_PX
      const barCount = Math.min(MAX_BARS, Math.max(1, Math.floor((span + FIXED_BAR_GAP) / (FIXED_BAR_WIDTH + FIXED_BAR_GAP))))
      const gap = barCount > 1 ? (span - barCount * FIXED_BAR_WIDTH) / (barCount - 1) : 0
      currentBarCount = barCount
      const instCnt = barCount * 2
      barCenters = new Float32Array(barCount)
      const aXPos = new Float32Array(instCnt), aPosNorm = new Float32Array(instCnt)
      const aGroup = new Float32Array(instCnt), aGlow = new Float32Array(instCnt).fill(0)
      const startX = -cameraWidth / 2 - EXTEND_LEFT_PX
      for (let i = 0; i < barCount; i++) {
        const x = startX + FIXED_BAR_WIDTH / 2 + i * (FIXED_BAR_WIDTH + gap)
        barCenters[i] = x
        const t = barCount > 1 ? i / (barCount - 1) : 0
        aXPos[i] = aXPos[i + barCount] = x
        aPosNorm[i] = aPosNorm[i + barCount] = t
        aGroup[i] = 0; aGroup[i + barCount] = 1
      }
      const geo = new THREE.PlaneGeometry(FIXED_BAR_WIDTH, 1, 1, 1)
      geo.translate(0, 0.5, 0)
      geo.setAttribute('aXPos', new THREE.InstancedBufferAttribute(aXPos, 1))
      geo.setAttribute('aPosNorm', new THREE.InstancedBufferAttribute(aPosNorm, 1))
      geo.setAttribute('aGroup', new THREE.InstancedBufferAttribute(aGroup, 1))
      geo.setAttribute('aGlow', new THREE.InstancedBufferAttribute(aGlow, 1).setUsage(THREE.DynamicDrawUsage))
      barMaterial = createBarMaterial()
      instancedBars = new THREE.InstancedMesh(geo, barMaterial, instCnt)
      instancedBars.frustumCulled = false
      waveScene.add(instancedBars)
      setupQuickSetters()
      updateGlowDistance()
    }

    function accumulateGlow(dt: number) {
      if (!instancedBars || !barCenters) return
      const attr = instancedBars.geometry.getAttribute('aGlow') as THREE.InstancedBufferAttribute
      const arr = attr.array as Float32Array
      const mouseWorldX = proxyMouseX - cameraWidth * 0.5
      const mDist = glowConfig.maxGlowDistance, fall = glowConfig.glowFalloff
      const decayLerp = 1 - Math.exp(-glowDynamics.decay * dt)
      const addEase = 1 - Math.exp(-glowDynamics.accumEase * dt)
      for (let i = 0; i < currentBarCount; i++) {
        const dx = Math.abs(mouseWorldX - barCenters[i])
        const hit = dx < mDist ? 1 - Math.pow(dx / mDist, fall) : 0
        let g = arr[i] + hit * smoothSpeed * addEase - arr[i] * decayLerp
        if (g > glowDynamics.max) g = glowDynamics.max
        arr[i] = arr[i + currentBarCount] = g
      }
      ;(attr as any).needsUpdate = true
    }

    function initThree() {
      cameraWidth = waveContainer!.clientWidth
      cameraHeight = waveContainer!.clientHeight
      waveCamera = new THREE.OrthographicCamera(-cameraWidth/2, cameraWidth/2, cameraHeight/2, -cameraHeight/2, -1000, 1000)
      waveCamera.position.z = 10
      waveCamera.lookAt(0, 0, 0)
      waveRenderer.setSize(cameraWidth, cameraHeight)
      waveComposer = new EffectComposer(waveRenderer)
      ;(waveComposer as any).setPixelRatio(EFFECT_PR)
      waveComposer.addPass(new RenderPass(waveScene, waveCamera))
      waveBloomPass = new UnrealBloomPass(new THREE.Vector2(cameraWidth, cameraHeight), 1.0, 0.68, 0.0)
      ;(waveBloomPass as any).resolution.set(cameraWidth * 0.5, cameraHeight * 0.5)
      waveComposer.addPass(waveBloomPass)
      grainPass = new ShaderPass(FilmGrainShader as any)
      ;(grainPass.uniforms as any).intensity.value = 0.9
      ;(grainPass.uniforms as any).grainScale.value = 0.3
      waveComposer.addPass(grainPass)
      createBars()
      updateGainMul()
      waveCameraInitialized = true
      gsap.to(waveRenderer.domElement, { opacity: 1, duration: 1.2, ease: 'power2.out' })
    }

    let pendingW = 0, pendingH = 0, heavyTimer: ReturnType<typeof setTimeout> | null = null
    let rect = { left: 0, top: 0 }

    function onResize(w: number, h: number) {
      if (!waveCameraInitialized) return
      pendingW = w; pendingH = h; cameraWidth = w; cameraHeight = h
      waveCamera.left = -w/2; waveCamera.right = w/2; waveCamera.top = h/2; waveCamera.bottom = -h/2
      waveCamera.updateProjectionMatrix()
      const span = w + EXTEND_LEFT_PX
      const newCount = Math.min(MAX_BARS, Math.max(1, Math.floor((span + FIXED_BAR_GAP) / (FIXED_BAR_WIDTH + FIXED_BAR_GAP))))
      if (newCount !== currentBarCount) { currentBarCount = newCount; createBars() }
      else {
        const startX = -w/2 - EXTEND_LEFT_PX
        const gap = newCount > 1 ? (span - newCount * FIXED_BAR_WIDTH) / (newCount - 1) : 0
        const aX = instancedBars!.geometry.getAttribute('aXPos') as THREE.InstancedBufferAttribute
        const aT = instancedBars!.geometry.getAttribute('aPosNorm') as THREE.InstancedBufferAttribute
        for (let i = 0; i < newCount; i++) {
          const x = startX + FIXED_BAR_WIDTH/2 + i*(FIXED_BAR_WIDTH+gap)
          ;(aX.array as any)[i] = (aX.array as any)[i+newCount] = x
          ;(aT.array as any)[i] = (aT.array as any)[i+newCount] = newCount > 1 ? i/(newCount-1) : 0
          if (barCenters) barCenters[i] = x
        }
        ;(aX as any).needsUpdate = true; (aT as any).needsUpdate = true
      }
      ;(barMaterial.uniforms as any).uHalfW.value = w * 0.5
      updateGainMul(); updateGlowDistance()
      if (heavyTimer) clearTimeout(heavyTimer)
      heavyTimer = setTimeout(() => {
        waveRenderer.setPixelRatio(EFFECT_PR); waveRenderer.setSize(pendingW, pendingH)
        ;(waveComposer as any).setSize(pendingW, pendingH)
        ;(waveBloomPass as any)?.setSize(pendingW, pendingH)
        ;(grainPass as any).setSize?.(pendingW, pendingH)
        ;(grainPass.uniforms as any).grainScale.value = 0.5
        heavyTimer = null
      }, 10)
      rect = waveRenderer.domElement.getBoundingClientRect()
    }

    // Pointer
    const readCoords = (e: PointerEvent | TouchEvent) => {
      if ('clientX' in e) return { x: (e as PointerEvent).clientX - rect.left, y: (e as PointerEvent).clientY - rect.top }
      const t = (e as TouchEvent).touches?.[0] || (e as TouchEvent).changedTouches?.[0]
      return t ? { x: t.clientX - rect.left, y: t.clientY - rect.top } : { x: mouse.x, y: mouse.y }
    }
    const onMove = (e: any) => { const c = readCoords(e); mouse.x = c.x; mouse.y = c.y; mouse.active = true; if (!proxyInitialized) { proxyMouseX = c.x; proxyMouseY = c.y; proxyInitialized = true } }
    const onLeave = () => { mouse.active = false }
    waveRenderer.domElement.addEventListener('pointermove', onMove, { passive: true })
    waveRenderer.domElement.addEventListener('pointerleave', onLeave, { passive: true })
    waveRenderer.domElement.addEventListener('touchmove', onMove as any, { passive: true })
    window.addEventListener('touchend', onLeave, { passive: true })

    // Keyframe tween helper
    function buildKeyframeTl(target: any, kfs: any[]) {
      const tl = gsap.timeline()
      for (let i = 0; i < kfs.length - 1; i++) {
        const cur = kfs[i], nxt = kfs[i+1]
        tl.to(target, { gain: nxt.gain, frequency: nxt.frequency, waveLength: nxt.waveLength, duration: nxt.time - cur.time, ease: 'power2.inOut' }, cur.time)
      }
      return tl
    }

    // Init + start
    initThree()
    rect = waveRenderer.domElement.getBoundingClientRect()

    const mainTl = gsap.timeline({ repeat: -1 })
    mainTl.add(buildKeyframeTl(w1, waveKeyframes1), 0)
    mainTl.add(buildKeyframeTl(w2, waveKeyframes2), 0)

    const ticker = () => {
      if (!waveCameraInitialized || !instancedBars) return
      const dt = (gsap.ticker.deltaRatio() as number) / 60
      w1.currentAngle = (w1.currentAngle + w1.frequency * dt) % (Math.PI * 2)
      w2.currentAngle = (w2.currentAngle + w2.frequency * dt) % (Math.PI * 2)
      setPhase1(w1.currentAngle); setPhase2(w2.currentAngle)
      const kMouse = 1 - Math.exp(-glowConfig.mouseSmoothing * dt)
      proxyMouseX += (mouse.x - proxyMouseX) * kMouse
      proxyMouseY += (mouse.y - proxyMouseY) * kMouse
      const rawSpeed = Math.hypot(mouse.active ? mouse.x - proxyMouseX : 0, 0) * glowConfig.speedScale
      smoothSpeed += (rawSpeed - smoothSpeed) * (1 - Math.exp(-glowDynamics.speedEase * dt))
      setSmoothSpeed(smoothSpeed)
      const u = (instancedBars.material as THREE.ShaderMaterial).uniforms as any
      u.w1Gain.value = w1.gain; u.w1Len.value = w1.waveLength
      u.w2Gain.value = w2.gain; u.w2Len.value = w2.waveLength
      setMouseNDC((proxyMouseX / cameraWidth) * 2 - 1)
      u.uBaseY.value = -cameraHeight * 0.5 + (window.innerWidth < 768 ? 20 : 40)
      ;(grainPass.uniforms as any).time.value += dt * 0.2
      accumulateGlow(dt)
      waveComposer.render()
    }

    gsap.ticker.add(ticker)

    const ro = new ResizeObserver(entries => {
      for (const e of entries) if (e.target === waveContainer) onResize(e.contentRect.width, e.contentRect.height)
    })
    ro.observe(waveContainer)

    const onVisibility = () => { document.hidden ? gsap.globalTimeline.pause() : gsap.globalTimeline.resume() }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      gsap.ticker.remove(ticker)
      mainTl.kill()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      waveRenderer.domElement.removeEventListener('pointermove', onMove)
      waveRenderer.domElement.removeEventListener('pointerleave', onLeave)
      waveRenderer.domElement.removeEventListener('touchmove', onMove as any)
      window.removeEventListener('touchend', onLeave)
      waveScene.traverse((obj: any) => {
        if (obj.isMesh) { obj.geometry.dispose(); if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose()); else obj.material.dispose() }
      })
      ;(waveComposer as any)?.dispose?.()
      ;(waveRenderer as any)?.dispose?.()
      try { if (waveRenderer.domElement.parentElement === waveContainer) waveContainer.removeChild(waveRenderer.domElement) } catch {}
    }
  }, [])

  return (
    <div
      ref={waveRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.85 }}
    />
  )
}
