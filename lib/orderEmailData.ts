import Stripe from 'stripe'
import { getStripe } from './stripe'
import { SITE_URL } from './business'
import { products } from './products'
import type { OrderEmailData, OrderItem } from './emails'

/**
 * Zet een betaalde Stripe Checkout Session om in de data die de
 * mailtemplates verwachten. Alles komt uit Stripe of uit lib/products.ts;
 * er wordt niets verzonnen.
 */

/** Zoekt variant en productfoto op via de metadata die checkout meegaf. */
function lookupVariant(productSlug: string | null, variantId: string | null) {
  if (!productSlug) return null
  const product = products.find((p) => p.slug === productSlug)
  if (!product) return null
  const variant = variantId ? product.variants.find((v) => v.id === variantId) : product.variants[0]
  return { product, variant: variant ?? product.variants[0] }
}

/**
 * Hond of kat, voor de foto en de tekst bij het cadeautje in de doos.
 * `pet-care` telt niet mee: die producten zijn voor allebei, dus ze
 * zeggen niets over welk dier de klant heeft. Bij een gemengde of
 * onbepaalde bestelling blijft dit null en laat de template het weg.
 */
function resolvePetType(slugs: (string | null)[]): 'hond' | 'kat' | null {
  let dog = 0
  let cat = 0
  for (const slug of slugs) {
    const product = slug ? products.find((p) => p.slug === slug) : null
    if (!product) continue
    if (product.category.startsWith('dog-')) dog++
    else if (product.category.startsWith('cat-')) cat++
  }
  if (dog > 0 && cat === 0) return 'hond'
  if (cat > 0 && dog === 0) return 'kat'
  return null
}

/**
 * Hoe er betaald is, zoals de klant het herkent op zijn afschrift.
 * Komt uit de charge, niet uit `payment_method_types` - dat laatste is
 * wat we aanboden, niet wat de klant uiteindelijk koos.
 */
async function resolvePaymentMethod(session: Stripe.Checkout.Session): Promise<string | null> {
  if (typeof session.payment_intent !== 'string') return null
  try {
    const stripe = getStripe()
    const intent = await stripe.paymentIntents.retrieve(session.payment_intent, { expand: ['latest_charge'] })
    const charge = intent.latest_charge
    if (typeof charge === 'string' || !charge) return null
    const details = charge.payment_method_details
    if (!details) return null
    switch (details.type) {
      case 'ideal':
        return 'iDEAL'
      case 'bancontact':
        return 'Bancontact'
      case 'klarna':
        return 'Klarna'
      case 'card': {
        const card = details.card
        if (!card) return 'Creditcard'
        const brand = (card.brand ?? 'card').replace(/^\w/, (c) => c.toUpperCase())
        return card.last4 ? `${brand} •••• ${card.last4}` : brand
      }
      default:
        return details.type.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
    }
  } catch (err) {
    // De mail is belangrijker dan deze ene regel erin.
    console.error('orderEmailData: betaalmethode ophalen mislukt:', err)
    return null
  }
}

/**
 * Link naar de bestelling. Bewust geen magic link: die verloopt na een
 * kwartier, terwijl een bevestigingsmail vaak veel later pas geopend
 * wordt. Dit vult het opzoekformulier vooraf in, zodat de klant alleen
 * nog hoeft te bevestigen.
 */
export function buildOrderUrl(orderRef: string, email: string): string {
  const params = new URLSearchParams({ ref: orderRef, email })
  return `${SITE_URL}/mijn-bestelling?${params.toString()}`
}

export async function buildOrderEmailData(session: Stripe.Checkout.Session): Promise<OrderEmailData> {
  const stripe = getStripe()
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
    expand: ['data.price.product'],
  })

  const slugs: (string | null)[] = []
  const items: OrderItem[] = lineItems.data.map((line) => {
    const product = line.price?.product
    const meta =
      product && typeof product !== 'string' && !('deleted' in product) ? (product.metadata ?? {}) : {}
    const productSlug = meta.productSlug ?? null
    const variantId = meta.variantId ?? null
    slugs.push(productSlug)
    const found = lookupVariant(productSlug, variantId)
    const quantity = line.quantity ?? 1
    return {
      name: found?.product.name ?? line.description ?? '',
      variant: found?.variant?.label ?? null,
      quantity,
      // unitAmount, niet het regeltotaal: de template vermenigvuldigt zelf.
      unitAmount: Math.round((line.amount_total ?? 0) / Math.max(quantity, 1)),
      imageUrl: found?.variant?.image ?? null,
      slug: productSlug,
    }
  })

  const shipping = session.collected_information?.shipping_details
  const customerName = shipping?.name ?? session.customer_details?.name ?? ''
  const email = session.customer_details?.email ?? ''
  const orderRef = session.metadata?.orderRef ?? session.id
  const discount = session.total_details?.amount_discount ?? 0

  return {
    orderNumber: orderRef,
    placedAt: new Date(session.created * 1000),
    firstName: customerName.split(' ')[0] || 'daar',
    email,
    shippingAddress: {
      name: customerName,
      line1: shipping?.address?.line1 ?? '',
      line2: shipping?.address?.line2 ?? null,
      postalCode: shipping?.address?.postal_code ?? '',
      city: shipping?.address?.city ?? '',
      country: shipping?.address?.country ?? 'NL',
    },
    items,
    subtotal: session.amount_subtotal ?? 0,
    shippingCost: session.total_details?.amount_shipping ?? 0,
    discount: discount > 0 ? discount : null,
    total: session.amount_total ?? 0,
    // Blijft leeg zolang de KOR geldt; de template laat de btw-regel dan weg.
    vatAmount: null,
    paymentMethod: await resolvePaymentMethod(session),
    petType: resolvePetType(slugs),
    orderUrl: buildOrderUrl(orderRef, email),
  }
}
