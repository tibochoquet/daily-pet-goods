import { isSaleActive, sale } from '@/config/sale'

/**
 * De prijsrekenkunde van de actie: van normale prijs naar actieprijs.
 *
 * Bewust zonder import van lib/products.ts, want dit bestand wordt ook
 * door client components gebruikt (winkelwagen, productpagina) en die
 * zouden dan de hele productcatalogus mee de browserbundel in trekken.
 * De kortingsberekening over een winkelwagen heeft die data wél nodig en
 * staat daarom apart, in lib/saleCart.ts.
 *
 * Alles in hele centen: 10% over euro's als kommagetal drijft op
 * sommige winkelwagens een cent weg, en die cent zou dan het verschil
 * zijn tussen wat de klant ziet en wat Stripe int.
 *
 * Over btw valt hier niets te regelen. De prijzen in lib/products.ts
 * zijn btw-inclusief - verplicht bij consumentenprijzen - dus een korting
 * van 10% op zo'n prijs verlaagt het btw-deel in dezelfde verhouding mee.
 * `btwAmount()` in lib/business.ts rekent dat uit over het bedrag dat je
 * hem geeft, dus die krijgt gewoon het totaal ná korting.
 */

/** Centen korting op één stuk, naar boven afgerond bij een halve cent. */
export function saleDiscountCents(baseCents: number): number {
  if (!Number.isFinite(baseCents) || baseCents <= 0) return 0
  return Math.round((baseCents * sale.discountPercent) / 100)
}

/** De actieprijs van één stuk, in centen. */
export function salePriceCents(baseCents: number): number {
  return baseCents - saleDiscountCents(baseCents)
}

/** Euro's naar hele centen, zonder het gedrein van 39.99 * 100 = 3998.9999. */
export function toCents(euro: number): number {
  return Math.round(euro * 100)
}

export interface SalePricing {
  /** Of de actie geldt. Staat hij uit, dan is `current` gelijk aan `base`. */
  active: boolean
  /** De normale prijs uit lib/products.ts: de doorgestreepte "van"-prijs. */
  base: number
  /** Wat de klant nu betaalt. */
  current: number
  /** Het verschil, in euro's. 0 als de actie niet loopt. */
  saved: number
  percent: number
}

/**
 * De enige functie die productkaarten, productpagina, hero-labels en
 * winkelwagen gebruiken om een prijs te tonen.
 *
 * Geeft ook bij een niet-actieve actie een volledig antwoord terug, met
 * `active: false` en `current === base`. Zo hoeft geen enkel component
 * zelf te weten of er een actie loopt - het leest gewoon `active` en
 * toont de doorgestreepte prijs wel of niet.
 *
 * `active` is een parameter en standaard de serverklok. Een client
 * component moet hem meegeven in plaats van de standaard te gebruiken,
 * en krijgt die waarde van de server door als prop. Zou de browser het
 * zelf uitrekenen, dan kan de klok van de bezoeker een andere uitkomst
 * geven dan de HTML die hij net binnenkreeg - React ziet dan een
 * hydratiefout en de prijs kan voor zijn ogen omklappen.
 */
export function pricingFor(base: number | null, active: boolean = isSaleActive()): SalePricing | null {
  if (base === null) return null
  if (!active) {
    return { active: false, base, current: base, saved: 0, percent: sale.discountPercent }
  }
  const baseCents = toCents(base)
  const currentCents = salePriceCents(baseCents)
  return {
    active: true,
    base,
    current: currentCents / 100,
    saved: (baseCents - currentCents) / 100,
    percent: sale.discountPercent,
  }
}

export interface SaleDiscount {
  /** Naast de kortingsregel in het overzicht en in de mail. */
  label: string
  /** Gaat als `discountCode` mee in de Stripe-metadata, zodat je kunt filteren. */
  code: string
  percentOff: number
  /** Subtotaal tegen normale prijzen, in euro's. */
  subtotal: number
  /** De korting zelf, in euro's, al afgerond op hele centen. */
  amountOff: number
}

/** Herkenbaar in Stripe en in de mails, en geen bestaande kortingscode. */
export const SALE_DISCOUNT_CODE = 'BLACKFRIDAY'

/** Het label bij de kortingsregel in winkelwagen, Stripe en mail. */
export function saleDiscountLabel(): string {
  return `${sale.campaign}-korting (${sale.discountPercent}%)`
}
