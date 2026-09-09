/* ────────────────────────────────────────────────────────────
   The company profile, transcribed from the Embassy-ready deck
   (wethink_CP.pdf, 15 pages). Kept as data so the page, the
   metadata and any future PDF all read from one place.
   ──────────────────────────────────────────────────────────── */

export const COMPANY = {
  legal: 'WeThink Information Technology & Consulting',
  tagline: 'Building smarter, more efficient businesses',
  base: 'Abu Dhabi, United Arab Emirates',
  phone: '+971 50 312 5078',
  phoneHref: 'tel:+971503125078',
  whatsapp: 'https://wa.me/971503125078',
  email: 'info@wethink.ae',
  site: 'www.wethink.ae',
  instagram: 'https://www.instagram.com/wethink.ae/',
}

export const ABOUT = {
  lead:
    'WeThink is an Abu Dhabi-based technology and business solutions company. We help organizations simplify operations, reduce manual work, control costs and make better decisions.',
  pull: 'The right technology should improve how an organization operates.',
  halves: [
    {
      k: 'Technology & Digital Solutions',
      v: 'Business automation, AI, data analytics, ERP/CRM, websites, applications and custom platforms.',
    },
    {
      k: 'Strategy & Communication',
      v: 'Strategy, branding, communication and launch support.',
    },
  ],
}

export const PURPOSE = {
  body:
    'Organizations need to improve performance, enhance services and create lasting value. WeThink brings together technology, AI and digital solutions to optimize operations, strengthen decision-making and build more efficient ways of working.',
  pull: 'Making operations simpler, faster and more efficient.',
}

export const SUPPORTS = [
  'Higher operational efficiency',
  'Smarter resource utilization',
  'Faster, more connected processes',
  'Clearer visibility through data',
  'Better-informed decision-making',
  'Stronger customer and user experiences',
  'Sustainable digital growth',
]

export const VISION =
  'To be a trusted technology partner helping organizations in the UAE and beyond operate smarter, innovate faster, and create lasting value.'

export const MISSION =
  'We combine technology, AI, automation and business understanding to improve operations, support better decisions, and build practical solutions with measurable impact.'

export const VALUES = [
  'Practical innovation',
  'Clear thinking',
  'Real value',
  'Trust',
  'Quality',
  'Responsibility',
]

export type Service = {
  n: string
  title: string
  summary: string
  proposition: string
  listLabel: string
  list: string[]
  approach?: string[]
  outcome?: string
  mockup: 'automation' | 'analytics' | 'platform' | 'roadmap' | 'event'
}

export const SERVICES: Service[] = [
  {
    n: '01',
    title: 'Digital Transformation & AI',
    summary:
      'Modernize operations with practical AI, automation and digital solutions that improve efficiency, agility and service delivery.',
    proposition:
      'We help organizations modernize operations by applying AI, automation and digital technologies to real operational and service needs.',
    listLabel: 'Selected applications',
    list: [
      'Workflow automation',
      'AI assistants',
      'Intelligent customer support',
      'Document automation',
      'Process digitization',
      'System integration',
    ],
    outcome: 'Practical, scalable technology aligned with organizational priorities.',
    mockup: 'automation',
  },
  {
    n: '02',
    title: 'Data Analytics & Decision Intelligence',
    summary: 'Turn information into clearer performance visibility and better decisions.',
    proposition:
      'We turn data into clear, actionable intelligence that supports better decisions at every level.',
    listLabel: 'Capabilities',
    list: [
      'Data analysis',
      'Management dashboards',
      'KPI frameworks',
      'Performance reporting',
      'Data visualization',
      'Decision-support tools',
    ],
    outcome:
      'Clearer performance visibility, faster access to information and evidence-based decisions.',
    mockup: 'analytics',
  },
  {
    n: '03',
    title: 'Business Systems & Digital Platforms',
    summary: 'Enable reliable delivery through scalable systems, platforms and digital services.',
    proposition:
      'We design, implement and integrate the systems and digital platforms that support core operations and digital services.',
    listLabel: 'Capabilities',
    list: [
      'ERP/CRM solutions',
      'Custom applications',
      'Websites',
      'Portals',
      'Booking platforms',
      'Internal systems',
      'Workflow configuration',
      'Digital service design',
      'Integrated digital environments',
    ],
    outcome:
      'Reliable, usable and scalable solutions shaped around organizational requirements and user needs.',
    mockup: 'platform',
  },
  {
    n: '04',
    title: 'Strategy, Transformation & Optimization',
    summary: 'Set direction, prioritize improvements and translate insight into action.',
    proposition:
      'We help organizations define the right direction before investing in implementation.',
    listLabel: 'Capabilities',
    list: [
      'Digital strategy',
      'Process reviews',
      'Operational optimization',
      'Feasibility studies',
      'Market and business research',
      'Transformation planning',
      'Solution roadmaps',
    ],
    approach: [
      'Assess current processes, systems and resources.',
      'Identify improvement opportunities.',
      'Translate findings into priorities and practical execution plans.',
    ],
    mockup: 'roadmap',
  },
  {
    n: '05',
    title: 'Brand, Events & Media',
    summary: 'Strengthen communication and engagement across professional audience touchpoints.',
    proposition:
      'We help organizations communicate clearly, present themselves professionally and engage audiences consistently.',
    listLabel: 'Capabilities',
    list: [
      'Corporate branding',
      'Institutional communication',
      'Official and corporate events',
      'Digital event experiences',
      'Event registration',
      'Photography',
      'Videography',
      'Presentations',
      'Media production',
      'Branded digital content',
    ],
    outcome: 'Professional, consistent audience touchpoints across every engagement.',
    mockup: 'event',
  },
]

export const WHY = [
  ['Business and operations first', 'Start with goals, priorities and the operating environment.'],
  ['Technology with purpose', 'Apply the right technology to a clear business need.'],
  ['Integrated capabilities', 'Bring strategy, technology, data and communication together.'],
  ['Measurable impact', 'Focus on outcomes that improve performance and value.'],
  ['Built around the organization', 'Shape solutions to requirements, resources and users.'],
  ['From strategy to execution', 'Translate direction into practical, supported delivery.'],
]

export const WHY_NOTE =
  'Our experience spans work with companies, organizations and government entities across sectors.'

export const HOW = [
  ['Understand', 'Objectives, operating environment, current systems and expected outcomes.'],
  ['Assess', 'Processes, data, technology and current capabilities.'],
  ['Define', 'Priorities, solution requirements and a practical roadmap.'],
  ['Design & Build', 'The required technology, systems, platforms and processes.'],
  ['Implement', 'Test, deploy and support the solution for real operational use.'],
  ['Optimize', 'Monitor outcomes and improve as priorities and needs evolve.'],
]

export const CORE = [
  ['Strategy & Optimization', 'Sets direction and turns insight into priorities.'],
  ['Digital Transformation & AI', 'Modernizes operations through practical technology.'],
  ['Data & Decision Intelligence', 'Turns information into action.'],
  ['Business Systems & Digital Platforms', 'Enable reliable, scalable delivery.'],
  ['Brand, Events & Media', 'Strengthens communication and engagement.'],
]

export const CORE_NOTE =
  'Together, the five areas connect strategy, delivery and communication around practical business outcomes.'

export const CLOSING = {
  title: 'Let’s build what works better.',
  sub: 'Smarter technology. Better decisions. Stronger operations.',
}
