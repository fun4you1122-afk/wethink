import { NextRequest, NextResponse } from 'next/server'
import { PKPass } from 'passkit-generator'
import { PASS_IMAGES } from '@/lib/embassy/pass-assets'
import { CEREMONY_EVENT, cleanName, guestReference, inviteUrl } from '@/lib/embassy/ticket'

/**
 * "Add to Apple Wallet" for the Opening Ceremony.
 *
 * Apple will not open an unsigned pass, so this needs a Pass Type ID and
 * its signing certificate from a paid Apple Developer account. The pass
 * is built in memory and handed straight back, which keeps guest names
 * off our disk entirely.
 *
 *   APPLE_PASS_TYPE_ID          pass.ae.wethink.marhaba
 *   APPLE_TEAM_ID               the ten character team identifier
 *   APPLE_PASS_SIGNER_CERT      signer certificate PEM, base64 encoded
 *   APPLE_PASS_SIGNER_KEY       signer private key PEM, base64 encoded
 *   APPLE_PASS_SIGNER_PASSWORD  passphrase on the key, if there is one
 *   APPLE_WWDR_CERT             Apple WWDR intermediate PEM, base64 encoded
 */

export const runtime = 'nodejs'

const pem = (v?: string) => (v ? Buffer.from(v, 'base64').toString('utf8') : '')

function appleWalletConfigured() {
  return Boolean(
    process.env.APPLE_PASS_TYPE_ID &&
      process.env.APPLE_TEAM_ID &&
      process.env.APPLE_PASS_SIGNER_CERT &&
      process.env.APPLE_PASS_SIGNER_KEY &&
      process.env.APPLE_WWDR_CERT,
  )
}

export async function GET(req: NextRequest) {
  if (!appleWalletConfigured()) {
    return NextResponse.json({ error: 'Apple Wallet is not configured' }, { status: 501 })
  }

  const name = cleanName(req.nextUrl.searchParams.get('to'))
  const guest = name || 'Guest of the Embassy'
  const ref = guestReference(guest)

  try {
    const pass = new PKPass(
      { ...PASS_IMAGES },
      {
        wwdr: pem(process.env.APPLE_WWDR_CERT),
        signerCert: pem(process.env.APPLE_PASS_SIGNER_CERT),
        signerKey: pem(process.env.APPLE_PASS_SIGNER_KEY),
        signerKeyPassphrase: process.env.APPLE_PASS_SIGNER_PASSWORD || undefined,
      },
      {
        formatVersion: 1,
        passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID!,
        teamIdentifier: process.env.APPLE_TEAM_ID!,
        organizationName: 'WeThink',
        description: 'Marhaba Thailand · Opening Ceremony',
        serialNumber: `opening-${ref}`,
        backgroundColor: 'rgb(1, 88, 102)',
        foregroundColor: 'rgb(255, 255, 255)',
        labelColor: 'rgb(168, 224, 232)',
        logoText: 'Marhaba Thailand',
      },
    )

    pass.type = 'eventTicket'
    pass.setRelevantDate(new Date(CEREMONY_EVENT.start))
    // so the pass surfaces on the lock screen when the guest reaches the mall
    pass.setLocations({
      latitude: CEREMONY_EVENT.lat,
      longitude: CEREMONY_EVENT.lon,
      relevantText: 'Marhaba Thailand · Opening Ceremony',
    })

    pass.primaryFields.push({
      key: 'event',
      label: 'Ceremony',
      value: CEREMONY_EVENT.title,
    })
    pass.secondaryFields.push(
      { key: 'guest', label: 'Guest', value: guest },
      { key: 'date', label: 'Date', value: 'Fri 11 Sept 2026' },
    )
    pass.auxiliaryFields.push(
      { key: 'time', label: 'Time', value: CEREMONY_EVENT.time },
      { key: 'ref', label: 'Reference', value: ref },
    )
    pass.backFields.push(
      { key: 'host', label: 'Hosted by', value: CEREMONY_EVENT.host },
      { key: 'venue', label: 'Where', value: `${CEREMONY_EVENT.venue}\n${CEREMONY_EVENT.venueFull}` },
      { key: 'invite', label: 'Your invitation', value: inviteUrl(guest) },
      {
        key: 'programme',
        label: 'Festival programme',
        value: 'https://www.wethink.ae/embassy/programme',
      },
      { key: 'by', label: 'Designed and built by', value: 'WeThink · wethink.ae' },
    )

    pass.setBarcodes({
      format: 'PKBarcodeFormatQR',
      message: inviteUrl(guest),
      messageEncoding: 'iso-8859-1',
      altText: ref,
    })

    const buffer = pass.getAsBuffer()
    const file = `marhaba-opening-${ref}.pkpass`

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="${file}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('apple wallet pass failed', err)
    return NextResponse.json({ error: 'Could not build the pass' }, { status: 500 })
  }
}
