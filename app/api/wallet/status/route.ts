import { NextResponse } from 'next/server'

/**
 * Which wallets are actually wired up.
 *
 * The invitation asks this before drawing the buttons, so a guest is
 * never offered a pass that cannot be signed. Both halves can go live
 * independently, which they will, since Apple needs a certificate and
 * Google needs issuer approval.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(
    {
      apple: Boolean(
        process.env.APPLE_PASS_TYPE_ID &&
          process.env.APPLE_TEAM_ID &&
          process.env.APPLE_PASS_SIGNER_CERT &&
          process.env.APPLE_PASS_SIGNER_KEY &&
          process.env.APPLE_WWDR_CERT,
      ),
      google: Boolean(
        process.env.GOOGLE_WALLET_ISSUER_ID &&
          process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL &&
          process.env.GOOGLE_WALLET_PRIVATE_KEY,
      ),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
