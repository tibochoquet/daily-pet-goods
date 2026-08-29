import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { getVariantById } from '@/lib/products'

/**
 * Creates a Stripe Checkout Session for a one-time order and returns its
 * URL. The client only ever sends variant ids + quantities - prices are
 * always resolved server-side from lib/products.ts, never trusted from
 * the request body. This is what stops someone from tampering with the
 * price in devtools before checking out.
 */

interface CheckoutItem {
  id: string
  quantity: number
}

const MAX_QUANTITY_PER_ITEM = 20

export async function POST(req: NextRequest) {
  let body: { items?: CheckoutItem[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Ongeldige JSON' }, { status: 400 })
  }

  const items = body.items
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Winkelwagen is leeg' }, { status: 400 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  if (!baseUrl) {
    console.error('Checkout: NEXT_PUBLIC_BASE_URL ontbreekt.')
    return NextResponse.json({ error: 'Server niet correct geconfigureerd' }, { status: 500 })
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

  for (const item of items) {
    if (typeof item?.id !== 'string' || typeof item?.quantity !== 'number') {
      return NextResponse.json({ error: 'Ongeldig item in winkelwagen' }, { status: 400 })
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_QUANTITY_PER_ITEM) {
      return NextResponse.json({ error: `Ongeldig aantal voor product ${item.id}` }, { status: 400 })
    }

    const found = getVariantById(item.id)
    if (!found) {
      return NextResponse.json({ error: `Product niet gevonden: ${item.id}` }, { status: 400 })
    }
    const { product, variant } = found

    line_items.push({
      quantity: item.quantity,
      price_data: {
        currency: 'eur',
        unit_amount: Math.round(variant.price * 100),
        product_data: {
          name: `${product.name} - ${variant.label}`,
          images: [new URL(variant.image, baseUrl).toString()],
          metadata: { variantId: variant.id, productSlug: product.slug },
        },
      },
    })
  }

  const orderRef = `DPG-${Date.now().toString(36).toUpperCase()}`

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'eur',
      locale: 'nl',
      line_items,
      // Checkout Sessions don't have an `automatic_payment_methods` param
      // (that's a PaymentIntents-only field) - omitting `payment_method_types`
      // entirely gets the same effect: Stripe shows every payment method
      // you've enabled for this currency/country in the Dashboard (iDEAL,
      // cards, ...) without listing them here by hand.
      shipping_address_collection: { allowed_countries: ['NL', 'BE'] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: 'Verzending',
            // Vast tarief van €0 - in lijn met de "Gratis verzending"
            // die overal op de site staat. Wijzig dit bedrag hier als
            // dat ooit verandert.
            fixed_amount: { amount: 0, currency: 'eur' },
          },
        },
      ],
      // Geen automatic_tax hier: Daily Lifegoods heeft een BTW-id
      // (NL004426224B17) en rekent gewoon btw - maar de weergegeven
      // prijzen zijn al btw-inclusief (verplicht bij consumentenprijzen),
      // dus er hoeft niets bovenop het bedrag berekend te worden. De
      // btw-component wordt puur informatief getoond (zie lib/business.ts
      // btwAmount() en de winkelwagenpagina), niet door Stripe Tax
      // berekend. Wil je Stripe Tax later wel gebruiken, zorg dan dat de
      // belastinginstellingen op "tax inclusive" staan, anders rekent
      // Stripe btw BOVENOP deze al-inclusieve prijzen.
      success_url: `${baseUrl}/checkout/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/geannuleerd`,
      metadata: { orderRef },
    })

    if (!session.url) {
      console.error('Checkout: Stripe gaf geen session.url terug.', session.id)
      return NextResponse.json({ error: 'Kon checkout niet starten' }, { status: 502 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout: aanmaken van Stripe session mislukt:', err)
    return NextResponse.json({ error: 'Kon checkout niet starten' }, { status: 500 })
  }
}
