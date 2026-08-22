'use client'

import { cn } from '@/lib/utils'
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // A denser, closer field than before. The old grid was so wide and so
    // far from the camera that sizeAttenuation shrank almost every dot to
    // a speck, which read as no background at all.
    // sparse enough that individual rows stay distinguishable; any denser
    // and the rows merge and the ripples read as noise
    const SEPARATION = 115
    const AMOUNTX = 58
    const AMOUNTY = 32

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 1, 10000)
    camera.position.set(0, 210, 700)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const positions: number[] = []
    const colors: number[] = []

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions.push(
          ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
          0,
          iy * SEPARATION - (AMOUNTY * SEPARATION) / 2,
        )
        // the brand ramp, teal on the left through to violet on the right,
        // so the field reads as ours rather than as generic noise
        const t = ix / (AMOUNTX - 1)
        colors.push(
          0.06 + t * 0.42,
          0.62 - t * 0.38,
          0.58 + t * 0.32,
        )
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 3.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      // fixed screen size: with attenuation the far rows shrank to nothing
      // and the ripples never read as ripples, only as scattered dust
      sizeAttenuation: false,
      depthWrite: false,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    let count = 0
    let animationId = 0
    let running = false
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      const pos = geometry.attributes.position.array as Float32Array
      const col = geometry.attributes.color.array as Float32Array
      let i = 0
      for (let ix = 0; ix < AMOUNTX; ix++) {
        const t = ix / (AMOUNTX - 1)
        const r = 0.06 + t * 0.42
        const g = 0.62 - t * 0.38
        const bl = 0.58 + t * 0.32
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const a = Math.sin((ix + count) * 0.3)
          const b = Math.sin((iy + count) * 0.5)
          pos[i * 3 + 1] = a * 95 + b * 95
          // crest bright, trough faint
          const lift = 0.45 + ((a + b) / 2 + 1) * 0.55
          col[i * 3] = r * lift
          col[i * 3 + 1] = g * lift
          col[i * 3 + 2] = bl * lift
          i++
        }
      }
      geometry.attributes.position.needsUpdate = true
      geometry.attributes.color.needsUpdate = true
      renderer.render(scene, camera)
      count += 0.055
    }

    // Render one static frame; only loop while the hero is on screen
    animate()
    if (reducedMotion) {
      cancelAnimationFrame(animationId)
    } else {
      running = true
    }

    const io = new IntersectionObserver(([entry]) => {
      if (reducedMotion) return
      if (entry.isIntersecting && !running) {
        running = true
        animate()
      } else if (!entry.isIntersecting && running) {
        running = false
        cancelAnimationFrame(animationId)
      }
    })
    io.observe(container)

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      io.disconnect()
      window.removeEventListener('resize', handleResize)
      scene.traverse(obj => {
        if (obj instanceof THREE.Points) {
          obj.geometry.dispose()
          ;(Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(m => m.dispose())
        }
      })
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        maskImage:
          'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 18%, #000 52%, #000 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 18%, #000 52%, #000 100%)',
      }}
      {...props}
    />
  )
}
