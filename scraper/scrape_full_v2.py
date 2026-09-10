#!/usr/bin/env python3
"""
Full re-scrape of all pet products via clean JSON-LD parsing (Product /
ProductGroup schema.org blocks), instead of the brittle regex-based
extraction in scrape_bol.py. Much more reliable: gives structured
description, size, color/material, gtin13, and authoritative sibling
variant data (price/size/url) straight from bol's own structured data,
without guessing at HTML section boundaries.
"""
import asyncio
import json
import re
import sys
import urllib.request
from pathlib import Path
from typing import Dict, List, Optional

from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)
OUT = Path(__file__).parent / "output"
RESULT_FILE = OUT / "products_v2.json"

# All 29 confirmed pet-relevant product URLs from the live seller listing
# (https://www.bol.com/nl/nl/w/alle-artikelen-daily-lifegoods/1850978/,
# all 5 pages) plus koelmat-hond-l which the grid omits but is still a
# live, reachable listing (verified with a direct 200 + matching <h1>).
URLS = [
    "https://www.bol.com/nl/nl/p/hondenbak-verhoogd-verhoogde-hondenbak-hout-met-rvs-bakken-antislip-dubbele-voerbak-voor-kleine-en-middelgrote-honden-40x21x12-cm/9300000271740188/",
    "https://www.bol.com/nl/nl/p/kattenvoerbak-dubbel-luxe-kattenvoerbak-mangohout-met-rvs-bakken-dubbele-voer-drinkbak-voor-katten-2x-250-ml/9300000318542325/",
    "https://www.bol.com/nl/nl/p/hondenbak-verhoogd-verhoogde-hondenbak-hout-met-rvs-bakken-antislip-dubbele-voerbak-voor-kleine-honden-32x17x10-cm/9300000271745950/",
    "https://www.bol.com/nl/nl/p/dubbele-hondenvoerbak-metaal-2-uitneembare-rvs-bakken-voer-drinkbak-voor-honden-en-katten-29x15x8-cm/9300000318561941/",
    "https://www.bol.com/nl/nl/p/koelmat-kat-zelfkoelende-koelmat-voor-katten-verkoelende-ligmat-zomer-mat-30x40-cm/9300000327644587/",
    "https://www.bol.com/nl/nl/p/dubbele-hondenvoerbak-metaal-groot-2-uitneembare-rvs-bakken-voer-drinkbak-voor-middelgrote-en-grote-honden-47x25x14-cm/9300000318638430/",
    "https://www.bol.com/nl/nl/p/hondenbak-verhoogd-xl-verhoogde-hondenbak-hout-met-rvs-bakken-antislip-dubbele-voerbak-voor-middelgrote-en-grote-honden-50x27x16-cm/9300000279049983/",
    "https://www.bol.com/nl/nl/p/dubbele-kattenvoerbak-mangohout-2x-250-ml-rvs-bakken-luxe-voer-drinkbak-voor-katten-houten-dinerset/9300000318515889/",
    "https://www.bol.com/nl/nl/p/luxe-hondentuig-blauw-verstelbaar-55-80-cm-comfortabel-anti-trek-harnas-25-mm-premium-nylon-voor-middelgrote-honden/9300000271335255/",
    "https://www.bol.com/nl/nl/p/voerbak-mangohout-0-5l-luxe-rvs-voer-drinkbak-stijlvolle-houten-voerbak-voor-kleine-honden-katten/9300000291844620/",
    "https://www.bol.com/nl/nl/p/dubbele-kattenvoerbak-metaal-2-uitneembare-rvs-bakken-voer-drinkbak-voor-katten-29x15x8-cm/9300000318643928/",
    "https://www.bol.com/nl/nl/p/hondenmand-sambo-mosgroen-luxe-zachte-hondenbank-comfortabele-slaapplaats-voor-kleine-honden-64x41-cm/9300000318786059/",
    "https://www.bol.com/nl/nl/p/hondenmand-sambo-groen-luxe-zachte-hondenbank-comfortabele-slaapplaats-voor-kleine-honden-64x41-cm/9300000318667619/",
    "https://www.bol.com/nl/nl/p/hondenmand-sambo-taupe-luxe-zachte-hondenbank-comfortabele-slaapplaats-voor-kleine-honden-64x41-cm/9300000318798778/",
    "https://www.bol.com/nl/nl/p/hondenmand-sambo-grijs-luxe-zachte-hondenbank-comfortabele-slaapplaats-voor-kleine-honden-64x41-cm/9300000318772256/",
    "https://www.bol.com/nl/nl/p/hondenzwembad-160-cm-opvouwbaar-antislip-hondenbad-verkoelend-zwembad-stevig-pvc-blauw/9300000318962700/",
    "https://www.bol.com/nl/nl/p/hondenvoerbak-mangohout-1l-luxe-rvs-voer-drinkbak-stijlvolle-houten-voerbak-voor-middelgrote-honden/9300000291847351/",
    "https://www.bol.com/nl/nl/p/hondenzwembad-opvouwbaar-antislip-hondenbad-verkoelend-zwembad-voor-honden-compact-opvouwbaar-80-cm/9300000318895992/",
    "https://www.bol.com/nl/nl/p/hondenzwembad-opvouwbaar-antislip-hondenbad-verkoelend-zwembad-voor-honden-compact-opvouwbaar-120-cm/9300000318956812/",
    "https://www.bol.com/nl/nl/p/grote-hondenmand-90-cm-zachte-pluche-donut-mand-comfortabele-wasbare-slaapmand-voor-middelgrote-grote-honden-beige/9300000288771332/",
    "https://www.bol.com/nl/nl/p/zelfkoelende-koelmat-voor-honden-verkoelende-ligmat-zomer-mat-30x40-cm/9300000327606365/",
    "https://www.bol.com/nl/nl/p/hondendeken-auto-achterbank-waterdichte-achterbankbeschermer-145x150-cm-inclusief-drinkfles-opvouwbare-voerbak-krasbestendige-autodeken-voor-honden/9300000304598169/",
    "https://www.bol.com/nl/nl/p/grote-hondenvoerbak-mangohout-2l-luxe-rvs-voer-drinkbak-stijlvolle-houten-voerbak-voor-grote-honden/9300000291848114/",
    "https://www.bol.com/nl/nl/p/grote-hondenmand-80-cm-zachte-pluche-donut-mand-comfortabele-wasbare-slaapmand-voor-middelgrote-grote-honden-grijs/9300000288696966/",
    "https://www.bol.com/nl/nl/p/hondenjas-25-cm-waterdicht-windbestendig-winterjas-kleine-hond-chihuahua-reflecterend/9300000386568309/",
    "https://www.bol.com/nl/nl/p/kattenjas-25-cm-winterjas-voor-naaktkat-sphynx-kat-warm-waterdicht-windbestendig-reflecterend/9300000386622845/",
    "https://www.bol.com/nl/nl/p/koelmat-hond-s-zelfkoelende-koelmat-voor-honden-verkoelende-ligmat-zomer-mat-40x50-cm/9300000327599671/",
    "https://www.bol.com/nl/nl/p/kattenjas-25-cm-winterjas-kat-warme-katten-kleding-waterdicht-windbestendig-reflecterend/9300000386611069/",
    "https://www.bol.com/nl/nl/p/hondenjas-35-cm-middelgrote-hond-beagle-waterdicht-windbestendig-warme-winterjas-reflecterend/9300000386598590/",
    "https://www.bol.com/nl/nl/p/koelmat-hond-l-zelfkoelende-koelmat-voor-grote-honden-verkoelende-ligmat-zomer-mat-50x90-cm/9300000327634338/",
]


def ean_from_url(url: str) -> str:
    return url.rstrip("/").split("/")[-1]


def clean_html(html_fragment: str) -> str:
    text = re.sub(r'<br\s*/?>', '\n', html_fragment)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'&amp;', '&', text)
    text = re.sub(r'&nbsp;', ' ', text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def parse_jsonld(html: str) -> List[dict]:
    blocks = re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', html, re.DOTALL)
    out = []
    for b in blocks:
        try:
            out.append(json.loads(b))
        except Exception:
            continue
    return out


def extract_bullets(html: str) -> List[str]:
    """Handles both the older 'Voordelen' layout and newer 'Belangrijkste
    eigenschappen' layout, whichever is present."""
    for heading in ("Belangrijkste eigenschappen", "Voordelen"):
        m = re.search(rf'{heading}</h3>(.*?)(?:<h3>|<script|$)', html, re.DOTALL)
        if not m:
            continue
        section = m.group(1)
        # Newer layout: flat <li> or <p> list of short feature strings.
        items = re.findall(r'<li>(.*?)</li>', section, re.DOTALL)
        if not items:
            items = re.findall(r'<p>(.*?)</p>', section, re.DOTALL)
        bullets = []
        for it in items:
            parts = re.split(r'<br\s*/?>', it, maxsplit=1)
            title = clean_html(parts[0])
            desc = clean_html(parts[1]) if len(parts) > 1 else ""
            if title:
                bullets.append(f"{title}: {desc}" if desc else title)
        if bullets:
            return bullets
    return []


def extract_images(html: str, title: str) -> List[str]:
    title_words = title.lower().split()[:5] if title else []
    img_tags = re.findall(r'<img[^>]+media\.s-bol\.com[^>]+>', html, re.DOTALL)
    product_ids = set()
    for tag in img_tags:
        alt_m = re.search(r'alt="([^"]*)"', tag)
        src_m = re.search(r'src="https://media\.s-bol\.com/([A-Za-z0-9]+)/', tag)
        if not src_m:
            continue
        alt = (alt_m.group(1) if alt_m else "").lower()
        img_id = src_m.group(1)
        if not title_words or any(w in alt for w in title_words[:3]):
            product_ids.add(img_id)
    if not product_ids:
        return []
    id_best: Dict[str, tuple] = {}
    for url in re.findall(r'https://media\.s-bol\.com/[A-Za-z0-9/]+\.jpg', html):
        parts = url.split('/')
        if len(parts) < 4:
            continue
        img_id = parts[3]
        if img_id not in product_ids:
            continue
        size_m = re.search(r'(\d+)x\d+\.jpg$', url)
        if not size_m:
            continue
        w = int(size_m.group(1))
        if img_id not in id_best or w > id_best[img_id][0]:
            id_best[img_id] = (w, url)
    return [url for _, url in sorted(id_best.values(), key=lambda x: -x[0])]


def download_images(ean: str, img_urls: List[str], force: bool = False) -> List[str]:
    img_dir = OUT / ean
    img_dir.mkdir(parents=True, exist_ok=True)
    saved = []
    headers = {"User-Agent": UA}
    for i, url in enumerate(img_urls, 1):
        ext = "jpg"
        if ".png" in url.lower():
            ext = "png"
        elif ".webp" in url.lower():
            ext = "webp"
        dest = img_dir / f"img_{i}.{ext}"
        if dest.exists() and not force:
            saved.append(str(dest))
            continue
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=20) as resp:
                data = resp.read()
            if len(data) > 1000:
                dest.write_bytes(data)
                saved.append(str(dest))
        except Exception as e:
            print(f"[{ean}]   image {i} failed: {e}")
    return saved


async def dismiss_cookies(page):
    try:
        btn = page.locator("button", has_text="Alles accepteren")
        await btn.click(timeout=6000)
        await page.wait_for_timeout(1200)
    except Exception:
        pass


async def scrape_one(page, url: str) -> Optional[dict]:
    ean = ean_from_url(url)
    try:
        await page.goto(url, wait_until="load", timeout=40000)
        await page.wait_for_timeout(2200)
        try:
            await page.locator("button", has_text="Alle productspecificaties").click(timeout=3000)
            await page.wait_for_timeout(600)
        except Exception:
            pass
        html = await page.content()
        title = ""
        try:
            title = (await page.locator("h1").first.inner_text(timeout=4000)).strip()
        except Exception:
            pass

        ldblocks = parse_jsonld(html)
        product_block = next((b for b in ldblocks if isinstance(b, dict) and b.get("@type") == "Product"), None)
        group_block = next((b for b in ldblocks if isinstance(b, dict) and b.get("@type") == "ProductGroup"), None)

        bullets = extract_bullets(html)
        img_urls = extract_images(html, title)
        saved = download_images(ean, img_urls)

        result = {
            "ean": ean,
            "url": url,
            "title": title,
            "bullets": bullets,
            "image_urls": img_urls,
            "images_saved": saved,
        }

        if product_block:
            result["description"] = clean_html(product_block.get("description", ""))
            result["size"] = product_block.get("size")
            result["color"] = product_block.get("color")
            result["gtin13"] = product_block.get("gtin13")
            offers = product_block.get("offers", {})
            result["price"] = offers.get("price") if isinstance(offers, dict) else None
            result["schema"] = "Product"
        elif group_block:
            result["description"] = clean_html(group_block.get("description", ""))
            result["material"] = group_block.get("material")
            result["productGroupID"] = group_block.get("productGroupID")
            offers = group_block.get("offers", {})
            result["lowPrice"] = offers.get("lowPrice") if isinstance(offers, dict) else None
            result["highPrice"] = offers.get("highPrice") if isinstance(offers, dict) else None
            result["schema"] = "ProductGroup"
            siblings = []
            for v in group_block.get("hasVariant", []):
                v_url = v.get("url") or (v.get("@id") or "")
                v_ean = ean_from_url(v_url) if v_url else None
                v_offers = v.get("offers", {})
                siblings.append({
                    "ean": v_ean,
                    "url": v_url,
                    "name": v.get("name"),
                    "size": v.get("size"),
                    "color": v.get("color"),
                    "gtin13": v.get("gtin13"),
                    "price": v_offers.get("price") if isinstance(v_offers, dict) else None,
                })
            result["siblings"] = siblings
        else:
            result["description"] = ""
            result["schema"] = "none"

        print(f"[{ean}] {result['schema']:12s} title={title[:60]!r} price={result.get('price') or result.get('lowPrice')}  bullets={len(bullets)} images={len(saved)}")
        return result

    except PlaywrightTimeout:
        print(f"[{ean}] TIMEOUT")
        return {"ean": ean, "url": url, "_failed": True}
    except Exception as e:
        print(f"[{ean}] ERROR: {e}")
        return {"ean": ean, "url": url, "_failed": True}


async def main():
    OUT.mkdir(exist_ok=True)
    results = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(
            user_agent=UA, viewport={"width": 1440, "height": 1000},
            locale="nl-NL", timezone_id="Europe/Amsterdam",
            extra_http_headers={"Accept-Language": "nl-NL,nl;q=0.9,en;q=0.8"},
        )
        page = await ctx.new_page()
        first = True
        for i, url in enumerate(URLS):
            if first:
                await page.goto(url, wait_until="load", timeout=40000)
                await page.wait_for_timeout(2000)
                await dismiss_cookies(page)
                first = False
            r = await scrape_one(page, url)
            if r:
                results.append(r)
            await asyncio.sleep(2.2)
        await browser.close()

    RESULT_FILE.write_text(json.dumps(results, indent=2, ensure_ascii=False))
    print(f"\nWrote {len(results)} entries -> {RESULT_FILE}")


if __name__ == "__main__":
    asyncio.run(main())
