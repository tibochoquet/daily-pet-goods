export const GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID

/**
 * "AW-<id>/<label>" for the Aankoop (Purchase) conversion action in Google
 * Ads. Hardcoded rather than an env var because it's tied 1:1 to one
 * specific conversion action already created in the Ads account - if that
 * action is ever recreated, update the label here.
 */
export const PURCHASE_CONVERSION = 'AW-18434030281/0-0jCKy04u8cEMn1g9ZE'

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
