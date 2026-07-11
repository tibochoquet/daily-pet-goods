'use client'

import { useState, FormEvent } from 'react'
import { CheckCircle2 } from 'lucide-react'

export default function ContactForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  function handleField(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Versturen mislukt')
      setStatus('sent')
      setForm({ firstName: '', lastName: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="bg-white rounded-2xl p-8 border border-[#E8E2D9] flex items-center gap-3">
        <CheckCircle2 size={24} className="text-[#2C4A3E] shrink-0" />
        <div>
          <h2 className="font-serif text-xl font-bold text-[#1A1A1A] mb-1">Bericht verzonden</h2>
          <p className="text-sm text-[#6B7280]">Bedankt! We reageren binnen 24 uur op werkdagen.</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E2D9] space-y-5">
      <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-2">Stuur ons een bericht</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
            Voornaam
          </label>
          <input
            type="text"
            name="firstName"
            required
            value={form.firstName}
            onChange={handleField}
            placeholder="Emma"
            className="w-full bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#B0A898] focus:outline-none focus:border-[#2C4A3E] focus:ring-2 focus:ring-[#2C4A3E]/10 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
            Achternaam
          </label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleField}
            placeholder="de Vries"
            className="w-full bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#B0A898] focus:outline-none focus:border-[#2C4A3E] focus:ring-2 focus:ring-[#2C4A3E]/10 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
          E-mailadres
        </label>
        <input
          type="email"
          name="email"
          required
          value={form.email}
          onChange={handleField}
          placeholder="emma@voorbeeld.nl"
          className="w-full bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#B0A898] focus:outline-none focus:border-[#2C4A3E] focus:ring-2 focus:ring-[#2C4A3E]/10 transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
          Onderwerp
        </label>
        <select
          name="subject"
          value={form.subject}
          onChange={handleField}
          className="w-full bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#2C4A3E] focus:ring-2 focus:ring-[#2C4A3E]/10 transition-all"
        >
          <option value="">Kies een onderwerp...</option>
          <option value="Productvraag">Productvraag</option>
          <option value="Maatadvies">Maatadvies</option>
          <option value="Bestelling / levering">Bestelling / levering</option>
          <option value="Retour of ruilen">Retour of ruilen</option>
          <option value="Zakelijke aanvraag">Zakelijke aanvraag</option>
          <option value="Anders">Anders</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
          Bericht
        </label>
        <textarea
          name="message"
          rows={5}
          required
          value={form.message}
          onChange={handleField}
          placeholder="Vertel ons waar we mee kunnen helpen..."
          className="w-full bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#B0A898] focus:outline-none focus:border-[#2C4A3E] focus:ring-2 focus:ring-[#2C4A3E]/10 transition-all resize-none"
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-[#C8745A]">
          Er ging iets mis bij het versturen. Probeer het nogmaals of mail rechtstreeks naar hello@dailypetgoods.nl.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-[#2C4A3E] text-white font-semibold py-3.5 rounded-xl hover:bg-[#3D6456] transition-colors text-sm disabled:opacity-60"
      >
        {status === 'sending' ? 'Bezig met versturen…' : 'Bericht versturen'}
      </button>

      <p className="text-xs text-[#B0A898] text-center">
        We reageren doorgaans binnen 24 uur op werkdagen.
      </p>
    </form>
  )
}
