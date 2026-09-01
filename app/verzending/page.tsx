import type { Metadata } from 'next'
import LegalPageShell from '@/components/legal/LegalPageShell'
import { business } from '@/lib/business'

export const metadata: Metadata = {
  title: 'Verzending',
  description: 'Verzendkosten en levertijden van de Daily Pet Goods webshop.',
  alternates: { canonical: '/verzending' },
  robots: { index: false, follow: true },
}

export default function VerzendingPage() {
  return (
    <LegalPageShell title="Verzending" lastUpdated="1 september 2026">
      <section>
        <h2>1. Verzendkosten</h2>
        <p>
          Verzending is altijd gratis, voor elke bestelling binnen Nederland en België. Er zijn geen verborgen
          verzendkosten, ongeacht het aantal producten of de grootte van je bestelling.
        </p>
      </section>

      <section>
        <h2>2. Levertijden</h2>
        <p>
          We verwerken en verzenden je bestelling binnen 1 tot 2 werkdagen nadat je betaling is gelukt. Daarna
          doet DHL er gemiddeld nog 1 tot 3 werkdagen over om je pakket te bezorgen.
        </p>
        <p>
          Deze termijnen zijn indicatief: bij onvoorziene vertraging bij DHL, of drukte rond bijvoorbeeld
          feestdagen, kan de bezorging iets langer duren. Verwachten we dat een levering merkbaar langer gaat
          duren, dan laten we je dat zo snel mogelijk weten.
        </p>
      </section>

      <section>
        <h2>3. Verzendgebied</h2>
        <p>We verzenden op dit moment alleen naar adressen in Nederland en België.</p>
      </section>

      <section>
        <h2>4. Track &amp; trace</h2>
        <p>
          Zodra DHL je pakket heeft opgehaald, ontvang je van DHL een track &amp; trace-code waarmee je de
          bezorging kunt volgen.
        </p>
      </section>

      <section>
        <h2>5. Beschadigd of vermist pakket</h2>
        <p>
          Komt je pakket beschadigd aan, of is het niet aangekomen? Mail ons dan eerst op{' '}
          <a href={`mailto:${business.email}`}>{business.email}</a> met je bestelnummer, en bij schade ook
          foto&apos;s van het pakket en de inhoud. We zoeken dan samen naar een oplossing, zoals een vervangende
          zending of terugbetaling.
        </p>
      </section>
    </LegalPageShell>
  )
}
