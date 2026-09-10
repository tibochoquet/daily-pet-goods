#!/usr/bin/env python3
"""Full scrape of the newly-discovered pet products (not yet fully scraped)."""
import asyncio, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from scrape_bol import run

URLS = [
    "https://www.bol.com/nl/nl/p/koelmat-hond-l-zelfkoelende-koelmat-voor-grote-honden-verkoelende-ligmat-zomer-mat-50x90-cm/9300000327634338/",
    "https://www.bol.com/nl/nl/p/koelmat-hond-s-zelfkoelende-koelmat-voor-honden-verkoelende-ligmat-zomer-mat-40x50-cm/9300000327599671/",
    "https://www.bol.com/nl/nl/p/hondenjas-25-cm-waterdicht-windbestendig-winterjas-kleine-hond-chihuahua-reflecterend/9300000386568309/",
    "https://www.bol.com/nl/nl/p/hondenjas-35-cm-middelgrote-hond-beagle-waterdicht-windbestendig-warme-winterjas-reflecterend/9300000386598590/",
    "https://www.bol.com/nl/nl/p/kattenjas-25-cm-winterjas-voor-naaktkat-sphynx-kat-warm-waterdicht-windbestendig-reflecterend/9300000386622845/",
    "https://www.bol.com/nl/nl/p/kattenjas-25-cm-winterjas-kat-warme-katten-kleding-waterdicht-windbestendig-reflecterend/9300000386611069/",
]

asyncio.run(run(URLS))
