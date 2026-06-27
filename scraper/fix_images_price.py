"""
Re-scrape images (broader match) and price for the 2 products that only got 1 image.
"""
import asyncio, json, re, urllib.request
from pathlib import Path
from playwright.async_api import async_playwright

UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
OUT = Path(__file__).parent / 'output'

TARGETS = [
    ('9300000327634338', 'https://www.bol.com/nl/nl/p/koelmat-hond-l-zelfkoelende-koelmat-voor-grote-honden-verkoelende-ligmat-zomer-mat-50x90-cm/9300000327634338/'),
    ('9300000327644587', 'https://www.bol.com/nl/nl/p/koelmat-kat-zelfkoelende-koelmat-voor-katten-verkoelende-ligmat-zomer-mat-40x50-cm/9300000327644587/'),
]

def extract_images_broad(html: str) -> list:
    """Collect ALL bol CDN images from the page, pick highest-res per ID."""
    all_urls = re.findall(r'https://media\.s-bol\.com/[A-Za-z0-9/]+\.jpg', html)
    id_best = {}
    for url in all_urls:
        parts = url.split('/')
        if len(parts) < 4:
            continue
        img_id = parts[3]
        size_m = re.search(r'(\d+)x\d+\.jpg$', url)
        if not size_m:
            continue
        w = int(size_m.group(1))
        if img_id not in id_best or w > id_best[img_id][0]:
            id_best[img_id] = (w, url)
    # Only keep images >= 400px wide (product images, not thumbnails/icons)
    results = [(w, url) for w, url in id_best.values() if w >= 400]
    return [url for _, url in sorted(results, key=lambda x: -x[0])[:10]]

def download_images(ean: str, img_urls: list) -> list:
    img_dir = OUT / ean
    img_dir.mkdir(parents=True, exist_ok=True)
    # Remove old single image first
    for f in img_dir.glob('img_*.jpg'):
        f.unlink()
    saved = []
    for i, url in enumerate(img_urls, 1):
        dest = img_dir / f'img_{i}.jpg'
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=20) as resp:
                data = resp.read()
            if len(data) > 5000:
                dest.write_bytes(data)
                saved.append(str(dest))
                print(f'  [{ean}] saved img_{i}.jpg ({len(data)//1024}KB)')
        except Exception as e:
            print(f'  [{ean}] img_{i} failed: {e}')
    return saved

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(user_agent=UA, viewport={'width':1440,'height':900}, locale='nl-NL')
        page = await ctx.new_page()

        results = {}
        for ean, url in TARGETS:
            print(f'\n[{ean}] fetching...')
            await page.goto(url, wait_until='load', timeout=35000)
            await page.wait_for_timeout(3000)
            try:
                await page.locator('button', has_text='Alles accepteren').click(timeout=5000)
                await page.wait_for_timeout(1500)
            except Exception:
                pass
            # Click through product images if possible
            try:
                for _ in range(8):
                    await page.locator('[data-test="image-next"]').click(timeout=1500)
                    await page.wait_for_timeout(400)
            except Exception:
                pass

            html = await page.content()

            # Price: try JSON-LD first, then look for priceValue, then itemPrice
            price = ''
            for pat in [
                r'"price":\s*"?([\d]+\.[\d]{2})"?',
                r'priceValue["\s]*:\s*["\s]*([\d]+\.[\d]{2})',
                r'"lowPrice":\s*"?([\d]+\.[\d]{2})"?',
                r'content="([\d]+\.[\d]{2})"',
            ]:
                m = re.findall(pat, html)
                if m:
                    candidates = [float(p) for p in m if 10 < float(p) < 300]
                    if candidates:
                        price = f'{min(candidates):.2f}'
                        print(f'  [{ean}] price = {price}')
                        break
            if not price:
                print(f'  [{ean}] price NOT FOUND')

            imgs = extract_images_broad(html)
            print(f'  [{ean}] found {len(imgs)} images (broad)')
            saved = download_images(ean, imgs)
            results[ean] = {'price': price, 'images': saved}

        await browser.close()

    # Patch products.json
    prod_file = OUT / 'products.json'
    data = json.loads(prod_file.read_text())
    for p in data:
        if p['ean'] in results:
            r = results[p['ean']]
            if r['price']:
                p['price'] = r['price']
            if r['images']:
                p['images_saved'] = r['images']
                p['image_urls'] = [f'(local){i}' for i in r['images']]
    prod_file.write_text(json.dumps(data, indent=2, ensure_ascii=False))
    print('\npatched products.json')

asyncio.run(main())
