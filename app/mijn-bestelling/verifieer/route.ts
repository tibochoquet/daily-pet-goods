import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SITE_URL } from '@/lib/business'
import {
  verifyMagicLinkToken,
  createAccountSessionToken,
  ACCOUNT_SESSION_COOKIE,
  ACCOUNT_SESSION_MAX_AGE_SECONDS,
} from '@/lib/session'

/**
 * The magic-link landing target - reached by the customer clicking the
 * link in the "Bekijk mijn bestellingen" email, not a form submit.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const email = token ? verifyMagicLinkToken(token) : null

  if (!email) {
    return NextResponse.redirect(`${SITE_URL}/mijn-bestelling?fout=link-verlopen`)
  }

  const cookieStore = await cookies()
  cookieStore.set(ACCOUNT_SESSION_COOKIE, createAccountSessionToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ACCOUNT_SESSION_MAX_AGE_SECONDS,
  })

  return NextResponse.redirect(`${SITE_URL}/mijn-bestelling/overzicht`)
}
