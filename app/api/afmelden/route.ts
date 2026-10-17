import { NextRequest, NextResponse } from 'next/server'
import { setReviewOptOut } from '@/lib/db/orders'

/**
 * Afmelden voor reviewverzoeken. Alleen POST: een GET mag nooit
 * afmelden, want mailprogramma's en virusscanners openen links in een
 * mail automatisch om ze te controleren.
 */
export async function POST(req: NextRequest) {
  let token: string | undefined
  try {
    token = (await req.json()).token
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
  if (!token) return NextResponse.json({ ok: false }, { status: 400 })

  const gelukt = await setReviewOptOut(token)
  // Naar buiten toe geen verschil tussen "bestond niet" en "gelukt":
  // anders kun je raden welke tokens bestaan.
  if (!gelukt) console.info('Afmelden: onbekend token aangeboden.')
  return NextResponse.json({ ok: true })
}
