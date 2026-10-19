/**
 * Eenmalige import van bestaande betaalde Stripe-bestellingen in de
 * ordertabel, zodat de reviewcron ze kan oppakken.
 *
 * Draait standaard als DROOGLOOP: er wordt niets weggeschreven tenzij
 * je er expliciet --apply bij zet. Dat is met opzet - dit script raakt
 * klantgegevens en kan mails in gang zetten.
 *
 *   npx tsx scripts/import-bestellingen.mts                 (drooploop)
 *   npx tsx scripts/import-bestellingen.mts --apply         (schrijft weg)
 *
 * De Stripe-sleutel komt uit STRIPE_LIVE_SECRET_KEY, bewust los van de
 * testsleutel in .env.local. Wegschrijven met een testsleutel kan alleen
 * met --allow-test, bedoeld om eerst te oefenen op een Neon-branch.
 */
import Stripe from 'stripe'
import { createInterface } from 'node:readline/promises'
import { upsertOrder, findOrderBySessionId } from '../lib/db/orders.js'
import { getDb } from '../lib/db/index.js'
import { orders } from '../lib/db/schema.js'
import { eq, sql } from 'drizzle-orm'
import { randomBytes } from 'node:crypto'

const APPLY = process.argv.includes('--apply')
const ALLOW_TEST = process.argv.includes('--allow-test')
/**
 * Zet elk klantadres om naar tibo.choquet+<bestelnummer>@gmail.com.
 * Zo kun je op een dev-database de hele keten uitproberen zonder dat
 * er ook maar één mail bij een echte klant kan belanden.
 */
const TEST_MAILS = process.argv.includes('--test-mails')
/**
 * Alleen bestellingen van vóór deze datum importeren.
 *
 * Dit script bestaat voor de achterstand van vóórdat de webhook orders
 * ging wegschrijven. Alles wat daarna binnenkomt regelt de webhook zelf.
 * Zonder deze grens zou een verse bestelling als 'verzonden' en 'al
 * gemaild' worden weggeschreven, en dan krijgt die klant nooit een
 * verzendmail en verschijnt hij niet in /admin/verzenden.
 */
const VOOR_ARG = process.argv.find((a) => a.startsWith('--before='))
const VOOR: Date | null = VOOR_ARG ? new Date(VOOR_ARG.split('=')[1]) : null
const TEST_MAIL_BASIS = 'tibo.choquet'
const TEST_MAIL_DOMEIN = 'gmail.com'

function mailAdresVoor(echt: string, orderRef: string): string {
  if (!TEST_MAILS) return echt
  const veiligeRef = orderRef.replace(/[^A-Za-z0-9-]/g, '')
  return `${TEST_MAIL_BASIS}+${veiligeRef}@${TEST_MAIL_DOMEIN}`
}

/** De enige bestelling die nog verzonden moet worden. */
const NOG_TE_VERZENDEN = 'manou baert'
/** Verzenddatum is onbekend voor oude orders; betaaldatum + 3 dagen. */
const AANNAME_VERZENDDAGEN = 3

type Overslag = { ref: string; email: string; reden: string }

function reviewToken(): string {
  return randomBytes(24).toString('base64url')
}

function naamVan(s: Stripe.Checkout.Session): string {
  return (s.collected_information?.shipping_details?.name ?? s.customer_details?.name ?? '').trim()
}

async function isTerugbetaaldOfBetwist(stripe: Stripe, s: Stripe.Checkout.Session): Promise<boolean> {
  const pi = typeof s.payment_intent === 'string' ? s.payment_intent : s.payment_intent?.id
  if (!pi) return false
  const charges = await stripe.charges.list({ payment_intent: pi, limit: 1 })
  const c = charges.data[0]
  return Boolean(c?.refunded || c?.disputed)
}

/** Host uit een connectiestring, zonder het wachtwoord te tonen. */
function hostVan(url: string): string {
  const m = url.match(/@([^/]+)\//)
  return m ? m[1] : '(onbekend)'
}

async function main() {
  // Bewust NIET uit .env.local: daar staat de database waar je toevallig
  // lokaal mee werkt, en dat is precies hoe je per ongeluk in productie
  // schrijft. De doeldatabase geef je expliciet mee.
  const doelUrl = process.env.IMPORT_DATABASE_URL
  if (!doelUrl) {
    console.error(
      'IMPORT_DATABASE_URL ontbreekt.\n' +
        'Geef expliciet op in welke database je importeert, bijvoorbeeld:\n' +
        '  export IMPORT_DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require"'
    )
    process.exit(1)
  }
  // De databaselaag leest DATABASE_URL; we zetten die hier eenmalig.
  process.env.DATABASE_URL = doelUrl

  const key = process.env.STRIPE_LIVE_SECRET_KEY
  if (!key) {
    console.error('STRIPE_LIVE_SECRET_KEY ontbreekt. Zonder live-sleutel valt er niets te importeren.')
    process.exit(1)
  }
  const isTestSleutel = key.startsWith('sk_test_')
  if (isTestSleutel && APPLY && !ALLOW_TEST) {
    console.error('Dit is een testsleutel. Wegschrijven met testdata kan alleen met --allow-test.')
    process.exit(1)
  }
  if (APPLY && !VOOR) {
    console.error(
      'Geef --before=JJJJ-MM-DD mee bij --apply.\n' +
        'Zonder grens zouden verse bestellingen als al verzonden en al gemaild worden weggeschreven,\n' +
        'waardoor die klanten nooit een verzendmail krijgen. Gebruik de datum waarop de webhook\n' +
        'orders ging wegschrijven.'
    )
    process.exit(1)
  }

  const stripe = new Stripe(key)
  const host = hostVan(doelUrl)
  console.log(`Modus: ${APPLY ? 'WEGSCHRIJVEN' : 'DROOGLOOP (er wordt niets opgeslagen)'}`)
  console.log(`Doel  : ${host}`)
  console.log(`Stripe: ${isTestSleutel ? 'TESTMODUS' : 'LIVE'}`)
  console.log(`Grens : ${VOOR ? `alleen bestellingen van vóór ${VOOR.toLocaleDateString('nl-NL')}` : 'GEEN (--before ontbreekt)'}`)
  if (TEST_MAILS) {
    console.log(`E-mail: OMGELEID naar ${TEST_MAIL_BASIS}+<bestelnummer>@${TEST_MAIL_DOMEIN}`)
  }
  console.log()

  // Alle checkout sessions doorlopen, nieuwste eerst, met paginatie.
  const betaald: Stripe.Checkout.Session[] = []
  for await (const s of stripe.checkout.sessions.list({ limit: 100, expand: ['data.payment_intent'] })) {
    if (s.payment_status === 'paid') betaald.push(s)
  }
  console.log(`${betaald.length} betaalde sessies gevonden.\n`)

  const overgeslagen: Overslag[] = []
  const teImporteren: { session: Stripe.Checkout.Session; nogTeVerzenden: boolean }[] = []

  for (const s of betaald) {
    const ref = s.metadata?.orderRef ?? s.id
    const email = s.customer_details?.email ?? ''

    if (VOOR && new Date(s.created * 1000) >= VOOR) {
      overgeslagen.push({ ref, email, reden: 'nieuwer dan --before, webhook handelt die af' })
      continue
    }
    if (!s.livemode && !ALLOW_TEST) {
      overgeslagen.push({ ref, email, reden: 'testdata' })
      continue
    }
    if (!email) {
      overgeslagen.push({ ref, email: '(geen)', reden: 'geen e-mailadres' })
      continue
    }
    if (await isTerugbetaaldOfBetwist(stripe, s)) {
      overgeslagen.push({ ref, email, reden: 'terugbetaald of betwist' })
      continue
    }
    const bestaat = await findOrderBySessionId(s.id)
    if (bestaat) {
      overgeslagen.push({ ref, email, reden: 'staat al in de database' })
      continue
    }

    teImporteren.push({ session: s, nogTeVerzenden: naamVan(s).toLowerCase() === NOG_TE_VERZENDEN })
  }

  // ---- rapport
  console.log(`Zou importeren : ${teImporteren.length}`)
  console.log(`Zou overslaan  : ${overgeslagen.length}`)
  const perReden = new Map<string, number>()
  for (const o of overgeslagen) perReden.set(o.reden, (perReden.get(o.reden) ?? 0) + 1)
  for (const [reden, n] of perReden) console.log(`   ${n}x ${reden}`)

  const krijgenReviewmail = teImporteren.filter((t) => !t.nogTeVerzenden)
  console.log(`\nKrijgen te zijner tijd een reviewmail (${krijgenReviewmail.length}):`)
  for (const { session } of krijgenReviewmail) {
    const ref = session.metadata?.orderRef ?? session.id
    const echt = session.customer_details?.email ?? ''
    const naartoe = mailAdresVoor(echt, ref)
    console.log(`   ${ref.padEnd(26)} ${naartoe}${TEST_MAILS ? `   (echt: ${echt})` : ''}`)
  }

  const handmatig = teImporteren.filter((t) => t.nogTeVerzenden)
  console.log(`\nNog te verzenden, verschijnt in /admin/verzenden (${handmatig.length}):`)
  for (const { session } of handmatig) {
    const ref = session.metadata?.orderRef ?? session.id
    console.log(`   ${ref.padEnd(26)} ${naamVan(session)}  ${session.customer_details?.email}`)
  }

  if (!APPLY) {
    console.log('\nDrooploop klaar. Niets opgeslagen. Voeg --apply toe om echt te importeren.')
    return
  }

  // ---- bevestiging: je typt zelf de hostnaam over
  const db = getDb()
  const [{ aantal }] = await db.select({ aantal: sql<number>`count(*)::int` }).from(orders)
  console.log('\n' + '-'.repeat(64))
  console.log(`Je staat op het punt ${teImporteren.length} order(s) weg te schrijven naar:`)
  console.log(`   host            : ${host}`)
  console.log(`   orders nu       : ${aantal}`)
  console.log(`   straks ongeveer : ${aantal + teImporteren.length}`)
  console.log('-'.repeat(64))

  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const antwoord = (await rl.question('Typ de hostnaam over om door te gaan: ')).trim()
  rl.close()
  if (antwoord !== host) {
    console.error(`\nAfgebroken: "${antwoord}" is niet de hostnaam. Er is niets weggeschreven.`)
    process.exit(1)
  }
  console.log()
  let geschreven = 0
  for (const { session, nogTeVerzenden } of teImporteren) {
    const ref = session.metadata?.orderRef ?? session.id
    const betaaldOp = new Date(session.created * 1000)

    await upsertOrder({
      stripeSessionId: session.id,
      orderRef: ref,
      email: mailAdresVoor(session.customer_details!.email!, ref),
      placedAt: betaaldOp,
      totalAmount: session.amount_total ?? null,
    })

    const nu = new Date()
    if (nogTeVerzenden) {
      // Bevestiging markeren als verstuurd zodat die niet alsnog uitgaat,
      // maar de verzendmail juist NIET: die hoort te komen zodra het
      // trackingnummer wordt ingevuld.
      await db
        .update(orders)
        .set({ status: 'betaald', confirmationEmailSentAt: nu, updatedAt: nu })
        .where(eq(orders.stripeSessionId, session.id))
    } else {
      // Betaaldatum plus drie dagen, maar nooit in de toekomst: bij een
      // bestelling van gisteren zou dat een verzenddatum opleveren die
      // nog moet komen, en daar rekent de reviewcron mee.
      const geschat = betaaldOp.getTime() + AANNAME_VERZENDDAGEN * 24 * 60 * 60 * 1000
      const verzondenOp = new Date(Math.min(geschat, Date.now()))
      await db
        .update(orders)
        .set({
          status: 'verzonden',
          confirmationEmailSentAt: nu,
          shippingEmailSentAt: nu,
          shippedAt: verzondenOp,
          reviewToken: reviewToken(),
          reviewOptOut: false,
          updatedAt: nu,
        })
        .where(eq(orders.stripeSessionId, session.id))
    }
    geschreven++
  }
  console.log(`\n${geschreven} order(s) weggeschreven.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
