import Link from 'next/link'
import { Star } from 'lucide-react'
import type { ReviewRow } from '@/lib/db/schema'
import { REVIEW_REQUEST_DAYS_AFTER_SHIPPING } from '@/lib/reviews'

/**
 * Reviews op de productpagina.
 *
 * De uitleg onderaan is geen vrijblijvende tekst: de ACM verplicht een
 * verkoper die reviews toont om te vertellen hoe hij controleert dat ze
 * van echte kopers komen, of negatieve reviews ook worden getoond, hoe
 * het gemiddelde tot stand komt, en of er een beloning tegenover staat.
 */

function Sterren({ waarde, grootte = 15 }: { waarde: number; grootte?: number }) {
  return (
    <span className="inline-flex" aria-label={`${waarde} van de 5 sterren`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={grootte}
          aria-hidden
          className={n <= Math.round(waarde) ? 'fill-[#C8745A] text-[#C8745A]' : 'text-[#DCD5C7]'}
        />
      ))}
    </span>
  )
}

export default function ProductReviews({
  items,
  aantal,
  gemiddelde,
}: {
  items: ReviewRow[]
  aantal: number
  gemiddelde: number
}) {
  return (
    <section className="border-t border-[#E8E2D9] bg-[#FAFAF7]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">Wat anderen ervan vinden</h2>

        {aantal === 0 ? (
          <p className="text-[#6B7280] text-sm leading-relaxed max-w-2xl">
            Er staan nog geen reviews bij dit product. Heb je het gekocht, dan krijg je{' '}
            {REVIEW_REQUEST_DAYS_AFTER_SHIPPING} dagen na verzending een mail met de vraag hoe het bevalt.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Sterren waarde={gemiddelde} grootte={20} />
              <span className="text-lg font-semibold text-[#1A1A1A]">
                {gemiddelde.toFixed(1).replace('.', ',')}
              </span>
              <span className="text-sm text-[#6B7280]">
                op basis van {aantal} {aantal === 1 ? 'review' : 'reviews'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
              {items.map((r) => (
                <article key={r.id} className="bg-white border border-[#E8E2D9] rounded-2xl p-5">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <Sterren waarde={r.rating} />
                    <time
                      dateTime={r.createdAt.toISOString()}
                      className="text-xs text-[#9CA3AF]"
                    >
                      {r.createdAt.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}
                    </time>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-[#1A1A1A]">{r.name}</span>
                    {r.verified && (
                      <span className="bg-[#2C4A3E]/10 text-[#2C4A3E] text-[11px] px-2 py-0.5 rounded-full font-medium">
                        Geverifieerde koper
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-[#4B5563] leading-relaxed whitespace-pre-wrap">{r.text}</p>

                  {r.photoUrl && r.photoConsent && (
                    /* Geen next/image: de foto staat op Vercel Blob en is per
                       review anders, dus optimaliseren levert hier niets op. */
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={r.photoUrl}
                      alt={`Foto bij de review van ${r.name}`}
                      loading="lazy"
                      className="mt-4 max-h-60 rounded-xl border border-[#E8E2D9]"
                    />
                  )}
                </article>
              ))}
            </div>
          </>
        )}

        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5 sm:p-6 max-w-3xl">
          <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Hoe wij met reviews omgaan</h3>
          <ul className="text-sm text-[#6B7280] leading-relaxed space-y-2 list-disc pl-5">
            <li>
              <strong className="text-[#4B5563] font-medium">Alleen van echte kopers.</strong> Een review kan
              alleen worden achtergelaten via de persoonlijke link uit onze e-mail, of met een bestelnummer en
              het e-mailadres van die bestelling. We koppelen elke review aan een betaalde bestelling; lukt dat
              niet, dan slaan we hem niet op.
            </li>
            <li>
              <strong className="text-[#4B5563] font-medium">Ook kritische reviews.</strong> We plaatsen elke
              echte review, of die nu positief of negatief is. We weigeren alleen spam, scheldwoorden en
              berichten met persoonsgegevens erin.
            </li>
            <li>
              <strong className="text-[#4B5563] font-medium">Zo rekenen we het gemiddelde.</strong> Het is het
              rekenkundig gemiddelde van alle geplaatste reviews bij dit product, afgerond op één decimaal.
              Elke review telt even zwaar.
            </li>
            <li>
              <strong className="text-[#4B5563] font-medium">Over de maandelijkse actie.</strong> Wie een foto
              bij zijn review deelt, maakt kans op een pakket ter waarde van € 100. We kiezen op de foto en
              niet op het oordeel: een kritische review maakt evenveel kans.{' '}
              <Link href="/actievoorwaarden" className="text-[#2C4A3E] underline">
                Bekijk de actievoorwaarden
              </Link>
              .
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
