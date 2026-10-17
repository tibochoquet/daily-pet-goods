import 'server-only'
import { getStripe } from './stripe'
import type { OrderRow } from './db/schema'

/**
 * De databaserij zegt wat er met een bestelling is gebeurd; Stripe weet
 * wie hem plaatste en wat erin zat. Voor de beheerpagina heb je allebei
 * nodig: je moet zien wat je inpakt en waar het heen moet.
 */

export interface AdminOrder {
  orderRef: string
  stripeSessionId: string
  email: string
  placedAt: Date
  status: string
  carrier: string | null
  trackingNumber: string | null
  trackingUrl: string | null
  shippingEmailSentAt: Date | null
  klant: {
    naam: string
    straat: string
    postcode: string
    plaats: string
    land: string
  }
  regels: { naam: string; aantal: number }[]
  totaal: number
  /** Terugbetaald of betwist: zo'n order hoef je niet meer te verzenden. */
  terugbetaald: boolean
}

const LEEG = { naam: '', straat: '', postcode: '', plaats: '', land: '' }

export async function enrichOrders(rows: OrderRow[]): Promise<AdminOrder[]> {
  const stripe = getStripe()

  // Per order twee Stripe-aanroepen. Bij dit volume is dat prima; wordt
  // de lijst ooit lang, dan is dit de plek om te cachen.
  return Promise.all(
    rows.map(async (row): Promise<AdminOrder> => {
      let klant = { ...LEEG }
      let regels: { naam: string; aantal: number }[] = []
      let terugbetaald = false
      try {
        const session = await stripe.checkout.sessions.retrieve(row.stripeSessionId)
        const verzend = session.collected_information?.shipping_details
        const adres = verzend?.address
        klant = {
          naam: verzend?.name ?? session.customer_details?.name ?? '',
          straat: [adres?.line1, adres?.line2].filter(Boolean).join(', '),
          postcode: adres?.postal_code ?? '',
          plaats: adres?.city ?? '',
          land: adres?.country ?? '',
        }
        const items = await stripe.checkout.sessions.listLineItems(row.stripeSessionId, { limit: 100 })
        regels = items.data.map((r) => ({ naam: r.description ?? '', aantal: r.quantity ?? 1 }))

        // Een terugbetaalde bestelling hoort niet in je werklijst.
        const pi = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id
        if (pi) {
          const charges = await stripe.charges.list({ payment_intent: pi, limit: 1 })
          const c = charges.data[0]
          terugbetaald = Boolean(c?.refunded || c?.disputed)
        }
      } catch (err) {
        // Een order zonder Stripe-gegevens mag de hele lijst niet
        // onbruikbaar maken; je ziet dan nog steeds het bestelnummer.
        console.error(`Beheer: Stripe-gegevens ophalen mislukt voor ${row.orderRef}:`, err)
      }

      return {
        orderRef: row.orderRef,
        stripeSessionId: row.stripeSessionId,
        email: row.email,
        placedAt: row.placedAt,
        status: row.status,
        carrier: row.carrier,
        trackingNumber: row.trackingNumber,
        trackingUrl: row.trackingUrl,
        shippingEmailSentAt: row.shippingEmailSentAt,
        klant,
        regels,
        totaal: row.totalAmount ?? 0,
        terugbetaald,
      }
    })
  )
}
