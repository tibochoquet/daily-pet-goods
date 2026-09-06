import { business } from '@/lib/business'

interface LegalPageShellProps {
  title: string
  lastUpdated: string
  intro?: string
  children: React.ReactNode
}

/**
 * Shared chrome for legal pages: title, last-updated line, prose-styled
 * content area, and the business identity block every legal page must
 * carry. Section content is authored directly in each page.tsx as real
 * markup (children), not generated from a generic data shape - these are
 * one-off documents, not repeating structured data.
 */
export default function LegalPageShell({ title, lastUpdated, intro, children }: LegalPageShellProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-3">{title}</h1>
      <p className="text-sm text-[#6B7280] mb-10">Laatst bijgewerkt: {lastUpdated}</p>

      {intro && <p className="text-[#4B5563] leading-relaxed text-sm mb-8">{intro}</p>}

      <div
        className="space-y-8 text-sm text-[#4B5563] leading-relaxed
          [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[#1A1A1A] [&_h2]:mb-3
          [&_p]:mb-3 [&_p:last-child]:mb-0
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:mb-3
          [&_a]:text-[#2C4A3E] [&_a]:hover:underline"
      >
        {children}
      </div>

      {/* Live business identity, read from lib/business.ts - never retype
          these values into the legal text itself, reference this instead.
          City only, not the full street address - the full address (as
          required for the trader-identity disclosure) lives in the "Wie we
          zijn" prose on /algemene-voorwaarden and /privacy instead. */}
      <div className="mt-10 pt-6 border-t border-[#E8E2D9] text-xs text-[#9CA3AF] leading-relaxed">
        {business.brandName} is een handelsnaam van {business.tradingName}
        <br />
        {business.address.city}
        <br />
        KVK {business.kvkNumber} · BTW {business.btwNumber}
      </div>
    </div>
  )
}
