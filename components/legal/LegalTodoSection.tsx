import { AlertTriangle } from 'lucide-react'

interface LegalTodoSectionProps {
  heading: string
  /** Bullet points describing what this section needs to cover - not the actual legal text. */
  todoPoints: string[]
}

/**
 * Unmistakable TODO block for a legal section that still needs real text,
 * on purpose - do not soften this styling to "look nicer" before real
 * content replaces it.
 */
export function LegalTodoSection({ heading, todoPoints }: LegalTodoSectionProps) {
  return (
    <section className="border border-dashed border-amber-300 rounded-xl p-5 bg-amber-50/40">
      <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-3">{heading}</h2>
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-2">
        TODO - dekt nog te schrijven tekst voor:
      </p>
      <ul className="list-disc pl-5 space-y-1 text-sm text-[#6B7280]">
        {todoPoints.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </section>
  )
}

/** The "this page isn't finished yet" banner that used to live in LegalPageShell itself. */
export function LegalTodoBanner() {
  return (
    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-10">
      <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
      <p className="text-sm text-amber-800 leading-relaxed">
        Deze pagina bevat nog geen definitieve juridische tekst - alleen de structuur. Vul elke sectie
        hieronder in voordat deze pagina live gaat.
      </p>
    </div>
  )
}
