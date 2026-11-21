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

/**
 * Centen korting op één stuk bij een gegeven percentage, naar boven
 * afgerond bij een halve cent.
 *
 * Het percentage is een parameter omdat er twee treden zijn: 10% op
 * alles, en 20% zodra het subtotaal de drempel haalt. Welke van de twee
 * geldt, hangt af van de hele winkelwagen en kan dus niet hier worden
 * bepaald - dat doet `saleCartTotals`.
 */
export function discountCentsAt(baseCents: number, percent: number): number {
  if (!Number.isFinite(baseCents) || baseCents <= 0) return 0
  if (!Number.isFinite(percent) || percent <= 0) return 0
  return Math.round((baseCents * percent) / 100)
}

/**
 * Centen korting op één stuk tegen het basispercentage.
 *
 * Dit is wat er op een productkaart en een productpagina staat. Daar is
 * de winkelwagen nog niet bekend, dus daar geldt altijd de onderste
 * trede - een product belooft nooit zelf de 20%. De nudgeregel onder de
 * prijs vertelt hoe je die wel krijgt.
 */
export function saleDiscountCents(baseCents: number): number {
  return discountCentsAt(baseCents, sale.discountPercent)
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
  /**
   * Het verschil, in euro's. 0 als de actie niet loopt.
   *
   * Wordt bewust nergens bij een product getoond. Bij een prijs van
   * 39,99 is dit vier euro, en "je bespaart € 4,00" naast de prijs leest
   * als wéinig korting terwijl de doorgestreepte prijs ernaast het al
   * vertelt. Het bespaarde bedrag staat alleen in de winkelwagen, als
   * kortingsregel over de hele bestelling.
   */
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

/** De drempel voor de tweede trede, in hele centen. */
export const SALE_TIER_THRESHOLD_CENTS = toCents(sale.tierThreshold)

/** Eén regel winkelwagen: de normale prijs van één stuk, en het aantal. */
export interface SaleCartLine {
  price: number
  quantity: number
}

export interface SaleCartTotals {
  /** Of de actie geldt. Staat hij uit, dan is `amountOff` 0. */
  active: boolean
  /** Het percentage dat op déze winkelwagen geldt: 10 of 20. */
  percent: number
  /** Of de drempel gehaald is en dus het hoge percentage geldt. */
  tierReached: boolean
  /** Subtotaal tegen normale prijzen, in euro's. */
  subtotal: number
  /**
   * Wat er nog bij moet voor het hoge percentage, in euro's. 0 zodra de
   * drempel gehaald is of de actie niet loopt.
   */
  remainingForTier: number
  /** De korting, in euro's, al afgerond op hele centen. */
  amountOff: number
  /** Subtotaal minus korting, in euro's. Verzending zit hier niet in. */
  total: number
}

/**
 * De korting over een hele winkelwagen: de enige plek waar dat gerekend
 * wordt.
 *
 * Zowel de winkelwagenpagina (uit de regels in de browser) als de
 * checkout (uit de productdata op de server, via lib/saleCart.ts) roept
 * deze functie aan. Dezelfde formule aan beide kanten is wat garandeert
 * dat Stripe int wat er op het scherm stond; twee keer "ongeveer
 * hetzelfde" uitrekenen scheelt vroeg of laat een cent, en dan is het
 * verschil precies datgene waar een klant over mailt.
 *
 * Twee rondes door de regels, en dat is geen slordigheid:
 *
 * 1. Eerst het subtotaal tegen normale prijzen. Dát bepaalt de trede -
 *    zie de toelichting bij `tierThreshold` in config/sale.ts.
 * 2. Daarna de korting, per stuk afgerond tegen het gekozen percentage.
 *    Per stuk en niet over het subtotaal, omdat de klant op de
 *    productpagina de prijs van één stuk zag: twee keer dat product moet
 *    precies twee keer dat bedrag zijn. 10% over twee keer 19,95 is 3,99
 *    als je het over 39,90 rekent, maar 4,00 als je twee keer 2,00
 *    rekent - en dat laatste is wat er op de pagina stond.
 *
 * `active` is een parameter en niet `isSaleActive()` binnenin, zodat een
 * client component de serverwaarde kan doorgeven. Zou de browser het
 * zelf bepalen, dan kan een verkeerd gezette klok korting tonen die de
 * checkout daarna weigert.
 */
export function saleCartTotals(lines: SaleCartLine[], active: boolean): SaleCartTotals {
  let subtotalCents = 0
  const geldig: { baseCents: number; quantity: number }[] = []

  for (const line of lines) {
    if (!Number.isFinite(line.price) || line.price <= 0) continue
    // Een gebroken of negatief aantal telt niet mee; zoiets hoort
    // sowieso niet in een winkelwagen te zitten.
    if (!Number.isInteger(line.quantity) || line.quantity <= 0) continue
    const baseCents = toCents(line.price)
    subtotalCents += baseCents * line.quantity
    geldig.push({ baseCents, quantity: line.quantity })
  }

  const subtotal = subtotalCents / 100

  if (!active) {
    return {
      active: false,
      percent: sale.discountPercent,
      tierReached: false,
      subtotal,
      remainingForTier: 0,
      amountOff: 0,
      total: subtotal,
    }
  }

  const tierReached = subtotalCents >= SALE_TIER_THRESHOLD_CENTS
  const percent = tierReached ? sale.tierDiscountPercent : sale.discountPercent

  let discountCents = 0
  for (const regel of geldig) {
    discountCents += discountCentsAt(regel.baseCents, percent) * regel.quantity
  }
  // Kan bij deze percentages niet voorkomen, maar een korting die groter
  // is dan het subtotaal zou een negatief totaal opleveren en dat
  // weigert Stripe met een onbegrijpelijke fout.
  if (discountCents > subtotalCents) discountCents = subtotalCents

  return {
    active: true,
    percent,
    tierReached,
    subtotal,
    remainingForTier: tierReached ? 0 : (SALE_TIER_THRESHOLD_CENTS - subtotalCents) / 100,
    amountOff: discountCents / 100,
    total: (subtotalCents - discountCents) / 100,
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

/**
 * Het label bij de kortingsregel in winkelwagen, Stripe en mail.
 *
 * Met het percentage dat echt is toegepast erin, want dat is nu 10 of
 * 20. Op de bon van een klant die 20% kreeg, moet geen (10%) staan.
 */
export function saleDiscountLabel(percent: number = sale.discountPercent): string {
  return `${sale.campaign}-korting (${percent}%)`
}
