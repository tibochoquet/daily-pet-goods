import Image from 'next/image'
import { CheckCircle2, Truck, Gem, Heart } from 'lucide-react'
import { brandImages } from '@/lib/images'

const reasons = [
  {
    icon: Gem,
    title: 'Zorgvuldig geselecteerd',
    description:
      'Elk product wordt getest en gekozen op kwaliteit, duurzaamheid en design. Geen opvulling — alleen essentials die jouw huisdier echt gebruikt.',
  },
  {
    icon: Truck,
    title: 'Snelle levering',
    description:
      'Bestel via Bol.com voor betrouwbare levering, vaak al de volgende dag, in heel Nederland en België.',
  },
  {
    icon: CheckCircle2,
    title: 'Kwaliteitsmaterialen',
    description:
      'Duurzaam mangohout, voedselveilig roestvrij staal, BPA-vrij silicone — veilig, stevig en gebouwd om lang mee te gaan.',
  },
  {
    icon: Heart,
    title: 'Persoonlijk contact',
    description:
      'Echte vragen krijgen een echt antwoord. We helpen graag met maatadvies, productvragen, of iets anders na je bestelling.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <Image
        src={brandImages.lifestyleGeneral}
        alt="Hond en kat ontspannen tussen voerbakken en een hondenmand in een lichte woonkamer"
        fill
        className="object-cover object-[50%_70%]"
        sizes="100vw"
        quality={85}
      />
      <div className="absolute inset-0 bg-[#FAFAF7]/88" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[#C8745A] uppercase tracking-wider mb-2">Waarom wij</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A]">
            Het Daily Pet Goods verschil
          </h2>
          <p className="text-[#6B7280] mt-3 max-w-xl mx-auto leading-relaxed">
            We begonnen met een frustratie — het vinden van kwalitatieve huisdierproducten die er goed uitzien in huis, zonder luxe prijzen. Wij bouwden de middenweg.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason) => {
            const Icon = reason.icon
            return (
              <div
                key={reason.title}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-[#E8E2D9] hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 bg-[#2C4A3E]/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#2C4A3E]" />
                </div>
                <h3 className="font-serif font-semibold text-[#1A1A1A] text-lg mb-2">{reason.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{reason.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
