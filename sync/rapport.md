# Sync-rapport: bol.com -> dailypetgoods.nl

Toegepast op branch `sync/bol-hondenbakken`. Niet gepusht, niet gemerged.

Bron: 11 bol-listings die horen bij 6 producten op de site. Een product
heeft één gedeelde beschrijving en per maat een eigen prijs, foto's en specs.

> **Correctie op de eerste versie van dit rapport.** Die bevatte twee
> fouten, allebei door jou opgemerkt. De prijs van de houten L was fout
> overgenomen, en de conclusie "geen nieuwe foto's" klopte niet. Hoe dat
> kwam staat in §5. Alles hieronder is opnieuw nagerekend.

## 1. Prijzen

| Variant | Site was | Bol nu | |
|---|---|---|---|
| verhoogde-hondenbak — S | €35,99 | €39,99 | gewijzigd |
| verhoogde-hondenbak — M | €49,99 | €49,99 | ongewijzigd |
| verhoogde-hondenbak — L (hout) | €59,99 | €59,99 | ongewijzigd |
| dubbele-voerbak-metaal — S | €39,99 | €39,99 | ongewijzigd |
| dubbele-voerbak-metaal — L | €69,99 | €69,99 | ongewijzigd |
| voerbak-mangohout — S | €24,99 | €29,99 | gewijzigd |
| voerbak-mangohout — M | €34,99 | €34,99 | ongewijzigd |
| voerbak-mangohout — L | €44,99 | €44,99 | ongewijzigd |
| dubbele-kattenvoerbak-metaal | €34,99 | €34,99 | ongewijzigd |
| kattenvoerbak-mangohout-kattenoren | €34,99 | €39,99 | gewijzigd |
| kattenvoerbak-mangohout-dinerset | €39,99 | €39,99 | ongewijzigd |

Drie prijzen zijn gewijzigd. De houten L stond tijdens de eerste
meting op *niet leverbaar* en gaf toen geen prijs; inmiddels is hij
weer leverbaar en bevestigt bol de €59,99 die er al stond. Zie §5.

## 2. Inhoudsmaten: bol heeft de hele lijn herzien

Dit is de ingrijpendste bevinding. Bol noemt overal een kleinere inhoud
dan de site deed, en dat staat zowel in de titels als in de nieuwe
productfoto's. Het is dus een correctie aan hun kant, geen typefout.

| Variant | Site zei | Bol zegt nu |
|---|---|---|
| verhoogde-hondenbak — S | 2 x 0,5 liter | 2 x 0,3 L |
| verhoogde-hondenbak — M | 2 x 1 liter | 2 x 0,8 L |
| verhoogde-hondenbak — L | 2 x 2 liter | 2 x 1,7 L |
| dubbele-voerbak-metaal — S | *niet vermeld* | 2 x 0,3 L |
| dubbele-voerbak-metaal — L | *niet vermeld* | 2 x 1,7 L |
| voerbak-mangohout — S | 0,5 liter | 0,3 L |
| voerbak-mangohout — M | 1 liter | 0,8 L |
| voerbak-mangohout — L | 2 liter | 1,7 L |
| dubbele-kattenvoerbak-metaal | *niet vermeld* | 2 x 0,3 L |
| kattenvoerbak-mangohout-kattenoren | 250 ml | 300 ml |
| kattenvoerbak-mangohout-dinerset | 250 ml | 300 ml |

Bij de twee kattenvoerbakken zat de inhoud ook in het keuzelabel
(`2 x 250 ml` → `2 x 300 ml`) en in de lopende tekst. Die lopen mee,
anders spreken maatkeuze en specificatietabel elkaar tegen.

## 3. Foto's

Bol heeft **22 foto's vervangen** over alle 11 varianten, en de
volgorde van de galerijen aangepast. De vervangen foto's zijn precies de foto's met
maatinformatie erop:

- de **maatkaart** per variant: `MAAT S / 32 × 17 × 10 CM` heeft er een
  regel `2 × 0,3 L` bij gekregen die er eerst niet stond
- de **maattabel** met de drie honden is hernoemd: eerst `M / L / XL`
  met `0,5L / 1L / 2L`, nu `S / M / L` met `0,3L / 0,8L / 1,7L`
- de **maatdiagrammen** vermelden nu `2x 0,3L bowls` in plaats van `2x 2L bowls`

| Product | Foto's | Zelfde plek | Verplaatst | Vervangen |
|---|---|---|---|---|
| verhoogde-hondenbak — S | 10 | 5 | 2 | 3 |
| verhoogde-hondenbak — M | 9 | 4 | 2 | 3 |
| verhoogde-hondenbak — L (hout) | 9 | 3 | 3 | 3 |
| dubbele-voerbak-metaal — S | 8 | 4 | 2 | 2 |
| dubbele-voerbak-metaal — L | 8 | 5 | 1 | 2 |
| voerbak-mangohout — S | 9 | 5 | 2 | 2 |
| voerbak-mangohout — M | 9 | 5 | 2 | 2 |
| voerbak-mangohout — L | 9 | 4 | 3 | 2 |
| dubbele-kattenvoerbak-metaal | 7 | 6 | 0 | 1 |
| kattenvoerbak-mangohout-dinerset | 7 | 2 | 4 | 1 |
| kattenvoerbak-mangohout-kattenoren | 9 | 5 | 3 | 1 |

De volgorde volgt nu bol's eigen carousel, en de hoofdfoto is overal
bol's eerste foto — de foto met het huisdier erbij.

**Resolutie.** De 22 nieuwe foto's levert bol alleen op 550 × 550; de
grotere formaten geven een 404. De overige foto's staan nog op
1200 × 1200. Dat is dus geen keuze van mij maar wat bol heeft.

## 4. Titels en beschrijvingen

Ongewijzigd gelaten. De bol-teksten verschillen per maat en eindigen in
een zoekwoordenlijst; letterlijk overnemen zou de pagina's rommeliger
maken zonder iets feitelijks toe te voegen. Alleen de inhoudsmaten die
in de lopende tekst stonden zijn gecorrigeerd.

## 5. De twee fouten uit de eerste versie

**De prijs van de houten L (9300000279049983).** Die stond tijdens de
eerste meting op bol op *niet leverbaar*. Daardoor gaf bol er geen prijs
bij, en viel mijn scraper terug op de prijs die elders op de pagina
zichtbaar was. Dat bleek de prijs van een ander product in het "Bekijk
ook eens"-blok: de **metalen** L van €69,99. Beide heten "Verhoogde
Hondenbak L", dus dat viel niet op. Jouw vermoeden klopte precies.

Bewijs van toen: de variantenlijst van die pagina bevatte S, M, de
metalen S en de metalen L — de houten L stond niet in zijn eigen
variantenlijst.

Inmiddels is hij weer leverbaar, en nu geeft bol wél een eigen prijs:
**€59,99**, precies het bedrag dat er al stond. De gecorrigeerde prijs
is daarmee door de bron zelf bevestigd.

**"Geen nieuwe foto's."** Mijn scraper haalde elke foto op als
`1200x1200`. Van recent geüploade foto's heeft bol dat formaat niet —
alleen `550x550` — en dan geeft bol een 404. De downloadfunctie had
daar een terugvaloptie voor, maar die werkte niet: de url werd al naar
`1200x1200` herschreven *voordat* die functie hem zag, waardoor het
oorspronkelijke formaat niet meer te achterhalen was. Elke 404 leidde
tot een `continue`, en zo verdween de foto geruisloos uit de galerij.

Dat raakte exact de vervangen foto's, want dat zijn de nieuw
geüploade. Het aantal gemiste foto's per product klopt precies met het
aantal vervangen foto's per product. De vergelijking draaide dus over
een set waaruit juist de gewijzigde foto's waren weggevallen, en
concludeerde dat er niets veranderd was.

Eén ding hielp die fout verbergen: mijn perceptuele hash vergelijkt een
thumbnail van 9 × 8 pixels. Een maatkaart waarop alleen `2 × 0,5 L` in
`2 × 0,3 L` verandert is op die schaal niet van het origineel te
onderscheiden. De vervangen foto's zijn uiteindelijk gevonden aan hun
afwijkende hash-segment in de bol-url, wat een andere uploadbatch
verraadt.

Beide bugs zijn gerepareerd in `sync/scrape_bol_snapshot.py` en
`sync/compare.py`. De snapshot is daarna opnieuw opgehaald en levert nu
per product evenveel foto's als de site, byte voor byte identiek.

## 6. De houten L, opgelost

In de vorige versie van dit rapport stond hier een open vraag. Die
variant was op bol niet leverbaar en hield daardoor zijn **oude** foto's
(`MAAT L / 2 × 2 L`, een maatdiagram met `2x 2L bowls` en de oude tabel
`M / L / XL`), terwijl zijn specificatietabel al `2 x 1,7 liter` zei.
Foto's en specs spraken elkaar tegen, en elke oplossing was een gok.

Dat hoeft niet meer. Hij is weer leverbaar en bol heeft er dezelfde
herziening op toegepast als bij de rest: drie vervangen foto's, met
`MAAT L / 50 × 27 × 16 CM / 2 × 1,7 L`, de nieuwe tabel `S / M / L` en
een maatdiagram met `2x 1.7L bowls`. Die zijn overgenomen. De specs
worden nu dus door bol's eigen fotomateriaal bevestigd, en de
tegenspraak is weg.

## 7. Wat er is gewijzigd

- `lib/products.ts` — 3 prijzen, 11 inhoudsmaten, 2 keuzelabels
- `public/assets/products/` — 22 vervangen foto's, volgorde gelijkgetrokken
  met bol, over alle 11 varianten
- `app/honden/page.tsx` en `app/shop/page.tsx` — de vaste prijzen in de
  hero-labels, die anders een verouderd bedrag zouden tonen

Niet aangeraakt: slugs, SEO-velden, categorieën, voorraad en andere
producten.

Gecontroleerd: `tsc`, `eslint` en `next build` zijn groen, en alle 11
varianten zijn in een browser nagelopen op prijs, inhoudsmaat en
of elke foto werkelijk laadt (0 kapotte afbeeldingen).
