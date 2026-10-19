import 'server-only'
import { and, eq, gt, lt, sql } from 'drizzle-orm'
import { getDb, isDbConfigured } from './db'
import { rateLimitHits } from './db/schema'

/**
 * Snelheidsbegrenzing per sleutel, geteld in de database.
 *
 * Eerder stond deze teller in het geheugen van de server. Dat leek te
 * werken maar deed op Vercel bijna niets: elke aanroep kan op een
 * andere instance landen, en instances worden voortdurend opgeruimd, dus
 * de teller begon telkens opnieuw. Juist bij geautomatiseerd gehamer -
 * precies waar hij voor is - hielp hij dus niet.
 *
 * Nu is het één rij per poging, geteld over een tijdvenster. Dat kost
 * een paar milliseconden extra per verzoek en dat is het waard.
 */

export interface Begrenzing {
  bucket: string
  maxPerWindow: number
  windowMs: number
}

/**
 * Telt deze poging mee en zegt of de grens bereikt is.
 *
 * Zonder database laten we het verzoek door in plaats van het te
 * blokkeren: een kapotte teller mag geen klanten buitensluiten. Dat
 * wordt wel gelogd, want het hoort niet voor te komen.
 */
export async function teVeelPogingen(sleutel: string, { bucket, maxPerWindow, windowMs }: Begrenzing): Promise<boolean> {
  if (!isDbConfigured()) {
    console.error(`Snelheidsbegrenzing "${bucket}" overgeslagen: geen DATABASE_URL.`)
    return false
  }

  try {
    const db = getDb()
    const grens = new Date(Date.now() - windowMs)

    // Oude pogingen van deze sleutel opruimen, zodat de tabel niet
    // ongemerkt volloopt.
    await db.delete(rateLimitHits).where(and(eq(rateLimitHits.key, sleutel), lt(rateLimitHits.createdAt, grens)))

    const [{ aantal }] = await db
      .select({ aantal: sql<number>`count(*)::int` })
      .from(rateLimitHits)
      .where(and(eq(rateLimitHits.bucket, bucket), eq(rateLimitHits.key, sleutel), gt(rateLimitHits.createdAt, grens)))

    if (aantal >= maxPerWindow) return true

    await db.insert(rateLimitHits).values({ bucket, key: sleutel })
    return false
  } catch (err) {
    console.error(`Snelheidsbegrenzing "${bucket}" mislukt:`, err)
    return false
  }
}

/** Het IP van de bezoeker, zoals Vercel het doorgeeft. */
export function clientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'onbekend'
}
