import { CheckCircle2, Truck, Gem, Heart } from 'lucide-react'

const reasons = [
  {
    icon: Gem,
    title: 'Carefully selected',
    description:
      'Every product is tested and chosen for quality, durability, and design. No filler — only essentials your pet will actually use.',
  },
  {
    icon: Truck,
    title: 'Fast delivery',
    description:
      'Order through Bol.com for reliable next-day delivery across the Netherlands and Belgium.',
  },
  {
    icon: CheckCircle2,
    title: 'Quality materials',
    description:
      'Sustainable mango wood, food-grade stainless steel, BPA-free silicone — safe, durable, and built to last.',
  },
  {
    icon: Heart,
    title: 'Customer focused',
    description:
      'Real questions get real answers. We\'re here for sizing help, product advice, or anything after your order arrives.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[#C8745A] uppercase tracking-wider mb-2">Why us</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A]">
            The Daily Pet Goods difference
          </h2>
          <p className="text-[#6B7280] mt-3 max-w-xl mx-auto leading-relaxed">
            We started with a frustration — finding quality pet products that look good at home, without paying luxury prices. We built the middle ground.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason) => {
            const Icon = reason.icon
            return (
              <div
                key={reason.title}
                className="bg-white rounded-2xl p-6 border border-[#E8E2D9] hover:shadow-md transition-shadow"
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
