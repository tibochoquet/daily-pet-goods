import type { Metadata } from 'next'
import Link from 'next/link'
import { FileDown, ChevronLeft } from 'lucide-react'
import { generateWithdrawalFormText } from '@/lib/withdrawal-form'

export const metadata: Metadata = {
  title: 'Modelformulier voor herroeping',
  description: 'Download het modelformulier voor herroeping van je bestelling.',
  alternates: { canonical: '/retourneren/modelformulier-herroeping' },
  robots: { index: false, follow: true },
}

export default function ModelformulierHerroepingPage() {
  const text = generateWithdrawalFormText()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
      <Link
        href="/retourneren"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#2C4A3E] transition-colors mb-8"
      >
        <ChevronLeft size={14} />
        Terug naar retourneren
      </Link>

      <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-3">
        Modelformulier voor herroeping
      </h1>
      <p className="text-sm text-[#6B7280] mb-8">
        Dit is het standaard modelformulier uit de Europese consumentenrichtlijn. Vul het in en stuur het
        naar ons als je je bestelling wilt herroepen - dit is niet verplicht, je kunt je herroeping ook op
        een andere ondubbelzinnige manier melden.
      </p>

      <a
        href="/retourneren/modelformulier-herroeping/download"
        className="inline-flex items-center gap-2 bg-[#2C4A3E] text-white font-medium px-6 py-3 rounded-full hover:bg-[#3D6456] transition-colors mb-8"
      >
        <FileDown size={16} />
        Download als tekstbestand
      </a>

      <pre className="whitespace-pre-wrap bg-white border border-[#E8E2D9] rounded-2xl p-6 text-sm text-[#4B5563] leading-relaxed font-sans">
        {text}
      </pre>
    </div>
  )
}
