/**
 * Genereert previews van de drie transactionele mails met voorbeelddata.
 *
 *   npm run preview:mails    -> schrijft naar ./previews
 *
 * Importeert bewust uit lib/emails, de code die ook echt verstuurt. De
 * oorspronkelijke versie van dit script stond in de handoff-map en las
 * daar een eigen kopie van de templates; die liep daardoor achter zodra
 * er iets aan de echte templates veranderde.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { orderConfirmationEmail, reviewRequestEmail, shippingConfirmationEmail } from '../lib/emails/index.js'
import type { OrderEmailData } from '../lib/emails/index.js'
import { trackingUrl } from '../lib/carriers.js'

const order: OrderEmailData = {
  orderNumber: 'DPG-1042',
  placedAt: '2026-10-16T09:12:00+02:00',
  firstName: 'Sanne',
  email: 'sanne@example.com',
  shippingAddress: {
    name: 'Sanne de Vries',
    line1: 'Kastanjelaan 14',
    postalCode: '3521 AB',
    city: 'Utrecht',
    country: 'NL',
  },
  items: [
    {
      name: 'Verhoogde Hondenbak',
      variant: 'M',
      quantity: 1,
      unitAmount: 4999,
      imageUrl: '/assets/products/9300000271740188/img_1.jpg',
      slug: 'verhoogde-hondenbak',
    },
    {
      name: 'Dubbele Voerbak Metaal',
      variant: 'S',
      quantity: 1,
      unitAmount: 3999,
      imageUrl: '/assets/products/9300000318561941/img_1.jpg',
      slug: 'dubbele-voerbak-metaal',
    },
  ],
  subtotal: 8998,
  shippingCost: 0,
  total: 8998,
  paymentMethod: 'iDEAL',
  petType: 'hond',
  orderUrl: 'https://dailypetgoods.nl/mijn-bestelling?ref=DPG-1042&email=sanne%40example.com',
}

const TRACKING = '3SDFC0277413762'

const emails = {
  '1-bestelbevestiging': orderConfirmationEmail(order),
  '2-verzonden': shippingConfirmationEmail(order, {
    carrier: 'DHL',
    trackingNumber: TRACKING,
    trackingUrl: trackingUrl('DHL', TRACKING),
  }),
  '3-reviewverzoek': reviewRequestEmail(order, {
    reviewUrl: 'https://dailypetgoods.nl/review?t=voorbeeldtoken',
    unsubscribeUrl: 'https://dailypetgoods.nl/afmelden?t=voorbeeldtoken',
  }),
}

mkdirSync('previews', { recursive: true })
for (const [naam, mail] of Object.entries(emails)) {
  writeFileSync(`previews/${naam}.html`, mail.html)
  writeFileSync(`previews/${naam}.txt`, `Onderwerp: ${mail.subject}\nPreheader: ${mail.preheader}\n\n${mail.text}\n`)
  console.log(`  ${naam.padEnd(22)} "${mail.subject}"  (${(mail.html.length / 1024).toFixed(1)} KB)`)
}
