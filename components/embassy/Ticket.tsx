'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Wallet } from 'lucide-react'
import { CEREMONY_EVENT, guestReference, inviteUrl } from '@/lib/embassy/ticket'
import { C, sans, serif } from './ui'

/**
 * The guest's ticket for the Opening Ceremony.
 *
 * A real ticket shape: a stub with the name and reference, a perforation,
 * and the QR code the Embassy's staff read at the door. The QR opens the
 * guest's own copy of the invitation, so a phone with no scanner app still
 * does something sensible with it.
 *
 * The wallet buttons only appear once the corresponding pass signing is
 * configured on the server, which Apple and Google each gate differently.
 * Until then the ticket itself works perfectly well on its own.
 */

type WalletStatus = { apple: boolean; google: boolean }

function Perforation() {
  return (
    <div className="relative my-5 flex items-center" aria-hidden="true">
      <span
        className="absolute -left-[26px] h-6 w-6 rounded-full"
        style={{ background: C.pale, boxShadow: 'inset 0 0 0 1px rgba(3,122,138,0.14)' }}
      />
      <span
        className="absolute -right-[26px] h-6 w-6 rounded-full"
        style={{ background: C.pale, boxShadow: 'inset 0 0 0 1px rgba(3,122,138,0.14)' }}
      />
      <span
        className="h-px w-full"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(3,122,138,0.34) 0 7px, transparent 7px 14px)',
        }}
      />
    </div>
  )
}

export default function Ticket({ guest }: { guest: string }) {
  const [wallets, setWallets] = useState<WalletStatus>({ apple: false, google: false })
  const name = guest.trim() || 'Guest of the Embassy'
  const reference = guestReference(name)
  const url = inviteUrl(name)

  useEffect(() => {
    let alive = true
    fetch('/api/wallet/status')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d) setWallets({ apple: Boolean(d.apple), google: Boolean(d.google) })
      })
      .catch(() => {
        /* no wallets offered, the ticket still stands */
      })
    return () => {
      alive = false
    }
  }, [])

  const walletHref = (kind: 'apple' | 'google') =>
    `/api/wallet/${kind}?to=${encodeURIComponent(name)}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-[380px]"
    >
      <div
        className="relative overflow-hidden rounded-[26px] px-7 py-7"
        style={{
          background: 'rgba(255,255,255,0.92)',
          boxShadow: '0 18px 46px rgba(1,88,102,0.16)',
          border: '1px solid rgba(3,122,138,0.14)',
        }}
      >
        <div className="text-center">
          <p
            className="text-[10.5px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: C.teal }}
          >
            Marhaba Thailand
          </p>
          <h3 className="mt-1.5 text-[26px] leading-tight" style={{ fontFamily: serif, color: C.tealDeep }}>
            {CEREMONY_EVENT.title}
          </h3>
          <p className="mt-1 text-[13.5px]" style={{ color: C.inkSoft }}>
            {CEREMONY_EVENT.day} · {CEREMONY_EVENT.time}
          </p>
        </div>

        <Perforation />

        <dl className="grid grid-cols-2 gap-y-3 text-left">
          <div className="col-span-2">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: C.teal }}>
              Guest
            </dt>
            <dd className="mt-0.5 text-[16px]" style={{ color: C.ink }}>
              {name}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: C.teal }}>
              Reference
            </dt>
            <dd className="mt-0.5 font-mono text-[15px] tracking-[0.08em]" style={{ color: C.ink }}>
              {reference}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: C.teal }}>
              Where
            </dt>
            <dd className="mt-0.5 text-[13px] leading-snug" style={{ color: C.ink }}>
              Main Atrium, Ground Floor
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col items-center">
          <div
            className="rounded-2xl bg-white p-3.5"
            style={{ boxShadow: '0 8px 22px rgba(1,88,102,0.12)' }}
          >
            <QRCodeSVG value={url} size={148} bgColor="#ffffff" fgColor="#015866" level="M" />
          </div>
          <p className="mt-2.5 text-center text-[11.5px]" style={{ color: C.inkSoft }}>
            Show this at the door
          </p>
        </div>

        {(wallets.apple || wallets.google) && (
          <div className="mt-6 flex flex-col gap-2.5">
            {wallets.apple && (
              <a
                href={walletHref('apple')}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-[13.5px] font-medium"
                style={{ background: '#000000', color: '#ffffff', fontFamily: sans }}
              >
                <Wallet className="h-4 w-4" /> Add to Apple Wallet
              </a>
            )}
            {wallets.google && (
              <a
                href={walletHref('google')}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-[13.5px] font-medium"
                style={{ background: '#202124', color: '#ffffff', fontFamily: sans }}
              >
                <Wallet className="h-4 w-4" /> Save to Google Wallet
              </a>
            )}
          </div>
        )}

        <p
          className="mt-6 text-center text-[10.5px] uppercase tracking-[0.16em]"
          style={{ color: 'rgba(70,112,122,0.75)' }}
        >
          Designed and built by WeThink
        </p>
      </div>
    </motion.div>
  )
}
