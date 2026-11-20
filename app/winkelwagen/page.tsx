import type { Metadata } from 'next'
import { isSaleActive } from '@/config/sale'
import CartClient from './CartClient'

export const metadata: Metadata = {
  title: 'Winkelwagen',
  robots: { index: false, follow: true },
}

/**
 * Serverschil om de winkelwagen heen, alleen om te bepalen of de actie
 * loopt.
 *
 * `force-dynamic` en niet de hervalidatie van vijf minuten uit de root
 * layout: dit is de pagina waar iemand het bedrag ziet dat hij meteen
 * daarna gaat betalen, dus daar moet de actiestatus van dit moment
 * gelden en niet die van maximaal vijf minuten terug. Het kost niets -
 * de winkelwagen staat in de browser van de bezoeker, deze pagina haalt
 * geen data op.
 *
 * De browser rekent dit niet zelf uit. Een bezoeker met een verkeerd
 * gezette klok zou anders korting zien die de checkout daarna weigert.
 */
export const dynamic = 'force-dynamic'

export default function CartPage() {
  return <CartClient saleActive={isSaleActive()} />
}
