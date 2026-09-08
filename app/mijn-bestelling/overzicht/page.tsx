import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Package } from 'lucide-react'
import { findOrdersByEmail, resolveStatusBadgeVariant } from '@/lib/orders'
import { verifyAccountSessionToken, ACCOUNT_SESSION_COOKIE } from '@/lib/session'
import Badge from '@/components/ui/Badge'

export const metadata: Metadata = {
  title: 'Mijn bestellingen',
  alternates: { canonical: '/mijn-bestelling/overzicht' },
  robots: { index: false, follow: true },
}

export default async function OverzichtPage() {
  const cookieStore = await cookies()
  const email = verifyAccountSessionToken(cookieStore.get(ACCOUNT_SESSION_COOKIE)?.value)

  if (!email) {
    redirect('/mijn-bestelling')
  }

  const orders = await findOrdersByEmail(email)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
      <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-2">Mijn bestellingen</h1>
      <p className="text-sm text-[#6B7280] mb-10">Ingelogd als {email}</p>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-10 text-center">
          <Package size={32} className="mx-auto text-[#C8B89A] mb-4" />
          <p className="text-[#6B7280]">We konden geen bestellingen vinden voor dit e-mailadres.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.orderRef} className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="font-semibold text-[#1A1A1A]">Bestelling {order.orderRef}</p>
                  <p className="text-xs text-[#9CA3AF]">
                    {new Date(order.createdAt).toLocaleDateString('nl-NL', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <Badge variant={resolveStatusBadgeVariant(order)} />
              </div>

              <ul className="text-sm text-[#4B5563] space-y-1 mb-4">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E8E2D9] pt-4">
                <span className="font-semibold text-[#1A1A1A]">€{order.total.toFixed(2)}</span>
                <Link
                  href={`/mijn-bestelling/${encodeURIComponent(order.orderRef)}`}
                  className="text-sm font-medium text-[#2C4A3E] hover:underline"
                >
                  Bestelling bekijken →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
