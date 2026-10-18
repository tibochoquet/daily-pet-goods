import { and, desc, eq } from 'drizzle-orm'
import { getDb } from './index'
import { orders, reviews, type ReviewRow } from './schema'
import type { ReviewStatus } from '../reviews'

/**
 * Opslag van reviews. Elke inzending komt binnen als `pending` en wordt
 * pas zichtbaar nadat je hem in /admin/reviews hebt goedgekeurd.
 */

export interface NieuweReview {
  orderId: number | null
  orderRef: string | null
  productSlug: string
  productName: string
  rating: number
  text: string
  name: string
  photoUrl: string | null
  photoConsent: boolean
  verified: boolean
}

/**
 * Postgres meldt een geschonden unieke index met code 23505. Drizzle
 * verpakt de oorspronkelijke fout, dus de code zit in de cause-keten en
 * niet in het bericht - daar op tekst zoeken werkte niet.
 */
function isUniekeSchending(err: unknown): boolean {
  let huidig: unknown = err
  for (let diep = 0; diep < 5 && huidig; diep++) {
    const e = huidig as { code?: string; constraint?: string; cause?: unknown }
    if (e.code === '23505' || e.constraint === 'reviews_order_product_key') return true
    huidig = e.cause
  }
  return false
}

export class DubbeleReviewError extends Error {
  constructor() {
    super('Voor deze bestelling is dit product al beoordeeld.')
    this.name = 'DubbeleReviewError'
  }
}

/**
 * Slaat een review op. Bestaat er al een review voor dezelfde
 * bestelling en hetzelfde product, dan weigert de database dat via een
 * unieke index - geen controle vooraf, want twee inzendingen tegelijk
 * zouden daar langs glippen.
 */
export async function createReview(input: NieuweReview): Promise<ReviewRow> {
  const db = getDb()
  try {
    const [row] = await db.insert(reviews).values(input).returning()
    return row
  } catch (err) {
    if (isUniekeSchending(err)) throw new DubbeleReviewError()
    throw err
  }
}

export async function findReviewsByStatus(status: ReviewStatus): Promise<ReviewRow[]> {
  const db = getDb()
  return db.select().from(reviews).where(eq(reviews.status, status)).orderBy(desc(reviews.createdAt))
}

export async function countReviewsByStatus(): Promise<Record<string, number>> {
  const db = getDb()
  const rijen = await db.select().from(reviews)
  const telling: Record<string, number> = { pending: 0, published: 0, rejected: 0 }
  for (const r of rijen) telling[r.status] = (telling[r.status] ?? 0) + 1
  return telling
}

export async function setReviewStatus(id: number, status: ReviewStatus): Promise<boolean> {
  const db = getDb()
  const bijgewerkt = await db
    .update(reviews)
    .set({ status, updatedAt: new Date() })
    .where(eq(reviews.id, id))
    .returning({ id: reviews.id })
  return bijgewerkt.length > 0
}

/**
 * Zoekt een betaalde bestelling bij bestelnummer en e-mailadres. Beide
 * moeten kloppen: een bestelnummer alleen is te raden, en een
 * e-mailadres alleen zegt niets over wie besteld heeft.
 */
export async function findPaidOrderByRefAndEmail(orderRef: string, email: string) {
  const db = getDb()
  const [row] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.orderRef, orderRef.trim().toUpperCase()), eq(orders.email, email.trim().toLowerCase())))
    .limit(1)
  return row ?? null
}

/** Welke producten al beoordeeld zijn voor deze bestelling. */
export async function findReviewedSlugsForOrder(orderId: number): Promise<string[]> {
  const db = getDb()
  const rijen = await db
    .select({ slug: reviews.productSlug })
    .from(reviews)
    .where(eq(reviews.orderId, orderId))
  return rijen.map((r) => r.slug)
}
