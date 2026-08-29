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
