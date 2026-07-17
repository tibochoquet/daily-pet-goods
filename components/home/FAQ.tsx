'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: 'Waar kan ik Daily Pet Goods producten kopen?',
    answer:
      'Rechtstreeks via onze website. Kies je product en variant, voeg toe aan je winkelwagen en rond de bestelling af via checkout. Geen account nodig.',
  },
  {
    question: 'Hoe werkt betalen?',
    answer:
      'Na het plaatsen van je bestelling sturen we je binnen 24 uur een betaalverzoek (Tikkie of bankoverschrijving). Zodra de betaling binnen is, verzenden we je bestelling.',
  },
  {
    question: 'Hoe snel wordt mijn bestelling geleverd?',
    answer:
      'We verzenden je bestelling binnen 1 tot 2 werkdagen nadat de betaling binnen is. Bezorging binnen Nederland duurt daarna gemiddeld 1 tot 3 werkdagen.',
  },
  {
    question: 'Hoe kies ik de juiste maat verhoogde voerbak?',
    answer:
      'Een goede vuistregel: maat M voor honden tot 10 kg, L voor honden van 10–25 kg, en XL voor honden boven de 25 kg. De ideale bakhoogte zorgt ervoor dat je hond kan eten zonder de nek te hoeven buigen of strekken.',
  },
  {
    question: 'Zijn de mangohouten bakken veilig voor voer en water?',
    answer:
      'Ja. Al onze mangohouten producten hebben een voedselveilige olieafwerking en bevatten roestvrijstalen inzetstukken voor direct contact met voer en water. Het hout zelf houdt alleen het inzetstuk vast. Het komt nooit in contact met het eten van je huisdier.',
  },
  {
    question: 'Kan ik de hoezen van de hondenmanden wassen?',
    answer:
      'Ja. De hoezen van onze Sambo hondenmand, pluche donut manden en het loungebed zijn allemaal afneembaar en machinewasbaar. We raden een wasje op 30°C met een fijn programma aan.',
  },
  {
    question: 'Wat als een product beschadigd aankomt, of ik wil retourneren?',
    answer:
      'Mail ons op lifegoods.daily@gmail.com met je bestelnummer en foto\'s van het product. Je hebt bovendien 14 dagen bedenktijd om een bestelling zonder opgaaf van reden te retourneren, zoals bij elke online aankoop in Nederland.',
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
