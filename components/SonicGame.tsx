'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const W = 800
const H = 450
const PW = 44
const PH = 34
const PLAYER_SPEED = 5
const BULLET_SPEED = 9
const COLS = 10
const ROWS = 4
const EX_GAP = 62
const EY_GAP = 42
const ENEMY_W = 36
const ENEMY_H = 36
const MAX_WAVES = 5

type Bullet = { x: number; y: number; vy: number; fromPlayer: boolean }
type Enemy = { x: number; y: number; type: 0|1|2; alive: boolean; hp: number; shootTimer: number; shootInterval: number; col: number }
type Particle = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; r: number; color: string }
type Star = { x: number; y: number; brightness: number; speed: number; size: number }
type PowerUp = { x: number; y: number; vy: number; type: 'rapid'|'shield'|'triple'; spin: number }
type GameState = {
  px: number
  bullets: Bullet[]; enemies: Enemy[]; particles: Particle[]; stars: Star[]; powerUps: PowerUp[]
  score: number; lives: number; wave: number
  status: 'play'|'won'|'dead'
  t: number; shootCooldown: number; shieldTimer: number; rapidTimer: number; tripleShotTimer: number
  waveClearing: boolean; nextWaveTimer: number; enemyDir: 1|-1
}

function buildEnemies(wave: number): Enemy[] {
  const out: Enemy[] = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const type = (r === 0 ? 2 : r === 1 ? 1 : 0) as 0|1|2
      out.push({
        x: 40 + c * EX_GAP, y: 52 + r * EY_GAP,
        type, alive: true, hp: type === 2 ? 2 : 1,
        shootTimer: 60 + Math.random() * 120,
        shootInterval: Math.max(40, 110 - wave * 8) + Math.random() * 40,
        col: c,
      })
    }
  }
  return out
}

function buildStars(): Star[] {
  return Array.from({ length: 160 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    brightness: 0.3 + Math.random() * 0.7,
    speed: 0.15 + Math.random() * 0.5,
    size: Math.random() < 0.08 ? 2 : 1,
  }))
}

function buildState(): GameState {
  return {
    px: W / 2 - PW / 2,
    bullets: [], enemies: buildEnemies(1), particles: [], stars: buildStars(), powerUps: [],
    score: 0, lives: 3, wave: 1, status: 'play',
    t: 0, shootCooldown: 0, shieldTimer: 0, rapidTimer: 0, tripleShotTimer: 0,
    waveClearing: false, nextWaveTimer: 0, enemyDir: 1,
  }
}

export default function SonicGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<GameState>(buildState())
  const keysRef = useRef({ left: false, right: false, shoot: false })
  const [status, setStatus] = useState<'play'|'won'|'dead'>('play')
  const [hud, setHud] = useState({ score: 0, lives: 3, wave: 1 })

  const restart = useCallback(() => {
    stateRef.current = buildState()
    setStatus('play')
    setHud({ score: 0, lives: 3, wave: 1 })
  }, [])

  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (['arrowleft','a'].includes(k)) keysRef.current.left = true
      if (['arrowright','d'].includes(k)) keysRef.current.right = true
      if (['arrowup','w',' ','spacebar'].includes(k)) keysRef.current.shoot = true
      if (['arrowleft','arrowright','arrowup','arrowdown',' ','spacebar'].includes(k)) e.preventDefault()
    }
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (['arrowleft','a'].includes(k)) keysRef.current.left = false
      if (['arrowright','d'].includes(k)) keysRef.current.right = false
      if (['arrowup','w',' ','spacebar'].includes(k)) keysRef.current.shoot = false
    }
    window.addEventListener('keydown', dn, { passive: false })
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up) }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf = 0, running = true

    function burst(x: number, y: number, n: number, colors: string[], spd = 3) {
      const s = stateRef.current
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + Math.random() * 0.6
        const v = spd * (0.4 + Math.random() * 0.8)
        s.particles.push({ x, y, vx: Math.cos(a)*v, vy: Math.sin(a)*v, life: 35 + Math.random()*25, maxLife: 60, r: 1.5 + Math.random()*3, color: colors[Math.floor(Math.random()*colors.length)] })
      }
    }

    function update() {
      const s = stateRef.current
      const keys = keysRef.current
      s.t++
      if (s.status !== 'play') return

      for (const st of s.stars) { st.y += st.speed; if (st.y > H) { st.y = 0; st.x = Math.random()*W } }

      if (keys.left) s.px = Math.max(0, s.px - PLAYER_SPEED)
      if (keys.right) s.px = Math.min(W - PW, s.px + PLAYER_SPEED)

      if (s.shootCooldown > 0) s.shootCooldown--
      if (keys.shoot && s.shootCooldown <= 0) {
        s.shootCooldown = s.rapidTimer > 0 ? 5 : 14
        const bx = s.px + PW / 2
        s.bullets.push({ x: bx, y: H-66, vy: -BULLET_SPEED, fromPlayer: true })
        if (s.tripleShotTimer > 0) {
          s.bullets.push({ x: bx-14, y: H-58, vy: -BULLET_SPEED, fromPlayer: true })
          s.bullets.push({ x: bx+14, y: H-58, vy: -BULLET_SPEED, fromPlayer: true })
        }
      }

      if (s.shieldTimer > 0) s.shieldTimer--
      if (s.rapidTimer > 0) s.rapidTimer--
      if (s.tripleShotTimer > 0) s.tripleShotTimer--

      const alive = s.enemies.filter(e => e.alive)
      if (alive.length === 0 && !s.waveClearing) { s.waveClearing = true; s.nextWaveTimer = 150 }
      if (s.waveClearing) {
        if (s.nextWaveTimer > 0) { s.nextWaveTimer--; goto_particles(s); return }
        const nw = s.wave + 1
        if (nw > MAX_WAVES) { s.status = 'won'; setStatus('won') }
        else {
          s.enemies = buildEnemies(nw); s.wave = nw; s.enemyDir = 1
          s.bullets = s.bullets.filter(b => b.fromPlayer); s.waveClearing = false
          setHud(h => ({ ...h, wave: nw }))
        }
        return
      }

      const speed = Math.min(0.8 + (s.wave-1)*0.18 + (ROWS*COLS - alive.length)*0.012, 2.8)
      const minX = Math.min(...alive.map(e => e.x))
      const maxX = Math.max(...alive.map(e => e.x + ENEMY_W))
      if (s.enemyDir === 1 && maxX >= W-14) { s.enemyDir = -1; for (const e of alive) e.y += 18 }
      else if (s.enemyDir === -1 && minX <= 14) { s.enemyDir = 1; for (const e of alive) e.y += 18 }
      for (const e of alive) e.x += speed * s.enemyDir

      if (Math.max(...alive.map(e => e.y + ENEMY_H)) >= H - 80) {
        s.status = 'dead'; setStatus('dead'); return
      }

      for (let c = 0; c < COLS; c++) {
        const col = alive.filter(e => e.col === c).sort((a,b) => b.y - a.y)
        if (!col.length) continue
        const sh = col[0]; sh.shootTimer--
        if (sh.shootTimer <= 0) {
          sh.shootTimer = sh.shootInterval
          s.bullets.push({ x: sh.x + ENEMY_W/2, y: sh.y + ENEMY_H, vy: 3 + (s.wave-1)*0.2, fromPlayer: false })
        }
      }

      const PCY = H - 60
      for (let i = s.bullets.length - 1; i >= 0; i--) {
        const b = s.bullets[i]
        b.y += b.vy
        if (b.y < -20 || b.y > H+20) { s.bullets.splice(i,1); continue }

        if (b.fromPlayer) {
          let hit = false
          for (const e of s.enemies) {
            if (!e.alive) continue
            if (b.x >= e.x-3 && b.x <= e.x+ENEMY_W+3 && b.y >= e.y-3 && b.y <= e.y+ENEMY_H+3) {
              e.hp--
              if (e.hp <= 0) {
                e.alive = false
                s.score += (e.type===2 ? 30 : e.type===1 ? 20 : 10) * s.wave
                burst(e.x+ENEMY_W/2, e.y+ENEMY_H/2, 14,
                  e.type===2 ? ['#FF8040','#FFB060','#FFE090'] :
                  e.type===1 ? ['#40FF80','#80FFB0','#C0FFC0'] :
                  ['#8080FF','#B0A0FF','#D0C0FF'])
                if (Math.random() < 0.13) {
                  const types: Array<'rapid'|'shield'|'triple'> = ['rapid','shield','triple']
                  s.powerUps.push({ x: e.x+8, y: e.y, vy: 1.3, type: types[Math.floor(Math.random()*3)], spin: 0 })
                }
              } else { burst(e.x+ENEMY_W/2, e.y+ENEMY_H/2, 5, ['#FFC080','#FFE0A0'], 1.5) }
              hit = true; setHud(h => ({ ...h, score: s.score })); break
            }
          }
          if (hit) { s.bullets.splice(i,1); continue }
        } else {
          if (b.x >= s.px-2 && b.x <= s.px+PW+2 && b.y >= PCY-PH/2-2 && b.y <= PCY+PH/2+2) {
            if (s.shieldTimer > 0) { burst(s.px+PW/2, PCY, 10, ['#60C0FF','#A0E0FF'], 2); s.shieldTimer = 0 }
            else {
              s.lives--; burst(s.px+PW/2, PCY, 20, ['#FF6060','#FFAA60','#ffffff'])
              if (s.lives <= 0) { s.status = 'dead'; setStatus('dead') }
              setHud(h => ({ ...h, lives: s.lives }))
            }
            s.bullets.splice(i,1); continue
          }
        }
      }

      for (let i = s.powerUps.length-1; i >= 0; i--) {
        const p = s.powerUps[i]; p.y += p.vy; p.spin += 0.06
        if (p.y > H+40) { s.powerUps.splice(i,1); continue }
        if (p.x+20 >= s.px && p.x <= s.px+PW && p.y+16 >= PCY-PH/2-10 && p.y <= PCY+PH/2+10) {
          if (p.type==='rapid') s.rapidTimer = 360
          else if (p.type==='shield') s.shieldTimer = 480
          else s.tripleShotTimer = 360
          burst(p.x+10, p.y, 16,
            p.type==='rapid' ? ['#FFE060','#FFD020','#FFF080'] :
            p.type==='shield' ? ['#60C0FF','#A0E0FF','#E0F8FF'] :
            ['#FF80C0','#FFB0E0','#FFC0FF'], 2)
          s.powerUps.splice(i,1)
        }
      }

      for (let i = s.particles.length-1; i >= 0; i--) {
        const p = s.particles[i]; p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.vx *= 0.97; p.life--
        if (p.life <= 0) s.particles.splice(i,1)
      }
    }

    function goto_particles(s: GameState) {
      for (let i = s.particles.length-1; i >= 0; i--) {
        const p = s.particles[i]; p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.vx *= 0.97; p.life--
        if (p.life <= 0) s.particles.splice(i,1)
      }
      for (const st of s.stars) { st.y += st.speed; if (st.y > H) { st.y = 0; st.x = Math.random()*W } }
    }

    function draw() {
      const s = stateRef.current
      drawBG(ctx, s); drawPowerUps(ctx, s); drawBullets(ctx, s)
      drawEnemies(ctx, s); drawPlayer(ctx, s); drawParticles(ctx, s); drawHUD(ctx, s)
      if (s.waveClearing && s.nextWaveTimer > 80) {
        ctx.save(); ctx.textAlign='center'; ctx.textBaseline='middle'
        ctx.font = 'bold 40px "Courier New",monospace'
        ctx.fillStyle='rgba(100,255,160,0.95)'; ctx.shadowColor='#40FF80'; ctx.shadowBlur=22
        ctx.fillText(`WAVE ${s.wave} CLEAR!`, W/2, H/2); ctx.restore()
      }
    }

    function loop() { if (!running) return; update(); draw(); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { running = false; cancelAnimationFrame(raf) }
  }, [])

  const press = (k: 'left'|'right'|'shoot', v: boolean) => { keysRef.current[k] = v }

  return (
    <div style={{ position:'relative', width:'100%', maxWidth:W, margin:'0 auto' }}>
      <canvas ref={canvasRef} width={W} height={H}
        style={{ width:'100%', height:'auto', display:'block', borderRadius:12, background:'#060614', touchAction:'none' }} />

      {status !== 'play' && (
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, background:'rgba(5,3,12,0.86)', borderRadius:12, color:'#fff', textAlign:'center', padding:20 }}>
          <h3 style={{ fontSize:30, fontWeight:900, margin:0 }}>
            {status==='won' ? '🏆 Sector Cleared!' : '💀 Ship Destroyed'}
          </h3>
          <p style={{ color:'#A78BFA', margin:0 }}>
            {status==='won' ? `All ${MAX_WAVES} waves defeated! ` : 'The alien fleet prevailed. '}
            Final score: <b style={{ color:'#FFD83D' }}>{hud.score}</b>
          </p>
          <button onClick={restart} style={{ padding:'12px 28px', borderRadius:50, border:'none', cursor:'pointer', fontWeight:800, fontSize:15, color:'#fff', background:'linear-gradient(135deg,#7C3AED,#5B21B6)' }}>
            Play Again
          </button>
        </div>
      )}

      <div style={{ display:'flex', justifyContent:'space-between', marginTop:12, userSelect:'none' }}>
        <div style={{ display:'flex', gap:10 }}>
          <CtrlBtn label="◀" onDown={() => press('left',true)} onUp={() => press('left',false)} />
          <CtrlBtn label="▶" onDown={() => press('right',true)} onUp={() => press('right',false)} />
        </div>
        <CtrlBtn label="FIRE" wide onDown={() => press('shoot',true)} onUp={() => press('shoot',false)} />
      </div>
      <p style={{ textAlign:'center', marginTop:10, fontSize:12, color:'#8B8BAA' }}>
        Arrow keys / A·D to move · Space / W to fire · Grab power-ups · Survive {MAX_WAVES} waves
      </p>
    </div>
  )
}

function CtrlBtn({ label, wide, onDown, onUp }: { label:string; wide?:boolean; onDown:()=>void; onUp:()=>void }) {
  return (
    <button
      onMouseDown={e => { e.preventDefault(); onDown() }} onMouseUp={e => { e.preventDefault(); onUp() }}
      onMouseLeave={onUp} onTouchStart={e => { e.preventDefault(); onDown() }} onTouchEnd={e => { e.preventDefault(); onUp() }}
      style={{ minWidth:wide?96:56, height:56, borderRadius:14, cursor:'pointer', border:'1px solid rgba(124,58,237,0.4)', background:'rgba(124,58,237,0.18)', color:'#fff', fontSize:18, fontWeight:800, touchAction:'none' }}
    >{label}</button>
  )
}

/* ── DRAW ── */

function drawBG(ctx: CanvasRenderingContext2D, s: GameState) {
  ctx.fillStyle='#060614'; ctx.fillRect(0,0,W,H)
  const n1=ctx.createRadialGradient(W*.72,H*.25,0,W*.72,H*.25,280)
  n1.addColorStop(0,'rgba(60,20,100,0.18)'); n1.addColorStop(1,'rgba(0,0,0,0)')
  ctx.fillStyle=n1; ctx.fillRect(0,0,W,H)
  const n2=ctx.createRadialGradient(W*.18,H*.65,0,W*.18,H*.65,180)
  n2.addColorStop(0,'rgba(20,50,110,0.14)'); n2.addColorStop(1,'rgba(0,0,0,0)')
  ctx.fillStyle=n2; ctx.fillRect(0,0,W,H)
  for (const st of s.stars) {
    const tw = 0.4 + 0.6*Math.sin(s.t*0.05+st.x*0.08)
    ctx.fillStyle=`rgba(255,255,255,${(st.brightness*tw).toFixed(2)})`
    if (st.size>1) { ctx.beginPath(); ctx.arc(st.x,st.y,st.size,0,Math.PI*2); ctx.fill() }
    else ctx.fillRect(~~st.x,~~st.y,1,1)
  }
}

function drawBullets(ctx: CanvasRenderingContext2D, s: GameState) {
  for (const b of s.bullets) {
    ctx.save()
    if (b.fromPlayer) {
      ctx.shadowColor='#A78BFA'; ctx.shadowBlur=14
      const g=ctx.createLinearGradient(b.x,b.y,b.x,b.y+20)
      g.addColorStop(0,'#E0D0FF'); g.addColorStop(1,'rgba(167,139,250,0)')
      ctx.fillStyle=g; ctx.fillRect(b.x-2.5,b.y,5,18)
      ctx.fillStyle='#fff'; ctx.fillRect(b.x-1.5,b.y,3,5)
    } else {
      ctx.shadowColor='#FF6040'; ctx.shadowBlur=10
      const g=ctx.createLinearGradient(b.x,b.y-14,b.x,b.y)
      g.addColorStop(0,'rgba(255,80,40,0)'); g.addColorStop(1,'#FF8060')
      ctx.fillStyle=g; ctx.fillRect(b.x-2,b.y-14,4,14)
      ctx.fillStyle='#FFC0A0'; ctx.fillRect(b.x-1.5,b.y-3,3,5)
    }
    ctx.restore()
  }
}

function drawEnemies(ctx: CanvasRenderingContext2D, s: GameState) {
  for (const e of s.enemies) {
    if (!e.alive) continue
    ctx.save()
    if (e.type===0) drawGrunt(ctx,e.x,e.y,s.t)
    else if (e.type===1) drawFighter(ctx,e.x,e.y,s.t)
    else drawElite(ctx,e.x,e.y,s.t,e.hp)
    ctx.restore()
  }
}

function drawGrunt(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  const bob=Math.sin(t*0.06+x*0.05)*2
  ctx.translate(x+18,y+18+bob)
  ctx.shadowColor='#8080FF'; ctx.shadowBlur=10
  const dg=ctx.createLinearGradient(-18,-4,18,4)
  dg.addColorStop(0,'#3030B0'); dg.addColorStop(.5,'#5555EE'); dg.addColorStop(1,'#1A1A80')
  ctx.fillStyle=dg; ctx.beginPath(); ctx.ellipse(0,5,18,8,0,0,Math.PI*2); ctx.fill()
  const dm=ctx.createRadialGradient(-3,-4,1,0,0,13)
  dm.addColorStop(0,'#B0B0FF'); dm.addColorStop(.7,'#4444CC'); dm.addColorStop(1,'#2828AA')
  ctx.fillStyle=dm; ctx.beginPath(); ctx.ellipse(0,0,12,10,0,0,Math.PI*2); ctx.fill()
  ctx.fillStyle='#FF4444'
  ctx.beginPath(); ctx.arc(-4,1,2.5,0,Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.arc(4,1,2.5,0,Math.PI*2); ctx.fill()
  ctx.fillStyle='rgba(255,80,80,0.5)'
  ctx.beginPath(); ctx.arc(-4,1,5,0,Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.arc(4,1,5,0,Math.PI*2); ctx.fill()
  for (let i=-2;i<=2;i++) {
    const tg=ctx.createLinearGradient(i*6,11,i*6,18)
    tg.addColorStop(0,'rgba(80,200,255,0.8)'); tg.addColorStop(1,'rgba(80,200,255,0)')
    ctx.fillStyle=tg; ctx.fillRect(i*6-1.5,11,3,8)
  }
}

function drawFighter(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  const bob=Math.sin(t*0.07+x*0.04)*2.5
  ctx.translate(x+18,y+18+bob)
  ctx.shadowColor='#40FF80'; ctx.shadowBlur=12
  const fg=ctx.createLinearGradient(-18,-14,18,14)
  fg.addColorStop(0,'#185030'); fg.addColorStop(.5,'#38A858'); fg.addColorStop(1,'#0C3018')
  ctx.fillStyle=fg
  ctx.beginPath(); ctx.moveTo(0,-15); ctx.lineTo(18,13); ctx.lineTo(10,9)
  ctx.lineTo(0,14); ctx.lineTo(-10,9); ctx.lineTo(-18,13); ctx.closePath(); ctx.fill()
  ctx.fillStyle='rgba(80,240,140,0.28)'
  ctx.beginPath(); ctx.moveTo(0,-15); ctx.lineTo(18,13); ctx.lineTo(8,7); ctx.closePath(); ctx.fill()
  ctx.beginPath(); ctx.moveTo(0,-15); ctx.lineTo(-18,13); ctx.lineTo(-8,7); ctx.closePath(); ctx.fill()
  ctx.fillStyle='#80FFB0'; ctx.beginPath(); ctx.ellipse(0,-2,5,8,0,0,Math.PI*2); ctx.fill()
  const eg=ctx.createRadialGradient(0,14,0,0,14,7)
  eg.addColorStop(0,'rgba(120,255,180,0.9)'); eg.addColorStop(1,'rgba(40,200,100,0)')
  ctx.fillStyle=eg; ctx.beginPath(); ctx.arc(0,14,7,0,Math.PI*2); ctx.fill()
}

function drawElite(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, hp: number) {
  const bob=Math.sin(t*0.05+x*0.03)*3
  ctx.translate(x+18,y+18+bob)
  const c=hp>1?'#FF8040':'#FF4040', gw=hp>1?'#FF6020':'#FF2020'
  ctx.shadowColor=gw; ctx.shadowBlur=16
  ctx.save(); ctx.rotate(t*0.045)
  ctx.strokeStyle=c; ctx.lineWidth=2.5; ctx.beginPath(); ctx.arc(0,0,17,0,Math.PI*2); ctx.stroke()
  for (let i=0;i<4;i++) {
    ctx.save(); ctx.rotate(Math.PI/2*i)
    ctx.fillStyle=hp>1?'#FF9060':'#FF6060'
    ctx.beginPath(); ctx.moveTo(0,-17); ctx.lineTo(-4,-12); ctx.lineTo(4,-12); ctx.closePath(); ctx.fill()
    ctx.restore()
  }
  ctx.restore()
  const cg=ctx.createRadialGradient(-4,-4,2,0,0,14)
  cg.addColorStop(0,hp>1?'#FFD090':'#FF9090'); cg.addColorStop(.6,hp>1?'#FF5020':'#FF1010'); cg.addColorStop(1,hp>1?'#A02800':'#700000')
  ctx.fillStyle=cg; ctx.beginPath(); ctx.arc(0,0,14,0,Math.PI*2); ctx.fill()
  ctx.fillStyle=hp>1?'#FFE0A0':'#FF8080'; ctx.beginPath(); ctx.arc(0,0,5,0,Math.PI*2); ctx.fill()
  ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.arc(-1.5,-1.5,2,0,Math.PI*2); ctx.fill()
}

function drawPlayer(ctx: CanvasRenderingContext2D, s: GameState) {
  const px=s.px, cy=H-60
  ctx.save()
  if (s.shieldTimer>0) {
    const a=Math.min(1,s.shieldTimer/60)*(0.5+0.3*Math.sin(s.t*0.25))
    ctx.strokeStyle=`rgba(100,200,255,${a.toFixed(2)})`; ctx.lineWidth=2.5
    ctx.shadowColor='#60C0FF'; ctx.shadowBlur=18
    ctx.beginPath(); ctx.arc(px+PW/2,cy,34,0,Math.PI*2); ctx.stroke(); ctx.shadowBlur=0
  }
  ctx.translate(px+PW/2,cy)
  const ff=0.7+0.3*Math.sin(s.t*0.35)
  for (const ex of [-11,0,11]) {
    const fh=(14+Math.abs(ex))*ff
    const fg=ctx.createLinearGradient(ex,PH/2,ex,PH/2+fh+5)
    fg.addColorStop(0,`rgba(255,200,60,${ff.toFixed(2)})`); fg.addColorStop(.5,`rgba(255,90,20,${(ff*.8).toFixed(2)})`); fg.addColorStop(1,'rgba(255,50,0,0)')
    ctx.fillStyle=fg; ctx.beginPath(); ctx.ellipse(ex,PH/2+fh/2+2,4,fh/2+4,0,0,Math.PI*2); ctx.fill()
  }
  ctx.shadowColor='#9060FF'; ctx.shadowBlur=18
  const hg=ctx.createLinearGradient(-PW/2,PH/2,PW/2,-PH/2)
  hg.addColorStop(0,'#2810A8'); hg.addColorStop(.4,'#5030D8'); hg.addColorStop(.5,'#7050FF'); hg.addColorStop(.6,'#5030D8'); hg.addColorStop(1,'#180C90')
  ctx.fillStyle=hg
  ctx.beginPath(); ctx.moveTo(0,-PH/2+2); ctx.lineTo(-PW/2,PH/2); ctx.lineTo(-PW/2+7,PH/2-9)
  ctx.lineTo(0,PH/2-5); ctx.lineTo(PW/2-7,PH/2-9); ctx.lineTo(PW/2,PH/2); ctx.closePath(); ctx.fill()
  ctx.fillStyle='rgba(130,90,255,0.5)'
  ctx.beginPath(); ctx.moveTo(-PW/2,PH/2); ctx.lineTo(-PW/2-14,PH/2-3); ctx.lineTo(-PW/2,PH/2-16); ctx.closePath(); ctx.fill()
  ctx.beginPath(); ctx.moveTo(PW/2,PH/2); ctx.lineTo(PW/2+14,PH/2-3); ctx.lineTo(PW/2,PH/2-16); ctx.closePath(); ctx.fill()
  const cg=ctx.createRadialGradient(-2,-4,1,0,-3,9)
  cg.addColorStop(0,'rgba(200,240,255,0.9)'); cg.addColorStop(.5,'rgba(100,170,255,0.65)'); cg.addColorStop(1,'rgba(50,90,210,0.3)')
  ctx.fillStyle=cg; ctx.beginPath(); ctx.ellipse(0,-3,7,10,0,0,Math.PI*2); ctx.fill()
  ctx.strokeStyle='rgba(190,170,255,0.5)'; ctx.lineWidth=1.5
  ctx.beginPath(); ctx.moveTo(0,-PH/2+3); ctx.lineTo(-9,PH/2-7); ctx.stroke()
  if (s.rapidTimer>0) {
    ctx.fillStyle='#FFE060'; ctx.shadowColor='#FFD020'; ctx.shadowBlur=10
    ctx.beginPath(); ctx.arc(-PW/2+5,2,3,0,Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.arc(PW/2-5,2,3,0,Math.PI*2); ctx.fill()
  }
  if (s.tripleShotTimer>0) {
    ctx.fillStyle='#FF80C0'; ctx.shadowColor='#FF60B0'; ctx.shadowBlur=10
    ctx.beginPath(); ctx.arc(-PW/2+5,-8,3,0,Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.arc(PW/2-5,-8,3,0,Math.PI*2); ctx.fill()
  }
  ctx.restore()
}

function drawPowerUps(ctx: CanvasRenderingContext2D, s: GameState) {
  for (const p of s.powerUps) {
    ctx.save(); ctx.translate(p.x+10,p.y+10); ctx.rotate(p.spin)
    const c=p.type==='rapid'?'#FFE060':p.type==='shield'?'#60C0FF':'#FF80C0'
    ctx.shadowColor=c; ctx.shadowBlur=14; ctx.fillStyle=c
    ctx.beginPath(); ctx.moveTo(0,-13); ctx.lineTo(9,0); ctx.lineTo(0,13); ctx.lineTo(-9,0); ctx.closePath(); ctx.fill()
    ctx.fillStyle='rgba(255,255,255,0.4)'
    ctx.beginPath(); ctx.moveTo(0,-13); ctx.lineTo(9,0); ctx.lineTo(0,-2); ctx.closePath(); ctx.fill()
    ctx.fillStyle='#fff'; ctx.font='bold 10px Arial'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.shadowBlur=0
    ctx.fillText(p.type==='rapid'?'R':p.type==='shield'?'S':'T',0,1)
    ctx.restore()
  }
}

function drawParticles(ctx: CanvasRenderingContext2D, s: GameState) {
  for (const p of s.particles) {
    const a=p.life/p.maxLife
    ctx.save(); ctx.globalAlpha=a; ctx.fillStyle=p.color; ctx.shadowColor=p.color; ctx.shadowBlur=5
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r*a,0,Math.PI*2); ctx.fill(); ctx.restore()
  }
}

function drawHUD(ctx: CanvasRenderingContext2D, s: GameState) {
  const hg=ctx.createLinearGradient(0,0,0,44)
  hg.addColorStop(0,'rgba(8,4,24,0.94)'); hg.addColorStop(1,'rgba(6,3,18,0.82)')
  ctx.fillStyle=hg; ctx.fillRect(0,0,W,44)
  ctx.strokeStyle='rgba(124,58,237,0.45)'; ctx.lineWidth=1
  ctx.beginPath(); ctx.moveTo(0,44); ctx.lineTo(W,44); ctx.stroke()
  ctx.textBaseline='middle'
  ctx.font='bold 11px "Courier New",monospace'; ctx.fillStyle='#8AA8CC'; ctx.textAlign='left'; ctx.fillText('SCORE',18,13)
  ctx.font='bold 15px "Courier New",monospace'; ctx.fillStyle='#fff'; ctx.fillText(String(s.score).padStart(7,'0'),18,32)
  ctx.font='bold 11px "Courier New",monospace'; ctx.fillStyle='#8AA8CC'; ctx.textAlign='center'; ctx.fillText('WAVE',W*.37,13)
  ctx.font='bold 15px "Courier New",monospace'; ctx.fillStyle='#A78BFA'; ctx.fillText(`${s.wave} / ${MAX_WAVES}`,W*.37,32)
  let puX=W*.56
  if (s.rapidTimer>0) { ctx.font='bold 10px "Courier New",monospace'; ctx.fillStyle='#FFE060'; ctx.textAlign='center'; ctx.fillText(`⚡ ${Math.ceil(s.rapidTimer/60)}s`,puX,22); puX+=60 }
  if (s.shieldTimer>0) { ctx.font='bold 10px "Courier New",monospace'; ctx.fillStyle='#60C0FF'; ctx.textAlign='center'; ctx.fillText(`🛡 ${Math.ceil(s.shieldTimer/60)}s`,puX,22); puX+=55 }
  if (s.tripleShotTimer>0) { ctx.font='bold 10px "Courier New",monospace'; ctx.fillStyle='#FF80C0'; ctx.textAlign='center'; ctx.fillText(`✦ ${Math.ceil(s.tripleShotTimer/60)}s`,puX,22) }
  ctx.font='bold 11px "Courier New",monospace'; ctx.fillStyle='#8AA8CC'; ctx.textAlign='right'; ctx.fillText('LIVES',W-70,13)
  for (let i=0;i<Math.max(0,s.lives);i++) {
    ctx.save(); ctx.translate(W-16-i*22,32)
    ctx.fillStyle='#A78BFA'; ctx.shadowColor='#7C3AED'; ctx.shadowBlur=8
    ctx.beginPath(); ctx.moveTo(0,-8); ctx.lineTo(-7,7); ctx.lineTo(0,4); ctx.lineTo(7,7); ctx.closePath(); ctx.fill()
    ctx.restore()
  }
}
