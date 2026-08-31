/**
 * The single source of truth for the site's own origin. Every canonical
 * URL, the sitemap, robots.txt, OG image URLs, structured data, and the
 * Stripe success/cancel URLs all read from this - never hardcode
 * "https://dailypetgoods.nl" (or the old "www." version) anywhere else.
 * Locally this is http://localhost:3000; in Vercel it must be set to the
 * real domain via the NEXT_PUBLIC_SITE_URL env var.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

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
  /** KVK-registered trading name. Daily Pet Goods trades under this name. */
  tradingName: 'Daily Lifegoods',
  kvkNumber: '99864819',
  btwNumber: 'NL004426224B17',
  email: 'lifegoods.daily@gmail.com',
  address: {
    street: 'Zwembadweg 29',
    postalCode: POSTCODE_TODO,
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
if (process.env.NODE_ENV === 'production' && business.address.postalCode === POSTCODE_TODO) {
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
