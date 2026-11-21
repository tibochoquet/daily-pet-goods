import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, ShieldCheck, Truck, Clock, RotateCcw } from 'lucide-react'
import { brandImages } from '@/lib/images'
import { isSaleActive, sale, saleEndShort, saleTierLabel } from '@/config/sale'

/**
 * De hero heeft drie varianten naast elkaar - telefoon met foto, tablet
 * zonder foto, desktop met foto - omdat één foto niet op alle drie de
 * verhoudingen werkt.
 *
 * Tijdens de actie hoort de hele actie hier: de twee treden en de vier
 * beloftes staan in de hero zelf en niet als losse secties eronder.
 * Dezelfde foto's, dezelfde hoogtes, dezelfde gradients, dezelfde witte
 * knop - een actie is iets wat je erover legt, geen andere homepage.
 *
 * Op de telefoon en de tablet staat de uitleg in een groen vlak dat
 * tegen de foto aan zit, zonder tussenruimte. Op de desktop past hij in
 * de tekstkolom zelf en loopt de beloftebalk over de onderkant van de
 * foto. In alle drie de gevallen is het één blok, en dat is precies wat
 * het verschil was met de losse kaarten die hier eerst onder stonden.
 *
 * Het enige rood zijn de ronde percentage-stickers. Prijzen, de balk met
 * de klok en dit soort badges zijn de plekken waar het rood hoort; een
 * rode knop zou de huisstijlknop vervangen en dat is precies wat het
 * niet moet doen.
 *
 * De losse onderdelen hieronder worden door alle drie de blokken
 * gebruikt, met de opmaakklassen als parameter. Drie keer dezelfde tekst
 * uitschrijven zou betekenen dat een wijziging op één plek wordt
 * vergeten, en dan staat er op een tablet iets anders dan op een
 * telefoon.
 */

function Eyebrow({ saleActive }: { saleActive: boolean }) {
  if (saleActive) {
    // Dun en wit in plaats van de omrande pil: de kop eronder is kort,
    // dus een zware pil erboven zou het zwaartepunt verkeerd leggen.
    return (
      <p className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white sm:mb-8">
        <span className="h-px w-7 shrink-0 bg-white/50" aria-hidden />
        {sale.campaign} &middot; t/m {saleEndShort()}
      </p>
    )
  }
  return (
    <div className="inline-flex items-center gap-2 border border-white/25 text-white/80 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-6 sm:mb-8">
      <Sparkles size={12} className="text-[#C8745A]" />
      Zorgvuldig geselecteerd voor jouw huisdier
    </div>
  )
}

function Heading({ saleActive, className }: { saleActive: boolean; className: string }) {
  if (saleActive) {
    return <h1 className={className}>{sale.campaign}</h1>
  }
  return (
    <h1 className={className}>
      Dagelijkse essentials{' '}
      <em className="not-italic text-[#D4956B]">waar ze dol op zijn.</em>
    </h1>
  )
}

function Subline({ saleActive, className }: { saleActive: boolean; className: string }) {
  if (saleActive) {
    // Steviger wit dan de gewone subregel hieronder. Die is sfeer en mag
    // wegvallen tegen de foto; deze regel is de aanbieding zelf en staat
    // op een telefoon boven de lichte helft van het beeld. De kleur zit
    // op de spans en niet in `className`, zodat de gewone hero zijn
    // eigen white/70 houdt.
    return (
      <p className={className}>
        <span className="text-white/90">{sale.discountPercent}% korting op alles.</span>{' '}
        <span className="font-semibold text-white">
          {sale.tierDiscountPercent}% vanaf {saleTierLabel()}.
        </span>
      </p>
    )
  }
  return (
    <p className={className}>
      Premium, zorgvuldig geselecteerde producten voor honden en katten. Mooi in huis, praktisch elke dag.
    </p>
  )
}

/**
 * Dezelfde witte knop met en zonder actie. Dat is de huisstijlknop op
 * een foto; hem tijdens de actie rood maken zou betekenen dat het rood
 * de plek van de huisstijl inneemt in plaats van ernaast te staan.
 *
 * Eén knop en geen tweede tekstlink ernaast. Die verwees naar de uitleg
 * verderop de pagina, en die uitleg staat nu in de hero zelf.
 */
function Ctas({ saleActive }: { saleActive: boolean }) {
  return (
    <Link
      href="/shop"
      className="inline-flex items-center gap-2 bg-white text-[#2C4A3E] font-semibold px-6 sm:px-7 py-3.5 sm:py-4 rounded-full hover:bg-[#F3EDE3] transition-colors text-sm shadow-lg"
    >
      {saleActive ? `Shop ${sale.campaign}` : 'Bekijk alle producten'}
      <ArrowRight size={15} />
    </Link>
  )
}

/**
 * De kortingsstickers over de foto.
 *
 * Twee ronde percentage-badges, de tweede schuin en half over de eerste
 * heen geplakt, met een derde sticker voor de einddatum. Ze mogen groot
 * en midden in beeld - dat hoort bij een actie - maar ze blijven van de
 * hond en de kat af. Daarom staan ze op allebei de foto's in het lege
 * bovenstuk: op de desktopfoto de wand met lijsten rechtsboven, op de
 * telefoonfoto de kale muur erboven. De dieren zitten op allebei de
 * foto's in de onderste helft.
 *
 * Alleen op de twee blokken mét foto. Het tabletblok is een vlak groen
 * paneel en geen compositie; een sticker die daar in een hoek zweeft,
 * leest als een sticker die is blijven plakken.
 */
function Stickers({ compact = false }: { compact?: boolean }) {
  const een = compact ? 'h-16 w-16' : 'h-32 w-32'
  const eenGetal = compact ? 'text-lg' : 'text-4xl'
  const eenTekst = compact ? 'text-[7px]' : 'text-[10px]'
  const twee = compact ? 'h-14 w-14 -bottom-9 -left-7' : 'h-28 w-28 -bottom-18 -left-16'
  const tweeGetal = compact ? 'text-base' : 'text-3xl'
  const tweeTekst = compact ? 'text-[7px]' : 'text-[9px]'

  return (
    <div
      className={`absolute z-20 ${compact ? 'right-4 top-8' : 'right-12 top-28'}`}
      aria-hidden
    >
      <div
        className={`flex ${een} rotate-[-6deg] flex-col items-center justify-center rounded-full bg-bf-red text-center text-white shadow-xl ring-4 ring-white/20`}
      >
        <span className={`font-serif font-bold leading-none ${eenGetal}`}>
          {sale.discountPercent}%
        </span>
        <span className={`mt-1 font-semibold uppercase leading-none tracking-[0.12em] ${eenTekst}`}>
          op alles
        </span>
      </div>
      <div
        className={`absolute flex ${twee} rotate-[9deg] flex-col items-center justify-center rounded-full bg-bf-red text-center text-white shadow-xl ring-4 ring-white/20`}
      >
        <span className={`font-serif font-bold leading-none ${tweeGetal}`}>
          {sale.tierDiscountPercent}%
        </span>
        <span className={`mt-1 font-semibold uppercase leading-none tracking-[0.12em] ${tweeTekst}`}>
          vanaf {saleTierLabel()}
        </span>
      </div>
      {/* De datum is geen percentage, dus geen rood: wit met donkere
          letters. Twee rode vlakken plus een derde maken er een poster
          van, en op de telefoon is er ook domweg geen ruimte voor. */}
      {!compact && (
        <span className="absolute -left-24 -top-7 rotate-[-10deg] rounded-full bg-white px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1A1A1A] shadow-lg">
          t/m {saleEndShort()}
        </span>
      )}
    </div>
  )
}

/**
 * De twee treden van de actie.
 *
 * `op` bepaalt alleen de ondergrond: op de foto een donker glaspaneel,
 * zodat de tekst leesbaar blijft wat er onder de kolom ook voorbijkomt;
 * op het groene vlak niets, want een kaart in een vlak is een kaart te
 * veel. De tekst is in beide gevallen dezelfde.
 */
function Tiers({ op, className = '' }: { op: 'foto' | 'vlak'; className?: string }) {
  const paneel =
    op === 'foto' ? 'rounded-2xl border border-white/20 bg-black/40 backdrop-blur-sm' : ''
  const vak = op === 'foto' ? 'p-5' : 'py-4'

  return (
    <div className={`divide-y divide-white/15 ${paneel} ${className}`}>
      <div className={vak}>
        <h2 className="font-serif text-lg font-bold text-white sm:text-xl">
          {sale.discountPercent}% korting op alles
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-white/70">
          Op elk product in de winkel. De actieprijs staat er al bij, je hoeft geen kortingscode in
          te vullen.
        </p>
      </div>
      <div className={vak}>
        <h2 className="font-serif text-lg font-bold text-white sm:text-xl">
          {sale.tierDiscountPercent}% korting vanaf {saleTierLabel()}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-white/70">
          Vanaf {saleTierLabel()} in je winkelwagen wordt het {sale.tierDiscountPercent}% op je hele
          bestelling, in plaats van de {sale.discountPercent}%.
        </p>
      </div>
    </div>
  )
}

/**
 * Vier beloftes die allemaal elders op de site al staan en daar
 * waargemaakt worden: /verzending, de algemene voorwaarden, /retourneren
 * en de betaalmethodes bij het afrekenen. Er staat hier dus met opzet
 * niets nieuws - een actie is precies de plek waar de verleiding groot
 * is om er een belofte bij te verzinnen.
 */
const beloftes = [
  { icon: Truck, tekst: 'Gratis verzending in NL & BE' },
  { icon: Clock, tekst: 'Op werkdagen voor 15:00 besteld, dezelfde dag verzonden' },
  { icon: RotateCcw, tekst: '14 dagen bedenktijd' },
  { icon: ShieldCheck, tekst: 'Veilig betalen met iDEAL, Klarna en meer' },
]

function Beloftes({ kolommen, className = '' }: { kolommen: string; className?: string }) {
  return (
    <ul className={`grid gap-x-8 gap-y-2.5 ${kolommen} ${className}`}>
      {beloftes.map(({ icon: Icon, tekst }) => (
        <li
          key={tekst}
          className="flex items-start gap-2.5 text-[13px] leading-snug text-white/85"
        >
          <Icon size={14} className="mt-0.5 shrink-0 text-white/50" />
          {tekst}
        </li>
      ))}
    </ul>
  )
}

/** De twee korte beloftes in de gewone hero, buiten de actie om. */
function TrustBar() {
  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex items-center gap-2 text-white/55 text-sm">
        <Truck size={13} className="text-white/40" />
        Gratis verzending
      </div>
      <div className="flex items-center gap-2 text-white/55 text-sm">
        <ShieldCheck size={13} className="text-white/40" />
        Kwaliteit gegarandeerd
      </div>
    </div>
  )
}

export default function Hero() {
  const saleActive = isSaleActive()

  return (
    <section className="w-full">
      {/* Phone only (< sm): full-bleed photo hero, separate from the tablet
          block below - a photo this tall works on a phone's narrow-and-tall
          viewport but would crop badly across a wider tablet width. */}
      <div className="sm:hidden relative overflow-hidden min-h-[640px]">
        <Image
          src={brandImages.heroMobile}
          alt="Cavalier King Charles spaniël en Britse korthaar kat samen op een hondenmand"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={85}
        />
        <div className="relative z-10 px-5 py-14">
          {/* Smal gehouden zolang de stickers rechtsboven staan. Zonder
              actie staan die er niet en mag de kop de volle breedte
              pakken. */}
          <div className={saleActive ? 'max-w-[13.5rem]' : ''}>
            <Eyebrow saleActive={saleActive} />
            <Heading
              saleActive={saleActive}
              className="font-serif text-3xl font-bold text-white leading-[1.1] tracking-tight mb-4"
            />
          </div>
          <Subline saleActive={saleActive} className="text-base text-white/70 leading-relaxed mb-8" />
          <Ctas saleActive={saleActive} />
          {!saleActive && (
            <div className="mt-10">
              <TrustBar />
            </div>
          )}
        </div>
        {saleActive && <Stickers compact />}
      </div>

      {/* De uitleg op telefoonbreedte: een groen vlak dat tegen de foto
          aan zit. Dezelfde kleur als het tabletblok hieronder, zodat de
          hero op elke breedte één blok blijft. */}
      {saleActive && (
        <div className="sm:hidden bg-[#1F3329] px-5 py-7">
          <Tiers op="vlak" />
          <Beloftes kolommen="grid-cols-1" className="mt-6 border-t border-white/15 pt-6" />
        </div>
      )}

      {/* Tablet only (sm to lg): text-only block, no photo. Unchanged from
          before - the phone photo hero above is scoped to phone width only. */}
      <div className="hidden sm:block lg:hidden bg-[#1F3329] px-5 sm:px-8 py-16 sm:py-20">
        <Eyebrow saleActive={saleActive} />
        <Heading
          saleActive={saleActive}
          className="font-serif text-3xl sm:text-4xl font-bold text-white leading-[1.1] tracking-tight mb-4"
        />
        <Subline saleActive={saleActive} className="text-base text-white/70 leading-relaxed mb-8" />
        <Ctas saleActive={saleActive} />
        {saleActive ? (
          <>
            <Tiers op="vlak" className="mt-10 max-w-xl border-t border-white/15" />
            <Beloftes
              kolommen="grid-cols-2"
              className="mt-8 border-t border-white/15 pt-6"
            />
          </>
        ) : (
          <div className="mt-10">
            <TrustBar />
          </div>
        )}
      </div>

      {/* Desktop (lg+): full-bleed photo hero */}
      <div className="hidden lg:flex relative min-h-[88vh] items-center overflow-hidden">
        <Image
          src={brandImages.heroMain}
          alt="Golden retriever rustend op een premium grijs loungebed, grijze kat ernaast in een lichte moderne woonkamer"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />

        {/* Gradient: darkens left (text area / sofa / window), fades to transparent on right (pets) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
        {/* Subtle bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Content. Left side, over the darker area */}
        <div
          className={`relative z-10 w-full max-w-7xl mx-auto px-8 ${saleActive ? 'py-24' : 'py-32'}`}
        >
          <div className="max-w-lg">
            <Eyebrow saleActive={saleActive} />
            <Heading
              saleActive={saleActive}
              className="font-serif text-6xl xl:text-[4.25rem] font-bold text-white leading-[1.05] tracking-tight mb-6"
            />
            <Subline saleActive={saleActive} className="text-lg text-white/70 leading-relaxed mb-8" />
            {saleActive && <Tiers op="foto" className="mb-8" />}
            <Ctas saleActive={saleActive} />
            {!saleActive && (
              <div className="mt-12">
                <TrustBar />
              </div>
            )}
          </div>
        </div>

        {saleActive && <Stickers />}

        {/* De beloftebalk ligt over de onderrand van de foto in plaats van
            als eigen witte strook eronder. Matglas en niet doorzichtig:
            onder deze strook ligt het lichte vloerkleed, en witte tekst
            daarop is onleesbaar. */}
        {saleActive && (
          <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/15 bg-black/55 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-8">
              <Beloftes kolommen="grid-cols-4" className="py-4" />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
