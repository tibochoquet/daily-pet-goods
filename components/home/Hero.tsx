import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, ShieldCheck, Truck, Clock, RotateCcw, Check } from 'lucide-react'
import { brandImages } from '@/lib/images'
import { isSaleActive, sale, saleEndShort, saleTierLabel } from '@/config/sale'

/**
 * De hero heeft drie varianten naast elkaar - telefoon met foto, tablet
 * zonder foto, desktop met foto - omdat één foto niet op alle drie de
 * verhoudingen werkt.
 *
 * Tijdens de actie hoort de hele actie hier, op alle drie de breedtes:
 * de twee treden en de beloftes staan in de hero zelf en niet als losse
 * secties eronder. Op de telefoon lag de uitleg eerst in een groen vlak
 * onder de foto, en dat las alsnog als een tweede sectie. Nu ligt alles
 * op de foto: de tekst in het bovenstuk, de beloftebalk tegen de
 * onderrand - dezelfde opbouw als op de desktop.
 *
 * Wat er op de telefoon staat is een kwestie van ruimte, niet van smaak.
 * Boven de dieren is daar ongeveer 300px plek, en de volledige uitleg is
 * ruim twee keer zoveel. Daarom staat elke trede daar op één regel
 * (TiersKort) en blijven er drie korte beloftes over (BeloftesKort). De
 * volledige teksten staan op de tablet en de desktop, waar ze passen.
 *
 * Niets staat er twee keer. De balk bovenaan elke pagina
 * (components/layout/AnnouncementBar.tsx) noemt de campagne, beide
 * percentages en de resterende tijd al, en die balk staat vlak boven
 * deze hero. Een bovenregel "Black Friday · t/m 30 november" boven een
 * kop die "Black Friday" is, met daaronder nog een regel met diezelfde
 * twee percentages, is binnen één schermhoogte drie keer hetzelfde.
 * Tijdens de actie vervallen die bovenregel en die subregel daarom: de
 * kop, de uitleg bij de treden en de stickers zeggen samen alles één
 * keer.
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

/** De bovenregel buiten de actie om. Zie de toelichting hierboven. */
function Eyebrow() {
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

/** De subregel buiten de actie om. Zie de toelichting hierboven. */
function Subline({ className }: { className: string }) {
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
 * heen geplakt, met op de desktop een derde sticker voor de einddatum.
 * Ze mogen groot en midden in beeld - dat hoort bij een actie - maar ze
 * blijven van de hond en de kat af. Daarom staan ze op allebei de foto's
 * in het lege bovenstuk: op de desktopfoto de wand met lijsten
 * rechtsboven, op de telefoonfoto de kale muur erboven. De dieren zitten
 * op allebei de foto's in de onderste helft.
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
      className={`absolute z-20 ${compact ? 'right-4 top-4' : 'right-12 top-28'}`}
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
 * De twee treden van de actie, voluit.
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
 * Dezelfde twee treden op telefoonbreedte: één regel per trede.
 *
 * Dit staat op de foto, boven de dieren, en daar is plek voor ongeveer
 * vier regels tekst. De percentages en de drempel komen uit dezelfde
 * config als hierboven, dus die kunnen niet uiteen lopen; alleen de
 * toelichting is korter. Wat hier wegvalt (geen kortingscode nodig, de
 * uitleg dat de hoogste trede over de hele bestelling gaat) staat
 * voluit op /actievoorwaarden en in de winkelwagen.
 */
function TiersKort({ className = '' }: { className?: string }) {
  const regels = [
    {
      kop: `${sale.discountPercent}% korting op alles`,
      staart: 'de actieprijs staat er al bij.',
    },
    {
      kop: `${sale.tierDiscountPercent}% vanaf ${saleTierLabel()}`,
      staart: 'dan geldt dat op je hele bestelling.',
    },
  ]

  return (
    <ul className={`space-y-2 ${className}`}>
      {regels.map(({ kop, staart }) => (
        <li key={kop} className="flex gap-2 text-[13px] leading-snug text-white/75">
          <Check size={14} className="mt-0.5 shrink-0 text-white/50" />
          <span>
            <strong className="font-semibold text-white">{kop}</strong> &mdash; {staart}
          </span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Vier beloftes die allemaal elders op de site al staan en daar
 * waargemaakt worden: /verzending, de algemene voorwaarden, /retourneren
 * en de betaalmethodes bij het afrekenen. Er staat hier dus met opzet
 * niets nieuws - een actie is precies de plek waar de verleiding groot
 * is om er een belofte bij te verzinnen.
 *
 * `kort` is dezelfde belofte in twee of drie woorden, voor de balk op
 * telefoonbreedte. De verzendbelofte heeft er geen: "dezelfde dag
 * verzonden" zonder "op werkdagen voor 15:00" is op zaterdagmiddag
 * gewoon niet waar, en een belofte inkorten tot hij onwaar wordt is
 * erger dan hem daar niet tonen. Hij staat voluit op de tablet, de
 * desktop en op /verzending.
 */
const beloftes = [
  { icon: Truck, tekst: 'Gratis verzending in NL & BE', kort: 'Gratis verzending' },
  { icon: Clock, tekst: 'Op werkdagen voor 15:00 besteld, dezelfde dag verzonden', kort: null },
  { icon: RotateCcw, tekst: '14 dagen bedenktijd', kort: '14 dagen bedenktijd' },
  { icon: ShieldCheck, tekst: 'Veilig betalen met iDEAL, Klarna en meer', kort: 'Veilig betalen' },
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

/**
 * De beloftebalk op telefoonbreedte: drie korte labels tegen de onderrand
 * van de foto.
 *
 * Dezelfde plek en dezelfde matglazen ondergrond als op de desktop. Hij
 * ligt onder de dieren - die zitten op deze foto tussen 59% en 84% van
 * de hoogte - en dekt dus alleen het kleed af.
 */
function BeloftesKort() {
  const kort = beloftes.filter((b) => b.kort !== null)

  return (
    <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/15 bg-black/60 backdrop-blur-sm">
      <ul className="grid grid-cols-3 gap-2 px-4 py-3">
        {kort.map(({ icon: Icon, kort: label }) => (
          <li
            key={label}
            className="flex flex-col items-center gap-1 text-center text-[10px] font-medium leading-tight text-white/85"
          >
            <Icon size={13} className="shrink-0 text-white/55" />
            {label}
          </li>
        ))}
      </ul>
    </div>
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
        {/* Tijdens de actie staat er meer tekst op deze foto dan alleen een
            kop, en de muur erachter is licht. Een scrim over het bovenstuk
            houdt die tekst leesbaar; hij stopt voor de dieren. */}
        {saleActive && (
          <div className="absolute inset-x-0 top-0 h-[62%] bg-gradient-to-b from-black/60 via-black/30 to-transparent" />
        )}
        {/* Tijdens de actie begint de tekst lager: de stickers hangen
            rechtsboven tot ongeveer 120px, en de regels bij de treden
            lopen over de volle breedte. Onder de stickers beginnen is het
            enige wat die twee uit elkaar houdt zonder de tekst in een
            smalle kolom te persen. */}
        <div className={`relative z-10 px-5 ${saleActive ? 'pb-28 pt-32' : 'py-14'}`}>
          {!saleActive && <Eyebrow />}
          <Heading
            saleActive={saleActive}
            className="font-serif text-3xl font-bold text-white leading-[1.1] tracking-tight mb-4"
          />
          {saleActive ? (
            <TiersKort className="mb-8 mt-5" />
          ) : (
            <Subline className="text-base text-white/70 leading-relaxed mb-8" />
          )}
          <Ctas saleActive={saleActive} />
          {!saleActive && (
            <div className="mt-10">
              <TrustBar />
            </div>
          )}
        </div>
        {saleActive && <Stickers compact />}
        {saleActive && <BeloftesKort />}
      </div>

      {/* Tablet only (sm to lg): text-only block, no photo. Unchanged from
          before - the phone photo hero above is scoped to phone width only. */}
      <div className="hidden sm:block lg:hidden bg-[#1F3329] px-5 sm:px-8 py-16 sm:py-20">
        {!saleActive && <Eyebrow />}
        <Heading
          saleActive={saleActive}
          className={`font-serif text-3xl sm:text-4xl font-bold text-white leading-[1.1] tracking-tight ${saleActive ? 'mb-8' : 'mb-4'}`}
        />
        {saleActive ? (
          <>
            {/* Dezelfde volgorde als op de desktop: eerst waar de actie uit
                bestaat, dan de knop. */}
            <Tiers op="vlak" className="mb-8 max-w-xl border-t border-white/15" />
            <Ctas saleActive={saleActive} />
            <Beloftes kolommen="grid-cols-2" className="mt-10 border-t border-white/15 pt-6" />
          </>
        ) : (
          <>
            <Subline className="text-base text-white/70 leading-relaxed mb-8" />
            <Ctas saleActive={saleActive} />
            <div className="mt-10">
              <TrustBar />
            </div>
          </>
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
            {!saleActive && <Eyebrow />}
            <Heading
              saleActive={saleActive}
              className="font-serif text-6xl xl:text-[4.25rem] font-bold text-white leading-[1.05] tracking-tight mb-6"
            />
            {saleActive ? (
              <Tiers op="foto" className="mb-8" />
            ) : (
              <Subline className="text-lg text-white/70 leading-relaxed mb-8" />
            )}
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
