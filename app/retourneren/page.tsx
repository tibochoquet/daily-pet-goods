import type { Metadata } from 'next'
import Link from 'next/link'
import { FileDown } from 'lucide-react'
import LegalPageShell from '@/components/legal/LegalPageShell'

export const metadata: Metadata = {
  title: 'Retourneren',
  description: 'Retourbeleid en herroepingsrecht van de Daily Pet Goods webshop.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/retourneren' },
  robots: { index: false, follow: true },
}

export default function RetournerenPage() {
  return (
    <>
      <LegalPageShell
        title="Retourneren"
        lastUpdated="TODO - datum invullen zodra de echte tekst live gaat"
        sections={[
          {
            heading: '1. 14 dagen bedenktijd',
            todoPoints: [
              'Standaard herroepingstermijn: 14 dagen na ontvangst van het product',
              'Vanaf wanneer de termijn precies loopt bij deelleveringen (indien van toepassing)',
            ],
          },
          {
            heading: '2. Hoe je retourneert',
            todoPoints: [
              'Hoe en waar de klant de herroeping meldt binnen de termijn',
              'In welke staat het product terug moet (ongebruikt, originele verpakking, etc.)',
              'Verwijzing naar het modelformulier hieronder',
            ],
          },
          {
            heading: '3. Wie betaalt de retourkosten',
            todoPoints: [
              'MOET EXPLICIET: staat de klant of de winkel garant voor de verzendkosten van een retour? Dit mag niet vaag blijven.',
            ],
          },
          {
            heading: '4. Terugbetaling',
            todoPoints: ['Termijn (wettelijk max. 14 dagen na herroeping of ontvangst retour)', 'Terugbetaalmethode'],
          },
          {
            heading: '5. Uitzonderingen',
            todoPoints: ['Eventuele producten die zijn uitgesloten van herroeping (indien van toepassing)'],
          },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-14">
        <Link
          href="/retourneren/modelformulier-herroeping"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#2C4A3E] hover:underline"
        >
          <FileDown size={16} />
          Modelformulier voor herroeping bekijken / downloaden
        </Link>
      </div>
    </>
  )
}
