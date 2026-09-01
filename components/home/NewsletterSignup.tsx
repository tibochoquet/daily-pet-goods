'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react'
import { business } from '@/lib/business'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email || status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Aanmelden mislukt')
      setStatus('sent')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="py-16 md:py-24 bg-[#F3EDE3]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-12 h-12 bg-[#2C4A3E]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mail size={22} className="text-[#2C4A3E]" />
        </div>

        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
          Blijf op de hoogte
        </h2>
        <p className="text-[#6B7280] leading-relaxed mb-8">
          Nieuwe producten, seizoensuitjes en praktische tips voor huisdierverzorging, rechtstreeks in je inbox. Geen spam, ooit. Altijd op te zeggen.
        </p>

        {status === 'sent' ? (
          <div className="flex items-center justify-center gap-3 bg-[#2C4A3E]/10 text-[#2C4A3E] rounded-2xl py-5 px-6">
            <CheckCircle2 size={20} />
            <span className="font-medium">Je bent aangemeld! We houden je op de hoogte.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jouw@email.nl"
              className="flex-1 bg-white border border-[#E8E2D9] rounded-full px-5 py-3.5 text-sm text-[#1A1A1A] placeholder:text-[#B0A898] focus:outline-none focus:border-[#2C4A3E] focus:ring-2 focus:ring-[#2C4A3E]/10 transition-all"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex items-center gap-2 bg-[#2C4A3E] text-white font-semibold px-5 py-3.5 rounded-full hover:bg-[#3D6456] transition-colors text-sm shrink-0 disabled:opacity-60"
            >
              {status === 'sending' ? 'Bezig…' : 'Aanmelden'}
              <ArrowRight size={14} />
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-xs text-[#C8745A] mt-3">
            Er ging iets mis bij het aanmelden. Probeer het nogmaals of mail ons op {business.email}.
          </p>
        )}

        <p className="text-xs text-[#B0A898] mt-4">
          Door je aan te melden ga je akkoord met ons{' '}
          <Link href="/privacy" className="underline hover:text-[#6B7280]">privacybeleid</Link>. Altijd op te zeggen.
        </p>
      </div>
    </section>
  )
}
