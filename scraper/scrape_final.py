#!/usr/bin/env python3
"""
Definitive bol.com scrape for Daily Pet Goods.

Key difference from earlier attempts: the image gallery is read from the
actual carousel DOM (`ul.snap-x li img`) via Playwright, so the images and
their order are exactly what bol shows - no regex over the whole page,
which previously picked up recommended/competitor products by mistake.

Also captures bol's own size label (JSON-LD `size`) so the site can use
the same S/M/L naming instead of invented labels.
"""
import asyncio
import json
import re
import shutil
import urllib.request
from pathlib import Path
from playwright.async_api import async_playwright

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)
OUT = Path(__file__).parent / "output"
RESULT = OUT / "final.json"
IMG_ROOT = OUT / "final_images"

# Every pet product currently listed on the Daily Lifegoods seller page,
# plus two that are still reachable but absent from the grid (checked
# individually below). Non-pet items (lighting, clocks, Halloween,
# megaphones) are deliberately excluded. Hondentuig is excluded on the
# owner's instruction.
URLS = [
    "https://www.bol.com/nl/p/-/9300000271745950",  # verhoogde hondenbak S
    "https://www.bol.com/nl/p/-/9300000271740188",  # verhoogde hondenbak M
    "https://www.bol.com/nl/p/-/9300000279049983",  # verhoogde hondenbak L
    "https://www.bol.com/nl/p/-/9300000318561941",  # dubbele voerbak metaal S
    "https://www.bol.com/nl/p/-/9300000318638430",  # dubbele voerbak metaal L
    "https://www.bol.com/nl/p/-/9300000291844620",  # voerbak mangohout 0,5L
    "https://www.bol.com/nl/p/-/9300000291847351",  # voerbak mangohout 1L
    "https://www.bol.com/nl/p/-/9300000291848114",  # voerbak mangohout 2L
    "https://www.bol.com/nl/p/-/9300000318643928",  # dubbele kattenvoerbak metaal
    "https://www.bol.com/nl/p/-/9300000318542325",  # kattenvoerbak mangohout kattenoren
    "https://www.bol.com/nl/p/-/9300000318515889",  # kattenvoerbak mangohout dinerset
    "https://www.bol.com/nl/p/-/9300000318772256",  # sambo grijs
    "https://www.bol.com/nl/p/-/9300000318798778",  # sambo taupe
    "https://www.bol.com/nl/p/-/9300000318786059",  # sambo mosgroen
    "https://www.bol.com/nl/p/-/9300000318667619",  # sambo groen
    "https://www.bol.com/nl/p/-/9300000287813948",  # hondenmand lounge
    "https://www.bol.com/nl/p/-/9300000288696966",  # donut 80
    "https://www.bol.com/nl/p/-/9300000288771332",  # donut 90
    "https://www.bol.com/nl/p/-/9300000304598169",  # achterbankbeschermer
    "https://www.bol.com/nl/p/-/9300000318895992",  # zwembad 80
    "https://www.bol.com/nl/p/-/9300000318956812",  # zwembad 120
    "https://www.bol.com/nl/p/-/9300000318962700",  # zwembad 160
    "https://www.bol.com/nl/p/-/9300000327606365",  # koelmat hond 30x40
    "https://www.bol.com/nl/p/-/9300000327599671",  # koelmat hond S
    "https://www.bol.com/nl/p/-/9300000327634338",  # koelmat hond L
    "https://www.bol.com/nl/p/-/9300000327644587",  # koelmat kat
    "https://www.bol.com/nl/p/-/9300000386568309",  # hondenjas 25
    "https://www.bol.com/nl/p/-/9300000386575011",  # hondenjas 30
    "https://www.bol.com/nl/p/-/9300000386598590",  # hondenjas 35
    "https://www.bol.com/nl/p/-/9300000386606250",  # hondenjas 40
    "https://www.bol.com/nl/p/-/9300000386608115",  # hondenjas 45
    "https://www.bol.com/nl/p/-/9300000386611069",  # kattenjas gewone kat
    "https://www.bol.com/nl/p/-/9300000386622845",  # kattenjas naaktkat
]


def ean_from_url(url):
    return url.rstrip("/").split("/")[-1]


def clean_html(fragment):
    text = re.sub(r'<br\s*/?>', '\n', fragment or "")
    text = re.sub(r'<[^>]+>', ' ', text)
    text = text.replace('&amp;', '&').replace('&nbsp;', ' ').replace('&quot;', '"')
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


async def dismiss_cookies(page):
    try:
        await page.locator("button", has_text="Alles accepteren").click(timeout=6000)
        await page.wait_for_timeout(1200)
    except Exception:
        pass


def hi_res(url):
    """Rewrite any media.s-bol.com URL to the 1200px variant (max bol serves)."""
    return re.sub(r'/\d+x\d+\.jpg$', '/1200x1200.jpg', url)


async def scrape(page, url):
    ean = ean_from_url(url)
    await page.goto(url, wait_until="load", timeout=45000)
    await page.wait_for_timeout(2500)

    html = await page.content()

    title = ""
    try:
        title = (await page.locator("h1").first.inner_text(timeout=5000)).strip()
    except Exception:
        pass

    # Gallery: the thumbnail strip is the authoritative order bol displays.
    gallery = await page.evaluate("""() => {
        const lists = Array.from(document.querySelectorAll('ul.snap-x'));
        for (const ul of lists) {
            const imgs = Array.from(ul.querySelectorAll('img'))
                .map(i => ({ src: i.src, alt: i.alt || '' }))
                .filter(x => x.src.includes('media.s-bol.com'));
            if (imgs.length) return imgs;
        }
        return [];
    }""")

    # Fall back to the main stage image when a product has a single photo
    # (no thumbnail strip is rendered in that case).
    if not gallery:
        gallery = await page.evaluate("""() => {
            const el = document.querySelector('section img[src*="media.s-bol.com"]');
            return el ? [{ src: el.src, alt: el.alt || '' }] : [];
        }""")

    ld = []
    for block in re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', html, re.DOTALL):
        try:
            ld.append(json.loads(block))
        except Exception:
            pass

    product = next((b for b in ld if isinstance(b, dict) and b.get("@type") == "Product"), None)
    group = next((b for b in ld if isinstance(b, dict) and b.get("@type") == "ProductGroup"), None)

    rec = {
        "ean": ean,
        "url": url,
        "title": title,
        "gallery": [{"src": hi_res(g["src"]), "alt": g["alt"]} for g in gallery],
    }

    if product:
        offers = product.get("offers") or {}
        rec.update({
            "schema": "Product",
            "description": clean_html(product.get("description", "")),
            "size": product.get("size"),
            "color": product.get("color"),
            "gtin13": product.get("gtin13"),
            "price": offers.get("price") if isinstance(offers, dict) else None,
            "availability": offers.get("availability") if isinstance(offers, dict) else None,
        })
    elif group:
        offers = group.get("offers") or {}
        rec.update({
            "schema": "ProductGroup",
            "description": clean_html(group.get("description", "")),
            "material": group.get("material"),
            "lowPrice": offers.get("lowPrice") if isinstance(offers, dict) else None,
            "highPrice": offers.get("highPrice") if isinstance(offers, dict) else None,
            "siblings": [
                {
                    "ean": ean_from_url(v.get("url") or v.get("@id") or ""),
                    "name": v.get("name"),
                    "size": v.get("size"),
                    "color": v.get("color"),
                    "gtin13": v.get("gtin13"),
                    "price": (v.get("offers") or {}).get("price") if isinstance(v.get("offers"), dict) else None,
                }
                for v in group.get("hasVariant", [])
            ],
        })
    else:
        rec["schema"] = "none"
        rec["description"] = ""

    # Download the gallery in order.
    d = IMG_ROOT / ean
    if d.exists():
        shutil.rmtree(d)
    d.mkdir(parents=True)
    saved = []
    for i, g in enumerate(rec["gallery"], 1):
        dest = d / f"img_{i}.jpg"
        try:
            req = urllib.request.Request(g["src"], headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=25) as resp:
                data = resp.read()
            if len(data) > 1000:
                dest.write_bytes(data)
                saved.append(dest.name)
        except Exception as e:
            print(f"[{ean}]  img {i} failed: {e}")
    rec["saved"] = saved

    price = rec.get("price") or rec.get("lowPrice")
    print(f"[{ean}] {rec['schema']:12s} size={str(rec.get('size')):10s} price={str(price):8s} imgs={len(saved):2d}  {title[:52]!r}")
    return rec


async def main():
    IMG_ROOT.mkdir(parents=True, exist_ok=True)
    results = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(
            user_agent=UA, viewport={"width": 1440, "height": 1000},
            locale="nl-NL", timezone_id="Europe/Amsterdam",
            extra_http_headers={"Accept-Language": "nl-NL,nl;q=0.9,en;q=0.8"},
        )
        page = await ctx.new_page()
        await page.goto(URLS[0], wait_until="load", timeout=45000)
        await page.wait_for_timeout(2000)
        await dismiss_cookies(page)

        for url in URLS:
            try:
                results.append(await scrape(page, url))
            except Exception as e:
                print(f"[{ean_from_url(url)}] ERROR {e}")
                results.append({"ean": ean_from_url(url), "url": url, "_failed": str(e)})
            await asyncio.sleep(2.0)
        await browser.close()

    RESULT.write_text(json.dumps(results, indent=2, ensure_ascii=False))
    print(f"\nWrote {len(results)} -> {RESULT}")


if __name__ == "__main__":
    asyncio.run(main())
