'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function ParallaxLandscape() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Each layer moves at a different speed — furthest = slowest
  const skyY      = useTransform(scrollYProgress, [0, 1], ['0%',   '8%'])
  const moonY     = useTransform(scrollYProgress, [0, 1], ['-6%',  '14%'])
  const far1Y     = useTransform(scrollYProgress, [0, 1], ['0%',   '12%'])
  const far2Y     = useTransform(scrollYProgress, [0, 1], ['0%',   '20%'])
  const mid1Y     = useTransform(scrollYProgress, [0, 1], ['0%',   '30%'])
  const mid2Y     = useTransform(scrollYProgress, [0, 1], ['0%',   '42%'])
  const nearY     = useTransform(scrollYProgress, [0, 1], ['0%',   '58%'])
  const treesY    = useTransform(scrollYProgress, [0, 1], ['0%',   '72%'])

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ height: '520px' }}>

      {/* Sky gradient */}
      <motion.div
        style={{ y: skyY }}
        className="absolute inset-0"
      >
        <div className="w-full h-full" style={{
          background: 'linear-gradient(180deg, #050508 0%, #0D0520 30%, #1A0840 55%, #2D1060 75%, #3D1878 100%)',
        }} />
      </motion.div>

      {/* Stars */}
      <motion.div style={{ y: moonY }} className="absolute inset-0 pointer-events-none">
        {[
          [12, 8], [25, 5], [38, 12], [52, 4], [67, 9], [78, 6], [88, 14],
          [18, 20], [44, 18], [61, 22], [83, 17], [7, 30], [30, 28], [72, 26],
        ].map(([x, y], i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${x}%`, top: `${y}%`,
              width: i % 3 === 0 ? 2 : 1.5,
              height: i % 3 === 0 ? 2 : 1.5,
              opacity: 0.4 + (i % 4) * 0.15,
            }}
          />
        ))}
        {/* Moon / glow orb */}
        <div
          className="absolute rounded-full"
          style={{
            right: '18%', top: '12%',
            width: 48, height: 48,
            background: 'radial-gradient(circle, rgba(167,139,250,0.9) 0%, rgba(124,58,237,0.4) 50%, transparent 70%)',
            boxShadow: '0 0 40px 10px rgba(124,58,237,0.3)',
          }}
        />
      </motion.div>

      {/* Far mountains 1 */}
      <motion.div style={{ y: far1Y }} className="absolute bottom-0 w-full">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full" style={{ height: 260 }}>
          <path d="M0,280 L0,180 L80,140 L160,170 L240,110 L340,150 L420,90 L520,130 L600,80 L700,120 L780,70 L880,110 L960,60 L1060,100 L1140,55 L1240,95 L1320,50 L1440,90 L1440,320 L0,320 Z"
            fill="#1A0840" />
        </svg>
      </motion.div>

      {/* Far mountains 2 */}
      <motion.div style={{ y: far2Y }} className="absolute bottom-0 w-full">
        <svg viewBox="0 0 1440 280" preserveAspectRatio="none" className="w-full" style={{ height: 240 }}>
          <path d="M0,260 L0,200 L100,155 L200,180 L300,130 L400,160 L500,105 L600,140 L700,95 L800,130 L900,85 L1000,120 L1100,75 L1200,110 L1300,68 L1440,100 L1440,280 L0,280 Z"
            fill="#250B55" />
        </svg>
      </motion.div>

      {/* Mid mountains 1 */}
      <motion.div style={{ y: mid1Y }} className="absolute bottom-0 w-full">
        <svg viewBox="0 0 1440 260" preserveAspectRatio="none" className="w-full" style={{ height: 220 }}>
          <path d="M0,240 L0,190 L120,140 L220,170 L320,115 L440,150 L540,100 L640,135 L740,88 L860,125 L960,78 L1080,115 L1180,70 L1300,108 L1440,75 L1440,260 L0,260 Z"
            fill="#160535" />
        </svg>
      </motion.div>

      {/* Mid mountains 2 */}
      <motion.div style={{ y: mid2Y }} className="absolute bottom-0 w-full">
        <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="w-full" style={{ height: 190 }}>
          <path d="M0,200 L0,160 L150,110 L280,145 L400,95 L520,130 L640,82 L760,118 L880,70 L1000,105 L1120,62 L1260,98 L1440,65 L1440,220 L0,220 Z"
            fill="#0E0325" />
        </svg>
      </motion.div>

      {/* Near hills */}
      <motion.div style={{ y: nearY }} className="absolute bottom-0 w-full">
        <svg viewBox="0 0 1440 180" preserveAspectRatio="none" className="w-full" style={{ height: 160 }}>
          <path d="M0,160 L0,130 L200,80 L360,110 L520,65 L680,95 L840,55 L1000,88 L1160,50 L1320,82 L1440,58 L1440,180 L0,180 Z"
            fill="#080215" />
        </svg>
      </motion.div>

      {/* Trees silhouette */}
      <motion.div style={{ y: treesY }} className="absolute bottom-0 w-full">
        <svg viewBox="0 0 1440 130" preserveAspectRatio="none" className="w-full" style={{ height: 120 }}>
          {/* Tree silhouette as a series of triangles */}
          <path d="
            M0,130 L0,90 L15,90 L15,60 L25,60 L25,30 L35,30 L35,60 L45,60 L45,90
            L50,90 L50,55 L60,55 L60,25 L70,25 L70,55 L80,55 L80,90
            L90,90 L90,70 L100,70 L100,40 L110,40 L110,70 L120,70 L120,90
            L125,90 L125,50 L135,50 L135,20 L145,20 L145,50 L155,50 L155,90
            L165,90 L165,65 L175,65 L175,35 L185,35 L185,65 L195,65 L195,90
            L210,90 L210,55 L220,55 L220,28 L230,28 L230,55 L240,55 L240,90
            L260,90 L260,70 L270,70 L270,45 L280,45 L280,70 L290,70 L290,90
            L300,90 L300,50 L312,50 L312,18 L324,18 L324,50 L336,50 L336,90
            L350,90 L350,65 L362,65 L362,38 L374,38 L374,65 L386,65 L386,90
            L400,90 L400,55 L412,55 L412,22 L424,22 L424,55 L436,55 L436,90
            L455,90 L455,72 L465,72 L465,48 L475,48 L475,72 L485,72 L485,90
            L500,90 L500,52 L512,52 L512,20 L524,20 L524,52 L536,52 L536,90
            L555,90 L555,68 L567,68 L567,40 L579,40 L579,68 L591,68 L591,90
            L610,90 L610,55 L622,55 L622,25 L634,25 L634,55 L646,55 L646,90
            L660,90 L660,72 L672,72 L672,50 L684,50 L684,72 L696,72 L696,90
            L710,90 L710,50 L722,50 L722,18 L734,18 L734,50 L746,50 L746,90
            L762,90 L762,65 L774,65 L774,38 L786,38 L786,65 L798,65 L798,90
            L815,90 L815,55 L827,55 L827,22 L839,22 L839,55 L851,55 L851,90
            L868,90 L868,70 L880,70 L880,45 L892,45 L892,70 L904,70 L904,90
            L920,90 L920,52 L932,52 L932,20 L944,20 L944,52 L956,52 L956,90
            L972,90 L972,65 L984,65 L984,38 L996,38 L996,65 L1008,65 L1008,90
            L1025,90 L1025,55 L1037,55 L1037,25 L1049,25 L1049,55 L1061,55 L1061,90
            L1078,90 L1078,70 L1090,70 L1090,42 L1102,42 L1102,70 L1114,70 L1114,90
            L1130,90 L1130,50 L1142,50 L1142,18 L1154,18 L1154,50 L1166,50 L1166,90
            L1182,90 L1182,65 L1194,65 L1194,40 L1206,40 L1206,65 L1218,65 L1218,90
            L1235,90 L1235,55 L1247,55 L1247,22 L1259,22 L1259,55 L1271,55 L1271,90
            L1288,90 L1288,68 L1300,68 L1300,45 L1312,45 L1312,68 L1324,68 L1324,90
            L1340,90 L1340,52 L1352,52 L1352,20 L1364,20 L1364,52 L1376,52 L1376,90
            L1395,90 L1395,65 L1407,65 L1407,38 L1419,38 L1419,65 L1431,65 L1431,90
            L1440,90 L1440,130 Z"
            fill="#050508" />
        </svg>
      </motion.div>

      {/* Ground */}
      <div className="absolute bottom-0 w-full h-8 bg-[#050508]" />

    </section>
  )
}
