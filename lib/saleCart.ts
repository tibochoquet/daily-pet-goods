import { isSaleActive, sale } from '@/config/sale'
import { getVariantById } from './products'
import type { CartLine } from './discounts'
import {
  SALE_DISCOUNT_CODE,
  saleDiscountCents,
  saleDiscountLabel,
  toCents,
  type SaleDiscount,
} from './sale'

/**
 * De actiekorting over een winkelwagen.
 *
 * Staat los van lib/sale.ts omdat hiervoor de productdata nodig is: dit
 * hoort bij de server (checkout, en het overzicht dat de winkelwagen
 * ophaalt), niet bij de browserbundel.
 *
 * Net als `calculateDiscount` in lib/discounts.ts neemt dit alleen
 * variant-id's en aantallen aan en zoekt de prijs er zelf bij. Een
 * bedrag of een prijs uit de browser wordt nooit vertrouwd.
 */

/**
 * Afronden gebeurt per stuk en niet over het subtotaal, en dat is geen
 * detail. De klant ziet op de productpagina de prijs van één stuk, dus
 * twee keer dat product moet precies twee keer dat bedrag zijn. Over het
 * subtotaal afronden wijkt daar bij sommige prijzen een cent van af:
 * 10% over twee keer 19,95 is 3,99 als je het over 39,90 rekent, maar
 * 4,00 als je twee keer 2,00 rekent - en dat laatste is wat er op de
 * pagina stond.
 *
 * Geeft `null` als de actie niet loopt of er niets te korten valt.
 */
export function calculateSaleDiscount(items: CartLine[], now: Date = new Date()): SaleDiscount | null {
  if (!isSaleActive(now)) return null

  let subtotalCents = 0
  let discountCents = 0

  for (const item of items) {
    const found = getVariantById(item.id)
    if (!found) continue
    // Zonder prijs valt er niets te korten; zo'n variant hoort sowieso
    // niet in een winkelwagen te zitten.
    if (found.variant.price === null) continue
    const quantity = Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 0
    if (quantity === 0) continue
    const baseCents = toCents(found.variant.price)
    subtotalCents += baseCents * quantity
    discountCents += saleDiscountCents(baseCents) * quantity
  }

  if (discountCents <= 0) return null

  return {
    label: saleDiscountLabel(),
    code: SALE_DISCOUNT_CODE,
    percentOff: sale.discountPercent,
    subtotal: subtotalCents / 100,
    amountOff: discountCents / 100,
  }
}
