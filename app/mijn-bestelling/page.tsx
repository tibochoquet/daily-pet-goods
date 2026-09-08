import type { Metadata } from 'next'
import { Mail } from 'lucide-react'
import { business } from '@/lib/business'
import LoginRequestForm from '@/components/orders/LoginRequestForm'
import OrderLookupForm from '@/components/orders/OrderLookupForm'

export const metadata: Metadata = {
  title: 'Waar is mijn bestelling?',
  description: 'Bekijk je bestelling, volg je pakket, meld eenvoudig een retour aan of laat een review achter.',
  alternates: { canonical: '/mijn-bestelling' },
  robots: { index: false, follow: true },
}

export default async function MijnBestellingPage({
  searchParams,
}: {
  searchParams: Promise<{ fout?: string }>
}) {
  const { fout } = await searchParams
  const linkExpired = fout === 'link-verlopen'

  return (
    <>
      <section className="bg-[#F3EDE3] py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-[#C8745A] uppercase tracking-wider mb-4">Mijn bestelling</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">Waar is mijn bestelling?</h1>
          <p className="text-lg text-[#6B7280] leading-relaxed">
            Bekijk je bestelling, volg je pakket, meld eenvoudig een retour aan of laat een review achter.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#FAFAF7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {linkExpired && (
            <div className="mb-8 bg-[#FBEFEA] border border-[#C8745A]/30 rounded-2xl p-4 text-sm text-[#A85E45] text-center max-w-xl mx-auto">
              Deze link is verlopen of al gebruikt. Vraag hieronder een nieuwe aan.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E2D9]">
              <h2 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">Inloggen</h2>
              <p className="text-sm text-[#6B7280] mb-5">
                Vul je e-mailadres in en ontvang een inloglink om al je bestellingen te bekijken.
              </p>
              <LoginRequestForm />
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E2D9]">
              <h2 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">Bestelling opzoeken</h2>
              <p className="text-sm text-[#6B7280] mb-5">
                Vul je bestelnummer en e-mailadres in om direct je bestelling te bekijken.
              </p>
              <OrderLookupForm />
            </div>
          </div>

          <div className="mt-10 bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E2D9] max-w-xl mx-auto text-center">
            <div className="w-10 h-10 bg-[#2C4A3E]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Mail size={18} className="text-[#2C4A3E]" />
            </div>
            <h2 className="font-semibold text-[#1A1A1A] mb-1">Heb je een vraag over je bestelling of retour?</h2>
            <p className="text-sm text-[#6B7280] mb-4">Kom je ergens niet uit? Mail ons gerust, we helpen je graag.</p>
            <a
              href={`mailto:${business.email}`}
              className="inline-flex items-center gap-2 bg-[#2C4A3E] text-white font-medium px-6 py-3 rounded-full hover:bg-[#3D6456] transition-colors text-sm"
            >
              Mail ons
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
