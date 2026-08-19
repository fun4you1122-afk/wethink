'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { W_PATH, DOT } from './WeThinkMark'

/**
 * A share card rendered in the browser, 1080 x 1350 for Instagram.
 *
 * The temple photograph, the invitation's typography, the guest's name when we
 * have one, and the WeThink signature along the foot. Everything a guest posts
 * carries the studio's mark with it.
 *
 * Drawn from same-origin assets only, so the canvas stays untainted and can be
 * exported straight to a PNG the visitor can save.
 */

const W = 1080
const H = 1350

const serif = '"Fraunces", Georgia, serif'
const sans = '"Jost", system-ui, sans-serif'

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** The WeThink monogram, drawn straight into the canvas at any scale. */
function drawMark(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  ctx.strokeStyle = '#EAF9FB'
  ctx.lineWidth = 4.6
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.stroke(new Path2D(W_PATH))
  ctx.fillStyle = '#01C1D5'
  ctx.beginPath()
  ctx.arc(DOT.cx, DOT.cy, DOT.r, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

export async function renderShareCard(guest?: string): Promise<string> {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  try {
    await (document as Document & { fonts?: FontFaceSet }).fonts?.ready
  } catch {
    /* fonts will fall back to Georgia and system sans */
  }

  // ground
  const ground = ctx.createLinearGradient(0, 0, W, H)
  ground.addColorStop(0, '#02222A')
  ground.addColorStop(0.55, '#03303A')
  ground.addColorStop(1, '#015866')
  ctx.fillStyle = ground
  ctx.fillRect(0, 0, W, H)

  // Photograph across the top. The source artwork carries its own title in the
  // upper half, so only the lower 47% of it is sampled: temple, river, hills.
  const PHOTO_H = 640
  const photo = await loadImage('/embassy/thailand-hero.jpg')
  if (photo) {
    const sy = photo.height * 0.53
    const sh = photo.height - sy
    const sw = photo.width
    const scale = Math.max(W / sw, PHOTO_H / sh)
    const dw = sw * scale
    const dh = sh * scale
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, W, PHOTO_H)
    ctx.clip()
    ctx.drawImage(photo, 0, sy, sw, sh, (W - dw) / 2, (PHOTO_H - dh) / 2, dw, dh)
    ctx.restore()

    const fade = ctx.createLinearGradient(0, PHOTO_H * 0.45, 0, PHOTO_H)
    fade.addColorStop(0, 'rgba(2,34,42,0)')
    fade.addColorStop(1, '#02222A')
    ctx.fillStyle = fade
    ctx.fillRect(0, PHOTO_H * 0.45, W, PHOTO_H * 0.55 + 2)
  }

  ctx.textAlign = 'center'

  if (guest) {
    ctx.font = `italic 400 42px ${serif}`
    ctx.fillStyle = '#8FD9E4'
    ctx.fillText(`Dear ${guest},`, W / 2, 726)
  }

  ctx.font = `500 25px ${sans}`
  ctx.fillStyle = '#8FD9E4'
  ctx.letterSpacing = '6px'
  ctx.fillText('THE ROYAL THAI EMBASSY, ABU DHABI', W / 2, 790)
  ctx.letterSpacing = '0px'

  const title = ctx.createLinearGradient(120, 0, W - 120, 0)
  title.addColorStop(0, '#8FE3F0')
  title.addColorStop(0.5, '#01C1D5')
  title.addColorStop(1, '#FFE3B0')
  ctx.fillStyle = title
  ctx.font = `600 90px ${serif}`
  ctx.fillText('Marhaba Thailand', W / 2, 890)

  ctx.font = `italic 400 36px ${serif}`
  ctx.fillStyle = '#BFE6EC'
  ctx.fillText('Creating Your Own Thai Experience', W / 2, 948)

  ctx.font = `400 32px ${sans}`
  ctx.fillStyle = '#7FD8E4'
  ctx.fillText('ยินดีต้อนรับ    ✦    مرحبا    ✦    Welcome', W / 2, 1022)

  ctx.font = `600 31px ${sans}`
  ctx.fillStyle = '#F2FAFB'
  ctx.letterSpacing = '3px'
  ctx.fillText('11 – 12 SEPTEMBER 2026', W / 2, 1096)
  ctx.font = `500 26px ${sans}`
  ctx.fillStyle = '#BFE6EC'
  ctx.fillText('REEM MALL, ABU DHABI  ·  10:00 AM – 10:00 PM', W / 2, 1144)
  ctx.letterSpacing = '0px'

  // the WeThink signature along the foot
  const barY = 1200
  const barH = 96
  ctx.fillStyle = 'rgba(255,255,255,0.07)'
  roundRect(ctx, 96, barY, W - 192, barH, barH / 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(1,193,213,0.38)'
  ctx.lineWidth = 1.5
  roundRect(ctx, 96, barY, W - 192, barH, barH / 2)
  ctx.stroke()

  drawMark(ctx, 152, barY + 28, 0.9)

  ctx.textAlign = 'left'
  ctx.font = `500 19px ${sans}`
  ctx.fillStyle = '#8FD9E4'
  ctx.letterSpacing = '4px'
  ctx.fillText('DESIGNED AND BUILT BY', 232, barY + 40)
  ctx.letterSpacing = '0px'
  ctx.font = `600 29px ${sans}`
  ctx.fillStyle = '#EAF9FB'
  ctx.fillText('WeThink  ·  wethink.ae', 232, barY + 74)

  return canvas.toDataURL('image/png')
}

export default function ShareCardButton({
  guest,
  label = 'Download share card',
}: {
  guest?: string
  label?: string
}) {
  const [busy, setBusy] = useState(false)

  const make = async () => {
    setBusy(true)
    try {
      const url = await renderShareCard(guest)
      const a = document.createElement('a')
      a.href = url
      a.download = 'marhaba-thailand.png'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } finally {
      setBusy(false)
    }
  }

  return (
    <motion.button
      type="button"
      onClick={make}
      disabled={busy}
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[12.5px] font-medium uppercase tracking-[0.08em] disabled:opacity-60"
      style={{ borderColor: 'rgba(3,122,138,0.28)', color: '#037A8A' }}
    >
      <Download className="h-3.5 w-3.5" /> {busy ? 'Preparing…' : label}
    </motion.button>
  )
}
