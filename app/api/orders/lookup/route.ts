import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { isValidEmail } from '@/lib/validation'
import { findOrderByRef } from '@/lib/orders'
import { createOrderAccessToken, orderAccessCookieName, ORDER_ACCESS_MAX_AGE_SECONDS } from '@/lib/session'

interface LookupBody {
  orderRef: string
  email: string
}

const NOT_FOUND_MESSAGE = 'We konden geen bestelling vinden met deze gegevens. Controleer je bestelnummer en probeer het opnieuw.'

const attempts = new Map<string, number>()
const MAX_TRACKED_IPS = 500
const MAX_ATTEMPTS_PER_WINDOW = 10
const WINDOW_MS = 15 * 60 * 1000

/** Same best-effort, in-memory-only rate limiting as app/api/auth/request-link/route.ts. */
function tooManyAttempts(ip: string): boolean {
  const count = attempts.get(ip) ?? 0
  if (count >= MAX_ATTEMPTS_PER_WINDOW) return true
  attempts.set(ip, count + 1)
  if (attempts.size > MAX_TRACKED_IPS) {
    const oldest = attempts.keys().next().value
    if (oldest) attempts.delete(oldest)
  }
  setTimeout(() => attempts.delete(ip), WINDOW_MS).unref?.()
  return false
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (tooManyAttempts(ip)) {
      return NextResponse.json({ ok: false, error: 'Te veel pogingen. Probeer het later opnieuw.' }, { status: 429 })
    }

    const body: LookupBody = await req.json()
    const orderRef = body.orderRef?.trim().toUpperCase()
    const email = body.email?.trim()

    if (!orderRef || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: NOT_FOUND_MESSAGE }, { status: 400 })
    }

    const order = await findOrderByRef(orderRef, email)
    if (!order) {
      return NextResponse.json({ ok: false, error: NOT_FOUND_MESSAGE }, { status: 404 })
    }

    const cookieStore = await cookies()
    cookieStore.set(orderAccessCookieName(order.orderRef), createOrderAccessToken(order.orderRef, email), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ORDER_ACCESS_MAX_AGE_SECONDS,
    })

    return NextResponse.json({ ok: true, order })
  } catch (err) {
    console.error('Bestelling opzoeken mislukt:', err)
    return NextResponse.json({ ok: false, error: NOT_FOUND_MESSAGE }, { status: 500 })
  }
}
