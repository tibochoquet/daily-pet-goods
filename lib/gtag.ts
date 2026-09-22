/**
 * Trimmed, because a stray space pasted into the env var silently breaks
 * the tag: the id ends up inside the gtag.js URL and in gtag('config'),
 * so Google receives an id it doesn't recognise and nothing is measured -
 * with no error anywhere to point at the cause.
 */
export const GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID?.trim() || undefined

/**
 * "AW-<id>/<label>" for the "Aankoop (2)" conversion action in Google Ads
 * - the tag/event based one. Hardcoded rather than an env var because
 * it's tied 1:1 to one specific conversion action in the Ads account; if
 * that action is ever recreated, update the label here.
 *
 * The older "Aankoop" action is a page-load URL rule on /checkout/succes
 * and fires on its own, without our involvement. Keep that one on
 * Secondary in Google Ads: it counts every view of the thank-you page,
 * including refreshes and visits without a payment, and carries no
 * transaction_id. Only this event is gated on a Stripe-confirmed payment
 * and carries the real order value and reference.
 */
export const PURCHASE_CONVERSION = 'AW-18434030281/rSqsCJPU14YdEMn1g9ZE'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Reports a Google Ads conversion (e.g. a completed purchase) via gtag.js.
 * `sendTo` is the full "AW-CONVERSION_ID/CONVERSION_LABEL" string from the
 * conversion action in Google Ads - not just the base tag ID.
 *
 * No-ops if gtag.js hasn't loaded. The tag is only injected in production
 * (see components/GoogleTag.tsx), so this is always a no-op in local dev,
 * and it also protects against ad blockers stripping the script.
 */
export function trackConversion(sendTo: string, value: number, currency: string, transactionId: string): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', 'conversion', {
    send_to: sendTo,
    value,
    currency,
    transaction_id: transactionId,
  })
}
