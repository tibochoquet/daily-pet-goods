import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Voorwaarden',
  description: 'Gebruiksvoorwaarden van de Daily Pet Goods website.',
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
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">1. Over deze website</h2>
          <p>
            Daily Pet Goods (dailypetgoods.nl) is een redactionele website waarop wij een selectie van
            huisdierproducten presenteren. Wij zijn geen webshop: alle producten die je op deze site
            ziet, koop je rechtstreeks bij Bol.com via de knop &quot;Bekijk op Bol.com&quot; op elke
            productpagina.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">2. Bestellingen, betaling en levering</h2>
          <p>
            Omdat aankopen plaatsvinden op Bol.com, zijn de algemene voorwaarden, het retourbeleid en
            het klantenserviceproces van Bol.com van toepassing op je bestelling, niet die van Daily
            Pet Goods. Neem voor vragen over een bestelling, levering of retour rechtstreeks contact op
            met Bol.com.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">3. Prijzen en beschikbaarheid</h2>
          <p>
            Prijzen op onze productpagina&apos;s zijn indicatief en gebaseerd op de prijs op het moment
            van publiceren. De actuele prijs, voorraad en levertijd zie je altijd op Bol.com zelf.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">4. Content en intellectueel eigendom</h2>
          <p>
            Alle teksten, foto&apos;s en het ontwerp van deze website zijn eigendom van Daily Pet Goods,
            tenzij anders vermeld. Je mag content niet zonder toestemming overnemen of hergebruiken.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">5. Aansprakelijkheid</h2>
          <p>
            We doen ons best om productinformatie zo nauwkeurig mogelijk weer te geven, maar kunnen
            niet garanderen dat alle informatie te allen tijde volledig up-to-date is. Aan de inhoud
            van deze website kunnen geen rechten worden ontleend.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">6. Contact</h2>
          <p>
            Vragen over deze voorwaarden? Mail naar{' '}
            <a href="mailto:lifegoods.daily@gmail.com" className="text-[#2C4A3E] hover:underline">
              lifegoods.daily@gmail.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  )
}
