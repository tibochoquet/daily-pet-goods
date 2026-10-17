import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'

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

export function proxy(request: NextRequest) {
  const wachtwoord = process.env.ADMIN_PASSWORD
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
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
