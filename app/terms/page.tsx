import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Voorwaarden',
  description: 'Verkoopvoorwaarden van de Daily Pet Goods webshop.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/terms' },
  robots: { index: false, follow: true },
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-3">
        Voorwaarden
      </h1>
      <p className="text-sm text-[#6B7280] mb-10">Laatst bijgewerkt: juli 2026</p>

      <div className="space-y-8 text-[#4B5563] leading-relaxed text-sm">
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">1. Over deze webshop</h2>
          <p>
            Daily Pet Goods (dailypetgoods.nl) verkoopt rechtstreeks huisdierproducten via deze website.
            Door een bestelling te plaatsen ga je akkoord met deze voorwaarden.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">2. Bestellen en betalen</h2>
          <p>
            Je plaatst een bestelling via de winkelwagen en checkout op deze website. Na het plaatsen
            van je bestelling ontvang je binnen 24 uur een betaalverzoek van ons (bijvoorbeeld via
            Tikkie of bankoverschrijving). Je bestelling wordt verzonden zodra de betaling is ontvangen.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">3. Levering</h2>
          <p>
            We verzenden je bestelling binnen 1 tot 2 werkdagen na ontvangst van betaling. Verzending is
            gratis op elke bestelling. Levertijden zijn indicatief; vertraging bij de bezorgdienst is
            buiten onze invloed.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">4. Herroepingsrecht (retourneren)</h2>
          <p>
            Je hebt het recht om je bestelling binnen 14 dagen na ontvangst zonder opgaaf van reden te
            annuleren. Meld dit binnen deze termijn via{' '}
            <a href="mailto:lifegoods.daily@gmail.com" className="text-[#2C4A3E] hover:underline">
              lifegoods.daily@gmail.com
            </a>. Je stuurt het product ongebruikt en in de originele verpakking terug; de kosten van het
            terugsturen zijn voor jouw rekening. Zodra we het product retour hebben ontvangen, betalen
            we het aankoopbedrag binnen 14 dagen terug.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">5. Garantie en klachten</h2>
          <p>
            Komt je bestelling beschadigd aan, of klopt hij niet met de beschrijving? Mail ons op{' '}
            <a href="mailto:lifegoods.daily@gmail.com" className="text-[#2C4A3E] hover:underline">
              lifegoods.daily@gmail.com
            </a>{' '}
            met je bestelnummer en, indien mogelijk, een foto. We lossen dit zo snel mogelijk op.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">6. Prijzen en beschikbaarheid</h2>
          <p>
            Prijzen op deze website zijn in euro&apos;s, inclusief btw en verzendkosten. We behouden ons het
            recht voor prijzen en assortiment aan te passen. Kennelijke fouten in prijsvermelding binden
            ons niet.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">7. Content en intellectueel eigendom</h2>
          <p>
            Alle teksten, foto&apos;s en het ontwerp van deze website zijn eigendom van Daily Pet Goods,
            tenzij anders vermeld. Je mag content niet zonder toestemming overnemen of hergebruiken.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">8. Aansprakelijkheid</h2>
          <p>
            We doen ons best om productinformatie zo nauwkeurig mogelijk weer te geven, maar kunnen niet
            garanderen dat alle informatie te allen tijde volledig up-to-date is.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">9. Contact</h2>
          <p>
            Vragen over deze voorwaarden of je bestelling? Mail naar{' '}
            <a href="mailto:lifegoods.daily@gmail.com" className="text-[#2C4A3E] hover:underline">
              lifegoods.daily@gmail.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  )
}
