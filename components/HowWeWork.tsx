'use client'

import { ParallaxBody, TextParallaxContent } from '@/components/ui/text-parallax-content-scroll'

/**
 * Four scenes, each a sticky full-bleed frame the copy scrolls over.
 *
 * The order is the shape of an engagement: the room where it starts, the
 * meeting where it gets scoped, the workshop where the client's own people
 * learn it, and the desks where it is actually built.
 */

const SCENES = [
  {
    img: '/images/wethink/event.jpg',
    alt: 'Delegates in conversation at a technology event in Abu Dhabi',
    subheading: 'Where it starts',
    heading: 'In the room, not the inbox.',
    title: 'We meet people where the work is',
    body: (
      <>
        <p>
          Most of our work begins in a room in Abu Dhabi rather than through a
          form. A conversation over coffee at an industry event, an introduction
          from someone we delivered for, a question that turns out to be bigger
          than it first looked.
        </p>
        <p>
          It is also why we take briefs seriously before we take them on. The
          fastest way to waste a client&apos;s budget is to start building
          before anyone has agreed what the problem is.
        </p>
      </>
    ),
    href: '/#contact',
    cta: 'Start a conversation',
  },
  {
    img: '/images/wethink/meeting.jpg',
    alt: 'A project meeting around a boardroom table with a system diagram on screen',
    subheading: 'How we scope',
    heading: 'Decisions before code.',
    title: 'The plan is the deliverable first',
    body: (
      <>
        <p>
          Before anything is built we map the system as it is, agree what
          changes, and put numbers against it. Tender pipeline, HSE compliance,
          manpower tracking, whatever the actual operation runs on.
        </p>
        <p>
          Clients see the architecture, the sequence and the cost in one
          session. Nothing gets committed to until it is legible to the people
          who will live with it.
        </p>
      </>
    ),
    href: '/services',
    cta: 'How we work',
  },
  {
    img: '/images/wethink/workshop.jpg',
    alt: 'A hands-on training workshop with participants at laptops',
    subheading: 'Handover',
    heading: 'Your team runs it after we leave.',
    title: 'We train the people who inherit it',
    body: (
      <>
        <p>
          A system nobody in the organisation understands is a liability, not an
          asset. Every engagement ends with the client&apos;s own team able to
          operate, extend and troubleshoot what we built.
        </p>
        <p>
          That means workshops, written runbooks and a period where we are on
          hand while your people drive.
        </p>
      </>
    ),
    href: '/services',
    cta: 'Our services',
  },
  {
    img: '/images/wethink/office.jpg',
    alt: 'The WeThink team at work on Al Reem Island, Abu Dhabi',
    subheading: 'Delivery',
    heading: 'Built here, in Abu Dhabi.',
    title: 'One team, on Al Reem Island',
    body: (
      <>
        <p>
          Cloud architecture, security, custom software and data all sit in one
          room, which is why they ship as one thing rather than four vendors
          blaming each other at integration.
        </p>
        <p>
          Same time zone, same city, same people from the first meeting to the
          handover.
        </p>
      </>
    ),
    href: '/work',
    cta: 'See the work',
  },
]

export default function HowWeWork() {
  return (
    <section style={{ background: 'var(--bg)' }}>
      {SCENES.map((s) => (
        <TextParallaxContent
          key={s.img}
          imgUrl={s.img}
          alt={s.alt}
          subheading={s.subheading}
          heading={s.heading}
        >
          <ParallaxBody title={s.title} body={s.body} href={s.href} cta={s.cta} />
        </TextParallaxContent>
      ))}
    </section>
  )
}
