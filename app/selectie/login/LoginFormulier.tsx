'use client'

import { useState } from 'react'

export default function LoginFormulier({ bestemming }: { bestemming: string }) {
  const [wachtwoord, setWachtwoord] = useState('')
  const [fout, setFout] = useState('')
  const [bezig, setBezig] = useState(false)

  async function verstuur(e: React.FormEvent) {
    e.preventDefault()
    if (!wachtwoord || bezig) return
    setBezig(true)
    setFout('')
    try {
      const res = await fetch('/api/selectie/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wachtwoord }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setFout(data.error || 'Inloggen lukte niet.')
        setBezig(false)
        return
      }
      // Hard navigeren, niet via de router: de poort in proxy.ts kijkt
      // naar de cookie, en die is er pas na deze reactie.
      window.location.href = bestemming
    } catch {
      setFout('Geen verbinding. Probeer het opnieuw.')
      setBezig(false)
    }
  }

  return (
    <form onSubmit={verstuur} className="bg-white border border-[#E8E2D9] rounded-2xl p-6">
      <label htmlFor="wachtwoord" className="block text-sm font-medium text-[#1A1A1A] mb-2">
        Wachtwoord
      </label>
      <input
        id="wachtwoord"
        type="password"
        autoComplete="current-password"
        autoFocus
        value={wachtwoord}
        onChange={(e) => setWachtwoord(e.target.value)}
        className="w-full bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#2C4A3E] transition-colors"
      />
      {fout && <p className="text-sm text-[#C8745A] mt-3">{fout}</p>}
      <button
        type="submit"
        disabled={!wachtwoord || bezig}
        className="mt-5 w-full bg-[#2C4A3E] text-white font-semibold text-sm py-3 rounded-full hover:bg-[#3D6456] transition-colors disabled:opacity-50"
      >
        {bezig ? 'Bezig…' : 'Inloggen'}
      </button>
      <p className="text-xs text-[#9CA3AF] mt-4 text-center">Je blijft 30 dagen ingelogd op dit apparaat.</p>
    </form>
  )
}
