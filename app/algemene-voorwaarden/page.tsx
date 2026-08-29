import type { Metadata } from 'next'
import LegalPageShell from '@/components/legal/LegalPageShell'

export const metadata: Metadata = {
  title: 'Algemene voorwaarden',
  description: 'Algemene voorwaarden van de Daily Pet Goods webshop.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/algemene-voorwaarden' },
  robots: { index: false, follow: true },
}

export default function AlgemeneVoorwaardenPage() {
  return (
    <LegalPageShell
      title="Algemene voorwaarden"
      lastUpdated="TODO - datum invullen zodra de echte tekst live gaat"
      sections={[
        {
          heading: '1. Wie we zijn',
          todoPoints: [
            'Verwijzing naar handelsnaam, KVK-nummer en BTW-id (bron: lib/business.ts, niet hier opnieuw typen)',
            'Toepassingsgebied: op welke bestellingen/bezoekers deze voorwaarden van toepassing zijn',
          ],
        },
        {
          heading: '2. Aanbod en totstandkoming van de overeenkomst',
          todoPoints: [
            'Wanneer een bestelling bindend is (bij plaatsen, bij bevestiging, of bij betaling)',
            'Kennelijke fouten in prijs/omschrijving binden de verkoper niet',
          ],
        },
        {
          heading: '3. Prijzen en betaling',
          todoPoints: [
            'Prijzen zijn inclusief btw - BTW-percentage en -bedrag benoemen (zie sectie 4 van de hoofdopdracht)',
            'Geaccepteerde betaalmethodes (Stripe: iDEAL, kaart, etc.)',
            'Wanneer de betaalverplichting ontstaat',
          ],
        },
        {
          heading: '4. Levering',
          todoPoints: [
            'Verzendtermijn en -gebied - moet consistent zijn met /verzending',
            'Wat er gebeurt bij een niet-leverbaar product',
          ],
        },
        {
          heading: '5. Herroepingsrecht',
          todoPoints: [
            'Korte samenvatting + verwijzing naar /retourneren voor het volledige beleid en modelformulier',
          ],
        },
        {
          heading: '6. Garantie en conformiteit',
          todoPoints: ['Wettelijke garantie (conformiteit), niet enkel fabrieksgarantie'],
        },
        {
          heading: '7. Aansprakelijkheid',
          todoPoints: ['Beperking van aansprakelijkheid, voor zover wettelijk toegestaan'],
        },
        {
          heading: '8. Klachten en geschillen',
          todoPoints: [
            'Klachtenprocedure en reactietermijn',
            'Toepasselijk recht en bevoegde rechter',
            'GEEN link naar het Europese ODR-platform - dat is per 20 juli 2025 afgeschaft, oudere checklists noemen dit nog ten onrechte',
          ],
        },
      ]}
    />
  )
}
