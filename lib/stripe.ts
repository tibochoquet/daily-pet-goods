import Stripe from 'stripe'

/**
 * Server-only Stripe client. Never import this from a Client Component.
 *
 * Instantiated lazily (on first call, then cached) instead of at module
 * load time. Creating it eagerly at the top of this file broke the Vercel
 * build in the past for the Resend client (the same pattern used to live
 * in a now-removed /api/order route) because env vars aren't guaranteed
 * to be present at build time - the same risk applies here, so we
 * sidestep it the same way.
 */
let stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY ontbreekt. Zet hem in .env.local (zie .env.example).')
    }
    stripe = new Stripe(secretKey)
  }
  return stripe
}
