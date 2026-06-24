'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: 'Where can I buy Daily Pet Goods products?',
    answer:
      'All our products are available on Bol.com, one of the largest and most trusted online retailers in the Netherlands and Belgium. Simply click the "Buy on Bol" button on any product page to go directly to the listing.',
  },
  {
    question: 'How fast will my order arrive?',
    answer:
      'Orders through Bol.com typically arrive the next business day for most addresses in the Netherlands. Delivery to Belgium usually takes 2–3 business days. Bol.com provides full order tracking so you can follow your package.',
  },
  {
    question: 'How do I choose the right size elevated feeder?',
    answer:
      'A good rule of thumb: small (M) for dogs up to 10 kg, large (L) for dogs 10–25 kg, and extra-large (XL) for dogs over 25 kg. The ideal bowl height should allow your dog to eat without straining their neck downward or stretching upward.',
  },
  {
    question: 'Are the mango wood bowls safe for food and water?',
    answer:
      'Yes. All our mango wood products use food-safe oil finishes and include stainless steel inserts for direct food and water contact. The wood itself only holds the insert — it never comes into contact with your pet\'s food.',
  },
  {
    question: 'Can I wash the dog bed covers?',
    answer:
      'Yes. The covers on our Sambo Dog Bed, Plush Donut Dog Beds, and Lounge Dog Bed are all removable and machine washable. We recommend washing at 30°C on a gentle cycle.',
  },
  {
    question: 'What if a product arrives damaged?',
    answer:
      'Bol.com has an excellent customer service and return policy. If your order arrives damaged or isn\'t as described, contact Bol.com directly or reach us at hello@dailypetgoods.nl and we\'ll make sure it\'s sorted quickly.',
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
            Common questions
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
