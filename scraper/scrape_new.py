"""Run scraper for specific new URLs only."""
import asyncio, sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent))
from scrape_bol import run

URLS = [
    "https://www.bol.com/nl/nl/p/koelmat-hond-l-zelfkoelende-koelmat-voor-grote-honden-verkoelende-ligmat-zomer-mat-50x90-cm/9300000327634338/",
    "https://www.bol.com/nl/nl/p/koelmat-hond-m-zelfkoelende-koelmat-voor-honden-verkoelende-ligmat-zomer-mat-50x65-cm/9300000327606365/",
    "https://www.bol.com/nl/nl/p/koelmat-hond-s-zelfkoelende-koelmat-voor-honden-verkoelende-ligmat-zomer-mat-40x50-cm/9300000327599671/",
    "https://www.bol.com/nl/nl/p/koelmat-kat-zelfkoelende-koelmat-voor-katten-verkoelende-ligmat-zomer-mat-40x50-cm/9300000327644587/",
]

asyncio.run(run(URLS))
