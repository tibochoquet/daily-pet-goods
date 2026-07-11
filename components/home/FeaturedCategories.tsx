import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    title: 'Hondenbakken',
    description: 'Verhoogde voerbakken, mangohout & metaal',
    href: '/dog-bowls',
    bg: 'bg-[#C8745A]',
    text: 'text-white',
    sub: 'text-white/70',
    span: 'lg:col-span-2 lg:row-span-2',
  },
  {
    title: 'Kattenbakken',
    description: 'Mangohout & minimalistisch metaal',
    href: '/cat-bowls',
    bg: 'bg-[#3D6456]',
    text: 'text-white',
    sub: 'text-white/70',
    span: '',
  },
  {
    title: 'Hondenmanden',
    description: 'Pluche donuts, lounge & Sambo manden',
    href: '/dog-beds',
    bg: 'bg-[#F3EDE3]',
    text: 'text-[#1A1A1A]',
    sub: 'text-[#6B7280]',
    span: '',
  },
  {
    title: 'Onderweg met je hond',
    description: 'Achterbankbeschermers, tuigjes & flessen',
    href: '/dog-travel',
    bg: 'bg-[#2C4A3E]',
    text: 'text-white',
    sub: 'text-white/70',
    span: '',
  },
  {
    title: 'Zwembaden & koelmatten',
    description: 'Opvouwbare zomerzwembaden voor honden',
    href: '/dog-pools',
    bg: 'bg-[#1F3329]',
    text: 'text-white',
    sub: 'text-white/70',
    span: '',
  },
  {
    title: 'Koelmatten katten',
    description: 'Zelfkoelend, zonder water of stroom',
    href: '/cat-cooling',
    bg: 'bg-[#D4956B]',
    text: 'text-white',
    sub: 'text-white/70',
    span: '',
  },
]

export default function FeaturedCategories() {
  const [featured, ...rest] = categories

  return (
    <section className="py-16 md:py-24 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-semibold text-[#C8745A] uppercase tracking-wider mb-2">Categorieën</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A]">
              Shop per categorie
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[#2C4A3E] font-medium text-sm hover:gap-3 transition-all"
          >
            Bekijk alle producten
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-[220px]">

          {/* Featured large tile */}
          <Link
            href={featured.href}
            className={`group flex flex-col justify-between p-7 rounded-3xl ${featured.bg} lg:col-span-2 lg:row-span-2 hover:opacity-95 transition-opacity`}
          >
            <div className="flex items-start justify-between">
              <span className={`text-xs font-semibold uppercase tracking-wider ${featured.sub}`}>
                Uitgelicht
              </span>
              <span className={`w-9 h-9 rounded-full border ${featured.text === 'text-white' ? 'border-white/25 text-white' : 'border-black/15 text-[#1A1A1A]'} flex items-center justify-center group-hover:bg-white/10 transition-colors`}>
                <ArrowRight size={14} />
              </span>
            </div>
            <div>
              <h3 className={`font-serif font-bold text-3xl sm:text-4xl ${featured.text} mb-2`}>
                {featured.title}
              </h3>
              <p className={`text-sm ${featured.sub}`}>{featured.description}</p>
            </div>
          </Link>

          {/* Smaller tiles */}
          {rest.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`group flex flex-col justify-between p-6 rounded-3xl ${cat.bg} hover:opacity-95 transition-opacity`}
            >
              <div className="flex items-start justify-between">
                <div />
                <span className={`w-8 h-8 rounded-full border ${cat.text === 'text-white' ? 'border-white/25 text-white' : 'border-black/15 text-[#1A1A1A]'} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <ArrowRight size={13} />
                </span>
              </div>
              <div>
                <h3 className={`font-serif font-bold text-xl ${cat.text} mb-1`}>
                  {cat.title}
                </h3>
                <p className={`text-xs ${cat.sub}`}>{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
