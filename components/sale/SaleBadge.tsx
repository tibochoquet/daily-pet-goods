import { sale } from '@/config/sale'

/**
 * Het "-10%"-label op productkaarten en productpagina's.
 *
 * Geen 'use client': zonder directive is dit component zowel in een
 * server- als in een client component te gebruiken, en dat is nodig
 * omdat de productpagina en de winkelwagen client components zijn.
 *
 * Het percentage komt uit config/sale.ts en het rood uit app/globals.css,
 * dus een wijziging daar werkt hier mee.
 *
 * Fel rood in plaats van de terracotta of het groen van de huisstijl:
 * die twee zijn al in gebruik voor "Nieuw" en "Bestseller", en naast
 * elkaar op dezelfde kaart moet dit label het opvallendste zijn. De
 * witte ring zet het ook op een donkere productfoto nog los van de
 * achtergrond.
 */
export default function SaleBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block bg-sale text-white text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-md ring-1 ring-white/50 ${className}`}
    >
      &minus;{sale.discountPercent}%
    </span>
  )
}
