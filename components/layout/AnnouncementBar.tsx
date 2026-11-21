import { Truck } from 'lucide-react'
import { isSaleActive, sale, saleTierLabel } from '@/config/sale'
import SaleCountdown from '@/components/sale/SaleCountdown'

/**
 * De balk bovenaan elke pagina.
 *
 * Tijdens de actie vervangt de actieregel de verzendbelofte in plaats
 * van eronder te komen: twee balken boven elkaar duwen op een telefoon
 * de halve eerste schermvullende indruk weg. Gratis verzending staat ook
 * nog op de productpagina, in de hero en bij het afrekenen.
 *
 * Effen diep rood, dunne witte caps met veel letterafstand. Geen
 * streeppatroon en geen verloop: de balk staat vlak boven een crème
 * pagina met serif-koppen, en een textuur erin maakt er een
 * uitverkoopsticker van. Het rood doet het werk, de typografie houdt het
 * netjes. Het rood staat in app/globals.css.
 *
 * Altijd precies één regel hoog, ook op 320px. Daarom `whitespace-nowrap`
 * plus één segment dat pas vanaf `sm` meedoet: op een telefoon staat de
 * volledige belofte er (beide percentages) met de countdown, en vanaf
 * een tablet komt de campagnenaam er vooraan bij. Twee regels rood boven
 * een pagina is geen balk meer maar een vlak.
 *
 * Of de actie loopt wordt op de server bepaald. Deze balk staat in de
 * root layout, dus elke pagina erft hem; app/layout.tsx heeft daarom
 * `revalidate` staan, zodat de balk binnen vijf minuten verschijnt en
 * verdwijnt zonder deploy.
 */
export default function AnnouncementBar() {
  if (isSaleActive()) {
    return (
      <div className="bg-bf-red text-white">
        <div className="flex items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] sm:gap-3.5 sm:text-[11px]">
          <span className="hidden sm:inline">{sale.campaign}</span>
          <span className="hidden text-white/40 sm:inline" aria-hidden>
            &middot;
          </span>
          <span>
            {sale.discountPercent}% op alles
          </span>
          <span className="text-white/40" aria-hidden>
            &middot;
          </span>
          <span>
            {sale.tierDiscountPercent}% vanaf {saleTierLabel()}
          </span>
          <span className="text-white/40" aria-hidden>
            &middot;
          </span>
          {/* Niet-vet en iets lichter: de klok is de urgentie, niet de
              boodschap. Vet erbij zou drie dingen tegelijk laten
              schreeuwen. */}
          <SaleCountdown className="font-medium tracking-[0.1em] text-white/90" />
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
