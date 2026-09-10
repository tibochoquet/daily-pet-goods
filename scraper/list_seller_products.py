#!/usr/bin/env python3
"""List ALL product links from the Daily Lifegoods bol.com seller page, paginated."""
import asyncio
import json
import re
from pathlib import Path
from playwright.async_api import async_playwright

BASE = "https://www.bol.com/nl/nl/w/alle-artikelen-daily-lifegoods/1850978/"
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)
OUT = Path(__file__).parent / "output" / "seller_listing.json"


async def dismiss_cookies(page):
    try:
        btn = page.locator("button", has_text="Alles accepteren")
        await btn.click(timeout=6000)
        await page.wait_for_timeout(1000)
    except Exception:
        pass


async def main():
    all_products = {}  # ean -> {title, url}
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(
            user_agent=UA, viewport={"width": 1440, "height": 1200},
            locale="nl-NL", timezone_id="Europe/Amsterdam",
            extra_http_headers={"Accept-Language": "nl-NL,nl;q=0.9,en;q=0.8"},
        )
        page = await ctx.new_page()

        page_num = 1
        first = True
        while True:
            url = BASE if page_num == 1 else f"{BASE}?page={page_num}"
            print(f"--- page {page_num}: {url}")
            await page.goto(url, wait_until="load", timeout=40000)
            await page.wait_for_timeout(2500)
            if first:
                await dismiss_cookies(page)
                await page.wait_for_timeout(1000)
                first = False

            html = await page.content()

            # Product links look like /nl/nl/p/<slug>/<EAN>/ or /nl/p/-/<EAN>
            links = re.findall(r'href="(/nl/nl/p/[^"]+?/(\d{10,})/?)"', html)
            found_this_page = 0
            for href, ean in links:
                if ean not in all_products:
                    found_this_page += 1
                title_m = re.search(r'title="([^"]*)"[^>]*href="' + re.escape(href) + '"', html)
                all_products[ean] = {
                    "ean": ean,
                    "url": "https://www.bol.com" + href,
                }
            print(f"    new products found: {found_this_page}, total so far: {len(all_products)}")

            total_m = re.search(r'van de (\d+)', html)
            total_pages = int(total_m.group(1)) if total_m else None
            if total_pages and page_num >= total_pages:
                print(f"    reached last page ({total_pages}), stopping")
                break
            if page_num > 15:
                print("    safety cap reached (15 pages), stopping")
                break
            page_num += 1

        await browser.close()

    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(list(all_products.values()), indent=2, ensure_ascii=False))
    print(f"\nTotal unique products found: {len(all_products)}")
    print(f"Written to {OUT}")


if __name__ == "__main__":
    asyncio.run(main())
