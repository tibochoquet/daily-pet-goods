# Sync-rapport: bol.com -> dailypetgoods.nl

Dry-run. Er is **niets** aan de site gewijzigd.

Bron: 11 bol-listings, snapshot in `sync/bol-snapshot/`.
Die 11 listings horen bij 6 producten op de site; een product heeft
één gedeelde beschrijving en per maat een eigen prijs, foto's en specs.

## 1. Prijzen

| Variant | Site nu | Bol nu | Verschil | |
|---|---|---|---|---|
| verhoogde-hondenbak — S | €35.99 | €39.99 | +11.1% | wijzigen |
| verhoogde-hondenbak — M | €49.99 | €49.99 | — | ongewijzigd |
| verhoogde-hondenbak — L | €59.99 | €69.99 | +16.7% **>15%** | wijzigen |
| dubbele-voerbak-metaal — S | €39.99 | €39.99 | — | ongewijzigd |
| dubbele-voerbak-metaal — L | €69.99 | €69.99 | — | ongewijzigd |
| voerbak-mangohout — S | €24.99 | €29.99 | +20.0% **>15%** | wijzigen |
| voerbak-mangohout — M | €34.99 | €34.99 | — | ongewijzigd |
| voerbak-mangohout — L | €44.99 | €44.99 | — | ongewijzigd |
| dubbele-kattenvoerbak-metaal — 29 x 15 x 8 cm | €34.99 | €34.99 | — | ongewijzigd |
| kattenvoerbak-mangohout-kattenoren — 2 x 250 ml | €34.99 | €39.99 | +14.3% | wijzigen |
| kattenvoerbak-mangohout-dinerset — 2 x 250 ml | €39.99 | €39.99 | — | ongewijzigd |

4 van de 11 prijzen zijn gewijzigd, waarvan **2 meer dan 15%**.

## 2. Specificaties: de inhoudsmaten kloppen niet meer

Bol noemt een andere inhoud dan wat de site toont. Dit staat zowel in de
bol-titel als in de beschrijving, dus het lijkt een correctie aan hun
kant en geen typefout.

| Variant | Site zegt | Bol zegt nu |
|---|---|---|
| verhoogde-hondenbak — S | 2 x 0,5 liter | 2x 0,3L |
| verhoogde-hondenbak — M | 2 x 1 liter | 2x 0,8L |
| verhoogde-hondenbak — L | 2 x 2 liter | 2x 1,7L |
| dubbele-voerbak-metaal — S | *niet vermeld* | 2x 0,3L |
| dubbele-voerbak-metaal — L | *niet vermeld* | 2x 1,7L |
| voerbak-mangohout — S | 0,5 liter | 0,3L |
| voerbak-mangohout — M | 1 liter | 0,8L |
| voerbak-mangohout — L | 2 liter | 1,7L |
| dubbele-kattenvoerbak-metaal — 29 x 15 x 8 cm | *niet vermeld* | 2x 0,3L |
| kattenvoerbak-mangohout-kattenoren — 2 x 250 ml | 250 ml | 2x 300 ml |
| kattenvoerbak-mangohout-dinerset — 2 x 250 ml | 250 ml | 2x 300 ml |

**11 varianten** wijken af. Het patroon is consistent over de
hele voerbaklijn: 0,5L → 0,3L, 1L → 0,8L, 2L → 1,7L en 250 ml → 300 ml.
Dat wijst op een hermeting bij de leverancier, niet op een typefout.

> Dit raakt je productpagina's inhoudelijk: klanten kiezen een maat op
> basis van deze liters. Staat er straks 0,3L waar nu 0,5L staat, dan is
> dat geen cosmetische wijziging maar een correctie van onjuiste info.

Twee gevolgen die je moet weten:

1. Bij de twee kattenvoerbakken staat de inhoud **in het keuzelabel zelf**
   ("2 x 250 ml"). Dat label moet dan mee naar "2 x 300 ml", anders spreekt
   de maatkeuze de specificatietabel eronder tegen.
2. Bij de drie metalen bakken staat nu **helemaal geen inhoud** op de site.
   Die kan ik toevoegen, maar dat is nieuwe informatie in plaats van een
   correctie — zeg maar of je dat wilt.

## 3. Titels

De site gebruikt eigen, korte productnamen; bol gebruikt lange
zoekwoordtitels. Dat is een bewust verschil en hoeft niet gelijkgetrokken
te worden. Ter referentie de huidige bol-titels:

| Variant | Naam op de site | Titel op bol |
|---|---|---|
| S | Verhoogde Hondenbak | Verhoogde Hondenbak S – Dubbele Voerbak voor Kleine Honden zoals Chihu |
| M | Verhoogde Hondenbak | Verhoogde Hondenbak M – Dubbele Voerbak voor Middelgrote Honden zoals  |
| L | Verhoogde Hondenbak | Verhoogde Hondenbak L – Dubbele Voerbak voor Grote Honden zoals Austra |
| S | Dubbele Voerbak Metaal | Hondenbak S – Dubbele Metalen Voerbak voor Kleine Honden zoals Chihuah |
| L | Dubbele Voerbak Metaal | Verhoogde Hondenbak L – Dubbele Metalen Voerbak voor Grote Honden zoal |
| S | Voerbak Mangohout | Voerbak Mangohout 0,3L – Luxe RVS Voer- & Drinkbak – Stijlvolle Houten |
| M | Voerbak Mangohout | Hondenvoerbak Mangohout 0,8L – Luxe RVS Voer- & Drinkbak – Stijlvolle  |
| L | Voerbak Mangohout | Grote Hondenvoerbak Mangohout 1,7L – Luxe RVS Voer- & Drinkbak – Stijl |
| 29 x 15 x 8 cm | Dubbele Kattenvoerbak Metaal | Dubbele Kattenvoerbak Metaal – 2 Uitneembare RVS Bakken – Voer- & Drin |
| 2 x 250 ml | Kattenvoerbak Mangohout Kattenoren | Kattenvoerbak Dubbel – Luxe Kattenvoerbak Mangohout met RVS Bakken – D |
| 2 x 250 ml | Kattenvoerbak Mangohout Dinerset | Dubbele Kattenvoerbak Mangohout – 2x 300 ml RVS Bakken – Luxe Voer- &  |

## 4. Foto's

Vergeleken op sha256 (byte-identiek) en dHash (zelfde beeld, andere
resolutie/compressie). Ongewijzigde foto's blijven staan met hun
huidige bestandsnaam en pad.

| Variant | Op bol | Op site | Identiek | Zelfde beeld | Nieuw | Vervalt |
|---|---|---|---|---|---|---|
| verhoogde-hondenbak — S | 7 | 10 | 7 | 0 | 0 | 3 |
| verhoogde-hondenbak — M | 6 | 9 | 6 | 0 | 0 | 3 |
| verhoogde-hondenbak — L | 6 | 9 | 6 | 0 | 0 | 3 |
| dubbele-voerbak-metaal — S | 6 | 8 | 6 | 0 | 0 | 2 |
| dubbele-voerbak-metaal — L | 6 | 8 | 6 | 0 | 0 | 2 |
| voerbak-mangohout — S | 7 | 9 | 7 | 0 | 0 | 2 |
| voerbak-mangohout — M | 7 | 9 | 7 | 0 | 0 | 2 |
| voerbak-mangohout — L | 7 | 9 | 7 | 0 | 0 | 2 |
| dubbele-kattenvoerbak-metaal — 29 x 15 x 8 cm | 6 | 7 | 6 | 0 | 0 | 1 |
| kattenvoerbak-mangohout-kattenoren — 2 x 250 ml | 6 | 7 | 6 | 0 | 0 | 1 |
| kattenvoerbak-mangohout-dinerset — 2 x 250 ml | 8 | 9 | 8 | 0 | 0 | 1 |

> **Let op bij "vervalt".** Bol heeft zijn galerijen ingekort: er komt geen
> enkele nieuwe foto bij, er vallen er alleen af. Het gaat om bestaande,
> prima productfoto's die nu gewoon niet meer in de bol-carrousel staan.
> Ze weghalen is dus geen correctie van iets fouts. Ik stel voor ze te
> **laten staan** tenzij je zegt dat de site exact bol moet volgen —
> zeg het, dan haal ik ze weg.

### Per variant in detail

**verhoogde-hondenbak — S** (`9300000271745950`)

- positie 1: identiek, blijft `img_1.jpg`
- positie 2: identiek, blijft `img_2.jpg`
- positie 3: identiek, blijft `img_3.jpg`
- positie 4: identiek, blijft `img_4.jpg`
- positie 5: identiek, blijft `img_7.jpg` — staat nu op positie 7, verschuift
- positie 6: identiek, blijft `img_6.jpg`
- positie 7: identiek, blijft `img_10.jpg` — staat nu op positie 10, verschuift
- `img_5.jpg` komt niet meer voor op bol — **vervalt**
- `img_8.jpg` komt niet meer voor op bol — **vervalt**
- `img_9.jpg` komt niet meer voor op bol — **vervalt**

**verhoogde-hondenbak — M** (`9300000271740188`)

- positie 1: identiek, blijft `img_1.jpg`
- positie 2: identiek, blijft `img_7.jpg` — staat nu op positie 7, verschuift
- positie 3: identiek, blijft `img_3.jpg`
- positie 4: identiek, blijft `img_4.jpg`
- positie 5: identiek, blijft `img_6.jpg` — staat nu op positie 6, verschuift
- positie 6: identiek, blijft `img_2.jpg` — staat nu op positie 2, verschuift
- `img_5.jpg` komt niet meer voor op bol — **vervalt**
- `img_8.jpg` komt niet meer voor op bol — **vervalt**
- `img_9.jpg` komt niet meer voor op bol — **vervalt**

**verhoogde-hondenbak — L** (`9300000279049983`)

- positie 1: identiek, blijft `img_1.jpg`
- positie 2: identiek, blijft `img_4.jpg` — staat nu op positie 4, verschuift
- positie 3: identiek, blijft `img_7.jpg` — staat nu op positie 7, verschuift
- positie 4: identiek, blijft `img_8.jpg` — staat nu op positie 8, verschuift
- positie 5: identiek, blijft `img_3.jpg` — staat nu op positie 3, verschuift
- positie 6: identiek, blijft `img_6.jpg`
- `img_2.jpg` komt niet meer voor op bol — **vervalt**
- `img_5.jpg` komt niet meer voor op bol — **vervalt**
- `img_9.jpg` komt niet meer voor op bol — **vervalt**

**dubbele-voerbak-metaal — S** (`9300000318561941`)

- positie 1: identiek, blijft `img_1.jpg`
- positie 2: identiek, blijft `img_2.jpg`
- positie 3: identiek, blijft `img_4.jpg` — staat nu op positie 4, verschuift
- positie 4: identiek, blijft `img_3.jpg` — staat nu op positie 3, verschuift
- positie 5: identiek, blijft `img_6.jpg` — staat nu op positie 6, verschuift
- positie 6: identiek, blijft `img_7.jpg` — staat nu op positie 7, verschuift
- `img_5.jpg` komt niet meer voor op bol — **vervalt**
- `img_8.jpg` komt niet meer voor op bol — **vervalt**

**dubbele-voerbak-metaal — L** (`9300000318638430`)

- positie 1: identiek, blijft `img_1.jpg`
- positie 2: identiek, blijft `img_8.jpg` — staat nu op positie 8, verschuift
- positie 3: identiek, blijft `img_3.jpg`
- positie 4: identiek, blijft `img_4.jpg`
- positie 5: identiek, blijft `img_6.jpg` — staat nu op positie 6, verschuift
- positie 6: identiek, blijft `img_7.jpg` — staat nu op positie 7, verschuift
- `img_2.jpg` komt niet meer voor op bol — **vervalt**
- `img_5.jpg` komt niet meer voor op bol — **vervalt**

**voerbak-mangohout — S** (`9300000291844620`)

- positie 1: identiek, blijft `img_1.jpg`
- positie 2: identiek, blijft `img_2.jpg`
- positie 3: identiek, blijft `img_3.jpg`
- positie 4: identiek, blijft `img_4.jpg`
- positie 5: identiek, blijft `img_7.jpg` — staat nu op positie 7, verschuift
- positie 6: identiek, blijft `img_6.jpg`
- positie 7: identiek, blijft `img_9.jpg` — staat nu op positie 9, verschuift
- `img_5.jpg` komt niet meer voor op bol — **vervalt**
- `img_8.jpg` komt niet meer voor op bol — **vervalt**

**voerbak-mangohout — M** (`9300000291847351`)

- positie 1: identiek, blijft `img_1.jpg`
- positie 2: identiek, blijft `img_2.jpg`
- positie 3: identiek, blijft `img_3.jpg`
- positie 4: identiek, blijft `img_4.jpg`
- positie 5: identiek, blijft `img_8.jpg` — staat nu op positie 8, verschuift
- positie 6: identiek, blijft `img_7.jpg` — staat nu op positie 7, verschuift
- positie 7: identiek, blijft `img_6.jpg` — staat nu op positie 6, verschuift
- `img_5.jpg` komt niet meer voor op bol — **vervalt**
- `img_9.jpg` komt niet meer voor op bol — **vervalt**

**voerbak-mangohout — L** (`9300000291848114`)

- positie 1: identiek, blijft `img_1.jpg`
- positie 2: identiek, blijft `img_2.jpg`
- positie 3: identiek, blijft `img_3.jpg`
- positie 4: identiek, blijft `img_4.jpg`
- positie 5: identiek, blijft `img_9.jpg` — staat nu op positie 9, verschuift
- positie 6: identiek, blijft `img_6.jpg`
- positie 7: identiek, blijft `img_7.jpg`
- `img_5.jpg` komt niet meer voor op bol — **vervalt**
- `img_8.jpg` komt niet meer voor op bol — **vervalt**

**dubbele-kattenvoerbak-metaal — 29 x 15 x 8 cm** (`9300000318643928`)

- positie 1: identiek, blijft `img_1.jpg`
- positie 2: identiek, blijft `img_2.jpg`
- positie 3: identiek, blijft `img_3.jpg`
- positie 4: identiek, blijft `img_4.jpg`
- positie 5: identiek, blijft `img_6.jpg` — staat nu op positie 6, verschuift
- positie 6: identiek, blijft `img_7.jpg` — staat nu op positie 7, verschuift
- `img_5.jpg` komt niet meer voor op bol — **vervalt**

**kattenvoerbak-mangohout-kattenoren — 2 x 250 ml** (`9300000318542325`)

- positie 1: identiek, blijft `img_1.jpg`
- positie 2: identiek, blijft `img_2.jpg`
- positie 3: identiek, blijft `img_7.jpg` — staat nu op positie 7, verschuift
- positie 4: identiek, blijft `img_6.jpg` — staat nu op positie 6, verschuift
- positie 5: identiek, blijft `img_5.jpg`
- positie 6: identiek, blijft `img_3.jpg` — staat nu op positie 3, verschuift
- `img_4.jpg` komt niet meer voor op bol — **vervalt**

**kattenvoerbak-mangohout-dinerset — 2 x 250 ml** (`9300000318515889`)

- positie 1: identiek, blijft `img_1.jpg`
- positie 2: identiek, blijft `img_2.jpg`
- positie 3: identiek, blijft `img_3.jpg`
- positie 4: identiek, blijft `img_9.jpg` — staat nu op positie 9, verschuift
- positie 5: identiek, blijft `img_4.jpg` — staat nu op positie 4, verschuift
- positie 6: identiek, blijft `img_7.jpg` — staat nu op positie 7, verschuift
- positie 7: identiek, blijft `img_8.jpg` — staat nu op positie 8, verschuift
- positie 8: identiek, blijft `img_5.jpg` — staat nu op positie 5, verschuift
- `img_6.jpg` komt niet meer voor op bol — **vervalt**

## 5. Beschrijvingen

Hier zit een keuze in die ik niet voor je wil maken.

De site heeft per product één verzorgde Nederlandse beschrijving.
De bol-beschrijvingen zijn opgebouwd uit marketingblokken met daarachter
een lange zoekwoordenlijst, en ze verschillen per maat. Letterlijk
overnemen zou de tekst op de site langer en rommeliger maken.

Wat er inhoudelijk is veranderd, is de inhoudsmaat (zie punt 2). Dat is
het enige feitelijke verschil dat ik in de bol-teksten terugzie.

| Variant | Lengte site | Lengte bol | Bol bevat zoekwoordblok |
|---|---|---|---|
| verhoogde-hondenbak — S | 609 tekens | 2354 tekens | ja |
| verhoogde-hondenbak — M | 609 tekens | 2473 tekens | ja |
| verhoogde-hondenbak — L | 609 tekens | 2700 tekens | ja |
| dubbele-voerbak-metaal — S | 469 tekens | 2674 tekens | ja |
| dubbele-voerbak-metaal — L | 469 tekens | 2551 tekens | ja |
| voerbak-mangohout — S | 411 tekens | 1457 tekens | ja |
| voerbak-mangohout — M | 411 tekens | 1459 tekens | ja |
| voerbak-mangohout — L | 411 tekens | 1444 tekens | ja |
| dubbele-kattenvoerbak-metaal — 29 x 15 x 8 cm | 463 tekens | 1245 tekens | nee |
| kattenvoerbak-mangohout-kattenoren — 2 x 250 ml | 453 tekens | 1832 tekens | ja |
| kattenvoerbak-mangohout-dinerset — 2 x 250 ml | 445 tekens | 1314 tekens | ja |

## 6. Samenvatting

- **Prijzen:** 4 wijzigen
- **Inhoudsmaten:** 11 kloppen niet meer
- **Foto's:** 72 blijven ongemoeid, 0 nieuw, 22 vervallen
- **Matching:** alle 11 op bol-ID gekoppeld, geen onzekere matches
- **Niet gevonden:** geen producten die alleen op bol of alleen op de site staan
