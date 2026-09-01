import { redirect } from 'next/navigation'

/**
 * This used to be a standalone checkout form that posted to the now-removed
 * /api/order route (a pre-Stripe "we'll send you a Tikkie" flow). Real
 * checkout now happens from /winkelwagen, which calls /api/checkout to
 * create a Stripe Checkout Session. This route is kept only so old links
 * or bookmarks to /checkout don't 404 - it just sends visitors to the cart.
 */
export default function CheckoutRedirectPage() {
  redirect('/winkelwagen')
}
