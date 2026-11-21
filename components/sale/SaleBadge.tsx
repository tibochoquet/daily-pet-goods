import { sale } from '@/config/sale'

/**
 * Het "-10%"-label op productkaarten en productpagina's.
 *
 * Geen 'use client': zonder directive is dit component zowel in een
 * server- als in een client component te gebruiken, en dat is nodig
 * omdat de productpagina en de winkelwagen client components zijn.
 *
 * Het percentage komt uit config/sale.ts en het rood uit app/globals.css,
 * dus een wijziging daar werkt hier mee. Altijd het basispercentage:
 * de 20% hangt van de hele winkelwagen af en is dus geen belofte die een
 * los product kan doen.
 *
 * Klein, strak, zonder slagschaduw en zonder ring. Dat is het verschil
 * tussen een label en een sticker: op een foto van een hondenmand moet
 * dit een prijskaartje zijn, geen opgeplakte knalaanbieding. Rood is al
 * genoeg om het als eerste te zien tussen "Nieuw" (groen) en
 * "Bestseller" (terracotta).
 */
export default function SaleBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block rounded-full bg-bf-red px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white ${className}`}
    >
      &minus;{sale.discountPercent}%
    </span>
  )
}
