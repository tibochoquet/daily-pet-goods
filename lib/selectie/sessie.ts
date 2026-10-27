import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * De sessie van /selectie: één gedeeld wachtwoord, daarna een cookie met
 * een ondertekend token.
 *
 * Bewust niet dezelfde Basic auth als /admin. Die vraagt het wachtwoord
 * bij elk venster opnieuw en is niet uit te loggen; voor een werkpagina
 * waar twee mensen de hele dag in zitten is dat te onhandig. Het token
 * bevat geen gebruikersgegevens, alleen een vervaldatum, en is
 * ondertekend met SESSION_SECRET zodat het niet te vervalsen is.
 */

export const SELECTIE_COOKIE = 'dpg_selectie'
export const SESSIE_DAGEN = 30

/** Wachtwoord uit de omgeving, of null als het niet geconfigureerd is. */
export function sitePassword(): string | null {
  const w = process.env.SITE_PASSWORD?.trim()
  return w ? w : null
}

function geheim(): string | null {
  const s = process.env.SESSION_SECRET?.trim()
  return s ? s : null
}

/** Vergelijkt twee strings zonder dat de looptijd het antwoord verraadt. */
export function gelijk(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

function onderteken(payload: string, sleutel: string): string {
  return createHmac('sha256', sleutel).update(payload).digest('base64url')
}

/**
 * Maakt een token dat `SESSIE_DAGEN` geldig is.
 *
 * Vorm: `<vervaltijd in ms>.<handtekening>`. De vervaltijd staat leesbaar
 * in het token, maar zit in de handtekening, dus hem oprekken maakt het
 * token ongeldig.
 */
export function maakToken(nu = Date.now()): string | null {
  const sleutel = geheim()
  if (!sleutel) return null
  const vervalt = nu + SESSIE_DAGEN * 24 * 60 * 60 * 1000
  const payload = String(vervalt)
  return `${payload}.${onderteken(payload, sleutel)}`
}

/** True als het token geldig is en nog niet verlopen. */
export function tokenGeldig(token: string | undefined | null, nu = Date.now()): boolean {
  if (!token) return false
  const sleutel = geheim()
  if (!sleutel) return false
  const punt = token.lastIndexOf('.')
  if (punt <= 0) return false
  const payload = token.slice(0, punt)
  const handtekening = token.slice(punt + 1)
  if (!gelijk(handtekening, onderteken(payload, sleutel))) return false
  const vervalt = Number(payload)
  return Number.isFinite(vervalt) && vervalt > nu
}

/** De cookie-instellingen, op één plek zodat ze niet uit elkaar lopen. */
export function cookieOpties() {
  return {
    name: SELECTIE_COOKIE,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSIE_DAGEN * 24 * 60 * 60,
  }
}

/** Headers die elke beschermde reactie hoort te dragen. */
export const BESCHERMDE_HEADERS = {
  'Cache-Control': 'private, no-store, max-age=0, must-revalidate',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
} as const
