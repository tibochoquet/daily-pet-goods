import { sale } from '@/config/sale'

/**
 * Het "-10%"-label op productkaarten en productpagina's.
 *
 * Geen 'use client': zonder directive is dit component zowel in een
 * server- als in een client component te gebruiken, en dat is nodig
 * omdat de productpagina en de winkelwagen client components zijn.
 *
 * Het percentage komt uit config/sale.ts, dus een wijziging daar werkt
 * hier mee. Zwart in plaats van de terracotta of het groen van de
 * huisstijl: die twee zijn al in gebruik voor "Nieuw" en "Bestseller",
 * en naast elkaar op dezelfde kaart moet dit label het opvallendste
 * zijn.
 */
export default function SaleBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${className}`}
    >
      &minus;{sale.discountPercent}%
    </span>
  )
}
