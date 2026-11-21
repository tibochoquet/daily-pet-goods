import { isSaleActive } from '@/config/sale'
import { getVariantById } from './products'
import type { CartLine } from './discounts'
import {
  SALE_DISCOUNT_CODE,
  saleCartTotals,
  saleDiscountLabel,
  type SaleCartLine,
  type SaleDiscount,
} from './sale'

/**
 * De actiekorting over een winkelwagen, aan de serverkant.
 *
 * Staat los van lib/sale.ts omdat hiervoor de productdata nodig is: dit
 * hoort bij de server (checkout, en het overzicht dat de winkelwagen
 * ophaalt), niet bij de browserbundel.
 *
 * Net als `calculateDiscount` in lib/discounts.ts neemt dit alleen
 * variant-id's en aantallen aan en zoekt de prijs er zelf bij. Een
 * bedrag of een prijs uit de browser wordt nooit vertrouwd.
 *
 * Het rekenwerk zelf staat hier níet: dat is `saleCartTotals` in
 * lib/sale.ts, dezelfde functie die de winkelwagenpagina gebruikt. Deze
 * functie doet alleen de vertaling van id's naar prijzen. Zou de server
 * zijn eigen variant van de formule hebben, dan is een afwijking van een
 * cent tussen scherm en Stripe een kwestie van tijd - en dat is precies
 * het verschil dat niet mag bestaan.
 */
export function calculateSaleDiscount(items: CartLine[], now: Date = new Date()): SaleDiscount | null {
  const lines: SaleCartLine[] = []

  for (const item of items) {
    const found = getVariantById(item.id)
    if (!found) continue
    // Zonder prijs valt er niets te korten; zo'n variant hoort sowieso
    // niet in een winkelwagen te zitten.
    if (found.variant.price === null) continue
    lines.push({ price: found.variant.price, quantity: item.quantity })
  }

  const totals = saleCartTotals(lines, isSaleActive(now))
  if (!totals.active || totals.amountOff <= 0) return null

  return {
    label: saleDiscountLabel(totals.percent),
    code: SALE_DISCOUNT_CODE,
    percentOff: totals.percent,
    subtotal: totals.subtotal,
    amountOff: totals.amountOff,
  }
}
