/* ────────────────────────────────────────────────────────────
   Marhaba Thailand 2026 — the festival's running order.

   Transcribed from the Embassy's schedule sheet (status 14/08/2026):
   three parallel tracks across both days, 10:00 to 22:00.

   `start` and `end` are minutes past midnight, Gulf time. They drive
   the "happening now" marker, so they need to stay honest even where
   the tracks overlap, which in the Embassy's sheet they sometimes do.
   ──────────────────────────────────────────────────────────── */

export type Slot = {
  start: number
  end: number
  time: string
  title: string
  where: string
  /** a break rather than an activity, drawn quietly */
  rest?: boolean
  /** the ceremony, which takes over the whole hall */
  feature?: string[]
}

export type TrackId = 'main' | 'second' | 'workshop'

export const TRACKS: { id: TrackId; label: string; short: string; note: string }[] = [
  { id: 'main', label: 'Main Stage', short: 'Main Stage', note: 'Main Atrium, Ground Floor' },
  { id: 'second', label: 'Second Stage', short: 'Second Stage', note: 'Secondary stage' },
  { id: 'workshop', label: 'Workshops', short: 'Workshops', note: 'Workshop area' },
]

const t = (h: number, m: number) => h * 60 + m

/** "14.40 - 15.45" as it reads on the sheet, shown as 2:40 PM. */
const label = (h: number, m: number) => {
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hh = h % 12 === 0 ? 12 : h % 12
  return `${hh}:${String(m).padStart(2, '0')} ${ampm}`
}

type Row = [number, number, number, number, string] | [number, number, number, number, string, 'rest']

const build = (where: string, rows: Row[]): Slot[] =>
  rows.map((r) => ({
    start: t(r[0], r[1]),
    end: t(r[2], r[3]),
    time: label(r[0], r[1]),
    title: r[4],
    where,
    rest: r[5] === 'rest',
  }))

const BREAK = 'Prayer time / Break'
const CARVING = 'Fruit and soap carving (Thai Women’s Circle)'
const TOTE = 'Tote bag decoration + Thai art colouring (RTE)'
const UMBRELLA = 'Umbrella painting (Kai Kaew)'
const BENJARONG = 'Benjarong painting (SACIT)'

/** The Opening Ceremony, as the Embassy set it out. */
export const CEREMONY = [
  'Opening Remarks',
  'Cake Cutting and Sign Reveal',
  'Group Photo',
  'Cultural Performance',
  'Muay Thai Performance',
  'Lucky Draw',
  'Thai Silk Fashion Show',
]

const day1Main = build('Main Stage', [
  [10, 0, 10, 30, 'Day One opens · MC opening'],
  [10, 30, 11, 30, 'Music performance by Sun Der'],
  [11, 30, 12, 20, 'Thai cultural performance by Kai Kaew'],
  [12, 20, 12, 40, BREAK, 'rest'],
  [12, 40, 13, 40, `Workshop demonstration: ${CARVING}`],
  [13, 40, 14, 40, 'Influencer Panel I'],
  [14, 40, 15, 45, 'Muay Thai demonstration by UAM'],
  [15, 45, 16, 5, BREAK, 'rest'],
  [16, 5, 16, 50, 'Music performance by Sun Der'],
  [18, 25, 18, 40, BREAK, 'rest'],
  [18, 40, 20, 0, 'Quiz game by the MC'],
  [20, 0, 20, 15, BREAK, 'rest'],
  [20, 15, 21, 0, 'Workshop demonstration: Weaving by SACIT'],
  [21, 0, 22, 0, 'Thai cultural performance by Kai Kaew'],
])

// the ceremony sits between the afternoon and the evening on day one
day1Main.splice(9, 0, {
  start: t(17, 0),
  end: t(18, 25),
  time: label(17, 0),
  title: 'Opening Ceremony',
  where: 'Main Atrium, Ground Floor (near Zara)',
  feature: CEREMONY,
})

const day1Second = build('Second Stage', [
  [10, 0, 11, 0, 'Kim · Dusit Thani'],
  [11, 0, 11, 30, 'Thai dance performance by Kru Kae'],
  [11, 30, 12, 20, 'Thai games with the Royal Thai Embassy'],
  [12, 20, 12, 40, BREAK, 'rest'],
  [12, 40, 13, 40, 'Music performance by Sun Der'],
  [14, 40, 15, 45, 'Youth talent show'],
  [15, 45, 16, 5, BREAK, 'rest'],
  [16, 5, 16, 50, 'Thai dance class with Kru Kae'],
  [18, 25, 18, 40, BREAK, 'rest'],
  [18, 40, 19, 40, 'Youth talent show'],
  [19, 40, 20, 0, 'Music performance by Sun Der'],
  [20, 0, 20, 15, BREAK, 'rest'],
  [20, 15, 21, 0, 'Officers’ band'],
  [21, 0, 22, 0, 'Thai dance class with Kru Kae'],
])

const day1Workshop = build('Workshops', [
  [10, 0, 10, 30, 'Registration and preparation'],
  [10, 30, 12, 0, CARVING],
  [12, 0, 12, 20, 'Weaving (SACIT)'],
  [12, 20, 12, 40, BREAK, 'rest'],
  [12, 40, 13, 30, 'Weaving (SACIT)'],
  [13, 30, 15, 0, TOTE],
  [15, 0, 15, 45, UMBRELLA],
  [15, 45, 16, 5, BREAK, 'rest'],
  [16, 5, 16, 50, UMBRELLA],
  [18, 25, 18, 40, BREAK, 'rest'],
  [18, 40, 20, 0, 'Batik painting (SACIT)'],
  [20, 0, 20, 15, BREAK, 'rest'],
  [20, 15, 21, 0, 'Roy Malai garland making (Thai Women’s Circle)'],
  [21, 0, 22, 0, `${BENJARONG} · to be confirmed`],
])

const day2Main = build('Main Stage', [
  [10, 0, 10, 30, 'Day Two opens · MC opening'],
  [10, 30, 11, 30, 'Music performance by Sun Der and Kany'],
  [11, 30, 12, 20, 'Thai cultural performance by Kai Kaew'],
  [12, 20, 12, 40, BREAK, 'rest'],
  [12, 40, 13, 40, `Workshop demonstration: ${CARVING}`],
  [13, 40, 14, 40, 'Influencer Panel II'],
  [14, 40, 15, 45, 'Muay Thai demonstration by UAM'],
  [15, 45, 16, 5, BREAK, 'rest'],
  [16, 5, 16, 50, 'Quiz game by the MC'],
  [17, 0, 17, 30, 'Reem Mall campaign prize presentation'],
  [17, 30, 18, 25, 'Workshop demonstration: Batik painting by SACIT'],
  [18, 25, 18, 40, BREAK, 'rest'],
  [18, 40, 19, 40, 'Thai cultural performance by Kai Kaew'],
  [19, 40, 20, 0, 'Quiz game by the MC'],
  [20, 0, 20, 15, BREAK, 'rest'],
  [20, 15, 21, 0, 'Muay Thai demonstration by UAM'],
  [21, 0, 22, 0, 'Workshop demonstration by Kai Kaew: umbrella painting'],
])

const day2Second = build('Second Stage', [
  [10, 0, 11, 0, 'Kim · Dusit Thani'],
  [11, 0, 11, 30, 'Thai dance performance by Kru Kae'],
  [11, 30, 12, 20, 'Thai games with the Royal Thai Embassy'],
  [12, 20, 12, 40, BREAK, 'rest'],
  [12, 40, 14, 0, 'Music performance by Sun Der and Kany'],
  [14, 0, 15, 45, 'Youth talent show'],
  [15, 45, 16, 5, BREAK, 'rest'],
  [16, 5, 18, 0, 'Thai dance class with Kru Kae'],
  [18, 0, 18, 25, 'Thai games with the Royal Thai Embassy'],
  [18, 25, 18, 40, BREAK, 'rest'],
  [18, 40, 20, 0, 'Youth talent show'],
  [20, 0, 20, 15, BREAK, 'rest'],
  [20, 15, 22, 0, 'Music performance by Sun Der and Kany'],
])

const day2Workshop = build('Workshops', [
  [10, 0, 10, 30, 'Registration and preparation'],
  [10, 30, 12, 0, CARVING],
  [12, 0, 12, 20, 'Batik painting (SACIT)'],
  [12, 20, 12, 40, BREAK, 'rest'],
  [12, 40, 13, 30, 'Batik painting (SACIT)'],
  [13, 30, 15, 0, TOTE],
  [15, 0, 15, 45, UMBRELLA],
  [15, 45, 16, 30, UMBRELLA],
  [16, 30, 18, 0, 'Roy Malai garland making (Thai Women’s Circle)'],
  [18, 0, 18, 25, 'Weaving (SACIT)'],
  [18, 25, 18, 40, BREAK, 'rest'],
  [18, 40, 19, 30, 'Weaving (SACIT)'],
  [19, 30, 20, 0, UMBRELLA],
  [20, 0, 20, 15, BREAK, 'rest'],
  [20, 15, 20, 30, UMBRELLA],
  [20, 30, 22, 0, `${BENJARONG} · to be confirmed`],
])

export const SCHEDULE: Record<1 | 2, Record<TrackId, Slot[]>> = {
  1: { main: day1Main, second: day1Second, workshop: day1Workshop },
  2: { main: day2Main, second: day2Second, workshop: day2Workshop },
}

/** Every track of a day, in one time-ordered list, for the live marker. */
export const allSlots = (day: 1 | 2): Slot[] =>
  TRACKS.flatMap((tr) => SCHEDULE[day][tr.id]).sort((a, b) => a.start - b.start)

/** The people and groups behind the two days. */
export const COMPANY = [
  ['Kai Kaew', 'Thai cultural performance and umbrella painting'],
  ['Sun Der', 'Thai band, with Kany on day two'],
  ['Kru Kae', 'Thai dance performance and class'],
  ['UAM', 'Muay Thai demonstration'],
  ['SACIT', 'Weaving, batik and Benjarong painting'],
  ['Thai Women’s Circle', 'Fruit and soap carving, Roy Malai garlands'],
  ['Royal Thai Embassy', 'Thai games, tote bag decoration and colouring'],
  ['Kim · Dusit Thani', 'Morning music on the second stage'],
]
