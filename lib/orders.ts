import Stripe from 'stripe'
import { getStripe } from './stripe'

/**
 * There's no order database - a Stripe Checkout Session IS the order,
 * identified to customers by the `orderRef` (e.g. "DPG-XXXXX") stored in
 * its metadata (set in app/api/checkout/route.ts). Everything here reads
 * or writes that one Stripe object; nothing is persisted anywhere else.
 *
 * Checkout Sessions have no Search API (only list/retrieve/update/expire) -
 * but `list()` does support filtering by `customer_details.email` natively,
 * which covers both "find my orders" and "find this one order" (the
 * latter just filters further, client-side, for the matching orderRef).
 * If a single customer ever has more than LIST_LIMIT orders this would
 * need cursor pagination (`starting_after`) - not worth building ahead of
 * that for this shop's scale.
 */

const LIST_LIMIT = 100

export type ReturnStatus = 'aangemeld' | 'onderweg' | 'ontvangen' | null

export interface OrderItem {
  productSlug: string | null
  name: string
  quantity: number
  amountTotal: number
}

export interface Order {
  orderRef: string
  sessionId: string
  createdAt: string
  email: string
  items: OrderItem[]
  total: number
  currency: string
  /**
   * Discount actually applied to this order, if any. Kept because
   * `items[].amountTotal` are list prices: on a discounted order they add
   * up to more than `total`, so a refund has to be worked out from what
   * was really paid, not from the item price alone.
   */
  discountCode: string | null
  discountAmount: number
  paymentStatus: Stripe.Checkout.Session.PaymentStatus
  refunded: boolean
  returnStatus: ReturnStatus
  returnReason: string | null
  reviewedProductSlugs: string[]
  trackingUrl: string | null
  shippingAddress: {
    name: string | null
    line1: string | null
    line2: string | null
    postalCode: string | null
    city: string | null
    country: string | null
  } | null
}

async function wasRefunded(session: Stripe.Checkout.Session): Promise<boolean> {
  if (typeof session.payment_intent !== 'string') return false
  const stripe = getStripe()
  const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent, {
    expand: ['latest_charge'],
  })
  const charge = paymentIntent.latest_charge
  return typeof charge !== 'string' && charge != null && charge.refunded
}

async function toOrder(session: Stripe.Checkout.Session): Promise<Order> {
  const stripe = getStripe()
  const [lineItems, refunded] = await Promise.all([
    stripe.checkout.sessions.listLineItems(session.id, { limit: 100, expand: ['data.price.product'] }),
    wasRefunded(session),
  ])
  const shipping = session.collected_information?.shipping_details
  const reviewedRaw = session.metadata?.reviewedProducts

  return {
    orderRef: session.metadata?.orderRef ?? session.id,
    sessionId: session.id,
    createdAt: new Date(session.created * 1000).toISOString(),
    email: session.customer_details?.email ?? '',
    items: lineItems.data.map((item) => {
      const product = item.price?.product
      const productSlug =
        product && typeof product !== 'string' && !('deleted' in product) ? (product.metadata?.productSlug ?? null) : null
      return {
        productSlug,
        name: item.description ?? '',
        quantity: item.quantity ?? 0,
        amountTotal: (item.amount_total ?? 0) / 100,
      }
    }),
    total: (session.amount_total ?? 0) / 100,
    currency: (session.currency ?? 'eur').toUpperCase(),
    discountCode: session.metadata?.discountCode ?? null,
    discountAmount: (session.total_details?.amount_discount ?? 0) / 100,
    paymentStatus: session.payment_status,
    refunded,
    returnStatus: (session.metadata?.returnStatus as ReturnStatus) ?? null,
    returnReason: session.metadata?.returnReason ?? null,
    reviewedProductSlugs: reviewedRaw ? reviewedRaw.split(',') : [],
    trackingUrl: session.metadata?.trackingUrl ?? null,
    shippingAddress: shipping?.address
      ? {
          name: shipping.name ?? null,
          line1: shipping.address.line1 ?? null,
          line2: shipping.address.line2 ?? null,
          postalCode: shipping.address.postal_code ?? null,
          city: shipping.address.city ?? null,
          country: shipping.address.country ?? null,
        }
      : null,
  }
}

async function listPaidSessionsForEmail(email: string): Promise<Stripe.Checkout.Session[]> {
  const stripe = getStripe()
  const result = await stripe.checkout.sessions.list({
    customer_details: { email },
    status: 'complete',
    limit: LIST_LIMIT,
  })
  return result.data.filter((session) => session.payment_status === 'paid')
}

export async function findOrdersByEmail(email: string): Promise<Order[]> {
  const sessions = await listPaidSessionsForEmail(email)
  const orders = await Promise.all(sessions.map(toOrder))
  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function findOrderByRef(orderRef: string, email: string): Promise<Order | null> {
  const sessions = await listPaidSessionsForEmail(email)
  const session = sessions.find((s) => s.metadata?.orderRef === orderRef)
  return session ? toOrder(session) : null
}

/**
 * Resolves an order for either cookie type a request might carry. An
 * order-access token only proves the holder knew this one order's ref +
 * email (a lookup); an account-session token proves inbox ownership of an
 * email, which still has to be checked against this order's real customer
 * email before it counts as access. Callers pass in already-verified
 * emails (or null) from lib/session.ts - this function has no cookie/
 * framework dependency of its own.
 */
export async function resolveAuthorizedOrder(
  orderRef: string,
  { orderAccessEmail, accountEmail }: { orderAccessEmail: string | null; accountEmail: string | null }
): Promise<Order | null> {
  const email = orderAccessEmail ?? accountEmail
  if (!email) return null
  return findOrderByRef(orderRef, email)
}

/**
 * Metadata updates on a Session are a merge, not a replace - Stripe's own
 * docs for this field say individual keys are only unset by posting an
 * empty value *to that key*, not by omitting it. Safe to pass just the
 * changed keys here without first reading back the existing metadata
 * (orderRef etc. stays untouched).
 */
export async function updateReturnRequest(
  sessionId: string,
  { productSlug, quantity, reason, note }: { productSlug: string; quantity: number; reason: string; note?: string }
): Promise<void> {
  const stripe = getStripe()
  await stripe.checkout.sessions.update(sessionId, {
    metadata: {
      returnStatus: 'aangemeld',
      returnProduct: productSlug,
      returnQuantity: String(quantity),
      returnReason: reason,
      // Stripe metadata values are capped at 500 characters.
      ...(note ? { returnNote: note.slice(0, 480) } : {}),
    },
  })
}

export type StatusBadgeVariant = 'betaald' | 'retour-aangemeld' | 'retour-onderweg' | 'retour-ontvangen' | 'terugbetaald'

export function resolveStatusBadgeVariant(order: Order): StatusBadgeVariant {
  if (order.refunded) return 'terugbetaald'
  if (order.returnStatus === 'aangemeld') return 'retour-aangemeld'
  if (order.returnStatus === 'onderweg') return 'retour-onderweg'
  if (order.returnStatus === 'ontvangen') return 'retour-ontvangen'
  return 'betaald'
}

export async function markProductReviewed(
  sessionId: string,
  alreadyReviewed: string[],
  productSlug: string
): Promise<void> {
  if (alreadyReviewed.includes(productSlug)) return
  const stripe = getStripe()
  await stripe.checkout.sessions.update(sessionId, {
    metadata: { reviewedProducts: [...alreadyReviewed, productSlug].join(',') },
  })
}
