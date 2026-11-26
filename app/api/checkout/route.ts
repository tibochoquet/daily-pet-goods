import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { randomBytes } from 'crypto'
import { getStripe } from '@/lib/stripe'
import { getVariantById } from '@/lib/products'
import { calculateDiscount } from '@/lib/discounts'
import { calculateSaleDiscount } from '@/lib/saleCart'
import { isSaleActive, sale } from '@/config/sale'
import { isPreorder, preorderLabel, preorderZin } from '@/lib/preorder'
import { business, PUBLIC_BASE_URL, SITE_URL } from '@/lib/business'

/**
 * Creates a Stripe Checkout Session for a one-time order and returns its
 * URL. The client only ever sends variant ids + quantities - prices are
 * always resolved server-side from lib/products.ts, never trusted from
 * the request body. This is what stops someone from tampering with the
 * price in devtools before checking out.
 *
 * The same rule applies to discounts: the client sends only a code, and
 * the amount is recomputed here from the authoritative cart (see
 * lib/discounts.ts) right before the session is created - never taken
 * from whatever /api/discount/validate returned earlier.
 */

interface CheckoutItem {
  id: string
  quantity: number
}

const MAX_QUANTITY_PER_ITEM = 20

/**
 * Wat de klant leest als de winkel zelf niet kan afrekenen.
 *
 * Bewust zonder "probeer het later opnieuw": bij een ontbrekende of
 * ingetrokken sleutel levert opnieuw proberen exact hetzelfde op, en dan
 * is dat advies een omweg naar dezelfde muur. Mailen helpt wel.
 */
const BETAALINSTELLING_KAPOT =
  'Afrekenen lukt nu niet door een instelling aan onze kant. Mail ons, dan regelen we je bestelling met de hand.'

/**
 * De niet-geheime labels van een Stripe-fout: type, code, param, status.
 *
 * Die vier komen uit Stripe's eigen foutmodel en bevatten geen sleutel
 * en geen accountgegevens. De melding zelf kan dat wel, dus die blijft
 * in de serverlog en gaat niet mee in het antwoord.
 *
 * Zonder deze labels is een storing hier alleen in de logs van de
 * hosting te zien, en is "Kon checkout niet starten" een doodlopend
 * spoor: precies de situatie waarin de bestelknop stil stuk kan staan
 * zonder dat iemand ziet waarom.
 *
 * Bewust op vorm getoetst en niet met `instanceof`: zijn er twee kopieën
 * van de stripe-module geladen, dan klopt de klasse-identiteit niet meer
 * en zou juist de fout die we willen zien eruit vallen.
 */
function stripeFoutLabels(err: unknown) {
  if (typeof err !== 'object' || err === null) return null
  const e = err as { type?: unknown; code?: unknown; param?: unknown; statusCode?: unknown }
  if (typeof e.type !== 'string' || !e.type.startsWith('Stripe')) return null
  return {
    type: e.type,
    code: typeof e.code === 'string' ? e.code : null,
    param: typeof e.param === 'string' ? e.param : null,
    status: typeof e.statusCode === 'number' ? e.statusCode : null,
  }
}

export async function POST(req: NextRequest) {
  let body: { items?: CheckoutItem[]; discountCode?: unknown; saleShown?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Ongeldige JSON' }, { status: 400 })
  }

  const items = body.items
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Winkelwagen is leeg' }, { status: 400 })
  }

  /**
   * Eén klok voor dit hele verzoek: de actie, de pre-orders en alles wat
   * daarop volgt kijken naar hetzelfde moment. Twee keer `new Date()` in
   * één afrekening kan rond middernacht twee verschillende antwoorden
   * geven, en dan rekent de ene regel iets anders dan de andere.
   */
  const nu = new Date()

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []
  /**
   * De verzenddata van de pre-orders in deze bestelling. De laatste
   * bepaalt wat er op de betaalpagina staat: we sturen een bestelling in
   * één keer, dus hij gaat weg zodra het traagste artikel binnen is.
   */
  const preorderDatums: string[] = []

  for (const item of items) {
    if (typeof item?.id !== 'string' || typeof item?.quantity !== 'number') {
      return NextResponse.json({ error: 'Ongeldig item in winkelwagen' }, { status: 400 })
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_QUANTITY_PER_ITEM) {
      return NextResponse.json({ error: `Ongeldig aantal voor product ${item.id}` }, { status: 400 })
    }

    const found = getVariantById(item.id)
    if (!found) {
      return NextResponse.json({ error: `Product niet gevonden: ${item.id}` }, { status: 400 })
    }
    const { product, variant } = found

    // Mirror the client-side check in ProductDetailClient - a disabled
    // button only stops the normal UI path, not a direct POST here.
    if (!(variant.inStock ?? true)) {
      return NextResponse.json({ error: `Niet op voorraad: ${product.name} - ${variant.label}` }, { status: 409 })
    }

    // Een variant zonder prijs is nog niet te koop. De knop op de
    // productpagina staat al uit, maar net als hierboven geldt: dat
    // houdt alleen de gewone route tegen, niet een directe POST.
    if (variant.price === null) {
      return NextResponse.json(
        { error: `Nog niet te bestellen: ${product.name} - ${variant.label}` },
        { status: 409 }
      )
    }

    // Een pre-order krijgt de verzenddatum als regeltekst mee. Die staat
    // dan op de betaalpagina én op de bon van Stripe, naast precies het
    // artikel waar hij over gaat.
    const preorder = isPreorder(product, nu) ? product.shipsFrom : undefined
    if (preorder) preorderDatums.push(preorder)

    line_items.push({
      quantity: item.quantity,
      price_data: {
        currency: 'eur',
        unit_amount: Math.round(variant.price * 100),
        product_data: {
          name: `${product.name} - ${variant.label}`,
          ...(preorder ? { description: preorderZin(preorder) } : {}),
          images: [new URL(variant.image, SITE_URL).toString()],
          metadata: { variantId: variant.id, productSlug: product.slug },
        },
      },
    })
  }

  // De laatste datum van de bestelling, of null als er niets op wacht.
  const preorderDatum =
    preorderDatums.length > 0
      ? preorderDatums.reduce((a, b) => (new Date(a).getTime() >= new Date(b).getTime() ? a : b))
      : null

  // Random suffix (not just the timestamp) so an order number can't be
  // guessed from roughly when someone ordered - it's now a real lookup
  // key via /mijn-bestelling, paired with the customer's email as a
  // second factor.
  const orderRef = `DPG-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString('hex').toUpperCase()}`

  const cartLines = items.map((i) => ({ id: i.id, quantity: i.quantity }))

  /**
   * De actiekorting, berekend uit de serverklok.
   *
   * Dit is het punt waarop de actie echt afloopt. Een pagina die nog in
   * de cache van een CDN zit of in een tabblad openstaat sinds voor de
   * einddatum, kan hier niets aan veranderen: de klant stuurt alleen
   * variant-id's en aantallen, en of er korting is wordt hier opnieuw
   * bepaald. Na `endsAt` geeft dit null en wordt er dus tegen de normale
   * prijs afgerekend, hoe de pagina er bij de klant ook uitzag.
   */
  const saleActiveNow = isSaleActive(nu)
  const saleDiscount = calculateSaleDiscount(cartLines, nu)

  /**
   * De winkelwagenpagina stuurt mee wat zij aan de klant heeft getoond.
   * Wijkt dat af van wat hier geldt, dan stond die pagina open over het
   * begin of het eind van de actie heen, of kwam hij uit een cache.
   *
   * Doorgaan zou betekenen dat Stripe een ander bedrag int dan er op het
   * scherm stond. Dus niet doorgaan: dit is de enige plek waar dat nog
   * te zien is, want de klant verlaat de site hierna naar Stripe. Wie
   * zonder dit veld post (een oude tab met oude javascript) krijgt
   * gewoon de prijs van nu - de korting hierboven is dan al naar de
   * serverklok bepaald.
   */
  if (typeof body.saleShown === 'boolean' && body.saleShown !== saleActiveNow) {
    return NextResponse.json(
      {
        error: saleActiveNow
          ? `De ${sale.campaign}-actie is net begonnen. Herlaad de pagina voor de nieuwe prijzen.`
          : `De ${sale.campaign}-actie is net afgelopen. Herlaad de pagina voor de actuele prijzen.`,
      },
      { status: 409 }
    )
  }

  // Re-derive the discount from the cart we just validated above. If the
  // code no longer applies (e.g. the only jacket was removed after the
  // code was entered) checkout continues at full price rather than
  // failing - the summary the customer saw is re-rendered from the same
  // rule, so this can only ever mean "no discount", never a surprise one.
  //
  // Tijdens de actie wordt een code niet eens bekeken. Stripe accepteert
  // één coupon per sessie, dus stapelen zou betekenen dat we twee
  // kortingen tot één bedrag samenvoegen en zo meer weggeven dan de
  // actie belooft. De actie is bovendien altijd minstens zo gunstig als
  // de enige bestaande code: 10% op alles tegen 10% op alleen jassen.
  const discountCodeInput =
    !saleDiscount && typeof body.discountCode === 'string' ? body.discountCode : ''
  const discountResult = discountCodeInput ? calculateDiscount(discountCodeInput, cartLines) : null
  const codeDiscount = discountResult?.ok ? discountResult.discount : null

  // Eén vorm voor beide soorten korting, zodat er hieronder maar één pad
  // naar Stripe loopt.
  const discount = saleDiscount
    ? { code: saleDiscount.code, name: saleDiscount.label, amountOff: saleDiscount.amountOff }
    : codeDiscount
      ? { code: codeDiscount.code, name: `Korting (${codeDiscount.code})`, amountOff: codeDiscount.amountOff }
      : null

  // Zonder sleutel valt er niets aan te maken. Apart afvangen en niet in
  // de catch hieronder laten belanden: dit is geen storing bij Stripe
  // maar een instelling die in deze omgeving ontbreekt, en dat verschil
  // bepaalt waar je moet gaan kijken. Voor de klant is het ook geen
  // "probeer het opnieuw" - opnieuw proberen helpt hier niets.
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Checkout: STRIPE_SECRET_KEY ontbreekt in deze omgeving.')
    return NextResponse.json(
      { error: BETAALINSTELLING_KAPOT, reden: 'stripe_key_ontbreekt' },
      { status: 503 }
    )
  }

  try {
    const stripe = getStripe()

    // Stripe can only restrict a coupon to specific products via stored
    // Product objects, and this shop uses inline price_data (no stored
    // products). So the eligible-items-only rule is enforced here and
    // handed to Stripe as an already-computed fixed amount. Doing it as a
    // coupon rather than by discounting the line items keeps the discount
    // visible as its own line on the payment page, the receipt and in
    // amount_total - which the confirmation email and refunds rely on.
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined
    if (discount) {
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(discount.amountOff * 100),
        currency: 'eur',
        duration: 'once',
        name: discount.name,
        max_redemptions: 1,
        // This coupon is created for this one checkout only. Expiring it
        // keeps the Stripe account from filling up with dead one-off
        // coupons; abandoned checkouts simply lapse.
        redeem_by: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      })
      discounts = [{ coupon: coupon.id }]
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'eur',
      locale: 'nl',
      line_items,
      // Checkout Sessions don't have an `automatic_payment_methods` param
      // (that's a PaymentIntents-only field) - omitting `payment_method_types`
      // entirely gets the same effect: Stripe shows every payment method
      // you've enabled for this currency/country in the Dashboard (iDEAL,
      // cards, ...) without listing them here by hand.
      // Alleen NL en BE, net als wat /verzending en de algemene
      // voorwaarden beloven. Dit staat hier één keer - de handoff-notitie
      // zette hem er een tweede keer bij en dat zou de eerste stil
      // overschrijven.
      shipping_address_collection: { allowed_countries: ['NL', 'BE'] },
      // Geruststelling op het moment van betalen. Max. 1200 tekens per
      // bericht; deze teksten moeten dezelfde belofte doen als de site,
      // dus pas ze samen met /verzending aan.
      custom_text: {
        submit: {
          // Zit er een pre-order in, dan is "dezelfde dag verzonden" hier
          // niet waar. Dit is het laatste scherm voor de betaling, dus
          // staat er wat er wél gebeurt.
          message: preorderDatum
            ? `Pre-order: we verzenden je bestelling in één keer, vanaf ${preorderLabel(preorderDatum)} · gratis verzending · 14 dagen bedenktijd`
            : 'Gratis verzending · op werkdagen voor 15:00 besteld, dezelfde dag verzonden · 14 dagen bedenktijd',
        },
        shipping_address: { message: 'We verzenden met DHL of DPD naar Nederland en België.' },
      },
      // Huisstijl van de betaalpagina. Dezelfde waarden kun je ook één
      // keer in Dashboard -> Instellingen -> Branding zetten; dan gelden
      // ze ook voor Stripe's eigen mails en bonnen. Per sessie meegeven
      // heeft voorrang op het Dashboard.
      //
      // Logo of icoon, niet beide: Stripe weigert een sessie waarin ze
      // samen staan. Het logo is wat bovenaan de betaalpagina komt; het
      // icoon (public/stripe/stripe-icon.png) is voor het Dashboard.
      branding_settings: {
        display_name: business.brandName,
        background_color: '#F3EDE3',
        button_color: '#2C4A3E',
        font_family: 'inter',
        border_style: 'rounded',
        logo: { type: 'url', url: `${PUBLIC_BASE_URL}/stripe/stripe-logo.png` },
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: 'Verzending',
            // Vast tarief van €0 - in lijn met de "Gratis verzending"
            // die overal op de site staat. Wijzig dit bedrag hier als
            // dat ooit verandert.
            fixed_amount: { amount: 0, currency: 'eur' },
          },
        },
      ],
      // Geen automatic_tax hier: Daily Lifegoods heeft een BTW-id
      // (NL004426224B17) en rekent gewoon btw - maar de weergegeven
      // prijzen zijn al btw-inclusief (verplicht bij consumentenprijzen),
      // dus er hoeft niets bovenop het bedrag berekend te worden. De
      // btw-component wordt puur informatief getoond (zie lib/business.ts
      // btwAmount() en de winkelwagenpagina), niet door Stripe Tax
      // berekend. Wil je Stripe Tax later wel gebruiken, zorg dan dat de
      // belastinginstellingen op "tax inclusive" staan, anders rekent
      // Stripe btw BOVENOP deze al-inclusieve prijzen.
      success_url: `${SITE_URL}/checkout/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/checkout/geannuleerd`,
      ...(discounts ? { discounts } : {}),
      // discountCode is stored on the order so you can filter in Stripe on
      // how many orders a code actually produced.
      metadata: {
        orderRef,
        ...(discount ? { discountCode: discount.code } : {}),
      },
    })

    if (!session.url) {
      console.error('Checkout: Stripe gaf geen session.url terug.', session.id)
      return NextResponse.json({ error: 'Kon checkout niet starten' }, { status: 502 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout: aanmaken van Stripe session mislukt:', err)
    const stripeFout = stripeFoutLabels(err)

    // Een authenticatiefout is geen storing die overwaait: de sleutel van
    // de winkel is ongeldig of ingetrokken - code `api_key_expired` als
    // hij in het dashboard vervangen is. Zelfde oorzaak en zelfde
    // oplossing als een ontbrekende sleutel, dus zelfde antwoord. En een
    // 503 in plaats van een 500, want dit is niet "het ging even mis"
    // maar "zo blijft het tot de sleutel vervangen is".
    if (stripeFout?.type === 'StripeAuthenticationError') {
      return NextResponse.json(
        { error: BETAALINSTELLING_KAPOT, reden: 'stripe_sleutel_ongeldig', stripe: stripeFout },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Kon checkout niet starten', ...(stripeFout ? { stripe: stripeFout } : {}) },
      { status: 500 }
    )
  }
}
