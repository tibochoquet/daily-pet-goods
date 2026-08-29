import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import { getStripe } from '@/lib/stripe'
import { business } from '@/lib/business'

/**
 * Stripe webhook endpoint. This is the ONLY place an order is considered
 * paid - never trust the success_url redirect for that, since a customer
 * can land on it without having actually paid (closed tab and reopened it,
 * shared the link, etc). Stripe signs every request with STRIPE_WEBHOOK_SECRET
 * so we can verify it really came from Stripe before acting on it.
 */

// Best-effort idempotency: skip an event id we've already processed, so a
// duplicate webhook delivery (Stripe retries on anything but a fast 2xx,
// and can occasionally double-deliver even on success) doesn't send two
// order emails. This is an in-memory cache, so it only dedupes within one
// warm server instance - it resets on a cold start and isn't shared across
// instances. There's no database in this project to persist it properly;
// if that becomes a problem, move this to something like Vercel KV/Upstash.
const processedEventIds = new Map<string, true>()
const MAX_TRACKED_EVENTS = 500

function alreadyProcessed(eventId: string): boolean {
  if (processedEventIds.has(eventId)) return true
  processedEventIds.set(eventId, true)
  if (processedEventIds.size > MAX_TRACKED_EVENTS) {
    const oldest = processedEventIds.keys().next().value
    if (oldest) processedEventIds.delete(oldest)
  }
  return false
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('Stripe webhook: STRIPE_WEBHOOK_SECRET ontbreekt.')
    return NextResponse.json({ error: 'Niet geconfigureerd' }, { status: 500 })
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Ontbrekende handtekening' }, { status: 400 })
  }

  // Raw text, NOT req.json() - signature verification is over the exact
  // bytes Stripe sent, and JSON.parse -> re-stringify would not reproduce
  // that byte-for-byte.
  const rawBody = await req.text()

  const stripe = getStripe()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    console.error('Stripe webhook: handtekening ongeldig:', err)
    return NextResponse.json({ error: 'Ongeldige handtekening' }, { status: 400 })
  }

  if (alreadyProcessed(event.id)) {
    return NextResponse.json({ received: true, duplicate: true })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })

      // Two separate emails, both best-effort: a failure in one must not
      // block the other, and neither may fail the webhook response (Stripe
      // would keep retrying an already-paid order forever otherwise - the
      // payment itself is already safely recorded on Stripe's side).
      try {
        await sendOwnerNotificationEmail(session, lineItems.data)
      } catch (err) {
        console.error('Stripe webhook: interne orderbevestiging versturen mislukt:', err)
      }
      try {
        await sendCustomerConfirmationEmail(session, lineItems.data)
      } catch (err) {
        console.error('Stripe webhook: klantbevestiging versturen mislukt:', err)
      }
      break
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.error('Stripe: betaling mislukt', {
        paymentIntentId: paymentIntent.id,
        reason: paymentIntent.last_payment_error?.message,
      })
      break
    }
    default:
      break
  }

  return NextResponse.json({ received: true })
}

function itemRowsHtml(lineItems: Stripe.LineItem[]): string {
  return lineItems
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #E8E2D9;font-size:13px;color:#4B5563;">${item.description}</td>
          <td style="padding:8px 0;border-bottom:1px solid #E8E2D9;font-size:13px;color:#4B5563;text-align:center;">×${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #E8E2D9;font-size:13px;color:#1A1A1A;text-align:right;">€${((item.amount_total ?? 0) / 100).toFixed(2)}</td>
        </tr>`
    )
    .join('')
}

async function sendResendEmail(payload: Parameters<Resend['emails']['send']>[0]) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  // resend.emails.send() does NOT throw on failure - it resolves with
  // { data: null, error } (e.g. an invalid API key just comes back as a
  // normal, non-throwing response). A try/catch around the call alone
  // would silently miss that, so the error has to be checked explicitly.
  const { error } = await resend.emails.send(payload)
  if (error) {
    throw new Error(`Resend gaf een fout terug: ${error.message}`)
  }
}

/** Internal notification to the shop owner - mirrors the existing app/api/order email. */
async function sendOwnerNotificationEmail(session: Stripe.Checkout.Session, lineItems: Stripe.LineItem[]) {
  const orderRef = session.metadata?.orderRef ?? session.id
  const total = (session.amount_total ?? 0) / 100
  const shipping = session.collected_information?.shipping_details
  const customer = session.customer_details

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A1A1A;">
      <h2 style="color:#2C4A3E;margin-bottom:4px;">Betaalde bestelling, ${orderRef}</h2>
      <p style="color:#6B7280;margin-top:0;font-size:14px;">${business.brandName} - via Stripe Checkout</p>

      <h3 style="font-size:14px;color:#1A1A1A;margin-bottom:8px;">Klant</h3>
      <p style="font-size:14px;color:#4B5563;margin:0;">
        ${customer?.name ?? shipping?.name ?? 'Onbekend'}<br/>
        ${customer?.email ? `<a href="mailto:${customer.email}" style="color:#2C4A3E;">${customer.email}</a>` : ''}
        ${customer?.phone ? `<br/>${customer.phone}` : ''}
      </p>

      <h3 style="font-size:14px;color:#1A1A1A;margin-top:20px;margin-bottom:8px;">Verzendadres</h3>
      <p style="font-size:14px;color:#4B5563;margin:0;">
        ${
          shipping?.address
            ? `${shipping.name ?? ''}<br/>
               ${shipping.address.line1 ?? ''} ${shipping.address.line2 ?? ''}<br/>
               ${shipping.address.postal_code ?? ''} ${shipping.address.city ?? ''}<br/>
               ${shipping.address.country ?? ''}`
            : 'Geen verzendadres ontvangen'
        }
      </p>

      <h3 style="font-size:14px;color:#1A1A1A;margin-top:20px;margin-bottom:8px;">Producten</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tbody>${itemRowsHtml(lineItems)}</tbody>
      </table>

      <table style="width:100%;margin-top:12px;">
        <tr>
          <td style="font-size:15px;font-weight:600;padding-top:8px;">Totaal</td>
          <td style="font-size:15px;font-weight:600;text-align:right;padding-top:8px;">€${total.toFixed(2)}</td>
        </tr>
      </table>

      <p style="font-size:13px;color:#2C4A3E;margin-top:20px;">
        Betaling ontvangen via Stripe. Klaar om te verpakken en te verzenden.
      </p>
    </div>
  `

  await sendResendEmail({
    from: `${business.brandName} <orders@dailypetgoods.nl>`,
    to: business.email,
    replyTo: customer?.email ?? undefined,
    subject: `Betaalde bestelling ${orderRef}, €${total.toFixed(2)}`,
    html,
  })
}

/**
 * Customer-facing order confirmation - repeats what was bought, the
 * total, the delivery estimate, and the 14-day withdrawal right, per the
 * pre-launch checkout requirements. Nothing else in this codebase emails
 * the customer after a Stripe payment; the on-site /checkout/succes page
 * alone is not a substitute for this.
 */
async function sendCustomerConfirmationEmail(session: Stripe.Checkout.Session, lineItems: Stripe.LineItem[]) {
  const customerEmail = session.customer_details?.email
  if (!customerEmail) return

  const orderRef = session.metadata?.orderRef ?? session.id
  const total = (session.amount_total ?? 0) / 100

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A1A1A;">
      <h2 style="color:#2C4A3E;margin-bottom:4px;">Bedankt voor je bestelling!</h2>
      <p style="color:#6B7280;margin-top:0;font-size:14px;">Ordernummer ${orderRef} - ${business.brandName}</p>

      <h3 style="font-size:14px;color:#1A1A1A;margin-top:20px;margin-bottom:8px;">Wat je hebt besteld</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tbody>${itemRowsHtml(lineItems)}</tbody>
      </table>

      <table style="width:100%;margin-top:12px;">
        <tr>
          <td style="font-size:15px;font-weight:600;padding-top:8px;">Totaal (incl. btw)</td>
          <td style="font-size:15px;font-weight:600;text-align:right;padding-top:8px;">€${total.toFixed(2)}</td>
        </tr>
      </table>

      <h3 style="font-size:14px;color:#1A1A1A;margin-top:20px;margin-bottom:8px;">Levering</h3>
      <p style="font-size:14px;color:#4B5563;margin:0;">
        We versturen je bestelling naar verwachting binnen 1-2 werkdagen. Gratis verzending binnen
        Nederland en België.
      </p>

      <h3 style="font-size:14px;color:#1A1A1A;margin-top:20px;margin-bottom:8px;">Herroepingsrecht</h3>
      <p style="font-size:14px;color:#4B5563;margin:0;">
        Je hebt het recht om deze bestelling binnen 14 dagen na ontvangst zonder opgaaf van reden te
        herroepen. Lees ons volledige retourbeleid en het modelformulier voor herroeping op
        <a href="https://www.dailypetgoods.nl/retourneren" style="color:#2C4A3E;">dailypetgoods.nl/retourneren</a>.
      </p>

      <p style="font-size:13px;color:#6B7280;margin-top:24px;">
        Vragen over je bestelling? Mail ons op
        <a href="mailto:${business.email}" style="color:#2C4A3E;">${business.email}</a>.
      </p>
    </div>
  `

  await sendResendEmail({
    from: `${business.brandName} <orders@dailypetgoods.nl>`,
    to: customerEmail,
    replyTo: business.email,
    subject: `Je bestelling bij ${business.brandName} - ${orderRef}`,
    html,
  })
}
