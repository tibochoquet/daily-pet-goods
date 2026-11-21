import { Truck, Clock, RotateCcw, ShieldCheck } from 'lucide-react'

/**
 * De vertrouwensbalk onder de actiekaarten.
 *
 * Vier beloftes die allemaal elders op de site al staan en daar
 * waargemaakt worden: /verzending, de algemene voorwaarden, /retourneren
 * en de betaalmethodes bij het afrekenen. Er staat hier dus met opzet
 * niets nieuws - een actiepagina is precies de plek waar de verleiding
 * groot is om er een belofte bij te verzinnen.
 *
 * In de normale huisstijl en niet in rood: iconen in het groen, tekst
 * grijs. Het rood is in dit blok op: hero, kaarten en prijzen hebben het
 * al, en een vierde rood vlak maakt van de pagina een poster.
 */
const beloftes = [
  { icon: Truck, tekst: 'Gratis verzending in NL & BE' },
  { icon: Clock, tekst: 'Op werkdagen voor 15:00 besteld, dezelfde dag verzonden' },
  { icon: RotateCcw, tekst: '14 dagen bedenktijd' },
  { icon: ShieldCheck, tekst: 'Veilig betalen met iDEAL, Klarna en meer' },
]

export default function SaleTrust() {
  return (
    <section className="border-y border-[#E8E2D9] bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <ul className="grid grid-cols-1 gap-x-8 gap-y-4 py-7 sm:grid-cols-2 lg:grid-cols-4">
          {beloftes.map(({ icon: Icon, tekst }) => (
            <li key={tekst} className="flex items-start gap-2.5 text-sm leading-snug text-[#4B5563]">
              <Icon size={15} className="mt-0.5 shrink-0 text-[#2C4A3E]" />
              {tekst}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
