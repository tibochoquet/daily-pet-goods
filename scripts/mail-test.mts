/**
 * Stuurt de reviewmail van een bestaande bestelling naar één adres dat
 * jij opgeeft, zodat je hem met echte productdata kunt bekijken.
 *
 *   npm run mail:test -- DPG-XXXXXXX jouw@adres.nl
 *
 * Raakt de database niet aan: `review_email_sent_at` blijft leeg, zodat
 * de cron zijn werk later gewoon nog doet. De ontvanger is altijd het
 * adres dat je meegeeft, nooit dat van de klant.
 */
import Stripe from 'stripe'
import { neon } from '@neondatabase/serverless'
import { Resend } from 'resend'
import { readEnvLocal } from './env-local.mjs'
import { buildOrderEmailData } from '../lib/orderEmailData.js'
import { reviewRequestEmail, SITE_URL } from '../lib/emails/index.js'
import { business } from '../lib/business.js'

const [orderRef, ontvanger] = process.argv.slice(2)

if (!orderRef || !ontvanger) {
  console.error('Gebruik: npm run mail:test -- <bestelnummer> <e-mailadres>')
  process.exit(1)
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ontvanger)) {
  console.error(`"${ontvanger}" ziet er niet uit als een e-mailadres.`)
  process.exit(1)
}

const env = readEnvLocal()
const databaseUrl = process.env.MAIL_TEST_DATABASE_URL ?? env.DATABASE_URL
const stripeKey = process.env.STRIPE_LIVE_SECRET_KEY ?? env.STRIPE_SECRET_KEY
const resendKey = env.RESEND_API_KEY

if (!databaseUrl || !stripeKey || !resendKey) {
  console.error('DATABASE_URL, een Stripe-sleutel en RESEND_API_KEY zijn alle drie nodig.')
  process.exit(1)
}

// buildOrderEmailData maakt zijn eigen Stripe-client op deze variabele,
// dus die moet op dezelfde sleutel staan als wij hier gebruiken.
process.env.STRIPE_SECRET_KEY = stripeKey

const sql = neon(databaseUrl)
const host = databaseUrl.match(/@([^/]+)\//)?.[1] ?? '(onbekend)'

const [order] = await sql`SELECT order_ref, stripe_session_id, review_token, email
                          FROM orders WHERE order_ref = ${orderRef.trim().toUpperCase()}`
if (!order) {
  console.error(`Bestelling ${orderRef} staat niet in de database op ${host}.`)
  process.exit(1)
}

const stripe = new Stripe(stripeKey)
let session: Stripe.Checkout.Session
try {
  session = await stripe.checkout.sessions.retrieve(order.stripe_session_id as string)
} catch (err) {
  console.error(`Deze bestelling is niet op te halen met de opgegeven Stripe-sleutel.`)
  console.error(`Een live bestelling heeft een live sleutel nodig: ${(err as Error).message.slice(0, 90)}`)
  process.exit(1)
}

// Oorspronkelijk e-mailadres overschrijven, zodat buildOrderEmailData
// nergens het klantadres kan doorgeven.
const data = { ...(await buildOrderEmailData(session)), email: ontvanger }

const token = (order.review_token as string | null) ?? 'voorbeeldtoken'
const mail = reviewRequestEmail(data, {
  reviewUrl: `${SITE_URL}/review?t=${encodeURIComponent(token)}`,
  unsubscribeUrl: `${SITE_URL}/afmelden?t=${encodeURIComponent(token)}`,
})

const { error } = await new Resend(resendKey).emails.send({
  from: `${business.brandName} <orders@dailypetgoods.nl>`,
  to: ontvanger,
  replyTo: business.email,
  subject: `[TEST] ${mail.subject}`,
  html: mail.html,
  text: mail.text,
})
if (error) {
  console.error('Versturen mislukt:', error.message)
  process.exit(1)
}

console.log('Testmail verstuurd.')
console.log(`  database     : ${host}`)
console.log(`  bestelling   : ${order.order_ref}`)
console.log(`  inhoud       : ${data.items.map((i) => `${i.quantity}x ${i.name}${i.variant ? ` ${i.variant}` : ''}`).join(', ')}`)
console.log(`  naar         : ${ontvanger}`)
console.log(`  echte klant  : ${order.email}  (heeft niets ontvangen)`)
console.log(`  onderwerp    : [TEST] ${mail.subject}`)
console.log(`\n  review_email_sent_at is niet aangeraakt; de cron doet zijn werk later gewoon.`)
