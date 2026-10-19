import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

/**
 * Lazy, net als de Stripe-client in lib/stripe.ts: env vars zijn tijdens
 * de build niet gegarandeerd aanwezig, dus een client die bij het laden
 * van de module al verbinding wil maken breekt de build.
 */
let db: ReturnType<typeof drizzle<typeof schema>> | null = null

/**
 * Welke database we gebruiken.
 *
 * DATABASE_URL wordt beheerd door de Neon-integratie en staat daardoor
 * vast op Preview en Production tegelijk; in Vercel is dat niet te
 * splitsen. PREVIEW_DATABASE_URL is een gewone variabele die je zelf
 * wel kunt zetten, en op een previewdeploy gaat die voor. Zo kan een
 * preview nooit per ongeluk in de productiedatabase schrijven.
 */
function databaseUrl(): string | undefined {
  if (process.env.VERCEL_ENV === 'preview' && process.env.PREVIEW_DATABASE_URL) {
    return process.env.PREVIEW_DATABASE_URL
  }
  return process.env.DATABASE_URL
}

export function getDb() {
  if (!db) {
    const url = databaseUrl()
    if (!url) {
      throw new Error('DATABASE_URL ontbreekt. Zet hem in .env.local (zie .env.example).')
    }
    db = drizzle(neon(url), { schema })
  }
  return db
}

/** Of de database überhaupt geconfigureerd is, zonder te verbinden. */
export function isDbConfigured(): boolean {
  return Boolean(databaseUrl())
}

export { schema }
