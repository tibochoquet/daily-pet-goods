import { Clock, Truck } from 'lucide-react'
import { isSaleActive, sale } from '@/config/sale'
import SaleCountdown from '@/components/sale/SaleCountdown'

/**
 * De balk bovenaan elke pagina.
 *
 * Tijdens de actie vervangt de actieregel de verzendbelofte in plaats
 * van eronder te komen: twee balken boven elkaar duwen op een telefoon
 * de halve eerste schermvullende indruk weg. Gratis verzending staat ook
 * nog op de productpagina, in de hero en bij het afrekenen.
 *
 * Fel rood met een diagonale streepjestextuur, en de resterende tijd in
 * een donkerrode pil ernaast. Volle witte tekst, geen white/85: op dit
 * rood zakt dat naar 3.4:1 en dan is de balk wel fel maar niet meer goed
 * leesbaar. Het rood staat in app/globals.css.
 *
 * Of de actie loopt wordt op de server bepaald. Deze balk staat in de
 * root layout, dus elke pagina erft hem; app/layout.tsx heeft daarom
 * `revalidate` staan, zodat de balk binnen vijf minuten verschijnt en
 * verdwijnt zonder deploy.
 */
export default function AnnouncementBar() {
  if (isSaleActive()) {
    return (
      <div className="sale-stripes bg-sale text-white">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-xs leading-tight sm:text-sm">
          <span className="font-bold uppercase tracking-wider">{sale.campaign}</span>
          <span className="font-semibold">
            {sale.discountPercent}% korting
            <span className="hidden sm:inline"> op alles</span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-sale-dark px-2.5 py-0.5 font-semibold">
            <Clock size={12} className="shrink-0" aria-hidden />
            <SaleCountdown />
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#2C4A3E] text-white text-sm text-center py-2.5 px-4">
      <span className="inline-flex items-center gap-2">
        <Truck size={13} className="flex-shrink-0" />
        <span>
          Gratis verzending op elke bestelling
        </span>
      </span>
    </div>
  )
}
