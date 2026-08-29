/**
 * Single source of truth for the shop's legal/business identity. Used by
 * the footer, contact page, legal pages, and checkout - never hardcode
 * these values elsewhere.
 */
export const business = {
  /** Consumer-facing brand name, used everywhere in the UI. */
  brandName: 'Daily Pet Goods',
  /** KVK-registered trading name. Daily Pet Goods trades under this name. */
  tradingName: 'Daily Lifegoods',
  kvkNumber: '99864819',
  btwNumber: 'NL004426224B17',
  email: 'lifegoods.daily@gmail.com',
  /**
   * TODO(owner): no geographic business address was provided. Consumer law
   * requires one to be findable on the site. Fill this in - if it's a home
   * address, say so explicitly rather than just handing me the street, so
   * that's a deliberate choice and not an accidental disclosure.
   */
  address: null as string | null,
} as const

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
