import { NextRequest, NextResponse } from 'next/server'
import { clientIp, teVeelPogingen } from '@/lib/rateLimit'
import { BESCHERMDE_HEADERS, cookieOpties, gelijk, maakToken, sitePassword } from '@/lib/selectie/sessie'

/**
 * Inloggen op de productselectietool.
 *
 * Vijf pogingen per minuut per IP. De teller staat in de database, niet
 * in het geheugen: op Vercel landt elke aanroep mogelijk op een andere
 * instance, en een teller die daar begint te tellen helpt precies niet
 * wanneer iemand er doorheen probeert te rammen.
 */
export async function POST(req: NextRequest) {
  const wachtwoord = sitePassword()
  if (!wachtwoord) {
    console.error('SITE_PASSWORD ontbreekt - inloggen op /selectie geweigerd.')
    return NextResponse.json(
      { ok: false, error: 'De tool is nog niet ingesteld.' },
      { status: 500, headers: BESCHERMDE_HEADERS }
    )
  }

  const token = maakToken()
  if (!token) {
    console.error('SESSION_SECRET ontbreekt - inloggen op /selectie geweigerd.')
    return NextResponse.json(
      { ok: false, error: 'De tool is nog niet ingesteld.' },
      { status: 500, headers: BESCHERMDE_HEADERS }
    )
  }

  const teveel = await teVeelPogingen(clientIp(req), {
    bucket: 'selectie-login',
    maxPerWindow: 5,
    windowMs: 60_000,
  })
  if (teveel) {
    return NextResponse.json(
      { ok: false, error: 'Te veel pogingen. Wacht een minuut en probeer het opnieuw.' },
      { status: 429, headers: BESCHERMDE_HEADERS }
    )
  }

  let ingevuld = ''
  try {
    const body = (await req.json()) as { wachtwoord?: unknown }
    ingevuld = typeof body.wachtwoord === 'string' ? body.wachtwoord : ''
  } catch {
    ingevuld = ''
  }

  if (!gelijk(ingevuld, wachtwoord)) {
    return NextResponse.json(
      { ok: false, error: 'Dat wachtwoord klopt niet.' },
      { status: 401, headers: BESCHERMDE_HEADERS }
    )
  }

  const res = NextResponse.json({ ok: true }, { headers: BESCHERMDE_HEADERS })
  res.cookies.set({ ...cookieOpties(), value: token })
  return res
}
