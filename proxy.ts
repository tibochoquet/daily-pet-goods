import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { BESCHERMDE_HEADERS, SELECTIE_COOKIE, tokenGeldig } from '@/lib/selectie/sessie'

/**
 * Schermt de beheerpagina af met HTTP Basic auth.
 *
 * In Next 16 heet dit bestand `proxy` en niet meer `middleware`, en het
 * draait altijd op de Node-runtime - vandaar dat `node:crypto` hier mag.
 *
 * Zonder ADMIN_PASSWORD gaat alles dicht in plaats van open. Een
 * beheerpagina die bij een vergeten omgevingsvariabele vrij toegankelijk
 * wordt, is erger dan een beheerpagina die tijdelijk niet werkt.
 */

function gelijk(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

function vraagOmWachtwoord(): NextResponse {
  return new NextResponse('Authenticatie vereist', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Daily Pet Goods beheer", charset="UTF-8"',
      'Cache-Control': 'no-store',
    },
  })
}

/**
 * De productselectietool (/selectie) heeft een eigen slot: een cookie met
 * een ondertekend token in plaats van Basic auth. Hier wordt alleen
 * gecontroleerd; inloggen gebeurt op /selectie/login, dat daarom zelf
 * vrij toegankelijk moet blijven.
 *
 * Dat de controle hier staat en niet in elke route is bewust. Een
 * vergeten controle in één nieuwe route zou de hele tool openzetten, en
 * dat is precies het soort fout dat je niet ziet.
 */
function selectiePoort(request: NextRequest): NextResponse {
  const pad = request.nextUrl.pathname
  if (pad === '/selectie/login' || pad === '/api/selectie/login') {
    const vrij = NextResponse.next()
    for (const [k, v] of Object.entries(BESCHERMDE_HEADERS)) vrij.headers.set(k, v)
    return vrij
  }

  if (tokenGeldig(request.cookies.get(SELECTIE_COOKIE)?.value)) {
    const door = NextResponse.next()
    for (const [k, v] of Object.entries(BESCHERMDE_HEADERS)) door.headers.set(k, v)
    return door
  }

  // Een API-aanroep krijgt een 401 terug; een pagina stuurt de bezoeker
  // naar het inlogscherm, met waar hij heen wilde erin.
  if (pad.startsWith('/api/')) {
    return NextResponse.json(
      { ok: false, error: 'Niet ingelogd' },
      { status: 401, headers: BESCHERMDE_HEADERS }
    )
  }
  const naar = request.nextUrl.clone()
  naar.pathname = '/selectie/login'
  naar.search = pad === '/selectie' ? '' : `?terug=${encodeURIComponent(pad)}`
  const om = NextResponse.redirect(naar)
  for (const [k, v] of Object.entries(BESCHERMDE_HEADERS)) om.headers.set(k, v)
  return om
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/selectie') || request.nextUrl.pathname.startsWith('/api/selectie')) {
    return selectiePoort(request)
  }

  // Trimmen, want een meegeplakte spatie of regeleinde in de
  // omgevingsvariabele maakt het wachtwoord anders onvindbaar - dat is
  // op dit project eerder gebeurd met de Google-tag.
  const wachtwoord = process.env.ADMIN_PASSWORD?.trim()
  if (!wachtwoord) {
    console.error('ADMIN_PASSWORD ontbreekt - beheerpagina geweigerd.')
    return new NextResponse('Beheer is niet geconfigureerd', { status: 500, headers: { 'Cache-Control': 'no-store' } })
  }

  const header = request.headers.get('authorization')
  if (!header?.startsWith('Basic ')) return vraagOmWachtwoord()

  let ontcijferd: string
  try {
    ontcijferd = Buffer.from(header.slice(6), 'base64').toString('utf8')
  } catch {
    return vraagOmWachtwoord()
  }

  // De gebruikersnaam doet er niet toe; alleen het wachtwoord telt.
  const wachtwoordUitHeader = ontcijferd.slice(ontcijferd.indexOf(':') + 1)
  if (!gelijk(wachtwoordUitHeader, wachtwoord)) return vraagOmWachtwoord()

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/selectie/:path*', '/api/selectie/:path*'],
}
