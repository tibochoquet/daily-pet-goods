import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export default function ConfirmationPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 bg-[#F0F7F4] rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={32} className="text-[#2C4A3E]" />
      </div>

      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-3">
        Order placed!
      </h1>
      <p className="text-[#6B7280] leading-relaxed mb-2">
        Thank you for your order. We&rsquo;ll process it shortly and send you a confirmation.
      </p>
      <p className="text-[#6B7280] leading-relaxed mb-10">
        Questions? Email us at{' '}
        <a href="mailto:hello@dailypetgoods.nl" className="text-[#2C4A3E] hover:underline">
          hello@dailypetgoods.nl
        </a>
      </p>

      <Link
        href="/shop"
        className="inline-flex items-center gap-2 bg-[#2C4A3E] text-white font-medium px-6 py-3 rounded-full hover:bg-[#3D6456] transition-colors"
      >
        Continue shopping
      </Link>
    </div>
  )
}
