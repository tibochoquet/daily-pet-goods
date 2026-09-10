import type { Product, Category, ProductVariant } from './types'

export const products: Product[] = [
  {
    slug: "verhoogde-hondenbak",
    name: "Verhoogde Hondenbak",
    category: "dog-feeding",
    description: "Geef jouw hond een comfortabele, gezonde en stijlvolle eetplek met deze verhoogde hondenbak. De houten voerstandaard met roestvrijstalen bakken zorgt voor een ergonomische eet- en drinkhouding, en helpt de belasting op nek en gewrichten te verminderen. Dankzij het stabiele ontwerp met antislip blijft de voerbak stevig op zijn plaats staan tijdens gebruik. De uitneembare RVS bakken zijn hygiënisch, roestvrij en eenvoudig schoon te maken, ideaal voor dagelijks gebruik met zowel voer als water. Verkrijgbaar in drie maten, van klein tot groot.",
    shortDescription: "Ergonomische, verhoogde voerbak van hout met roestvrijstalen inzet, in drie maten.",
    features: [
      "Comfortabele eetpositie: de verhoogde voerbak ondersteunt een natuurlijke, ontspannen eet- en drinkhouding.",
      "Stabiel en antislip: de stevige houten standaard blijft goed staan tijdens het eten en drinken.",
      "Hygiënisch en praktisch: twee uitneembare roestvrijstalen bakken, eenvoudig te reinigen.",
      "Duurzaam materiaal: de combinatie van hout en RVS zorgt voor een stevige en stijlvolle voerplek.",
      "Stijlvol design: het moderne houten ontwerp past mooi in verschillende interieurstijlen.",
    ],
    badge: 'bestseller',
    variants: [
      {
        id: "9300000271745950",
        label: "S",
        price: 35.99,
        bolUrl: "https://www.bol.com/nl/p/-/9300000271745950",
        specs: { "Afmetingen standaard": "32 x 17 x 10 cm", "Inhoud": "2 x 0,5 liter", "Materiaal": "hout / RVS" },
        image: "/assets/products/9300000271745950/img_1.jpg",
        images: Array.from({ length: 9 }, (_, i) => `/assets/products/9300000271745950/img_${i + 1}.jpg`),
      },
      {
        id: "9300000271740188",
        label: "M",
        price: 49.99,
        bolUrl: "https://www.bol.com/nl/p/-/9300000271740188",
        specs: { "Afmetingen standaard": "40 x 21 x 12 cm", "Inhoud": "2 x 1 liter", "Materiaal": "hout / RVS" },
        image: "/assets/products/9300000271740188/img_1.jpg",
        images: Array.from({ length: 8 }, (_, i) => `/assets/products/9300000271740188/img_${i + 1}.jpg`),
      },
      {
        id: "9300000279049983",
        label: "L",
        price: 59.99,
        bolUrl: "https://www.bol.com/nl/p/-/9300000279049983",
        specs: { "Afmetingen standaard": "50 x 27 x 16 cm", "Inhoud": "2 x 2 liter", "Materiaal": "hout / RVS" },
        image: "/assets/products/9300000279049983/img_1.jpg",
        images: Array.from({ length: 8 }, (_, i) => `/assets/products/9300000279049983/img_${i + 1}.jpg`),
      },
    ],
  },
  {
    slug: "dubbele-voerbak-metaal",
    name: "Dubbele Voerbak Metaal",
    category: "dog-feeding",
    description: "Geef jouw hond of kat een praktische en stijlvolle eetplek met deze dubbele voerbak van metaal en roestvrij staal. Twee uitneembare RVS bakken zijn ideaal voor het gelijktijdig aanbieden van voer en water, of twee verschillende soorten voeding. Het stevige metalen frame zorgt voor extra stabiliteit tijdens het eten en drinken. Verkrijgbaar in twee maten.",
    shortDescription: "Strakke dubbele voerbak van metaal met uitneembare RVS bakken, in twee maten.",
    features: [
      "Dubbele voer- en drinkbak: twee bakken voor bijvoorbeeld voer en water.",
      "Stevig metalen frame: de stevige constructie zorgt voor stabiliteit tijdens het eten en drinken.",
      "Uitneembare RVS bakken: hygiënisch, roestvrij en eenvoudig schoon te maken.",
      "Praktisch in gebruik: de bakken zijn eenvoudig uit het frame te nemen voor vullen en reinigen.",
      "Modern design: het metalen frame met RVS bakken past in vrijwel ieder interieur.",
    ],
    badge: 'bestseller',
    variants: [
      {
        id: "9300000318561941",
        label: "S",
        price: 39.99,
        bolUrl: "https://www.bol.com/nl/p/-/9300000318561941",
        specs: { "Afmetingen": "29 x 15 x 8 cm", "Materiaal": "metaal / RVS" },
        image: "/assets/products/9300000318561941/img_1.jpg",
        images: Array.from({ length: 7 }, (_, i) => `/assets/products/9300000318561941/img_${i + 1}.jpg`),
      },
      {
        id: "9300000318638430",
        label: "L",
        price: 69.99,
        bolUrl: "https://www.bol.com/nl/p/-/9300000318638430",
        specs: { "Afmetingen": "47 x 25 x 14 cm", "Materiaal": "metaal / RVS" },
        image: "/assets/products/9300000318638430/img_1.jpg",
        images: Array.from({ length: 7 }, (_, i) => `/assets/products/9300000318638430/img_${i + 1}.jpg`),
      },
    ],
  },
  {
    slug: "voerbak-mangohout",
    name: "Voerbak Mangohout",
    category: "dog-feeding",
    description: "Geef jouw hond een stijlvolle en praktische eetplek met deze luxe voerbak van mangohout en roestvrij staal. Deze premium voerbak combineert een natuurlijke houten uitstraling met dagelijks gebruiksgemak. De stevige mangohouten houder zorgt voor stabiliteit tijdens het eten en drinken, terwijl de uitneembare RVS bak eenvoudig schoon te maken is en geschikt is voor zowel voer als water. Verkrijgbaar in drie inhoudsmaten.",
    shortDescription: "Luxe voerbak van mangohout met roestvrijstalen inzet, in drie inhoudsmaten.",
    features: [
      "Luxe uitstraling: de combinatie van mangohout en RVS zorgt voor een moderne en warme uitstraling.",
      "Hygiënisch en praktisch: de roestvrijstalen bak is uitneembaar en eenvoudig schoon te maken.",
      "Stevig ontwerp: de houten houder helpt schuiven tijdens gebruik te verminderen.",
      "Veelzijdig gebruik: geschikt voor droogvoer, natvoer en water.",
    ],
    badge: 'bestseller',
    variants: [
      {
        id: "9300000291844620",
        label: "0,5 L",
        price: 24.99,
        bolUrl: "https://www.bol.com/nl/p/-/9300000291844620",
        specs: { "Inhoud": "0,5 liter", "Materiaal": "mangohout / RVS" },
        image: "/assets/products/9300000291844620/img_1.jpg",
        images: Array.from({ length: 9 }, (_, i) => `/assets/products/9300000291844620/img_${i + 1}.jpg`),
      },
      {
        id: "9300000291847351",
        label: "1 L",
        price: 34.99,
        bolUrl: "https://www.bol.com/nl/p/-/9300000291847351",
        specs: { "Inhoud": "1 liter", "Materiaal": "mangohout / RVS" },
        image: "/assets/products/9300000291847351/img_1.jpg",
        images: ["/assets/products/9300000291847351/img_1.jpg", "/assets/products/9300000291847351/img_2.jpg"],
      },
      {
        id: "9300000291848114",
        label: "2 L",
        price: 44.99,
        bolUrl: "https://www.bol.com/nl/p/-/9300000291848114",
        specs: { "Inhoud": "2 liter", "Materiaal": "mangohout / RVS" },
        image: "/assets/products/9300000291848114/img_1.jpg",
        images: ["/assets/products/9300000291848114/img_1.jpg", "/assets/products/9300000291848114/img_2.jpg"],
      },
    ],
  },
  {
    slug: "dubbele-kattenvoerbak-metaal",
    name: "Dubbele Kattenvoerbak Metaal",
    category: "cat-feeding",
    description: "Geef jouw kat een comfortabele en stijlvolle eetplek met deze dubbele kattenvoerbak van metaal en roestvrij staal. Deze praktische voer- en drinkbak bestaat uit een stevig metalen frame met twee uitneembare RVS bakken. Ideaal voor het combineren van voer en water of twee verschillende soorten voeding. De roestvrijstalen bakken zijn hygiënisch, roestvrij en eenvoudig schoon te maken.",
    shortDescription: "Dubbele kattenvoerbak van metaal met uitneembare RVS bakken.",
    features: [
      "Dubbele voer- en drinkbak: ideaal voor voer en water in één praktische oplossing.",
      "Stevig metalen frame: duurzaam ontwerp voor dagelijks gebruik.",
      "Uitneembare RVS bakken: hygiënisch, roestvrij en eenvoudig schoon te maken.",
      "Compact formaat: perfect voor katten en kittens.",
    ],
    variants: [
      {
        id: "9300000318643928",
        label: "29 x 15 x 8 cm",
        price: 34.99,
        bolUrl: "https://www.bol.com/nl/p/-/9300000318643928",
        specs: { "Afmetingen": "29 x 15 x 8 cm", "Materiaal": "metaal / RVS" },
        image: "/assets/products/9300000318643928/img_1.jpg",
        images: Array.from({ length: 7 }, (_, i) => `/assets/products/9300000318643928/img_${i + 1}.jpg`),
      },
    ],
  },
  {
    slug: "kattenvoerbak-mangohout-kattenoren",
    name: "Kattenvoerbak Mangohout Kattenoren",
    category: "cat-feeding",
    description: "Geef jouw kat een stijlvolle en praktische eetplek met deze luxe dubbele kattenvoerbak van mangohout. Deze elegante voer- en drinkbak combineert een natuurlijke houten uitstraling met twee uitneembare roestvrijstalen bakken van elk 250 ml. De subtiele kattenoren in het ontwerp geven deze voerbak een unieke uitstraling die perfect past in moderne interieurs.",
    shortDescription: "Dubbele kattenvoerbak van mangohout met kattenoren-motief, 2x 250 ml.",
    features: [
      "Dubbele voer- en drinkbak: ideaal voor voer en water of verschillende soorten voeding.",
      "Luxe mangohout: stevig natuurlijk hout met een warme en stijlvolle uitstraling.",
      "Hygiënische RVS bakken: uitneembaar, roestvrij en eenvoudig schoon te maken.",
      "Uniek kattenontwerp: voorzien van subtiele uitgesneden kattenoren voor een speelse en luxe uitstraling.",
    ],
    variants: [
      {
        id: "9300000318542325",
        label: "2 x 250 ml",
        price: 34.99,
        bolUrl: "https://www.bol.com/nl/p/-/9300000318542325",
        specs: { "Inhoud per bak": "250 ml", "Materiaal": "mangohout / RVS" },
        image: "/assets/products/9300000318542325/img_1.jpg",
        images: Array.from({ length: 7 }, (_, i) => `/assets/products/9300000318542325/img_${i + 1}.jpg`),
      },
    ],
  },
  {
    slug: "kattenvoerbak-mangohout-dinerset",
    name: "Kattenvoerbak Mangohout Dinerset",
    category: "cat-feeding",
    description: "Geef jouw kat een stijlvolle en praktische eetplek met deze luxe dubbele kattenvoerbak van mangohout. Deze elegante dinerset combineert een natuurlijke houten uitstraling met twee uitneembare roestvrijstalen bakken van elk 250 ml. De stevige mangohouten houder zorgt voor stabiliteit tijdens het eten en drinken, terwijl de RVS bakken eenvoudig uitneembaar en schoon te maken zijn.",
    shortDescription: "Dubbele kattenvoerbak van mangohout als houten dinerset, 2x 250 ml.",
    features: [
      "Luxe mangohout: stevig natuurlijk hout met een warme, stijlvolle uitstraling.",
      "Twee uitneembare RVS bakken: elk 250 ml, hygiënisch en makkelijk schoon te maken.",
      "Stabiel ontwerp: de houten houder voorkomt verschuiven tijdens gebruik.",
      "Modern design: past in vrijwel ieder interieur.",
    ],
    variants: [
      {
        id: "9300000318515889",
        label: "2 x 250 ml",
        price: 39.99,
        bolUrl: "https://www.bol.com/nl/p/-/9300000318515889",
        specs: { "Inhoud per bak": "250 ml", "Materiaal": "mangohout / RVS" },
        image: "/assets/products/9300000318515889/img_1.jpg",
        images: Array.from({ length: 9 }, (_, i) => `/assets/products/9300000318515889/img_${i + 1}.jpg`),
      },
    ],
  },
  {
    slug: "hondenmand-sambo",
    name: "Hondenmand Sambo",
    category: "dog-beds",
    description: "Geef jouw hond een heerlijke plek om te rusten met deze comfortabele hondenmand. Deze zachte hondenbank combineert comfort, ondersteuning en een stijlvolle uitstraling. Dankzij de opstaande randen kan jouw hond zich veilig en geborgen voelen tijdens het slapen of ontspannen. Door het compacte formaat is deze hondenbank perfect geschikt voor kleine hondenrassen en pups. Verkrijgbaar in vier kleuren die mooi passen binnen moderne interieurs.",
    shortDescription: "Zachte hondenbank met opstaande rand, 65 x 42 cm, in vier kleuren.",
    features: [
      "Zacht en comfortabel: ideaal voor slapen, rusten en ontspannen.",
      "Opstaande randen: bieden ondersteuning voor hoofd en nek.",
      "Geborgen gevoel: helpt honden zich veilig en comfortabel te voelen.",
      "Compact formaat: perfect voor kleine honden en pups.",
      "Stijlvol design: past mooi in woonkamer, slaapkamer of keuken.",
    ],
    badge: 'bestseller',
    variants: [
      {
        id: "9300000318772256",
        label: "Grijs",
        price: 99.99,
        bolUrl: "https://www.bol.com/nl/p/-/9300000318772256",
        specs: { "Afmetingen": "65 x 42 cm", "Materiaal": "zachte stof" },
        image: "/assets/products/9300000318772256/img_1.jpg",
        images: Array.from({ length: 4 }, (_, i) => `/assets/products/9300000318772256/img_${i + 1}.jpg`),
      },
      {
        id: "9300000318798778",
        label: "Taupe",
        price: 99.99,
        bolUrl: "https://www.bol.com/nl/p/-/9300000318798778",
        specs: { "Afmetingen": "65 x 42 cm", "Materiaal": "zachte stof" },
        image: "/assets/products/9300000318798778/img_1.jpg",
        images: Array.from({ length: 4 }, (_, i) => `/assets/products/9300000318798778/img_${i + 1}.jpg`),
      },
      {
        id: "9300000318786059",
        label: "Mosgroen",
        price: 99.99,
        bolUrl: "https://www.bol.com/nl/p/-/9300000318786059",
        specs: { "Afmetingen": "65 x 42 cm", "Materiaal": "zachte stof" },
        image: "/assets/products/9300000318786059/img_1.jpg",
        images: Array.from({ length: 4 }, (_, i) => `/assets/products/9300000318786059/img_${i + 1}.jpg`),
      },
      {
        id: "9300000318667619",
        label: "Groen",
        price: 99.99,
        bolUrl: "https://www.bol.com/nl/p/-/9300000318667619",
        specs: { "Afmetingen": "65 x 42 cm", "Materiaal": "zachte stof" },
        image: "/assets/products/9300000318667619/img_1.jpg",
        images: Array.from({ length: 4 }, (_, i) => `/assets/products/9300000318667619/img_${i + 1}.jpg`),
      },
    ],
  },
  {
    slug: "hondenmand-lounge",
    name: "Hondenmand Lounge",
    category: "dog-beds",
    description: "Geef jouw hond een ruime, comfortabele en stijlvolle rustplek met deze luxe hondenlounge van circa 110 x 75 cm. Deze extra grote hondenmand is ontworpen voor optimaal ligcomfort en ondersteuning. Dankzij de zachte vulling en verhoogde randen kan jouw hond heerlijk ontspannen, slapen en uitrusten. De comfortabele loungevorm biedt voldoende ruimte om languit te liggen of lekker op te krullen. De moderne grijze stof zorgt voor een luxe uitstraling die perfect past in ieder interieur.",
    shortDescription: "Ruime loungemand voor middelgrote en grote honden, circa 110 x 75 cm.",
    features: [
      "Extra ruim ligoppervlak: met circa 110 x 75 cm biedt deze hondenlounge veel ruimte voor middelgrote en grote honden.",
      "Comfortabele ondersteuning: de zachte vulling en verhoogde randen ondersteunen lichaam, nek en hoofd.",
      "Warm en knus: perfect voor honden die graag comfortabel en veilig liggen.",
      "Stijlvol design: de moderne grijze uitstraling past mooi in vrijwel elk interieur.",
      "Praktisch in gebruik: lichtgewicht ontwerp en eenvoudig schoon te houden.",
    ],
    variants: [
      {
        id: "9300000287813948",
        label: "110 x 75 cm, Grijs",
        price: 49.99,
        bolUrl: "https://www.bol.com/nl/p/-/9300000287813948",
        specs: { "Afmetingen": "circa 110 x 75 cm", "Materiaal": "zachte stof met vulling" },
        image: "/assets/products/9300000287813948/img_1.jpg",
      },
    ],
  },
  {
    slug: "hondenmand-donut",
    name: "Hondenmand Donut",
    category: "dog-beds",
    description: "Geef jouw hond een warme, veilige en comfortabele slaapplek met deze zachte ronde hondenmand. Deze luxe donut hondenmand is ontworpen voor optimaal comfort en ondersteuning. Dankzij de zachte opstaande rand voelt jouw hond zich veilig en geborgen tijdens het slapen en ontspannen. De dikke pluche bekleding zorgt voor extra warmte en comfort. De ronde vorm ondersteunt een natuurlijke slaaphouding en maakt deze mand perfect voor honden die graag opkrullen tijdens het slapen. Verkrijgbaar in twee maten.",
    shortDescription: "Zachte pluche donutmand, wasbaar, in twee maten.",
    features: [
      "Ultiem comfort: zachte pluche stof en dikke vulling zorgen voor een heerlijk comfortabele ligplek.",
      "Veilig en geborgen gevoel: de verhoogde randen geven ondersteuning aan hoofd en nek.",
      "Warm en knus: ideaal voor koudere dagen of honden die houden van een zachte slaapomgeving.",
      "Praktisch in gebruik: lichtgewicht ontwerp en eenvoudig schoon te houden.",
    ],
    variants: [
      {
        id: "9300000288696966",
        label: "80 cm",
        price: 49.99,
        bolUrl: "https://www.bol.com/nl/p/-/9300000288696966",
        specs: { "Afmetingen": "circa 80 x 80 x 23 cm", "Materiaal": "zachte pluche stof", "Kleur": "grijs" },
        image: "/assets/products/9300000288696966/img_1.jpg",
        images: Array.from({ length: 6 }, (_, i) => `/assets/products/9300000288696966/img_${i + 1}.jpg`),
      },
      {
        id: "9300000288771332",
        label: "90 cm",
        price: 64.99,
        bolUrl: "https://www.bol.com/nl/p/-/9300000288771332",
        specs: { "Afmetingen": "circa 90 x 90 x 23 cm", "Materiaal": "zachte pluche stof", "Kleur": "beige" },
        image: "/assets/products/9300000288771332/img_1.jpg",
        images: Array.from({ length: 6 }, (_, i) => `/assets/products/9300000288771332/img_${i + 1}.jpg`),
      },
    ],
  },
  {
    slug: "achterbankbeschermer-auto",
    name: "Achterbankbeschermer Auto",
    category: "dog-travel",
    description: "Neem jouw hond veilig en comfortabel mee op reis met deze praktische achterbankbeschermer voor de auto. Deze stevige hondendeken beschermt de achterbank tegen haren, modder, vocht en krassen. Dankzij het grote formaat van 145 x 150 cm is vrijwel de volledige achterbank beschermd. De autodeken is eenvoudig te bevestigen aan de hoofdsteunen en beschikt over openingen voor veiligheidsgordels, plus praktische opbergvakken. Deze set wordt geleverd met een handige drinkfles en opvouwbare voer- en drinkbak voor onderweg.",
    shortDescription: "Waterdichte achterbankbeschermer, 145 x 150 cm, inclusief drinkfles en opvouwbare bak.",
    features: [
      "Optimale bescherming: beschermt de achterbank tegen haren, vuil, modder, vocht en krassen.",
      "Groot formaat: met een afmeting van 145 x 150 cm wordt vrijwel de volledige achterbank afgedekt.",
      "Inclusief reisaccessoires: wordt geleverd met een drinkfles en opvouwbare voer- en drinkbak.",
      "Veilig onderweg: voorzien van openingen voor veiligheidsgordels.",
      "Praktische opbergvakken: handige vakken voor snacks, speelgoed en riemen.",
    ],
    variants: [
      {
        id: "9300000304598169",
        label: "145 x 150 cm",
        price: 34.99,
        bolUrl: "https://www.bol.com/nl/p/-/9300000304598169",
        specs: { "Afmetingen": "145 x 150 cm", "Kleur": "zwart" },
        image: "/assets/products/9300000304598169/img_1.jpg",
        images: Array.from({ length: 9 }, (_, i) => `/assets/products/9300000304598169/img_${i + 1}.jpg`),
      },
    ],
  },
  {
    slug: "opvouwbaar-hondenzwembad",
    name: "Opvouwbaar Hondenzwembad",
    category: "dog-outdoor",
    description: "Geef jouw hond verkoeling tijdens warme zomerdagen met dit praktische opvouwbare hondenzwembad. Dit ronde hondenzwembad is voorzien van een antislipbodem en is eenvoudig op te zetten zonder pomp of ingewikkelde montage. Na gebruik vouw je het zwembad eenvoudig op, waardoor het weinig ruimte inneemt tijdens opslag. De antislipbodem helpt jouw hond veilig in en uit het bad te stappen. Verkrijgbaar in drie maten.",
    shortDescription: "Opvouwbaar zwembad zonder pomp, met antislipbodem, in drie maten.",
    features: [
      "Verkoeling op warme dagen: ideaal voor afkoeling tijdens de zomer.",
      "Antislipbodem: extra grip voor veilig gebruik.",
      "Opvouwbaar ontwerp: snel op te zetten en compact op te bergen.",
      "Geen pomp nodig: direct klaar voor gebruik.",
    ],
    variants: [
      {
        id: "9300000318895992",
        label: "80 cm",
        price: 37.95,
        bolUrl: "https://www.bol.com/nl/p/-/9300000318895992",
        specs: { "Diameter": "80 cm", "Vorm": "rond", "Kleur": "blauw" },
        image: "/assets/products/9300000318895992/img_1.jpg",
        images: Array.from({ length: 8 }, (_, i) => `/assets/products/9300000318895992/img_${i + 1}.jpg`),
      },
      {
        id: "9300000318956812",
        label: "120 cm",
        price: 39.95,
        bolUrl: "https://www.bol.com/nl/p/-/9300000318956812",
        specs: { "Diameter": "120 cm", "Vorm": "rond", "Kleur": "blauw" },
        image: "/assets/products/9300000318956812/img_1.jpg",
        images: Array.from({ length: 8 }, (_, i) => `/assets/products/9300000318956812/img_${i + 1}.jpg`),
      },
      {
        id: "9300000318962700",
        label: "160 cm",
        price: 59.99,
        bolUrl: "https://www.bol.com/nl/p/-/9300000318962700",
        specs: { "Diameter": "160 cm", "Vorm": "rond", "Materiaal": "stevig PVC", "Kleur": "blauw" },
        image: "/assets/products/9300000318962700/img_1.jpg",
        images: Array.from({ length: 8 }, (_, i) => `/assets/products/9300000318962700/img_${i + 1}.jpg`),
      },
    ],
  },
  {
    slug: "koelmat-hond",
    name: "Zelfkoelende Koelmat voor Honden",
    category: "dog-outdoor",
    description: "Geef jouw hond verkoeling tijdens warme zomerdagen met deze zelfkoelende koelmat. De koelmat activeert automatisch zodra jouw hond erop gaat liggen en biedt een aangename koele ligplek zonder water, elektriciteit of een vriezer. Ideaal voor thuis, in de bench, onderweg of tijdens vakanties. Dankzij het duurzame en waterafstotende oppervlak is de mat eenvoudig schoon te maken en geschikt voor dagelijks gebruik. Verkrijgbaar in twee formaten.",
    shortDescription: "Zelfkoelende koelmat voor honden, in twee formaten. Geen water of stroom nodig.",
    features: [
      "Automatisch verkoelend: geen water, stroom of vriezer nodig.",
      "Comfortabel tijdens warme dagen: helpt oververhitting te verminderen.",
      "Waterafstotend oppervlak: eenvoudig schoon te maken.",
      "Lichtgewicht & opvouwbaar: gemakkelijk mee te nemen.",
    ],
    variants: [
      {
        id: "9300000327606365",
        label: "30 x 40 cm",
        price: 29.95,
        bolUrl: "https://www.bol.com/nl/nl/p/zelfkoelende-koelmat-voor-honden-verkoelende-ligmat-zomer-mat-30x40-cm/9300000327606365/",
        specs: { "Afmetingen": "30 x 40 cm", "Kleur": "Blauw", "Zelfkoelend": "ja", "Waterafstotend": "ja", "Opvouwbaar": "ja" },
        image: "/assets/products/9300000327606365/img_1.jpg",
        images: Array.from({ length: 11 }, (_, i) => `/assets/products/9300000327606365/img_${i + 1}.jpg`),
        video: "/assets/products/9300000327606365/video.mp4",
      },
      {
        id: "9300000327599671",
        label: "65 x 50 cm",
        price: 34.99,
        bolUrl: "https://www.bol.com/nl/nl/p/koelmat-hond-s-zelfkoelende-koelmat-voor-honden-verkoelende-ligmat-zomer-mat-40x50-cm/9300000327599671/",
        specs: { "Afmetingen": "65 x 50 cm", "Kleur": "Blauw", "Zelfkoelend": "ja", "Waterafstotend": "ja", "Opvouwbaar": "ja" },
        image: "/assets/products/9300000327599671/img_1.jpg",
        images: Array.from({ length: 7 }, (_, i) => `/assets/products/9300000327599671/img_${i + 1}.jpg`),
      },
    ],
  },
  {
    slug: "koelmat-kat",
    name: "Zelfkoelende Koelmat voor Katten",
    category: "cat-outdoor",
    description: "Geef jouw kat een heerlijke verkoelende ligplek tijdens warme zomerdagen met deze zelfkoelende koelmat. De koelmat activeert automatisch zodra jouw kat erop gaat liggen en zorgt voor een aangenaam verkoelend effect zonder water, elektriciteit of een vriezer. Perfect voor warme dagen in huis, op vakantie of onderweg. De compacte afmeting maakt deze koelmat ideaal voor katten, kittens en andere kleine huisdieren.",
    shortDescription: "Zelfkoelende koelmat voor katten, 30 x 40 cm. Geen water of stroom nodig.",
    features: [
      "Automatisch verkoelend: geen water, stroom of vriezer nodig.",
      "Comfortabel tijdens warme dagen: helpt jouw kat aangenaam koel te blijven.",
      "Waterafstotend oppervlak: eenvoudig schoon te maken.",
      "Lichtgewicht & opvouwbaar: makkelijk mee te nemen en op te bergen.",
    ],
    variants: [
      {
        id: "9300000327644587",
        label: "30 x 40 cm",
        price: 39.99,
        bolUrl: "https://www.bol.com/nl/nl/p/koelmat-kat-zelfkoelende-koelmat-voor-katten-verkoelende-ligmat-zomer-mat-30x40-cm/9300000327644587/",
        specs: { "Afmetingen": "30 x 40 cm", "Kleur": "Blauw", "Zelfkoelend": "ja", "Waterafstotend": "ja", "Opvouwbaar": "ja" },
        image: "/assets/products/9300000327644587/img_1.jpg",
        images: Array.from({ length: 10 }, (_, i) => `/assets/products/9300000327644587/img_${i + 1}.jpg`),
        video: "/assets/products/9300000327644587/video.mp4",
      },
    ],
  },
  {
    slug: "luxe-hondentuig",
    name: "Luxe Hondentuig",
    category: "dog-accessories",
    description: "Ga veilig en comfortabel op pad met dit luxe hondentuig in blauw. Dit premium harnas is ontworpen voor middelgrote honden en biedt een combinatie van comfort, controle en duurzaamheid. Dankzij het verstelbare ontwerp (55-80 cm borstomvang) sluit het tuig nauw aan op het lichaam van je hond zonder te knellen. Het stevige nylon materiaal en de metalen D-ring zorgen voor een veilige bevestiging van de lijn, en de anti-trek werking geeft extra controle tijdens wandelen en training. Met de praktische kliksluiting trek je het tuig snel aan en uit.",
    shortDescription: "Verstelbaar anti-trek harnas van premium nylon, 55-80 cm, voor middelgrote honden.",
    features: [
      "Perfect verstelbaar: geschikt voor honden met een borstomvang van 55-80 cm.",
      "Comfortabel ontwerp: zachte pasvorm voorkomt schuren en irritatie.",
      "Stevig en duurzaam: gemaakt van hoogwaardig premium nylon, bandbreedte 25 mm.",
      "Veilige kliksluiting: snel en eenvoudig aan en uit te trekken.",
      "Anti-trek werking: meer controle tijdens wandelen en training.",
    ],
    variants: [
      {
        id: "9300000271335255",
        label: "Blauw, verstelbaar 55-80 cm",
        price: 19.99,
        bolUrl: "https://www.bol.com/nl/nl/p/luxe-hondentuig-blauw-verstelbaar-55-80-cm-comfortabel-anti-trek-harnas-25-mm-premium-nylon-voor-middelgrote-honden/9300000271335255/",
        specs: { "Verstelbaar": "55 - 80 cm borstomvang", "Bandbreedte": "25 mm", "Materiaal": "nylon", "Sluiting": "kliksluiting", "Kleur": "blauw" },
        image: "/assets/products/9300000271335255/img_1.jpg",
        images: ["/assets/products/9300000271335255/img_1.jpg", "/assets/products/9300000271335255/img_2.jpg"],
      },
    ],
  },
  {
    slug: "hondenjas",
    name: "Hondenjas",
    category: "dog-clothing",
    description: "Bescherm je hond tijdens koude en natte wandelingen met deze comfortabele hondenjas. De jas is ontworpen voor gebruik tijdens frisse en koude dagen en helpt je hond te beschermen tegen regen, wind en kou. De buitenzijde is geschikt voor gebruik bij nat en winderig weer, terwijl de zachte fleecevoering zorgt voor extra warmte en comfort. Een reflecterende strook op de rug zorgt voor betere zichtbaarheid tijdens avond- en ochtendwandelingen. Verkrijgbaar in twee lengtes; meet altijd eerst de ruglengte van je hond voor de juiste maat.",
    shortDescription: "Waterdichte, winddichte winterjas met fleecevoering en reflecterende strook, in twee maten.",
    features: [
      "Waterdicht en windbestendig: beschermt tegen regen, wind en kou.",
      "Zachte en warme fleecevoering: voor extra comfort tijdens koude dagen.",
      "Reflecterende strook op de rug: voor betere zichtbaarheid in het donker.",
      "Praktische ritssluiting op de rug: makkelijk aan- en uittrekken.",
    ],
    variants: [
      {
        id: "9300000386568309",
        label: "25 cm",
        price: 39.99,
        bolUrl: "https://www.bol.com/nl/nl/p/hondenjas-25-cm-waterdicht-windbestendig-winterjas-kleine-hond-chihuahua-reflecterend/9300000386568309/",
        specs: { "Jaslengte": "25 cm", "Materiaal voering": "fleece", "Sluiting": "rits op de rug", "Waterdicht": "ja", "Windbestendig": "ja", "Reflecterend": "ja" },
        image: "/assets/products/9300000386568309/img_1.jpg",
        images: Array.from({ length: 9 }, (_, i) => `/assets/products/9300000386568309/img_${i + 1}.jpg`),
      },
      {
        id: "9300000386598590",
        label: "35 cm",
        price: 41.99,
        bolUrl: "https://www.bol.com/nl/nl/p/hondenjas-35-cm-middelgrote-hond-beagle-waterdicht-windbestendig-warme-winterjas-reflecterend/9300000386598590/",
        specs: { "Jaslengte": "35 cm", "Materiaal voering": "fleece", "Sluiting": "rits op de rug", "Waterdicht": "ja", "Windbestendig": "ja", "Reflecterend": "ja" },
        image: "/assets/products/9300000386598590/img_1.jpg",
        images: Array.from({ length: 11 }, (_, i) => `/assets/products/9300000386598590/img_${i + 1}.jpg`),
      },
    ],
  },
  {
    slug: "kattenjas",
    name: "Kattenjas",
    category: "cat-clothing",
    description: "Geef je kat extra warmte en bescherming tijdens koude en natte dagen met deze kattenjas. De jas is voorzien van een zachte fleecevoering en een buitenzijde die beschermt tegen regen en wind, met een reflecterende strook voor betere zichtbaarheid in het donker. Verkrijgbaar in een uitvoering speciaal voor naaktkatten zoals de Sphynx - die geen vacht hebben om hen tegen kou te beschermen - en een uitvoering voor katten met vacht die tijdens de koudere maanden extra bescherming kunnen gebruiken. Meet altijd eerst de ruglengte van je kat, gemeten vanaf de nek tot aan de staartaanzet, voor de juiste pasvorm.",
    shortDescription: "Waterdichte, winddichte kattenjas met fleecevoering, ruglengte 25 cm.",
    features: [
      "Waterdicht en windbestendig: beschermt tegen regen en wind.",
      "Zachte fleecevoering: voor een comfortabele, warme laag.",
      "Reflecterende strook: voor betere zichtbaarheid in het donker.",
      "Ruglengte 25 cm: meet je kat vooraf voor de beste pasvorm.",
    ],
    variants: [
      {
        id: "9300000386622845",
        label: "Voor naaktkatten, zoals Sphynx",
        price: 39.99,
        bolUrl: "https://www.bol.com/nl/nl/p/kattenjas-25-cm-winterjas-voor-naaktkat-sphynx-kat-warm-waterdicht-windbestendig-reflecterend/9300000386622845/",
        specs: { "Ruglengte": "25 cm", "Materiaal voering": "fleece", "Waterdicht": "ja", "Windbestendig": "ja", "Reflecterend": "ja", "Speciaal voor": "naaktkatten / haarloze katten" },
        image: "/assets/products/9300000386622845/img_1.jpg",
        images: Array.from({ length: 10 }, (_, i) => `/assets/products/9300000386622845/img_${i + 1}.jpg`),
      },
      {
        id: "9300000386611069",
        label: "Voor katten met vacht",
        price: 39.99,
        bolUrl: "https://www.bol.com/nl/nl/p/kattenjas-25-cm-winterjas-kat-warme-katten-kleding-waterdicht-windbestendig-reflecterend/9300000386611069/",
        specs: { "Ruglengte": "25 cm", "Materiaal voering": "fleece", "Waterdicht": "ja", "Windbestendig": "ja", "Reflecterend": "ja" },
        image: "/assets/products/9300000386611069/img_1.jpg",
        images: Array.from({ length: 11 }, (_, i) => `/assets/products/9300000386611069/img_${i + 1}.jpg`),
      },
    ],
  },
]

export const categories: Category[] = [
  {
    id: 'dog-feeding',
    name: 'Dog Bowls',
    slug: 'dog-bowls',
    description: 'Verhoogde voerbakken, mangohout bakken en dubbele metalen voerbakken voor elke hond.',
    image: '/assets/images/feeding-hero.jpg',
  },
  {
    id: 'cat-feeding',
    name: 'Cat Bowls',
    slug: 'cat-bowls',
    description: 'Stijlvolle mangohout en metalen voerstations speciaal voor katten.',
    image: '/assets/images/feeding-hero.jpg',
  },
  {
    id: 'dog-beds',
    name: 'Dog Beds',
    slug: 'dog-beds',
    description: 'Van pluche donut manden tot de structurele Sambo mand en een ruim loungebed, een knusse plek voor elke hond.',
    image: '/assets/images/lifestyle-hero.jpg',
  },
  {
    id: 'dog-travel',
    name: 'Dog Travel',
    slug: 'dog-travel',
    description: 'Alles voor onderweg met je hond: autodekens, tuigjes en meer.',
    image: '/assets/images/travel-hero.jpg',
  },
  {
    id: 'dog-outdoor',
    name: 'Dog Pools & Cooling',
    slug: 'dog-pools',
    description: 'Opvouwbare zwembaden en zelfkoelende mats om je hond koel te houden in de zomer.',
    image: '/assets/images/lifestyle-hero.jpg',
  },
  {
    id: 'cat-outdoor',
    name: 'Cat Cooling',
    slug: 'cat-cooling',
    description: 'Zelfkoelende mats voor katten, geen water of stroom nodig.',
    image: '/assets/images/lifestyle-hero.jpg',
  },
  {
    id: 'dog-clothing',
    name: 'Dog Clothing',
    slug: 'dog-clothing',
    description: 'Waterdichte, winddichte hondenjassen met fleecevoering voor koude en natte wandelingen.',
    image: '/assets/products/9300000386598590/img_1.jpg',
  },
  {
    id: 'dog-accessories',
    name: 'Dog Accessories',
    slug: 'dog-accessories',
    description: 'Verstelbare anti-trek harnassen voor veilige en comfortabele wandelingen.',
    image: '/assets/products/9300000271335255/img_1.jpg',
  },
  {
    id: 'cat-clothing',
    name: 'Cat Clothing',
    slug: 'cat-clothing',
    description: 'Warme, waterdichte kattenjassen, ook speciaal voor naaktkatten zoals de Sphynx.',
    image: '/assets/products/9300000386622845/img_1.jpg',
  },
]

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category)
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function startingPrice(product: Product): number {
  return Math.min(...product.variants.map((v) => v.price))
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.badge === 'bestseller').slice(0, 4)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

/**
 * Looks up a variant by its id, together with the product it belongs to.
 * Used by the checkout API to resolve authoritative prices server-side -
 * never trust a price sent by the client.
 */
export function getVariantById(
  variantId: string
): { product: Product; variant: ProductVariant } | undefined {
  for (const product of products) {
    const variant = product.variants.find((v) => v.id === variantId)
    if (variant) return { product, variant }
  }
  return undefined
}
