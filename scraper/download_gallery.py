#!/usr/bin/env python3
"""
Downloads the galleries recorded in final.json, in bol's own carousel
order. Handles the fact that bol only serves 1200x1200 for square
originals - non-square images (e.g. 550x753) 404 at that size, so this
falls back to the exact URL the page itself used.
"""
import json
import re
import shutil
import urllib.request
from pathlib import Path

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)
HERE = Path(__file__).parent
FINAL = HERE / "output" / "final.json"
OUT = HERE / "output" / "gallery"


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=25) as resp:
        return resp.read()


def best_bytes(src):
    """Try progressively smaller/again-original variants until one works."""
    candidates = []
    m = re.search(r'^(.*)/(\d+)x(\d+)\.jpg$', src)
    if m:
        base, w, h = m.group(1), int(m.group(2)), int(m.group(3))
        if w == h:
            candidates.append(f"{base}/1200x1200.jpg")
        else:
            # Preserve aspect: scale the long edge to 1200.
            scale = 1200 / max(w, h)
            candidates.append(f"{base}/{round(w*scale)}x{round(h*scale)}.jpg")
            candidates.append(f"{base}/{w*2}x{h*2}.jpg")
    candidates.append(src)  # always fall back to what the page used

    for c in candidates:
        try:
            data = fetch(c)
            if len(data) > 1000:
                return data, c
        except Exception:
            continue
    return None, None


def main():
    records = json.loads(FINAL.read_text())
    manifest = {}
    for rec in records:
        ean = rec["ean"]
        gallery = rec.get("gallery") or []
        if not gallery:
            print(f"[{ean}] no gallery, skipping")
            continue
        d = OUT / ean
        if d.exists():
            shutil.rmtree(d)
        d.mkdir(parents=True)

        saved = []
        for g in gallery:
            data, used = best_bytes(g["src"])
            if data is None:
                print(f"[{ean}]   FAILED {g['src'][:70]}")
                continue
            name = f"img_{len(saved) + 1}.jpg"
            (d / name).write_bytes(data)
            saved.append({"file": name, "alt": g.get("alt", "")})
        manifest[ean] = saved
        print(f"[{ean}] {len(saved)}/{len(gallery)} images")

    (HERE / "output" / "gallery_manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False))
    total = sum(len(v) for v in manifest.values())
    print(f"\n{len(manifest)} products, {total} images -> {OUT}")


if __name__ == "__main__":
    main()
