import Link from 'next/link'
import { XCircle } from 'lucide-react'

/**
 * Landing page when a customer cancels or backs out of Stripe Checkout.
 * Nothing was charged - Stripe only redirects here if the payment was
 * never completed - so the cart is left untouched and the customer can
 * simply try again.
 */
export default function CheckoutCancelledPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 bg-[#FBEFEA] rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle size={32} className="text-[#C8745A]" />
      </div>

      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-3">
        Betaling geannuleerd
      </h1>
      <p className="text-[#6B7280] leading-relaxed mb-10">
        Je bestelling is niet afgerond en er is niets van je rekening afgeschreven. Je winkelwagen
        staat nog klaar, dus je kunt gerust opnieuw afrekenen.
      </p>

      <div className="flex justify-center">
        <Link
          href="/winkelwagen"
          className="inline-flex items-center justify-center gap-2 bg-[#2C4A3E] text-white font-medium px-6 py-3 rounded-full hover:bg-[#3D6456] transition-colors"
        >
          Terug naar winkelwagen
        </Link>
      </div>
    </div>
  )
}
