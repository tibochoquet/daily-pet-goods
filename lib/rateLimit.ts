import 'server-only'

/**
 * Eenvoudige snelheidsbegrenzing per IP.
 *
 * Bewust in het geheugen: er is geen gedeelde opslag voor dit soort
 * korte tellingen, dus de teller reset bij een koude start en wordt
 * niet gedeeld tussen instances. Dat maakt hem niet waterdicht, maar
 * wel goed genoeg om geautomatiseerd gehamer af te remmen. Wie dit
 * steviger wil, zet de teller in Vercel KV of Upstash.
 *
 * Dit stond eerder los in twee routes; hier staat het één keer.
 */

const MAX_TRACKED_KEYS = 500

interface Begrenzer {
  (sleutel: string): boolean
}

export function createRateLimiter(maxPerWindow: number, windowMs: number): Begrenzer {
  const pogingen = new Map<string, number>()

  return function teVeelPogingen(sleutel: string): boolean {
    const aantal = pogingen.get(sleutel) ?? 0
    if (aantal >= maxPerWindow) return true
    pogingen.set(sleutel, aantal + 1)
    if (pogingen.size > MAX_TRACKED_KEYS) {
      const oudste = pogingen.keys().next().value
      if (oudste) pogingen.delete(oudste)
    }
    setTimeout(() => pogingen.delete(sleutel), windowMs).unref?.()
    return false
  }
}

/** Het IP van de bezoeker, zoals Vercel het doorgeeft. */
export function clientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'onbekend'
}
