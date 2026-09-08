import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { RotateCcw, Star, Truck, MessageCircle } from 'lucide-react'
import { resolveAuthorizedOrder, resolveStatusBadgeVariant } from '@/lib/orders'
import {
  verifyOrderAccessToken,
  verifyAccountSessionToken,
  orderAccessCookieName,
  ACCOUNT_SESSION_COOKIE,
} from '@/lib/session'
import { business } from '@/lib/business'
import Badge from '@/components/ui/Badge'
import OrderAccessGate from '@/components/orders/OrderAccessGate'
import ReturnRequestFlow from '@/components/orders/ReturnRequestFlow'
import ReviewForm from '@/components/orders/ReviewForm'

export const metadata: Metadata = {
  title: 'Bestelling bekijken',
  robots: { index: false, follow: true },
}

interface Props {
  params: Promise<{ orderRef: string }>
}

export default async function OrderDetailPage({ params }: Props) {
  const { orderRef: rawOrderRef } = await params
  const orderRef = decodeURIComponent(rawOrderRef).toUpperCase()

  const cookieStore = await cookies()
  const orderAccessEmail = verifyOrderAccessToken(cookieStore.get(orderAccessCookieName(orderRef))?.value, orderRef)
  const accountEmail = verifyAccountSessionToken(cookieStore.get(ACCOUNT_SESSION_COOKIE)?.value)
  const order = await resolveAuthorizedOrder(orderRef, { orderAccessEmail, accountEmail })

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-2 text-center">Bevestig je e-mailadres</h1>
        <p className="text-sm text-[#6B7280] mb-6 text-center">
          Vul het e-mailadres in waarmee je bestelling {orderRef} is geplaatst.
        </p>
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
          <OrderAccessGate orderRef={orderRef} />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-1">Bestelling {order.orderRef}</h1>
          <p className="text-sm text-[#6B7280]">
            {new Date(order.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Badge variant={resolveStatusBadgeVariant(order)} />
      </div>

      {/* Products */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 mb-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-4">Producten</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-sm border-b border-[#E8E2D9] last:border-0 pb-3 last:pb-0"
            >
              <span className="text-[#4B5563]">
                {item.name} × {item.quantity}
              </span>
              <span className="text-[#1A1A1A] font-medium">€{item.amountTotal.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#E8E2D9]">
          <span className="font-semibold text-[#1A1A1A]">Totaal</span>
          <span className="font-semibold text-[#1A1A1A]">€{order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping / Track & Trace */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 mb-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
          <Truck size={18} className="text-[#2C4A3E]" />
          Verzending
        </h2>
        {order.shippingAddress && (
          <p className="text-sm text-[#4B5563] mb-4">
            {order.shippingAddress.name}
            <br />
            {order.shippingAddress.line1} {order.shippingAddress.line2}
            <br />
            {order.shippingAddress.postalCode} {order.shippingAddress.city}
            <br />
            {order.shippingAddress.country}
          </p>
        )}
        {order.trackingUrl ? (
          <a
            href={order.trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#2C4A3E] text-white font-medium px-5 py-2.5 rounded-full hover:bg-[#3D6456] transition-colors text-sm"
          >
            Track & Trace bekijken
          </a>
        ) : (
          <p className="text-sm text-[#6B7280]">
            Je bestelling is onderweg 📦 We verzenden binnen 1-2 werkdagen na betaling, via DHL en gratis. Je
            ontvangt de Track &amp; Trace-code rechtstreeks van DHL per e-mail zodra je bestelling is verzonden.
          </p>
        )}
      </div>

      {/* Returns */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 mb-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
          <RotateCcw size={18} className="text-[#2C4A3E]" />
          Retour
        </h2>
        <ReturnRequestFlow order={order} />
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 mb-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
          <Star size={18} className="text-[#2C4A3E]" />
          Review schrijven
        </h2>
        <ReviewForm order={order} />
      </div>

      {/* Contact */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 text-center">
        <MessageCircle size={20} className="mx-auto text-[#2C4A3E] mb-2" />
        <p className="text-sm text-[#6B7280] mb-3">Heb je een vraag over deze bestelling?</p>
        <a href={`mailto:${business.email}`} className="text-sm font-medium text-[#2C4A3E] hover:underline">
          Mail ons
        </a>
      </div>
    </div>
  )
}
