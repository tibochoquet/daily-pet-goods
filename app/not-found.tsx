import Link from 'next/link'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="text-sm font-semibold text-[#C8745A] uppercase tracking-wider mb-4">
        Pagina niet gevonden
      </p>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-5">
        404
      </h1>
      <p className="text-[#6B7280] leading-relaxed mb-10">
        Deze pagina bestaat niet (meer). Mogelijk is de link verlopen of is de pagina verplaatst.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#2C4A3E] text-white font-medium px-6 py-3 rounded-full hover:bg-[#3D6456] transition-colors"
        >
          <ArrowLeft size={16} />
          Terug naar home
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 border border-[#E8E2D9] text-[#1A1A1A] font-medium px-6 py-3 rounded-full hover:bg-[#F3EDE3] transition-colors"
        >
          Bekijk alle producten
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
