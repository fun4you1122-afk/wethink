/* ────────────────────────────────────────────────────────────
   Marhaba Thailand 2026 — the festival's running order.

   Transcribed from the Embassy's schedule sheet
   (MARHABA_2026_SCHEDULE_final4, received 06/09/2026):
   three parallel tracks across both days, 10:00 to 23:00.

   `start` and `end` are minutes past midnight, Gulf time. They drive
   the "happening now" marker, so they need to stay honest even where
   the tracks overlap, which in the Embassy's sheet they sometimes do.

   The sheet's ten-minute "Break/transition" rows are not carried over.
   They are stage-management, not something a guest walks over for, and
   leaving them out lets the gaps between slots speak for themselves.
   Prayer breaks are kept, because guests do plan around those.
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
  { id: 'second', label: 'Secondary Stage', short: 'Second Stage', note: 'Secondary stage' },
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

/* The acts that recur, named once so both days stay in step. */
const KAI_KAEW_A =
  'The Celestial Bird Dance + The Dance of Silver & Golden Branches + Thai Puppet Theatre by Kai Kaew'
const KAI_KAEW_B =
  'A Journey Through Thailand’s Four Regions + Kipas Renang, the Traditional Thai Fan Dance + Isan Long-Drum Dance by Kai Kaew'
const KAI_KAEW_C =
  'Hanuman & the Mermaid Princess + Nora, Southern Thailand’s Traditional Dance + Thailand’s Heritage: From Tradition to World Heritage by Kai Kaew'
const MUAY_THAI = 'Muay Thai demonstration by the UAE Muay Thai and Kickboxing Federation'
const KIM = 'Kim instrument by Dusit Thani Abu Dhabi'
const TOTE = 'Tote bag decoration + Thai art colouring by the Royal Thai Embassy'
const UMBRELLA = 'Umbrella painting workshop by Kai Kaew'
const THAI_GAMES = 'Thai Games by the Royal Thai Embassy'
const DANCE_CLASS = 'Thai Dance Class by Yasothara Thai Dance'

/** The Opening Ceremony, as the Embassy set it out. */
export const CEREMONY = [
  'Remarks by the Ambassador',
  'Cake cutting',
  'Group photo',
  'Thailand’s Heritage: From Tradition to World Heritage, performed by Kai Kaew with the UAE Muay Thai and Kickboxing Federation',
  'Lucky Draw',
  'Fashion Show',
]

/* ── Day one, Friday 11 September ─────────────────────────── */

const day1Main = build('Main Stage', [
  [10, 0, 10, 10, 'Day One opens · MC opening'],
  [10, 20, 10, 50, 'Music performance by Sun Der'],
  [11, 0, 11, 20, 'Floral garland demonstration by the Thai Women’s Circle'],
  [11, 30, 11, 50, 'Bamboo weaving demonstration by SACIT'],
  [12, 0, 12, 20, KAI_KAEW_A],
  [12, 20, 12, 40, BREAK, 'rest'],
  [12, 40, 13, 0, MUAY_THAI],
  [13, 10, 13, 30, 'Pin making demonstration by SACIT'],
  [13, 40, 14, 0, 'Music performance by Sun Der'],
  [14, 10, 14, 30, KAI_KAEW_A],
  [14, 40, 15, 10, 'Fruit and soap carving demonstration by the Thai Women’s Circle'],
  [15, 20, 15, 45, 'Influencer panel with @sallyelazab'],
  [15, 45, 16, 5, BREAK, 'rest'],
  [16, 5, 16, 20, MUAY_THAI],
  [16, 30, 16, 50, 'Music performance by Sun Der'],
  [18, 25, 18, 40, BREAK, 'rest'],
  [18, 40, 19, 0, 'Kiosks introduced by the MC'],
  [19, 0, 19, 20, 'Music performance by Sun Der'],
  [19, 20, 19, 30, 'MC quiz'],
  [19, 30, 20, 0, KAI_KAEW_C],
  [20, 0, 20, 15, BREAK, 'rest'],
  [20, 15, 21, 0, 'Thailand trivia with Kru Aom'],
  [21, 15, 21, 45, 'Nora beading demonstration by SACIT'],
  [22, 0, 22, 20, 'Music performance by Sun Der x Kany'],
  [22, 30, 22, 50, KAI_KAEW_B],
  [22, 50, 23, 0, 'Quiz game by the MC'],
])

// the ceremony sits between the afternoon and the evening on day one
day1Main.splice(15, 0, {
  start: t(17, 0),
  end: t(18, 0),
  time: label(17, 0),
  title: 'Opening Ceremony',
  where: 'Main Atrium, Ground Floor (near Zara)',
  feature: CEREMONY,
})

const day1Second = build('Second Stage', [
  [10, 30, 11, 10, KIM],
  [11, 20, 12, 20, 'Youth talent show'],
  [12, 20, 12, 40, BREAK, 'rest'],
  [12, 40, 14, 10, DANCE_CLASS],
  [14, 30, 15, 30, THAI_GAMES],
  [15, 30, 15, 45, KIM],
  [15, 45, 16, 5, BREAK, 'rest'],
  [16, 5, 16, 30, 'Thai dance demonstration by Kai Kaew & Yasothara Thai Dance'],
  [16, 30, 16, 50, KIM],
  [18, 25, 18, 40, BREAK, 'rest'],
  [18, 40, 20, 0, DANCE_CLASS],
  [20, 0, 20, 15, BREAK, 'rest'],
  [20, 15, 21, 0, 'Thai musical instrument demonstration by Sun Der'],
  [21, 10, 22, 10, THAI_GAMES],
  [22, 20, 22, 40, KIM],
])

const day1Workshop = build('Workshops', [
  [10, 0, 10, 20, 'Registration and preparation'],
  [10, 20, 11, 10, TOTE],
  [11, 20, 12, 20, 'Floral garland making workshop by the Thai Women’s Circle'],
  [12, 30, 13, 50, UMBRELLA],
  [14, 0, 15, 20, 'Bamboo weaving workshop by SACIT'],
  [15, 30, 16, 50, 'Pin making workshop by SACIT'],
  [18, 25, 18, 40, BREAK, 'rest'],
  [18, 40, 20, 0, 'Nora beading workshop by SACIT'],
  [20, 0, 20, 15, BREAK, 'rest'],
  [20, 15, 21, 45, TOTE],
  [21, 55, 23, 0, UMBRELLA],
])

/* ── Day two, Saturday 12 September ───────────────────────── */

const day2Main = build('Main Stage', [
  [10, 0, 10, 10, 'Day Two opens · MC opening'],
  [10, 20, 10, 50, 'Music performance by Sun Der x Kany'],
  [11, 0, 11, 20, 'Fruit and soap carving demonstration by the Thai Women’s Circle'],
  [11, 30, 11, 50, 'Bamboo weaving demonstration by SACIT'],
  [12, 0, 12, 20, KAI_KAEW_A],
  [12, 20, 12, 40, BREAK, 'rest'],
  [12, 40, 13, 0, MUAY_THAI],
  [13, 10, 13, 30, 'Pin making demonstration by SACIT'],
  [13, 40, 14, 0, 'Music performance by Sun Der x Kany'],
  [14, 10, 14, 30, KAI_KAEW_A],
  [14, 40, 15, 10, 'Floral garland making demonstration by the Thai Women’s Circle'],
  [15, 20, 15, 45, 'Thailand trivia with Kru Aom'],
  [15, 45, 16, 5, BREAK, 'rest'],
  [16, 5, 16, 30, MUAY_THAI],
  [16, 40, 17, 0, 'Music performance by Sun Der x Kany'],
  [17, 10, 17, 30, KAI_KAEW_B],
  [17, 40, 18, 5, 'Influencer panel with @boscoandsharon'],
  [18, 5, 18, 25, 'Thailand trivia with Kru Aom'],
  [18, 25, 18, 40, BREAK, 'rest'],
  [18, 40, 19, 0, 'Music performance by Sun Der x Kany'],
  [19, 10, 19, 30, MUAY_THAI],
  [19, 30, 19, 45, 'Kiosks introduced by the MC'],
  [19, 45, 20, 0, 'Quiz game by the MC'],
  [20, 0, 20, 15, BREAK, 'rest'],
  [20, 15, 20, 45, KAI_KAEW_B],
  [21, 0, 21, 30, 'Nora beading demonstration by SACIT'],
  [21, 40, 22, 0, 'Music performance by Sun Der x Kany'],
  [22, 10, 22, 30, KAI_KAEW_C],
  [22, 30, 22, 45, 'Lucky Draw'],
  [22, 45, 23, 0, 'The MC closes the festival'],
])

const day2Second = build('Second Stage', [
  [10, 30, 11, 10, KIM],
  [11, 20, 12, 20, 'Youth talent show'],
  [12, 20, 12, 40, BREAK, 'rest'],
  [12, 40, 14, 10, DANCE_CLASS],
  [14, 20, 15, 20, THAI_GAMES],
  [15, 20, 15, 45, KIM],
  [15, 45, 16, 5, BREAK, 'rest'],
  [16, 5, 16, 45, 'Thai dance demonstration by Kai Kaew'],
  [16, 55, 17, 30, KIM],
  [17, 40, 18, 25, 'Instrument demonstration by Sun Der'],
  [18, 25, 18, 40, BREAK, 'rest'],
  [18, 40, 20, 0, DANCE_CLASS],
  [20, 0, 20, 15, BREAK, 'rest'],
  [20, 15, 21, 15, 'Instrument demonstration by Sun Der'],
  [21, 25, 22, 0, 'Thailand trivia and Thai language with Kru Aom'],
  [22, 10, 22, 30, KIM],
])

const day2Workshop = build('Workshops', [
  [10, 0, 10, 20, 'Registration and preparation'],
  [10, 20, 11, 50, TOTE],
  [12, 0, 13, 30, 'Fruit and soap carving workshop by the Thai Women’s Circle'],
  [13, 40, 15, 10, 'Bamboo weaving workshop by SACIT'],
  [15, 20, 16, 50, UMBRELLA],
  [17, 0, 18, 25, 'Pin making workshop by SACIT'],
  [18, 25, 18, 40, BREAK, 'rest'],
  [18, 40, 20, 0, 'Nora beading workshop by SACIT'],
  [20, 0, 20, 15, BREAK, 'rest'],
  [20, 15, 21, 30, UMBRELLA],
  [21, 40, 23, 0, TOTE],
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
  ['Kai Kaew', 'Classical dance, puppet theatre and the umbrella painting workshop'],
  ['Sun Der', 'Music and Thai instruments, with Kany on both days'],
  ['Yasothara Thai Dance', 'Thai dance classes on the secondary stage'],
  ['UAE Muay Thai and Kickboxing Federation', 'Muay Thai demonstrations'],
  ['SACIT', 'Bamboo weaving, pin making and Nora beading'],
  ['Thai Women’s Circle', 'Floral garlands, fruit and soap carving'],
  ['Royal Thai Embassy', 'Thai games, tote bag decoration and Thai art colouring'],
  ['Dusit Thani Abu Dhabi', 'Kim instrument on the secondary stage'],
  ['Kru Aom', 'Thailand trivia and Thai language'],
]
