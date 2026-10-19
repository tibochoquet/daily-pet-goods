// Daily Pet Goods: merk- en bedrijfsgegevens voor alle transactionele mails.
// Pas gegevens hier aan, niet in de templates.

import { business, formatAddress, PUBLIC_BASE_URL } from '../business';

// Mails worden door de client van de ontvanger geladen, dus hier geldt
// dezelfde basis-URL als voor Stripe (zie lib/business.ts).
export const SITE_URL = PUBLIC_BASE_URL;

export const brand = {
  name: business.brandName,
  siteUrl: SITE_URL,
  email: business.email,
  instagramUrl: 'https://www.instagram.com/dailypetgoods',
  carriers: 'DHL of DPD',

  // Wettelijk verplicht in de bestelbevestiging: identiteit + geografisch
  // vestigingsadres. Komt uit lib/business.ts, dezelfde bron als de footer
  // en de juridische pagina's - deze gegevens stonden hier eerder apart en
  // waren toen al uit elkaar gelopen.
  legalName: business.tradingName,
  address: formatAddress(),
  kvk: business.kvkNumber,
  btw: business.btwNumber,

  links: {
    orders: `${SITE_URL}/mijn-bestelling`,
    returns: `${SITE_URL}/retourneren`,
    withdrawalForm: `${SITE_URL}/retourneren/modelformulier-herroeping`,
    terms: `${SITE_URL}/algemene-voorwaarden`,
    privacy: `${SITE_URL}/privacy`,
    shop: `${SITE_URL}/shop`,
  },

  // Bestaande bestanden in /public/mail plus twee nieuwe (logo-lockup, mark-cream).
  images: {
    logo: `${SITE_URL}/mail/logo-lockup.png`, // 470x88, getoond op 235x44
    footerMark: `${SITE_URL}/mail/mark-cream.png`, // 94x96, getoond op 40x41
    hero: `${SITE_URL}/mail/hero.jpg`, // 1200x520
    dog: `${SITE_URL}/mail/foto-hond.jpg`, // 560x560
    cat: `${SITE_URL}/mail/foto-kat.jpg`, // 560x560
  },

  color: {
    page: '#F3EDE3', // zand, achtergrond rond de mail
    surface: '#FAFAF7', // mailvlak
    card: '#FFFFFF',
    ink: '#1A1A1A',
    body: '#4B5563',
    muted: '#6B7280',
    faint: '#9CA3AF',
    line: '#E8E2D9',
    lineStrong: '#DCD5C7',
    green: '#2C4A3E',
    greenDeep: '#1F3329',
    terracotta: '#C8745A',
    footerText: '#D9E2DC',
    footerMuted: '#A8BBAE',
  },

  font: {
    serif: "'Playfair Display', Georgia, 'Times New Roman', serif",
    sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  },
} as const;

/**
 * Productfoto verkleind via de Next.js image optimizer van je eigen site.
 * Let op: `width` moet in je next.config images.imageSizes/deviceSizes staan (128 en 256 zitten in de defaults).
 */
export function productThumb(path: string, width: 128 | 256 = 128): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}/_next/image?url=${encodeURIComponent(path)}&w=${width}&q=75`;
}
