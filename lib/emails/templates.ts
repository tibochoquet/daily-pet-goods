import { brand, productThumb } from './brand';
import {
  addressBlock,
  button,
  dateLong,
  dateShort,
  esc,
  eur,
  eyebrow,
  h1,
  label,
  layout,
  link,
  note,
  orderSummary,
  p,
  progress,
  row,
  spacer,
  twoColumns,
  withParams,
} from './components';
import type { OrderEmailData, RenderedEmail, ReviewInviteData, ShipmentData } from './types';

const c = brand.color;
const f = brand.font;

const ORDER_REASON = 'Je ontvangt deze mail omdat je een bestelling plaatste op dailypetgoods.nl.';

function textAddress(o: OrderEmailData): string {
  const a = o.shippingAddress;
  return [a.name, a.line1, a.line2, `${a.postalCode} ${a.city}`, a.country === 'BE' ? 'België' : 'Nederland']
    .filter(Boolean)
    .join('\n');
}

function textItems(o: OrderEmailData): string {
  return o.items
    .map((i) => `- ${i.quantity}x ${i.name}${i.variant ? ` (${i.variant})` : ''}: ${eur(i.unitAmount * i.quantity)}`)
    .join('\n');
}

const textFooter = () =>
  `${brand.name} is een handelsnaam van ${brand.legalName}\n${brand.address}\nKVK ${brand.kvk} · btw-id ${brand.btw}`;

// ── 1. Bestelbevestiging (direct na betaling) ──────────────────────────────

export function orderConfirmationEmail(
  order: OrderEmailData,
  opts: { attachmentsIncluded?: boolean } = {},
): RenderedEmail {
  const attachments = opts.attachmentsIncluded ?? true;
  const subject = `Bedankt! Je bestelling ${order.orderNumber} is bevestigd`;
  const preheader = 'Op werkdagen voor 15:00 besteld, dezelfde dag verzonden. Hieronder staat alles op een rij.';

  const delivery = `${label('Levering')}<p style="margin:0;font-family:${f.sans};font-size:14px;line-height:22px;color:${c.ink};">${
    order.shippingCost === 0 ? 'Gratis verzending' : 'Verzending'
  } met ${brand.carriers}. Op werkdagen voor 15:00 besteld, dezelfde dag verzonden; daarna heb je je pakket meestal binnen 1 tot 3 werkdagen in huis.</p>`;

  const withdrawal = note(
    `${label('Je bedenktijd')}
<p style="margin:0;font-family:${f.sans};font-size:14px;line-height:22px;color:${c.body};">Je hebt 14 dagen bedenktijd vanaf de dag dat je je bestelling ontvangt. Herroepen kan zonder opgave van reden: mail ons of gebruik het modelformulier. De retourkosten zijn voor jou, tenzij er iets beschadigd of verkeerd is geleverd. Zodra we je retour (of een verzendbewijs) hebben, betalen we je binnen 14 dagen terug.</p>
<p style="margin:12px 0 0;font-family:${f.sans};font-size:14px;line-height:22px;">${link(brand.links.returns, 'Retourbeleid')}&nbsp;&nbsp;·&nbsp;&nbsp;${link(brand.links.withdrawalForm, 'Modelformulier')}&nbsp;&nbsp;·&nbsp;&nbsp;${link(brand.links.terms, 'Algemene voorwaarden')}</p>${
      attachments
        ? `<p style="margin:12px 0 0;font-family:${f.sans};font-size:13px;line-height:20px;color:${c.muted};">De algemene voorwaarden en het modelformulier zitten ook als pdf bij deze mail.</p>`
        : ''
    }`,
  );

  const rows = [
    row(
      `${eyebrow(`Bestelling ${esc(order.orderNumber)} · ${dateShort(order.placedAt)}`)}${h1(
        `Bedankt voor je bestelling, ${esc(order.firstName)}.`,
      )}${p(
        `We hebben je betaling ontvangen. Bestel je op een werkdag voor 15:00, dan pakken we alles zelf voor je in en gaat het diezelfde dag mee met ${brand.carriers}. Zodra je pakket onderweg is, krijg je van ons een mail met je track &amp; trace.`,
      )}`,
      '4px 48px 0',
    ),
    spacer(32),
    row(progress(1)),
    spacer(32),
    row(orderSummary(order)),
    spacer(28),
    row(twoColumns(addressBlock(order.shippingAddress), delivery)),
    spacer(28),
    row(withdrawal),
    spacer(28),
    row(
      p(
        `Vragen, of klopt er iets niet? Antwoord gewoon op deze mail, dan helpen we je zelf verder. Je bestelling vind je ook altijd terug via ${link(order.orderUrl, 'Mijn bestelling')}.`,
        { top: 0, size: 14 },
      ),
    ),
    spacer(40),
  ].join('\n');

  const html = layout({ title: subject, preheader, rows, footerReason: ORDER_REASON });

  const text = `Bedankt voor je bestelling, ${order.firstName}.

Bestelling ${order.orderNumber} · ${dateShort(order.placedAt)}

We hebben je betaling ontvangen. Bestel je op een werkdag voor 15:00, dan pakken we alles zelf voor je in en gaat het diezelfde dag mee met ${brand.carriers}. Zodra je pakket onderweg is, krijg je een mail met je track & trace.

JE BESTELLING
${textItems(order)}
Subtotaal: ${eur(order.subtotal)}${order.discount ? `\nKorting: -${eur(order.discount)}` : ''}
Verzending: ${order.shippingCost === 0 ? 'Gratis' : eur(order.shippingCost)}
Totaal: ${eur(order.total)}${order.vatAmount ? `\nWaarvan btw: ${eur(order.vatAmount)}` : ''}${order.paymentMethod ? `\nBetaald met ${order.paymentMethod}` : ''}

BEZORGADRES
${textAddress(order)}

JE BEDENKTIJD
Je hebt 14 dagen bedenktijd vanaf de dag dat je je bestelling ontvangt. Herroepen kan zonder opgave van reden: mail ons of gebruik het modelformulier. De retourkosten zijn voor jou, tenzij er iets beschadigd of verkeerd is geleverd. Zodra we je retour (of een verzendbewijs) hebben, betalen we je binnen 14 dagen terug.
Retourbeleid: ${brand.links.returns}
Modelformulier: ${brand.links.withdrawalForm}
Algemene voorwaarden: ${brand.links.terms}${attachments ? '\n(De algemene voorwaarden en het modelformulier zitten ook als pdf bij deze mail.)' : ''}

Vragen? Antwoord gewoon op deze mail.
Mijn bestelling: ${order.orderUrl}

--
${textFooter()}`;

  return { subject, preheader, html, text };
}

// ── 2. Verzendbevestiging (zodra de vervoerder het pakket heeft) ───────────

export function shippingConfirmationEmail(order: OrderEmailData, shipment: ShipmentData): RenderedEmail {
  const when = shipment.expectedDelivery ? dateLong(shipment.expectedDelivery) : null;
  const subject = `Je pakket is onderweg (${order.orderNumber})`;
  const preheader = when
    ? `Volg je pakket via ${shipment.carrier}. Verwachte bezorging: ${when}.`
    : `Volg je pakket via ${shipment.carrier}.`;



  const rows = [
    row(
      `${eyebrow(`Bestelling ${esc(order.orderNumber)}`)}${h1('Je pakket is onderweg.')}${p(
        `Goed nieuws, ${esc(order.firstName)}: je bestelling is ingepakt en meegegeven aan ${esc(shipment.carrier)}.${
          when ? ` Naar verwachting wordt hij <strong style="color:${c.ink};font-weight:600;">${when}</strong> bezorgd.` : ''
        }`,
      )}`,
      '4px 48px 0',
    ),
    spacer(28),
    row(
      `${button(shipment.trackingUrl, 'Volg je pakket')}<p style="margin:12px 0 0;font-family:${f.sans};font-size:13px;line-height:20px;color:${c.muted};">${esc(
        shipment.carrier,
      )} · track &amp; trace ${esc(shipment.trackingNumber)}</p>`,
    ),
    spacer(36),
    row(progress(2)),
    spacer(32),
    row(`${label('In dit pakket')}${orderSummary(order, { compact: true })}`),
    spacer(28),
    spacer(28),
    row(
      p('Komt er iets beschadigd aan? Maak even een foto en antwoord op deze mail, dan lossen we het snel op.', {
        top: 0,
        size: 14,
      }),
    ),
    spacer(40),
  ].join('\n');

  const html = layout({ title: subject, preheader, rows, footerReason: ORDER_REASON });

  const text = `Je pakket is onderweg.

Goed nieuws, ${order.firstName}: je bestelling ${order.orderNumber} is ingepakt en meegegeven aan ${shipment.carrier}.${
    when ? ` Naar verwachting wordt hij ${when} bezorgd.` : ''
  }

Volg je pakket: ${shipment.trackingUrl}
${shipment.carrier} · track & trace ${shipment.trackingNumber}

IN DIT PAKKET
${order.items.map((i) => `- ${i.quantity}x ${i.name}${i.variant ? ` (${i.variant})` : ''}`).join('\n')}

Komt er iets beschadigd aan? Maak even een foto en antwoord op deze mail, dan lossen we het snel op.

--
${textFooter()}`;

  return { subject, preheader, html, text };
}

// ── 3. Reviewverzoek (5 dagen na bezorging) ────────────────────────────────

export function reviewRequestEmail(order: OrderEmailData, invite: ReviewInviteData): RenderedEmail {
  const [main, ...others] = order.items;
  const subject = `Hoe bevalt je nieuwe ${main.name}?`;
  const preheader = 'Eén minuutje? Andere baasjes hebben echt wat aan jouw ervaring.';

  const reviewLink = (slug: string | null | undefined, rating?: number) =>
    withParams(invite.reviewUrl, { product: slug ?? undefined, rating });

  const stars = [1, 2, 3, 4, 5]
    .map(
      (n) =>
        `<a href="${esc(reviewLink(main.slug, n))}" title="${n} van 5" style="display:inline-block;padding:0 4px;font-family:Arial,sans-serif;font-size:38px;line-height:44px;color:${c.terracotta};text-decoration:none;">&#9733;</a>`,
    )
    .join('');

  const productCard = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;background-color:${c.card};border:1px solid ${c.line};border-radius:12px;">
<tr><td align="center" style="padding:28px 24px 26px;">
${main.imageUrl ? `<img src="${esc(productThumb(main.imageUrl, 256))}" width="112" height="112" alt="" style="display:block;width:112px;height:112px;border-radius:10px;border:1px solid ${c.line};margin:0 auto;object-fit:cover;">` : ''}
<p style="margin:14px 0 0;font-family:${f.sans};font-size:15px;line-height:22px;font-weight:600;color:${c.ink};">${esc(main.name)}${
    main.variant ? `<span style="font-weight:400;color:${c.muted};"> · ${esc(main.variant)}</span>` : ''
  }</p>
<div class="stars" style="margin:14px 0 0;">${stars}</div>
<p style="margin:6px 0 0;font-family:${f.sans};font-size:13px;line-height:20px;color:${c.muted};">Tik op een ster om je review te schrijven</p>
</td></tr></table>`;

  const more = others.length
    ? `<p style="margin:18px 0 0;font-family:${f.sans};font-size:14px;line-height:22px;color:${c.body};">Ook beoordelen: ${others
        .map((i) => link(reviewLink(i.slug), esc(i.name)))
        .join(', ')}</p>`
    : '';

  const incentive = note(
    `<p style="margin:0;font-family:${f.sans};font-size:14px;line-height:22px;color:${c.body};"><strong style="color:${c.ink};font-weight:600;">Deel een foto van je huisdier bij je review en maak kans op een pakket t.w.v. € 100.</strong> Elke maand kiezen we een winnaar. ${link(
      `${brand.siteUrl}/actievoorwaarden`,
      'Bekijk de actievoorwaarden',
    )}</p>
<p style="margin:10px 0 0;font-family:${f.sans};font-size:13px;line-height:20px;color:${c.muted};">Omdat je review via je bestelling binnenkomt, tonen we hem met het label ‘Geverifieerde koper’.</p>`,
  );

  const rows = [
    spacer(36),
    row(
      `${eyebrow('Even checken')}${h1(`Hoe bevalt je nieuwe ${esc(main.name)}?`)}${p(
        `Hoi ${esc(order.firstName)}, je bestelling is inmiddels binnen. We zijn benieuwd wat je ervan vindt, en andere baasjes ook: een eerlijke review helpt hen kiezen. Het kost je een minuut.`,
      )}`,
    ),
    spacer(28),
    row(`${productCard}${more}`),
    spacer(24),
    row(incentive),
    spacer(24),
    row(p('Niet helemaal tevreden? Antwoord op deze mail, dan lossen we het samen op.', { top: 0, size: 14 })),
    spacer(40),
  ].join('\n');

  const html = layout({
    title: subject,
    preheader,
    rows,
    heroImage: { src: brand.images.hero, alt: 'Golden retriever met zijn baasje op het vloerkleed' },
    footerReason: 'Je ontvangt deze mail omdat je onlangs bij ons bestelde.',
    unsubscribeUrl: invite.unsubscribeUrl,
  });

  const text = `Hoe bevalt je nieuwe ${main.name}?

Hoi ${order.firstName}, je bestelling is inmiddels binnen. We zijn benieuwd wat je ervan vindt, en andere baasjes ook: een eerlijke review helpt hen kiezen. Het kost je een minuut.

Schrijf je review: ${reviewLink(main.slug)}
${others.map((i) => `Ook beoordelen, ${i.name}: ${reviewLink(i.slug)}`).join('\n')}

Deel een foto van je huisdier bij je review en maak kans op een pakket t.w.v. € 100. Elke maand kiezen we een winnaar.
Actievoorwaarden: ${brand.siteUrl}/actievoorwaarden

Omdat je review via je bestelling binnenkomt, tonen we hem met het label 'Geverifieerde koper'.

Niet helemaal tevreden? Antwoord op deze mail, dan lossen we het samen op.

Afmelden voor reviewverzoeken: ${invite.unsubscribeUrl}

--
${textFooter()}`;

  return { subject, preheader, html, text: text.replace(/\n{3,}/g, '\n\n') };
}
