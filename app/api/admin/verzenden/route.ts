import { NextRequest, NextResponse } from 'next/server'
import { isCarrier, normalizeTrackingNumber, trackingUrl } from '@/lib/carriers'
import { correctTracking, findOrderBySessionId, saveShipment } from '@/lib/db/orders'
import { AlVerstuurdError, sendShippingEmail } from '@/lib/mailSenders'

/**
 * De acties van /admin/verzenden. Afgeschermd door proxy.ts, dat alles
 * onder /api/admin tegenhoudt zonder geldig wachtwoord.
 *
 * Drie acties, bewust uit elkaar gehouden:
 *  - verzend    nummer opslaan en de klant eenmalig mailen
 *  - opnieuw    alleen de mail nog een keer proberen
 *  - corrigeer  het nummer verbeteren zonder iets te mailen
 */
export async function POST(req: NextRequest) {
  let body: { stripeSessionId?: string; carrier?: string; trackingNumber?: string; actie?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Ongeldig verzoek' }, { status: 400 })
  }

  const { stripeSessionId, carrier, actie } = body
  if (!stripeSessionId) {
    return NextResponse.json({ ok: false, error: 'Bestelling ontbreekt' }, { status: 400 })
  }
  if (!isCarrier(carrier)) {
    return NextResponse.json({ ok: false, error: 'Kies DHL of DPD' }, { status: 400 })
  }
  const nummer = normalizeTrackingNumber(body.trackingNumber ?? '')
  if (!nummer) {
    return NextResponse.json(
      { ok: false, error: 'Trackingnummer lijkt niet te kloppen (6 tot 40 tekens, letters en cijfers)' },
      { status: 400 }
    )
  }

  const order = await findOrderBySessionId(stripeSessionId)
  if (!order) {
    return NextResponse.json({ ok: false, error: 'Bestelling niet gevonden' }, { status: 404 })
  }

  const url = trackingUrl(carrier, nummer)

  // Alleen het nummer verbeteren: raakt de mailvlag niet aan, dus er
  // gaat gegarandeerd geen tweede mail uit.
  if (actie === 'corrigeer') {
    await correctTracking(stripeSessionId, { carrier, trackingNumber: nummer, trackingUrl: url })
    return NextResponse.json({ ok: true, bericht: `Nummer bijgewerkt naar ${nummer}. Geen mail verstuurd.` })
  }

  // Eerst opslaan, dan pas mailen. Gaat het mailen mis, dan is het
  // nummer in elk geval bewaard en kun je het hier opnieuw proberen.
  await saveShipment(stripeSessionId, {
    carrier,
    trackingNumber: nummer,
    trackingUrl: url,
    shippedAt: order.shippedAt ?? new Date(),
    status: 'verzonden',
  })

  try {
    await sendShippingEmail(stripeSessionId, carrier, nummer)
  } catch (err) {
    if (err instanceof AlVerstuurdError) {
      return NextResponse.json({
        ok: true,
        bericht: 'Nummer opgeslagen. De verzendmail was al eerder verstuurd, dus die is niet herhaald.',
      })
    }
    console.error('Beheer: verzendmail versturen mislukt:', err)
    return NextResponse.json(
      {
        ok: false,
        error: 'Nummer is opgeslagen, maar de mail ging niet weg. Probeer het zo opnieuw in de tweede lijst.',
      },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true, bericht: `Verstuurd naar ${order.email} met ${carrier} ${nummer}.` })
}
