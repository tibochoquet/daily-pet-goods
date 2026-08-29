import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'

/**
 * Landing page after a successful Stripe Checkout redirect. This page is
 * purely cosmetic - it reads the session back from Stripe to show a nice
 * order summary, but the ORDER ITSELF is only ever confirmed by the
 * webhook (app/api/webhooks/stripe/route.ts). A visitor reaching this URL
 * is not, on its own, proof of payment (they could reload it, share the
 * link, or land here after an interrupted flow), so nothing here writes
 * or emails anything.
 */

async function getSession(sessionId: string): Promise<Stripe.Checkout.Session | null> {
  try {
    const stripe = getStripe()
    return await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] })
  } catch (err) {
    console.error('Kon Checkout Session niet ophalen voor de succespagina:', err)
    return null
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id: sessionId } = await searchParams
  const session = sessionId ? await getSession(sessionId) : null

  const total = session?.amount_total != null ? (session.amount_total / 100).toFixed(2) : null
  const email = session?.customer_details?.email

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 bg-[#F0F7F4] rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={32} className="text-[#2C4A3E]" />
      </div>

      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-3">
        Bedankt voor je bestelling!
      </h1>

      <p className="text-[#6B7280] leading-relaxed mb-2">
        Je betaling is gelukt{total ? ` (€${total})` : ''}. We hebben je bestelling ontvangen en
        gaan &apos;m zo snel mogelijk inpakken en versturen.
      </p>
      {email && (
        <p className="text-[#6B7280] leading-relaxed mb-2">
          Een bevestiging is onderweg naar <span className="text-[#1A1A1A]">{email}</span>.
        </p>
      )}
      <p className="text-[#6B7280] leading-relaxed mb-10">
        Vragen over je bestelling? Mail ons op{' '}
        <a href="mailto:lifegoods.daily@gmail.com" className="text-[#2C4A3E] hover:underline">
          lifegoods.daily@gmail.com
        </a>
      </p>

      <Link
        href="/shop"
        className="inline-flex items-center gap-2 bg-[#2C4A3E] text-white font-medium px-6 py-3 rounded-full hover:bg-[#3D6456] transition-colors"
      >
        Verder shoppen
      </Link>
    </div>
  )
}
