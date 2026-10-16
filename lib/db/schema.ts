import { boolean, index, integer, pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

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
