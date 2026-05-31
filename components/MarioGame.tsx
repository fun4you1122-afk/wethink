'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/* ── World constants ── */
const W = 800
const H = 450
const GRAVITY = 0.7
const MOVE = 3.4
const JUMP = -13.2
const GROUND_TOP = 380
const FLAG_X = 3120
const WORLD_W = 3300

type Rect = { x: number; y: number; w: number; h: number }
type Enemy = {
  x: number; y: number; w: number; h: number
  vx: number; min: number; max: number
  alive: boolean; flat: boolean; flatTimer: number
}
type Coin = { x: number; y: number; got: boolean }
type GameState = {
  px: number; py: number; vx: number; vy: number
  onGround: boolean; face: 1 | -1; walkPhase: number
  cam: number; score: number; lives: number
  status: 'play' | 'won' | 'dead'
  t: number; timeLeft: number
  grounds: Rect[]; platforms: Rect[]; bricks: Rect[]
  enemies: Enemy[]; coins: Coin[]
  spawnX: number; spawnY: number
}

function buildState(): GameState {
  const groundH = H - GROUND_TOP + 40
  const grounds: Rect[] = [
    { x: -40,  y: GROUND_TOP, w: 760,  h: groundH },
    { x: 840,  y: GROUND_TOP, w: 760,  h: groundH },
    { x: 1720, y: GROUND_TOP, w: 1620, h: groundH },
  ]
  const platforms: Rect[] = [
    { x: 300,  y: 300, w: 120, h: 20 },
    { x: 520,  y: 232, w: 120, h: 20 },
    { x: 940,  y: 300, w: 110, h: 20 },
    { x: 1130, y: 244, w: 110, h: 20 },
    { x: 1340, y: 300, w: 120, h: 20 },
    { x: 1880, y: 300, w: 120, h: 20 },
    { x: 2120, y: 244, w: 110, h: 20 },
    { x: 2430, y: 300, w: 150, h: 20 },
    { x: 2720, y: 250, w: 120, h: 20 },
  ]
  const bricks: Rect[] = [
    { x: 600,  y: 250, w: 40, h: 40 },
    { x: 640,  y: 250, w: 40, h: 40 },
    { x: 1450, y: 248, w: 40, h: 40 },
    { x: 2300, y: 250, w: 40, h: 40 },
    { x: 2340, y: 250, w: 40, h: 40 },
  ]
  const enemies: Enemy[] = [
    { x: 470,  y: GROUND_TOP - 42, w: 42, h: 42, vx: 1.1,  min: 430,  max: 690,  alive: true, flat: false, flatTimer: 0 },
    { x: 1050, y: GROUND_TOP - 42, w: 42, h: 42, vx: 1.2,  min: 860,  max: 1560, alive: true, flat: false, flatTimer: 0 },
    { x: 1300, y: GROUND_TOP - 42, w: 42, h: 42, vx: -1.2, min: 860,  max: 1560, alive: true, flat: false, flatTimer: 0 },
    { x: 1950, y: GROUND_TOP - 42, w: 42, h: 42, vx: 1.3,  min: 1740, max: 2280, alive: true, flat: false, flatTimer: 0 },
    { x: 2600, y: GROUND_TOP - 42, w: 42, h: 42, vx: 1.2,  min: 2400, max: 2980, alive: true, flat: false, flatTimer: 0 },
  ]
  const coins: Coin[] = []
  const add = (x: number, y: number) => coins.push({ x, y, got: false })
  ;[330, 360, 390].forEach((x) => add(x, 260))
  ;[545, 575, 605].forEach((x) => add(x, 192))
  ;[600, 640].forEach((x) => add(x, 210))
  ;[760, 800].forEach((x) => add(x, 320))
  ;[965, 995].forEach((x) => add(x, 260))
  ;[1150, 1180].forEach((x) => add(x, 204))
  ;[1360, 1400].forEach((x) => add(x, 260))
  ;[1650, 1690].forEach((x) => add(x, 320))
  ;[1900, 1940].forEach((x) => add(x, 260))
  ;[2140, 2170].forEach((x) => add(x, 204))
  ;[2460, 2500, 2540].forEach((x) => add(x, 260))
  ;[2740, 2780].forEach((x) => add(x, 210))

  return {
    px: 60, py: 300, vx: 0, vy: 0,
    onGround: false, face: 1, walkPhase: 0,
    cam: 0, score: 0, lives: 3,
    status: 'play', t: 0, timeLeft: 300,
    grounds, platforms, bricks, enemies, coins,
    spawnX: 60, spawnY: 300,
  }
}

function aabb(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}

export default function MarioGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<GameState>(buildState())
  const keysRef = useRef({ left: false, right: false, jump: false, jumpLatch: false })
  const [status, setStatus] = useState<'play' | 'won' | 'dead'>('play')
  const [hud, setHud] = useState({ score: 0, lives: 3, coins: 0, time: 300 })

  const restart = useCallback(() => {
    stateRef.current = buildState()
    setStatus('play')
    setHud({ score: 0, lives: 3, coins: 0, time: 300 })
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (['arrowleft', 'a'].includes(k)) keysRef.current.left = true
      if (['arrowright', 'd'].includes(k)) keysRef.current.right = true
      if (['arrowup', 'w', ' ', 'spacebar'].includes(k)) keysRef.current.jump = true
      if (['arrowleft','arrowright','arrowup','arrowdown',' ','spacebar'].includes(k)) e.preventDefault()
    }
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (['arrowleft', 'a'].includes(k)) keysRef.current.left = false
      if (['arrowright', 'd'].includes(k)) keysRef.current.right = false
      if (['arrowup', 'w', ' ', 'spacebar'].includes(k)) {
        keysRef.current.jump = false
        keysRef.current.jumpLatch = false
      }
    }
    window.addEventListener('keydown', down, { passive: false })
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    let raf = 0
    let running = true

    const solids = (s: GameState) => [...s.grounds, ...s.platforms, ...s.bricks]

    function update() {
      const s = stateRef.current
      s.t++
      if (s.status !== 'play') return
      // Time countdown every 60 frames
      if (s.t % 60 === 0 && s.timeLeft > 0) {
        s.timeLeft--
        if (s.timeLeft <= 0) { loseLife(s); return }
      }

      const keys = keysRef.current
      s.vx = 0
      if (keys.left)  { s.vx = -MOVE; s.face = -1 }
      if (keys.right) { s.vx = MOVE;  s.face = 1  }
      if (keys.jump && s.onGround && !keys.jumpLatch) {
        s.vy = JUMP; s.onGround = false; keys.jumpLatch = true
      }
      s.vy = Math.min(s.vy + GRAVITY, 16)

      const all = solids(s)
      const pw = 36, ph = 52

      s.px += s.vx
      for (const b of all) {
        if (aabb({ x: s.px, y: s.py, w: pw, h: ph }, b)) {
          if (s.vx > 0) s.px = b.x - pw
          else if (s.vx < 0) s.px = b.x + b.w
          s.vx = 0
        }
      }
      s.px = Math.max(0, Math.min(s.px, WORLD_W - pw))

      s.py += s.vy
      s.onGround = false
      for (const b of all) {
        if (aabb({ x: s.px, y: s.py, w: pw, h: ph }, b)) {
          if (s.vy > 0) { s.py = b.y - ph; s.onGround = true; s.vy = 0 }
          else if (s.vy < 0) { s.py = b.y + b.h; s.vy = 0 }
        }
      }

      if (s.onGround && Math.abs(s.vx) > 0.1) s.walkPhase += 0.15
      else if (s.onGround) s.walkPhase = 0

      if (s.py > H + 80) { loseLife(s); return }

      for (const e of s.enemies) {
        if (!e.alive) continue
        if (e.flat) { if (--e.flatTimer <= 0) e.alive = false; continue }
        e.x += e.vx
        if (e.x < e.min || e.x > e.max) e.vx *= -1
        const pr: Rect = { x: s.px, y: s.py, w: pw, h: ph }
        const er: Rect = { x: e.x, y: e.y, w: e.w, h: e.h }
        if (aabb(pr, er)) {
          if (s.vy > 0 && s.py + ph - s.vy <= e.y + 12) {
            e.flat = true; e.flatTimer = 45
            s.vy = JUMP * 0.55
            s.score += 100
            setHud(h => ({ ...h, score: s.score }))
          } else {
            loseLife(s); return
          }
        }
      }

      for (const c of s.coins) {
        if (c.got) continue
        if (Math.abs(c.x - (s.px + pw / 2)) < 24 && Math.abs(c.y - (s.py + ph / 2)) < 28) {
          c.got = true; s.score += 25
          setHud({ score: s.score, lives: s.lives, coins: s.coins.filter(x => x.got).length, time: s.timeLeft })
        }
      }

      if (s.px + pw >= FLAG_X) { s.status = 'won'; setStatus('won') }
      s.cam = Math.max(0, Math.min(s.px - W / 2 + 18, WORLD_W - W))
    }

    function loseLife(s: GameState) {
      s.lives--
      if (s.lives <= 0) { s.status = 'dead'; setStatus('dead') }
      else { s.px = s.spawnX; s.py = s.spawnY; s.vx = 0; s.vy = 0; s.onGround = false; s.timeLeft = 300 }
      setHud({ score: s.score, lives: s.lives, coins: s.coins.filter(x => x.got).length, time: s.timeLeft })
    }

    /* ════════════ DRAW ════════════ */
    function draw() {
      const s = stateRef.current
      const cam = s.cam

      drawSky(ctx, s.t)
      drawMountains(ctx, cam, s.t)
      drawClouds(ctx, cam, s.t)
      drawFloatingIslands(ctx, cam)

      // Ground
      for (const g of s.grounds) drawGround(ctx, g.x - cam, g.y, g.w, g.h)

      // Platforms (stone)
      for (const p of s.platforms) drawStonePlatform(ctx, p.x - cam, p.y, p.w, p.h)

      // Crates (? blocks)
      for (const b of s.bricks) drawCrate(ctx, b.x - cam, b.y, b.w, b.h, s.t)

      // Coins
      for (const c of s.coins) {
        if (!c.got) drawCoin(ctx, c.x - cam, c.y, s.t)
      }

      // Pipes at pits
      drawPipe(ctx, 820 - cam, GROUND_TOP)
      drawPipe(ctx, 1680 - cam, GROUND_TOP)

      // Enemies
      for (const e of s.enemies) {
        if (!e.alive) continue
        drawEnemy(ctx, e.x - cam, e.y, e.w, e.h, e.flat, s.t)
      }

      // Flag
      drawFlag(ctx, FLAG_X - cam)

      // Player
      const pw = 36, ph = 52
      drawHero(ctx, s.px - cam, s.py, s.face, s.walkPhase, s.onGround, s.vy)

      // HUD
      drawHUD(ctx, s)
    }

    function loop() {
      if (!running) return
      update(); draw()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => { running = false; cancelAnimationFrame(raf) }
  }, [])

  const press = (key: 'left' | 'right' | 'jump', v: boolean) => {
    keysRef.current[key] = v
    if (key === 'jump' && !v) keysRef.current.jumpLatch = false
  }

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: W, margin: '0 auto' }}>
      <canvas
        ref={canvasRef}
        width={W} height={H}
        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12, background: '#87CEEB', touchAction: 'none' }}
      />

      {status !== 'play' && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16,
          background: 'rgba(5,3,12,0.82)', borderRadius: 12, color: '#fff', textAlign: 'center', padding: 20,
        }}>
          <h3 style={{ fontSize: 30, fontWeight: 900, margin: 0 }}>
            {status === 'won' ? '🏁 You Win!' : '💀 Game Over'}
          </h3>
          <p style={{ color: '#A78BFA', margin: 0 }}>
            {status === 'won' ? 'You reached the flag! ' : 'Out of lives. '}
            Final score: <b style={{ color: '#FFD83D' }}>{hud.score}</b>
          </p>
          <button
            onClick={restart}
            style={{
              padding: '12px 28px', borderRadius: 50, border: 'none', cursor: 'pointer',
              fontWeight: 800, fontSize: 15, color: '#fff',
              background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
            }}
          >Play Again</button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, userSelect: 'none' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <CtrlBtn label="◀" onDown={() => press('left', true)} onUp={() => press('left', false)} />
          <CtrlBtn label="▶" onDown={() => press('right', true)} onUp={() => press('right', false)} />
        </div>
        <CtrlBtn label="JUMP" wide onDown={() => press('jump', true)} onUp={() => press('jump', false)} />
      </div>
      <p style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: '#8B8BAA' }}>
        Arrow keys / A·D · Space / W to jump · Stomp enemies · Grab coins · Reach the flag 🏁
      </p>
    </div>
  )
}

function CtrlBtn({ label, wide, onDown, onUp }: { label: string; wide?: boolean; onDown: () => void; onUp: () => void }) {
  return (
    <button
      onMouseDown={e => { e.preventDefault(); onDown() }}
      onMouseUp={e => { e.preventDefault(); onUp() }}
      onMouseLeave={onUp}
      onTouchStart={e => { e.preventDefault(); onDown() }}
      onTouchEnd={e => { e.preventDefault(); onUp() }}
      style={{
        minWidth: wide ? 96 : 56, height: 56, borderRadius: 14, cursor: 'pointer',
        border: '1px solid rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.18)',
        color: '#fff', fontSize: 18, fontWeight: 800, touchAction: 'none',
      }}
    >{label}</button>
  )
}

/* ════════════════════════════════════════════
   VISUAL DRAW FUNCTIONS
════════════════════════════════════════════ */

function drawSky(ctx: CanvasRenderingContext2D, t: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0,    '#3A6EA8')
  grad.addColorStop(0.25, '#5B8EC9')
  grad.addColorStop(0.55, '#AAD4EE')
  grad.addColorStop(0.78, '#D8EDCF')
  grad.addColorStop(0.92, '#EAF3DC')
  grad.addColorStop(1,    '#C0D8B8')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // Sun glow near horizon
  const sunGrad = ctx.createRadialGradient(W * 0.75, H * 0.72, 0, W * 0.75, H * 0.72, 200)
  sunGrad.addColorStop(0,   'rgba(255,240,180,0.35)')
  sunGrad.addColorStop(0.5, 'rgba(255,220,120,0.12)')
  sunGrad.addColorStop(1,   'rgba(255,200,80,0)')
  ctx.fillStyle = sunGrad
  ctx.fillRect(0, 0, W, H)
}

function drawMountains(ctx: CanvasRenderingContext2D, cam: number, t: number) {
  // ── Layer 1: very far, icy grey-blue ──
  const off1 = (cam * 0.04) % 900
  for (let i = -1; i < 5; i++) {
    const mx = i * 340 - off1 + 60
    ctx.fillStyle = '#C8D8E8'
    ctx.beginPath()
    ctx.moveTo(mx - 180, GROUND_TOP + 10)
    ctx.lineTo(mx - 20, GROUND_TOP - 200)
    ctx.lineTo(mx + 30, GROUND_TOP - 185)
    ctx.lineTo(mx + 200, GROUND_TOP + 10)
    ctx.closePath()
    ctx.fill()
    // Snow cap
    ctx.fillStyle = 'rgba(245,252,255,0.85)'
    ctx.beginPath()
    ctx.moveTo(mx - 38, GROUND_TOP - 155)
    ctx.lineTo(mx - 20, GROUND_TOP - 200)
    ctx.lineTo(mx + 30, GROUND_TOP - 185)
    ctx.lineTo(mx + 10, GROUND_TOP - 140)
    ctx.closePath()
    ctx.fill()
  }

  // ── Layer 2: mid distance, blue-green ──
  const off2 = (cam * 0.09) % 720
  for (let i = -1; i < 6; i++) {
    const mx = i * 270 - off2 + 150
    ctx.fillStyle = '#8AAEC0'
    ctx.beginPath()
    ctx.moveTo(mx - 160, GROUND_TOP + 8)
    ctx.lineTo(mx + 10, GROUND_TOP - 155)
    ctx.lineTo(mx + 180, GROUND_TOP + 8)
    ctx.closePath()
    ctx.fill()
    // Lighter face
    ctx.fillStyle = 'rgba(200,220,235,0.5)'
    ctx.beginPath()
    ctx.moveTo(mx - 20, GROUND_TOP + 8)
    ctx.lineTo(mx + 10, GROUND_TOP - 155)
    ctx.lineTo(mx + 60, GROUND_TOP - 80)
    ctx.closePath()
    ctx.fill()
  }

  // ── Layer 3: closer, forested green ──
  const off3 = (cam * 0.16) % 580
  for (let i = -1; i < 7; i++) {
    const mx = i * 220 - off3 + 100
    ctx.fillStyle = '#5A8A48'
    ctx.beginPath()
    ctx.moveTo(mx - 140, GROUND_TOP + 5)
    ctx.lineTo(mx, GROUND_TOP - 120)
    ctx.lineTo(mx + 150, GROUND_TOP + 5)
    ctx.closePath()
    ctx.fill()
    // Tree tips
    for (let tx = -90; tx < 120; tx += 28) {
      ctx.fillStyle = '#3A6830'
      ctx.beginPath()
      ctx.moveTo(mx + tx - 10, GROUND_TOP - 60 + Math.abs(tx) * 0.5)
      ctx.lineTo(mx + tx, GROUND_TOP - 85 + Math.abs(tx) * 0.4)
      ctx.lineTo(mx + tx + 10, GROUND_TOP - 60 + Math.abs(tx) * 0.5)
      ctx.closePath()
      ctx.fill()
    }
  }
}

function drawClouds(ctx: CanvasRenderingContext2D, cam: number, t: number) {
  const defs = [
    { seed: 0, scale: 1.4, yBase: 52 },
    { seed: 200, scale: 1.0, yBase: 72 },
    { seed: 420, scale: 1.6, yBase: 38 },
    { seed: 650, scale: 0.9, yBase: 88 },
    { seed: 880, scale: 1.2, yBase: 60 },
    { seed: 1100, scale: 0.8, yBase: 45 },
    { seed: 1300, scale: 1.3, yBase: 75 },
  ]
  for (const d of defs) {
    const cx = ((d.seed - cam * 0.35) % (W + 300) + W + 300) % (W + 300) - 80
    puffyCloud(ctx, cx, d.yBase, d.scale)
  }
}

function puffyCloud(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  const blobs = [
    [0, 0, 36], [-34, 12, 28], [34, 10, 30],
    [-58, 22, 22], [58, 20, 24],
    [-18, -18, 22], [20, -15, 24],
    [0, -30, 18],
  ] as [number, number, number][]

  // Base white fill
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.beginPath()
  for (const [bx, by, r] of blobs) {
    ctx.moveTo(bx + r, by)
    ctx.arc(bx, by, r, 0, Math.PI * 2)
  }
  ctx.fill()

  // Subtle blue-grey shadow on bottom
  const shadow = ctx.createLinearGradient(0, -35, 0, 40)
  shadow.addColorStop(0, 'rgba(180,210,240,0)')
  shadow.addColorStop(1, 'rgba(160,195,230,0.28)')
  ctx.fillStyle = shadow
  ctx.beginPath()
  for (const [bx, by, r] of blobs) {
    ctx.moveTo(bx + r, by)
    ctx.arc(bx, by, r, 0, Math.PI * 2)
  }
  ctx.fill()
  ctx.restore()
}

function drawFloatingIslands(ctx: CanvasRenderingContext2D, cam: number) {
  const islands = [
    { wx: 900, wy: 210, w: 110, trees: [25, 75] },
    { wx: 1600, wy: 180, w: 90, trees: [20, 60] },
    { wx: 2200, wy: 195, w: 100, trees: [30] },
    { wx: 2900, wy: 165, w: 80, trees: [18] },
  ]
  for (const isl of islands) {
    const ix = isl.wx - cam * 0.55
    if (ix < -200 || ix > W + 200) continue
    floatingIsland(ctx, ix, isl.wy, isl.w, isl.trees)
  }
}

function floatingIsland(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, treesAt: number[]) {
  // Rocky bottom
  const rockGrad = ctx.createLinearGradient(0, y + 10, 0, y + 55)
  rockGrad.addColorStop(0, '#8B6840')
  rockGrad.addColorStop(1, '#5A3820')
  ctx.fillStyle = rockGrad
  ctx.beginPath()
  ctx.ellipse(x + w / 2, y + 32, w / 2 + 6, 26, 0, 0, Math.PI * 2)
  ctx.fill()
  // Stalactites
  for (let i = 0; i < 4; i++) {
    const sx = x + 10 + i * (w - 20) / 3
    ctx.fillStyle = '#6B4820'
    ctx.beginPath()
    ctx.moveTo(sx - 6, y + 40)
    ctx.lineTo(sx, y + 58)
    ctx.lineTo(sx + 6, y + 40)
    ctx.fill()
  }
  // Grass top
  const grassGrad = ctx.createLinearGradient(0, y, 0, y + 14)
  grassGrad.addColorStop(0, '#5AAB3A')
  grassGrad.addColorStop(1, '#3D8A28')
  ctx.fillStyle = grassGrad
  ctx.beginPath()
  ctx.ellipse(x + w / 2, y + 7, w / 2 + 4, 9, 0, 0, Math.PI * 2)
  ctx.fill()
  // Grass blades
  ctx.fillStyle = '#6CBF48'
  for (let bx = x + 4; bx < x + w - 4; bx += 10) {
    ctx.fillRect(bx, y + 1, 2, 8)
  }
  // Trees
  for (const tx of treesAt) {
    miniTree(ctx, x + tx, y)
  }
}

function miniTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#6B4820'
  ctx.fillRect(x - 3, y - 28, 6, 28)
  // Canopy layers
  const layers: [number, number, number][] = [[x, y - 44, 18], [x - 4, y - 36, 14], [x + 2, y - 58, 14]]
  for (const [lx, ly, r] of layers) {
    ctx.fillStyle = '#2A7020'
    ctx.beginPath()
    ctx.arc(lx, ly, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#3A9030'
    ctx.beginPath()
    ctx.arc(lx - 4, ly - 4, r * 0.5, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawGround(ctx: CanvasRenderingContext2D, gx: number, gy: number, gw: number, gh: number) {
  const tileS = 38
  const grassH = 18

  // Dirt tiles first
  for (let tx = Math.max(0, Math.floor(-gx / tileS)); tx * tileS < gw && gx + tx * tileS < W + tileS; tx++) {
    const rowsOfDirt = Math.ceil((gh - grassH) / (tileS / 2)) + 2
    for (let ty = 0; ty < rowsOfDirt; ty++) {
      const rx = gx + tx * tileS
      const ry = gy + grassH + ty * (tileS / 2)
      if (rx + tileS < 0 || rx > W || ry > H + tileS) continue
      const dirtGrad = ctx.createLinearGradient(rx, ry, rx, ry + tileS / 2)
      dirtGrad.addColorStop(0, '#9E6535')
      dirtGrad.addColorStop(1, '#7A4E28')
      ctx.fillStyle = dirtGrad
      ctx.fillRect(rx + 1, ry + 1, tileS - 2, tileS / 2 - 2)
    }
  }
  // Grid lines
  ctx.strokeStyle = 'rgba(80,40,15,0.45)'
  ctx.lineWidth = 1.5
  for (let tx = Math.floor(-gx / tileS); tx * tileS < gw; tx++) {
    const lx = gx + tx * tileS
    if (lx < 0 || lx > W) continue
    ctx.beginPath(); ctx.moveTo(lx, gy + grassH); ctx.lineTo(lx, gy + gh); ctx.stroke()
  }
  for (let ty = 0; ty * (tileS / 2) < gh - grassH + tileS; ty++) {
    const ly = gy + grassH + ty * (tileS / 2)
    if (ly < gy + grassH || ly > H + 4) continue
    ctx.beginPath(); ctx.moveTo(Math.max(gx, 0), ly); ctx.lineTo(Math.min(gx + gw, W), ly); ctx.stroke()
  }
  // Grass strip
  const grassGrad = ctx.createLinearGradient(0, gy, 0, gy + grassH)
  grassGrad.addColorStop(0, '#5BBF3C')
  grassGrad.addColorStop(0.55, '#4AAA30')
  grassGrad.addColorStop(1, '#3A8A22')
  ctx.fillStyle = grassGrad
  ctx.fillRect(Math.max(gx, -2), gy, Math.min(gw, W - gx + 2), grassH)
  // Grass highlights
  ctx.fillStyle = 'rgba(120,220,80,0.35)'
  for (let bx = Math.max(gx, 0); bx < Math.min(gx + gw, W); bx += 16) {
    ctx.beginPath()
    ctx.ellipse(bx + 4, gy + 4, 5, 3, -0.3, 0, Math.PI)
    ctx.fill()
  }
  // Grass edge shadow
  ctx.fillStyle = 'rgba(0,0,0,0.15)'
  ctx.fillRect(Math.max(gx, 0), gy + grassH, Math.min(gw, W - gx), 4)
}

function drawStonePlatform(ctx: CanvasRenderingContext2D, px: number, py: number, pw: number, ph: number) {
  const stoneW = 38
  const cols = Math.ceil(pw / stoneW) + 1
  for (let i = 0; i < cols; i++) {
    const sx = px + i * stoneW
    if (sx + stoneW < 0 || sx > W) continue
    const sg = ctx.createLinearGradient(sx, py, sx, py + ph)
    sg.addColorStop(0, '#9EB0C0')
    sg.addColorStop(0.4, '#7A8E9C')
    sg.addColorStop(1, '#5A6C78')
    ctx.fillStyle = sg
    ctx.fillRect(sx + 1, py + 1, stoneW - 2, ph - 2)
    // Highlight top
    ctx.fillStyle = 'rgba(200,220,235,0.6)'
    ctx.fillRect(sx + 2, py + 2, stoneW - 4, 3)
    // Shadow bottom
    ctx.fillStyle = 'rgba(20,30,40,0.3)'
    ctx.fillRect(sx + 1, py + ph - 4, stoneW - 2, 3)
  }
  // Border
  ctx.strokeStyle = '#4A5C68'
  ctx.lineWidth = 1.5
  ctx.strokeRect(px, py, pw, ph)
  // Top highlight line
  ctx.strokeStyle = 'rgba(220,235,245,0.7)'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(px + 1, py + 1); ctx.lineTo(px + pw - 1, py + 1); ctx.stroke()
}

function drawCrate(ctx: CanvasRenderingContext2D, bx: number, by: number, bw: number, bh: number, t: number) {
  if (bx + bw < 0 || bx > W) return
  // Slight bob animation
  const bob = Math.sin(t * 0.05) * 1.5
  const y = by + bob

  // Main crate body
  const woodGrad = ctx.createLinearGradient(bx, y, bx, y + bh)
  woodGrad.addColorStop(0, '#C87840')
  woodGrad.addColorStop(0.5, '#A85820')
  woodGrad.addColorStop(1, '#8B4818')
  ctx.fillStyle = woodGrad
  ctx.fillRect(bx + 1, y + 1, bw - 2, bh - 2)

  // Wood planks (horizontal grain)
  ctx.strokeStyle = 'rgba(80,30,10,0.4)'
  ctx.lineWidth = 1
  for (let py2 = 10; py2 < bh - 4; py2 += 10) {
    ctx.beginPath(); ctx.moveTo(bx + 2, y + py2); ctx.lineTo(bx + bw - 2, y + py2); ctx.stroke()
  }

  // X cross
  ctx.strokeStyle = '#6B3010'
  ctx.lineWidth = 2.5
  ctx.beginPath(); ctx.moveTo(bx + 5, y + 5); ctx.lineTo(bx + bw - 5, y + bh - 5); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(bx + bw - 5, y + 5); ctx.lineTo(bx + 5, y + bh - 5); ctx.stroke()

  // Corner nails
  ctx.fillStyle = '#4A2808'
  const nailPositions = [[bx+5, y+5], [bx+bw-5, y+5], [bx+5, y+bh-5], [bx+bw-5, y+bh-5]]
  for (const [nx, ny] of nailPositions) {
    ctx.beginPath(); ctx.arc(nx, ny, 3, 0, Math.PI * 2); ctx.fill()
  }

  // Outline
  ctx.strokeStyle = '#3A1808'
  ctx.lineWidth = 2
  ctx.strokeRect(bx + 1, y + 1, bw - 2, bh - 2)
  // Top highlight
  ctx.fillStyle = 'rgba(255,200,140,0.35)'
  ctx.fillRect(bx + 3, y + 3, bw - 6, 5)
}

function drawCoin(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  const spin = Math.abs(Math.cos(t * 0.1 + x * 0.01))
  const r = 10
  const coinW = spin * r + 1.5
  ctx.save()
  ctx.translate(x, y)

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)'
  ctx.beginPath()
  ctx.ellipse(0, r + 4, coinW * 0.7, 3, 0, 0, Math.PI * 2)
  ctx.fill()

  // Coin body
  const cGrad = ctx.createRadialGradient(-coinW * 0.3, -r * 0.3, 1, 0, 0, r + 2)
  cGrad.addColorStop(0, '#FFE97A')
  cGrad.addColorStop(0.5, '#FFC107')
  cGrad.addColorStop(1, '#E09000')
  ctx.fillStyle = cGrad
  ctx.beginPath()
  ctx.ellipse(0, 0, coinW, r, 0, 0, Math.PI * 2)
  ctx.fill()

  // Dollar/star mark
  if (spin > 0.5) {
    ctx.fillStyle = 'rgba(180,100,0,0.6)'
    ctx.font = `bold ${Math.floor(r * 1.1)}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('$', 0, 1)
  }

  // Shine
  ctx.fillStyle = 'rgba(255,255,200,0.55)'
  ctx.beginPath()
  ctx.ellipse(-coinW * 0.2, -r * 0.3, coinW * 0.25, r * 0.3, -0.4, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawPipe(ctx: CanvasRenderingContext2D, px: number, groundY: number) {
  if (px + 70 < 0 || px > W) return
  const pipeH = 90
  const pipeW = 64
  const topH = 20

  // Body
  const bodyGrad = ctx.createLinearGradient(px, 0, px + pipeW, 0)
  bodyGrad.addColorStop(0, '#006800')
  bodyGrad.addColorStop(0.3, '#00B000')
  bodyGrad.addColorStop(0.7, '#008800')
  bodyGrad.addColorStop(1, '#004800')
  ctx.fillStyle = bodyGrad
  ctx.fillRect(px + 5, groundY - pipeH + topH, pipeW - 10, pipeH)

  // Pipe top cap
  const topGrad = ctx.createLinearGradient(px, 0, px + pipeW, 0)
  topGrad.addColorStop(0, '#004A00')
  topGrad.addColorStop(0.25, '#00D000')
  topGrad.addColorStop(0.75, '#00A000')
  topGrad.addColorStop(1, '#003000')
  ctx.fillStyle = topGrad
  ctx.fillRect(px, groundY - pipeH, pipeW, topH + 4)

  // Highlight
  ctx.fillStyle = 'rgba(180,255,180,0.25)'
  ctx.fillRect(px + 10, groundY - pipeH + 3, 12, pipeH + topH - 6)
  // Dark right edge
  ctx.fillStyle = 'rgba(0,0,0,0.25)'
  ctx.fillRect(px + pipeW - 12, groundY - pipeH, 7, pipeH + topH)
}

function drawEnemy(ctx: CanvasRenderingContext2D, ex: number, ey: number, ew: number, eh: number, flat: boolean, t: number) {
  if (ex + ew < 0 || ex > W) return
  const cx = ex + ew / 2
  const cy = ey + eh / 2

  if (flat) {
    // Squished mushroom
    ctx.fillStyle = '#7A3800'
    ctx.beginPath()
    ctx.ellipse(cx, ey + eh - 8, ew / 2, 9, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#A05000'
    ctx.beginPath()
    ctx.ellipse(cx - 4, ey + eh - 8, 5, 5, 0, 0, Math.PI * 2)
    ctx.fill()
    return
  }

  const legSwing = Math.sin(t * 0.18) * 5

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.18)'
  ctx.beginPath()
  ctx.ellipse(cx, ey + eh + 2, ew * 0.45, 5, 0, 0, Math.PI * 2)
  ctx.fill()

  // Feet
  ctx.fillStyle = '#2A1800'
  ctx.beginPath()
  ctx.ellipse(cx - 8 + legSwing, ey + eh - 2, 8, 6, 0.3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + 8 - legSwing, ey + eh - 2, 8, 6, -0.3, 0, Math.PI * 2)
  ctx.fill()

  // Cap (brown mushroom body)
  const capGrad = ctx.createRadialGradient(cx - 5, ey + 8, 2, cx, ey + 12, ew * 0.5)
  capGrad.addColorStop(0, '#C87840')
  capGrad.addColorStop(0.5, '#A05828')
  capGrad.addColorStop(1, '#6A3010')
  ctx.fillStyle = capGrad
  ctx.beginPath()
  ctx.ellipse(cx, ey + eh * 0.45, ew * 0.5, eh * 0.55, 0, 0, Math.PI * 2)
  ctx.fill()

  // Dark spots on cap
  ctx.fillStyle = 'rgba(60,20,0,0.35)'
  ctx.beginPath(); ctx.ellipse(cx - 8, ey + 12, 6, 5, -0.3, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(cx + 9, ey + 10, 5, 4, 0.3, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(cx, ey + 6, 4, 3, 0, 0, Math.PI * 2); ctx.fill()

  // Face area (cream)
  ctx.fillStyle = '#F0D8A0'
  ctx.beginPath()
  ctx.ellipse(cx, ey + eh * 0.68, ew * 0.38, eh * 0.26, 0, 0, Math.PI * 2)
  ctx.fill()

  // Angry eyes
  ctx.fillStyle = '#1A0A00'
  ctx.beginPath(); ctx.ellipse(cx - 7, ey + eh * 0.58, 4, 5, -0.2, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(cx + 7, ey + eh * 0.58, 4, 5, 0.2, 0, Math.PI * 2); ctx.fill()
  // White glints
  ctx.fillStyle = '#fff'
  ctx.beginPath(); ctx.ellipse(cx - 8, ey + eh * 0.55, 1.5, 2, 0, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(cx + 6, ey + eh * 0.55, 1.5, 2, 0, 0, Math.PI * 2); ctx.fill()
  // Angry brow
  ctx.strokeStyle = '#1A0A00'
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(cx - 12, ey + eh * 0.46); ctx.lineTo(cx - 3, ey + eh * 0.52); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(cx + 12, ey + eh * 0.46); ctx.lineTo(cx + 3, ey + eh * 0.52); ctx.stroke()
}

function drawHero(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  face: 1 | -1, walkPhase: number, onGround: boolean, vy: number
) {
  // Classic plumber-hero archetype: red cap, blue overalls, mustache, gloves, boots.
  ctx.save()
  ctx.translate(x + 18, y + 52) // pivot at feet
  if (face === -1) ctx.scale(-1, 1)
  ctx.scale(1.15, 0.92) // short and stout like classic Mario

  // Palette
  const RED = '#E22B22', RED_D = '#A8170F', RED_HL = '#FF5A4A'
  const BLUE = '#2A52C8', BLUE_D = '#1A3690', BLUE_HL = '#4A78E8'
  const SKIN = '#F8C088', SKIN_D = '#E09A5A'
  const BROWN = '#6B3A12', SHOE = '#5A2E10', SHOE_HL = '#8B4A1E'
  const WHITE = '#FCFCFC'

  const legAngle = onGround ? Math.sin(walkPhase * Math.PI * 2) * 22 : 16
  const armAngle = onGround ? Math.sin(walkPhase * Math.PI * 2) * 16 : 28

  // Ground shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)'
  ctx.beginPath(); ctx.ellipse(0, 2, 16, 4, 0, 0, Math.PI * 2); ctx.fill()

  // ── Back leg (overall + boot) ──
  ctx.save()
  ctx.translate(-5, -12)
  ctx.rotate((-legAngle * Math.PI) / 180)
  ctx.fillStyle = BLUE_D
  ctx.beginPath(); ctx.roundRect(-5, 0, 10, 16, 3); ctx.fill()
  ctx.fillStyle = SHOE
  ctx.beginPath(); ctx.roundRect(-7, 13, 15, 8, [3, 5, 4, 4]); ctx.fill()
  ctx.restore()

  // ── Back arm (red sleeve + glove) ──
  ctx.save()
  ctx.translate(-13, -42)
  ctx.rotate((armAngle * Math.PI) / 180)
  ctx.fillStyle = RED_D
  ctx.beginPath(); ctx.roundRect(-5, 0, 9, 15, 4); ctx.fill()
  ctx.fillStyle = '#E0E0E0'
  ctx.beginPath(); ctx.arc(0, 17, 5, 0, Math.PI * 2); ctx.fill()
  ctx.restore()

  // ── Torso: red shirt ──
  const shirtGrad = ctx.createLinearGradient(-15, -48, 15, -48)
  shirtGrad.addColorStop(0, RED_D)
  shirtGrad.addColorStop(0.4, RED)
  shirtGrad.addColorStop(0.5, RED_HL)
  shirtGrad.addColorStop(0.6, RED)
  shirtGrad.addColorStop(1, RED_D)
  ctx.fillStyle = shirtGrad
  ctx.beginPath(); ctx.roundRect(-15, -50, 30, 30, [8, 8, 4, 4]); ctx.fill()

  // ── Overalls (blue) over the shirt ──
  ctx.fillStyle = BLUE
  // lower bib / pants block
  ctx.beginPath(); ctx.roundRect(-15, -34, 30, 16, [3, 3, 4, 4]); ctx.fill()
  // bib center going up
  ctx.beginPath(); ctx.roundRect(-9, -48, 18, 16, 3); ctx.fill()
  // overall highlight
  ctx.fillStyle = BLUE_HL
  ctx.fillRect(-9, -48, 4, 28)
  ctx.fillStyle = BLUE_D
  ctx.fillRect(11, -34, 4, 14)
  // straps
  ctx.fillStyle = BLUE
  ctx.fillRect(-12, -50, 5, 16)
  ctx.fillRect(7, -50, 5, 16)
  // gold buttons
  ctx.fillStyle = '#FFD83D'
  ctx.beginPath(); ctx.arc(-6, -34, 2.6, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(6, -34, 2.6, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#C89000'
  ctx.beginPath(); ctx.arc(-6, -33, 1, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(6, -33, 1, 0, Math.PI * 2); ctx.fill()

  // ── Front leg (overall + boot) ──
  ctx.save()
  ctx.translate(5, -12)
  ctx.rotate((legAngle * Math.PI) / 180)
  const legGrad = ctx.createLinearGradient(-5, 0, 5, 0)
  legGrad.addColorStop(0, BLUE)
  legGrad.addColorStop(1, BLUE_HL)
  ctx.fillStyle = legGrad
  ctx.beginPath(); ctx.roundRect(-5, 0, 11, 16, 3); ctx.fill()
  // boot
  ctx.fillStyle = BROWN
  ctx.beginPath(); ctx.roundRect(-7, 13, 16, 8, [3, 6, 4, 4]); ctx.fill()
  ctx.fillStyle = SHOE_HL
  ctx.beginPath(); ctx.roundRect(-6, 13, 14, 3, 2); ctx.fill()
  ctx.restore()

  // ── Front arm (red sleeve + white glove) ──
  ctx.save()
  ctx.translate(14, -42)
  ctx.rotate((-armAngle * Math.PI) / 180)
  const sleeveGrad = ctx.createLinearGradient(-5, 0, 5, 0)
  sleeveGrad.addColorStop(0, RED)
  sleeveGrad.addColorStop(1, RED_HL)
  ctx.fillStyle = sleeveGrad
  ctx.beginPath(); ctx.roundRect(-4, 0, 9, 15, 4); ctx.fill()
  // white glove
  ctx.fillStyle = WHITE
  ctx.beginPath(); ctx.arc(1, 17, 5.5, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = '#C8C8C8'; ctx.lineWidth = 0.8
  ctx.beginPath(); ctx.arc(1, 17, 5.5, 0, Math.PI * 2); ctx.stroke()
  ctx.restore()

  // ── Head ──
  ctx.fillStyle = SKIN
  ctx.fillRect(-4, -56, 9, 8) // neck

  const headGrad = ctx.createRadialGradient(-3, -68, 2, 0, -66, 15)
  headGrad.addColorStop(0, '#FCD0A0')
  headGrad.addColorStop(1, SKIN_D)
  ctx.fillStyle = headGrad
  ctx.beginPath(); ctx.ellipse(1, -66, 14, 14, 0, 0, Math.PI * 2); ctx.fill()

  // Big rounded nose (front of face)
  ctx.fillStyle = SKIN
  ctx.beginPath(); ctx.ellipse(11, -63, 6, 5, 0, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = SKIN_D
  ctx.beginPath(); ctx.ellipse(12, -61, 3, 2.5, 0, 0, Math.PI * 2); ctx.fill()

  // Sideburn / hair at back
  ctx.fillStyle = BROWN
  ctx.beginPath(); ctx.ellipse(-11, -62, 5, 8, 0.2, 0, Math.PI * 2); ctx.fill()
  ctx.fillRect(-13, -66, 6, 10)
  // Ear
  ctx.fillStyle = SKIN
  ctx.beginPath(); ctx.ellipse(-9, -62, 4, 5, 0, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = SKIN_D
  ctx.beginPath(); ctx.ellipse(-9, -61, 1.5, 2.5, 0, 0, Math.PI * 2); ctx.fill()

  // Eye (white + pupil)
  ctx.fillStyle = WHITE
  ctx.beginPath(); ctx.ellipse(4, -70, 3.5, 5, 0, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#1A2A6A'
  ctx.beginPath(); ctx.ellipse(5.5, -70, 1.6, 3, 0, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = WHITE
  ctx.beginPath(); ctx.arc(6, -71.5, 0.8, 0, Math.PI * 2); ctx.fill()
  // Eyebrow
  ctx.fillStyle = BROWN
  ctx.beginPath(); ctx.roundRect(1, -77, 7, 2.4, 1); ctx.fill()

  // ── Mustache (signature look) ──
  ctx.fillStyle = BROWN
  ctx.beginPath()
  ctx.moveTo(-2, -58)
  ctx.quadraticCurveTo(2, -55, 14, -58)   // top edge
  ctx.quadraticCurveTo(16, -54, 12, -53)  // right wing down
  ctx.quadraticCurveTo(6, -55, 3, -54)
  ctx.quadraticCurveTo(0, -53, -3, -55)   // left under
  ctx.closePath()
  ctx.fill()
  // mustache shading
  ctx.fillStyle = '#4A2608'
  ctx.beginPath(); ctx.ellipse(8, -55.5, 4, 1.6, -0.1, 0, Math.PI * 2); ctx.fill()

  // ── Cap ──
  // brim (points forward)
  ctx.fillStyle = RED_D
  ctx.beginPath()
  ctx.moveTo(2, -76)
  ctx.quadraticCurveTo(18, -78, 22, -72)
  ctx.quadraticCurveTo(16, -71, 4, -73)
  ctx.closePath()
  ctx.fill()
  // crown
  const capGrad = ctx.createLinearGradient(-14, -90, 10, -76)
  capGrad.addColorStop(0, RED)
  capGrad.addColorStop(0.5, RED_HL)
  capGrad.addColorStop(1, RED_D)
  ctx.fillStyle = capGrad
  ctx.beginPath()
  ctx.ellipse(0, -78, 15, 11, 0, Math.PI, 0, true)
  ctx.fill()
  ctx.beginPath(); ctx.roundRect(-15, -80, 30, 6, 3); ctx.fill()
  // cap shine
  ctx.fillStyle = 'rgba(255,255,255,0.25)'
  ctx.beginPath(); ctx.ellipse(-4, -85, 5, 3, -0.4, 0, Math.PI * 2); ctx.fill()

  // Cap emblem — white circle with WeThink "W"
  ctx.fillStyle = WHITE
  ctx.beginPath(); ctx.arc(2, -82, 6, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = RED
  ctx.font = 'bold 8px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('W', 2, -81.5)

  ctx.restore()
}

function drawFlag(ctx: CanvasRenderingContext2D, fx: number) {
  if (fx + 60 < 0 || fx > W + 60) return
  // Pole
  const poleGrad = ctx.createLinearGradient(fx, 0, fx + 8, 0)
  poleGrad.addColorStop(0, '#AAAAAA')
  poleGrad.addColorStop(0.5, '#EEEEEE')
  poleGrad.addColorStop(1, '#888888')
  ctx.fillStyle = poleGrad
  ctx.fillRect(fx, 130, 8, GROUND_TOP - 130)

  // Flag
  const flagGrad = ctx.createLinearGradient(fx + 8, 140, fx + 65, 160)
  flagGrad.addColorStop(0, '#28C850')
  flagGrad.addColorStop(1, '#1A9438')
  ctx.fillStyle = flagGrad
  ctx.beginPath()
  ctx.moveTo(fx + 8, 140)
  ctx.lineTo(fx + 65, 158)
  ctx.lineTo(fx + 8, 176)
  ctx.closePath()
  ctx.fill()
  // Flag shine
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.beginPath()
  ctx.moveTo(fx + 8, 140)
  ctx.lineTo(fx + 65, 158)
  ctx.lineTo(fx + 8, 155)
  ctx.closePath()
  ctx.fill()

  // Ball on top
  const ballGrad = ctx.createRadialGradient(fx + 4, 127, 1, fx + 4, 130, 10)
  ballGrad.addColorStop(0, '#FFE878')
  ballGrad.addColorStop(1, '#C8A000')
  ctx.fillStyle = ballGrad
  ctx.beginPath(); ctx.arc(fx + 4, 130, 10, 0, Math.PI * 2); ctx.fill()
}

function drawHUD(ctx: CanvasRenderingContext2D, s: GameState) {
  // Dark top bar
  const hudGrad = ctx.createLinearGradient(0, 0, 0, 44)
  hudGrad.addColorStop(0, 'rgba(15,18,28,0.88)')
  hudGrad.addColorStop(1, 'rgba(10,14,22,0.76)')
  ctx.fillStyle = hudGrad
  ctx.fillRect(0, 0, W, 44)

  // Bottom separator
  ctx.strokeStyle = 'rgba(100,130,180,0.3)'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(0, 44); ctx.lineTo(W, 44); ctx.stroke()

  ctx.textBaseline = 'middle'
  ctx.font = 'bold 11px "Courier New", monospace'

  // SCORE
  ctx.fillStyle = '#8AA8CC'
  ctx.textAlign = 'left'
  ctx.fillText('SCORE', 18, 13)
  ctx.font = 'bold 15px "Courier New", monospace'
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(String(s.score).padStart(6, '0'), 18, 32)

  // COINS (center-left)
  ctx.font = 'bold 11px "Courier New", monospace'
  ctx.fillStyle = '#8AA8CC'
  ctx.textAlign = 'center'
  ctx.fillText('COINS', W * 0.35, 13)
  // Coin icon
  ctx.fillStyle = '#FFD020'
  ctx.beginPath(); ctx.arc(W * 0.35 - 22, 32, 7, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#C89000'
  ctx.font = 'bold 9px serif'
  ctx.fillText('$', W * 0.35 - 22, 32)
  ctx.font = 'bold 15px "Courier New", monospace'
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText('×' + String(s.coins.filter(c => c.got).length).padStart(2, '0'), W * 0.35 + 6, 32)

  // TIME (center)
  ctx.font = 'bold 11px "Courier New", monospace'
  ctx.fillStyle = s.timeLeft < 60 ? '#FF6060' : '#8AA8CC'
  ctx.textAlign = 'center'
  ctx.fillText('TIME', W * 0.62, 13)
  ctx.font = 'bold 15px "Courier New", monospace'
  ctx.fillStyle = s.timeLeft < 60 ? '#FF8080' : '#FFFFFF'
  ctx.fillText(String(Math.max(0, s.timeLeft)).padStart(3, '0'), W * 0.62, 32)

  // LIFE (right)
  ctx.font = 'bold 11px "Courier New", monospace'
  ctx.fillStyle = '#8AA8CC'
  ctx.textAlign = 'right'
  ctx.fillText('LIFE', W - 70, 13)
  // Heart icons
  for (let i = 0; i < Math.max(0, s.lives); i++) {
    ctx.fillStyle = '#FF4060'
    ctx.font = '14px serif'
    ctx.textAlign = 'right'
    ctx.fillText('♥', W - 16 - i * 18, 32)
  }

  // Music + Pause buttons (top-right decorative)
  const btnY = 6, btnR = 14
  drawHUDBtn(ctx, W - 38, btnY, btnR, '♪')
  drawHUDBtn(ctx, W - 16, btnY, btnR, '⏸')

  ctx.textBaseline = 'alphabetic'
}

function drawHUDBtn(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, label: string) {
  ctx.fillStyle = 'rgba(60,80,130,0.6)'
  ctx.strokeStyle = 'rgba(100,140,220,0.5)'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.roundRect(x - r, y, r * 2, r * 2, 5); ctx.fill(); ctx.stroke()
  ctx.fillStyle = 'rgba(200,220,255,0.8)'
  ctx.font = '12px serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, x, y + r)
}
