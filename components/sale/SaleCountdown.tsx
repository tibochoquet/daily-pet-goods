'use client'

import { useEffect, useState } from 'react'
import { saleEnd } from '@/config/sale'

/**
 * Hoelang de actie nog loopt, in de balk bovenaan.
 *
 * Staat nog op precies één plek op de site. Hij stond eerst ook in de
 * hero, en twee klokken boven elkaar op hetzelfde scherm maken van een
 * winkel een aftelpagina.
 *
 * Rekent pas na `mounted` en niet al bij de server-render. De pagina's
 * van deze site zijn statisch met ISR, dus een op de server berekende
 * countdown zou het verschil zijn tussen nu en het moment waarop de
 * pagina gegenereerd werd - tot vijf minuten mis, en vóór de actie zelfs
 * dagen. Beter een lege plek van een tel lang dan een verkeerd getal.
 *
 * De breedte staat vast (`min-w`, `tabular-nums`) zodat de balk niet
 * verspringt op het moment dat het getal verschijnt of van vorm
 * verandert.
 */

/**
 * Compact, en van vorm wisselend: met meer dan een dag te gaan "9d 2u",
 * daarbinnen de klok "02:34:11".
 *
 * Seconden tien dagen lang laten meetikken kost in de balk ongeveer
 * evenveel ruimte als de hele actietekst, en ze zeggen op dat moment
 * niets - "nog negen dagen" is dan de informatie. In het laatste etmaal
 * is het omgekeerd: dan is de klok juist wél wat telt.
 */
function resterend(ms: number) {
  const totaalSeconden = Math.max(0, Math.floor(ms / 1000))
  const dagen = Math.floor(totaalSeconden / 86400)
  const uren = Math.floor((totaalSeconden % 86400) / 3600)
  if (dagen > 0) return `${dagen}d ${uren}u`
  const minuten = Math.floor((totaalSeconden % 3600) / 60)
  const seconden = totaalSeconden % 60
  const tweecijferig = (n: number) => String(n).padStart(2, '0')
  return `${tweecijferig(uren)}:${tweecijferig(minuten)}:${tweecijferig(seconden)}`
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
      className={`inline-block min-w-[4.25rem] text-center tabular-nums ${className}`}
      aria-live="off"
    >
      {over ?? ' '}
    </span>
  )
}
