import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacybeleid',
  description: 'Lees hoe Daily Pet Goods omgaat met jouw persoonsgegevens.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/privacy' },
  robots: { index: false, follow: true },
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-3">
        Privacybeleid
      </h1>
      <p className="text-sm text-[#6B7280] mb-10">Laatst bijgewerkt: juli 2026</p>

      <div className="space-y-8 text-[#4B5563] leading-relaxed text-sm">
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">1. Wie we zijn</h2>
          <p>
            Daily Pet Goods (&quot;wij&quot;, &quot;ons&quot;) beheert de website dailypetgoods.nl. Op deze
            website presenteren en verwijzen we naar producten die je koopt via Bol.com. Vragen over
            dit privacybeleid kun je sturen naar{' '}
            <a href="mailto:lifegoods.daily@gmail.com" className="text-[#2C4A3E] hover:underline">
              lifegoods.daily@gmail.com
            </a>.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">2. Welke gegevens we verwerken</h2>
          <p className="mb-3">
            Wij verkopen niet rechtstreeks via deze website. Bestellingen, betalingen en verzending
            lopen volledig via Bol.com. We verzamelen daardoor zelf geen betaal- of adresgegevens.
          </p>
          <p>De enige gegevens die wij zelf verwerken zijn:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Naam, e-mailadres en het bericht dat je invult in ons contactformulier.</li>
            <li>Het e-mailadres dat je invult bij de nieuwsbrief-aanmelding op de homepage.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">3. Waarvoor we deze gegevens gebruiken</h2>
          <p>
            We gebruiken je gegevens uitsluitend om je vraag via het contactformulier te beantwoorden,
            of om je op de hoogte te houden van nieuwe producten als je je hebt aangemeld voor de
            nieuwsbrief. We verkopen of delen je gegevens nooit met derden voor marketingdoeleinden.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">4. Bestellingen via Bol.com</h2>
          <p>
            Wanneer je een aankoop doet, gebeurt dit volledig op Bol.com. Bol.com verwerkt daarbij je
            bestel-, betaal- en verzendgegevens onder haar eigen privacybeleid. Wij hebben geen
            toegang tot deze gegevens.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">5. Bewaartermijn</h2>
          <p>
            Berichten via het contactformulier bewaren we niet langer dan nodig om je vraag af te
            handelen. Je e-mailadres voor de nieuwsbrief bewaren we tot je je afmeldt.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">6. Jouw rechten</h2>
          <p>
            Je hebt het recht om inzage, correctie of verwijdering van je gegevens te vragen. Stuur
            hiervoor een e-mail naar{' '}
            <a href="mailto:lifegoods.daily@gmail.com" className="text-[#2C4A3E] hover:underline">
              lifegoods.daily@gmail.com
            </a>.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">7. Cookies</h2>
          <p>
            Deze website gebruikt geen tracking- of advertentiecookies. Er worden alleen technisch
            noodzakelijke gegevens gebruikt om de site te laten functioneren.
          </p>
        </section>
      </div>
    </div>
  )
}
