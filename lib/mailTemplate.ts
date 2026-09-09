import { readFileSync } from 'fs'
import path from 'path'
import { business, formatAddress } from './business'

interface BestelmailValues {
  voornaam: string
  bestelnummer: string
  leverdatum: string
  /** Omitted (undefined/empty) whenever there's no tracking link yet - see below. */
  trackTraceUrl?: string
  reviewUrl: string
  unsubscribeUrl: string
}

const TEMPLATE_PATH = path.join(process.cwd(), 'emails', 'bestelmail.html')

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/**
 * Renders emails/bestelmail.html with real order data. The template's own
 * markup/styling is never touched here - this only does placeholder
 * substitution, plus one structural thing: when there's no track & trace
 * link yet, the whole "CTA track & trace" <tr> block is removed rather
 * than left with a dead button. That block is cut using the template's
 * own HTML comments as boundaries (from "<!-- CTA track & trace -->" up
 * to the next comment) rather than trying to balance <tr> tags with
 * regex, since the block contains a nested inner <table>/<tr> - matching
 * to the first "</tr>" would truncate it mid-block.
 */
export function renderBestelmail(values: BestelmailValues): string {
  let html = readFileSync(TEMPLATE_PATH, 'utf8')

  if (!values.trackTraceUrl) {
    html = html.replace(/<!-- CTA track & trace -->[\s\S]*?(?=<!--)/, '')
  }

  const replacements: Record<string, string> = {
    '{{voornaam}}': escapeHtml(values.voornaam),
    '{{bestelnummer}}': escapeHtml(values.bestelnummer),
    '{{leverdatum}}': escapeHtml(values.leverdatum),
    '{{track_trace_url}}': values.trackTraceUrl ?? '',
    '{{review_url}}': values.reviewUrl,
    '{{unsubscribe_url}}': values.unsubscribeUrl,
    // Herroepingsrecht + bedrijfsgegevens block - always the same fixed
    // values, so sourced directly from lib/business.ts (the single
    // source of truth used everywhere else) rather than threaded through
    // every caller of renderBestelmail().
    '{{bedrijfsnaam}}': escapeHtml(business.brandName),
    '{{handelsnaam}}': escapeHtml(business.tradingName),
    '{{adres}}': escapeHtml(formatAddress()),
    '{{kvk}}': escapeHtml(business.kvkNumber),
    '{{btw}}': escapeHtml(business.btwNumber),
  }

  for (const [placeholder, value] of Object.entries(replacements)) {
    html = html.split(placeholder).join(value)
  }

  return html
}

function addBusinessDays(from: Date, days: number): Date {
  const result = new Date(from)
  let added = 0
  while (added < days) {
    result.setDate(result.getDate() + 1)
    const day = result.getDay()
    if (day !== 0 && day !== 6) added++
  }
  return result
}

/**
 * A range, not a fake precise date - "1-2 werkdagen verwerking" plus
 * "1-3 werkdagen bezorging" (the site's own stated policy, see
 * /verzending) is 2 to 5 working days, not one knowable day.
 */
export function estimateDeliveryRange(from: Date = new Date()): string {
  const earliest = addBusinessDays(from, 2)
  const latest = addBusinessDays(from, 5)
  const sameMonth = earliest.getMonth() === latest.getMonth() && earliest.getFullYear() === latest.getFullYear()

  if (sameMonth) {
    const month = new Intl.DateTimeFormat('nl-NL', { month: 'long' }).format(latest)
    return `${earliest.getDate()} - ${latest.getDate()} ${month}`
  }
  const fmt = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long' })
  return `${fmt.format(earliest)} - ${fmt.format(latest)}`
}
