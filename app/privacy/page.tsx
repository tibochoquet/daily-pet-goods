import type { Metadata } from 'next'
import LegalPageShell from '@/components/legal/LegalPageShell'
import { business, formatAddress } from '@/lib/business'

export const metadata: Metadata = {
  title: 'Privacybeleid',
  description: 'Lees hoe Daily Pet Goods omgaat met jouw persoonsgegevens.',
  alternates: { canonical: '/privacy' },
  robots: { index: false, follow: true },
}

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacybeleid" lastUpdated="1 september 2026">
      <section>
        <h2>1. Wie we zijn</h2>
        <p>
          {business.brandName} ({business.tradingName}), KVK {business.kvkNumber}, gevestigd aan{' '}
          {formatAddress()}, is verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven in dit
          privacybeleid. Vragen? Mail <a href={`mailto:${business.email}`}>{business.email}</a>.
        </p>
      </section>

      <section>
        <h2>2. Welke gegevens we verwerken</h2>
        <ul>
          <li>
            Bij een bestelling (via Stripe Checkout): je naam, e-mailadres, verzendadres en eventueel
            telefoonnummer. Je betaalgegevens (kaartnummer e.d.) verwerkt Stripe rechtstreeks; die ontvangen wij
            nooit.
          </li>
          <li>Bij het contactformulier: je voornaam, achternaam, e-mailadres, onderwerp en bericht.</li>
          <li>Bij aanmelding voor de nieuwsbrief: je e-mailadres.</li>
          <li>
            Je winkelwagen wordt alleen lokaal in je browser opgeslagen en nooit naar ons verzonden, behalve als
            productkeuzes op het moment dat je afrekent.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Waarvoor we deze gegevens gebruiken</h2>
        <p>
          We gebruiken deze gegevens om je bestelling te verwerken en te verzenden, te reageren op je vragen, en
          - als je je hebt aangemeld - om je incidenteel te mailen met nieuws over {business.brandName}. We
          gebruiken je gegevens niet voor andere doeleinden en verkopen ze nooit aan derden.
        </p>
      </section>

      <section>
        <h2>4. Delen met derden</h2>
        <ul>
          <li>Stripe (betalingsverwerking) - ontvangt je naam, e-mail, verzendadres en betaalgegevens.</li>
          <li>Resend (e-mailverzending) - verstuurt namens ons de order-, contact- en nieuwsbriefmails.</li>
          <li>Vercel (hosting) - host de website.</li>
        </ul>
        <p>
          Deze partijen kunnen gegevens ook buiten Nederland verwerken; waar dat buiten de EU is, zorgen zij voor
          passende waarborgen (zoals EU-standaardcontractbepalingen). We delen je gegevens nooit voor
          marketingdoeleinden van derden.
        </p>
      </section>

      <section>
        <h2>5. Cookies en lokale opslag</h2>
        <p>
          Onze website gebruikt geen tracking- of advertentiecookies. We slaan alleen je winkelwagen functioneel
          op in je browser (localStorage); daar is geen toestemming voor nodig. Tijdens het afrekenen kan Stripe
          eigen cookies plaatsen op checkout.stripe.com - dat valt onder het privacybeleid van Stripe, niet onder
          het onze.
        </p>
      </section>

      <section>
        <h2>6. Bewaartermijn</h2>
        <p>
          Bestel- en factuurgegevens bewaren we zo lang als de wet dat van ons vraagt (de fiscale bewaarplicht is
          7 jaar). Contact- en nieuwsbriefgegevens bewaren we niet langer dan nodig voor het doel waarvoor je ze
          hebt gedeeld, of totdat je aangeeft dat we ze mogen verwijderen.
        </p>
      </section>

      <section>
        <h2>7. Jouw rechten</h2>
        <p>
          Je hebt het recht om je gegevens in te zien, te laten corrigeren of verwijderen, en om bezwaar te maken
          tegen het gebruik ervan. Mail daarvoor naar <a href={`mailto:${business.email}`}>{business.email}</a>.
          Ben je het niet eens met hoe we met je gegevens omgaan, dan kun je een klacht indienen bij de{' '}
          <a href="https://www.autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer">
            Autoriteit Persoonsgegevens
          </a>
          .
        </p>
      </section>

      <section>
        <h2>8. Waar gegevens gehost worden</h2>
        <p>
          Onze website draait bij Vercel, e-mail wordt verstuurd via Resend en betalingen worden verwerkt door
          Stripe. Zie sectie 4 hierboven voor wat elke partij precies ontvangt.
        </p>
      </section>
    </LegalPageShell>
  )
}
