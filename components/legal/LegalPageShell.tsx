import { AlertTriangle } from 'lucide-react'

interface LegalSection {
  heading: string
  /** Bullet points describing what this section needs to cover - not the actual legal text. */
  todoPoints: string[]
}

interface LegalPageShellProps {
  title: string
  lastUpdated: string
  intro?: string
  sections: LegalSection[]
}

/**
 * Structure-only shell for legal pages. Every section renders as an
 * unmistakable TODO block, on purpose - the owner writes the real legal
 * text, this file must never be mistaken for finished copy. Do not soften
 * this styling to "look nicer" before real content replaces it.
 */
export default function LegalPageShell({ title, lastUpdated, intro, sections }: LegalPageShellProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-3">{title}</h1>
      <p className="text-sm text-[#6B7280] mb-6">Laatst bijgewerkt: {lastUpdated}</p>

      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-10">
        <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 leading-relaxed">
          Deze pagina bevat nog geen definitieve juridische tekst - alleen de structuur. Vul elke sectie
          hieronder in voordat deze pagina live gaat.
        </p>
      </div>

      {intro && <p className="text-[#4B5563] leading-relaxed text-sm mb-8">{intro}</p>}

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.heading} className="border border-dashed border-amber-300 rounded-xl p-5 bg-amber-50/40">
            <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-3">{section.heading}</h2>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-2">TODO - dekt nog te schrijven tekst voor:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-[#6B7280]">
              {section.todoPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
