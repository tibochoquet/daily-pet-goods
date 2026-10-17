'use client'

import { useState } from 'react'

/** Afmelden gebeurt pas na een klik, nooit door het openen van de link. */
export default function AfmeldKnop({ token }: { token: string }) {
  const [stand, setStand] = useState<'klaar' | 'bezig' | 'gelukt' | 'fout'>('klaar')

  if (stand === 'gelukt') {
    return (
      <p className="text-[#2C4A3E] font-medium">
        Gelukt. Je krijgt geen reviewverzoeken meer van ons.
      </p>
    )
  }

  return (
    <div>
      <button
        disabled={stand === 'bezig'}
        onClick={async () => {
          setStand('bezig')
          try {
            const res = await fetch('/api/afmelden', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token }),
            })
            setStand(res.ok ? 'gelukt' : 'fout')
          } catch {
            setStand('fout')
          }
        }}
        className="bg-[#2C4A3E] text-white font-semibold px-7 py-3 rounded-full hover:bg-[#3D6456] disabled:opacity-60"
      >
        {stand === 'bezig' ? 'Bezig…' : 'Afmelden'}
      </button>
      {stand === 'fout' && (
        <p className="text-sm text-[#C8745A] mt-4">Dat lukte niet. Probeer het later nog eens of mail ons.</p>
      )}
    </div>
  )
}
