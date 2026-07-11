'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: 'Waar kan ik Daily Pet Goods producten kopen?',
    answer:
      'Al onze producten zijn verkrijgbaar via Bol.com, een van de grootste en meest vertrouwde webwinkels van Nederland en België. Klik op de knop "Bekijk op Bol.com" op een productpagina om direct naar de listing te gaan.',
  },
  {
    question: 'Hoe snel wordt mijn bestelling geleverd?',
    answer:
      'Bestellingen via Bol.com komen voor de meeste adressen in Nederland doorgaans de volgende werkdag aan. Levering in België duurt meestal 2–3 werkdagen. Bol.com biedt volledige track & trace zodat je je pakket kunt volgen.',
  },
  {
    question: 'Hoe kies ik de juiste maat verhoogde voerbak?',
    answer:
      'Een goede vuistregel: maat M voor honden tot 10 kg, L voor honden van 10–25 kg, en XL voor honden boven de 25 kg. De ideale bakhoogte zorgt ervoor dat je hond kan eten zonder de nek te hoeven buigen of strekken.',
  },
  {
    question: 'Zijn de mangohouten bakken veilig voor voer en water?',
    answer:
      'Ja. Al onze mangohouten producten hebben een voedselveilige olieafwerking en bevatten roestvrijstalen inzetstukken voor direct contact met voer en water. Het hout zelf houdt alleen het inzetstuk vast — het komt nooit in contact met het eten van je huisdier.',
  },
  {
    question: 'Kan ik de hoezen van de hondenmanden wassen?',
    answer:
      'Ja. De hoezen van onze Sambo hondenmand, pluche donut manden en het loungebed zijn allemaal afneembaar en machinewasbaar. We raden een wasje op 30°C met een fijn programma aan.',
  },
  {
    question: 'Wat als een product beschadigd aankomt?',
    answer:
      'Bol.com heeft een uitstekende klantenservice en retourbeleid. Komt je bestelling beschadigd aan of klopt hij niet met de beschrijving? Neem dan contact op met Bol.com, of mail ons op hello@dailypetgoods.nl en we zorgen dat het snel wordt opgelost.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 md:py-24 bg-[#FAFAF7]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[#C8745A] uppercase tracking-wider mb-2">FAQ</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A]">
            Veelgestelde vragen
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-[#1A1A1A] text-sm sm:text-base">
                  {faq.question}
                </span>
                <span className="shrink-0 w-6 h-6 bg-[#F3EDE3] rounded-full flex items-center justify-center">
                  {openIndex === index ? (
                    <Minus size={12} className="text-[#2C4A3E]" />
                  ) : (
                    <Plus size={12} className="text-[#2C4A3E]" />
                  )}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-[#6B7280] leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
