import { boolean, index, integer, jsonb, pgTable, primaryKey, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

/**
 * Stripe blijft de bron van waarheid voor de betaling zelf. Deze tabel
 * bevat alleen wat Stripe niet kan vasthouden: of een mail al verstuurd
 * is, wat Sendcloud met het pakket deed, en straks de reviews.
 *
 * `stripeSessionId` is uniek. Dat is geen detail maar de kern van de
 * idempotentie: Stripe levert webhooks soms twee keer af, en twee
 * tegelijk binnenkomende leveringen mogen nooit twee mails opleveren.
 * De e-mailvlaggen worden daarom niet gelezen-en-dan-geschreven, maar in
 * een enkele UPDATE geclaimd (zie `claimEmailSend` in ./orders.ts).
 */
export const orders = pgTable(
  'orders',
  {
    id: serial('id').primaryKey(),

    stripeSessionId: text('stripe_session_id').notNull(),
    orderRef: text('order_ref').notNull(),
    email: text('email').notNull(),
    placedAt: timestamp('placed_at', { withTimezone: true }).notNull(),

    /** betaald -> verzonden -> bezorgd. Retour/terugbetaling komt uit Stripe. */
    status: text('status').notNull().default('betaald'),

    /** Centen, zoals Stripe ze geeft. Voor de reviewcron en controle. */
    totalAmount: integer('total_amount'),

    // Mailvlaggen: gezet op het moment van claimen, niet na verzending.
    confirmationEmailSentAt: timestamp('confirmation_email_sent_at', { withTimezone: true }),
    shippingEmailSentAt: timestamp('shipping_email_sent_at', { withTimezone: true }),
    reviewEmailSentAt: timestamp('review_email_sent_at', { withTimezone: true }),

    // Sendcloud (fase 2).
    sendcloudParcelId: text('sendcloud_parcel_id'),
    carrier: text('carrier'),
    trackingNumber: text('tracking_number'),
    trackingUrl: text('tracking_url'),
    shippedAt: timestamp('shipped_at', { withTimezone: true }),
    deliveredAt: timestamp('delivered_at', { withTimezone: true }),

    // Reviews (fase 3).
    reviewToken: text('review_token'),
    reviewOptOut: boolean('review_opt_out').notNull().default(false),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('orders_stripe_session_id_key').on(t.stripeSessionId),
    uniqueIndex('orders_order_ref_key').on(t.orderRef),
    uniqueIndex('orders_review_token_key').on(t.reviewToken),
    index('orders_email_idx').on(t.email),
    // De reviewcron zoekt op "bezorgd, nog geen reviewmail".
    index('orders_review_due_idx').on(t.deliveredAt, t.reviewEmailSentAt),
  ]
)

export type OrderRow = typeof orders.$inferSelect
export type NewOrderRow = typeof orders.$inferInsert

/**
 * Reviews. Tot nu toe bestond een review alleen als mail in de inbox;
 * nu is hij op te zoeken, te modereren en straks te tonen.
 *
 * `verified` betekent: we konden deze inzending aan een betaalde
 * bestelling koppelen, via het token uit de reviewmail of doordat de
 * klant bestelnummer en e-mailadres invulde die bij elkaar horen.
 *
 * De unieke index op (orderId, productSlug) zorgt dat je per bestelling
 * één review per product kunt achterlaten. Dat is een databaseregel en
 * geen controle in de code, zodat twee gelijktijdige inzendingen het
 * niet alsnog voor elkaar krijgen.
 */
export const reviews = pgTable(
  'reviews',
  {
    id: serial('id').primaryKey(),

    /** Verwijst naar orders.id; leeg bij een niet-geverifieerde inzending. */
    orderId: integer('order_id'),
    orderRef: text('order_ref'),
    productSlug: text('product_slug').notNull(),
    productName: text('product_name').notNull(),

    rating: integer('rating').notNull(),
    text: text('text').notNull(),
    name: text('name').notNull(),

    photoUrl: text('photo_url'),
    /** Expliciet aangevinkt dat de foto getoond mag worden. */
    photoConsent: boolean('photo_consent').notNull().default(false),

    verified: boolean('verified').notNull().default(false),
    status: text('status').notNull().default('pending'),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('reviews_order_product_key').on(t.orderId, t.productSlug),
    index('reviews_status_idx').on(t.status, t.createdAt),
    index('reviews_product_idx').on(t.productSlug, t.status),
  ]
)

export type ReviewRow = typeof reviews.$inferSelect
export type NewReviewRow = typeof reviews.$inferInsert

/**
 * Pogingen per sleutel, voor de snelheidsbegrenzing.
 *
 * Dit stond eerder in het geheugen van de server. Op Vercel draait elke
 * aanroep mogelijk op een andere instance, en die worden voortdurend
 * opgeruimd, dus zo'n teller begon telkens opnieuw - precies wanneer je
 * hem nodig hebt werkte hij niet. Eén rij per poging; tellen gebeurt
 * over een tijdvenster.
 */
export const rateLimitHits = pgTable(
  'rate_limit_hits',
  {
    id: serial('id').primaryKey(),
    /** Waarvoor geteld wordt, bijvoorbeeld 'review'. */
    bucket: text('bucket').notNull(),
    /** Waarop geteld wordt, meestal een IP-adres. */
    key: text('key').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('rate_limit_hits_lookup_idx').on(t.bucket, t.key, t.createdAt)]
)

/**
 * De documenten van de productselectietool (/selectie).
 *
 * Eén rij per document, met de inhoud als JSONB. De tool kent drie
 * collecties - `decisions` (per product), `custom` (zelf toegevoegde
 * producten) en `settings` (één document `main`) - en die vorm is hier
 * letterlijk overgenomen, zodat de app zelf niet hoeft te veranderen.
 *
 * Waarom JSONB en geen kolommen: de documenten zijn vormvrij en groeien
 * mee met de tool. Een schemawijziging per nieuw veld zou hier alleen
 * maar in de weg zitten; dit is geen webshopdata waar de vorm toe doet.
 */
export const selectieDocs = pgTable(
  'selectie_docs',
  {
    /** 'decisions', 'custom' of 'settings'. */
    collection: text('collection').notNull(),
    /** Product-id, eigen product-id, of 'main' bij settings. */
    docId: text('doc_id').notNull(),
    data: jsonb('data').notNull().default({}),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.collection, t.docId] })]
)

export type SelectieDocRow = typeof selectieDocs.$inferSelect
