/**
 * The capability icons for the company profile.
 *
 * Drawn here rather than pulled from a clip-art set: they have to sit in one
 * weight beside each other on a page, recolour with the brand, and stay sharp
 * when the deck is printed at 338 mm wide. All of them live on a 24 unit grid
 * with a 1.7 stroke, no fills, round caps.
 */

type P = { className?: string }
const g = (d: React.ReactNode) => (
  <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </g>
)
const S = ({ children, className = '' }: { children: React.ReactNode } & P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">{children}</svg>
)

export const ICONS = {
  flow: (p: P) => <S {...p}>{g(<><rect x="2.5" y="3" width="7" height="5.5" rx="1.4" /><rect x="14.5" y="15.5" width="7" height="5.5" rx="1.4" /><path d="M6 8.5v6a3 3 0 0 0 3 3h5.5" /></>)}</S>,
  ai: (p: P) => <S {...p}>{g(<><rect x="5.5" y="6.5" width="13" height="11" rx="3" /><path d="M12 3v3.5M9.5 11.5h.01M14.5 11.5h.01M9.5 14.5h5M2.5 10.5v3M21.5 10.5v3" /></>)}</S>,
  chat: (p: P) => <S {...p}>{g(<><path d="M20.5 12.2c0 4-3.8 7.2-8.5 7.2a10 10 0 0 1-2.6-.34L4.2 21l1.1-3.5A6.8 6.8 0 0 1 3.5 12.2C3.5 8.2 7.3 5 12 5s8.5 3.2 8.5 7.2Z" /><path d="M8.6 12h.01M12 12h.01M15.4 12h.01" /></>)}</S>,
  doc: (p: P) => <S {...p}>{g(<><path d="M14 2.8H7.2A2.2 2.2 0 0 0 5 5v14a2.2 2.2 0 0 0 2.2 2.2h9.6A2.2 2.2 0 0 0 19 19V7.8Z" /><path d="M14 2.8V7.8H19M8.6 12.5h6.8M8.6 16h4.4" /></>)}</S>,
  scan: (p: P) => <S {...p}>{g(<><path d="M3.2 8V5.4A2.2 2.2 0 0 1 5.4 3.2H8M16 3.2h2.6A2.2 2.2 0 0 1 20.8 5.4V8M20.8 16v2.6a2.2 2.2 0 0 1-2.2 2.2H16M8 20.8H5.4a2.2 2.2 0 0 1-2.2-2.2V16M3.2 12h17.6" /></>)}</S>,
  link: (p: P) => <S {...p}>{g(<><path d="M10.2 13.8a4 4 0 0 0 5.9.35l2.6-2.6a4 4 0 0 0-5.66-5.66l-1.4 1.4" /><path d="M13.8 10.2a4 4 0 0 0-5.9-.35l-2.6 2.6a4 4 0 0 0 5.66 5.66l1.4-1.4" /></>)}</S>,
  chart: (p: P) => <S {...p}>{g(<><path d="M3.5 20.5h17M6.5 20.5v-6M11 20.5V8M15.5 20.5v-8.5M20 20.5V5" /></>)}</S>,
  dash: (p: P) => <S {...p}>{g(<><rect x="3" y="3.5" width="18" height="17" rx="2.4" /><path d="M3 8.6h18M7.6 12.4v4.6M11.9 11v6M16.2 13.8v3.2" /></>)}</S>,
  target: (p: P) => <S {...p}>{g(<><circle cx="12" cy="12" r="8.2" /><circle cx="12" cy="12" r="4.4" /><circle cx="12" cy="12" r=".9" /></>)}</S>,
  report: (p: P) => <S {...p}>{g(<><rect x="4" y="2.8" width="16" height="18.4" rx="2.2" /><path d="M8 8h8M8 12h8M8 16h5" /></>)}</S>,
  compass: (p: P) => <S {...p}>{g(<><circle cx="12" cy="12" r="8.6" /><path d="m15.4 8.6-2 5.4-5.4 2 2-5.4Z" /></>)}</S>,
  blocks: (p: P) => <S {...p}>{g(<><rect x="3" y="3" width="7.4" height="7.4" rx="1.6" /><rect x="13.6" y="3" width="7.4" height="7.4" rx="1.6" /><rect x="3" y="13.6" width="7.4" height="7.4" rx="1.6" /><rect x="13.6" y="13.6" width="7.4" height="7.4" rx="1.6" /></>)}</S>,
  mobile: (p: P) => <S {...p}>{g(<><rect x="6.6" y="2.4" width="10.8" height="19.2" rx="2.6" /><path d="M10.6 18.6h2.8" /></>)}</S>,
  browser: (p: P) => <S {...p}>{g(<><rect x="2.6" y="4" width="18.8" height="16" rx="2.4" /><path d="M2.6 9h18.8M6 6.5h.01M8.6 6.5h.01" /></>)}</S>,
  portal: (p: P) => <S {...p}>{g(<><path d="M4.6 21V5.4a2 2 0 0 1 1.5-1.94l8-2A2 2 0 0 1 16.6 3.4V21M2.8 21h18.4M13.4 12.2h.01" /></>)}</S>,
  calendar: (p: P) => <S {...p}>{g(<><rect x="3.2" y="4.8" width="17.6" height="16" rx="2.2" /><path d="M3.2 10h17.6M8 2.8v4M16 2.8v4M8 14h3M8 17.4h6.6" /></>)}</S>,
  server: (p: P) => <S {...p}>{g(<><rect x="3" y="3.4" width="18" height="7" rx="1.8" /><rect x="3" y="13.6" width="18" height="7" rx="1.8" /><path d="M7 7h.01M7 17.1h.01" /></>)}</S>,
  sliders: (p: P) => <S {...p}>{g(<><path d="M5 21v-6.4M5 10.4V3M12 21v-9.6M12 7.2V3M19 21v-4.2M19 12.6V3" /><circle cx="5" cy="12.5" r="1.9" /><circle cx="12" cy="9.3" r="1.9" /><circle cx="19" cy="14.7" r="1.9" /></>)}</S>,
  pen: (p: P) => <S {...p}>{g(<><path d="m14.6 4.6 4.8 4.8M3.4 20.6l1-4.6L15.9 4.6a2.1 2.1 0 0 1 3 0l1.5 1.5a2.1 2.1 0 0 1 0 3L8.9 20.6Z" /></>)}</S>,
  cloud: (p: P) => <S {...p}>{g(<><path d="M7.2 19h10a4.4 4.4 0 0 0 .6-8.76 6 6 0 0 0-11.5.9A3.9 3.9 0 0 0 7.2 19Z" /></>)}</S>,
  refresh: (p: P) => <S {...p}>{g(<><path d="M20.4 12a8.4 8.4 0 1 1-2.6-6.1" /><path d="M20.8 4.2v5h-5" /></>)}</S>,
  gauge: (p: P) => <S {...p}>{g(<><path d="M3.6 17.4a9 9 0 1 1 16.8 0" /><path d="m12 13.6 4-4M12 17.4h.01" /></>)}</S>,
  search: (p: P) => <S {...p}>{g(<><circle cx="10.6" cy="10.6" r="6.8" /><path d="m15.6 15.6 4.8 4.8" /></>)}</S>,
  route: (p: P) => <S {...p}>{g(<><circle cx="5.4" cy="5.4" r="2.4" /><circle cx="18.6" cy="18.6" r="2.4" /><path d="M7.8 5.4h6.4a3.8 3.8 0 0 1 0 7.6H9.8a3.8 3.8 0 0 0 0 7.6h6.4" /></>)}</S>,
  palette: (p: P) => <S {...p}>{g(<><path d="M12 20.8a8.8 8.8 0 1 1 0-17.6c4.9 0 8.8 3.3 8.8 7.4 0 2.2-1.9 3.6-4 3.6h-1.6a1.9 1.9 0 0 0-1.3 3.3 1.7 1.7 0 0 1-1.2 3Z" /><path d="M7.6 10.6h.01M11 7.4h.01M15 8.6h.01" /></>)}</S>,
  megaphone: (p: P) => <S {...p}>{g(<><path d="M3.4 10v4a1.8 1.8 0 0 0 1.8 1.8h1.6L14 20V4l-7.2 4.2H5.2A1.8 1.8 0 0 0 3.4 10Z" /><path d="M17.6 8.6a4.6 4.6 0 0 1 0 6.8M7 15.8V21" /></>)}</S>,
  ticket: (p: P) => <S {...p}>{g(<><path d="M3.2 8.6V6.4a1.8 1.8 0 0 1 1.8-1.8h14a1.8 1.8 0 0 1 1.8 1.8v2.2a2.8 2.8 0 0 0 0 5.6v3.4a1.8 1.8 0 0 1-1.8 1.8H5a1.8 1.8 0 0 1-1.8-1.8v-3.4a2.8 2.8 0 0 0 0-5.6Z" /><path d="M12 6.8v2M12 11v2M12 15.2v2" /></>)}</S>,
  screen: (p: P) => <S {...p}>{g(<><rect x="2.6" y="3.6" width="18.8" height="13" rx="2.2" /><path d="M8.4 20.4h7.2M12 16.6v3.8" /></>)}</S>,
  badge: (p: P) => <S {...p}>{g(<><rect x="3.4" y="5" width="17.2" height="14" rx="2.4" /><circle cx="9" cy="11" r="2.2" /><path d="M5.8 16.4a3.6 3.6 0 0 1 6.4 0M15 10h3.4M15 13.6h3.4" /></>)}</S>,
  camera: (p: P) => <S {...p}>{g(<><path d="M3.2 8.6a2 2 0 0 1 2-2h1.9l1.3-2.2h7.2l1.3 2.2h1.9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5.2a2 2 0 0 1-2-2Z" /><circle cx="12" cy="13" r="3.6" /></>)}</S>,
  film: (p: P) => <S {...p}>{g(<><rect x="2.8" y="4.4" width="18.4" height="15.2" rx="2.2" /><path d="M7.6 4.4v15.2M16.4 4.4v15.2M2.8 12h18.4M2.8 8.2h4.8M2.8 15.8h4.8M16.4 8.2h4.8M16.4 15.8h4.8" /></>)}</S>,
  slides: (p: P) => <S {...p}>{g(<><rect x="2.8" y="3.6" width="18.4" height="12.4" rx="2" /><path d="M12 16v4.4M8.6 20.4h6.8M7 8.4h6M7 11.6h4" /></>)}</S>,
  play: (p: P) => <S {...p}>{g(<><circle cx="12" cy="12" r="8.8" /><path d="m10.2 8.6 5.2 3.4-5.2 3.4Z" /></>)}</S>,
  shield: (p: P) => <S {...p}>{g(<><path d="M12 21.2s7.2-3.3 7.2-8.8V5.8L12 2.8 4.8 5.8v6.6c0 5.5 7.2 8.8 7.2 8.8Z" /><path d="m9.2 12.2 2 2 3.6-3.8" /></>)}</S>,
  people: (p: P) => <S {...p}>{g(<><circle cx="9" cy="8.2" r="3.4" /><path d="M2.8 20.2a6.2 6.2 0 0 1 12.4 0" /><path d="M16.4 5.2a3.4 3.4 0 0 1 0 6.6M17.4 14.6a6.2 6.2 0 0 1 3.8 5.6" /></>)}</S>,
  spark: (p: P) => <S {...p}>{g(<><path d="M12 2.8 13.9 9 20 11l-6.1 2L12 19.2 10.1 13 4 11l6.1-2Z" /><path d="M18.6 17.4 19.4 20l2.4.9-2.4.9-.8 2.6" /></>)}</S>,
} as const

export type IconName = keyof typeof ICONS

/** Capability text is free-form, so the icon is chosen by what it says. */
const RULES: [RegExp, IconName][] = [
  [/workflow|process digit|automat/i, 'flow'],
  [/\bai\b|assistant|intelligent/i, 'ai'],
  [/support|customer/i, 'chat'],
  [/document/i, 'doc'],
  [/integrat/i, 'link'],
  [/dashboard/i, 'dash'],
  [/kpi|framework/i, 'target'],
  [/report/i, 'report'],
  [/visuali/i, 'chart'],
  [/decision|analysis|analytic|data captur|\bdata\b/i, 'compass'],
  [/erp|crm/i, 'blocks'],
  [/application|custom app/i, 'mobile'],
  [/website|web\b/i, 'browser'],
  [/portal/i, 'portal'],
  [/booking/i, 'calendar'],
  [/internal system|system/i, 'server'],
  [/configuration|optimi/i, 'sliders'],
  [/service design|design/i, 'pen'],
  [/environment|digital environment/i, 'cloud'],
  [/strategy|roadmap|transformation plan/i, 'route'],
  [/review|process review/i, 'refresh'],
  [/feasib/i, 'gauge'],
  [/research|market/i, 'search'],
  [/brand|corporate brand/i, 'palette'],
  [/communicat|institutional/i, 'megaphone'],
  [/registration/i, 'badge'],
  [/event/i, 'ticket'],
  [/digital event/i, 'screen'],
  [/photograph/i, 'camera'],
  [/videograph/i, 'film'],
  [/presentation/i, 'slides'],
  [/media|content/i, 'play'],
  [/trust|quality|responsib/i, 'shield'],
  [/user|people|team|organization/i, 'people'],

  /* The "why" and "how" pages and the outcomes list are prose, not product
     nouns, so they need their own rules or they all fall through to one
     icon and the page reads as a wall of the same mark. */
  [/efficien/i, 'gauge'],
  [/utilization|resource/i, 'sliders'],
  [/connected|faster/i, 'link'],
  [/visibility/i, 'target'],
  [/understand/i, 'search'],
  [/assess/i, 'gauge'],
  [/define/i, 'target'],
  [/implement|deploy/i, 'flow'],
  [/operations first|business and operations/i, 'compass'],
  [/purpose/i, 'target'],
  [/measurable|impact|value/i, 'chart'],
  [/execution|practical/i, 'route'],
  [/growth|sustainab|innovation/i, 'spark'],
]

export function iconFor(text: string): IconName {
  for (const [re, name] of RULES) if (re.test(text)) return name
  return 'spark'
}

export function CapIcon({ name, className = '' }: { name: IconName; className?: string }) {
  const I = ICONS[name]
  return <I className={className} />
}
