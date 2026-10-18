import Link from 'next/link'
import { Star } from 'lucide-react'

/**
 * Verwijst naar /review in plaats van een eigen formulier.
 *
 * Er was hier eerder een tweede inzendroute met eigen regels: geen
 * opslag, geen foto, en ontdubbelen via Stripe-metadata in plaats van
 * de unieke index in de database. Twee routes betekende twee waarheden,
 * dus die is weg. Het token in de link doet hier hetzelfde werk als het
 * token uit de reviewmail.
 */
export default function ReviewLinks({
  items,
  reviewToken,
  reviewedSlugs,
}: {
  items: { productSlug: string | null; name: string }[]
  reviewToken: string | null
  reviewedSlugs: string[]
}) {
  const open = items.filter((i) => i.productSlug && !reviewedSlugs.includes(i.productSlug))

  if (open.length === 0) {
    return (
      <p className="text-sm text-[#6B7280]">
        Je hebt al een review achtergelaten voor de producten uit deze bestelling. Bedankt daarvoor.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-[#6B7280]">
        Deel je ervaring. Met een foto van je huisdier erbij maak je kans op een pakket t.w.v. € 100.
      </p>
      <div className="flex flex-wrap gap-2">
        {open.map((item) => {
          const params = new URLSearchParams({ product: item.name })
          if (reviewToken) params.set('t', reviewToken)
          return (
            <Link
              key={item.productSlug}
              href={`/review?${params.toString()}`}
              className="inline-flex items-center gap-2 bg-[#2C4A3E] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#3D6456] transition-colors"
            >
              <Star size={15} />
              {item.name} beoordelen
            </Link>
          )
        })}
      </div>
    </div>
  )
}
