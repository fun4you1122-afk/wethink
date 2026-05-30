'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/* ── World constants ── */
const W = 800
const H = 450
const GRAVITY = 0.7
const MOVE = 3.4
const JUMP = -13.2
const GROUND_TOP = 392
const FLAG_X = 3120
const WORLD_W = 3300

type Rect = { x: number; y: number; w: number; h: number }
type Enemy = { x: number; y: number; w: number; h: number; vx: number; min: number; max: number; alive: boolean }
type Coin = { x: number; y: number; got: boolean }

type GameState = {
  px: number; py: number; vx: number; vy: number
  onGround: boolean; face: 1 | -1; walk: number
  cam: number; score: number; lives: number
  status: 'play' | 'won' | 'dead'
  t: number
  grounds: Rect[]; platforms: Rect[]; bricks: Rect[]
  enemies: Enemy[]; coins: Coin[]
  spawnX: number; spawnY: number
}

function buildState(): GameState {
  const groundH = H - GROUND_TOP + 60
  const grounds: Rect[] = [
    { x: -40, y: GROUND_TOP, w: 760, h: groundH },     // 0–720
    { x: 840, y: GROUND_TOP, w: 760, h: groundH },     // 840–1600
    { x: 1720, y: GROUND_TOP, w: 1620, h: groundH },   // 1720–end
  ]
  const platforms: Rect[] = [
    { x: 300, y: 300, w: 120, h: 22 },
    { x: 520, y: 232, w: 120, h: 22 },
    { x: 940, y: 300, w: 110, h: 22 },
    { x: 1130, y: 244, w: 110, h: 22 },
    { x: 1340, y: 300, w: 120, h: 22 },
    { x: 1880, y: 300, w: 120, h: 22 },
    { x: 2120, y: 244, w: 110, h: 22 },
    { x: 2430, y: 300, w: 150, h: 22 },
    { x: 2720, y: 250, w: 120, h: 22 },
  ]
  const bricks: Rect[] = [
    { x: 600, y: 250, w: 40, h: 40 },
    { x: 640, y: 250, w: 40, h: 40 },
    { x: 1450, y: 248, w: 40, h: 40 },
    { x: 2300, y: 250, w: 40, h: 40 },
    { x: 2340, y: 250, w: 40, h: 40 },
  ]
  const enemies: Enemy[] = [
    { x: 470, y: GROUND_TOP - 30, w: 30, h: 30, vx: 1.1, min: 430, max: 690, alive: true },
    { x: 1050, y: GROUND_TOP - 30, w: 30, h: 30, vx: 1.2, min: 860, max: 1560, alive: true },
    { x: 1300, y: GROUND_TOP - 30, w: 30, h: 30, vx: -1.2, min: 860, max: 1560, alive: true },
    { x: 1950, y: GROUND_TOP - 30, w: 30, h: 30, vx: 1.3, min: 1740, max: 2280, alive: true },
    { x: 2600, y: GROUND_TOP - 30, w: 30, h: 30, vx: 1.2, min: 2400, max: 2980, alive: true },
  ]
  // Coins: arcs + above platforms
  const coins: Coin[] = []
  const add = (x: number, y: number) => coins.push({ x, y, got: false })
  ;[330, 360, 390].forEach((x) => add(x, 260))
  ;[545, 575, 605].forEach((x) => add(x, 192))
  ;[600, 640].forEach((x) => add(x, 210))
  ;[760, 800].forEach((x) => add(x, 320)) // over the first pit
  ;[965, 995].forEach((x) => add(x, 260))
  ;[1150, 1180].forEach((x) => add(x, 204))
  ;[1360, 1400].forEach((x) => add(x, 260))
  ;[1650, 1690].forEach((x) => add(x, 320)) // over second pit
  ;[1900, 1940].forEach((x) => add(x, 260))
  ;[2140, 2170].forEach((x) => add(x, 204))
  ;[2460, 2500, 2540].forEach((x) => add(x, 260))
  ;[2740, 2780].forEach((x) => add(x, 210))

  return {
    px: 60, py: 330, vx: 0, vy: 0,
    onGround: false, face: 1, walk: 0,
    cam: 0, score: 0, lives: 3, status: 'play', t: 0,
    grounds, platforms, bricks, enemies, coins,
    spawnX: 60, spawnY: 330,
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
  const [hud, setHud] = useState({ score: 0, lives: 3 })

  const restart = useCallback(() => {
    stateRef.current = buildState()
    setStatus('play')
    setHud({ score: 0, lives: 3 })
  }, [])

  /* Input */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (['arrowleft', 'a'].includes(k)) keysRef.current.left = true
      if (['arrowright', 'd'].includes(k)) keysRef.current.right = true
      if (['arrowup', 'w', ' ', 'spacebar'].includes(k)) keysRef.current.jump = true
      if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' ', 'spacebar'].includes(k)) e.preventDefault()
    }
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (['arrowleft', 'a'].includes(k)) keysRef.current.left = false
      if (['arrowright', 'd'].includes(k)) keysRef.current.right = false
      if (['arrowup', 'w', ' ', 'spacebar'].includes(k)) { keysRef.current.jump = false; keysRef.current.jumpLatch = false }
    }
    window.addEventListener('keydown', down, { passive: false })
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [])

  /* Game loop */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf = 0
    let running = true

    const solids = () => {
      const s = stateRef.current
      return [...s.grounds, ...s.platforms, ...s.bricks]
    }

    function update() {
      const s = stateRef.current
      s.t++
      if (s.status !== 'play') return
      const keys = keysRef.current

      // horizontal intent
      s.vx = 0
      if (keys.left) { s.vx = -MOVE; s.face = -1 }
      if (keys.right) { s.vx = MOVE; s.face = 1 }

      // jump (edge-triggered)
      if (keys.jump && s.onGround && !keys.jumpLatch) {
        s.vy = JUMP
        s.onGround = false
        keys.jumpLatch = true
      }

      // gravity
      s.vy = Math.min(s.vy + GRAVITY, 16)

      const all = solids()
      const pw = 28, ph = 38

      // move X + resolve
      s.px += s.vx
      for (const b of all) {
        const p: Rect = { x: s.px, y: s.py, w: pw, h: ph }
        if (aabb(p, b)) {
          if (s.vx > 0) s.px = b.x - pw
          else if (s.vx < 0) s.px = b.x + b.w
          s.vx = 0
        }
      }
      // clamp to world
      if (s.px < 0) s.px = 0
      if (s.px > WORLD_W - pw) s.px = WORLD_W - pw

      // move Y + resolve
      s.py += s.vy
      s.onGround = false
      for (const b of all) {
        const p: Rect = { x: s.px, y: s.py, w: pw, h: ph }
        if (aabb(p, b)) {
          if (s.vy > 0) { s.py = b.y - ph; s.onGround = true; s.vy = 0 }
          else if (s.vy < 0) { s.py = b.y + b.h; s.vy = 0 }
        }
      }

      // walk animation
      if (s.onGround && Math.abs(s.vx) > 0.1) s.walk += 0.25
      else s.walk = 0

      // fell in a pit
      if (s.py > H + 60) {
        loseLife(s)
        return
      }

      // enemies
      for (const e of s.enemies) {
        if (!e.alive) continue
        e.x += e.vx
        if (e.x < e.min || e.x > e.max) e.vx *= -1
        const p: Rect = { x: s.px, y: s.py, w: pw, h: ph }
        const er: Rect = { x: e.x, y: e.y, w: e.w, h: e.h }
        if (aabb(p, er)) {
          const fromTop = s.vy > 0 && s.py + ph - s.vy <= e.y + 8
          if (fromTop) {
            e.alive = false
            s.vy = JUMP * 0.6
            s.score += 100
            setHud({ score: s.score, lives: s.lives })
          } else {
            loseLife(s)
            return
          }
        }
      }

      // coins
      for (const c of s.coins) {
        if (c.got) continue
        if (Math.abs(c.x - (s.px + pw / 2)) < 22 && Math.abs(c.y - (s.py + ph / 2)) < 26) {
          c.got = true
          s.score += 25
          setHud({ score: s.score, lives: s.lives })
        }
      }

      // goal
      if (s.px + pw >= FLAG_X) {
        s.status = 'won'
        setStatus('won')
      }

      // camera
      s.cam = Math.max(0, Math.min(s.px - W / 2 + 14, WORLD_W - W))
    }

    function loseLife(s: GameState) {
      s.lives -= 1
      setHud({ score: s.score, lives: s.lives })
      if (s.lives <= 0) {
        s.status = 'dead'
        setStatus('dead')
      } else {
        s.px = s.spawnX; s.py = s.spawnY; s.vx = 0; s.vy = 0; s.onGround = false
      }
    }

    /* ── Drawing ── */
    function draw() {
      const s = stateRef.current
      const cam = s.cam

      // sky
      const sky = ctx.createLinearGradient(0, 0, 0, H)
      sky.addColorStop(0, '#5C94FC')
      sky.addColorStop(1, '#9FD0FF')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, W, H)

      // parallax hills
      ctx.fillStyle = '#3DA35D'
      for (let i = 0; i < 6; i++) {
        const hx = i * 620 - (cam * 0.3) % 620 - 100
        ctx.beginPath()
        ctx.arc(hx + 160, GROUND_TOP + 20, 130, Math.PI, 0)
        ctx.fill()
      }

      // clouds
      ctx.fillStyle = '#ffffff'
      for (let i = 0; i < 7; i++) {
        const cx = i * 480 - (cam * 0.5) % 480 - 60
        const cy = 60 + (i % 3) * 36
        cloud(ctx, cx, cy)
      }

      // ground
      for (const g of s.grounds) {
        const gx = g.x - cam
        ctx.fillStyle = '#C56A2C'
        ctx.fillRect(gx, g.y + 16, g.w, g.h)
        ctx.fillStyle = '#7BC043'
        ctx.fillRect(gx, g.y, g.w, 18)
        // brick texture
        ctx.strokeStyle = 'rgba(0,0,0,0.12)'
        ctx.lineWidth = 1
        for (let bx = 0; bx < g.w; bx += 32) {
          ctx.beginPath(); ctx.moveTo(gx + bx, g.y + 16); ctx.lineTo(gx + bx, g.y + g.h); ctx.stroke()
        }
      }

      // platforms
      for (const p of s.platforms) {
        const x = p.x - cam
        ctx.fillStyle = '#8B5A2B'
        ctx.fillRect(x, p.y, p.w, p.h)
        ctx.fillStyle = '#B5793C'
        ctx.fillRect(x, p.y, p.w, 6)
        ctx.strokeStyle = 'rgba(0,0,0,0.15)'
        for (let bx = 0; bx < p.w; bx += 30) {
          ctx.strokeRect(x + bx, p.y, 30, p.h)
        }
      }

      // bricks (question blocks)
      for (const b of s.bricks) {
        const x = b.x - cam
        ctx.fillStyle = '#E8A33D'
        ctx.fillRect(x, b.y, b.w, b.h)
        ctx.strokeStyle = '#9C6B1E'
        ctx.lineWidth = 3
        ctx.strokeRect(x + 1.5, b.y + 1.5, b.w - 3, b.h - 3)
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 24px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('?', x + b.w / 2, b.y + b.h - 11)
      }

      // coins
      for (const c of s.coins) {
        if (c.got) continue
        const x = c.x - cam
        const sw = Math.abs(Math.cos(s.t * 0.08 + c.x)) * 13 + 3
        ctx.fillStyle = '#FFD83D'
        ctx.beginPath()
        ctx.ellipse(x, c.y, sw, 14, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#E0A800'
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // enemies
      for (const e of s.enemies) {
        if (!e.alive) continue
        drawEnemy(ctx, e.x - cam, e.y, s.t)
      }

      // flag
      drawFlag(ctx, FLAG_X - cam)

      // player
      drawPlayer(ctx, s.px - cam, s.py, s.face, s.walk, s.onGround)

      // HUD
      ctx.fillStyle = 'rgba(0,0,0,0.45)'
      ctx.fillRect(12, 12, 200, 36)
      ctx.fillStyle = '#FFD83D'
      ctx.font = 'bold 18px monospace'
      ctx.textAlign = 'left'
      ctx.fillText('★ ' + s.score, 24, 37)
      ctx.fillStyle = '#fff'
      ctx.fillText('♥ ' + Math.max(0, s.lives), 130, 37)
    }

    function loop() {
      if (!running) return
      update()
      draw()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => { running = false; cancelAnimationFrame(raf) }
  }, [])

  /* Touch controls */
  const press = (key: 'left' | 'right' | 'jump', v: boolean) => {
    keysRef.current[key] = v
    if (key === 'jump' && !v) keysRef.current.jumpLatch = false
  }

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: W, margin: '0 auto' }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12, imageRendering: 'pixelated', background: '#5C94FC', touchAction: 'none' }}
      />

      {/* Overlays */}
      {status !== 'play' && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16,
          background: 'rgba(5,3,12,0.78)', borderRadius: 12, color: '#fff', textAlign: 'center', padding: 20,
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
          >
            Play Again
          </button>
        </div>
      )}

      {/* Mobile / click controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, userSelect: 'none' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <CtrlBtn label="◀" onDown={() => press('left', true)} onUp={() => press('left', false)} />
          <CtrlBtn label="▶" onDown={() => press('right', true)} onUp={() => press('right', false)} />
        </div>
        <CtrlBtn label="JUMP" wide onDown={() => press('jump', true)} onUp={() => press('jump', false)} />
      </div>
      <p style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: '#8B8BAA' }}>
        Arrow keys / A·D to move · Space / W / ▲ to jump · Stomp enemies, grab coins, reach the flag 🏁
      </p>
    </div>
  )
}

function CtrlBtn({ label, wide, onDown, onUp }: { label: string; wide?: boolean; onDown: () => void; onUp: () => void }) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onDown() }}
      onMouseUp={(e) => { e.preventDefault(); onUp() }}
      onMouseLeave={onUp}
      onTouchStart={(e) => { e.preventDefault(); onDown() }}
      onTouchEnd={(e) => { e.preventDefault(); onUp() }}
      style={{
        minWidth: wide ? 96 : 56, height: 56, borderRadius: 14, cursor: 'pointer',
        border: '1px solid rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.18)',
        color: '#fff', fontSize: 18, fontWeight: 800, touchAction: 'none',
      }}
    >
      {label}
    </button>
  )
}

/* ── Sprite drawing helpers ── */
function cloud(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath()
  ctx.arc(x, y, 18, 0, Math.PI * 2)
  ctx.arc(x + 22, y - 6, 22, 0, Math.PI * 2)
  ctx.arc(x + 46, y, 18, 0, Math.PI * 2)
  ctx.fill()
}

function drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number, face: 1 | -1, walk: number, onGround: boolean) {
  ctx.save()
  ctx.translate(x + 14, y)
  if (face === -1) ctx.scale(-1, 1)
  ctx.translate(-14, 0)
  // legs
  const swing = onGround ? Math.sin(walk) * 4 : -3
  ctx.fillStyle = '#3A2A6B'
  ctx.fillRect(6, 30, 7, 8 + swing)
  ctx.fillRect(15, 30, 7, 8 - swing)
  // body / overalls (WeThink violet)
  ctx.fillStyle = '#7C3AED'
  ctx.fillRect(5, 18, 18, 14)
  // arms
  ctx.fillStyle = '#5B21B6'
  ctx.fillRect(2, 19, 4, 9)
  ctx.fillRect(22, 19, 4, 9)
  // face
  ctx.fillStyle = '#FFD9B3'
  ctx.fillRect(7, 8, 14, 11)
  // cap
  ctx.fillStyle = '#C026D3'
  ctx.fillRect(5, 3, 18, 7)
  ctx.fillRect(16, 6, 9, 4) // brim
  // eye
  ctx.fillStyle = '#1A1030'
  ctx.fillRect(15, 11, 3, 4)
  ctx.restore()
}

function drawEnemy(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  const wig = Math.sin(t * 0.15) * 2
  // body
  ctx.fillStyle = '#A0522D'
  ctx.beginPath()
  ctx.ellipse(x + 15, y + 14, 15, 14, 0, 0, Math.PI * 2)
  ctx.fill()
  // feet
  ctx.fillStyle = '#5C2E15'
  ctx.fillRect(x + 2 + wig, y + 26, 9, 5)
  ctx.fillRect(x + 19 - wig, y + 26, 9, 5)
  // eyes
  ctx.fillStyle = '#fff'
  ctx.fillRect(x + 8, y + 8, 6, 7)
  ctx.fillRect(x + 17, y + 8, 6, 7)
  ctx.fillStyle = '#000'
  ctx.fillRect(x + 10, y + 10, 3, 4)
  ctx.fillRect(x + 19, y + 10, 3, 4)
  // angry brow
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(x + 7, y + 6); ctx.lineTo(x + 14, y + 9); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(x + 24, y + 6); ctx.lineTo(x + 17, y + 9); ctx.stroke()
}

function drawFlag(ctx: CanvasRenderingContext2D, x: number) {
  ctx.fillStyle = '#dddddd'
  ctx.fillRect(x, 150, 6, GROUND_TOP - 150)
  ctx.fillStyle = '#22C55E'
  ctx.beginPath()
  ctx.moveTo(x + 6, 156)
  ctx.lineTo(x + 56, 172)
  ctx.lineTo(x + 6, 188)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#FFD83D'
  ctx.beginPath()
  ctx.arc(x + 3, 150, 7, 0, Math.PI * 2)
  ctx.fill()
}
