import type { Metadata } from 'next'
import Link from 'next/link'
import { FileDown } from 'lucide-react'
import LegalPageShell from '@/components/legal/LegalPageShell'
import { business } from '@/lib/business'

export const metadata: Metadata = {
  title: 'Retourneren',
  description: 'Retourbeleid en herroepingsrecht van de Daily Pet Goods webshop.',
  alternates: { canonical: '/retourneren' },
  robots: { index: false, follow: true },
}

export default function RetournerenPage() {
  return (
    <>
      <LegalPageShell title="Retourneren" lastUpdated="1 september 2026">
        <section>
          <h2>1. 14 dagen bedenktijd</h2>
          <p>
            Je hebt het recht om je bestelling binnen 14 dagen na ontvangst zonder opgave van reden te
            herroepen. Bestaat je bestelling uit meerdere pakketten die apart aankomen, dan begint deze termijn
            op de dag waarop je het laatste pakket ontvangt.
          </p>
        </section>

        <section>
          <h2>2. Hoe je retourneert</h2>
          <p>
            Neem, voordat je iets terugstuurt, eerst contact op met onze klantenservice via{' '}
            <a href={`mailto:${business.email}`}>{business.email}</a> met je bestelnummer, zodat we de retour
            samen met je kunnen regelen. Meld je herroeping in elk geval binnen de termijn van 14 dagen; dat kan
            per e-mail, of met het modelformulier voor herroeping hieronder.
          </p>
          <p>
            Stuur het product ongebruikt en zoveel mogelijk in de originele verpakking terug. Je bent
            aansprakelijk voor waardevermindering van het product als die het gevolg is van gebruik dat verder
            gaat dan nodig om de aard en werking ervan te beoordelen.
          </p>
        </section>

        <section>
          <h2>3. Wie betaalt de retourkosten</h2>
          <p>
            De kosten van het terugsturen zijn voor jouw rekening. Is het product beschadigd aangekomen, of
            hebben wij een verkeerd product geleverd, dan nemen wij de retourkosten voor onze rekening - neem in
            dat geval sowieso eerst contact met ons op via <a href={`mailto:${business.email}`}>{business.email}</a>,
            dan zoeken we de snelste oplossing.
          </p>
        </section>

        <section>
          <h2>4. Terugbetaling</h2>
          <p>
            Na ontvangst van je retour, of bewijs dat je het hebt teruggestuurd, betalen we het volledige
            aankoopbedrag (verzending was toch al gratis, dus daar valt niets op terug te betalen) binnen 14
            dagen terug, via dezelfde betaalmethode waarmee je hebt betaald.
          </p>
        </section>

        <section>
          <h2>5. Uitzonderingen</h2>
          <p>Op dit moment gelden er voor ons assortiment geen aanvullende uitzonderingen op het herroepingsrecht.</p>
        </section>
      </LegalPageShell>

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
