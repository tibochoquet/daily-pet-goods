import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Passwordless session handling for /mijn-bestelling. There's no user
 * database - "logging in" is a signed, expiring token, not a password.
 * Two distinct token types on purpose, with different trust levels:
 *
 * - Order-access token: proves the holder knows one order's ref + email
 *   (a lookup, not proof of inbox ownership). Scoped to that one order
 *   only, short-lived.
 * - Account-session token: proves the holder actually clicked a magic
 *   link sent to that inbox. Scoped to "every order for this email",
 *   longer-lived. Knowing a single order number must never be enough to
 *   unlock someone's other orders - that's why these aren't the same
 *   token type.
 */

export const ACCOUNT_SESSION_COOKIE = 'dpg_account'
export const ORDER_ACCESS_COOKIE_PREFIX = 'dpg_order_'

const MAGIC_LINK_TTL_MS = 15 * 60 * 1000
const ORDER_ACCESS_TTL_MS = 60 * 60 * 1000
export const ACCOUNT_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000

export const ORDER_ACCESS_MAX_AGE_SECONDS = ORDER_ACCESS_TTL_MS / 1000
export const ACCOUNT_SESSION_MAX_AGE_SECONDS = ACCOUNT_SESSION_TTL_MS / 1000

function getSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    throw new Error('SESSION_SECRET ontbreekt. Zet hem in .env.local (zie .env.example).')
  }
  return secret
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url')
}

function createToken(payload: object): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${encoded}.${sign(encoded)}`
}

function verifyToken<T extends { exp: number }>(token: string): T | null {
  const [encoded, signature] = token.split('.')
  if (!encoded || !signature) return null

  const expected = sign(encoded)
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  let payload: T
  try {
    payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))
  } catch {
    return null
  }
  if (typeof payload.exp !== 'number' || Date.now() > payload.exp) return null
  return payload
}

interface MagicLinkPayload {
  type: 'magic-link'
  email: string
  exp: number
}

export function createMagicLinkToken(email: string): string {
  return createToken({ type: 'magic-link', email, exp: Date.now() + MAGIC_LINK_TTL_MS })
}

export function verifyMagicLinkToken(token: string): string | null {
  const payload = verifyToken<MagicLinkPayload>(token)
  return payload?.type === 'magic-link' ? payload.email : null
}

interface AccountSessionPayload {
  type: 'account'
  email: string
  exp: number
}

export function createAccountSessionToken(email: string): string {
  return createToken({ type: 'account', email, exp: Date.now() + ACCOUNT_SESSION_TTL_MS })
}

export function verifyAccountSessionToken(token: string | undefined): string | null {
  if (!token) return null
  const payload = verifyToken<AccountSessionPayload>(token)
  return payload?.type === 'account' ? payload.email : null
}

interface OrderAccessPayload {
  type: 'order'
  orderRef: string
  email: string
  exp: number
}

export function createOrderAccessToken(orderRef: string, email: string): string {
  return createToken({ type: 'order', orderRef, email, exp: Date.now() + ORDER_ACCESS_TTL_MS })
}

export function verifyOrderAccessToken(token: string | undefined, orderRef: string): string | null {
  if (!token) return null
  const payload = verifyToken<OrderAccessPayload>(token)
  if (payload?.type !== 'order' || payload.orderRef !== orderRef) return null
  return payload.email
}

export function orderAccessCookieName(orderRef: string): string {
  return `${ORDER_ACCESS_COOKIE_PREFIX}${orderRef}`
}
