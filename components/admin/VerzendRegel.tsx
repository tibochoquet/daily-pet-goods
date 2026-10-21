'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminOrder } from '@/lib/adminOrders'
import { CARRIERS, type Carrier } from '@/lib/carriers'
import { formatPrice } from '@/lib/business'

/** Kopieert een waarde en laat kort zien dat het gelukt is. */
function KopieerVeld({ label, waarde }: { label: string; waarde: string }) {
  const [gekopieerd, setGekopieerd] = useState(false)
  if (!waarde) return null
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-[11px] uppercase tracking-wide text-[#9CA3AF] w-20 shrink-0">{label}</span>
      <span className="text-sm text-[#1A1A1A] break-words">{waarde}</span>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(waarde)
            setGekopieerd(true)
            setTimeout(() => setGekopieerd(false), 1200)
          } catch {
            // Clipboard kan geweigerd worden; dan selecteer je maar met de hand.
          }
        }}
        className="text-[11px] text-[#2C4A3E] hover:underline shrink-0"
      >
        {gekopieerd ? 'gekopieerd' : 'kopieer'}
      </button>
    </div>
  )
}

type Stap = 'invoer' | 'bevestigen' | 'bezig'

export default function VerzendRegel({ order, modus }: { order: AdminOrder; modus: 'nieuw' | 'mail-open' | 'verzonden' }) {
  const router = useRouter()
  const [carrier, setCarrier] = useState<Carrier>((order.carrier as Carrier) ?? 'DHL')
  const [nummer, setNummer] = useState(order.trackingNumber ?? '')
  const [stap, setStap] = useState<Stap>('invoer')
  const [fout, setFout] = useState('')
  const [klaar, setKlaar] = useState('')

  async function verstuur(actie: 'verzend' | 'opnieuw' | 'corrigeer') {
    setStap('bezig')
    setFout('')
    try {
      const res = await fetch('/api/admin/verzenden', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stripeSessionId: order.stripeSessionId, carrier, trackingNumber: nummer, actie }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setFout(data.error || 'Er ging iets mis.')
        setStap('invoer')
        return
      }
      setKlaar(data.bericht ?? 'Gelukt.')
      router.refresh()
    } catch {
      setFout('Verbinding mislukt.')
      setStap('invoer')
    }
  }

  const adresRegel = [order.klant.postcode, order.klant.plaats].filter(Boolean).join(' ')

  return (
    <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <div>
          <span className="font-semibold text-[#1A1A1A]">{order.orderRef}</span>
          <span className="text-xs text-[#9CA3AF] ml-3">
            {new Date(order.placedAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
        <span className="text-sm text-[#4B5563]">{formatPrice(order.totaal / 100)}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <KopieerVeld label="Naam" waarde={order.klant.naam} />
          <KopieerVeld label="Adres" waarde={order.klant.straat} />
          <KopieerVeld label="Postcode" waarde={order.klant.postcode} />
          <KopieerVeld label="Plaats" waarde={order.klant.plaats} />
          <KopieerVeld label="E-mail" waarde={order.email} />
          {adresRegel && <KopieerVeld label="Pc + plaats" waarde={adresRegel} />}
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wide text-[#9CA3AF] mb-1.5">In te pakken</p>
          <ul className="text-sm text-[#4B5563] space-y-1">
            {order.regels.length ? (
              order.regels.map((r, i) => (
                <li key={i}>
                  {r.aantal}× {r.naam}
                </li>
              ))
            ) : (
              <li className="text-[#9CA3AF]">Regels niet op te halen uit Stripe</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-[#E8E2D9]">
        {/* Wat de klant nu in zijn mail heeft staan. Zonder dit zie je
            niet waar je iets aan verandert. */}
        {modus === 'verzonden' && order.trackingUrl && (
          <p className="text-sm text-[#6B7280] mb-4">
            De klant kreeg <strong className="text-[#1A1A1A]">{order.carrier}</strong>{' '}
            <strong className="text-[#1A1A1A]">{order.trackingNumber}</strong> —{' '}
            <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="text-[#2C4A3E] underline">
              die link
            </a>
            {order.shippingEmailSentAt && (
              <span className="text-[#9CA3AF]">
                {' '}
                op {new Date(order.shippingEmailSentAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })}
              </span>
            )}
            .
          </p>
        )}
        {klaar ? (
          <p className="text-sm text-[#2C4A3E] font-medium">{klaar}</p>
        ) : stap === 'bevestigen' ? (
          <div className="bg-[#F3EDE3] rounded-xl p-4">
            <p className="text-sm text-[#1A1A1A] mb-3">
              Mail naar <strong>{order.email}</strong> met nummer <strong>{nummer}</strong> via{' '}
              <strong>{carrier}</strong>?
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => verstuur(modus === 'mail-open' ? 'opnieuw' : 'verzend')}
                className="bg-[#2C4A3E] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#3D6456]"
              >
                Ja, versturen
              </button>
              <button
                onClick={() => setStap('invoer')}
                className="text-sm text-[#6B7280] px-4 py-2.5 hover:text-[#1A1A1A]"
              >
                Terug
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wide text-[#9CA3AF] mb-1">Vervoerder</label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value as Carrier)}
                className="bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-sm"
              >
                {CARRIERS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] uppercase tracking-wide text-[#9CA3AF] mb-1">Trackingnummer</label>
              <input
                value={nummer}
                onChange={(e) => setNummer(e.target.value)}
                placeholder="plak hier"
                className="w-full bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-sm"
              />
            </div>
            {/* De mail is hier al de deur uit, dus "opslaan en mailen"
                zou alleen maar geweigerd worden. Corrigeren is dan de
                enige zinnige actie en dus de hoofdknop. */}
            {modus !== 'verzonden' && (
              <button
                disabled={!nummer.trim() || stap === 'bezig'}
                onClick={() => setStap('bevestigen')}
                className="bg-[#2C4A3E] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#3D6456] disabled:opacity-50"
              >
                {stap === 'bezig' ? 'Bezig…' : modus === 'mail-open' ? 'Mail opnieuw proberen' : 'Opslaan en mailen'}
              </button>
            )}
            {/* Een nummer verbeteren mag nooit een tweede mail sturen,
                dus dat is een aparte knop zonder bevestigingsstap. */}
            {order.shippingEmailSentAt && (
              <button
                disabled={!nummer.trim() || stap === 'bezig'}
                onClick={() => verstuur('corrigeer')}
                className={
                  modus === 'verzonden'
                    ? 'bg-[#2C4A3E] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#3D6456] disabled:opacity-50'
                    : 'text-sm text-[#6B7280] underline px-2 py-2.5 hover:text-[#1A1A1A] disabled:opacity-50'
                }
              >
                {stap === 'bezig' ? 'Bezig…' : modus === 'verzonden' ? 'Vervoerder en nummer corrigeren' : 'Alleen nummer corrigeren'}
              </button>
            )}
          </div>
        )}
        {fout && <p className="text-sm text-[#C8745A] mt-3">{fout}</p>}
      </div>
    </div>
  )
}
