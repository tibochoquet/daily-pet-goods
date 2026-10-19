import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import { getStripe } from '@/lib/stripe'
import { business, formatPrice } from '@/lib/business'
import { orderConfirmationEmail } from '@/lib/emails'
import { buildOrderEmailData } from '@/lib/orderEmailData'
import { loadLegalAttachments } from '@/lib/legalAttachments'
import { isDbConfigured } from '@/lib/db'
import { claimEmailSend, releaseEmailClaim, upsertOrder } from '@/lib/db/orders'

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

function wasProcessed(eventId: string): boolean {
  return processedEventIds.has(eventId)
}

/**
 * Pas markeren als het event echt is afgehandeld. Zou dit meteen bij
 * binnenkomst gebeuren, dan zou een retry van Stripe - met hetzelfde
 * event-id - op een warme instance worden overgeslagen, en juist die
 * retry is wat een tijdelijke databasestoring moet opvangen.
 */
function markProcessed(eventId: string): void {
  processedEventIds.set(eventId, true)
  if (processedEventIds.size > MAX_TRACKED_EVENTS) {
    const oldest = processedEventIds.keys().next().value
    if (oldest) processedEventIds.delete(oldest)
  }
}

/** Fout waarbij de database niet kon garanderen dat er maar één mail uitgaat. */
class DatabaseGuaranteeError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'DatabaseGuaranteeError'
  }
}

/**
 * In productie mag een bestelbevestiging nooit uitgaan zonder dat de
 * database heeft vastgelegd dat hij uitgaat. Valt de database weg, dan
 * is een 500 het juiste antwoord: Stripe probeert het later opnieuw, en
 * de klant krijgt zijn mail dan alsnog - precies één keer.
 *
 * Lokaal is dat onnodig streng; daar mag je testen zonder database,
 * zolang luid gelogd wordt dat de dubbelcheck is overgeslagen.
 */
function requiresDatabaseGuarantee(): boolean {
  return process.env.NODE_ENV === 'production'
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

  if (wasProcessed(event.id)) {
    return NextResponse.json({ received: true, duplicate: true })
  }

  switch (event.type) {
    // Bij iDEAL staat de betaling bij `completed` soms nog op 'unpaid';
    // Stripe stuurt dan later `async_payment_succeeded`. Allebei afhandelen,
    // allebei pas handelen als er echt betaald is. De idempotentie in de
    // database zorgt dat dit nooit twee bevestigingen oplevert.
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.payment_status !== 'paid') {
        console.info('Stripe webhook: sessie nog niet betaald, wachten op async bevestiging.', {
          sessionId: session.id,
          paymentStatus: session.payment_status,
        })
        break
      }
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })

      // De interne melding aan de winkel staat los van de rest: die mag
      // nooit de klantbevestiging of het webhook-antwoord tegenhouden.
      try {
        await sendOwnerNotificationEmail(session, lineItems.data)
      } catch (err) {
        console.error('Stripe webhook: interne orderbevestiging versturen mislukt:', err)
      }

      try {
        await recordPaidOrder(session)
        await sendCustomerConfirmationEmail(session)
      } catch (err) {
        if (err instanceof DatabaseGuaranteeError) {
          // Geen 2xx: Stripe biedt het event later opnieuw aan. De
          // betaling staat veilig bij Stripe, dus uitstel kost niets -
          // een dubbele mail bij de klant wel.
          console.error('Stripe webhook: database niet beschikbaar, 500 zodat Stripe het opnieuw aanbiedt.', {
            sessionId: session.id,
            eventId: event.id,
            oorzaak: err.cause instanceof Error ? err.cause.message : String(err.cause ?? err.message),
          })
          return NextResponse.json({ error: 'Database niet beschikbaar' }, { status: 500 })
        }
        // Alles wat niet de database is (bijvoorbeeld Resend) mag de
        // order niet laten vastlopen. De claim is al teruggedraaid, dus
        // een volgende poging mag opnieuw.
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

  markProcessed(event.id)
  return NextResponse.json({ received: true })
}

function itemRowsHtml(lineItems: Stripe.LineItem[]): string {
  return lineItems
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #E8E2D9;font-size:13px;color:#4B5563;">${item.description}</td>
          <td style="padding:8px 0;border-bottom:1px solid #E8E2D9;font-size:13px;color:#4B5563;text-align:center;">×${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #E8E2D9;font-size:13px;color:#1A1A1A;text-align:right;">${formatPrice((item.amount_total ?? 0) / 100)}</td>
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

/** Internal notification to the shop owner. */
async function sendOwnerNotificationEmail(session: Stripe.Checkout.Session, lineItems: Stripe.LineItem[]) {
  const orderRef = session.metadata?.orderRef ?? session.id
  const total = (session.amount_total ?? 0) / 100
  // Line rows below are per-item list prices; without this row they would
  // not add up to the (discounted) total.
  const discountAmount = (session.total_details?.amount_discount ?? 0) / 100
  const discountCode = session.metadata?.discountCode
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
        ${
          discountAmount > 0
            ? `<tr>
                 <td style="font-size:14px;color:#2C4A3E;padding-top:4px;">Korting${discountCode ? ` (${discountCode})` : ''}</td>
                 <td style="font-size:14px;color:#2C4A3E;text-align:right;padding-top:4px;">&minus; ${formatPrice(discountAmount)}</td>
               </tr>`
            : ''
        }
        <tr>
          <td style="font-size:15px;font-weight:600;padding-top:8px;">Totaal</td>
          <td style="font-size:15px;font-weight:600;text-align:right;padding-top:8px;">${formatPrice(total)}</td>
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
    subject: `Betaalde bestelling ${orderRef}, ${formatPrice(total)}`,
    html,
  })
}

/**
 * Customer-facing order confirmation, rendered from emails/bestelmail.html
 * (a table-based template designed for email clients - never rebuild this
 * as inline HTML here). Nothing else in this codebase emails the customer
 * after a Stripe payment; the on-site /checkout/succes page alone is not
 * a substitute for this. Includes the herroepingsrecht (14-day withdrawal
 * right) and business-identity footer required by art. 6:230v BW.
 */
/** Legt de betaalde bestelling vast, zodat de rest van de keten erop kan bouwen. */
async function recordPaidOrder(session: Stripe.Checkout.Session) {
  if (!isDbConfigured()) {
    if (requiresDatabaseGuarantee()) {
      throw new DatabaseGuaranteeError('DATABASE_URL ontbreekt in productie')
    }
    console.warn('[lokaal] Order niet vastgelegd: geen DATABASE_URL. In productie zou dit een 500 geven.')
    return
  }
  try {
    await upsertOrder({
      stripeSessionId: session.id,
      orderRef: session.metadata?.orderRef ?? session.id,
      email: session.customer_details?.email ?? '',
      placedAt: new Date(session.created * 1000),
      totalAmount: session.amount_total ?? null,
    })
  } catch (err) {
    if (requiresDatabaseGuarantee()) {
      throw new DatabaseGuaranteeError('order vastleggen mislukt', { cause: err })
    }
    console.warn('[lokaal] Order vastleggen mislukt, ga door zonder:', err)
  }
}

/**
 * De bestelbevestiging naar de klant.
 *
 * Het recht om te versturen wordt eerst geclaimd in de database: een
 * UPDATE die alleen slaagt als de vlag nog leeg is. Komt dezelfde
 * webhook twee keer binnen, dan wint er precies één. Mislukt het
 * versturen daarna, dan gaat de claim terug zodat een volgende poging
 * het opnieuw mag proberen.
 */
async function sendCustomerConfirmationEmail(session: Stripe.Checkout.Session) {
  const customerEmail = session.customer_details?.email
  if (!customerEmail) return

  let claimedInDb = false
  if (isDbConfigured()) {
    let maySend: boolean
    try {
      maySend = await claimEmailSend(session.id, 'confirmationEmailSentAt')
    } catch (err) {
      if (requiresDatabaseGuarantee()) {
        throw new DatabaseGuaranteeError('mailclaim mislukt', { cause: err })
      }
      console.warn('[lokaal] Mailclaim mislukt, verstuur zonder dubbelcheck:', err)
      maySend = true
    }
    if (!maySend) {
      console.info('Stripe webhook: bevestiging al verstuurd, overgeslagen.', { sessionId: session.id })
      return
    }
    claimedInDb = true
  } else if (requiresDatabaseGuarantee()) {
    throw new DatabaseGuaranteeError('DATABASE_URL ontbreekt in productie')
  } else {
    console.warn(
      '[lokaal] Mailclaim OVERGESLAGEN: geen DATABASE_URL, dus geen bescherming tegen een dubbele mail. ' +
        'In productie zou dit een 500 geven zodat Stripe het later opnieuw aanbiedt.'
    )
  }

  try {
    const data = await buildOrderEmailData(session)
    // De mailtekst belooft de bijlagen alleen als ze er echt zijn.
    // Lukt het inlezen niet, dan gaat de bevestiging gewoon de deur uit
    // zonder die belofte - liever geen bijlage dan een loze zin.
    const bijlagen = await loadLegalAttachments()
    const mail = orderConfirmationEmail(data, { attachmentsIncluded: bijlagen.length > 0 })

    await sendResendEmail({
      from: `${business.brandName} <orders@dailypetgoods.nl>`,
      to: customerEmail,
      replyTo: business.email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      attachments: bijlagen.length ? bijlagen : undefined,
    })
  } catch (err) {
    // Alleen terugdraaien wat we zelf geclaimd hebben.
    if (claimedInDb) {
      await releaseEmailClaim(session.id, 'confirmationEmailSentAt').catch((releaseErr) =>
        console.error('Stripe webhook: claim terugdraaien mislukt:', releaseErr)
      )
    }
    throw err
  }
}
