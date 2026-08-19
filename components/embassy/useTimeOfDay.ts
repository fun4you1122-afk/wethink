'use client'

import { useEffect, useState } from 'react'

/**
 * The festival runs 10:00 to 22:00, so the pages run on the same clock.
 *
 * Everything visual is derived from the hour in Abu Dhabi: the sky behind the
 * invitation, whether stars and lanterns appear, and whether text sits light or
 * dark. A guest opening the invitation at breakfast and a visitor scanning a
 * standee after dinner see genuinely different pages.
 *
 * Rendering starts on the daylight palette and only shifts after mount, so the
 * server and the first client paint always agree.
 */

export type Phase = 'dawn' | 'morning' | 'afternoon' | 'golden' | 'dusk' | 'night'

export type Palette = {
  phase: Phase
  /** greeting for the hour, in the invitation's voice */
  label: string
  /** three stops, top to bottom */
  sky: [string, string, string]
  ink: string
  inkSoft: string
  /** headline gradient for this hour */
  title: [string, string, string, string]
  /** drifting petal + mote colour */
  accent: string
  /** chedi silhouette colour */
  silhouette: string
  /** panels need a heavier veil once the sky goes dark */
  panel: string
  panelBorder: string
  isDark: boolean
  stars: number
  lanterns: number
}

const DAY: Palette = {
  phase: 'afternoon',
  label: 'Good afternoon',
  sky: ['#EAF7FA', '#F2FAFB', '#F7FCFD'],
  ink: '#0C3A42',
  inkSoft: '#46707A',
  title: ['#00252E', '#014653', '#026B79', '#088A9B'],
  accent: '#029FB1',
  silhouette: '#037A8A',
  panel: 'rgba(255,255,255,0.58)',
  panelBorder: 'rgba(3,122,138,0.12)',
  isDark: false,
  stars: 0,
  lanterns: 0,
}

const PALETTES: Record<Phase, Palette> = {
  dawn: {
    ...DAY,
    phase: 'dawn',
    label: 'Good morning',
    sky: ['#FCE9E2', '#EDF4F4', '#F2FAFB'],
    title: ['#00252E', '#0A4C58', '#12707C', '#7A4A3E'],
    accent: '#E9B9A5',
    silhouette: '#7E93A0',
    stars: 12,
  },
  morning: {
    ...DAY,
    phase: 'morning',
    label: 'Good morning',
    sky: ['#E6F6FB', '#F1FAFB', '#F8FDFD'],
  },
  afternoon: DAY,
  golden: {
    ...DAY,
    phase: 'golden',
    label: 'Good afternoon',
    sky: ['#FFF0D8', '#F4F8F2', '#F2FAFB'],
    title: ['#00252E', '#0A4C58', '#5C5A33', '#8A6A2A'],
    accent: '#D9A441',
    silhouette: '#B08A4A',
  },
  dusk: {
    ...DAY,
    phase: 'dusk',
    label: 'Good evening',
    sky: ['#26324E', '#6E4F72', '#D79A72'],
    ink: '#FFF6EC',
    inkSoft: '#E4C6BD',
    title: ['#00252E', '#0A4C58', '#12707C', '#0A7E8E'],
    accent: '#F0C48A',
    silhouette: '#2A2E46',
    panel: 'rgba(255,255,255,0.80)',
    panelBorder: 'rgba(255,255,255,0.35)',
    isDark: true,
    stars: 40,
    lanterns: 8,
  },
  night: {
    ...DAY,
    phase: 'night',
    label: 'Good evening',
    sky: ['#01161D', '#032B34', '#064450'],
    ink: '#EAF9FB',
    inkSoft: '#93CBD6',
    title: ['#00252E', '#0A4C58', '#12707C', '#0A7E8E'],
    accent: '#F2C879',
    silhouette: '#00232C',
    panel: 'rgba(255,255,255,0.86)',
    panelBorder: 'rgba(255,255,255,0.28)',
    isDark: true,
    stars: 90,
    lanterns: 14,
  },
}

/** Hour in Abu Dhabi, as a float, wherever the visitor happens to be. */
export function gulfHour(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dubai',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now)
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0)
  return get('hour') + get('minute') / 60
}

export function phaseForHour(h: number): Phase {
  if (h < 5) return 'night'
  if (h < 7) return 'dawn'
  if (h < 11) return 'morning'
  if (h < 16) return 'afternoon'
  if (h < 18) return 'golden'
  if (h < 19.5) return 'dusk'
  return 'night'
}

export function useTimeOfDay(): Palette {
  const [palette, setPalette] = useState<Palette>(DAY)

  useEffect(() => {
    const apply = () => setPalette(PALETTES[phaseForHour(gulfHour())])
    apply()
    // the sky only needs to move a few times an hour
    const id = setInterval(apply, 60_000)
    return () => clearInterval(id)
  }, [])

  return palette
}

/** Palette hex plus an alpha, for building scrims. */
export function withAlpha(hex: string, a: number) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}
