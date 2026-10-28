# Bilder: die Bildsprache der Beiträge auf der Website

Die Website zeigt an festen Plätzen Fotos in der Bildsprache der Instagram-Beiträge: **ein Tier oder ein Astronaut tut etwas
Menschliches rund ums Fenster**, fotorealistisch, in einem warmen, modernen Wohnraum mit großem Fenster, Licht wie am späten
Nachmittag. Das Bild erzählt die Aussage der Seite (messen, wählen, vergleichen), der Text daneben bleibt sachlich. Die beiden
Startbilder der Startseite laufen wie in den Beiträgen randlos in den dunklen Grund aus; alle anderen Fotos liegen in einer Karte
mit Rand. Unten jeweils eine Reihe Haken-Chips; Fließtext steht nie auf dem sichtbaren Teil eines Fotos (docs/GESTALTUNG.md).

## So kommen die Fotos auf die Seite

1. Bild erzeugen (Prompt unten; Bildgenerator nach Wahl, etwa der, mit dem die Beiträge entstanden sind), mindestens 1.200 × 1.500 px
   (4:5) bzw. 1.600 × 1.000 px (16:10). Das Bild wird mittig auf das Format beschnitten; das Motiv gehört in die Mitte, unten bleibt
   Platz für die Chips.
2. Datei nach `fotos-roh/<name>.jpg` (oder .png, .webp) legen; der Ordner bleibt außerhalb von Git.
3. `python3 scripts/fotos.py` erzeugt `web/bilder/foto/<name>.webp` in der richtigen Größe (WebP, Qualität 82, etwa 100 bis 250 KB).
4. Einchecken und veröffentlichen. Die Seiten verweisen schon auf die Dateien; bis dahin steht dort ein neutraler Platzhalter ohne Text (dunkle Fläche, Fenster, Licht am Boden), damit Besucher weder „Foto folgt“ noch Dateipfade sehen. Nur die Platzhalter neu schreiben, ohne echte Fotos anzufassen: `python3 scripts/fotos.py` erzeugt sie nur dort, wo noch keine Datei liegt; `--platzhalter` überschreibt alle Plätze, auch echte Fotos.

Für die beiden Startbilder der Startseite gilt: Das Foto wird nicht in eine Karte gesetzt, sondern per CSS beschnitten und an den
Rändern ausgeblendet. Das Motiv steht darum am besten in der Mitte oder rechts davon, links und unten darf Raum sein, der im
Dunkel verschwindet; wichtige Dinge (Gesicht, Werkzeug, Fenster) nicht an den Rand.

Die drei Motive aus den Beiträgen können direkt wiederverwendet werden: der Waschbär auf dem Sofa (Beitrag „Wünsche antippen.“)
→ `app-start`, der Astronaut („Aufmaß in 384.400 km.“) → `fuer-fensterbauer` oder `fehler`, der Oktopus mit Kaffee an der Hebe-Schiebe-Tür
(„Auch ganz groß.“) → `gross`, der Oktopus mit Farbfächer (Reel „Acht Arme. Kein Plan.“) → `weg-auswaehlen`.

## Die Plätze

| Name | Format | Wo | Chips auf dem Foto | Priorität |
|---|---|---|---|---|
| `start-hauseigentuemer` | 1250 × 1250 | Startseite, Ansicht Hauseigentümer, randlos rechts hinter dem Text (Telefon: randlos ganz oben). **Da:** Waschbär auf dem Tritt an der Maueröffnung | Maße · Öffnungsart · Farbe · Glas | 1 |
| `start-fensterbauer` | 1120 × 1400 | Startseite, Ansicht Fensterbauer, randlos wie oben. **Da:** Bär in der Werkstatt mit Tablet | Maße · Fotos · Öffnungsarten · Positionen | 1 |
| `app-start` | 1120 × 1400 | App, Startbild vor dem ersten Fenster. **Da:** drei Waschbären im Wohnzimmer (fotografieren, wünschen, zurücklehnen) | Fotografieren · Messen · Wünschen | 1 |
| `gross` | 1200 × 1500 | Startseite Hauseigentümer, Abschnitt „Auch ganz groß.“ | Elementarten | 1 |
| `fb-sessel` | 1122 × 1402 | Seite /fuer-fensterbauer/, oben (Startbild, randlos; Telefon oben, Schreibtisch rechts). Astronaut im Sessel am Bullauge, misst das Fenster mit dem gelben Zollstock; Papierflieger, Handy und Bleistift schweben. **Da** (vom Inhaber, 23.10.2026). Seit dem Umbau mit fester Lage im Ausschnitt (Bilddetails in Bildpunkten im Kopf von `verkauf.css`); am Telefon liegt der Kopf tief im Bild (Augenlinie bei etwa 70 % statt 20–40 %), weil die Meldung oben über dem Flieger Platz braucht. Ein Nachfolger fürs Telefon: Kopf im oberen Drittel, oben links 240 × 110 px ruhige Fläche für die Meldung, Licht von rechts oben 4800–5800 K | Ihre Domain · Kunden planen selbst · PDF per E-Mail · Ihre Marke, Ihre Kunden (unter der Überschrift) | 1 |
| `tour-aufmassblatt-15` | 920 × 872 | Seite /fuer-fensterbauer/, Abschnitt „Was in jeder Anfrage steht“: die Szene mit dem echten Aufmaßblatt (erzeugt von `scripts/tour-bild.mjs` für die Führung; der Abzug 15 muss darum erhalten bleiben); antippbar, öffnet das Blatt groß | – | – |
| `beispiel/essential`, `beispiel/plus`, `beispiel/signature` | 640 × 400 | Seite /fuer-fensterbauer/, Paketkarten, Bereich „Beispiel · erfundener Betrieb“: echte Aufnahmen von Beispiel-Instanzen des erfundenen Betriebs Fensterbau Brandt (Gold #e3b75a), aufgenommen im Vorschau-Server mit `DATEN_ATTRAPPE=1` bei 1280 × 800 (`/__saat` mit den Instanzen brandt-e, brandt-p, brandt-s; Plus mit eigener Startseite, Signature im Dashboard mit drei eingeladenen Kunden); je unter 30 KB | – | – |
| `beispiel/start-telefon` | 600 × 1240 | Seite /fuer-fensterbauer/, Bühne „So funktioniert es“, Bildschirm 1, und am Telefon über der ersten Schrittkarte: die Startseite der Plus-Instanz von Fensterbau Brandt bei 390 × 806, zweifach | – | – |
| `fuer-fensterbauer` | 1200 × 1500 | nicht mehr eingebaut (früheres Startbild der Seite, Astronaut mit Zollstock); bleibt als Vorlage liegen | – | – |
| `ratgeber` | 1600 × 1000 | nicht mehr eingebaut (28.10.2026): Ratgeber in der Design-DNA zeigen statt Fotos die Zeichnungen der Seiten (Übersicht je Seite, „Nächster Schritt“ die der nächsten Seite); die Tierfotos gehören zur früheren Bildsprache | – | – |
| `weg-pruefen` | 1600 × 1000 | nicht mehr eingebaut (28.10.2026): Ratgeber in der Design-DNA zeigen statt Fotos die Zeichnungen der Seiten (Übersicht je Seite, „Nächster Schritt“ die der nächsten Seite); die Tierfotos gehören zur früheren Bildsprache | – | – |
| `weg-entscheiden` | 1600 × 1000 | nicht mehr eingebaut (28.10.2026): Ratgeber in der Design-DNA zeigen statt Fotos die Zeichnungen der Seiten (Übersicht je Seite, „Nächster Schritt“ die der nächsten Seite); die Tierfotos gehören zur früheren Bildsprache | – | – |
| `weg-auswaehlen` | 1600 × 1000 | nicht mehr eingebaut (28.10.2026): Ratgeber in der Design-DNA zeigen statt Fotos die Zeichnungen der Seiten (Übersicht je Seite, „Nächster Schritt“ die der nächsten Seite); die Tierfotos gehören zur früheren Bildsprache | – | – |
| `weg-ausmessen` | 1600 × 1000 | nicht mehr eingebaut (28.10.2026): Ratgeber in der Design-DNA zeigen statt Fotos die Zeichnungen der Seiten (Übersicht je Seite, „Nächster Schritt“ die der nächsten Seite); die Tierfotos gehören zur früheren Bildsprache | – | – |
| `weg-vergleichen` | 1600 × 1000 | nicht mehr eingebaut (28.10.2026): Ratgeber in der Design-DNA zeigen statt Fotos die Zeichnungen der Seiten (Übersicht je Seite, „Nächster Schritt“ die der nächsten Seite); die Tierfotos gehören zur früheren Bildsprache | – | – |
| `weg-einbauen` | 1600 × 1000 | nicht mehr eingebaut (28.10.2026): Ratgeber in der Design-DNA zeigen statt Fotos die Zeichnungen der Seiten (Übersicht je Seite, „Nächster Schritt“ die der nächsten Seite); die Tierfotos gehören zur früheren Bildsprache | – | – |
| `fehler` | 1600 × 1000 | nicht mehr eingebaut (28.10.2026): die Fehlerseite zeigt ein Fenster aus dem 3-D-Modell der App (`/bilder/start/reihe/trapez.webp`) auf einer Bühne | – | – |

## Prompts

Gemeinsamer Stil für alle Bilder, an jeden Prompt anhängen:

> Photorealistic advertising photograph, cozy modern living room with a large window, warm late-afternoon light, golden hour
> outside, shallow depth of field, 35 mm lens look, subtle film grain, cinematic but natural colour grading, highly detailed fur
> and textures, calm composition with the subject centred and some empty space at the bottom, no text, no logos, no watermark,
> no people. Aspect ratio 4:5. (für breite Plätze: 16:10)

Deutsch dazu, falls der Generator Deutsch besser versteht: „Fotorealistisches Werbefoto, gemütliches modernes Wohnzimmer mit
großem Fenster, warmes Licht am späten Nachmittag, goldene Stunde draußen, geringe Schärfentiefe, 35-mm-Look, leichtes Filmkorn,
natürliche Farben, ruhige Komposition, Motiv mittig, unten etwas Luft, kein Text, keine Logos, keine Menschen.“

| Name | Motiv (deutsch) | Prompt |
|---|---|---|
| `start-hauseigentuemer` | Ein Waschbär steht am Fenster und misst mit einem gelben Zollstock die Breite der Maueröffnung; das Handy lehnt am Fensterbrett. | A raccoon standing on a wooden stool at a living-room window, carefully measuring the width of the window opening with a yellow folding rule, concentrated expression, a smartphone leaning against the windowsill showing nothing in particular, tape of the folding rule stretched across the frame |
| `start-fensterbauer` | Astronaut misst ein Fenster aus, draußen der Mond (vorhandenes Bild) | An astronaut in a white spacesuit measuring a window with a yellow tape measure inside a cosy living room; through the window the grey lunar surface and the Earth rising in a black sky, warm lamp light inside |
| `app-start` | Waschbär auf dem Sofa tippt auf dem Handy (vorhandenes Bild) | A raccoon lounging on a beige sofa, holding a smartphone with both paws and tapping on the screen, relaxed, a big window with a garden behind |
| `gross` | Oktopus mit Kaffeetasse an der offenen Hebe-Schiebe-Tür (vorhandenes Bild) | A friendly orange octopus standing upright beside a wide open lift-and-slide patio door, holding a white coffee cup in one tentacle, another tentacle resting on the door frame, terrace and garden in golden light outside |
| `fuer-fensterbauer` | Ein Bernhardiner als Fensterbauer am Schreibtisch, prüft ein Aufmaß auf dem Tablet, im Hintergrund die Werkstatt mit Fensterrahmen | A Saint Bernard dog sitting at a workshop desk like a craftsman, wearing a work vest, looking at a tablet that shows a simple window drawing with dimensions, pencil behind the ear, window frames leaning against the wall of the bright workshop behind |
| `ratgeber` | Eule mit Lesebrille am Fenster liest auf dem Tablet | An owl wearing small round reading glasses perched on the back of an armchair by a window, reading attentively on a tablet, soft afternoon light, bookshelf blurred in the background |
| `weg-pruefen` | Katze prüft mit Taschenlampe eine beschlagene Scheibe | A tabby cat on a windowsill holding a small flashlight in its paw, inspecting a fogged-up window pane with condensation droplets, curious expression, morning light |
| `weg-entscheiden` | Fuchs am Küchentisch mit Taschenrechner und Fensterprospekt | A red fox sitting at a kitchen table with a calculator and a window brochure, chin resting on one paw, thinking, a window with garden view behind |
| `weg-auswaehlen` | Oktopus mit Farbfächer, Fensterprofilen und Handy (vorhandenes Bild aus dem Reel) | An orange octopus at a table holding a colour fan deck, a white window profile sample, a pencil and a smartphone in different tentacles, slightly overwhelmed but cheerful, bright living room |
| `weg-ausmessen` | Biber misst mit dem Zollstock eine Balkontür | A beaver standing in front of a floor-to-ceiling balcony door, measuring its height with a yellow folding rule, one paw at the top of the frame, concentrated, terrace outside in warm light |
| `weg-vergleichen` | Eule vergleicht mit der Lupe zwei Angebote | An owl at a desk by the window comparing two printed offers side by side through a magnifying glass, one talon on each sheet, serious expression, warm lamp light |
| `weg-einbauen` | Bär in Arbeitskleidung setzt ein Fenster ein | A brown bear in a craftsman's work jacket carefully setting a new white window frame into a brick wall opening from inside the room, a roll of sealing tape nearby, daylight through the opening |
| `fehler` | Katze sitzt in einem Fensterrahmen, der allein auf einer Wiese steht | A cat sitting calmly inside a single freestanding white window frame that stands alone in a green meadow, no wall around it, soft evening light, slightly surreal |

Hinweise zur Auswahl: Das Tier schaut nie in die Kamera wie ein Maskottchen, sondern tut etwas; ein Werkzeug je Bild (Zollstock,
Tablet, Lupe); nichts Gefährliches, keine Baustellenchaos-Szenen; die Fensterrahmen weiß oder anthrazit wie echte Fenster;
nichts, was wie ein Logo oder Text aussieht (der Generator schreibt sonst Kauderwelsch auf Tablets und Prospekte: dann ein Bild
ohne Bildschirm wählen oder den Bildschirm leer lassen).

## Technik

- WebP, 4:5 1.200 × 1.500 px (angezeigt bis 560 px breit, also scharf auf Bildschirmen mit doppelter Dichte), 16:10 1.600 × 1.000 px.
- `<img>` immer mit `width`, `height` und einem beschreibenden `alt` (ein Satz, was auf dem Bild passiert), `decoding="async"`;
  unter dem ersten Bildschirm `loading="lazy"`, das Startbild mit `fetchpriority="high"`.
- `/bilder/*` ist für die Bildersuche freigegeben (kein `noindex`); die Fotos stehen in den strukturierten Daten nicht als `image`,
  dort bleiben die Zeichnungen.
- Die Prüfsuite verlangt für Bilder in Ratgebern Breite, Höhe und einen Alternativtext ab 40 Zeichen; Fotos unter `/bilder/foto/`
  dürfen WebP sein, Zeichnungen bleiben SVG.
- Zeichnungen (`web/bilder/*.svg`, seit 28.10.2026): `python3 scripts/zeichnungen-dna.py` bringt sie in die Druckpalette der DNA, bettet
  je Datei eine Teilmenge von Outfit ein (ein SVG als `<img>` lädt keine Schrift der Seite, sonst erschiene Arial) und schreibt
  Kleinbilder ohne Schrift, gestrichelte Linien und Pfeilspitzen mit 2,2-mal so kräftigen Strichen nach `web/bilder/klein/` (für die
  Zeilen der Übersicht, 96 px breit). Ein zweiter Lauf ändert nichts. Braucht fontTools und brotli (`pip install fonttools brotli`).

## Plätze für die Fensterbauer-Seiten (Konfigurator-Pakete, Wunsch des Inhabers vom 23.10.2026)

Die Seiten für Fensterbauer (Verkaufsseite, Bestellformular, Kundenkonto) sind textlastig. Damit die Aufmerksamkeit hält, bekommt
jeder längere Abschnitt eine Bildkarte in derselben Bildsprache wie oben (ein Tier tut etwas Menschliches rund ums Fenster oder
um den Betrieb). Die Bilder liefert der Inhaber nach den Prompts unten; bis dahin stehen Platzhalter. Einbau danach in drei
Schritten: Platz in `scripts/fotos.py` (PLAETZE) eintragen, `python3 scripts/fotos.py` laufen lassen, `<figure class="foto-karte">`
an der genannten Stelle (Verkaufsseite in `web/fuer-fensterbauer/index.html`). Bestellung, Kundenbereich und Zentrale (seit 27.10.2026,
`web/assets/auftrag-ui.js`) zeigen die Seiten von Fensterbau Brandt und die Vorschau der eigenen Seite, keine weiteren Bilder. Auf den Instanzen der Betriebe (Plus, Signature) stehen nur die eigenen
Fotos des Betriebs, nie Bilder von eeziframes; Essential nutzt das eeziframes-Design und darf `app-start` wiederverwenden.

| Name | Format | Wo genau | Chips auf dem Foto | Priorität |
|---|---|---|---|---|
| `fb-anfrage` | 1600 × 1000 | Verkaufsseite, Abschnitt „Was in jeder Anfrage steht“ (`#was-in-jeder-anfrage-steht`), nach dem ersten Absatz, vor der Liste | Maße · Fotos · Zeichnung · Klärungsliste | 1 |
| `fb-kunden-planen` | Ihr Fachwissen im Wohnzimmer des Kunden, ohne hinzufahren: Vater und Tochter messen abends mit dem Handy, ein winziger Meister auf der Fensterbank zeigt, wo. Chips unter dem Foto (ohne Glas): Abends · Ohne Termin · Mit Anleitung; „5 Minuten je Fenster“ entfällt, bis es belegt ist (Bild vom Inhaber, 23.10.) | A cosy living room in the evening; a father and his young daughter hold a smartphone up toward their large window, and on the windowsill stands a tiny fifteen-centimetre-tall master window maker in his early fifties with a short grey beard and a dark blue work jacket, pointing with a yellow folding rule at the window frame as if giving instructions, the family looking at him with delight, warm lamp light |
| `fb-kundenschutz` | 1600 × 1000 | Verkaufsseite, Abschnitt „Ihre Kunden bleiben Ihre Kunden“, nach dem ersten Absatz. Seit dem 23.10.2026 nicht auf der Seite (kein Platzhalter mehr auf einer veröffentlichten Seite); kommt als Astronaut-Szene wieder, sobald das Bild da ist (Licht von rechts oben, Lampen aus, vor #161616) | Ihre Marke · Ihre Domain · Ihre Daten | 2 |
| `fb-pakete` | 1600 × 1000 | Verkaufsseite, direkt über den drei Paketkarten (`#pakete`) | Ihr Name · Ihre Farbe · Ihr Logo | 1 |
| `fb-ablauf` | 1600 × 1000 | Verkaufsseite, Abschnitt „Von der Bestellung bis zum Livegang“, vor der Schrittliste | Bestellen · Einrichten · Freigeben · Live | 2 |
| `fb-frage` | 1600 × 1000 | Verkaufsseite, Abschnitt „Bestellen oder anfragen“, neben dem Frageformular (1280 links vom Formular, Telefon darüber). Seit dem 23.10.2026 nicht auf der Seite, bis das Bild da ist; besser noch ein echtes Porträt des Inhabers (4:5, Fensterlicht von rechts oben) | Rückruf · Nachricht · Unverbindlich | 2 |
| `partner-live` | 1600 × 1000 | Kundenkonto, Hauptkarte im Stand „Live“, über dem Text | Live · Link für Ihre Website | 2 |
| `instanz-danke` | 1600 × 1000 | Essential-Instanz, Bestätigung nach dem Senden (Plus und Signature zeigen hier ein eigenes Foto des Betriebs, falls vorhanden, sonst nichts) | Gesendet · PDF für dich · Der Betrieb meldet sich | 3 |

Stil wie oben (gemeinsamer Prompt-Anhang), 16:10 für die breiten Plätze, 4:5 für `fb-kunden-planen` und `partner-start`.

Stil dieser zwölf Bilder (Wunsch des Inhabers vom 23.10.2026, wie die KI-Karussells): **ein Bild, eine Pointe.** Jedes Motiv stoppt den Blick,
zeigt einen Fehler oder macht Lust, surreal, aber fotorealistisch; nicht „Tier als Fensterbauer“. Menschen sind erlaubt. Eine wiederkehrende
Figur, der Meister, hält die Seite zusammen (wie im Ablauf der Karussells: Figur einmal erzeugen, in jede Szene montieren, „Keep the face
exactly as in image 2“). Kein Text, keine Schilder, keine Logos; das Motiv in die Mitte, unten Luft für die Chips.

Gemeinsamer Anhang (statt des Wohnzimmer-Stils oben):

> Photorealistic editorial photograph, cinematic, warm golden-hour light, shallow depth of field, 35 mm lens look, subtle film grain,
> natural colour grading, one clear idea in the centre of the frame, calm composition with some empty space at the bottom, no text,
> no signs, no logos, no watermark. Aspect ratio 4:5. (breite Plätze: Aspect ratio 16:10.)

Figur (einmal erzeugen, vor hellgrauem Studiohintergrund, ganz): *A German master window maker in his early fifties, short grey beard,
friendly tired eyes, dark blue work jacket with rolled-up sleeves, a yellow folding rule in the chest pocket, full body, neutral stance,
plain light grey studio background, photorealistic, no text.*

| Name | Pointe (deutsch) | Prompt (Szene; die Figur dazu montieren) |
|---|---|---|
| `fuer-fensterbauer` (Startbild, 4:5) | Der Kunde kann noch so weit weg sein, die Anfrage kommt an: Ein Astronaut misst in der Raumstation das runde Fenster, draußen die Erde, ein Papierflieger treibt zur Luke; links auf dem Bild trudeln derweil die Meldungskarten der Kunden ein (Overlay der Seite in HTML, nicht im Foto; der Astronaut gehört darum in die rechte Bildhälfte). (Wunsch des Inhabers: Astronaut; Variante mit dem Meister in der Werkstatt siehe Verlauf) | An astronaut in a white spacesuit floating weightlessly inside a space station module, measuring a round cupola window with a yellow folding rule in gloved hands, the Earth glowing blue outside the window, a smartphone drifting beside the helmet, and a white paper airplane floating away toward an open hatch, soft cool cabin light mixed with warm sunlight from the window, subject in the right half of the frame, the left third kept calm and dark (cabin wall) for overlay cards, empty space at the bottom |
| `fb-anfrage` | Raten ist kein Aufmaß: Die Glaskugel zeigt die Einbausituation. | A fortune teller's table in a craftsman's workshop, a glowing crystal ball showing a sharp miniature of a window opening with brick wall, roller shutter box and measurement lines inside it, the master window maker looking in with raised eyebrows, velvet cloth, candles |
| `fb-kunden-planen` | Termin um 9, Haus weg: Das Haus läuft auf Hühnerbeinen davon. | A small suburban house walking away on giant chicken legs down a quiet street at nine in the morning, the master window maker standing on the empty plot with a folding rule and a clipboard, looking after it, early light, slightly surreal but photorealistic |
| `fb-kundenschutz` | Ihre Kunden bleiben Ihre: Die Konkurrenz wartet draußen. | Inside a small window showroom in warm light the master window maker shakes hands with a young family; outside the glass door three wolves in grey business suits with briefcases wait in the rain and cannot get in, the door locked with a large old key, evening |
| `fb-pakete` | Drei Stufen, die dritte glänzt: Fenster wie bei einer Autopremiere. | A dark showroom with three white window frames presented like sports cars at a launch, each on its own podium under a spotlight; the first plain, the second with a warm brand-coloured frame, the third in brand colour with a golden crest and a velvet rope, visitors' silhouettes in the foreground |
| `fb-ablauf` | In Tagen statt Monaten: Mit Kreide gezeichnet, und es wird echt. | The master window maker drawing a window with white chalk on a bare plastered wall; the chalk lines are turning into a real white window with glass and a garden view behind it, halfway finished, dust in the light, hopeful |
| `fb-frage` | Rufen Sie an: Das alte Telefon springt vom Tisch. | An old red rotary telephone on a workbench ringing so hard it jumps into the air, sawdust and a folding rule flying up around it, the master window maker reaching for it from the side, bright workshop light, playful |
| `partner-live` | Eröffnung: Das rote Band fällt. | The master window maker cutting a red ribbon stretched across a giant freestanding window frame on a town square, confetti in the air, a small crowd clapping, morning sun, celebratory |
| `instanz-danke` | Gesendet: Der Flieger fliegt zum Betrieb. | A paper airplane leaving a living room through the open window toward the city at sunset, a relaxed homeowner on the sofa behind it with the phone face-down, the plane already far over the rooftops, warm light |

Umsetzung wie im Karussell-Ablauf: Hintergrund (Szene ohne Figur), Figur, Montage mit beiden Referenzbildern, Feinschliff auf mindestens
2160 × 2700 px (4:5) bzw. 2400 × 1500 px (16:10), dann in `fotos-roh/<name>.jpg` und `python3 scripts/fotos.py`. Die fünf Karussell-Motive
Wahrsagerin (`fb-anfrage`), Haus auf Hühnerbeinen (`fb-kunden-planen`) und Pantomime/Kreide (`fb-ablauf`) sind hier wiederverwendet; das
Laserlabor und der Bär im Wasserfall passen zur alten Abrechnung je Aufmaß und bleiben den Karussells vorbehalten.

Zweite Idee je Platz, falls das erste Motiv nicht gefällt (Wunsch des Inhabers vom 23.10.: je Prompt eine Alternative):

| Name | Pointe (deutsch) | Prompt (Szene; die Figur dazu montieren) |
|---|---|---|
| `fb-kundenschutz` | Unter Ihrer Glasglocke: Niemand fischt Ihre Kunden ab. | The master window maker gently placing a large glass bell jar over a miniature family standing at a tiny kitchen table with a tiny window frame, on a wooden workbench; around the jar a crowd of anonymous hands in grey suit sleeves holding clipboards and business cards press against the glass and cannot reach in, warm workshop light, the family inside relaxed |
| `fb-frage` | Ein Knopf, ein Rückruf. | A single oversized round red call button set into the brick wall of a tidy workshop, softly glowing; the master window maker's hand resting on it, inviting, the rest of the frame calm and empty, evening light through a window |

