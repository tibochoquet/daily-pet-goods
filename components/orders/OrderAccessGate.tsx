'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

const NOT_FOUND_MESSAGE = 'We konden geen bestelling vinden met deze gegevens. Controleer je bestelnummer en probeer het opnieuw.'

/**
 * Re-verification gate for a direct/bookmarked /mijn-bestelling/[orderRef]
 * visit with no (or an expired) order-access cookie. Reuses the same
 * lookup endpoint as the landing page's form - on success it sets a fresh
 * cookie, and router.refresh() re-runs the page's Server Component so it
 * picks that cookie up and renders the real order.
 */
export default function OrderAccessGate({ orderRef }: { orderRef: string }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/orders/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderRef, email }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setStatus('error')
        return
      }
      router.refresh()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="jouw@email.nl"
        className="w-full bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#B0A898] focus:outline-none focus:border-[#2C4A3E] focus:ring-2 focus:ring-[#2C4A3E]/10 transition-all"
      />
      {status === 'error' && <p className="text-sm text-[#C8745A]">{NOT_FOUND_MESSAGE}</p>}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-[#2C4A3E] text-white font-semibold py-3 rounded-xl hover:bg-[#3D6456] transition-colors text-sm disabled:opacity-60"
      >
        {status === 'sending' ? 'Bezig…' : 'Bestelling bekijken'}
      </button>
    </form>
  )
}
