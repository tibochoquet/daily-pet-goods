/**
 * Leest de stand van zaken uit de database en drukt hem af. Schrijft
 * niets, verstuurt niets.
 *
 *   export STATUS_DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require"
 *   npx tsx scripts/status.mts
 */
import { neon } from '@neondatabase/serverless'
import { REVIEW_REQUEST_DAYS_AFTER_SHIPPING } from '../lib/reviews.js'

const url = process.env.STATUS_DATABASE_URL
if (!url) {
  console.error('STATUS_DATABASE_URL ontbreekt. Geef op welke database je wilt bekijken.')
  process.exit(1)
}
const sql = neon(url.trim())
const host = url.match(/@([^/]+)\//)?.[1] ?? '(onbekend)'
const nl = (d: unknown) => (d ? new Date(d as string).toLocaleDateString('nl-NL') : '-')

console.log(`Database: ${host}\n`)

const orders = await sql`SELECT order_ref, email, status, carrier, tracking_number,
                                shipped_at, shipping_email_sent_at, review_email_sent_at, review_opt_out
                         FROM orders ORDER BY placed_at`
console.log(`BESTELLINGEN (${orders.length})`)
console.log('  ' + 'bestelnummer'.padEnd(22) + 'status'.padEnd(11) + 'verzonden'.padEnd(12) + 'verzendmail'.padEnd(13) + 'reviewmail')
for (const o of orders) {
  console.log(
    '  ' +
      String(o.order_ref).padEnd(22) +
      String(o.status).padEnd(11) +
      nl(o.shipped_at).padEnd(12) +
      (o.shipping_email_sent_at ? 'verstuurd' : '-').padEnd(13) +
      (o.review_opt_out ? 'afgemeld' : o.review_email_sent_at ? `verstuurd ${nl(o.review_email_sent_at)}` : 'nog niet')
  )
}

// Wanneer is welke reviewmail aan de beurt?
const wachtend = orders.filter(
  (o) => o.status === 'verzonden' && o.shipped_at && !o.review_email_sent_at && !o.review_opt_out
)
console.log(`\nREVIEWMAILS DIE NOG KOMEN (${wachtend.length}), ${REVIEW_REQUEST_DAYS_AFTER_SHIPPING} dagen na verzending`)
const perDag = new Map<string, string[]>()
for (const o of wachtend) {
  const due = new Date(o.shipped_at as string)
  due.setDate(due.getDate() + REVIEW_REQUEST_DAYS_AFTER_SHIPPING)
  const dag = due.toLocaleDateString('nl-NL')
  perDag.set(dag, [...(perDag.get(dag) ?? []), String(o.email)])
}
for (const [dag, mails] of [...perDag.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  console.log(`  ${dag.padEnd(12)} ${mails.length}x`)
  for (const m of mails) console.log(`     ${m}`)
}

const reviews = await sql`SELECT status, count(*)::int AS n FROM reviews GROUP BY status`
console.log(`\nREVIEWS`)
if (!reviews.length) console.log('  nog geen')
for (const r of reviews) console.log(`  ${String(r.status).padEnd(12)} ${r.n}`)
