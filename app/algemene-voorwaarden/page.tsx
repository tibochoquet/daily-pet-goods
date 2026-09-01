import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPageShell from '@/components/legal/LegalPageShell'
import { business, formatAddress } from '@/lib/business'

export const metadata: Metadata = {
  title: 'Algemene voorwaarden',
  description: 'Algemene voorwaarden van de Daily Pet Goods webshop.',
  alternates: { canonical: '/algemene-voorwaarden' },
  robots: { index: false, follow: true },
}

export default function AlgemeneVoorwaardenPage() {
  return (
    <LegalPageShell title="Algemene voorwaarden" lastUpdated="1 september 2026">
      <section>
        <h2>1. Wie we zijn</h2>
        <p>
          Deze algemene voorwaarden zijn van toepassing op elk aanbod van {business.brandName} en op elke
          overeenkomst die je met ons sluit via dailypetgoods.nl.
        </p>
        <p>
          {business.brandName} is een handelsnaam van {business.tradingName}, ingeschreven bij de Kamer van
          Koophandel onder nummer {business.kvkNumber}, btw-identificatienummer {business.btwNumber}, gevestigd
          aan {formatAddress()}. Je bereikt ons via{' '}
          <a href={`mailto:${business.email}`}>{business.email}</a>.
        </p>
      </section>

      <section>
        <h2>2. Aanbod en totstandkoming van de overeenkomst</h2>
        <p>
          Ons aanbod op de website is vrijblijvend. Bevat een productomschrijving of prijs een kennelijke fout
          of vergissing, bijvoorbeeld een onmiskenbaar onjuiste prijs, dan zijn we daar niet aan gebonden.
        </p>
        <p>
          De overeenkomst komt tot stand zodra je de betaling voor je bestelling via onze checkout hebt
          afgerond, niet al bij het enkel plaatsen van producten in je winkelwagen.
        </p>
      </section>

      <section>
        <h2>3. Prijzen en betaling</h2>
        <p>Alle prijzen op de website zijn in euro&apos;s en inclusief 21% btw.</p>
        <p>
          Je betaalt direct en veilig via Stripe Checkout, onder meer met iDEAL, creditcard, Bancontact en
          Klarna. Je bestelling wordt pas definitief zodra de betaling is gelukt; we sturen nooit apart nog een
          betaalverzoek na.
        </p>
      </section>

      <section>
        <h2>4. Levering</h2>
        <p>
          We verzenden binnen Nederland en België, altijd via DHL en altijd gratis. Na je betaling verwerken we
          je bestelling binnen 1 tot 2 werkdagen; DHL doet er daarna gemiddeld nog 1 tot 3 werkdagen over om je
          pakket te bezorgen. Zie <Link href="/verzending">onze verzendpagina</Link> voor de volledige details.
        </p>
        <p>
          Blijkt een besteld product onverwacht niet leverbaar, dan laten we dat zo snel mogelijk weten en
          betalen we het al betaalde bedrag terug.
        </p>
      </section>

      <section>
        <h2>5. Herroepingsrecht</h2>
        <p>
          Je hebt het recht om je bestelling binnen 14 dagen na ontvangst zonder opgave van reden te herroepen.
          Het volledige retourbeleid, inclusief wie de retourkosten draagt en hoe je een retour meldt, staat op{' '}
          <Link href="/retourneren">onze retourpagina</Link>, samen met het modelformulier voor herroeping.
        </p>
      </section>

      <section>
        <h2>6. Garantie en conformiteit</h2>
        <p>
          Onze producten moeten deugdelijk zijn en geschikt voor normaal gebruik. Naast eventuele
          fabrieksgarantie geldt altijd de wettelijke garantie (conformiteit) uit het consumentenrecht: een
          product moet aan de overeenkomst voldoen. Ontvang je een product dat daar niet aan voldoet, mail dan
          naar <a href={`mailto:${business.email}`}>{business.email}</a> - we zoeken dan samen naar een
          oplossing, zoals herstel, vervanging of terugbetaling.
        </p>
      </section>

      <section>
        <h2>7. Aansprakelijkheid</h2>
        <p>
          Onze aansprakelijkheid is beperkt tot het bedrag van je bestelling, behalve bij opzet of bewuste
          roekeloosheid onzerzijds, of voor zover aansprakelijkheid wettelijk niet mag worden beperkt.
        </p>
      </section>

      <section>
        <h2>8. Klachten en geschillen</h2>
        <p>
          Heb je een klacht? Mail ons eerst op <a href={`mailto:${business.email}`}>{business.email}</a>. We
          reageren doorgaans binnen 24 uur op werkdagen en lossen klachten het liefst in onderling overleg op.
        </p>
        <p>
          Op deze overeenkomst is Nederlands recht van toepassing. Een geschil dat we niet samen oplossen,
          leggen we voor aan de bevoegde Nederlandse rechter.
        </p>
      </section>
    </LegalPageShell>
  )
}
