import asyncio, re
from playwright.async_api import async_playwright

UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

URLS = [
    ('9300000327634338', 'https://www.bol.com/nl/nl/p/koelmat-hond-l-zelfkoelende-koelmat-voor-grote-honden-verkoelende-ligmat-zomer-mat-50x90-cm/9300000327634338/'),
    ('9300000327644587', 'https://www.bol.com/nl/nl/p/koelmat-kat-zelfkoelende-koelmat-voor-katten-verkoelende-ligmat-zomer-mat-40x50-cm/9300000327644587/'),
]

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(user_agent=UA, viewport={'width':1440,'height':900}, locale='nl-NL')
        page = await ctx.new_page()
        for ean, url in URLS:
            await page.goto(url, wait_until='load', timeout=35000)
            await page.wait_for_timeout(3000)
            try:
                btn = page.locator('button', has_text='Alles accepteren')
                await btn.click(timeout=5000)
                await page.wait_for_timeout(1500)
            except Exception:
                pass
            html = await page.content()
            # JSON-LD price
            m = re.findall(r'"price":\s*"?([\d]+\.[\d]{2})"?', html)
            if m:
                prices = sorted(set(float(p) for p in m if 5 < float(p) < 500))
                print(f'{ean}: JSON-LD prices = {prices}')
            else:
                # comma decimal fallback
                m2 = re.findall(r'(\d{2}),(\d{2})', html)
                candidates = sorted(set(float(f'{a}.{b}') for a, b in m2 if 5 < float(f'{a}.{b}') < 200))
                print(f'{ean}: comma candidates = {candidates[:15]}')
        await browser.close()

asyncio.run(main())
