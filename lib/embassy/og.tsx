import { ImageResponse } from 'next/og'
import { PASS_IMAGES } from './pass-assets'

/**
 * The card that appears whenever one of these links is pasted into WhatsApp,
 * an email, or a chat.
 *
 * Every forward of an invitation is a place the studio's name can sit, so the
 * mark travels with the link rather than only living on the page. The logo is
 * embedded rather than fetched, so the card renders the same everywhere and
 * never depends on the network.
 */

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_TYPE = 'image/png'

const LOGO = `data:image/png;base64,${PASS_IMAGES['logo@2x.png'].toString('base64')}`

export function ogImage({
  eyebrow,
  title,
  meta,
}: {
  eyebrow: string
  title: string
  meta: string
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '68px 76px',
          background: 'linear-gradient(135deg, #013F4A 0%, #015866 42%, #037A8A 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        {/* a soft bloom, so the flat gradient reads as lit rather than printed */}
        <div
          style={{
            position: 'absolute',
            top: -220,
            right: -160,
            width: 720,
            height: 720,
            borderRadius: 999,
            background: 'radial-gradient(circle, rgba(79,211,228,0.34) 0%, rgba(1,88,102,0) 68%)',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 25,
              letterSpacing: 9,
              textTransform: 'uppercase',
              color: '#8FD8E3',
            }}
          >
            {eyebrow}
          </div>
          <div style={{ fontSize: 92, lineHeight: 1.05, marginTop: 22, maxWidth: 940 }}>
            {title}
          </div>
          <div style={{ fontSize: 31, marginTop: 26, color: '#C6E9EF' }}>{meta}</div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.22)',
            paddingTop: 28,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO} alt="WeThink" height={78} style={{ height: 78 }} />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: 20,
                paddingLeft: 20,
                borderLeft: '1px solid rgba(255,255,255,0.22)',
              }}
            >
              <span style={{ fontSize: 17, letterSpacing: 4, color: '#8FD8E3' }}>
                DESIGNED AND BUILT BY
              </span>
              <span style={{ fontSize: 36, marginTop: 5 }}>WeThink · wethink.ae</span>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              fontSize: 22,
              color: '#A8DCE5',
            }}
          >
            <span>Royal Thai Embassy</span>
            <span>Abu Dhabi</span>
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  )
}
