import type { Metadata } from 'next'
import { Mail, MessageCircle, Clock } from 'lucide-react'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Heb je een vraag over een product, je bestelling, of iets anders? We horen graag van je. Neem contact op met het Daily Pet Goods team.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/contact' },
}

export default function ContactPage() {
  return (
    <>
      <section className="bg-[#F3EDE3] py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-[#C8745A] uppercase tracking-wider mb-4">Neem contact op</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
            We horen graag van je
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed">
            Vragen over een product, maatadvies, of iets anders — stuur ons gerust een bericht.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#FAFAF7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-[#E8E2D9]">
                <div className="w-10 h-10 bg-[#2C4A3E]/10 rounded-xl flex items-center justify-center mb-3">
                  <Mail size={18} className="text-[#2C4A3E]" />
                </div>
                <h3 className="font-semibold text-[#1A1A1A] mb-1">E-mail ons</h3>
                <a
                  href="mailto:hello@dailypetgoods.nl"
                  className="text-sm text-[#2C4A3E] hover:underline"
                >
                  hello@dailypetgoods.nl
                </a>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#E8E2D9]">
                <div className="w-10 h-10 bg-[#2C4A3E]/10 rounded-xl flex items-center justify-center mb-3">
                  <Clock size={18} className="text-[#2C4A3E]" />
                </div>
                <h3 className="font-semibold text-[#1A1A1A] mb-1">Reactietijd</h3>
                <p className="text-sm text-[#6B7280]">We reageren doorgaans binnen 24 uur op werkdagen.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#E8E2D9]">
                <div className="w-10 h-10 bg-[#2C4A3E]/10 rounded-xl flex items-center justify-center mb-3">
                  <MessageCircle size={18} className="text-[#2C4A3E]" />
                </div>
                <h3 className="font-semibold text-[#1A1A1A] mb-1">Vragen over je bestelling</h3>
                <p className="text-sm text-[#6B7280]">
                  Voor vragen over een bestelling, levering of retour kun je ook rechtstreeks terecht bij de klantenservice van Bol.com.
                </p>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
