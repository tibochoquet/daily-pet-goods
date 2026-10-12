#!/usr/bin/env python3
"""
FASE 2 - haalt de 11 bronproducten op van bol.com en legt de ruwe
brondata vast in sync/bol-snapshot/.

Netjes: één pagina per keer, 3 seconden ertussen, geen parallelle
verzoeken. Bij een blokkade (403, captcha, bot-detectie) stopt het
script onmiddellijk in plaats van eromheen te werken.

Per product wordt vastgelegd:
  <ean>.json   titel, volledige beschrijving, prijs, galerij-urls
  <ean>/       de foto's zelf, in bol's eigen carrouselvolgorde

Prijs: deze listings zijn ProductGroup-pagina's, waar de prijs van dít
artikel in de hasVariant-lijst staat - niet in de losse offers-sectie.
De zichtbare prijstekst op de pagina dient als controle.
"""
import asyncio
import json
import re
import sys
import urllib.request
from pathlib import Path

from playwright.async_api import async_playwright

HERE = Path(__file__).parent
SNAP = HERE / 'bol-snapshot'
UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36')

DELAY_SECONDS = 3.0

PRODUCTS = [
    ('9300000291847351', 'hondenvoerbak-mangohout-1l'),
    ('9300000291848114', 'grote-hondenvoerbak-mangohout-2l'),
    ('9300000318515889', 'dubbele-kattenvoerbak-mangohout'),
    ('9300000318643928', 'dubbele-kattenvoerbak-metaal'),
    ('9300000318561941', 'dubbele-hondenvoerbak-metaal'),
    ('9300000318638430', 'dubbele-hondenvoerbak-metaal-groot'),
    ('9300000291844620', 'voerbak-mangohout-0-5l'),
    ('9300000318542325', 'kattenvoerbak-dubbel'),
    ('9300000271740188', 'hondenbak-verhoogd-40x21x12'),
    ('9300000271745950', 'hondenbak-verhoogd-32x17x10'),
    ('9300000279049983', 'hondenbak-verhoogd-xl-50x27x16'),
]

BLOCK_SIGNS = ('captcha', 'unusual traffic', 'ongebruikelijk verkeer',
               'access denied', 'toegang geweigerd', 'je bent een robot',
               'verify you are human')


def clean(fragment: str) -> str:
    text = re.sub(r'<br\s*/?>', '\n', fragment or '')
    text = re.sub(r'<[^>]+>', ' ', text)
    text = (text.replace('&amp;', '&').replace('&nbsp;', ' ')
                .replace('&quot;', '"').replace('&#39;', "'"))
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def fetch_image(url: str):
    """Pak het grootste formaat dat bol van deze foto heeft.

    Niet elke foto bestaat op 1200x1200: van recent geuploade foto's
    heeft bol vaak alleen 550x550, en dan geeft 1200x1200 een 404. Loop
    daarom een ladder af en val altijd terug op de url die de pagina
    zelf gebruikt, anders verdwijnt zo'n foto geruisloos uit de galerij.
    """
    candidates = []
    m = re.search(r'^(.*)/(\d+)x(\d+)\.jpg$', url)
    if m:
        base = m.group(1)
        if m.group(2) == m.group(3):
            candidates.append(f'{base}/1200x1200.jpg')
        else:
            scale = 1200 / max(int(m.group(2)), int(m.group(3)))
            candidates.append(
                f'{base}/{round(int(m.group(2))*scale)}x{round(int(m.group(3))*scale)}.jpg')
        candidates.append(f'{base}/550x550.jpg')
    candidates.append(url)
    for c in candidates:
        try:
            req = urllib.request.Request(c, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=25) as r:
                data = r.read()
            if len(data) > 1000:
                return data, c
        except Exception:
            continue
    return None, None


async def dismiss_overlays(page):
    for _ in range(3):
        for label in ('Alles accepteren', 'Doorgaan'):
            try:
                btn = page.locator('button', has_text=label).first
                if await btn.is_visible(timeout=1200):
                    await btn.click(timeout=3000)
                    await page.wait_for_timeout(900)
            except Exception:
                pass


async def scrape_one(page, ean: str):
    url = f'https://www.bol.com/nl/p/-/{ean}'
    resp = await page.goto(url, wait_until='load', timeout=45000)
    status = resp.status if resp else 0
    await page.wait_for_timeout(2500)
    await dismiss_overlays(page)
    await page.wait_for_timeout(600)

    html = await page.content()
    low = html.lower()
    if status in (403, 429) or any(s in low for s in BLOCK_SIGNS):
        raise RuntimeError(f'bol blokkeert ons (status {status}) bij {ean}')

    title = ''
    try:
        title = (await page.locator('h1').first.inner_text(timeout=5000)).strip()
    except Exception:
        pass

    ld = []
    for block in re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>',
                            html, re.DOTALL):
        try:
            ld.append(json.loads(block))
        except Exception:
            pass
    product = next((b for b in ld if isinstance(b, dict) and b.get('@type') == 'Product'), None)
    group = next((b for b in ld if isinstance(b, dict) and b.get('@type') == 'ProductGroup'), None)
    node = product or group or {}

    # Prijs van DIT artikel, uitsluitend uit de gestructureerde data.
    # De prijs die de pagina toont is bewust geen terugvaloptie: bij een
    # variant die niet leverbaar is toont bol daar de prijs van een ander
    # product uit "Bekijk ook eens", en die varianten heten vaak hetzelfde.
    price = None
    if product:
        offers = product.get('offers') or {}
        price = offers.get('price') if isinstance(offers, dict) else None
    if price is None and group:
        for v in group.get('hasVariant', []):
            vurl = v.get('url') or v.get('@id') or ''
            if ean in vurl:
                vo = v.get('offers') or {}
                price = vo.get('price') if isinstance(vo, dict) else None
                break
    shown = await page.evaluate("""() => {
        const m = document.body.innerText.match(/De prijs van dit product is (\\d+) euro(?: en (\\d+) cent)?/);
        return m ? parseFloat(m[1]) + (m[2] ? parseInt(m[2]) / 100 : 0) : null;
    }""")
    unavailable = 'niet leverbaar' in (await page.evaluate(
        "() => document.body.innerText")).lower()

    # De carousel laadt zijn miniaturen pas als je er doorheen scrollt.
    # Zonder dit krijg je alleen de eerste zes a acht foto's, en juist
    # achteraan staan de maatfoto's.
    COUNT_LOADED = """() => [...document.querySelectorAll('ul.snap-x li img')]
        .filter(i => ((i.currentSrc || i.src || '')).includes('media.s-bol.com')).length"""
    stable = 0
    for _ in range(14):
        before = await page.evaluate(COUNT_LOADED)
        await page.evaluate("""() => {
            const ul = document.querySelector('ul.snap-x');
            if (ul) ul.scrollLeft += 600;
        }""")
        await page.mouse.wheel(0, 400)
        await page.wait_for_timeout(450)
        after = await page.evaluate(COUNT_LOADED)
        stable = stable + 1 if after == before else 0
        if stable >= 3:
            break
    await page.evaluate("() => window.scrollTo(0, 0)")
    await page.wait_for_timeout(700)

    # galerij in bol's eigen volgorde
    gallery = await page.evaluate("""() => {
        for (const ul of document.querySelectorAll('ul.snap-x')) {
            const imgs = [...ul.querySelectorAll('img')]
                .map(i => ({ src: i.src, alt: i.alt || '' }))
                .filter(x => x.src.includes('media.s-bol.com'));
            if (imgs.length) return imgs;
        }
        const el = document.querySelector('section img[src*="media.s-bol.com"]');
        return el ? [{ src: el.src, alt: el.alt || '' }] : [];
    }""")
    # foto's van hetzelfde artikel delen een hash in de url; zo blijven
    # gesponsorde producten uit de zijbalk buiten de galerij
    if gallery:
        hm = re.search(r'media\.s-bol\.com/[A-Za-z0-9]+/([A-Za-z0-9]+)/', gallery[0]['src'])
        if hm:
            seg = hm.group(1)
            seen, ordered = set(), []
            for g in gallery:
                im = re.search(r'media\.s-bol\.com/([A-Za-z0-9]+)/', g['src'])
                if im and im.group(1) not in seen:
                    seen.add(im.group(1))
                    ordered.append(g)
            for m2 in re.finditer(rf'media\.s-bol\.com/([A-Za-z0-9]+)/{seg}/', html):
                if m2.group(1) not in seen:
                    seen.add(m2.group(1))
                    ordered.append({'src': f'https://media.s-bol.com/{m2.group(1)}/{seg}/1200x1200.jpg',
                                    'alt': ''})
            gallery = ordered

    d = SNAP / ean
    d.mkdir(parents=True, exist_ok=True)
    photos = []
    for i, g in enumerate(gallery, 1):
        data, used = fetch_image(g['src'])
        if data is None:
            continue
        name = f'img_{len(photos) + 1}.jpg'
        (d / name).write_bytes(data)
        photos.append({'file': name, 'url': used, 'alt': g.get('alt', '')})

    record = {
        'ean': ean,
        'url': url,
        'title': title,
        'description': clean(node.get('description', '')),
        'price_jsonld': price,
        'price_shown': shown,
        'price_trusted': price is not None,
        'unavailable': unavailable,
        'gtin13': node.get('gtin13'),
        'schema': node.get('@type'),
        'photos': photos,
        'photo_count': len(photos),
    }
    (SNAP / f'{ean}.json').write_text(json.dumps(record, indent=2, ensure_ascii=False))
    label = f'{price}' if price is not None else f'GEEN EIGEN PRIJS (pagina toont {shown})'
    print(f'[{ean}] prijs={label}  fotos={len(photos)}  {title[:50]!r}')
    return record


async def main():
    SNAP.mkdir(parents=True, exist_ok=True)
    # Optioneel een of meer EANs meegeven, zodat je voor een enkele
    # variant niet de hele lijst opnieuw hoeft op te halen.
    wanted = [a for a in sys.argv[1:] if a.isdigit()]
    todo = [p for p in PRODUCTS if not wanted or p[0] in wanted]
    if wanted and not todo:
        print(f'geen van {wanted} staat in PRODUCTS', file=sys.stderr)
        sys.exit(1)
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(
            user_agent=UA, viewport={'width': 1440, 'height': 1100},
            locale='nl-NL', timezone_id='Europe/Amsterdam',
            extra_http_headers={'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8'})
        page = await ctx.new_page()
        for i, (ean, _slug) in enumerate(todo):
            try:
                await scrape_one(page, ean)
            except RuntimeError as e:
                print(f'\nGESTOPT: {e}', file=sys.stderr)
                await browser.close()
                sys.exit(2)
            if i < len(todo) - 1:
                await asyncio.sleep(DELAY_SECONDS)
        await browser.close()
    print(f'\nSnapshot opgeslagen in {SNAP}')


asyncio.run(main())
