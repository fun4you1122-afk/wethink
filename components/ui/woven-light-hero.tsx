"use client";

import { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import * as THREE from 'three';

export const WovenLightHero = () => {
  const textControls   = useAnimation();
  const buttonControls = useAnimation();

  useEffect(() => {
    textControls.start(i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 + 1.5, duration: 1.2, ease: [0.2, 0.65, 0.3, 0.9] },
    }));
    buttonControls.start({
      opacity: 1,
      transition: { delay: 2.5, duration: 1 },
    });
  }, [textControls, buttonControls]);

  const headline = "Think. Plan. Grow.";

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">
      <WovenCanvas />

      <div className="relative z-10 text-center px-4">
        <h1
          className="text-6xl md:text-8xl text-white"
          style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 0 50px rgba(255,255,255,0.3)' }}
        >
          {headline.split(" ").map((word, i) => (
            <span key={i} className="inline-block">
              {word.split("").map((char, j) => (
                <motion.span
                  key={j}
                  custom={i * 5 + j}
                  initial={{ opacity: 0, y: 50 }}
                  animate={textControls}
                  style={{ display: 'inline-block' }}
                >
                  {char}
                </motion.span>
              ))}
              {i < headline.split(" ").length - 1 && <span>&nbsp;</span>}
            </span>
          ))}
        </h1>

        <motion.p
          custom={headline.length}
          initial={{ opacity: 0, y: 30 }}
          animate={textControls}
          className="mx-auto mt-6 max-w-xl text-lg text-slate-300"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Abu Dhabi's premier IT consulting partner — engineering digital
          transformation for UAE enterprises since 2019.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={buttonControls}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <button
            onClick={() => scrollTo('#contact')}
            className="rounded-full border-2 border-white/20 bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Start a Project
          </button>
          <button
            onClick={() => scrollTo('#services')}
            className="rounded-full border-2 border-violet-400/40 bg-violet-500/10 px-8 py-3 font-semibold text-violet-300 backdrop-blur-sm transition-all hover:bg-violet-500/20"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Our Services
          </button>
        </motion.div>
      </div>
    </div>
  );
};

// --- Three.js Canvas ---
const WovenCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    const clock  = new THREE.Clock();

    // Particles
    const particleCount  = 50000;
    const positions      = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors         = new Float32Array(particleCount * 3);
    const velocities     = new Float32Array(particleCount * 3);

    const geometry   = new THREE.BufferGeometry();
    const torusKnot  = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 32);

    for (let i = 0; i < particleCount; i++) {
      const vi = i % torusKnot.attributes.position.count;
      const x  = torusKnot.attributes.position.getX(vi);
      const y  = torusKnot.attributes.position.getY(vi);
      const z  = torusKnot.attributes.position.getZ(vi);

      positions[i*3]   = originalPositions[i*3]   = x;
      positions[i*3+1] = originalPositions[i*3+1] = y;
      positions[i*3+2] = originalPositions[i*3+2] = z;

      // Violet-tinted palette for WeThink
      const col = new THREE.Color();
      col.setHSL(0.72 + Math.random() * 0.15, 0.8, 0.65);
      colors[i*3] = col.r; colors[i*3+1] = col.g; colors[i*3+2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

    const material = new THREE.PointsMaterial({
      size: 0.02, vertexColors: true,
      blending: THREE.AdditiveBlending, transparent: true, opacity: 0.8,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const onMouseMove = (e: MouseEvent) => {
      mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const mw = new THREE.Vector3(mouse.x * 3, mouse.y * 3, 0);

      for (let i = 0; i < particleCount; i++) {
        const ix = i*3, iy = i*3+1, iz = i*3+2;
        const cur  = new THREE.Vector3(positions[ix], positions[iy], positions[iz]);
        const orig = new THREE.Vector3(originalPositions[ix], originalPositions[iy], originalPositions[iz]);
        const vel  = new THREE.Vector3(velocities[ix], velocities[iy], velocities[iz]);

        const dist = cur.distanceTo(mw);
        if (dist < 1.5) {
          const force = (1.5 - dist) * 0.01;
          vel.add(new THREE.Vector3().subVectors(cur, mw).normalize().multiplyScalar(force));
        }
        vel.add(new THREE.Vector3().subVectors(orig, cur).multiplyScalar(0.001));
        vel.multiplyScalar(0.95);

        positions[ix] += vel.x; positions[iy] += vel.y; positions[iz] += vel.z;
        velocities[ix] = vel.x; velocities[iy] = vel.y; velocities[iz] = vel.z;
      }
      geometry.attributes.position.needsUpdate = true;
      points.rotation.y = t * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      geometry.dispose(); material.dispose(); renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};

export default WovenLightHero;
