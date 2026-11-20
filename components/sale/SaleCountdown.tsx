'use client'

import { useEffect, useState } from 'react'
import { saleEnd } from '@/config/sale'

/**
 * Hoelang de actie nog loopt, aftikkend per seconde.
 *
 * Rekent pas na `mounted` en niet al bij de server-render. De pagina's
 * van deze site zijn statisch met ISR, dus een op de server berekende
 * countdown zou het verschil zijn tussen nu en het moment waarop de
 * pagina gegenereerd werd - tot vijf minuten mis, en vóór de actie zelfs
 * dagen. Beter een lege plek van een tel lang dan een verkeerd getal.
 *
 * De breedte staat vast (`min-w`, `tabular-nums`) zodat de balk niet
 * verspringt op het moment dat het getal verschijnt of van 10 naar 9
 * tekens gaat.
 */
function resterend(ms: number) {
  const totaalSeconden = Math.max(0, Math.floor(ms / 1000))
  const dagen = Math.floor(totaalSeconden / 86400)
  const uren = Math.floor((totaalSeconden % 86400) / 3600)
  const minuten = Math.floor((totaalSeconden % 3600) / 60)
  const seconden = totaalSeconden % 60
  const tweecijferig = (n: number) => String(n).padStart(2, '0')
  const klok = `${tweecijferig(uren)}:${tweecijferig(minuten)}:${tweecijferig(seconden)}`
  return dagen > 0 ? `${dagen}d ${klok}` : klok
}

export default function SaleCountdown({ className = '' }: { className?: string }) {
  const [over, setOver] = useState<string | null>(null)

  useEffect(() => {
    function tik() {
      const resterendMs = saleEnd.getTime() - Date.now()
      // Afgelopen: niets meer tonen. De balk zelf verdwijnt pas bij de
      // volgende hervalidatie van de pagina, maar een countdown die op
      // 00:00:00 blijft staan of negatief wordt, is slechter dan geen
      // countdown.
      setOver(resterendMs <= 0 ? null : resterend(resterendMs))
    }
    tik()
    const timer = setInterval(tik, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <span
      className={`inline-block min-w-[5.75rem] text-center tabular-nums ${className}`}
      aria-live="off"
    >
      {over ?? '\u00a0'}
    </span>
  )
}
