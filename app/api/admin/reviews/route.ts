import { NextRequest, NextResponse } from 'next/server'
import { setReviewStatus } from '@/lib/db/reviews'
import { REVIEW_STATUSES, type ReviewStatus } from '@/lib/reviews'

/** Publiceren of afwijzen. Afgeschermd door proxy.ts, dat /api/admin bewaakt. */
export async function POST(req: NextRequest) {
  let body: { id?: number; status?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Ongeldig verzoek' }, { status: 400 })
  }

  const { id, status } = body
  if (typeof id !== 'number' || !REVIEW_STATUSES.includes(status as ReviewStatus)) {
    return NextResponse.json({ ok: false, error: 'Onbekende review of status' }, { status: 400 })
  }

  const gelukt = await setReviewStatus(id, status as ReviewStatus)
  if (!gelukt) {
    return NextResponse.json({ ok: false, error: 'Review niet gevonden' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
