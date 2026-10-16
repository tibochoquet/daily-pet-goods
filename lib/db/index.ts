import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

/**
 * Lazy, net als de Stripe-client in lib/stripe.ts: env vars zijn tijdens
 * de build niet gegarandeerd aanwezig, dus een client die bij het laden
 * van de module al verbinding wil maken breekt de build.
 */
let db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function getDb() {
  if (!db) {
    const url = process.env.DATABASE_URL
    if (!url) {
      throw new Error('DATABASE_URL ontbreekt. Zet hem in .env.local (zie .env.example).')
    }
    db = drizzle(neon(url), { schema })
  }
  return db
}

/** Of de database überhaupt geconfigureerd is, zonder te verbinden. */
export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL)
}

export { schema }
