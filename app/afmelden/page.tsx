import type { Metadata } from 'next'
import { findOrderByReviewToken } from '@/lib/db/orders'
import { isDbConfigured } from '@/lib/db'
import AfmeldKnop from '@/components/orders/AfmeldKnop'

export const metadata: Metadata = {
  title: 'Afmelden voor reviewverzoeken',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

/**
 * Afmelden voor reviewverzoeken.
 *
 * Deze pagina meldt niemand af. Mailprogramma's en virusscanners
 * openen links in een mail automatisch om ze te controleren; zou een
 * GET hier al afmelden, dan meldde die scanner de klant af zonder dat
 * iemand heeft geklikt. Afmelden gebeurt daarom pas bij een POST,
 * achter een knop.
 */
export default async function AfmeldenPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>
}) {
  const { t } = await searchParams
  const geldig = Boolean(t) && isDbConfigured() && Boolean(await findOrderByReviewToken(t!))

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
      <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-4">Geen reviewverzoeken meer</h1>

      {geldig ? (
        <>
          <p className="text-[#4B5563] leading-relaxed mb-8">
            We vragen je na een bestelling één keer om een review. Wil je die mail niet meer ontvangen, dan
            zetten we dat hieronder voor je uit. Je bestelbevestiging en de mail dat je pakket onderweg is
            blijven gewoon komen.
          </p>
          <AfmeldKnop token={t!} />
        </>
      ) : (
        <p className="text-[#4B5563] leading-relaxed">
          Deze afmeldlink werkt niet meer. Mail ons gerust, dan regelen we het met de hand.
        </p>
      )}
    </div>
  )
}
