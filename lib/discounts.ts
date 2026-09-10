import { getVariantById } from './products'
import type { ProductCategory } from './types'

/**
 * Discount codes live here as data, so a new code is one entry in the
 * array below - no logic to touch and nothing hardcoded elsewhere in the
 * codebase.
 *
 * The amount is ALWAYS recomputed server-side from the real cart (see
 * calculateDiscount), both when the customer applies the code and again
 * when the Stripe session is created. The browser only ever sends the
 * code itself; a discount amount coming from the client is never trusted,
 * exactly like product prices in app/api/checkout/route.ts.
 */
export interface DiscountCode {
  /** Stored uppercase; lookup is case-insensitive and trims whitespace. */
  code: string
  /** Shown next to the discount line in the order summary. */
  label: string
  percentOff: number
  /** Only line items in these categories count toward the discount. */
  categories: ProductCategory[]
  /** Shown when the cart contains none of the eligible products. */
  notEligibleMessage: string
}

export const discountCodes: DiscountCode[] = [
  {
    code: 'JAS10',
    label: '10% op honden- en kattenjassen',
    percentOff: 10,
    categories: ['dog-clothing', 'cat-clothing'],
    notEligibleMessage: 'Deze code geldt alleen voor honden- en kattenjassen.',
  },
]

/** Uppercase + trim, so " jas10 " and "JAS10" are the same code. */
export function normalizeCode(input: string): string {
  return input.trim().toUpperCase()
}

export function findDiscountCode(input: string): DiscountCode | undefined {
  const normalized = normalizeCode(input)
  return discountCodes.find((d) => d.code === normalized)
}

export interface CartLine {
  id: string
  quantity: number
}

export interface AppliedDiscount {
  code: string
  label: string
  percentOff: number
  /** Subtotal of the eligible products only, in euros. */
  eligibleSubtotal: number
  /** The discount itself, in euros, already rounded to whole cents. */
  amountOff: number
}

export type DiscountResult =
  | { ok: true; discount: AppliedDiscount }
  | { ok: false; error: string }

/**
 * Resolves a code against the actual cart contents.
 *
 * Everything is computed in integer cents and only converted back to
 * euros at the end - doing 10% on floating-point euros drifts by a cent
 * on some carts, and that cent would then differ between what the
 * customer is shown and what Stripe charges.
 *
 * Shipping is never part of this: it isn't in `items` at all, and the
 * shipping rate is added separately in the checkout route.
 */
export function calculateDiscount(codeInput: string, items: CartLine[]): DiscountResult {
  const discount = findDiscountCode(codeInput)
  if (!discount) {
    return { ok: false, error: 'Deze kortingscode bestaat niet.' }
  }

  let eligibleCents = 0
  for (const item of items) {
    const found = getVariantById(item.id)
    if (!found) continue
    if (!discount.categories.includes(found.product.category)) continue
    const quantity = Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 0
    eligibleCents += Math.round(found.variant.price * 100) * quantity
  }

  // Covers the "customer applied the code and then removed the jacket"
  // case: with no eligible products left there is nothing to discount,
  // so the code stops applying rather than silently discounting the rest
  // of the cart.
  if (eligibleCents <= 0) {
    return { ok: false, error: discount.notEligibleMessage }
  }

  const amountOffCents = Math.round((eligibleCents * discount.percentOff) / 100)
  if (amountOffCents <= 0) {
    return { ok: false, error: discount.notEligibleMessage }
  }

  return {
    ok: true,
    discount: {
      code: discount.code,
      label: discount.label,
      percentOff: discount.percentOff,
      eligibleSubtotal: eligibleCents / 100,
      amountOff: amountOffCents / 100,
    },
  }
}
