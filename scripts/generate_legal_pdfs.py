#!/usr/bin/env python3
"""
Maakt de pdf-bijlagen die met elke bestelbevestiging meegaan, van de
echte pagina's op de site. Zo kan de tekst in de bijlage nooit afwijken
van wat er op dailypetgoods.nl staat: er is maar een bron.

Gebruik:
    npm run pdf:legal                            (tegen http://localhost:3000)
    npm run pdf:legal -- https://dailypetgoods.nl

Er moet dus een server draaien: `npm run dev`, of `npm run build && npm start`.
"""
import asyncio
import base64
import sys
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / 'public' / 'legal'
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3000'
MAX_BYTES = 300 * 1024

PAGINAS = [
    ('/algemene-voorwaarden', 'algemene-voorwaarden.pdf'),
    ('/retourneren/modelformulier-herroeping', 'modelformulier-herroeping.pdf'),
]

# Alles wat van de site is en niet van het document verdwijnt: de balk,
# de navigatie en de footer. Wat overblijft is <main>.
#
# De paginapadding is voor een beeldscherm bedoeld; op papier regelt
# @page de marges, anders staat alles dubbel ingesprongen.
PRINT_CSS = """
  @page { size: A4; margin: 18mm 16mm 16mm 16mm; }
  body > *:not(main):not(script) { display: none !important; }
  html, body, main { background: #fff !important; }
  main > div { padding-top: 0 !important; padding-bottom: 0 !important; max-width: none !important; }
  h1, h2 { break-after: avoid-page; page-break-after: avoid; }
  section, li { break-inside: avoid-page; }
  a { text-decoration: none !important; color: #2C4A3E !important; }
  /* Webelementen die in een bijlage niets te zoeken hebben: de
     terug-link en de downloadknop. Op papier kun je nergens heen. */
  a[href="/retourneren"],
  a[href$="/download"],
  [data-pdf-hide] { display: none !important; }
  .dpg-pdf-kop {
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid #E8E2D9; padding-bottom: 10px; margin-bottom: 22px;
  }
  .dpg-pdf-kop img { height: 26px; width: auto; }
  .dpg-pdf-kop span { font-size: 9px; color: #9CA3AF; letter-spacing: .04em; }
"""

VOETTEKST = (
    '<div style="width:100%;font-size:8px;color:#9CA3AF;padding:0 16mm;'
    'display:flex;justify-content:space-between;">'
    '<span>Daily Pet Goods</span>'
    '<span>Pagina <span class="pageNumber"></span> van <span class="totalPages"></span></span>'
    '</div>'
)


async def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    logo = (ROOT / 'public' / 'mail' / 'logo-lockup.png').read_bytes()
    logo_data_url = 'data:image/png;base64,' + base64.b64encode(logo).decode()

    te_groot = 0
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        page = await browser.new_page()

        for pad, bestand in PAGINAS:
            url = f'{BASE}{pad}'
            resp = await page.goto(url, wait_until='networkidle', timeout=45000)
            if resp is None or resp.status != 200:
                print(f'{url} gaf status {resp.status if resp else "geen antwoord"} - draait de server?')
                await browser.close()
                return 1

            await page.add_style_tag(content=PRINT_CSS)
            # Briefhoofd, zodat de bijlage als document leest en niet als
            # uitgeprint webpaginaatje.
            await page.evaluate(
                """(src) => {
                    const doel = document.querySelector('main > div');
                    if (!doel || doel.querySelector('.dpg-pdf-kop')) return;
                    const kop = document.createElement('div');
                    kop.className = 'dpg-pdf-kop';
                    kop.innerHTML = `<img src="${src}" alt="Daily Pet Goods">` +
                        `<span>dailypetgoods.nl${location.pathname}</span>`;
                    doel.prepend(kop);
                }""",
                logo_data_url,
            )
            await page.emulate_media(media='print')
            await page.wait_for_timeout(400)

            doel = OUT_DIR / bestand
            await page.pdf(
                path=str(doel),
                format='A4',
                print_background=False,
                display_header_footer=True,
                header_template='<span></span>',
                footer_template=VOETTEKST,
                margin={'top': '18mm', 'right': '16mm', 'bottom': '16mm', 'left': '16mm'},
            )

            kb = doel.stat().st_size // 1024
            vlag = f'   <-- GROTER DAN {MAX_BYTES // 1024} KB' if doel.stat().st_size > MAX_BYTES else ''
            if doel.stat().st_size > MAX_BYTES:
                te_groot += 1
            print(f'  {bestand:<34} {kb:>4} KB{vlag}')

        await browser.close()

    if te_groot:
        print(f'\n{te_groot} bestand(en) boven de limiet.')
        return 1
    print(f'\nKlaar. Bron: {BASE}')
    return 0


raise SystemExit(asyncio.run(main()))
