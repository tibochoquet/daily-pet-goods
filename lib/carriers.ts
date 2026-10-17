/**
 * De twee vervoerders waarmee we verzenden, en hoe je bij hun
 * trackingpagina komt.
 *
 * Beide URL-vormen zijn nagelopen: ze geven een 200 terug. Dat bewijst
 * dat de pagina bestaat, niet dat een specifiek nummer klopt - de
 * vervoerder toont bij een onbekend nummer gewoon een nette melding.
 */

export const CARRIERS = ['DHL', 'DPD'] as const
export type Carrier = (typeof CARRIERS)[number]

export function isCarrier(value: unknown): value is Carrier {
  return typeof value === 'string' && (CARRIERS as readonly string[]).includes(value)
}

export function trackingUrl(carrier: Carrier, trackingNumber: string): string {
  const nr = trackingNumber.trim()
  switch (carrier) {
    case 'DHL':
      return `https://www.dhl.com/nl-nl/home/tracking/tracking-ecommerce.html?tracking-id=${encodeURIComponent(nr)}`
    case 'DPD':
      return `https://tracking.dpd.de/status/nl_NL/parcel/${encodeURIComponent(nr)}`
  }
}

/**
 * Lichte controle op het trackingnummer. Bewust niet streng op het
 * formaat: vervoerders veranderen hun nummerreeksen vaker dan je denkt,
 * en een afgewezen geldig nummer is vervelender dan een doorgelaten
 * typefout - die zie je meteen in de mail die je zelf ter bevestiging
 * krijgt voorgelegd.
 */
export function normalizeTrackingNumber(raw: string): string | null {
  const nr = raw.trim().replace(/\s+/g, '')
  if (nr.length < 6 || nr.length > 40) return null
  if (!/^[A-Za-z0-9-]+$/.test(nr)) return null
  return nr.toUpperCase()
}
