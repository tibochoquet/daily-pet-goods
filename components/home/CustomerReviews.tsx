import { Truck, RotateCcw, MessageCircle, Package } from 'lucide-react'

const reasons = [
  {
    icon: Truck,
    title: 'Gratis verzending',
    description: 'Op elke bestelling, zonder minimumbedrag.',
  },
  {
    icon: Package,
    title: 'Zorgvuldig verpakt',
    description: 'Elke bestelling wordt persoonlijk ingepakt en snel verzonden.',
  },
  {
    icon: RotateCcw,
    title: '14 dagen bedenktijd',
    description: 'Niet tevreden? Retourneer zonder opgaaf van reden.',
  },
  {
    icon: MessageCircle,
    title: 'Persoonlijk contact',
    description: 'Vragen? Je mailt rechtstreeks met ons, geen callcenter.',
  },
]

export default function CustomerReviews() {
  return (
    <section className="py-16 md:py-24 bg-[#2C4A3E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[#C8745A] uppercase tracking-wider mb-2">Waarom Daily Pet Goods</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
            Waarom klanten voor ons kiezen
          </h2>
          <p className="text-white/60 mt-3 max-w-xl mx-auto leading-relaxed">
            Wij selecteren de producten, jij bestelt rechtstreeks bij ons, zonder tussenpartij.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reasons.map((reason) => {
            const Icon = reason.icon
            return (
              <div
                key={reason.title}
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 hover:bg-white/15 transition-colors"
              >
                <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#D4956B]" />
                </div>
                <h3 className="font-serif font-semibold text-white text-lg mb-2">{reason.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{reason.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
