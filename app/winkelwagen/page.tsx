import type { Metadata } from 'next'
import { isSaleActive } from '@/config/sale'
import { products } from '@/lib/products'
import type { TierSuggestie } from '@/components/sale/CartTierProgress'
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

/**
 * De producten die de voortgangsbalk mag voorstellen.
 *
 * Alleen producten met één variant. Bij meerdere maten zou een knop
 * "toevoegen" een maat voor de klant kiezen, en een verkeerde maat komt
 * als retour terug - dat is een slechtere afloop dan een kortere rij
 * suggesties. Uitverkochte varianten vallen er ook uit: de checkout
 * weigert die alsnog.
 *
 * Op de server samengesteld, zodat lib/products.ts niet mee de
 * browserbundel in gaat. Buiten de actie wordt er niets meegestuurd.
 */
function tierSuggesties(): TierSuggestie[] {
  return products.flatMap((product) => {
    if (product.variants.length !== 1) return []
    const variant = product.variants[0]
    if (variant.price === null) return []
    if (!(variant.inStock ?? true)) return []
    return [
      {
        id: variant.id,
        name: product.name,
        variantLabel: variant.label,
        price: variant.price,
        image: variant.image,
      },
    ]
  })
}

export default function CartPage() {
  const saleActive = isSaleActive()
  return <CartClient saleActive={saleActive} tierSuggesties={saleActive ? tierSuggesties() : []} />
}
