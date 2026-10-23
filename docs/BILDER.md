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
| `fuer-fensterbauer` | 1200 × 1500 | Seite /fuer-fensterbauer/, oben | Maße · Fotos · Positionen · Bestellmaß | 1 |
| `ratgeber` | 1600 × 1000 | Übersicht /ratgeber/, über dem Weg | Prüfen · Entscheiden · Auswählen · Ausmessen · Vergleichen · Einbauen | 2 |
| `weg-pruefen` | 1600 × 1000 | Ratgeber, Schritt 1 (Übersicht; in den Seiten als Bild in „Nächster Schritt“) | – | 2 |
| `weg-entscheiden` | 1600 × 1000 | Ratgeber, Schritt 2 | – | 2 |
| `weg-auswaehlen` | 1600 × 1000 | Ratgeber, Schritt 3 | – | 2 |
| `weg-ausmessen` | 1600 × 1000 | Ratgeber, Schritt 4 | – | 2 |
| `weg-vergleichen` | 1600 × 1000 | Ratgeber, Schritt 5 | – | 2 |
| `weg-einbauen` | 1600 × 1000 | Ratgeber, Schritt 6 | – | 2 |
| `fehler` | 1600 × 1000 | Fehlerseite 404 | – | 3 |

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

## Plätze für die Fensterbauer-Seiten (Konfigurator-Pakete, Wunsch des Inhabers vom 23.10.2026)

Die Seiten für Fensterbauer (Verkaufsseite, Bestellformular, Kundenkonto) sind textlastig. Damit die Aufmerksamkeit hält, bekommt
jeder längere Abschnitt eine Bildkarte in derselben Bildsprache wie oben (ein Tier tut etwas Menschliches rund ums Fenster oder
um den Betrieb). Die Bilder liefert der Inhaber nach den Prompts unten; bis dahin stehen Platzhalter. Einbau danach in drei
Schritten: Platz in `scripts/fotos.py` (PLAETZE) eintragen, `python3 scripts/fotos.py` laufen lassen, `<figure class="foto-karte">`
an der genannten Stelle (Verkaufsseite in `web/fuer-fensterbauer/index.html`, Kundenkonto in `web/assets/partner.js` beim Zeichnen der
Seite). Die Zentrale bleibt ohne Bilder (Arbeitswerkzeug). Auf den Instanzen der Betriebe (Plus, Signature) stehen nur die eigenen
Fotos des Betriebs, nie Bilder von eeziframes; Essential nutzt das eeziframes-Design und darf `app-start` wiederverwenden.

| Name | Format | Wo genau | Chips auf dem Foto | Priorität |
|---|---|---|---|---|
| `fb-anfrage` | 1600 × 1000 | Verkaufsseite, Abschnitt „Was in jeder Anfrage steht“ (`#was-in-jeder-anfrage-steht`), nach dem ersten Absatz, vor der Liste | Maße · Fotos · Zeichnung · Klärungsliste | 1 |
| `fb-kunden-planen` | 1200 × 1500 | Verkaufsseite, Abschnitt „Warum Kunden selbst planen“, rechts neben dem Text (1280), am Telefon unter der Überschrift | Abends · Auf dem Sofa · Ohne Termin | 1 |
| `fb-kundenschutz` | 1600 × 1000 | Verkaufsseite, Abschnitt „Ihre Kunden bleiben Ihre Kunden“, nach dem ersten Absatz | Ihre Marke · Ihre Domain · Ihre Daten | 2 |
| `fb-pakete` | 1600 × 1000 | Verkaufsseite, direkt über den drei Paketkarten (`#pakete`) | Ihr Name · Ihre Farbe · Ihr Logo | 1 |
| `fb-ablauf` | 1600 × 1000 | Verkaufsseite, Abschnitt „Von der Bestellung bis zum Livegang“, vor der Schrittliste | Bestellen · Einrichten · Freigeben · Live | 2 |
| `fb-frage` | 1600 × 1000 | Verkaufsseite, Abschnitt „Bestellen oder anfragen“, neben dem Frageformular (1280 links vom Formular, Telefon darüber) | Rückruf · Nachricht · Unverbindlich | 2 |
| `partner-start` | 1200 × 1500 | Kundenkonto `/partner/`, Anmeldeseite vor der Code-Eingabe, rechts neben dem Text (1280), am Telefon oben | Essential · Plus · Signature | 1 |
| `partner-gestaltung` | 1600 × 1000 | Bestellformular, Schritt „Gestaltung“ (Plus, Signature), über den Feldern | Logo · Farbe · Fotos · Text | 2 |
| `partner-warten` | 1600 × 1000 | Kundenkonto, Hauptkarte in den Ständen „Bezahlt“, „In Einrichtung“, „Domain gesichert“, über dem Text | Wir richten ein · Vorschau · Freigabe | 2 |
| `partner-live` | 1600 × 1000 | Kundenkonto, Hauptkarte im Stand „Live“, über dem Text | Live · Link für Ihre Website | 2 |
| `instanz-danke` | 1600 × 1000 | Essential-Instanz, Bestätigung nach dem Senden (Plus und Signature zeigen hier ein eigenes Foto des Betriebs, falls vorhanden, sonst nichts) | Gesendet · PDF für dich · Der Betrieb meldet sich | 3 |

Stil wie oben (gemeinsamer Prompt-Anhang), 16:10 für die breiten Plätze, 4:5 für `fb-kunden-planen` und `partner-start`.

| Name | Motiv (deutsch) | Prompt |
|---|---|---|
| `fb-anfrage` | Ein Bernhardiner in Arbeitsweste sitzt in der Werkstatt am Tisch und hält ein frisch gedrucktes Aufmaßblatt mit einer einfachen Fensterzeichnung und Maßlinien; daneben ein Zollstock und eine Kaffeetasse. | A Saint Bernard dog in a craftsman's work vest sitting at a workshop table, holding a freshly printed sheet of paper that shows only a simple line drawing of a window with dimension lines, a yellow folding rule and a coffee mug beside it, window frames leaning against the wall behind |
| `fb-kunden-planen` | Eine Waschbär-Familie sitzt abends auf dem Sofa, der große Waschbär tippt auf dem Handy, zwei kleine schauen zu; draußen Dämmerung, Lampe an. | A raccoon family on a beige sofa in the evening, the adult raccoon tapping on a smartphone with both paws, two small raccoons leaning in curiously, a floor lamp switched on, dusk outside the large window, cosy and relaxed |
| `fb-kundenschutz` | Ein Bernhardiner steht hinter der Theke seines Ladens mit Fenstermustern an der Wand und reicht einem Waschbären die Pfote; draußen das Schaufenster. | A Saint Bernard dog behind the counter of a small window shop, white and anthracite window samples on the wall, shaking paws with a raccoon customer, the shop window and a quiet street in warm light behind them |
| `fb-pakete` | Ein Chamäleon sitzt auf einem Fensterrahmen und nimmt genau dessen Farbe an (warmes Gelb), daneben zwei weitere Rahmen in Weiß und Anthrazit. | A chameleon sitting on a window frame and perfectly matching its warm yellow colour, two more window frames in white and anthracite standing next to it in a bright showroom, the chameleon looking proud, soft daylight |
| `fb-ablauf` | Ein Bernhardiner und ein Biber stoßen an einem Schreibtisch mit Kaffeetassen an, zwischen ihnen ein Wandkalender mit wenigen markierten Tagen und ein weißer Fensterrahmen. | A Saint Bernard dog and a beaver clinking coffee mugs at an office desk, a wall calendar with a few marked days and a white window frame between them, afternoon light through a large office window, cheerful |
| `fb-frage` | Ein Elefant mit kleiner Lesebrille sitzt im Büro und hält den Telefonhörer mit dem Rüssel, auf dem Tisch ein Notizblock und ein Fensterprospekt. | An elephant wearing small round reading glasses sitting at an office desk, holding a telephone handset with its trunk, a notepad and a window brochure on the desk, warm lamp light, friendly |
| `partner-start` | Ein Bernhardiner steht stolz vor seiner Werkstatt, das Tor offen, drinnen Fensterrahmen, ein kleiner Lieferwagen davor; später Nachmittag. | A Saint Bernard dog standing proudly in front of its small window workshop, the gate open with white window frames visible inside, a small delivery van parked beside it, late-afternoon sun, no signs or lettering |
| `partner-gestaltung` | Ein Fuchs hält einen Farbfächer vor eine Wand mit drei Probeanstrichen (Gelb, Petrol, Grün), neben ihm Fotos auf dem Tisch. | A red fox holding a colour fan deck up against a wall with three painted test patches in yellow, teal and green, a few printed photographs lying on the table, bright studio-like living room, concentrated |
| `partner-warten` | Ein Faultier liegt entspannt in einer Hängematte am großen Fenster mit Kaffeetasse, draußen Garten; im Hintergrund arbeitet ein Biber an einem Fensterrahmen. | A sloth relaxing in a hammock by a large window with a coffee mug, a garden outside, in the blurred background a beaver carefully working on a white window frame, calm late-afternoon light |
| `partner-live` | Ein Bär in Arbeitsjacke öffnet feierlich die Glastür seines Ladens, Sonnenlicht fällt herein, drinnen Fenstermuster. | A brown bear in a craftsman's jacket ceremoniously opening the glass front door of a small window shop, sunlight streaming in, window samples visible inside, welcoming gesture, no signs or lettering |
| `instanz-danke` | Ein Waschbär lehnt sich zufrieden auf dem Sofa zurück, das Handy liegt auf dem Tisch, draußen Abendlicht. | A raccoon leaning back contentedly on a sofa with its paws behind its head, a smartphone lying face-down on the coffee table, warm evening light through the large window, job done |
