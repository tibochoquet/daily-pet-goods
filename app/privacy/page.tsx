import type { Metadata } from 'next'
import LegalPageShell from '@/components/legal/LegalPageShell'
import { LegalTodoBanner, LegalTodoSection } from '@/components/legal/LegalTodoSection'

export const metadata: Metadata = {
  title: 'Privacybeleid',
  description: 'Lees hoe Daily Pet Goods omgaat met jouw persoonsgegevens.',
  alternates: { canonical: '/privacy' },
  robots: { index: false, follow: true },
}

/**
 * The previous version of this page described the old manual Tikkie/bank-
 * transfer flow ("we never receive payment details, payment happens
 * outside the site") - that's no longer true now that Stripe Checkout is
 * live. Rather than patch stale claims, this was reset to a structure-only
 * shell. The real, verified data inventory (what's actually collected, by
 * whom, where it's stored) was reported separately - write the policy from
 * that, not from what used to be here.
 */
export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacybeleid"
      lastUpdated="TODO - datum invullen zodra de echte tekst live gaat"
      intro="Zie de aparte gegevensinventarisatie (geleverd naast deze pagina) voor wat hieronder feitelijk ingevuld moet worden - niet uit het geheugen herschrijven."
    >
      <LegalTodoBanner />

      <LegalTodoSection
        heading="1. Wie we zijn"
        todoPoints={['Verwijzing naar handelsnaam, KVK, BTW-id en contactgegevens (lib/business.ts)']}
      />

      <LegalTodoSection
        heading="2. Welke gegevens we verwerken"
        todoPoints={[
          'Bestelgegevens verzameld via Stripe Checkout (naam, e-mail, verzendadres) - Stripe zelf verwerkt betaalgegevens, wij ontvangen alleen bestel- en verzendinformatie via de webhook',
          'Contactformulier: voornaam, achternaam, e-mail, onderwerp, bericht',
          'Winkelwagen: alleen lokaal in de browser (localStorage), nooit naar een server behalve als product-ids + aantallen bij het afrekenen',
          'Nieuwsbrief-aanmelding op de homepage verwerkt momenteel NIETS - het formulier slaat niets op en verstuurt niets (zie rapportage); pas deze sectie aan zodra dat verandert',
        ]}
      />

      <LegalTodoSection
        heading="3. Waarvoor we deze gegevens gebruiken"
        todoPoints={['Bestelling verwerken/verzenden, reageren op contactverzoeken']}
      />

      <LegalTodoSection
        heading="4. Delen met derden"
        todoPoints={[
          'Stripe (betalingsverwerking) - ontvangt naam, e-mail, verzendadres, betaalgegevens',
          'Resend (transactionele e-mail) - ontvangt inhoud van bestel- en contactmails',
          'Geen bezorgdienst-API-koppeling gevonden in de code - handmatig proces? Bevestig dit',
        ]}
      />

      <LegalTodoSection
        heading="5. Cookies en lokale opslag"
        todoPoints={[
          'Eén localStorage-sleutel (dpg-cart) voor de winkelwagen - functioneel, geen toestemming vereist',
          'Geen analytics- of trackingcookies aangetroffen in de code',
          "Stripe Checkout zet eventuele cookies op checkout.stripe.com, niet op dailypetgoods.nl - valt onder Stripe's eigen beleid",
        ]}
      />

      <LegalTodoSection heading="6. Bewaartermijn" todoPoints={['Hoe lang bestel- en contactgegevens bewaard worden']} />

      <LegalTodoSection
        heading="7. Jouw rechten"
        todoPoints={['Inzage, correctie, verwijdering, bezwaar, klacht bij de Autoriteit Persoonsgegevens']}
      />

      <LegalTodoSection
        heading="8. Waar gegevens gehost worden"
        todoPoints={['Vercel (hosting), Stripe, Resend - regio/locatie per verwerker benoemen']}
      />
    </LegalPageShell>
  )
}
