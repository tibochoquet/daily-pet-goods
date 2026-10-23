import { brand, productThumb } from './brand';
import type { Address, Cents, OrderEmailData } from './types';
import { formatPrice } from '../business';

const c = brand.color;
const f = brand.font;

// ── Helpers ────────────────────────────────────────────────────────────────

export function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Zelfde formatter als de site, zodat een bedrag in de mail er niet
// anders uitziet dan in de winkelwagen.
export const eur = (cents: Cents) => formatPrice(cents / 100);

const toDate = (d: Date | string) => (d instanceof Date ? d : new Date(d));
export const dateLong = (d: Date | string) =>
  new Intl.DateTimeFormat('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Amsterdam' }).format(toDate(d));
export const dateShort = (d: Date | string) =>
  new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Amsterdam' }).format(toDate(d));

export function withParams(url: string, params: Record<string, string | number | undefined | null>): string {
  const u = new URL(url);
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== '') u.searchParams.set(k, String(v));
  return u.toString();
}

const COUNTRY: Record<string, string> = { NL: 'Nederland', BE: 'België' };

// ── Bouwstenen ─────────────────────────────────────────────────────────────

/** Eén rij in het mailvlak, met de standaard zijmarges. */
export const row = (inner: string, pad = '0 48px') =>
  `<tr><td class="px" bgcolor="${c.surface}" style="padding:${pad};background-color:${c.surface};">${inner}</td></tr>`;

export const spacer = (h: number) =>
  `<tr><td bgcolor="${c.surface}" height="${h}" style="height:${h}px;line-height:${h}px;font-size:0;background-color:${c.surface};">&nbsp;</td></tr>`;

export const eyebrow = (text: string) =>
  `<p style="margin:0 0 14px;font-family:${f.sans};font-size:12px;line-height:16px;letter-spacing:1.6px;text-transform:uppercase;font-weight:600;color:${c.terracotta};">${text}</p>`;

export const h1 = (text: string) =>
  `<h1 class="h1" style="margin:0;font-family:${f.serif};font-weight:500;font-size:32px;line-height:40px;color:${c.ink};">${text}</h1>`;

export const h2 = (text: string) =>
  `<h2 style="margin:0;font-family:${f.serif};font-weight:500;font-size:20px;line-height:28px;color:${c.ink};">${text}</h2>`;

export const p = (html: string, opts: { top?: number; size?: number; color?: string } = {}) =>
  `<p style="margin:${opts.top ?? 16}px 0 0;font-family:${f.sans};font-size:${opts.size ?? 15}px;line-height:${Math.round((opts.size ?? 15) * 1.65)}px;color:${opts.color ?? c.body};">${html}</p>`;

export const link = (href: string, label: string, color: string = c.green) =>
  `<a href="${esc(href)}" style="color:${color};text-decoration:underline;text-underline-offset:2px;">${label}</a>`;

export function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td align="center" bgcolor="${c.green}" style="border-radius:8px;background-color:${c.green};">
<a href="${esc(href)}" style="display:inline-block;padding:15px 30px;font-family:${f.sans};font-size:15px;line-height:20px;font-weight:600;color:${c.surface};text-decoration:none;border-radius:8px;">${label}</a>
</td></tr></table>`;
}

export const divider = (pad = '24px 0') =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:${pad};"><div style="height:1px;line-height:1px;font-size:0;background-color:${c.line};">&nbsp;</div></td></tr></table>`;

/** Voortgangsbalk: Betaald → Ingepakt → Onderweg → Bezorgd. `current` is de stap die nu bezig is. */
export function progress(current: 0 | 1 | 2 | 3): string {
  const steps = ['Betaald', 'Ingepakt', 'Onderweg', 'Bezorgd'];
  const lineColor = (reached: boolean) => (reached ? c.green : c.lineStrong);
  const cells = steps
    .map((label, i) => {
      const done = i < current;
      const now = i === current;
      const leftLine = i === 0 ? 'transparent' : lineColor(i <= current);
      const rightLine = i === steps.length - 1 ? 'transparent' : lineColor(i + 1 <= current);
      const dot = done
        ? `background-color:${c.green};border:2px solid ${c.green};`
        : now
          ? `background-color:${c.terracotta};border:2px solid ${c.terracotta};`
          : `background-color:${c.surface};border:2px solid ${c.lineStrong};`;
      const labelStyle = done
        ? `color:${c.ink};font-weight:500;`
        : now
          ? `color:${c.ink};font-weight:600;`
          : `color:${c.faint};font-weight:500;`;
      return `<td width="25%" align="center" valign="top" style="padding:0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td valign="top" style="padding-top:7px;"><div style="height:2px;line-height:2px;font-size:0;background-color:${leftLine};">&nbsp;</div></td>
<td width="16" valign="top"><div style="width:12px;height:12px;border-radius:8px;${dot}font-size:0;line-height:0;">&nbsp;</div></td>
<td valign="top" style="padding-top:7px;"><div style="height:2px;line-height:2px;font-size:0;background-color:${rightLine};">&nbsp;</div></td>
</tr></table>
<p style="margin:10px 0 0;font-family:${f.sans};font-size:12px;line-height:16px;${labelStyle}">${label}</p>
</td>`;
    })
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${cells}</tr></table>`;
}

function addressLines(a: Address): string {
  return [a.name, a.line1, a.line2, `${a.postalCode} ${a.city}`, COUNTRY[a.country] ?? a.country]
    .filter(Boolean)
    .map(esc)
    .join('<br>');
}

/** Bestelregels + totalen op een witte kaart. */
export function orderSummary(order: OrderEmailData, opts: { compact?: boolean } = {}): string {
  const showPrice = !opts.compact;
  const items = order.items
    .map((item) => {
      const thumb = item.imageUrl
        ? `<td width="64" valign="top" style="padding-right:16px;"><img src="${esc(productThumb(item.imageUrl))}" width="64" height="64" alt="" style="display:block;width:64px;height:64px;border-radius:8px;border:1px solid ${c.line};object-fit:cover;"></td>`
        : '';
      const meta = [item.variant, `Aantal: ${item.quantity}`].filter(Boolean).map(esc).join(' · ');
      return `<tr><td style="padding:10px 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
${thumb}
<td valign="middle">
<p style="margin:0;font-family:${f.sans};font-size:15px;line-height:22px;font-weight:600;color:${c.ink};">${esc(item.name)}</p>
<p style="margin:2px 0 0;font-family:${f.sans};font-size:13px;line-height:20px;color:${c.muted};">${meta}</p>
</td>
${showPrice ? `<td valign="middle" align="right" style="white-space:nowrap;padding-left:12px;font-family:${f.sans};font-size:15px;line-height:22px;color:${c.ink};">${eur(item.unitAmount * item.quantity)}</td>` : ''}
</tr></table>
</td></tr>`;
    })
    .join('');

  if (opts.compact) {
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;background-color:${c.card};border:1px solid ${c.line};border-radius:12px;">
<tr><td style="height:10px;line-height:10px;font-size:0;">&nbsp;</td></tr>${items}<tr><td style="height:10px;line-height:10px;font-size:0;">&nbsp;</td></tr></table>`;
  }

  const totalRow = (label: string, value: string, strong = false, valueColor: string = c.ink) =>
    `<tr><td style="padding:4px 24px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="font-family:${f.sans};font-size:${strong ? 16 : 14}px;line-height:24px;color:${strong ? c.ink : c.muted};${strong ? 'font-weight:600;' : ''}">${label}</td>
<td align="right" style="font-family:${f.sans};font-size:${strong ? 18 : 14}px;line-height:24px;color:${valueColor};${strong ? 'font-weight:600;' : ''}white-space:nowrap;">${value}</td>
</tr></table></td></tr>`;

  const rows = [
    totalRow('Subtotaal', eur(order.subtotal)),
    order.discount ? totalRow('Korting', `−${eur(order.discount)}`) : '',
    totalRow('Verzending', order.shippingCost === 0 ? 'Gratis' : eur(order.shippingCost), false, order.shippingCost === 0 ? c.green : c.ink),
    `<tr><td style="padding:8px 24px;"><div style="height:1px;line-height:1px;font-size:0;background-color:${c.line};">&nbsp;</div></td></tr>`,
    totalRow('Totaal', eur(order.total), true),
    order.vatAmount ? totalRow('Waarvan btw', eur(order.vatAmount)) : '',
  ].join('');

  const paid = order.paymentMethod
    ? `<tr><td style="padding:6px 24px 0;font-family:${f.sans};font-size:13px;line-height:20px;color:${c.muted};">Betaald met ${esc(order.paymentMethod)}</td></tr>`
    : '';

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;background-color:${c.card};border:1px solid ${c.line};border-radius:12px;">
<tr><td style="padding:22px 24px 6px;font-family:${f.sans};font-size:12px;line-height:16px;letter-spacing:1.6px;text-transform:uppercase;font-weight:600;color:${c.muted};">Je bestelling</td></tr>
${items}
<tr><td style="padding:6px 24px 10px;"><div style="height:1px;line-height:1px;font-size:0;background-color:${c.line};">&nbsp;</div></td></tr>
${rows}
${paid}
<tr><td style="height:22px;line-height:22px;font-size:0;">&nbsp;</td></tr>
</table>`;
}

/** Twee kolommen (stapelen op mobiel). */
export function twoColumns(left: string, right: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td class="stack" width="50%" valign="top" style="padding-right:12px;">${left}</td>
<td class="stack stack-gap" width="50%" valign="top" style="padding-left:12px;">${right}</td>
</tr></table>`;
}

export const label = (text: string) =>
  `<p style="margin:0 0 6px;font-family:${f.sans};font-size:12px;line-height:16px;letter-spacing:1.6px;text-transform:uppercase;font-weight:600;color:${c.muted};">${text}</p>`;

export const addressBlock = (a: Address) =>
  `${label('Bezorgadres')}<p style="margin:0;font-family:${f.sans};font-size:14px;line-height:22px;color:${c.ink};">${addressLines(a)}</p>`;

/** Zand-kleurig kader voor bijzaken (bedenktijd, tips). */
export const note = (inner: string) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;background-color:${c.page};border-radius:12px;"><tr><td style="padding:22px 24px;">${inner}</td></tr></table>`;

// ── Layout ─────────────────────────────────────────────────────────────────

export function layout(opts: {
  title: string;
  preheader: string;
  rows: string; // <tr>…</tr> rijen
  footerReason: string;
  unsubscribeUrl?: string;
  heroImage?: { src: string; alt: string };
}): string {
  const hero = opts.heroImage
    ? `<tr><td bgcolor="${c.surface}" style="padding:0;background-color:${c.surface};"><img class="full" src="${esc(opts.heroImage.src)}" width="600" alt="${esc(opts.heroImage.alt)}" style="display:block;width:100%;max-width:600px;height:auto;border:0;"></td></tr>`
    : '';

  const unsubscribe = opts.unsubscribeUrl
    ? ` ${link(opts.unsubscribeUrl, 'Afmelden voor dit soort mails', c.footerMuted)}`
    : '';

  return `<!DOCTYPE html>
<html lang="nl" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${esc(opts.title)}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@500&display=swap" rel="stylesheet">
<style>
  body { margin:0; padding:0; width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
  img { border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
  a[x-apple-data-detectors] { color:inherit !important; text-decoration:none !important; }
  @media (max-width: 620px) {
    .px { padding-left:24px !important; padding-right:24px !important; }
    .h1 { font-size:27px !important; line-height:34px !important; }
    .stack { display:block !important; width:100% !important; padding-left:0 !important; padding-right:0 !important; }
    .stack-gap { padding-top:20px !important; }
    .stack-pad { display:block !important; width:100% !important; box-sizing:border-box !important; }
    .full { width:100% !important; height:auto !important; }
    .stars a { font-size:30px !important; line-height:36px !important; padding:0 !important; }
    .card-px { padding-left:16px !important; padding-right:16px !important; }
    .gift-img { width:100% !important; height:auto !important; border-radius:12px 12px 0 0 !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${c.page};">
<div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;color:${c.page};">${esc(opts.preheader)}${'&#847;&zwnj;&nbsp;'.repeat(60)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${c.page}" style="background-color:${c.page};">
<tr><td align="center" style="padding:24px 12px 32px;">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

<tr><td align="center" bgcolor="${c.surface}" style="padding:32px 24px 28px;background-color:${c.surface};border-radius:16px 16px 0 0;">
<a href="${brand.siteUrl}" style="text-decoration:none;"><img src="${brand.images.logo}" width="235" height="44" alt="Daily Pet Goods" style="display:block;width:235px;height:44px;border:0;font-family:Georgia,serif;font-size:22px;color:${c.green};"></a>
</td></tr>
${hero}
${opts.rows}

<tr><td align="center" bgcolor="${c.green}" style="padding:36px 40px 34px;background-color:${c.green};border-radius:0 0 16px 16px;">
<img src="${brand.images.footerMark}" width="40" height="41" alt="" style="display:block;width:40px;height:41px;border:0;margin:0 auto;">
<p style="margin:18px 0 0;font-family:${f.sans};font-size:13px;line-height:20px;color:${c.footerText};">
${link(brand.links.orders, 'Mijn bestelling', c.footerText)}&nbsp;&nbsp;·&nbsp;&nbsp;${link(brand.links.returns, 'Retourneren', c.footerText)}&nbsp;&nbsp;·&nbsp;&nbsp;${link(brand.instagramUrl, 'Instagram', c.footerText)}
</p>
<p style="margin:18px 0 0;font-family:${f.sans};font-size:12px;line-height:19px;color:${c.footerMuted};">
${esc(brand.name)} is een handelsnaam van ${esc(brand.legalName)}<br>${esc(brand.address)}<br>KVK ${esc(brand.kvk)} · btw-id ${esc(brand.btw)}
</p>
<p style="margin:14px 0 0;font-family:${f.sans};font-size:12px;line-height:19px;color:${c.footerMuted};">${opts.footerReason}${unsubscribe}</p>
</td></tr>

</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;
}
