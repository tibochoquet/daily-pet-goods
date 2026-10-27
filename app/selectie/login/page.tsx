import type { Metadata } from 'next'
import LoginFormulier from './LoginFormulier'

export const metadata: Metadata = {
  title: 'Productselectie',
  robots: { index: false, follow: false, nocache: true },
}

/**
 * Inlogscherm van de productselectietool.
 *
 * Staat bewust buiten de gewone site-opmaak: dit is geen winkelpagina en
 * hoort geen navigatie, winkelwagen of footer te tonen. De kleuren komen
 * wel uit dezelfde huisstijl.
 */
export default async function SelectieLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ terug?: string }>
}) {
  const { terug } = await searchParams
  // Alleen een pad binnen /selectie is een geldige bestemming. Zonder die
  // controle is dit een open doorverwijzing naar elke willekeurige site.
  const bestemming = terug && /^\/selectie(\/|$)/.test(terug) ? terug : '/selectie'

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3EDE3] px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#C8745A] mb-2">Daily Pet Goods</p>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">Productselectie</h1>
          <p className="text-sm text-[#6B7280] mt-2">Deze pagina is alleen voor ons tweeën.</p>
        </div>
        <LoginFormulier bestemming={bestemming} />
      </div>
    </div>
  )
}
