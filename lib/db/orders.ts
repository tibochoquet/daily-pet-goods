import { and, eq, isNotNull, isNull, lte, sql } from 'drizzle-orm'
import type { AnyPgColumn } from 'drizzle-orm/pg-core'
import { getDb } from './index'
import { orders, type OrderRow } from './schema'

/**
 * Fulfilment-state rond een bestelling. De betaling zelf blijft in
 * Stripe; hier staat alleen wat Stripe niet bijhoudt.
 *
 * Let op het verschil met lib/orders.ts: dat leest de bestelling uit
 * Stripe (bedragen, regels, adres). Dit bestand gaat over wat wij er
 * daarna mee deden.
 */

export type EmailFlag = 'confirmationEmailSentAt' | 'shippingEmailSentAt' | 'reviewEmailSentAt'

// Drizzle typeert elke kolom op zijn eigen naam, dus een Record met één
// kolomtype past niet; AnyPgColumn is hier het gemeenschappelijke type.
const FLAG_COLUMN: Record<EmailFlag, AnyPgColumn> = {
  confirmationEmailSentAt: orders.confirmationEmailSentAt,
  shippingEmailSentAt: orders.shippingEmailSentAt,
  reviewEmailSentAt: orders.reviewEmailSentAt,
}

export interface UpsertOrderInput {
  stripeSessionId: string
  orderRef: string
  email: string
  placedAt: Date
  totalAmount?: number | null
}

/**
 * Legt de bestelling vast, of laat hem staan als hij er al is.
 *
 * Expres geen "bestaat hij al? zo nee, invoegen": twee webhooks die
 * tegelijk binnenkomen zouden dan allebei invoegen. De unieke index op
 * stripe_session_id plus ON CONFLICT lost dat in de database op.
 */
export async function upsertOrder(input: UpsertOrderInput): Promise<OrderRow> {
  const db = getDb()
  const [row] = await db
    .insert(orders)
    .values({
      stripeSessionId: input.stripeSessionId,
      orderRef: input.orderRef,
      email: input.email,
      placedAt: input.placedAt,
      totalAmount: input.totalAmount ?? null,
    })
    .onConflictDoUpdate({
      target: orders.stripeSessionId,
      // Niets inhoudelijks overschrijven: alleen aanraken zodat RETURNING
      // ook bij een botsing de bestaande rij teruggeeft.
      set: { updatedAt: new Date() },
    })
    .returning()
  return row
}

/**
 * Claimt het recht om een mail te versturen. Geeft `true` terug aan
 * precies één aanroeper, ook als er twee tegelijk binnenkomen.
 *
 * De vlag wordt gezet *voordat* de mail de deur uit gaat. Dat is bewust:
 * liever een gemiste mail die we terug kunnen zetten dan twee mails bij
 * dezelfde klant. Mislukt het versturen, dan zet `releaseEmailClaim` de
 * vlag weer op NULL zodat een volgende poging het opnieuw mag proberen.
 */
export async function claimEmailSend(stripeSessionId: string, flag: EmailFlag): Promise<boolean> {
  const db = getDb()
  const column = FLAG_COLUMN[flag]
  const claimed = await db
    .update(orders)
    .set({ [flag]: new Date(), updatedAt: new Date() })
    .where(and(eq(orders.stripeSessionId, stripeSessionId), isNull(column)))
    .returning({ id: orders.id })
  return claimed.length > 0
}

/** Draait een claim terug nadat het versturen is mislukt. */
export async function releaseEmailClaim(stripeSessionId: string, flag: EmailFlag): Promise<void> {
  const db = getDb()
  await db
    .update(orders)
    .set({ [flag]: null, updatedAt: new Date() })
    .where(eq(orders.stripeSessionId, stripeSessionId))
}

export async function findOrderBySessionId(stripeSessionId: string): Promise<OrderRow | null> {
  const db = getDb()
  const [row] = await db.select().from(orders).where(eq(orders.stripeSessionId, stripeSessionId)).limit(1)
  return row ?? null
}

export async function findOrderByRef(orderRef: string): Promise<OrderRow | null> {
  const db = getDb()
  const [row] = await db.select().from(orders).where(eq(orders.orderRef, orderRef)).limit(1)
  return row ?? null
}

/** Verzendgegevens van Sendcloud (fase 2). */
export async function saveShipment(
  stripeSessionId: string,
  data: {
    sendcloudParcelId?: string | null
    carrier?: string | null
    trackingNumber?: string | null
    trackingUrl?: string | null
    shippedAt?: Date | null
    status?: string
  }
): Promise<void> {
  const db = getDb()
  await db
    .update(orders)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(orders.stripeSessionId, stripeSessionId))
}

/**
 * Koppelt een Sendcloud-zending, maar alleen als er nog geen is. Zo
 * levert een tweede aanroep geen tweede pakket in het panel op.
 */
export async function claimSendcloudParcel(stripeSessionId: string, parcelId: string): Promise<boolean> {
  const db = getDb()
  const claimed = await db
    .update(orders)
    .set({ sendcloudParcelId: parcelId, updatedAt: new Date() })
    .where(and(eq(orders.stripeSessionId, stripeSessionId), isNull(orders.sendcloudParcelId)))
    .returning({ id: orders.id })
  return claimed.length > 0
}

export async function markDelivered(stripeSessionId: string, deliveredAt: Date): Promise<void> {
  const db = getDb()
  await db
    .update(orders)
    .set({ deliveredAt, status: 'bezorgd', updatedAt: new Date() })
    .where(eq(orders.stripeSessionId, stripeSessionId))
}

/** Healthcheck zonder iets te schrijven. */
export async function pingDb(): Promise<boolean> {
  const db = getDb()
  await db.execute(sql`select 1`)
  return true
}

// ---------------------------------------------------------------------
// Verzenden en reviews
// ---------------------------------------------------------------------

/** Betaald, maar nog geen trackingnummer: deze moeten nog de deur uit. */
export async function findOrdersAwaitingTracking(): Promise<OrderRow[]> {
  const db = getDb()
  return db
    .select()
    .from(orders)
    .where(and(eq(orders.status, 'betaald'), isNull(orders.trackingNumber)))
    .orderBy(orders.placedAt)
}

/**
 * Nummer staat er wel in, maar de mail is niet verstuurd. Dat gebeurt
 * als Resend hapert nadat het nummer al is opgeslagen - de claim wordt
 * dan teruggedraaid en de order belandt hier.
 */
export async function findOrdersAwaitingShippingEmail(): Promise<OrderRow[]> {
  const db = getDb()
  return db
    .select()
    .from(orders)
    .where(and(isNotNull(orders.trackingNumber), isNull(orders.shippingEmailSentAt)))
    .orderBy(orders.placedAt)
}

/**
 * Verzonden, lang genoeg geleden, nog geen reviewmail en niet
 * afgemeld. Oudste eerst, zodat een achterstand vooraan leegloopt.
 */
export async function findOrdersDueForReview(daysAfterShipping: number, limit: number): Promise<OrderRow[]> {
  const db = getDb()
  const grens = new Date(Date.now() - daysAfterShipping * 24 * 60 * 60 * 1000)
  return db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.status, 'verzonden'),
        isNotNull(orders.shippedAt),
        lte(orders.shippedAt, grens),
        isNull(orders.reviewEmailSentAt),
        eq(orders.reviewOptOut, false)
      )
    )
    .orderBy(orders.shippedAt)
    .limit(limit)
}

/**
 * Corrigeert alleen de trackinggegevens. Raakt `shippingEmailSentAt`
 * niet aan, dus een verbeterd nummer levert nooit een tweede mail op.
 */
export async function correctTracking(
  stripeSessionId: string,
  data: { carrier: string; trackingNumber: string; trackingUrl: string }
): Promise<void> {
  const db = getDb()
  await db
    .update(orders)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(orders.stripeSessionId, stripeSessionId))
}

export async function findOrderByReviewToken(token: string): Promise<OrderRow | null> {
  const db = getDb()
  const [row] = await db.select().from(orders).where(eq(orders.reviewToken, token)).limit(1)
  return row ?? null
}

/** Afmelden voor reviewverzoeken. Alleen via een POST aanroepen. */
export async function setReviewOptOut(token: string): Promise<boolean> {
  const db = getDb()
  const bijgewerkt = await db
    .update(orders)
    .set({ reviewOptOut: true, updatedAt: new Date() })
    .where(eq(orders.reviewToken, token))
    .returning({ id: orders.id })
  return bijgewerkt.length > 0
}

/** Geeft het bestaande reviewtoken terug, of maakt er een als het er nog niet is. */
export async function ensureReviewToken(stripeSessionId: string, maakToken: () => string): Promise<string | null> {
  const db = getDb()
  const bestaand = await findOrderBySessionId(stripeSessionId)
  if (!bestaand) return null
  if (bestaand.reviewToken) return bestaand.reviewToken
  const token = maakToken()
  await db
    .update(orders)
    .set({ reviewToken: token, updatedAt: new Date() })
    .where(eq(orders.stripeSessionId, stripeSessionId))
  return token
}
