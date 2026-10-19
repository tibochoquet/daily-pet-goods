import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPageShell from '@/components/legal/LegalPageShell'
import { business, formatAddress } from '@/lib/business'

export const metadata: Metadata = {
  title: 'Actievoorwaarden',
  description: 'Voorwaarden van de maandelijkse review-actie van Daily Pet Goods.',
  alternates: { canonical: '/actievoorwaarden' },
  robots: { index: false, follow: true },
}

export default function ActievoorwaardenPage() {
  return (
    <LegalPageShell
      title="Actievoorwaarden"
      lastUpdated="18 oktober 2026"
      intro="Deze voorwaarden gelden voor de maandelijkse actie waarbij je met een review en een foto van je huisdier kans maakt op een pakket ter waarde van € 100."
    >
      <section>
        <h2>1. Organisator</h2>
        <p>
          Deze actie wordt georganiseerd door {business.tradingName}, handelend onder de naam{' '}
          {business.brandName}, ingeschreven bij de Kamer van Koophandel onder nummer {business.kvkNumber},
          btw-identificatienummer {business.btwNumber}, gevestigd aan {formatAddress()}. Je bereikt ons via{' '}
          <a href={`mailto:${business.email}`}>{business.email}</a>.
        </p>
      </section>

      <section>
        <h2>2. Wie mag meedoen</h2>
        <p>
          Je mag meedoen als je een product bij ons hebt gekocht, in Nederland of België woont en 18 jaar of
          ouder bent. Medewerkers van de organisator en hun directe familieleden zijn uitgesloten van
          deelname.
        </p>
        <p>
          Deelname is gratis en verplicht je tot niets: je hoeft niets extra&apos;s te kopen om kans te maken.
        </p>
      </section>

      <section>
        <h2>3. Hoe doe je mee</h2>
        <p>
          Je doet mee door een review achter te laten over een product dat je bij ons hebt gekocht, met daarbij
          een foto van je huisdier. Dat kan via de link in de reviewmail die je na je bestelling ontvangt, of
          via onze <Link href="/review">reviewpagina</Link> met je bestelnummer en e-mailadres.
        </p>
        <p>
          Een review zonder foto is natuurlijk even welkom, maar doet niet mee aan deze actie: de keuze gaat
          over de foto.
        </p>
        <p>
          Per bestelling kun je per product één review achterlaten. Reviews worden eerst door ons nagekeken
          voordat ze op de site verschijnen.
        </p>
      </section>

      <section>
        <h2>4. De prijs</h2>
        <p>
          De winnaar ontvangt een pakket ter waarde van € 100, samengesteld uit producten uit ons assortiment.
          De prijs is niet inwisselbaar voor geld en niet overdraagbaar. Verzending is gratis en gebeurt naar
          een adres in Nederland of België.
        </p>
      </section>

      <section>
        <h2>5. Hoe vaak en hoe we kiezen</h2>
        <p>
          We kiezen elke maand één winnaar, uit alle inzendingen met foto die in die kalendermaand zijn
          geplaatst en goedgekeurd.
        </p>
        <p>
          Over de uitslag kan niet worden gecorrespondeerd.
        </p>
      </section>

      <section>
        <h2>6. Bericht aan de winnaar</h2>
        <p>
          De winnaar krijgt binnen veertien dagen na afloop van de maand bericht op het e-mailadres dat bij de
          bestelling hoort. Reageert de winnaar niet binnen veertien dagen na dat bericht, dan vervalt de prijs
          en mogen we een andere winnaar kiezen.
        </p>
      </section>

      <section>
        <h2>7. Je foto</h2>
        <p>
          Bij het insturen vink je aan dat we je foto bij je review mogen tonen. Daarmee geef je ons
          toestemming om de foto te plaatsen op onze website, in onze e-mails en op onze sociale media, steeds
          in samenhang met je review.
        </p>
        <p>
          Je blijft eigenaar van je foto. Wil je dat we hem weghalen, mail ons dan via{' '}
          <a href={`mailto:${business.email}`}>{business.email}</a>; we halen hem dan zo snel mogelijk weg.
        </p>
        <p>
          Stuur alleen foto&apos;s die je zelf hebt gemaakt en waarop geen herkenbare andere personen staan
          zonder hun toestemming.
        </p>
      </section>

      <section>
        <h2>8. Privacy</h2>
        <p>
          We gebruiken je naam, e-mailadres, bestelnummer, review en foto om de actie uit te voeren en je
          review te tonen. We verkopen je gegevens niet en geven ze niet door aan derden voor hun eigen
          doeleinden. Meer hierover lees je in ons <Link href="/privacy">privacybeleid</Link>.
        </p>
        <p>
          Bij je review tonen we je naam en, als je daarvoor toestemming gaf, je foto. Je e-mailadres en
          bestelnummer tonen we nooit.
        </p>
      </section>

      <section>
        <h2>9. Slot</h2>
        <p>
          We mogen deze actie tussentijds aanpassen of stoppen als dat nodig is, bijvoorbeeld bij misbruik. We
          melden dat dan op deze pagina. Inzendingen die duidelijk niet van een echte koper komen, of die
          beledigend zijn of persoonsgegevens van anderen bevatten, doen niet mee.
        </p>
        <p>
          Op deze actie is Nederlands recht van toepassing. Heb je een vraag of klacht over de actie, mail ons
          dan via <a href={`mailto:${business.email}`}>{business.email}</a>.
        </p>
      </section>
    </LegalPageShell>
  )
}
