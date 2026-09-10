/* ────────────────────────────────────────────────────────────
   WeThink's five lines of work.

   The canonical list. The services page, the company profile, the home
   page orbit, the contact form and the assistant all read from here, so
   renaming a line renames it everywhere rather than in four places and
   not the fifth.
   ──────────────────────────────────────────────────────────── */

export type ServiceLine = {
  id: 1 | 2 | 3 | 4 | 5
  title: string
  /** the brief form, for places with no room for the full title: the
      printed business card uses these */
  short: string
  /** one line, as it reads on the company profile */
  summary: string
  /** the areas the line covers, for a dropdown or a quick answer */
  covers: string[]
}

export const SERVICE_LINES: ServiceLine[] = [
  {
    id: 1,
    title: 'Digital Transformation & AI',
    short: 'AI & Digital Solutions',
    summary:
      'Modernize operations with practical AI, automation and digital solutions that improve efficiency, agility and service delivery.',
    covers: [
      'Workflow automation',
      'AI assistants',
      'Intelligent customer support',
      'Document automation',
      'Process digitization',
      'System integration',
    ],
  },
  {
    id: 2,
    title: 'Data Analytics & Decision Intelligence',
    short: 'Data & Analytics',
    summary: 'Turn information into clearer performance visibility and better decisions.',
    covers: [
      'Data analysis',
      'Management dashboards',
      'KPI frameworks',
      'Performance reporting',
      'Data visualization',
      'Decision-support tools',
    ],
  },
  {
    id: 3,
    title: 'Business Systems & Digital Platforms',
    short: 'Websites & Systems',
    summary: 'Enable reliable delivery through scalable systems, platforms and digital services.',
    covers: [
      'ERP and CRM solutions',
      'Custom applications',
      'Websites and portals',
      'Booking platforms',
      'Internal systems',
      'Digital service design',
    ],
  },
  {
    id: 4,
    title: 'Strategy, Transformation & Optimization',
    short: 'Business Consulting',
    summary: 'Set direction, prioritize improvements and translate insight into action.',
    covers: [
      'Digital strategy',
      'Process reviews',
      'Operational optimization',
      'Feasibility studies',
      'Transformation planning',
      'Solution roadmaps',
    ],
  },
  {
    id: 5,
    title: 'Brand, Events & Media',
    short: 'Branding & Events',
    summary: 'Strengthen communication and engagement across professional audience touchpoints.',
    covers: [
      'Corporate branding',
      'Official and corporate events',
      'Digital event experiences',
      'Event registration',
      'Photography and videography',
      'Media production',
    ],
  },
]

export const SERVICE_TITLES = SERVICE_LINES.map((s) => s.title)
export const SERVICE_SHORT = SERVICE_LINES.map((s) => s.short)
