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
const SCALE = 3

/* ── NES palette ── */
const C: Record<string, string> = {
  '.': 'transparent',
  r: '#E52521', // red cap/shirt
  R: '#FF6B6B', // light red highlight
  s: '#FAB271', // skin
  S: '#FDD5A0', // light skin
  b: '#621800', // dark brown (hair/eyes/shoes outline)
  u: '#0B4AE2', // blue overalls
  U: '#2A6FF5', // lighter blue
  y: '#FCC800', // yellow
  Y: '#FFE566', // light yellow
  G: '#00A800', // green
  g: '#006600', // dark green
  T: '#C56A2C', // tan/ground brown
  t: '#E8A33D', // lighter tan
  D: '#8B5A2B', // dark platform brown
  N: '#A05800', // goomba brown
  n: '#621800', // goomba dark
  L: '#F0C080', // goomba light
  W: '#FFFFFF', // white
  k: '#000000', // black
  q: '#E8A33D', // ? block gold
  Q: '#F5C842', // ? block light gold
  B: '#B85C00', // brick dark
  c: '#FFD83D', // coin gold
  e: '#FFA500', // coin edge
  p: '#00B800', // pipe green
  P: '#006800', // pipe dark green
  m: '#7C3AED', // mario cap (WeThink violet)
  M: '#A855F7', // mario lighter violet
  o: '#C026D3', // mario accent magenta
}

type SpriteRows = string[]

/* ── Mario sprites (16×16 NES style) ── */
const MARIO_STAND: SpriteRows = [
  '....mmmmmm......',
  '...mmmmmmmmm....',
  '...bbbsss bbb...',
  '..bs sssssbs ...',
  '..bssssssssb....',
  '...ssuussuu.....',
  '...suuuuuuu.....',
  '..bbuuuuuub.....',
  '.b.uuuuuuuu.b...',
  '...uusuuruu.....',
  '...ssussuss.....',
  '...ss...ss......',
  '..bbb...bbb.....',
  '.bbbb...bbbb....',
  '................',
  '................',
]
const MARIO_WALK1: SpriteRows = [
  '....mmmmmm......',
  '...mmmmmmmmm....',
  '...bbbsss bbb...',
  '..bs sssssbs ...',
  '..bssssssssb....',
  '...ssuussuu.....',
  '...suuuuuuu.....',
  '..bbuuuuuub.....',
  '...uuuuuuuu.....',
  '...uusuuruu.....',
  '...ssussuss.....',
  '....ss.ss.......',
  '...bbb.bbb......',
  '..bbbb.bbbb.....',
  '................',
  '................',
]
const MARIO_WALK2: SpriteRows = [
  '....mmmmmm......',
  '...mmmmmmmmm....',
  '...bbbsss bbb...',
  '..bs sssssbs ...',
  '..bssssssssb....',
  '...ssuussuu.....',
  '...suuuuuuu.....',
  '..bbuuuuuub.....',
  '...uuuuuuuu.....',
  '...uusuuruu.....',
  '...ssussuss.....',
  '..ss.....ss.....',
  '.bbb.....bbb....',
  'bbbb.....bbbb...',
  '................',
  '................',
]
const MARIO_JUMP: SpriteRows = [
  '....mmmmmm......',
  '...mmmmmmmmm....',
  '...bbbsss bbb...',
  '..bs sssssbs ...',
  '..bssssssssb....',
  '...ssuussuu.....',
  '...suuuuuuu.....',
  '..bbuuuuuub.....',
  '.b uuuuuuuu b...',
  '.b.uusuuruu.b...',
  '...ssussuss.....',
  '.bbb.....bbb....',
  'bbbb.....bbbb...',
  '................',
  '................',
  '................',
]

/* ── Goomba sprites (16×16) ── */
const GOOMBA_WALK1: SpriteRows = [
  '....NNNNNNNN....',
  '..NNNNNNNNNNNN..',
  '.NNNNnnNNnnNNNN.',
  '.NNNnnNNNNnnNNN.',
  '.NNNnnNNNNnnNNN.',
  '.NNNNnnNNnnNNNN.',
  'NNNNLLNNNNLLnnNN',
  'NNNNLkNNNNLkNNNN',
  'NNNNLLNNNNLLNNNN',
  '.NNNNNNNNNNNNNN.',
  '.NNNNNNNNNNNNNN.',
  'NNNNNNnnnnNNNNNN',
  'NNNNnnnnnnnnNNNN',
  'nnNNNNNNNNNNNNnn',
  'nnNN............',
  '................',
]
const GOOMBA_WALK2: SpriteRows = [
  '....NNNNNNNN....',
  '..NNNNNNNNNNNN..',
  '.NNNNnnNNnnNNNN.',
  '.NNNnnNNNNnnNNN.',
  '.NNNnnNNNNnnNNN.',
  '.NNNNnnNNnnNNNN.',
  'NNNNLLNNNNLLnnNN',
  'NNNNLkNNNNLkNNNN',
  'NNNNLLNNNNLLNNNN',
  '.NNNNNNNNNNNNNN.',
  '.NNNNNNNNNNNNNN.',
  'NNNNNNnnnnNNNNNN',
  'NNNNnnnnnnnnNNNN',
  'nnNNNNNNNNNNNNnn',
  '............nnNN',
  '................',
]
const GOOMBA_FLAT: SpriteRows = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '....NNNNNNNN....',
  '..NNNNNNNNNNNN..',
  'NNNNNNnnnnNNNNNN',
  'NNNNnnnnnnnnNNNN',
  'nnNNNNNNNNNNNNnn',
  'nnNNNNNNNNNNNNnn',
  '................',
  '................',
]

/* ── Tile sprites (16×16) ── */
const GROUND_TILE: SpriteRows = [
  'GGGGGGGGGGGGGGGG',
  'GgGGGgGGGgGGGgGG',
  'GGGGGGGGGGGGGGGg',
  'gGGGGGGGGGGGGGGG',
  'TTTTTTTTTTTTTTTT',
  'TtTTTtTTTtTTTtTT',
  'TTTTTTTTTTTTTTTt',
  'tTTTTTTTTTTTTTTT',
  'TTTTTTTTTTTTTTTT',
  'TtTTTtTTTtTTTtTT',
  'TTTTTTTTTTTTTTTt',
  'tTTTTTTTTTTTTTTT',
  'TTTTTTTTTTTTTTTT',
  'TtTTTtTTTtTTTtTT',
  'TTTTTTTTTTTTTTTt',
  'tTTTTTTTTTTTTTTT',
]
const BRICK_TILE: SpriteRows = [
  'BBBBBBBBBBBBBBBB',
  'BtttttttBttttttB',
  'BtttttttBttttttB',
  'BtttttttBttttttB',
  'BBBBBBBBBBBBBBBB',
  'ttttBBBBtttttBBB',
  'ttttBBBBtttttBBB',
  'ttttBBBBtttttBBB',
  'BBBBBBBBBBBBBBBB',
  'BtttttttBttttttB',
  'BtttttttBttttttB',
  'BtttttttBttttttB',
  'BBBBBBBBBBBBBBBB',
  'ttttBBBBtttttBBB',
  'ttttBBBBtttttBBB',
  'ttttBBBBtttttBBB',
]
const QBLOCK_TILE: SpriteRows = [
  'kkkkkkkkkkkkkkkk',
  'kQQQQQQQQQQQQQk.',
  'kQqqqqqqqqqqqQk.',
  'kQqq...q...qqQk.',
  'kQq....q....qQk.',
  'kQq...qq....qQk.',
  'kQq..qqq....qQk.',
  'kQq..qqq....qQk.',
  'kQq..............'.slice(0, 16),
  'kQq....q....qQk.',
  'kQq....q....qQk.',
  'kQqqqqqqqqqqqQk.',
  'kQQQQQQQQQQQQQk.',
  'kkkkkkkkkkkkkkkk',
  '................',
  '................',
]
const COIN_SPRITE: SpriteRows = [
  '....cccccc......',
  '...ceeccce......',
  '..ceeYYYYce.....',
  '.ceYYYcceYYce...',
  '.ceYYYcceYYce...',
  '.ceYYYcceYYce...',
  '.ceYYYcceYYce...',
  '.ceYYYcceYYce...',
  '.ceYYYcceYYce...',
  '.ceYYYcceYYce...',
  '.ceYYYcceYYce...',
  '..ceeYYYYce.....',
  '...ceeccce......',
  '....cccccc......',
  '................',
  '................',
]

/* ── Pipe sprite (16×32) ── */
const PIPE_TOP: SpriteRows = [
  'kppPPPPPPPPppppk',
  'kpPPPPPPPPPPppkk',
  'kpPPPPPPPPPPppkk',
  'kkkkkkkkkkkkkkkk',
  'kkpPPPPPPPPppkkk',
  'kkpPPPPPPPPppkkk',
  'kkpPPPPPPPPppkkk',
  'kkpPPPPPPPPppkkk',
]

/* ── Cloud sprite (32×20) ── */
const CLOUD_SPRITE: SpriteRows = [
  '........WWWWWWWW................',
  '......WWWWWWWWWWWWWW............',
  '....WWWWWWWWWWWWWWWWWW..........',
  '...WWWWWWWWWWWWWWWWWWWWW........',
  '..WWWWWWWWWWWWWWWWWWWWWWWWWW....',
  '.WWWWWWWWWWWWWWWWWWWWWWWWWWWWW..',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
]

/* ── Hill sprite (40×24) ── */
const HILL_SPRITE: SpriteRows = [
  '..................GG....................',
  '.................GGGG...................',
  '................GGGGGG..................',
  '...............GGGGGgGG.................',
  '..............GGGGGgGGGG................',
  '.............GGGGGGGGGGgG...............',
  '............GGGGGGGGGGGGGg..............',
  '...........GGGGGGGGGGGGGGGG.............',
  '..........GGGGGGgGGGGGGGGGGG............',
  '.........GGGGGGGGGGGGGGGGGGGg...........',
  '........GGGGGGGGGGGGGGGGGGGGGg..........',
  '.......GGGGGGGGGGGGGGGGGGGGGGGg.........',
  '......GGGGGGGGGGGGGGGGGGGGGGGGGg........',
  '.....GGGGGGGGGGGGGGGGGGGGGGGGGGGg.......',
  '....GGGGGGGGGGGGGGGGGGGGGGGGGGGGGg......',
  '...GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGg.....',
  '..GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGg....',
  '.GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGg...',
  'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGg..',
  'GgGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGg.',
  'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGg',
  'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGg',
  'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGg',
  'GgGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGg',
]

/* ── Sprite renderer ── */
const spriteCache: Record<string, HTMLCanvasElement> = {}

function getSprite(name: string, rows: SpriteRows, scale = SCALE, flipX = false): HTMLCanvasElement {
  const key = `${name}_${scale}${flipX ? '_f' : ''}`
  if (spriteCache[key]) return spriteCache[key]
  const cols = rows[0].length
  const h = rows.length
  const offscreen = document.createElement('canvas')
  offscreen.width = cols * scale
  offscreen.height = h * scale
  const cx = offscreen.getContext('2d')!
  cx.imageSmoothingEnabled = false

  for (let row = 0; row < h; row++) {
    for (let col = 0; col < cols; col++) {
      const ch = rows[row][col] ?? '.'
      if (ch === '.') continue
      const color = C[ch]
      if (!color || color === 'transparent') continue
      cx.fillStyle = color
      const drawCol = flipX ? cols - 1 - col : col
      cx.fillRect(drawCol * scale, row * scale, scale, scale)
    }
  }
  spriteCache[key] = offscreen
  return offscreen
}

/* ── Types ── */
type Rect = { x: number; y: number; w: number; h: number }
type Enemy = { x: number; y: number; w: number; h: number; vx: number; min: number; max: number; alive: boolean; flat: boolean; flatTimer: number }
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
    { x: -40, y: GROUND_TOP, w: 760, h: groundH },
    { x: 840, y: GROUND_TOP, w: 760, h: groundH },
    { x: 1720, y: GROUND_TOP, w: 1620, h: groundH },
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
    { x: 470, y: GROUND_TOP - 48, w: 48, h: 48, vx: 1.1, min: 430, max: 690, alive: true, flat: false, flatTimer: 0 },
    { x: 1050, y: GROUND_TOP - 48, w: 48, h: 48, vx: 1.2, min: 860, max: 1560, alive: true, flat: false, flatTimer: 0 },
    { x: 1300, y: GROUND_TOP - 48, w: 48, h: 48, vx: -1.2, min: 860, max: 1560, alive: true, flat: false, flatTimer: 0 },
    { x: 1950, y: GROUND_TOP - 48, w: 48, h: 48, vx: 1.3, min: 1740, max: 2280, alive: true, flat: false, flatTimer: 0 },
    { x: 2600, y: GROUND_TOP - 48, w: 48, h: 48, vx: 1.2, min: 2400, max: 2980, alive: true, flat: false, flatTimer: 0 },
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

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.imageSmoothingEnabled = false
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

      s.vx = 0
      if (keys.left) { s.vx = -MOVE; s.face = -1 }
      if (keys.right) { s.vx = MOVE; s.face = 1 }

      if (keys.jump && s.onGround && !keys.jumpLatch) {
        s.vy = JUMP
        s.onGround = false
        keys.jumpLatch = true
      }

      s.vy = Math.min(s.vy + GRAVITY, 16)

      const all = solids()
      const pw = 48, ph = 48

      s.px += s.vx
      for (const b of all) {
        const p: Rect = { x: s.px, y: s.py, w: pw, h: ph }
        if (aabb(p, b)) {
          if (s.vx > 0) s.px = b.x - pw
          else if (s.vx < 0) s.px = b.x + b.w
          s.vx = 0
        }
      }
      if (s.px < 0) s.px = 0
      if (s.px > WORLD_W - pw) s.px = WORLD_W - pw

      s.py += s.vy
      s.onGround = false
      for (const b of all) {
        const p: Rect = { x: s.px, y: s.py, w: pw, h: ph }
        if (aabb(p, b)) {
          if (s.vy > 0) { s.py = b.y - ph; s.onGround = true; s.vy = 0 }
          else if (s.vy < 0) { s.py = b.y + b.h; s.vy = 0 }
        }
      }

      if (s.onGround && Math.abs(s.vx) > 0.1) s.walk += 0.22
      else s.walk = 0

      if (s.py > H + 60) { loseLife(s); return }

      for (const e of s.enemies) {
        if (!e.alive) continue
        if (e.flat) {
          e.flatTimer--
          if (e.flatTimer <= 0) e.alive = false
          continue
        }
        e.x += e.vx
        if (e.x < e.min || e.x > e.max) e.vx *= -1
        const p: Rect = { x: s.px, y: s.py, w: pw, h: ph }
        const er: Rect = { x: e.x, y: e.y, w: e.w, h: e.h }
        if (aabb(p, er)) {
          const fromTop = s.vy > 0 && s.py + ph - s.vy <= e.y + 10
          if (fromTop) {
            e.flat = true
            e.flatTimer = 40
            s.vy = JUMP * 0.55
            s.score += 100
            setHud({ score: s.score, lives: s.lives })
          } else {
            loseLife(s)
            return
          }
        }
      }

      for (const coin of s.coins) {
        if (coin.got) continue
        if (Math.abs(coin.x - (s.px + pw / 2)) < 28 && Math.abs(coin.y - (s.py + ph / 2)) < 32) {
          coin.got = true
          s.score += 25
          setHud({ score: s.score, lives: s.lives })
        }
      }

      if (s.px + pw >= FLAG_X) {
        s.status = 'won'
        setStatus('won')
      }

      s.cam = Math.max(0, Math.min(s.px - W / 2 + 24, WORLD_W - W))
    }

    function loseLife(s: GameState) {
      s.lives -= 1
      setHud({ score: s.score, lives: s.lives })
      if (s.lives <= 0) { s.status = 'dead'; setStatus('dead') }
      else { s.px = s.spawnX; s.py = s.spawnY; s.vx = 0; s.vy = 0; s.onGround = false }
    }

    /* ── DRAW ── */
    function draw() {
      const s = stateRef.current
      const cam = s.cam

      // Sky gradient (NES blue)
      const sky = ctx.createLinearGradient(0, 0, 0, H)
      sky.addColorStop(0, '#5C94FC')
      sky.addColorStop(1, '#9FC8FF')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, W, H)

      // Clouds (pixel sprite)
      const cloudImg = getSprite('cloud', CLOUD_SPRITE, 2)
      for (let i = 0; i < 7; i++) {
        const cx = ((i * 480 - cam * 0.4) % (W + 200) + W + 200) % (W + 200) - 80
        const cy = 40 + (i % 3) * 30
        ctx.drawImage(cloudImg, cx, cy)
      }

      // Hills (pixel sprite, parallax)
      const hillImg = getSprite('hill', HILL_SPRITE, 2)
      for (let i = 0; i < 5; i++) {
        const hx = ((i * 680 - cam * 0.25) % (W + 300) + W + 300) % (W + 300) - 100
        ctx.drawImage(hillImg, hx, GROUND_TOP - hillImg.height + 4)
      }

      // Ground tiles
      const groundImg = getSprite('ground', GROUND_TILE, SCALE)
      const tileW = 16 * SCALE
      for (const g of s.grounds) {
        const startX = Math.floor((g.x - cam) / tileW) * tileW + (g.x - cam) % tileW
        const tilesNeeded = Math.ceil(g.w / tileW) + 2
        for (let ti = 0; ti < tilesNeeded; ti++) {
          const tx = g.x - cam + ti * tileW
          if (tx + tileW < 0 || tx > W) continue
          // draw ground tiles stacked to fill height
          const rows = Math.ceil(g.h / tileW) + 2
          for (let tr = 0; tr < rows; tr++) {
            ctx.drawImage(groundImg, tx, g.y + tr * tileW)
          }
        }
      }

      // Platforms (brick tiles)
      const brickImg = getSprite('brick', BRICK_TILE, SCALE)
      for (const p of s.platforms) {
        const px = p.x - cam
        const tilesW = Math.ceil(p.w / tileW) + 1
        for (let ti = 0; ti < tilesW; ti++) {
          ctx.drawImage(brickImg, px + ti * tileW, p.y)
        }
      }

      // ? blocks
      const qFrame = Math.floor(s.t / 12) % 4
      const qColors = ['#E8A33D', '#F0B040', '#F5C050', '#E8A33D']
      for (const b of s.bricks) {
        const bx = b.x - cam
        // draw ? block manually (pixel tile + animated glow)
        ctx.fillStyle = qColors[qFrame]
        ctx.fillRect(bx, b.y, b.w, b.h)
        ctx.fillStyle = '#B85C00'
        ctx.fillRect(bx, b.y, b.w, 3)           // top border
        ctx.fillRect(bx, b.y + b.h - 3, b.w, 3) // bottom border
        ctx.fillRect(bx, b.y, 3, b.h)            // left border
        ctx.fillRect(bx + b.w - 3, b.y, 3, b.h)  // right border
        ctx.fillStyle = '#FDD87A'
        ctx.font = 'bold 22px monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('?', bx + b.w / 2, b.y + b.h / 2 + 1)
        ctx.textBaseline = 'alphabetic'
      }

      // Coins (pixel sprite, spinning)
      const coinImg = getSprite('coin', COIN_SPRITE, 2)
      for (const coin of s.coins) {
        if (coin.got) continue
        const cx = coin.x - cam
        const spin = Math.cos(s.t * 0.1 + coin.x * 0.01)
        const scaleX = Math.abs(spin)
        const cw = coinImg.width
        const ch = coinImg.height
        ctx.save()
        ctx.translate(cx, coin.y)
        ctx.scale(scaleX, 1)
        ctx.drawImage(coinImg, -cw / 2, -ch / 2)
        ctx.restore()
      }

      // Pipes (before enemies)
      ctx.fillStyle = '#006800'
      const pipePositions = [880, 1700]
      for (const px of pipePositions) {
        const sx = px - cam
        if (sx < -64 || sx > W + 64) continue
        // pipe body
        ctx.fillStyle = '#00A800'
        ctx.fillRect(sx, GROUND_TOP - 80, 64, 80)
        ctx.fillStyle = '#006800'
        ctx.fillRect(sx + 48, GROUND_TOP - 80, 16, 80)
        // pipe top
        ctx.fillStyle = '#00C800'
        ctx.fillRect(sx - 6, GROUND_TOP - 96, 76, 20)
        ctx.fillStyle = '#008800'
        ctx.fillRect(sx + 54, GROUND_TOP - 96, 16, 20)
      }

      // Enemies
      for (const e of s.enemies) {
        if (!e.alive) continue
        const ex = e.x - cam
        if (ex < -64 || ex > W + 64) continue
        if (e.flat) {
          const flatImg = getSprite('goomba_flat', GOOMBA_FLAT, SCALE)
          ctx.drawImage(flatImg, ex, e.y)
        } else {
          const walkFrame = Math.floor(s.t / 10) % 2
          const gImg = walkFrame === 0
            ? getSprite('goomba_w1', GOOMBA_WALK1, SCALE)
            : getSprite('goomba_w2', GOOMBA_WALK2, SCALE)
          ctx.drawImage(gImg, ex, e.y)
        }
      }

      // Flag
      const flagX = FLAG_X - cam
      ctx.fillStyle = '#CCCCCC'
      ctx.fillRect(flagX, 140, 6, GROUND_TOP - 140)
      ctx.fillStyle = '#22C55E'
      ctx.beginPath()
      ctx.moveTo(flagX + 6, 148)
      ctx.lineTo(flagX + 56, 166)
      ctx.lineTo(flagX + 6, 184)
      ctx.closePath()
      ctx.fill()
      // flag ball
      ctx.fillStyle = '#FFD83D'
      ctx.beginPath()
      ctx.arc(flagX + 3, 140, 8, 0, Math.PI * 2)
      ctx.fill()

      // Player
      const pw = 48, ph = 48
      const sx = s.px - cam
      let playerSprite: SpriteRows
      if (!s.onGround) {
        playerSprite = MARIO_JUMP
      } else if (Math.abs(s.vx) > 0.1) {
        playerSprite = Math.floor(s.walk * 2) % 2 === 0 ? MARIO_WALK1 : MARIO_WALK2
      } else {
        playerSprite = MARIO_STAND
      }
      const flip = s.face === -1
      const mKey = !s.onGround ? 'jump' : Math.abs(s.vx) > 0.1 ? `walk${Math.floor(s.walk * 2) % 2}` : 'stand'
      const mImg = getSprite(`mario_${mKey}${flip ? '_l' : '_r'}`, playerSprite, SCALE, flip)
      ctx.drawImage(mImg, sx, s.py)

      // HUD — NES style bar
      drawHUD(ctx, s)
    }

    function drawHUD(ctx: CanvasRenderingContext2D, s: GameState) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.fillRect(0, 0, W, 44)

      ctx.font = 'bold 14px "Courier New", monospace'
      ctx.textBaseline = 'middle'

      // MARIO label + score
      ctx.fillStyle = '#AAAAAA'
      ctx.textAlign = 'left'
      ctx.fillText('MARIO', 16, 14)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillText(String(s.score).padStart(6, '0'), 16, 32)

      // Coins
      ctx.fillStyle = '#AAAAAA'
      ctx.textAlign = 'center'
      ctx.fillText('COINS', W / 2, 14)
      ctx.fillStyle = '#FFD83D'
      ctx.fillText('× ' + s.coins.filter(c => c.got).length, W / 2, 32)

      // Lives
      ctx.fillStyle = '#AAAAAA'
      ctx.textAlign = 'right'
      ctx.fillText('LIVES', W - 16, 14)
      ctx.fillStyle = '#FF6B6B'
      ctx.fillText('♥ ' + Math.max(0, s.lives), W - 16, 32)

      ctx.textBaseline = 'alphabetic'
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
        style={{
          width: '100%', height: 'auto', display: 'block',
          borderRadius: 12, imageRendering: 'pixelated',
          background: '#5C94FC', touchAction: 'none',
        }}
      />

      {status !== 'play' && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16,
          background: 'rgba(5,3,12,0.82)', borderRadius: 12, color: '#fff',
          textAlign: 'center', padding: 20,
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
