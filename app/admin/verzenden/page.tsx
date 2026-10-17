import type { Metadata } from 'next'
import { findOrdersAwaitingShippingEmail, findOrdersAwaitingTracking } from '@/lib/db/orders'
import { enrichOrders } from '@/lib/adminOrders'
import { isDbConfigured } from '@/lib/db'
import VerzendRegel from '@/components/admin/VerzendRegel'

export const metadata: Metadata = {
  title: 'Verzenden',
  robots: { index: false, follow: false },
}

// Altijd vers: je kijkt hier juist of er iets nieuws binnen is.
export const dynamic = 'force-dynamic'

export default async function VerzendenPage() {
  if (!isDbConfigured()) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <p className="text-sm text-[#C8745A]">DATABASE_URL ontbreekt, dus er valt niets te tonen.</p>
      </div>
    )
  }

  const [teVerzenden, mailOpen] = await Promise.all([
    findOrdersAwaitingTracking().then(enrichOrders),
    findOrdersAwaitingShippingEmail().then(enrichOrders),
  ])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-1">Verzenden</h1>
      <p className="text-sm text-[#6B7280] mb-10">
        Plak hier het trackingnummer dat je in het portaal van DHL of DPD hebt aangemaakt. De klant krijgt
        daarna eenmalig een mail dat het pakket onderweg is.
      </p>

      <section className="mb-14">
        <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-1">
          Klaar om te verzenden{' '}
          <span className="text-sm font-normal text-[#9CA3AF]">({teVerzenden.length})</span>
        </h2>
        <p className="text-sm text-[#6B7280] mb-5">Betaald, nog geen trackingnummer.</p>
        {teVerzenden.length === 0 ? (
          <p className="text-sm text-[#9CA3AF] bg-white border border-[#E8E2D9] rounded-2xl p-5">
            Niets te verzenden. Alles is de deur uit.
          </p>
        ) : (
          <div className="space-y-4">
            {teVerzenden.map((o) => (
              <VerzendRegel key={o.stripeSessionId} order={o} modus="nieuw" />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-1">
          Mail nog niet verstuurd <span className="text-sm font-normal text-[#9CA3AF]">({mailOpen.length})</span>
        </h2>
        <p className="text-sm text-[#6B7280] mb-5">
          Het nummer is opgeslagen, maar de verzendmail is er niet uit gekomen. Dat kan gebeuren als de
          mailprovider hapert; probeer het hier opnieuw.
        </p>
        {mailOpen.length === 0 ? (
          <p className="text-sm text-[#9CA3AF] bg-white border border-[#E8E2D9] rounded-2xl p-5">
            Geen openstaande mails.
          </p>
        ) : (
          <div className="space-y-4">
            {mailOpen.map((o) => (
              <VerzendRegel key={o.stripeSessionId} order={o} modus="mail-open" />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
