import { Truck } from 'lucide-react'
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
 * Of de actie loopt wordt op de server bepaald. Deze balk staat in de
 * root layout, dus elke pagina erft hem; app/layout.tsx heeft daarom
 * `revalidate` staan, zodat de balk binnen vijf minuten verschijnt en
 * verdwijnt zonder deploy.
 */
export default function AnnouncementBar() {
  if (isSaleActive()) {
    return (
      <div className="bg-[#1A1A1A] text-white text-xs sm:text-sm py-2.5 px-4">
        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5 leading-tight">
          <span className="font-semibold uppercase tracking-wider">{sale.campaign}</span>
          <span className="text-white/85">
            {sale.discountPercent}% korting
            <span className="hidden sm:inline"> op alles</span>
          </span>
          <SaleCountdown className="text-white/55" />
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
