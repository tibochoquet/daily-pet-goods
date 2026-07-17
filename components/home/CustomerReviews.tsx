import { ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react'

const reasons = [
  {
    icon: ShieldCheck,
    title: 'Veilig kopen via Bol.com',
    description: 'Elke bestelling loopt via Bol.com, met kopersbescherming en een vertrouwd afrekenproces.',
  },
  {
    icon: Truck,
    title: 'Snelle levering & track & trace',
    description: 'Bol.com verzorgt de levering en je volgt je bestelling stap voor stap.',
  },
  {
    icon: RotateCcw,
    title: 'Eenvoudig retourneren',
    description: 'Niet tevreden? Via Bol.com regel je een retour zonder gedoe.',
  },
  {
    icon: CreditCard,
    title: 'Vertrouwde betaalmethoden',
    description: 'Betaal veilig met iDEAL, creditcard of achteraf betalen, zoals je van Bol.com gewend bent.',
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
            Wij selecteren de producten, jij bestelt en betaalt veilig via het platform dat je al kent.
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
