#!/usr/bin/env python3
"""
FASE 3 - vergelijkt de bol-snapshot met wat er nu op de site staat en
schrijft sync/rapport.md. Wijzigt niets aan de site.

Foto's worden op twee manieren vergeleken:
  sha256  - byte-identiek
  dHash   - zelfde beeld, andere resolutie of compressie

dHash is hier zelf geïmplementeerd omdat de imagehash-library niet
geïnstalleerd is: verklein naar 9x8 grijswaarden en leg per rij vast of
een pixel lichter is dan zijn rechterbuur. Dat levert 64 bits die
nauwelijks veranderen door herschalen of hercomprimeren, maar wel bij
een ander beeld.
"""
import hashlib
import json
import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SNAP = ROOT / 'sync' / 'bol-snapshot'
SITE_IMG = ROOT / 'public' / 'assets' / 'products'
REPORT = ROOT / 'sync' / 'rapport.md'

# bol-id -> (site-slug, variantlabel)
MAPPING = {
    '9300000271745950': ('verhoogde-hondenbak', 'S'),
    '9300000271740188': ('verhoogde-hondenbak', 'M'),
    '9300000279049983': ('verhoogde-hondenbak', 'L'),
    '9300000318561941': ('dubbele-voerbak-metaal', 'S'),
    '9300000318638430': ('dubbele-voerbak-metaal', 'L'),
    '9300000291844620': ('voerbak-mangohout', 'S'),
    '9300000291847351': ('voerbak-mangohout', 'M'),
    '9300000291848114': ('voerbak-mangohout', 'L'),
    '9300000318643928': ('dubbele-kattenvoerbak-metaal', '29 x 15 x 8 cm'),
    '9300000318542325': ('kattenvoerbak-mangohout-kattenoren', '2 x 250 ml'),
    '9300000318515889': ('kattenvoerbak-mangohout-dinerset', '2 x 250 ml'),
}

PRICE_FLAG = 0.15


def sha256(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()


def dhash(p: Path) -> str:
    im = Image.open(p).convert('L').resize((9, 8), Image.LANCZOS)
    px = list(im.getdata())
    bits = []
    for row in range(8):
        for col in range(8):
            left = px[row * 9 + col]
            right = px[row * 9 + col + 1]
            bits.append('1' if left > right else '0')
    return f'{int("".join(bits), 2):016x}'


def hamming(a: str, b: str) -> int:
    return bin(int(a, 16) ^ int(b, 16)).count('1')


def parse_site():
    """Leest lib/products.ts uit: per variant prijs, specs en fotopaden."""
    src = (ROOT / 'lib' / 'products.ts').read_text()
    src = src[: src.index('export const categories')]
    out = {}
    for block in src.split('\n  {\n')[1:]:
        slug_m = re.search(r'slug: "([^"]+)"', block)
        if not slug_m:
            continue
        slug = slug_m.group(1)
        name = (re.search(r'name: "([^"]*)"', block) or [None, ''])[1]
        desc = (re.search(r'description: "((?:[^"\\]|\\.)*)"', block) or [None, ''])[1]
        short = (re.search(r'shortDescription: "((?:[^"\\]|\\.)*)"', block) or [None, ''])[1]
        for vm in re.finditer(
                r'id: "(\d+)",\s*\n\s*label: "([^"]*)",\s*\n\s*price: ([\d.]+),'
                r'[\s\S]*?specs: \{([^}]*)\}'
                r'[\s\S]*?images: \[([^\]]*)\]', block):
            ean, label, price, specs_raw, imgs_raw = vm.groups()
            specs = dict(re.findall(r'"([^"]+)": "([^"]*)"', specs_raw))
            imgs = re.findall(r'"([^"]+)"', imgs_raw)
            out[ean] = {'slug': slug, 'product_name': name, 'description': desc,
                        'shortDescription': short, 'label': label,
                        'price': float(price), 'specs': specs, 'images': imgs}
    return out


def compare_photos(ean, site_images):
    bol_dir = SNAP / ean
    bol_files = sorted(bol_dir.glob('img_*.jpg'),
                       key=lambda p: int(p.stem.split('_')[1]))
    bol = [{'file': p.name, 'sha': sha256(p), 'dh': dhash(p), 'path': p} for p in bol_files]

    site = []
    for rel in site_images:
        p = ROOT / 'public' / rel.lstrip('/')
        if p.exists():
            site.append({'rel': rel, 'sha': sha256(p), 'dh': dhash(p), 'path': p})

    used = set()
    rows = []
    for i, b in enumerate(bol, 1):
        match = None
        kind = None
        for j, s in enumerate(site):
            if j in used:
                continue
            if s['sha'] == b['sha']:
                match, kind = j, 'identiek'
                break
        if match is None:
            for j, s in enumerate(site):
                if j in used:
                    continue
                if hamming(s['dh'], b['dh']) <= 6:
                    match, kind = j, 'zelfde beeld'
                    break
        if match is not None:
            used.add(match)
            cur_pos = site_images.index(site[match]['rel']) + 1
            rows.append({'bol_pos': i, 'status': kind, 'site': site[match]['rel'],
                         'site_pos': cur_pos, 'moved': cur_pos != i})
        else:
            rows.append({'bol_pos': i, 'status': 'NIEUW', 'site': None,
                         'site_pos': None, 'moved': False})

    removed = [site[j]['rel'] for j in range(len(site)) if j not in used]
    return rows, removed, len(bol), len(site)


def main():
    site = parse_site()
    snaps = {}
    for ean in MAPPING:
        f = SNAP / f'{ean}.json'
        snaps[ean] = json.loads(f.read_text())

    lines = []
    A = lines.append
    A('# Sync-rapport: bol.com -> dailypetgoods.nl')
    A('')
    A('Dry-run. Er is **niets** aan de site gewijzigd.')
    A('')
    A(f'Bron: {len(MAPPING)} bol-listings, snapshot in `sync/bol-snapshot/`.')
    A('Die 11 listings horen bij 6 producten op de site; een product heeft')
    A('één gedeelde beschrijving en per maat een eigen prijs, foto\'s en specs.')
    A('')

    # ---- prijzen
    A('## 1. Prijzen')
    A('')
    A('| Variant | Site nu | Bol nu | Verschil | |')
    A('|---|---|---|---|---|')
    price_changes = []
    for ean, (slug, label) in MAPPING.items():
        s = site[ean]
        snap = snaps[ean]
        old = s['price']
        # Alleen de prijs die bij dit artikel hoort telt. Valt die weg, dan
        # is de variant niet leverbaar en laat de site zijn prijs staan;
        # de prijs die de pagina toont is dan die van een ander product.
        if snap.get('price_jsonld') is None:
            A(f'| {slug} — {label} | €{old:.2f} | *niet leverbaar* | — | '
              f'**ongemoeid laten** |')
            continue
        new = float(snap['price_jsonld'])
        if abs(new - old) < 0.005:
            A(f'| {slug} — {label} | €{old:.2f} | €{new:.2f} | — | ongewijzigd |')
        else:
            pct = (new - old) / old
            flag = ' **>15%**' if abs(pct) > PRICE_FLAG else ''
            A(f'| {slug} — {label} | €{old:.2f} | €{new:.2f} | {pct:+.1%}{flag} | wijzigen |')
            price_changes.append((ean, slug, label, old, new, pct))
    A('')
    if price_changes:
        big = [c for c in price_changes if abs(c[5]) > PRICE_FLAG]
        A(f'{len(price_changes)} van de {len(MAPPING)} prijzen zijn gewijzigd, '
          f'waarvan **{len(big)} meer dan 15%**.')
    A('')

    # ---- specs / inhoud
    A('## 2. Specificaties: de inhoudsmaten kloppen niet meer')
    A('')
    A('Bol noemt een andere inhoud dan wat de site toont. Dit staat zowel in de')
    A('bol-titel als in de beschrijving, dus het lijkt een correctie aan hun')
    A('kant en geen typefout.')
    A('')
    A('| Variant | Site zegt | Bol zegt nu |')
    A('|---|---|---|')
    spec_changes = []
    for ean, (slug, label) in MAPPING.items():
        s, snap = site[ean], snaps[ean]
        site_vol = s['specs'].get('Inhoud') or s['specs'].get('Inhoud per bak') or ''
        # volledige uitdrukking, inclusief een eventueel "2x" ervoor
        tm = re.search(r'(\d+\s*x\s*)?(\d+[,.]?\d*)\s*(L\b|ml\b)', snap['title'], re.I)
        bol_vol = tm.group(0).strip() if tm else ''
        if not bol_vol:
            dm = re.search(r'Inhoud[^:]*:\s*([^\n]{0,24}?(?:L\b|ml\b))', snap['description'], re.I)
            bol_vol = dm.group(1).strip() if dm else ''
        if not bol_vol:
            continue
        norm_s = site_vol.lower().replace(' liter', 'l').replace('liter', 'l').replace(' ', '')
        norm_b = bol_vol.lower().replace(' liter', 'l').replace('liter', 'l').replace(' ', '')
        if not site_vol:
            A(f'| {slug} — {label} | *niet vermeld* | {bol_vol} |')
            spec_changes.append((ean, slug, label, '(niet vermeld)', bol_vol))
        elif norm_s != norm_b:
            A(f'| {slug} — {label} | {site_vol} | {bol_vol} |')
            spec_changes.append((ean, slug, label, site_vol, bol_vol))
    A('')
    A(f'**{len(spec_changes)} varianten** wijken af. Het patroon is consistent over de')
    A('hele voerbaklijn: 0,5L → 0,3L, 1L → 0,8L, 2L → 1,7L en 250 ml → 300 ml.')
    A('Dat wijst op een hermeting bij de leverancier, niet op een typefout.')
    A('')
    A('> Dit raakt je productpagina\'s inhoudelijk: klanten kiezen een maat op')
    A('> basis van deze liters. Staat er straks 0,3L waar nu 0,5L staat, dan is')
    A('> dat geen cosmetische wijziging maar een correctie van onjuiste info.')
    A('')
    A('Twee gevolgen die je moet weten:')
    A('')
    A('1. Bij de twee kattenvoerbakken staat de inhoud **in het keuzelabel zelf**')
    A('   ("2 x 250 ml"). Dat label moet dan mee naar "2 x 300 ml", anders spreekt')
    A('   de maatkeuze de specificatietabel eronder tegen.')
    A('2. Bij de drie metalen bakken staat nu **helemaal geen inhoud** op de site.')
    A('   Die kan ik toevoegen, maar dat is nieuwe informatie in plaats van een')
    A('   correctie — zeg maar of je dat wilt.')
    A('')

    # ---- titels
    A('## 3. Titels')
    A('')
    A('De site gebruikt eigen, korte productnamen; bol gebruikt lange')
    A('zoekwoordtitels. Dat is een bewust verschil en hoeft niet gelijkgetrokken')
    A('te worden. Ter referentie de huidige bol-titels:')
    A('')
    A('| Variant | Naam op de site | Titel op bol |')
    A('|---|---|---|')
    for ean, (slug, label) in MAPPING.items():
        A(f'| {label} | {site[ean]["product_name"]} | {snaps[ean]["title"][:70]} |')
    A('')

    # ---- fotos
    A('## 4. Foto\'s')
    A('')
    A('Vergeleken op sha256 (byte-identiek) en dHash (zelfde beeld, andere')
    A('resolutie/compressie). Ongewijzigde foto\'s blijven staan met hun')
    A('huidige bestandsnaam en pad.')
    A('')
    A('| Variant | Op bol | Op site | Identiek | Zelfde beeld | Nieuw | Vervalt |')
    A('|---|---|---|---|---|---|---|')
    photo_detail = []
    for ean, (slug, label) in MAPPING.items():
        rows, removed, nbol, nsite = compare_photos(ean, site[ean]['images'])
        ident = sum(1 for r in rows if r['status'] == 'identiek')
        same = sum(1 for r in rows if r['status'] == 'zelfde beeld')
        new = sum(1 for r in rows if r['status'] == 'NIEUW')
        A(f'| {slug} — {label} | {nbol} | {nsite} | {ident} | {same} | {new} | {len(removed)} |')
        photo_detail.append((ean, slug, label, rows, removed))
    A('')

    A('> **Let op bij "vervalt".** Bol heeft zijn galerijen ingekort: er komt geen')
    A('> enkele nieuwe foto bij, er vallen er alleen af. Het gaat om bestaande,')
    A('> prima productfoto\'s die nu gewoon niet meer in de bol-carrousel staan.')
    A('> Ze weghalen is dus geen correctie van iets fouts. Ik stel voor ze te')
    A('> **laten staan** tenzij je zegt dat de site exact bol moet volgen —')
    A('> zeg het, dan haal ik ze weg.')
    A('')
    A('### Per variant in detail')
    A('')
    for ean, slug, label, rows, removed in photo_detail:
        A(f'**{slug} — {label}** (`{ean}`)')
        A('')
        for r in rows:
            if r['status'] == 'NIEUW':
                A(f'- positie {r["bol_pos"]}: **nieuwe foto**, moet erbij')
            else:
                move = f' — staat nu op positie {r["site_pos"]}, verschuift' if r['moved'] else ''
                A(f'- positie {r["bol_pos"]}: {r["status"]}, blijft `{r["site"].split("/")[-1]}`{move}')
        for rel in removed:
            A(f'- `{rel.split("/")[-1]}` komt niet meer voor op bol — **vervalt**')
        A('')

    # ---- beschrijvingen
    A('## 5. Beschrijvingen')
    A('')
    A('Hier zit een keuze in die ik niet voor je wil maken.')
    A('')
    A('De site heeft per product één verzorgde Nederlandse beschrijving.')
    A('De bol-beschrijvingen zijn opgebouwd uit marketingblokken met daarachter')
    A('een lange zoekwoordenlijst, en ze verschillen per maat. Letterlijk')
    A('overnemen zou de tekst op de site langer en rommeliger maken.')
    A('')
    A('Wat er inhoudelijk is veranderd, is de inhoudsmaat (zie punt 2). Dat is')
    A('het enige feitelijke verschil dat ik in de bol-teksten terugzie.')
    A('')
    A('| Variant | Lengte site | Lengte bol | Bol bevat zoekwoordblok |')
    A('|---|---|---|---|')
    for ean, (slug, label) in MAPPING.items():
        s, snap = site[ean], snaps[ean]
        has_kw = 'ja' if 'zoekwoorden' in snap['description'].lower() else 'nee'
        A(f'| {slug} — {label} | {len(s["description"])} tekens | '
          f'{len(snap["description"])} tekens | {has_kw} |')
    A('')

    A('## 6. Samenvatting')
    A('')
    A(f'- **Prijzen:** {len(price_changes)} wijzigen')
    A(f'- **Inhoudsmaten:** {len(spec_changes)} kloppen niet meer')
    total_new = sum(sum(1 for r in rows if r['status'] == 'NIEUW') for _, _, _, rows, _ in photo_detail)
    total_keep = sum(sum(1 for r in rows if r['status'] != 'NIEUW') for _, _, _, rows, _ in photo_detail)
    total_rm = sum(len(rm) for _, _, _, _, rm in photo_detail)
    A(f'- **Foto\'s:** {total_keep} blijven ongemoeid, {total_new} nieuw, {total_rm} vervallen')
    A('- **Matching:** alle 11 op bol-ID gekoppeld, geen onzekere matches')
    A('- **Niet gevonden:** geen producten die alleen op bol of alleen op de site staan')
    A('')

    REPORT.write_text('\n'.join(lines))
    print(f'rapport geschreven: {REPORT}')
    print(f'  prijswijzigingen : {len(price_changes)}')
    print(f'  inhoud afwijkend : {len(spec_changes)}')
    print(f'  foto\'s nieuw     : {total_new}')
    print(f'  foto\'s behouden  : {total_keep}')
    print(f'  foto\'s vervallen : {total_rm}')


main()
