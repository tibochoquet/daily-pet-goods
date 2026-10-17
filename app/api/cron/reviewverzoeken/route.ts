import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { getStripe } from '@/lib/stripe'
import { isDbConfigured } from '@/lib/db'
import { findOrdersDueForReview } from '@/lib/db/orders'
import { AlVerstuurdError, sendReviewRequestEmail } from '@/lib/mailSenders'

/**
 * Dagelijkse reviewverzoeken, 8 dagen na verzending.
 *
 * Er is geen bezorgmelding - we verzenden met de hand en koppelen niet
 * met de vervoerder - dus verzenddatum plus acht dagen is het enige
 * moment dat we kennen.
 *
 * Maximaal MAX_PER_RUN per keer, oudste eerst. Zo loopt een achterstand
 * over een paar dagen leeg zonder dat Resend wordt overvraagd.
 */

const DAGEN_NA_VERZENDING = 8
const MAX_PER_RUN = 15
// Resend staat een paar mails per seconde toe; 400 ms ertussen is ruim.
const PAUZE_MS = 400

function bevoegd(req: NextRequest, secret: string): boolean {
  const header = req.headers.get('authorization') ?? ''
  const verwacht = `Bearer ${secret}`
  const a = Buffer.from(header)
  const b = Buffer.from(verwacht)
  return a.length === b.length && timingSafeEqual(a, b)
}

/** Terugbetaald of betwist? Dan geen reviewverzoek. */
async function isTerugbetaald(stripeSessionId: string): Promise<boolean> {
  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId, { expand: ['payment_intent'] })
    const intent = session.payment_intent
    if (!intent || typeof intent === 'string') return false
    const charge = await stripe.charges.list({ payment_intent: intent.id, limit: 1 })
    const c = charge.data[0]
    return Boolean(c?.refunded || c?.disputed)
  } catch (err) {
    // Niet kunnen vaststellen is geen vrijbrief om te mailen.
    console.error(`Reviewcron: terugbetaling niet te controleren voor ${stripeSessionId}:`, err)
    return true
  }
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    console.error('CRON_SECRET ontbreekt - cron geweigerd.')
    return NextResponse.json({ error: 'Niet geconfigureerd' }, { status: 500 })
  }
  if (!bevoegd(req, secret)) {
    return NextResponse.json({ error: 'Geen toegang' }, { status: 401 })
  }
  if (!isDbConfigured()) {
    console.error('Reviewcron: DATABASE_URL ontbreekt.')
    return NextResponse.json({ error: 'Geen database' }, { status: 500 })
  }

  const kandidaten = await findOrdersDueForReview(DAGEN_NA_VERZENDING, MAX_PER_RUN)
  let verstuurd = 0
  let overgeslagen = 0
  const fouten: string[] = []

  for (const order of kandidaten) {
    if (await isTerugbetaald(order.stripeSessionId)) {
      overgeslagen++
      console.info(`Reviewcron: ${order.orderRef} overgeslagen (terugbetaald of niet te controleren).`)
      continue
    }
    try {
      await sendReviewRequestEmail(order.stripeSessionId)
      verstuurd++
    } catch (err) {
      if (err instanceof AlVerstuurdError) {
        overgeslagen++
        continue
      }
      fouten.push(order.orderRef)
      console.error(`Reviewcron: ${order.orderRef} mislukt:`, err)
    }
    await new Promise((r) => setTimeout(r, PAUZE_MS))
  }

  const samenvatting = { gevonden: kandidaten.length, verstuurd, overgeslagen, mislukt: fouten.length }
  console.info('Reviewcron klaar:', samenvatting)
  return NextResponse.json({ ok: true, ...samenvatting, fouten })
}
