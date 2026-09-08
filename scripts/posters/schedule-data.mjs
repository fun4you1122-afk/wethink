/* Reads app/embassy/programme/schedule.ts and returns plain data.
   The website module is the single source of truth for the festival's
   running order, so the printed panels are generated from it rather than
   retyped. Parsed rather than imported to keep this script dependency free. */

import { readFileSync } from 'node:fs'

const SRC = new URL('../../app/embassy/programme/schedule.ts', import.meta.url)

export function loadSchedule() {
  const src = readFileSync(SRC, 'utf8')

  // const NAME = '...' or across two lines
  const consts = {}
  for (const m of src.matchAll(/^const ([A-Z_0-9]+) =\s*\n?\s*'((?:[^'\\]|\\.)*)'/gm)) {
    consts[m[1]] = m[2].replace(/\\'/g, "'")
  }

  const resolve = (expr) => {
    expr = expr.trim().replace(/,$/, '')
    if (expr.startsWith("'")) return expr.slice(1, -1).replace(/\\'/g, "'")
    if (expr in consts) return consts[expr]
    throw new Error('unresolved title: ' + expr)
  }

  const tracks = {}
  for (const [, name, , body] of src.matchAll(
    /const (day\d\w+) = build\('([^']+)', \[([\s\S]*?)\n\]\)/g,
  )) {
    const rows = []
    // the body capture swallows the final newline, so put one back or the
    // last slot of every track is silently dropped
    for (const r of (body + '\n').matchAll(/\[\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*([\s\S]*?)\],?\n/g)) {
      const [h1, m1, h2, m2] = [r[1], r[2], r[3], r[4]].map(Number)
      let rest = false
      let titleExpr = r[5]
      if (/,\s*'rest'\s*$/.test(titleExpr)) {
        rest = true
        titleExpr = titleExpr.replace(/,\s*'rest'\s*$/, '')
      }
      rows.push({
        start: h1 * 60 + m1,
        end: h2 * 60 + m2,
        title: resolve(titleExpr),
        rest,
      })
    }
    tracks[name] = rows
  }

  // The ceremony is spliced into day one's main stage in the module.
  const ceremony = src.match(/export const CEREMONY = \[([\s\S]*?)\n\]/)[1]
  const items = [...ceremony.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((m) =>
    m[1].replace(/\\'/g, "'").replace(/\\u2019/g, '’'),
  )
  const splice = src.match(/day1Main\.splice\(\d+, 0, \{\s*start: t\((\d+), (\d+)\),\s*end: t\((\d+), (\d+)\)/)
  tracks.day1Main.push({
    start: Number(splice[1]) * 60 + Number(splice[2]),
    end: Number(splice[3]) * 60 + Number(splice[4]),
    title: 'Opening Ceremony',
    ceremony: items,
  })
  tracks.day1Main.sort((a, b) => a.start - b.start)

  return {
    1: { main: tracks.day1Main, second: tracks.day1Second, workshop: tracks.day1Workshop },
    2: { main: tracks.day2Main, second: tracks.day2Second, workshop: tracks.day2Workshop },
  }
}

export const clock = (mins) => {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hh = h % 12 === 0 ? 12 : h % 12
  return { time: `${hh}.${String(m).padStart(2, '0')}`, ampm }
}
