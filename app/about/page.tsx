import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Heart, Leaf, Shield, Star } from 'lucide-react'
import { brandImages } from '@/lib/images'

export const metadata: Metadata = {
  title: 'Over ons: Het verhaal achter Daily Pet Goods',
  description:
    'Daily Pet Goods werd opgericht door een huisdiereigenaar die betere producten wilde. Zonder de overweldigende keuze van generieke marktplaatsen. Lees ons verhaal en waarom we doen wat we doen.',
  alternates: { canonical: '/about' },
}

const values = [
  {
    icon: Heart,
    title: 'Huisdier op één',
    description: 'Elk product begint met een simpele vraag: zal een huisdier dit graag gebruiken?',
  },
  {
    icon: Leaf,
    title: 'Duurzame materialen',
    description: 'We kiezen het liefst voor natuurlijke materialen. Mangohout, roestvrij staal, voedselveilig silicone.',
  },
  {
    icon: Shield,
    title: 'Kwaliteit die je kunt vertrouwen',
    description: 'We testen elk product voordat het bij onze collectie komt. Geen shortcuts.',
  },
  {
    icon: Star,
    title: 'Eerlijke selectie',
    description: 'We verkopen alleen producten die we zelf voor onze eigen huisdieren zouden kopen. Geen opvulling.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero. Full-bleed lifestyle image */}
      <section className="relative min-h-[75vh] flex items-end overflow-hidden">
        <Image
          src={brandImages.lifestyleHero}
          alt="Golden retriever rustend op een premium crème loungebed, grijze kat op een fauteuil. Warm modern interieur"
          fill
          className="object-cover object-[38%_center] sm:object-center"
          priority
          sizes="100vw"
          quality={90}
        />
        {/* Gradient bottom-up so text stays readable, top of image stays clean */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 md:pb-20">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-[#D4956B] uppercase tracking-wider mb-4">
              Ons verhaal
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
              Gebouwd door een huisdiereigenaar,{' '}
              <em className="not-italic text-[#D4956B]">voor huisdiereigenaren.</em>
            </h1>
            <p className="text-lg text-white/65 leading-relaxed">
              We begonnen met een frustratie. We eindigden met het bouwen van het merk dat we zelf misten.
            </p>
          </div>
        </div>
      </section>

      {/* Story text */}
      <section className="py-16 md:py-24 bg-[#FAFAF7]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xl text-[#2C4A3E] font-serif font-medium leading-relaxed mb-6">
            Mooie, kwalitatieve producten vinden voor onze huisdieren betekende óf luxe prijzen betalen, óf je een weg banen door pagina&apos;s vol goedkope, wegwerpproducten op generieke marktplaatsen.
          </p>
          <p className="text-[#6B7280] leading-relaxed mb-5">
            Wij wilden de middenweg: producten die goed gemaakt waren, er mooi uitzagen in huis, en niet een fortuin kostten. Dus gingen we op zoek, testten we alles, en bouwden we een kleine, zorgvuldig samengestelde collectie rond de dingen die echt werkten.
          </p>
          <p className="text-[#6B7280] leading-relaxed">
            Vandaag heeft elk product in ons assortiment datzelfde proces doorlopen. Is het niet goed genoeg voor onze eigen huisdieren, dan haalt het de collectie niet.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 bg-[#F3EDE3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#C8745A] uppercase tracking-wider mb-3">
              Waar we voor staan
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A]">
              Onze waarden
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <div
                  key={value.title}
                  className="bg-white rounded-2xl p-6 border border-[#E8E2D9] hover:shadow-md transition-shadow"
                >
                  <div className="w-11 h-11 bg-[#2C4A3E]/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={20} className="text-[#2C4A3E]" />
                  </div>
                  <h3 className="font-serif font-semibold text-[#1A1A1A] text-lg mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Rechtstreeks bestellen */}
      <section className="py-16 md:py-24 bg-[#2C4A3E]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
            Rechtstreeks bij ons besteld
          </h2>
          <p className="text-white/65 leading-relaxed mb-4">
            Je bestelt rechtstreeks via onze website, zonder tussenpartij. Zo houden we grip op kwaliteit, verpakking en klantcontact, van bestelling tot aan je deur.
          </p>
          <p className="text-white/65 leading-relaxed mb-10">
            Heb je een vraag over je bestelling? Wij zijn zelf je aanspreekpunt, geen callcenter.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-[#2C4A3E] font-semibold px-7 py-4 rounded-full hover:bg-[#F3EDE3] transition-colors text-sm"
          >
            Bekijk onze producten
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-[#FAFAF7]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4">
            Heb je een vraag?
          </h2>
          <p className="text-[#6B7280] mb-6">
            We horen graag van huisdiereigenaren. Neem contact op en we reageren snel.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#2C4A3E] text-white font-semibold px-6 py-3.5 rounded-full hover:bg-[#3D6456] transition-colors text-sm"
          >
            Neem contact op
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}
