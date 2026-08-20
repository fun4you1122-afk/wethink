import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { CEREMONY_EVENT, cleanName, guestReference, inviteUrl } from '@/lib/embassy/ticket'

/**
 * "Save to Google Wallet" for the Opening Ceremony.
 *
 * Google accepts a signed JWT that carries the pass class and object
 * inline, so there is no separate class to create first and nothing for
 * us to store. The link it produces is single-use per guest and safe to
 * put in an email.
 *
 * Needs three environment variables, all from the Google Pay and Wallet
 * Console plus a service account key:
 *   GOOGLE_WALLET_ISSUER_ID
 *   GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL
 *   GOOGLE_WALLET_PRIVATE_KEY   (the PEM, newlines may be written as \n)
 */

export const runtime = 'nodejs'

const CLASS_SUFFIX = 'marhaba_opening_2026'

function googleWalletConfigured() {
  return Boolean(
    process.env.GOOGLE_WALLET_ISSUER_ID &&
      process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_WALLET_PRIVATE_KEY,
  )
}

export async function GET(req: NextRequest) {
  if (!googleWalletConfigured()) {
    return NextResponse.json({ error: 'Google Wallet is not configured' }, { status: 501 })
  }

  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID!
  const issuer = process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL!
  const key = process.env.GOOGLE_WALLET_PRIVATE_KEY!.replace(/\\n/g, '\n')

  const name = cleanName(req.nextUrl.searchParams.get('to'))
  const guest = name || 'Guest of the Embassy'
  const ref = guestReference(guest)
  const classId = `${issuerId}.${CLASS_SUFFIX}`
  const objectId = `${issuerId}.opening_${ref}`

  const eventTicketClass = {
    id: classId,
    issuerName: 'WeThink',
    reviewStatus: 'UNDER_REVIEW',
    eventName: { defaultValue: { language: 'en-GB', value: 'Marhaba Thailand · Opening Ceremony' } },
    venue: {
      name: { defaultValue: { language: 'en-GB', value: CEREMONY_EVENT.venueFull } },
      address: { defaultValue: { language: 'en-GB', value: CEREMONY_EVENT.venue } },
    },
    dateTime: { start: CEREMONY_EVENT.start, end: CEREMONY_EVENT.end },
    hexBackgroundColor: '#015866',
    logo: {
      sourceUri: { uri: 'https://www.wethink.ae/wethink-logo.png' },
      contentDescription: { defaultValue: { language: 'en-GB', value: 'WeThink' } },
    },
    homepageUri: {
      uri: 'https://www.wethink.ae',
      description: 'wethink.ae',
    },
  }

  const eventTicketObject = {
    id: objectId,
    classId,
    state: 'ACTIVE',
    ticketHolderName: guest,
    ticketNumber: ref,
    barcode: {
      type: 'QR_CODE',
      value: inviteUrl(guest),
      alternateText: ref,
    },
    textModulesData: [
      { header: 'Hosted by', body: CEREMONY_EVENT.host, id: 'host' },
      { header: 'Time', body: CEREMONY_EVENT.time, id: 'time' },
      { header: 'Where', body: CEREMONY_EVENT.venue, id: 'where' },
    ],
    linksModuleData: {
      uris: [
        { uri: inviteUrl(guest), description: 'Your invitation', id: 'invitation' },
        {
          uri: 'https://www.wethink.ae/embassy/programme',
          description: 'Festival programme',
          id: 'programme',
        },
      ],
    },
  }

  const token = jwt.sign(
    {
      iss: issuer,
      aud: 'google',
      typ: 'savetowallet',
      origins: ['https://www.wethink.ae'],
      payload: { eventTicketClasses: [eventTicketClass], eventTicketObjects: [eventTicketObject] },
    },
    key,
    { algorithm: 'RS256' },
  )

  return NextResponse.redirect(`https://pay.google.com/gp/v/save/${token}`)
}
