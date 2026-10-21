/**
 * De twee vervoerders waarmee we verzenden, en hoe je bij hun
 * trackingpagina komt.
 *
 * Allebei getoetst met een echt zendingsnummer. DHL: 3SDFC..., het
 * portaal toont het volledige traject en de bezorgdatum. DPD: het
 * Nederlandse portaal van dpdgroup.com vindt zendingsnummer
 * 05222070396223, de Duitse tracker op tracking.dpd.de niet - die
 * antwoordt met "keine Daten zu Ihrem Paket", in het Duits. Daar stond
 * deze link eerder naartoe, dus een DPD-klant kwam op een dode pagina.
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
      // DHL Parcel Benelux, het portaal dat bij 3S-nummers hoort.
      // Nagelopen met een echt zendingsnummer: toont het traject en de
      // bezorgdatum. De tracker op dhl.com is voor andere nummerreeksen.
      return `https://my.dhlparcel.nl/home/tracktrace/${encodeURIComponent(nr)}`
    case 'DPD':
      // Het Nederlandse portaal, niet de Duitse tracker: die kent onze
      // zendingsnummers niet.
      return `https://www.dpdgroup.com/nl/mydpd/my-parcels/incoming?parcelNumber=${encodeURIComponent(nr)}`
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
