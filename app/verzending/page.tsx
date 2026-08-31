import type { Metadata } from 'next'
import LegalPageShell from '@/components/legal/LegalPageShell'

export const metadata: Metadata = {
  title: 'Verzending',
  description: 'Verzendkosten en levertijden van de Daily Pet Goods webshop.',
  alternates: { canonical: '/verzending' },
  robots: { index: false, follow: true },
}

export default function VerzendingPage() {
  return (
    <LegalPageShell
      title="Verzending"
      lastUpdated="TODO - datum invullen zodra de echte tekst live gaat"
      sections={[
        {
          heading: '1. Verzendkosten',
          todoPoints: [
            'De site claimt overal "gratis verzending" (hero, footer, checkout) - bevestig dat dit klopt en blijft kloppen, dit moet consistent zijn met de checkout',
          ],
        },
        {
          heading: '2. Levertijden',
          todoPoints: ['Verwerktijd + verzendtijd, apart benoemen', 'Wat "indicatief" precies betekent bij vertraging'],
        },
        {
          heading: '3. Verzendgebied',
          todoPoints: [
            'Stripe Checkout staat momenteel alleen NL en BE toe als verzendland (zie app/api/checkout/route.ts) - bevestig dat dit klopt',
          ],
        },
        {
          heading: '4. Track & trace',
          todoPoints: ['Of en hoe de klant een trackingcode ontvangt'],
        },
        {
          heading: '5. Beschadigd of vermist pakket',
          todoPoints: ['Procedure en contactpunt'],
        },
      ]}
    />
  )
}
