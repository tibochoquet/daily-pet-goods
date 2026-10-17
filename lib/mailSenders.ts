import 'server-only'
import { randomBytes } from 'node:crypto'
import { getStripe } from './stripe'
import { business, SITE_URL } from './business'
import { sendResendEmail } from './resend'
import { buildOrderEmailData } from './orderEmailData'
import { reviewRequestEmail, shippingConfirmationEmail } from './emails'
import { claimEmailSend, ensureReviewToken, releaseEmailClaim } from './db/orders'
import { trackingUrl, type Carrier } from './carriers'

/**
 * De twee mails die na de bestelbevestiging komen.
 *
 * Allebei volgen ze hetzelfde patroon als de bevestiging: eerst het
 * recht om te versturen claimen in de database, dan pas versturen, en
 * bij een mislukking de claim terugdraaien. Zo kan dezelfde order nooit
 * twee keer dezelfde mail opleveren, ook niet als er twee verzoeken
 * tegelijk binnenkomen.
 */

const AFZENDER = `${business.brandName} <orders@dailypetgoods.nl>`

export function nieuwReviewToken(): string {
  return randomBytes(24).toString('base64url')
}

export class AlVerstuurdError extends Error {
  constructor() {
    super('Deze mail is al verstuurd.')
    this.name = 'AlVerstuurdError'
  }
}

/** "Je pakket is onderweg", met de trackinglink van de juiste vervoerder. */
export async function sendShippingEmail(
  stripeSessionId: string,
  carrier: Carrier,
  trackingNumber: string
): Promise<void> {
  const maySend = await claimEmailSend(stripeSessionId, 'shippingEmailSentAt')
  if (!maySend) throw new AlVerstuurdError()

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId)
    const data = await buildOrderEmailData(session)
    const mail = shippingConfirmationEmail(data, {
      carrier,
      trackingNumber,
      trackingUrl: trackingUrl(carrier, trackingNumber),
    })

    await sendResendEmail({
      from: AFZENDER,
      to: data.email,
      replyTo: business.email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    })
  } catch (err) {
    await releaseEmailClaim(stripeSessionId, 'shippingEmailSentAt').catch((e) =>
      console.error('Claim verzendmail terugdraaien mislukt:', e)
    )
    throw err
  }
}

/**
 * Het reviewverzoek. De links zijn aan de order gekoppeld via een
 * token, zodat we weten dat de inzender ook echt gekocht heeft - en
 * zodat afmelden alleen deze klant raakt.
 */
export async function sendReviewRequestEmail(stripeSessionId: string): Promise<void> {
  const maySend = await claimEmailSend(stripeSessionId, 'reviewEmailSentAt')
  if (!maySend) throw new AlVerstuurdError()

  try {
    const token = await ensureReviewToken(stripeSessionId, nieuwReviewToken)
    if (!token) throw new Error(`Geen reviewtoken voor ${stripeSessionId}`)

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId)
    const data = await buildOrderEmailData(session)
    const mail = reviewRequestEmail(data, {
      reviewUrl: `${SITE_URL}/review?t=${encodeURIComponent(token)}`,
      unsubscribeUrl: `${SITE_URL}/afmelden?t=${encodeURIComponent(token)}`,
    })

    await sendResendEmail({
      from: AFZENDER,
      to: data.email,
      replyTo: business.email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    })
  } catch (err) {
    await releaseEmailClaim(stripeSessionId, 'reviewEmailSentAt').catch((e) =>
      console.error('Claim reviewmail terugdraaien mislukt:', e)
    )
    throw err
  }
}
