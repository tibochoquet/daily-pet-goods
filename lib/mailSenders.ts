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

/**
 * Buiten productie mag er nooit een mail bij een echte klant belanden.
 *
 * Een previewdeploy en een lokale run praten met dezelfde database als
 * productie, dus zonder deze rem zou een testje met de cron zo tien
 * echte klanten mailen. Alleen adressen van de winkel zelf gaan door.
 * Wil je dat bewust doorbreken, zet dan ALLOW_REAL_MAILS=1.
 */
function magMailen(ontvanger: string): boolean {
  if (process.env.ALLOW_REAL_MAILS === '1') return true
  // VERCEL_ENV en niet NODE_ENV: een previewdeploy wordt door Vercel
  // gebouwd met NODE_ENV=production, dus daarop afgaan zou de rem juist
  // op preview uitschakelen - precies waar hij nodig is, want preview
  // deelt de productiedatabase.
  const omgeving = process.env.VERCEL_ENV ?? (process.env.NODE_ENV === 'production' ? 'production' : 'development')
  if (omgeving === 'production') return true

  const adres = ontvanger.trim().toLowerCase()
  const eigen = business.email.toLowerCase()
  // Ook plusadressen van de winkel zelf, zoals naam+DPG-123@gmail.com.
  const basis = eigen.split('@')[0].split('+')[0]
  const domein = eigen.split('@')[1]
  const isEigen = adres === eigen || (adres.startsWith(`${basis}+`) && adres.endsWith(`@${domein}`))

  if (!isEigen) {
    console.warn(
      `Mail naar ${adres} geblokkeerd: buiten productie versturen we alleen naar de winkel zelf. ` +
        'Zet ALLOW_REAL_MAILS=1 als je dit bewust wilt doorbreken.'
    )
  }
  return isEigen
}

class GeblokkeerdeMailError extends Error {
  constructor(ontvanger: string) {
    super(`Mail naar ${ontvanger} geblokkeerd buiten productie.`)
    this.name = 'GeblokkeerdeMailError'
  }
}

export { GeblokkeerdeMailError }

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

    if (!magMailen(data.email)) throw new GeblokkeerdeMailError(data.email)
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

    if (!magMailen(data.email)) throw new GeblokkeerdeMailError(data.email)
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
