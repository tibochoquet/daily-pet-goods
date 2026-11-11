import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { BESCHERMDE_HEADERS } from '@/lib/selectie/sessie'

/**
 * Serveert de productselectietool als compleet HTML-document.
 *
 * Een route handler en geen page.tsx, om twee redenen. De app is één
 * zelfstandig document met eigen <style> en <script>; via React in een
 * pagina injecteren zou de winkel-layout eromheen zetten, en scripts die
 * via innerHTML binnenkomen voert de browser sowieso niet uit.
 *
 * Het bestand staat in selectie-app/ en bewust niet in public/. Alles in
 * public/ serveert Vercel rechtstreeks vanaf het CDN, langs proxy.ts
 * heen - dan zit er een slot op de deur terwijl het raam openstaat.
 *
 * next.config.ts neemt de map op in outputFileTracingIncludes; zonder dat
 * zit het bestand niet in de serverless bundel.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const html = await readFile(join(process.cwd(), 'selectie-app', 'index.html'), 'utf8')
    return new Response(html, {
      headers: { ...BESCHERMDE_HEADERS, 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch (err) {
    console.error('Productselectie: index.html kon niet gelezen worden:', err)
    return new Response('De tool kon niet geladen worden.', {
      status: 500,
      headers: { ...BESCHERMDE_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }
}
