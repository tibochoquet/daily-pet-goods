import type { Metadata } from 'next'
import { Mail, MessageCircle, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Got a question about a product, your order, or anything else? We\'d love to hear from you. Get in touch with the Daily Pet Goods team.',
  alternates: { canonical: 'https://www.dailypetgoods.nl/contact' },
}

export default function ContactPage() {
  return (
    <>
      <section className="bg-[#F3EDE3] py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-[#C8745A] uppercase tracking-wider mb-4">Get in touch</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
            We&apos;d love to hear from you
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed">
            Questions about a product, sizing advice, or anything else — just send us a message.
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
                <h3 className="font-semibold text-[#1A1A1A] mb-1">Email us</h3>
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
                <h3 className="font-semibold text-[#1A1A1A] mb-1">Response time</h3>
                <p className="text-sm text-[#6B7280]">We typically reply within 24 hours on business days.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#E8E2D9]">
                <div className="w-10 h-10 bg-[#2C4A3E]/10 rounded-xl flex items-center justify-center mb-3">
                  <MessageCircle size={18} className="text-[#2C4A3E]" />
                </div>
                <h3 className="font-semibold text-[#1A1A1A] mb-1">Order issues</h3>
                <p className="text-sm text-[#6B7280]">
                  For order questions, delivery, or returns — you can also contact Bol.com customer service directly.
                </p>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              <form className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E2D9] space-y-5">
                <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-2">Send us a message</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                      First name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Emma"
                      className="w-full bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#B0A898] focus:outline-none focus:border-[#2C4A3E] focus:ring-2 focus:ring-[#2C4A3E]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                      Last name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="de Vries"
                      className="w-full bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#B0A898] focus:outline-none focus:border-[#2C4A3E] focus:ring-2 focus:ring-[#2C4A3E]/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="emma@example.nl"
                    className="w-full bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#B0A898] focus:outline-none focus:border-[#2C4A3E] focus:ring-2 focus:ring-[#2C4A3E]/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                    Subject
                  </label>
                  <select
                    name="subject"
                    className="w-full bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#2C4A3E] focus:ring-2 focus:ring-[#2C4A3E]/10 transition-all"
                  >
                    <option value="">Select a topic...</option>
                    <option value="product">Product question</option>
                    <option value="sizing">Sizing advice</option>
                    <option value="order">Order / delivery</option>
                    <option value="return">Return or exchange</option>
                    <option value="wholesale">Wholesale enquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full bg-[#FAFAF7] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#B0A898] focus:outline-none focus:border-[#2C4A3E] focus:ring-2 focus:ring-[#2C4A3E]/10 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2C4A3E] text-white font-semibold py-3.5 rounded-xl hover:bg-[#3D6456] transition-colors text-sm"
                >
                  Send message
                </button>

                <p className="text-xs text-[#B0A898] text-center">
                  We&apos;ll get back to you within 24 hours on business days.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
