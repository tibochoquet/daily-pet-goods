/**
 * The single source of truth for the site's own origin. Every canonical
 * URL, the sitemap, robots.txt, OG image URLs, structured data, and the
 * Stripe success/cancel URLs all read from this - never hardcode
 * "https://dailypetgoods.nl" (or the old "www." version) anywhere else.
 * Locally this is http://localhost:3000; in Vercel it must be set to the
 * real domain via the NEXT_PUBLIC_SITE_URL env var.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

const PRODUCTION_URL = 'https://dailypetgoods.nl'

/**
 * De basis voor URL's die iemand anders dan de bezoeker zelf ophaalt:
 * Stripe dat het logo voor de betaalpagina binnenhaalt, een mailclient
 * die een plaatje laadt.
 *
 * Volgt SITE_URL, zodat een previewdeploy naar zichzelf wijst, maar valt
 * terug op het echte domein zodra dat een adres oplevert dat van buiten
 * niet te bereiken is. `http://localhost:3000/...` geeft bij de
 * ontvanger een kapot plaatje, en Stripe weigert zo'n sessie.
 */
export const PUBLIC_BASE_URL = (() => {
  try {
    const { hostname, protocol } = new URL(SITE_URL)
    const onbereikbaar =
      protocol !== 'https:' || hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.local')
    return onbereikbaar ? PRODUCTION_URL : SITE_URL
  } catch {
    return PRODUCTION_URL
  }
})()

/**
 * True only on a deployment served from a `test.` host, e.g.
 * https://test.dailypetgoods.nl - a copy of the shop running against
 * Stripe test keys.
 *
 * Deliberately opt-IN on the "test." prefix rather than opt-out on the
 * live domain: if NEXT_PUBLIC_SITE_URL is ever missing or wrong in
 * production, this returns false and production keeps behaving exactly as
 * it does today. The reverse (defaulting to "treat as test") could
 * silently deindex the real shop.
 */
export function isTestEnvironment(): boolean {
  try {
    return new URL(SITE_URL).hostname.startsWith('test.')
  } catch {
    return false
  }
}

/**
 * Sentinel for the still-missing postcode. Deliberately not a plain empty
 * string or null: it needs to (a) render visibly in development so a
 * half-finished address is obvious while working on the site, and (b) be
 * checkable by name in the production build guard below.
 */
export const POSTCODE_TODO = 'TODO: postcode ontbreekt'

/**
 * Single source of truth for the shop's legal/business identity. Used by
 * the footer, contact page, legal pages, checkout, and order emails -
 * never hardcode these values elsewhere.
 */
export const business = {
  /** Consumer-facing brand name, used everywhere in the UI. */
  brandName: 'Daily Pet Goods',
  /**
   * De bij de KVK ingeschreven rechtspersoon. "Daily Pet Goods" is de
   * handelsnaam waaronder deze onderneming naar buiten treedt, en wordt
   * overal getoond als "handelsnaam van <tradingName>".
   */
  tradingName: 'Umber Studio',
  kvkNumber: '99864819',
  btwNumber: 'NL004426224B17',
  email: 'lifegoods.daily@gmail.com',
  address: {
    street: 'Zwembadweg 29',
    postalCode: '5491 TE',
    city: 'Sint-Oedenrode',
    country: 'Nederland',
  },
} as const

/** Full address as a single display string, e.g. for the footer or an email signature. */
export function formatAddress(): string {
  const { street, postalCode, city } = business.address
  return `${street}, ${postalCode} ${city}`
}

// Production build guard: a webshop must never silently ship a half
// address (correct street, no postcode - packages would misroute). This
// throws as soon as this module is first imported, which happens well
// before any page is prerendered, so `next build` fails loudly instead of
// quietly publishing an incomplete address. Doesn't affect `next dev`
// (NODE_ENV=development), where the TODO string just renders as-is so
// it's visibly incomplete while working on the site.
if (process.env.NODE_ENV === 'production' && (business.address.postalCode as string) === POSTCODE_TODO) {
  throw new Error(
    `lib/business.ts: postcode ontbreekt nog (${POSTCODE_TODO}). Vul het echte postcode in ` +
      'lib/business.ts in voordat je een productie-build maakt - een half verzendadres ' +
      'mag niet live gaan.'
  )
}

/**
 * Standard Dutch VAT rate for general goods. Prices shown to consumers are
 * always VAT-inclusive (a legal requirement, not a display choice) - this
 * is only used to back the VAT amount OUT of an already-inclusive price
 * for disclosure, never added on top.
 */
export const BTW_RATE = 0.21

export function btwAmount(inclusivePrice: number): number {
  return inclusivePrice - inclusivePrice / (1 + BTW_RATE)
}

/**
 * Prijs zoals een Nederlandse klant hem leest: € 39,99.
 *
 * Alleen voor wat mensen zien. In structured data (schema.org) moet een
 * prijs juist een punt houden en geen euroteken, anders leest Google de
 * waarde verkeerd - daar blijft `toFixed(2)` dus staan.
 */
const euroFormatter = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
})

export function formatPrice(bedrag: number): string {
  // Intl zet een smalle spatie tussen het teken en het bedrag; een
  // gewone spatie leest in onze opmaak rustiger.
  return euroFormatter.format(bedrag).replace(/\u00a0|\u202f/g, ' ')
}
