'use client'

import { useState, FormEvent } from 'react'
import { CheckCircle2 } from 'lucide-react'

export default function LoginRequestForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/auth/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Aanvragen mislukt')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex items-center gap-3 bg-[#2C4A3E]/10 text-[#2C4A3E] rounded-xl p-4 text-sm">
        <CheckCircle2 size={20} className="shrink-0" />
        <span>Check je inbox! We hebben een inloglink gestuurd naar {email}.</span>
      </div>
    )
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
      {status === 'error' && <p className="text-sm text-[#C8745A]">Er ging iets mis. Probeer het nogmaals.</p>}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-[#2C4A3E] text-white font-semibold py-3 rounded-xl hover:bg-[#3D6456] transition-colors text-sm disabled:opacity-60"
      >
        {status === 'sending' ? 'Bezig…' : 'Inloglink versturen en mijn bestellingen bekijken'}
      </button>
    </form>
  )
}
