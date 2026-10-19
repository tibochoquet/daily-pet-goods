import type { Metadata } from 'next'
import { isDbConfigured } from '@/lib/db'
import { countReviewsByStatus, findReviewsByStatus } from '@/lib/db/reviews'
import { REVIEW_STATUSES, type ReviewStatus } from '@/lib/reviews'
import ReviewRegel from '@/components/admin/ReviewRegel'

export const metadata: Metadata = {
  title: 'Reviews',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const LABELS: Record<ReviewStatus, string> = {
  pending: 'Wacht op beoordeling',
  published: 'Gepubliceerd',
  rejected: 'Afgewezen',
}

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  if (!isDbConfigured()) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <p className="text-sm text-[#C8745A]">DATABASE_URL ontbreekt, dus er valt niets te tonen.</p>
      </div>
    )
  }

  const { status } = await searchParams
  const actief: ReviewStatus = REVIEW_STATUSES.includes(status as ReviewStatus)
    ? (status as ReviewStatus)
    : 'pending'

  const [lijst, telling] = await Promise.all([findReviewsByStatus(actief), countReviewsByStatus()])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-1">Reviews</h1>
      <p className="text-sm text-[#6B7280] mb-8">
        Publiceer elke echte review, ook een kritische. Wijs alleen af wat spam is, scheldwoorden bevat of
        persoonsgegevens prijsgeeft.
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {REVIEW_STATUSES.map((s) => (
          <a
            key={s}
            href={`/admin/reviews?status=${s}`}
            className={`text-sm px-4 py-2 rounded-full border transition-colors ${
              s === actief
                ? 'bg-[#2C4A3E] text-white border-[#2C4A3E]'
                : 'bg-white text-[#4B5563] border-[#E8E2D9] hover:border-[#2C4A3E]'
            }`}
          >
            {LABELS[s]} <span className="opacity-70">({telling[s] ?? 0})</span>
          </a>
        ))}
      </div>

      {lijst.length === 0 ? (
        <p className="text-sm text-[#9CA3AF] bg-white border border-[#E8E2D9] rounded-2xl p-5">
          Niets in deze lijst.
        </p>
      ) : (
        <div className="space-y-4">
          {lijst.map((r) => (
            <ReviewRegel key={r.id} review={{ ...r, createdAt: r.createdAt.toISOString() }} />
          ))}
        </div>
      )}
    </div>
  )
}
