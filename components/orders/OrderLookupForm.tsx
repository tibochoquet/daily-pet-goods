'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

const NOT_FOUND_MESSAGE = 'We konden geen bestelling vinden met deze gegevens. Controleer je bestelnummer en probeer het opnieuw.'

export default function OrderLookupForm() {
  const router = useRouter()
  const [form, setForm] = useState({ orderRef: '', email: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [error, setError] = useState('')

  function handleField(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/orders/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setError(data.error || NOT_FOUND_MESSAGE)
        setStatus('error')
        return
      }
      router.push(`/mijn-bestelling/${encodeURIComponent(data.order.orderRef)}`)
    } catch {
      setError(NOT_FOUND_MESSAGE)
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-[#6B7280] mb-1">Bestelnummer</label>
        <input
          name="orderRef"
          required
          value={form.orderRef}
          onChange={handleField}
          placeholder="DPG-XXXXXXX"
          className="w-full bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#B0A898] focus:outline-none focus:border-[#2C4A3E] focus:ring-2 focus:ring-[#2C4A3E]/10 transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[#6B7280] mb-1">E-mailadres</label>
        <input
          type="email"
          name="email"
          required
          value={form.email}
          onChange={handleField}
          placeholder="jouw@email.nl"
          className="w-full bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#B0A898] focus:outline-none focus:border-[#2C4A3E] focus:ring-2 focus:ring-[#2C4A3E]/10 transition-all"
        />
      </div>
      {status === 'error' && <p className="text-sm text-[#C8745A]">{error}</p>}
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
