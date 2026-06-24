'use client'

import { useState } from 'react'
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

  return (
    <section className="py-16 md:py-24 bg-[#F3EDE3]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-12 h-12 bg-[#2C4A3E]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mail size={22} className="text-[#2C4A3E]" />
        </div>

        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
          Be the first to know
        </h2>
        <p className="text-[#6B7280] leading-relaxed mb-8">
          New products, seasonal picks, and practical pet care tips — straight to your inbox. No spam, ever. Unsubscribe any time.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-3 bg-[#2C4A3E]/10 text-[#2C4A3E] rounded-2xl py-5 px-6">
            <CheckCircle2 size={20} />
            <span className="font-medium">You&apos;re in! We&apos;ll be in touch soon.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-white border border-[#E8E2D9] rounded-full px-5 py-3.5 text-sm text-[#1A1A1A] placeholder:text-[#B0A898] focus:outline-none focus:border-[#2C4A3E] focus:ring-2 focus:ring-[#2C4A3E]/10 transition-all"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-[#2C4A3E] text-white font-semibold px-5 py-3.5 rounded-full hover:bg-[#3D6456] transition-colors text-sm shrink-0"
            >
              Subscribe
              <ArrowRight size={14} />
            </button>
          </form>
        )}

        <p className="text-xs text-[#B0A898] mt-4">
          By subscribing you agree to our Privacy Policy. Unsubscribe any time.
        </p>
      </div>
    </section>
  )
}
