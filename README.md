This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Stripe Checkout testen

De webshop rekent af via [Stripe Checkout](https://stripe.com/docs/payments/checkout) (`app/api/checkout/route.ts`). Betalingen worden pas als definitief beschouwd via de webhook (`app/api/webhooks/stripe/route.ts`) - **nooit** op basis van het bereiken van de success-pagina alleen, want die kan ook zonder geslaagde betaling bereikt worden (bv. een teruggekeerde tab).

### 1. Env-variabelen

Kopieer `.env.example` naar `.env.local` en vul aan met je **test-mode** keys uit [dashboard.stripe.com](https://dashboard.stripe.com) (schakelaar "Test mode" linksonder):

- `STRIPE_SECRET_KEY` - Developers → API keys → Secret key
- `STRIPE_WEBHOOK_SECRET` - zie stap 2 hieronder
- `NEXT_PUBLIC_SITE_URL` - `http://localhost:3000` lokaal, `https://dailypetgoods.nl` in productie

### 2. Webhook lokaal doorsturen met de Stripe CLI

Installeer de [Stripe CLI](https://docs.stripe.com/stripe-cli) (bv. `brew install stripe/stripe-cli/stripe`), log in met `stripe login`, en laat 'm meeluisteren terwijl je lokaal draait:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Dit commando print een `whsec_...` - zet die in `.env.local` als `STRIPE_WEBHOOK_SECRET` en herstart `npm run dev`. Zolang `stripe listen` draait, stuurt Stripe elke test-event naar je lokale webhook door.

### 3. Een testbetaling doen

Start de dev server (`npm run dev`), leg een product in de winkelwagen en reken af. Je komt op de gehoste Stripe Checkout-pagina terecht.

**Testkaart** (lukt altijd):

```
Kaartnummer: 4242 4242 4242 4242
Vervaldatum: elke datum in de toekomst
CVC:         elke 3 cijfers
Postcode:    elke geldige postcode
```

**iDEAL in sandbox**: kies iDEAL als betaalmethode, selecteer een testbank uit de lijst, en de sandboxflow simuleert direct een geslaagde (of, als je "Failed" kiest, een mislukte) betaling - geen echte bank nodig.

> Zie je geen iDEAL als optie bij het afrekenen? Dat komt niet door de code - `/api/checkout` vraagt bewust geen vaste lijst betaalmethodes op, Stripe toont automatisch alles wat je in het Dashboard hebt ingeschakeld. Zet iDEAL aan via Dashboard → Settings → Payment methods.

Na een geslaagde testbetaling:
- je wordt doorgestuurd naar `/checkout/succes`
- in het terminalvenster waar `stripe listen` draait zie je het `checkout.session.completed`-event voorbijkomen
- in je `npm run dev`-terminal zie je (bij een geldige `RESEND_API_KEY`) de orderbevestiging verstuurd worden naar `lifegoods.daily@gmail.com`

Klik "Cancel" op de Checkout-pagina om de geannuleerd-pagina (`/checkout/geannuleerd`) te zien - er wordt dan niets afgeschreven.

### 4. Live gaan

Maak in [Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks) een endpoint aan dat naar `https://jouw-domein.nl/api/webhooks/stripe` wijst, met in elk geval de events `checkout.session.completed` en `payment_intent.payment_failed`. Het signing secret van dát endpoint - niet het `whsec_...` van `stripe listen` - wordt de productie-waarde van `STRIPE_WEBHOOK_SECRET`. Vergeet niet ook `STRIPE_SECRET_KEY` te vervangen door de live key zodra je echt geld wilt ontvangen.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
